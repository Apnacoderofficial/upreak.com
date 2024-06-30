const db = rootRequire('app/models')
const fs = require('fs');
const { sendMessageToWhatsApp } = require('../../../utils/whatsAppSender');
const moment = require("moment");
const { createEvent, deleteEvent } = require('../../../utils/teamsMeeting');
const { sendSlotConfirmEmail, sendHRSlotConfirmEmail } = require('../../../utils/emailSender');

// Helper function to convert db.mainModel.execQuery to a promise-based function
function execQueryPromise(query) {
  return new Promise((resolve, reject) => {
    db.mainModel.execQuery(query, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

exports.get_book_slot = async (req, res) => {
  try {

    if (req.session.role === 'HR' || req.session.role === 'User') {
      let meetings;
      let booked_meetings;
      let not_booked_slot_count;
      let credit_data;
      let user_details;
      let booked_slot_count;

      if (req.session.role === 'HR') {
        // If the role is 'Master', find all meetings
        meetings = await db.meetings.findAll({
          where: {
            status: 'Not Booked',
          },
          attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'process_status'],
          raw: true
        });
        user_details = await db.responses.findAll({ raw: true });
        booked_meetings = await db.meetings.findAll({
          where: {
            alloted_HR: req.session.userid
          },
          attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'process_status'],
          order: [['id', 'DESC']],
          raw: true
        });
      } else if (req.session.role === 'User') {
        // If the role is 'User', find meetings based on user's email (req.session.userid)
        const credt_query = `SELECT email, SUM(credit) AS total_credit FROM payment_details WHERE email = '${req.session.userid}' GROUP BY email;`;
        const booked_query = `SELECT COUNT(*) AS num_booked_meetings FROM meetings WHERE email = '${req.session.userid}' AND status = 'Booked';`
        const not_booked_query = `SELECT COUNT(*) AS num_not_booked_meetings FROM meetings WHERE email = '${req.session.userid}' AND status = 'Not Booked';`;

        const [creditDataResult, bookedCountResult, notBookedCountResult, userMeetings, registered_user] = await Promise.all([
          execQueryPromise(credt_query),
          execQueryPromise(booked_query),
          execQueryPromise(not_booked_query),
          db.meetings.findAll({
            where: {
              email: req.session.userid
            },
            attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'process_status'],
            raw: true
          }),
          db.responses.findOne({ where: { application_id: req.session.application_id }, raw: true })
        ]);
        // Assuming execQueryPromise resolves with an array of results
        user_details = registered_user;
        credit_data = creditDataResult[0] ? creditDataResult[0].total_credit : 0;
        booked_slot_count = bookedCountResult[0] ? bookedCountResult[0].num_booked_meetings : 0;
        not_booked_slot_count = notBookedCountResult[0] ? notBookedCountResult[0].num_not_booked_meetings : 0;
        meetings = userMeetings;
      }
      res.render("/panel/book_slot", { locals: meetings, session: req.session, moment, booked_meetings, credit_data, booked_slot_count, not_booked_slot_count, user_details });
    } else {
      res.render("login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/error-500");
  }
};

exports.post_book_slot = async (req, res) => {
  session = req.session;
  if (req.session.role == 'User') {
    const title = req.body.title;
    const start_time = req.body.start;
    const end_time = req.body.end;
    const email = req.body.userEmail;

    try {
      const credt_query = `SELECT email, SUM(credit) AS total_credit FROM paymentdetails WHERE email = '${req.session.userid}' GROUP BY email;`;
      const booked_query = `SELECT COUNT(*) AS num_booked_meetings FROM meetings WHERE email = '${req.session.userid}' AND status = 'Booked';`
      const not_booked_query = `SELECT COUNT(*) AS num_not_booked_meetings FROM meetings WHERE email = '${req.session.userid}' AND status = 'Not Booked';`;

      const [creditDataResult, bookedCountResult, notBookedCountResult] = await Promise.all([
        execQueryPromise(credt_query),
        execQueryPromise(booked_query),
        execQueryPromise(not_booked_query),
      ]);
      credit_data = creditDataResult[0] ? parseInt(creditDataResult[0].total_credit) : 0;
      booked_slot_count = bookedCountResult[0] ? parseInt(bookedCountResult[0].num_booked_meetings) : 0;
      not_booked_slot_count = notBookedCountResult[0] ? parseInt(notBookedCountResult[0].num_not_booked_meetings) : 0;
      let score = credit_data - booked_slot_count - not_booked_slot_count;
      if (score > 0) {
        const meeting_id = 'c8230646-977d-418c-b850-2becb408151f' + Math.random().toString(36).substring(7);

        const newMeeting = {
          title: title,
          start_time: start_time,
          end_time: end_time,
          email: email,
          role: req.session.role,
          phone_number: req.session.phonenumber,
          alloted_HR: null,
          username: req.session.username,
          status: 'Not Booked',
          meeting_link: '',
          application_id: req.session.application_id,
          meeting_id: meeting_id,
          process_status: '0'
        };
        await db.meetings.create(newMeeting, { raw: true });
        await sendMessageToWhatsApp(`91${req.session.phonenumber}`, `Dear ${req.session.username}, Your Slot booking is in process.We will update you shortly.\n\nThanks And Regards, \nTeam Upreak`);
      }
      res.redirect("/panel/book_slot");
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.render("login");
  }
};

exports.accept_slot = async (req, res) => {
  session = req.session;
  const id = req.params.id;
  const application_id = req.query.application_id;
  if (req.session.role == 'HR') {
    try {

      let user_details = await db.meetings.findAll({
        where: {
          id: id
        },
        raw: true
      });

      const addEvent = await createEvent(new Date(user_details[0].start_time).toISOString().slice(0, -1), new Date(user_details[0].end_time).toISOString().slice(0, -1), user_details[0].username, user_details[0].email);
      if (addEvent.status == false) {
        console.error(addEvent.error);
        return res.redirect("/error-500");
      } else {
        const data = {
          status: 'Booked',
          alloted_HR: req.session.userid,
          hr_phone_number: req.session.phonenumber,
          meeting_id: addEvent.id,
          meeting_link: addEvent.joinUrl
        };

        await db.meetings.update(data, {
          where: {
            id: id,
            application_id: application_id,
            status: 'Not Booked'
          }, raw: true,
        });

        const start_time = moment(user_details[0].start_time).format("MM/DD/YYYY, h:mm:ss A");
        const end_time = moment(user_details[0].end_time).format("h:mm:ss A");

        let hr_details = await db.meetings.findAll({
          where: {
            id: id
          },
          raw: true
        });

        const promises = [
          sendMessageToWhatsApp(`91${user_details[0].phone_number}`, `Dear ${user_details[0].username}, \nYour Slot has been booked Successfully. \nMeting details: \nMeeting Time: ${start_time} to ${end_time},\nCandidate Email : ${user_details[0].email} \nThanks And Regards, \nTeam Upreak`),
          sendMessageToWhatsApp(`91${user_details[0].hr_phone_number}`, `Dear HR, \nYour selected slot has been booked Successfully. \nMeting details: \nMeeting Time: ${start_time} to ${end_time},\nCandidate Name : ${user_details[0].username} \nCandidate Application Id : ${user_details[0].application_id} \nThanks And Regards, \nTeam Upreak`),
          sendSlotConfirmEmail(hr_details[0].email, hr_details[0].username, hr_details[0].meeting_link, start_time, end_time),
          sendHRSlotConfirmEmail(hr_details[0].alloted_HR, hr_details[0].username, hr_details[0].phone_number, hr_details[0].meeting_link, start_time, end_time)
        ];

        await Promise.all(promises);

        // let meetings = await db.meetings.findAll({
        //   where: {
        //     status: 'Not Booked',
        //   },
        //   attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'process_status'],
        //   raw: true
        // });

        // let booked_meetings = await db.meetings.findAll({
        //   where: {
        //     alloted_HR : req.session.userid,
        //   },
        //   attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'process_status'],
        //   raw: true
        // });

        // // Convert Sequelize instances to plain JavaScript objects
        // // const locals = meetings.map(instance => instance.get({ plain: true }));
        // const locals = meetings;

        // res.render("/panel/book_slot", { locals, session , moment , booked_meetings});
        res.redirect("/panel/book_slot");
      }
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.render("login");
  }
};

exports.reschedule_slot = async (req, res) => {
  session = req.session;
  const id = req.params.id;
  if (req.session.role == 'HR' || req.session.role == 'User') {
    try {

      let user_details = await db.meetings.findAll({
        where: {
          id: id
        },
        raw: true
      });

      if (req.session.role == 'HR') {
        let removeEvent = await deleteEvent(user_details[0].meeting_id);

        if (removeEvent.status == false) {
          return res.redirect("/error-500");
        }

        await db.meetings.destroy({
          where: { id: id }
        })
        const promises = [
          sendMessageToWhatsApp(`91${user_details[0].phone_number}`, `Dear ${user_details[0].username}, Your Slot has been cancelled, kindly book another slot. \nThanks And Regards, \nTeam Upreak`)
        ];
        await Promise.all(promises);
      }
      if (req.session.role == 'User') {
        await db.meetings.destroy({
          where: { id: id }
        })
        const promises = [
          sendMessageToWhatsApp(`91${user_details[0].phone_number}`, `Dear ${user_details[0].username}, Your Slot has been cancelled, kindly book another slot. \nThanks And Regards, \nTeam Upreak`)
        ];
        await Promise.all(promises);
      }

      res.redirect("/panel/book_slot");
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.render("login");
  }
};

exports.meeting_details = async (req, res) => {

  if (req.session.role == 'User') {
    let locals;
    let user_Data = await db.responses.findAll({ where: { emailid: req.session.userid } });
    await db.meetings.findAll({ where: { email: req.session.userid } })
      .then(data => {
        locals = data;
        res.render("meeting_details", { locals: locals, user_Data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else
    res.render("login");
};

exports.purchase = async (req, res) => {

  try {
    const { code, merchantId, transactionId, providerReferenceId, merchantOrderId } = req.body;

    const amount = parseFloat(req.body.amount) / 100;
    const payment_details_data = {
      code,
      merchantId,
      transactionId,
      amount,
      providerReferenceId,
      merchantTransactionId: merchantOrderId,
      credit: 1
    };

    await Payment.update(payment_details_data, { where: { transactionId } });

    const details = await Payment.findOne({ where: { transactionId } });

    await sendMessageToWhatsApp(`91${details.phone}`, `Dear ${details.name}, Your Payment has been ${code == 'PAYMENT_SUCCESS' ? 'completed successfully' : 'failed'}. Trans id.: ${details.transactionId} Amount:Rs ${amount}. \n Thanks & Regards, \nTeam Upreak`);

    // if(code != 'PAYMENT_SUCCESS'){
    //   await sendMessageToWhatsApp(`91${details.phone}`, `Dear ${details.name}, Your Payment has been failed. Trans id.: ${details.transactionId} Amount:Rs ${amount} Thanks Upreak Team`);
    // } else  {
    //   await sendMessageToWhatsApp(`91${details.phone}`, `Dear ${details.name}, Your Payment has been completed successfully. Trans id.: ${details.transactionId} Amount:Rs ${amount} Thanks Upreak Team`);
    // } 
    res.redirect("/panel/book_slot");

  } catch (error) {
    console.error('Error saving payment:', error);
    res.redirect("/error-500");
  }
};

exports.get_payment_details = async (req, res) => {


  if (req.session.role) {
    var srole = req.session.role;
    await Payment.findAll()
      .then(data => {
        res.render("payment_detail", { locals: data, srole });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else
    res.render("login");
};

exports.save_payment_details = async (req, res) => {
  session = req.session;

  if (req.session.role == 'User') {
    try {
      if (!req.body || !req.body.product_amnt) {
        return res.status(400).send('Invalid request');
      }
      const merchantId = 'M' + Date.now(); // You can generate this differently if needed
      const amount = parseFloat(req.body.product_amnt) * 100;
      const event_payload = {
        merchantId: 'M1JCLOM3AVB7',
        merchantTransactionId: merchantId,
        merchantUserId: 'MUID123',
        amount: amount,
        redirectUrl: 'https://upreak.com/panel/buy_now_details',
        redirectMode: 'POST',
        callbackUrl: 'https://upreak.com/panel/buy_now_details',
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };

      const encoded_payload = Buffer.from(JSON.stringify(event_payload)).toString('base64');
      const saltKey = 'a8c7c067-8d0d-464d-8c32-bb36f2512be2';
      const saltIndex = 1;

      const string = encoded_payload + '/pg/v1/pay' + saltKey;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const finalXHeader = sha256 + '###' + saltIndex;

      const headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': finalXHeader,
      };

      // Use the sandbox URL for testing and the production URL for live transactions
      // Sandbox: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
      // Production: 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
      const phonePayUrl = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';

      const response = await axios.post(phonePayUrl, { request: encoded_payload }, { headers });

      const responseData = response.data;

      const responseDataString = JSON.stringify(responseData);
      let payment_details_data = {
        name: req.session.username,
        email: req.session.userid,
        phone: req.session.phonenumber,
        code: responseData.code,
        merchantId: responseData.data.merchantId,
        transactionId: responseData.data.merchantTransactionId,
        amount: amount / 100
      }
      await Payment.create(payment_details_data);
      if (responseData.data?.instrumentResponse?.redirectInfo?.url) {
        // Redirect the user to the PhonePe payment page

        // Define the path to the JSON file in the uploads folder
        const filePath = 'uploads/ResponsetData.json';

        // Write the JSON data to the file
        fs.writeFile(filePath, responseDataString, (err) => {
          if (err) {
            console.error('Error writing JSON file:', err);
          } else {
            console.log('JSON file saved successfully:', filePath);
          }
        });
        return res.redirect(responseData.data.instrumentResponse.redirectInfo.url);
      } else {
        return res.redirect(responseData.data.instrumentResponse.redirectInfo.url);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).send('Internal Server Error  ');
    }
  } else {
    res.redirect("/panel/login");
  }
};

exports.getTokenData = async (req, res) => {

  if (req.session.role == 'Master') {
    const tokenData = (await Token.findOne({ raw: true }));
    res.render("update_token", { tokenData });
  } else
    res.redirect("/panel/login");
};

exports.updateTokenData = async (req, res) => {

  if (req.session.role == 'Master') {
    if (!req.body.token) {
      res.redirect("/error-500");
      return;
    }
    await Token.update({ token: req.body.token }, { where: { id: req.body.id } });
  } else
    res.redirect("/panel/login");
};

exports.get_buy_now = async (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'User') {

    await db.products.findByPk(id)
      .then(data => {
        if (data) {
          res.render('buy_now', { locals: data, pay_status: "false" });
        } else {
          res.redirect("/panel/login");
        }
      })
      .catch(err => {
        res.redirect("/panel/login");
      });
  } else {
    res.redirect("/panel/login");
  }
};