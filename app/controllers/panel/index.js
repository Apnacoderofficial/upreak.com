const db = rootRequire('app/models')
const redisClient = rootRequire('config/redisClient');
const crypto = require('crypto');
const moment = require("moment");
const { Op } = require('sequelize');
const { sendPasswordEmail, sendTwoStepEmail } = require('../../utils/emailSender');
var { secureCookies, sessionLife } = rootRequire('config/config');

module.exports = {

  get_index: async (req, res) => {


    if (!req.session || !req.session.userid) {
      return res.redirect("/panel/login");
    }
    try {
      let referee_email = req.session.userid;
      let totalMeetingsAccepted = null, totalMeetingsCompleted = null, totalMeetingsCompletedCurrentMonth = null;
      const query = `
      SELECT 'blogs' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount FROM blogs
      UNION
      SELECT 'responses' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount FROM responses WHERE urole = 'User'
      UNION
      SELECT 'mou_students' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount FROM dash_logins WHERE role = 'User' AND createdby LIKE 'MOU_%'
      UNION
      SELECT 'mou_registrations' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount  FROM mou_registrations
      UNION
      SELECT 'questions' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount  FROM questions
      UNION
      SELECT 'dashlogins' AS TableName, 
          COUNT(CASE WHEN role = 'HR' THEN 1 END)::text AS RowCount,
          COUNT(CASE WHEN role = 'Admin' THEN 1 END)::text AS AdminCount,
          COUNT(CASE WHEN role = 'SubAdmin' THEN 1 END)::text AS SubadminCount
          FROM dash_logins;`;

      const qryData = await db.mainModel.execQuery(query);
      // new Promise((resolve, reject) => {
       
      //           db.mainModel.execQuery(query, (err, data) => {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       resolve(data);
      //     }
      //   });
      // });

      const [responseData, blogsData, testimonialsData, meetingsData, refCount] = await Promise.all([
        db.responses.findAll(),
        db.blogs.findAll(),
        db.testimonials.findAll(),
        db.meetings.findAll({ where: { status: 'Booked' } }),
        db.responses.count({ where: { referee_email: referee_email } })
      ]);
      if (req.session.role == 'HR') {

        // Total meetings accepted
        totalMeetingsAccepted = await db.meetings.count({
          where: { alloted_HR: req.session.userid, status: 'Booked' }
        });

        let currentDate = moment(new Date()).format('YYYY-MM-DD'); // Use 'YYYY-MM-DD' for a format compatible with most databases

        // Calculate the start date of the current month
        let startDateOfMonth = moment(currentDate, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');

        // Total meetings completed within the current month
        totalMeetingsCompletedCurrentMonth = await db.meetings.count({
          where: {
            alloted_HR: req.session.userid,
            process_status: '1',
            createdAt: {
              [Op.between]: [startDateOfMonth, currentDate]
            }
          }
        });

        totalMeetingsCompleted = await db.meetings.count({
          where: {
            alloted_HR: req.session.userid,
            process_status: '1'
          }
        });
      }
      res.render("dash_index", { locals: { responseData, blogsData, testimonialsData, meetingsData }, refCount, session: req.session, qryData, totalMeetingsAccepted, totalMeetingsCompletedCurrentMonth, totalMeetingsCompleted });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.redirect("/panel/login");
    }
  },
  
  get_logout : async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
          return console.log(err);
      }
      // res.cookie('connect.sid', '');
      res.clearCookie('connect.sid');
      res.redirect('/panel/login');
    });
  },
  
  success_google_login : async (req, res) => {
    try {
      if (!req.user)
        res.redirect('/error-500');

      // Check if the user exists in the database and add them if not
      let existingUser = await db.dash_logins.findOne({
        where: {
          [Op.or]: [
            { email: req.db.dash_logins.emails[0].value },
            { googleid: req.db.dash_logins.id }
          ]
        }
      });

      let existingResp = await db.responses.findOne({
        attributes: ['phonenumber', 'application_id'],
        where: { emailid: req.db.dash_logins.emails[0].value },
      });

      if (!existingUser && !existingResp) {

        existingUser = await db.dash_logins.create({
          googleid: req.db.dash_logins.id,
          email: req.db.dash_logins.emails[0].value,
          username: req.db.dash_logins.displayName,
          password: req.db.dash_logins.id,
          role: 'User',
          createdby: 'User'
        });

        existingResp = await db.responses.create({
          name: req.db.dash_logins.displayName,
          emailid: req.db.dash_logins.emails[0].value,
          password: req.db.dash_logins.id,
          urole: 'User',
          phone_verify: 'unverified',
          whatsapp_verify: 'unverified',
          email_verify: 'unverified'
        });
      }

      req.session.userid = existingUser.email; // Assuming 'email' is the user's email address
      req.session.username = existingUser.username;
      req.session.role = existingUser.role;
      req.session.createdby = existingUser.createdby;
      req.session.application_id = existingResp?.application_id || ''; // Using optional chaining (?.)
      req.session.phonenumber = existingResp?.phonenumber || ''; // Using optional chaining (?.)

      // Create activity log for successful login
      // await createActivityLog(existingUser.username, existingUser.email, req.session.id, 'Google Login Successfully');
      res.redirect('/panel/dash_index');

    } catch (err) {
      console.error(err);
      res.redirect('/error-500');
    }
  },

  failure_google_login: async (req, res) => {
    console.error(req);
    res.redirect('/error-500');
  },

  otp: async (req, res) => {
    res.render('otp', { session: req.session });
  },

  verify_login_otp: async (req, res) => {
    const { otp1, otp2, otp3, otp4, otp5, otp6, email } = req.body;
    const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    try {
      redisClient.get(`otp_${email}`, async (err, storedOtp) => {
        if (err) throw err;
        if (!storedOtp || storedOtp !== otp) {
          req.session.destroy();
          return res.redirect('/login');
        }
        // OTP is valid, clear it from Redis
        redisClient.del(`otp_${email}`);

        req.flash("success", "OTP verified, redirecting to dashboard");
        return res.redirect('/panel/dash_index');
      });
    } catch (error) {
      console.error(error);
      req.flash('errors', 'Error while verifying OTP.');
      return res.redirect('/panel/login');
    }
  },

  post_login: async (req, res) => {
    try {
      const email = req.body.mail;
      const password = req.body.pswrd;
      if (!email || !password) {
        req.flash("Error", "Enter Email and Password!");
        return res.redirect("/panel/login");
      }
      const user = await db.dash_logins.findOne({ where: { email, password },raw : true });

      if (!user) {
        req.flash("Error", "Invalid Email/Password!");
        return res.redirect("/panel/login");
      } else {
        let phoneNumberResponse;
        if (email != 'superadmin@upreak.com') {
          phoneNumberResponse = await db.responses.findOne({
            attributes: ['phonenumber', 'application_id'], // Specify the attributes you want to retrieve
            where: { emailid: req.body.mail },
          });
        }
        req.session.userid = email; // Assuming 'email' is the user's email address
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.createdby = user.createdby;
        req.session.application_id = phoneNumberResponse && phoneNumberResponse.application_id ? phoneNumberResponse.application_id : ''; // Using optional chaining (?.)
        req.session.phonenumber = user && user.phonenumber ? user.phonenumber : phoneNumberResponse ? phoneNumberResponse.phonenumber : ''; // Using optional chaining (?.)

        res.cookie('connect.sid', req.sessionID, {
          maxAge: sessionLife || 900000,
          // domain: config.cookieDomain || 'localhost',
          sameSite: true,
          secure: secureCookies,
          path: baseUrlPrefix + '/'
      });
        // Create activity log for successful loginpm
        // await createActivityLog(user.username, email, req.session.userid, 'Login Successfully');
        if (db.dash_logins.two_step && db.dash_logins.two_step == 1) {

          // Generate OTP and store it in Redis
          const otp = crypto.randomInt(100000, 999999).toString();
          const otpExpires = 10 * 60; // 5 minutes in seconds

          await redisClient.set(`otp_${email}`, otp, 'EX', otpExpires);
          await sendTwoStepEmail(email, otp)

          return res.redirect('/panel/two_step_verification');
        } else {
          req.flash("success", "Login Success!");
          return res.redirect('/panel/dash_index');
        }
      }
    } catch (error) {
      console.error(error);
      req.flash("error", "An error occurred. Please try again.");
      res.redirect("/error-500");
    }
  },

  post_signup: async (req, res) => {
  try {
    const email = req.body.mail;
    const password = req.body.pswrd;
    if (!email || !password)
      return res.redirect("/error-500");
    const user = await db.dash_logins.findOne({
      where: {
        email: email,
      },
    });
    const resp = await db.responses.findOne({
      where: {
        emailid: email,
      },
    });
    if (!user && !resp) {
      await db.dash_logins.create({
        phonenumber: req.body.phone,
        username: req.body.uname,
        email: req.body.mail,
        password: req.body.pswrd,
        role: 'User',
        createdby: 'User'
      });

      await db.responses.create({
        phonenumber: req.body.phone,
        whatsappnumber: req.body.wphone,
        name: req.body.uname,
        emailid: req.body.mail,
        password: req.body.pswrd,
        urole: 'User',
        phone_verify: 'unverified',
        whatsapp_verify: 'unverified',
        email_verify: 'unverified'
      });
    }
    return res.redirect("/panel/login");
  } catch (error) {
    console.error(error);
    res.redirect("/error-500");
  }
  },

  reset_password: async (req, res) => {
  try {
  const recipientEmail = req.body.email;
  let res_data = await db.dash_logins.findOne({ where: { email: recipientEmail } });
  if (res_data != null)
  await sendPasswordEmail(recipientEmail, res_data.password)
  res.redirect("/panel/login");
  } catch (error) {
  console.error('Error sending reset email:', error);
  res.redirect("/panel/login");
  }
  },

  get_login: async (req, res) => {
  res.render('login');
  },

  get_signup: async (req, res) => {
  res.render('signup');
  },

  update_two_step : async (req, res) => {
    const { id, two_step } = req.body;
  
    try {
      const [updatedRowsCount, updatedRows] = await db.dash_logins.update(
        { two_step: two_step },
        {
          where: { email : id },
          returning: true,
          plain: true
        }
      );
  
      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ success: true, user: updatedRows });
    } catch (err) {
      console.error('Error updating:', err);
      res.status(500).json({ error: 'Database update failed' });
    }
  }

};