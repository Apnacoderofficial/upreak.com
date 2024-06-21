const db = require("../config/dbconfig");
const redisClient = require('../config/redisClient');
const fs = require('fs');
const alert = require("alert");
const multer = require("multer");
const csv = require('csv-parser');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const QRCode = require('qrcode');
const { sendMessageToWhatsApp } = require('./whatsappSender');
const { sendOTP } = require('./smsOTPSender');
const moment = require("moment");
const { Op } = require('sequelize');
const { createEvent, deleteEvent } = require('./teamsMeeting');
const json2csv = require('json2csv');
const parseCSV = require("../controllers/parseCSV");
const { uploadFileToDrive, generatePublicUrl } = require('./driveUpload');

const {
  sendPasswordEmail,
  sendVerificationEmail,
  sendWelcomeHrMail,
  sendVerificationSuccessEmail,
  sendVerificationFailureEmail,
  sendWelcomeEmail,
  sendSlotConfirmEmail,
  sendHRSlotConfirmEmail,
  sendrequestmail,
  sendrequestreceivedmail,
  sendTwoStepEmail
} = require('./emailSender');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

const Blogs = db.blogs;
const Setting = db.settings;
const Payment = db.paymentdetails;
const meetings = db.meetings;
const Reports = db.assessmentreports;
const Products = db.products;
const Mou = db.mou_registrations;
const ContactUs = db.contactus;
const Partner = db.partner_registration;
const Feedback = db.feedback;
const User = db.dashlogins;
const MainQuery = db.mainquery;
const Question = db.questions;
const Response = db.responses;
const Resumes = db.resumes;
const Testimonials = db.testimonials;
const Token = db.tokendata;
const CandidateDetails = db.candidate_details;
const Corporatecorner = db.corporatecorner;
const corporateservices = db.corporateservices;
const Activitylog = db.activitylog;
const Jobs = db.jobs;
const JobApplications = db.job_applications;

exports.import_csv = (upload.single('bulk_csv'), async function (req, res, next) {
  try {

    let tableName = req.params.tableName
    let tableModel = db[tableName];
    // Use queryInterface to get the column names
    const tableInfo = await tableModel.describe();

    // Extract column names from the returned data
    let columnNames = Object.keys(tableInfo);

    // Define an array of columns to be excluded
    const excludedColumns = ['alldata', 'createdAt', 'updatedAt', 'id', 'application_id', 'email_verify', 'phone_verify', 'whatsapp_verify', 'plan_detail', 'upload_photo', 'resume_file'];

    // // Remove excluded columns from columnNames array
    columnNames = columnNames.filter(columnName => !excludedColumns.includes(columnName));

    parseCSV.parse(req.file.path, true, function (err, data) {
      db[tableName].bulkCreate(data, {
        updateOnDuplicate: columnNames
      });
      res.send('OK');
    })
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send(error);
  }
});

exports.export_table = async (req, res) => {
  try {
    let tableName = req.params.tableName
    let tableModel = db[tableName];
    // Use queryInterface to get the column names
    const tableInfo = await tableModel.describe();

    // Extract column names from the returned data
    let columnNames = Object.keys(tableInfo);


    // Remove 'alldata' from columnNames array
    // columnNames = columnNames.filter(columnName => columnName !== 'id');
    const excludedColumns = ['alldata', 'updatedAt', 'id', 'application_id', 'email_verify', 'phone_verify', 'whatsapp_verify', 'plan_detail', 'upload_photo', 'resume_file', 'resume'];

    // // Remove excluded columns from columnNames array
    columnNames = columnNames.filter(columnName => !excludedColumns.includes(columnName));

    let data = await tableModel.findAll({});
    data = await data.map(item => {
      var tempObj = {};
      // Dynamically set keys for the tempObj using column names
      columnNames.forEach(columnName => {
        tempObj[columnName] = item[columnName];
      });
      return tempObj;
    });
    fields = Object.keys(data[0]);
    var csv = json2csv({ "data": data, "fields": fields });
    const filename = 'export_' + tableName + '.csv';

    // Set headers for file download
    res.attachment(filename);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send(error);
  }
};


exports.thankyou_file = async (req, res) => {
  res.render('thankyou');
};

exports.chatbot = async (req, res) => {
  try {
    if (!req.session.userid)
      return res.redirect("/login");
    const questions = await db.questions.findAll({ order: [['order_id', 'ASC']] });
    const firstQuestion = questions.shift();
    const chatHistory = [];
    const user_resp = [];

    // Check if the terms and conditions checkbox is already accepted
    // const termsAccepted = localStorage.getItem('termsAccepted') === 'true';

    res.render('chatbot', { question: firstQuestion, questions, chatHistory, user_resp });
  } catch (error) {
    console.error(error);
    res.redirect("/error-500");
  }
};

exports.save_chatbot = (async (req, res) => {
  try {
    if (!req.session.userid)
      return res.redirect("/login");
    const questionId = req.body.question_id;
    const response = req.body.response;
    const questions = await db.questions.findAll({ order: [['order_id', 'ASC']] });
    const currentQuestionIndex = questions.findIndex((question) => question.id === parseInt(questionId));
    const nextQuestion = questions[currentQuestionIndex + 1];
    const user_resp = req.body.user_resp ? JSON.parse(req.body.user_resp) : [];
    const previousQuestion = req.body.previous_question;
    const previousResponse = req.body.previous_response;
    const chatHistory = req.body.chat_history ? JSON.parse(req.body.chat_history) : [];
    if (previousQuestion) {
      chatHistory.push({ type: 'question', text: previousQuestion });
      chatHistory.push({ type: 'response', text: previousResponse });
      // user_resp.push({ questionId,previousResponse });
    }

    const currentQuestion = await db.questions.findByPk(questionId);

    const chatEntry = { type: 'question', text: currentQuestion.question, remarks: currentQuestion.remarks, important: currentQuestion.important, options: currentQuestion.options };
    chatHistory.push(chatEntry);
    chatHistory.push({ type: 'response', questionId: questionId, text: response });
    user_resp.push({ questionId, response });

    if (nextQuestion) {
      let f = 0;
      if (questionId == 14 && f == 0) {
        f = f + 1;

        try {
          const existUser = await db.responses.findOne({ where: { emailid: user_resp[3].response } });

          if (existUser !== null) {
            // Handle the case where the user already exists, e.g., by sending a response or throwing an error
            console.log('User Already Exists!');
            let msg = "User Already Exists!";
            return res.render('error-500', { msg });
          }
        } catch (error) {
          console.error('Error checking user existence:', error);
          // Handle the error, e.g., by sending a response or throwing a different error
        }
      }

      res.render('chatbot', { question: nextQuestion, questions, chatHistory, user_resp });
    } else {

      await db.responses.create({
        alldata: user_resp,
        phonenumber: user_resp[0].response,
        whatsappnumber: user_resp[1].response,
        name: user_resp[2].response,
        emailid: user_resp[3].response,
        password: user_resp[4].response,
        dob: user_resp[5].response,
        city: user_resp[6].response,
        skill1: user_resp[10].response,
        experience: user_resp[11].response,
        job_role: user_resp[12].response,
        job_type: user_resp[13].response,
        referee_name: user_resp[14].response,
        referee_num: user_resp[15].response,
        urole: 'User',
        phone_verify: 'unverified',
        whatsapp_verify: 'unverified',
        email_verify: 'unverified'
      });

      let data = await db.responses.findOne({ where: { emailid: user_resp[3].response } });

      let userUpdateData;

      if (user_resp[7].response == '10') {
        userUpdateData = {
          application_id: 'UP1000' + data.id,
          qualification_10: user_resp[8].response,
          yoc_10: user_resp[9].response,
        }
      } else if (user_resp[7].response == '12') {
        userUpdateData = {
          application_id: 'UP' + moment().format('YY') + data.id,
          qualification_12: user_resp[8].response,
          yoc_12: user_resp[9].response,
        }

      } else if (user_resp[7].response == 'DIPLOMA') {
        userUpdateData = {
          application_id: 'UP' + moment().format('YY') + data.id,
          qualification_diploma: user_resp[8].response,
          yoc_diploma: user_resp[9].response,
        }

      } else if (user_resp[7].response == 'UG') {
        userUpdateData = {
          application_id: 'UP' + moment().format('YY') + data.id,
          ugqualification: user_resp[8].response,
          ugyoc: user_resp[9].response,
        }

      } else if (user_resp[7].response == 'PG') {
        userUpdateData = {
          application_id: 'UP' + moment().format('YY') + data.id,
          pgqualification: user_resp[8].response,
          pgyoc: user_resp[9].response,
        }
      }

      await db.responses.update(userUpdateData, { where: { emailid: user_resp[3].response } });
      await User.create({
        phonenumber: user_resp[1].response,
        username: user_resp[2].response,
        email: user_resp[3].response,
        password: user_resp[4].response,
        role: 'User',
        createdby: 'User'
      });

      const thankYouMessage = "Thank You";
      chatHistory.push({ type: 'question', text: thankYouMessage });

      const recipientName = user_resp[2].response;
      const recipientEmail = user_resp[3].response;
      const recipientPassword = user_resp[4].response;
      await Promise.all([
        sendMessageToWhatsApp(`91${user_resp[1].response}`, `Welcome to Upreak \n\nDear ${recipientName},Congratulations on taking a significant step towards your career success! We're excited to have you join us at upreak. You are all set to login , your credentials are given below: \n\nEmail : ${recipientEmail} \nPassword : ${recipientPassword} \n\nThanks And Regards, \nTeam Upreak`),
        sendWelcomeEmail(recipientEmail, recipientPassword)
      ])
        .then(() => {
          res.render('thankyou');
        })
        .catch((error) => {
          console.error('Error sending or submitting via chatbot:', error);
          res.render('error-404');
        });

    }
  } catch (error) {
    console.log(error);
    res.render('error-404');
  }
});

exports.jobs = async (req, res) => {
  let data = await Jobs.findAll({
    raw: true,
    order: [
      ['status', 'DESC'],
      ['id', 'DESC']
    ]
  });
  res.render('jobs', { locals: data, bData: undefined })
}

// Adjust as needed
// const itemsPerPage = 5; 
// exports.jobs = async (req, res) => {
//   try {
//       const page = parseInt(req.query.page) || 1;

//       const data = await Jobs.findAndCountAll({
//           order: [
//             ['status', 'DESC'],
//             ['id', 'DESC']
//           ],
//           offset: (page - 1) * itemsPerPage,
//           limit: itemsPerPage
//       });

//       const totalPages = Math.ceil(data.count / itemsPerPage);

//       res.render('jobs', { locals: data.rows, currentPage: page, totalPages, count : data.count });
//   } catch (error) {
//       console.log(error);
//       res.status(500).send(error);
//   }
// };


exports.filteredJobs = async (req, res) => {
  try {
    let data;
    // &&  req.body.experience == ''
    if (req.body.job_type == '' && req.body.location == '' && req.body.experience == '' && req.body.createdAt == '')
      return res.redirect('/jobs');
    let whereClause = {};
    // Check if there are query parameters
    // If there are query parameters, construct the where clause
    if (req.body.job_type != '') {
      whereClause.job_type = req.body.job_type;
    }
    if (req.body.location != '') {
      whereClause.location = { [Op.iLike]: `%${req.body.location}%` };
    }
    if (req.body.experience != '') {
      if (req.body.experience == '0') {
        // Fresher case: filter experience strings indicating less than 1 year of experience
        whereClause.experience = {
          [Op.or]: [
            { [Op.like]: '%0%' },
            { [Op.like]: '%Any%' }
          ]
        };
      } else if (req.body.experience == '1') {
        // Experience case: filter experience strings indicating 1 or more years of experience
        whereClause.experience = {
          [Op.or]: [
            { [Op.ne]: '0' }, // Experience is not '0'
            { [Op.like]: '%Any%' } // Experience is not 'Any'
          ]
        };
      }
    }
    // Define default date filter as null
    let dateFilter = null;
    if (req.body.createdAt != '') {
      // Check the value of createdAt to set the date filter
      if (req.body.createdAt === '0') {
        // Filter jobs created today
        dateFilter = {
          [Op.gte]: moment().startOf('day').format('YYYY-MM-DD'),
          [Op.lte]: moment().endOf('day').format('YYYY-MM-DD')
        };
      } else if (req.body.createdAt === '1') {
        // Filter jobs created this month
        dateFilter = {
          [Op.gte]: moment().startOf('month').format('YYYY-MM-DD'),
          [Op.lte]: moment().endOf('month').format('YYYY-MM-DD')
        };
      } else if (req.body.createdAt === '2') {
        // Filter jobs created before this month
        dateFilter = {
          [Op.lt]: moment().startOf('month').format('YYYY-MM-DD')
        };
      }
    }
    // Apply date filter if it's defined
    if (dateFilter) {
      whereClause.createdAt = dateFilter;
    }

    // Find jobs with the specified filters
    data = await Jobs.findAll({
      where: whereClause,
      order: [
        ['status', 'DESC'],
        ['id', 'DESC']
      ],
    });

    res.render('jobs', { locals: data, bData: req.body });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.job_details = async (req, res) => {
  let job_id = req.query.jobId;
  let data = await Jobs.findOne({ where: { job_id, status: 1 } });
  res.render('job_details', { locals: data })
}

exports.add_candidate_details = (req, res) => {
  if (req.session.role == 'Master' || req.session.role == 'Manager')
    res.render('add_candidate_details', { locals: undefined, recordType: 'new', srole: req.session.role, ViewUser: 'add', info: 'new' });
  else
    res.redirect("/login");
};


exports.save_candidate_details = (upload.fields([{ name: 'photo' }, { name: 'resume' }]), async function (req, res, next) {

  let id = req.body && req.body.id && req.body.id != '' ? req.body.id : null;
  try {
    let googleData;
    if (req.session.role == 'Master' || req.session.role == 'Manager') {
      if (req.files['photo']) {
        var imageFile = req.files['photo'][0];
      } else {
        var imageFile = req.body.photo_file_name;
      }
      if (req.files['resume']) {
        pdfFile = req.files['resume'][0];
        const response = await uploadFileToDrive(req, pdfFile);
        const publicUrls = await generatePublicUrl(response.id);
        googleData = {
          filename: response.name,
          fileId: response.id,
          publicUrls: publicUrls.webContentLink
        };
        // res.json(googleData);
      } else {
        googleData = req.body.resume_file_name;
      }


      const data = {
        name: req.body.name,
        emailid: req.body.email,
        phonenumber: req.body.phonenumber,
        whatsappnumber: req.body.whatsappnumber,
        area: req.body.area,
        dob: req.body.dob,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        gender: req.body.gender,
        languages: req.body.languages,
        marragestatus: req.body.maritalstatus,
        upload_photo: imageFile.filename,
        resume_file: googleData,
        skill1: req.body.skill1,
        skill2: req.body.skill2,
        skill3: req.body.skill3,
        skill4: req.body.skill4,
        skill5: req.body.skill5,
        exp_seeker_type: req.body.expd_seeker_type,
        company_project_name: req.body.expd_company_name,
        project_role_summary: req.body.expd_psummary,
        position: req.body.expd_position,
        exp_sdate: req.body.expd_sdate,
        exp_edate: req.body.expd_edate,
        experience: req.body.expd_experience,
        qualification_10: req.body.qualification_10,
        university_10: req.body.university_10,
        ctype_10: req.body.ctype_10,
        percent_10: req.body.percent_10,
        yos_10: req.body.yos_10,
        yoc_10: req.body.yoc_10,
        college_10: req.body.college_10,
        state_10: req.body.state_10,

        qualification_12: req.body.qualification_12,
        university_12: req.body.university_12,
        ctype_12: req.body.ctype_12,
        percent_12: req.body.percent_12,
        yos_12: req.body.yos_12,
        yoc_12: req.body.yoc_12,
        college_12: req.body.college_12,
        state_12: req.body.state_12,

        qualification_diploma: req.body.qualification_diploma,
        university_diploma: req.body.university_diploma,
        ctype_diploma: req.body.ctype_diploma,
        percent_diploma: req.body.percent_diploma,
        yos_diploma: req.body.yos_diploma,
        yoc_diploma: req.body.yoc_diploma,
        college_diploma: req.body.college_diploma,
        state_diploma: req.body.state_diploma,

        ugqualification: req.body.ugqualification,
        uguniversity: req.body.uguniversity,
        ugctype: req.body.ugctype,
        ugpercent: req.body.ugpercent,
        ugyos: req.body.ugyos,
        ugyoc: req.body.ugyoc,
        ugcollege: req.body.collegeug,
        ugstate: req.body.ugstate,

        pgqualification: req.body.pgqualification,
        pguniversity: req.body.pguniversity,
        pgctype: req.body.pgctype,
        pgpercent: req.body.pgpercent,
        pgyos: req.body.pgyos,
        pgyoc: req.body.pgyoc,
        pgcollege: req.body.pgcollege,
        pgstate: req.body.pgstate,

        job_category: req.body.job_category,
        job_location: req.body.job_location,
        job_role: req.body.job_role,
        job_industry: req.body.job_industry,
        job_department: req.body.job_department,
        preferred_designation: req.body.job_designation,
        preferred_ctc: req.body.job_pref_ctc,
        present_ctc: req.body.job_pres_ctc,
        job_type: req.body.job_type,
        job_jdate: req.body.job_jdate,
        referee_name: req.body.refree_name,
        referee_num: req.body.refree_num,
        referee_email: req.body.refree_email,
        referee_paynum: req.body.refree_paynum,
        urole: 'User',
      };
      if (id == null)
        await CandidateDetails.create(data)
      else
        await CandidateDetails.update(data, { where: { id: id } })
      res.redirect("/list_candidate_details");
    } else
      return res.redirect("/error-500");
  } catch (err) {
    console.error("Error saving member:", err);
    res.redirect("/error-500");
  }
});

exports.edit_candidate_details = async (req, res) => {
  const id = req.query.id;

  if (req.session.role != 'Master' && req.session.role != 'Manager')
    return res.redirect("/error-500");
  await CandidateDetails.findByPk(id)
    .then(data => {
      if (data)
        res.render('add_candidate_details', { locals: data, recordType: 'exsist', srole: req.session.role, ViewUser: 'edit', info: 'new' });
    })
    .catch(err => {
      console.error(err);
      res.redirect("/error-500");
    });
};
exports.view_candidate_details = async (req, res) => {

  try {
    const id = req.query.id;
    let data;
    const info = req.query && req.query.info ? req.query.info : 'new';
    if (req.session.role != 'Master' && req.session.role != 'Manager')
      return res.redirect("/login");
    if (info == 'new')
      data = await CandidateDetails.findByPk(id)
    else
      data = await Response.findByPk(id)
    res.render('add_candidate_details', { locals: data, ViewUser: 'view', srole: req.session.role, info });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  };
};

exports.list_candidate_details = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Manager') {
    await CandidateDetails.findAll({})
      .then(data => {
        res.render("list_candidate_details", { data, srole: req.session.role });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else
    res.redirect("/login");
};

exports.candidate_combined_list = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Manager') {
    await db.sequelize.query(
      'SELECT * from candidate_responses_view', { type: db.sequelize.QueryTypes.SELECT }
    )
      .then(data => {
        res.render("candidate_combined_list", { data, srole: req.session.role });
      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  } else
    res.redirect("/login");
};

exports.delete_candidate_details = async (req, res) => {
  session = req.session;
  try {
    if (req.session.role != 'Master')
      return res.redirect("/error-404");
    await CandidateDetails.destroy({ where: { id: req.params.id } });
    res.redirect("/list_candidate_details");
  } catch (err) {
    console.error("Error deleting details:", err);
    res.redirect("/error-500");
  }
};


exports.add_member = (req, res) => {

  if (req.session.role == 'Master')
    res.render('add_member');
  else
    res.redirect("/login");
};

exports.save_member = async (req, res) => {

  if (req.session.role != 'Master' || !req.body.email || !req.body.password || !req.body.role)
    return res.redirect("/error-500");
  try {
    const member = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      createdby: req.session.userid,
      phonenumber: req.body.phonenumber,
      two_step : req.body.two_step
    };
    await User.create(member);
    res.redirect("list_members");
  } catch (err) {
    console.error("Error saving member:", err);
    res.redirect("/error-500");
  }
};

exports.list_members = async (req, res) => {

  if (req.session.role == 'Master') {
    await User.findAll({ where: { role: { [Op.notIn]: ['Master', 'User'] } } })
      .then(data => {
        res.render("list_members", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else
    res.redirect("/login");
};

exports.updatetwostep = async (req, res) => {
  const { id, two_step } = req.body;

  try {
    const [updatedRowsCount, updatedRows] = await User.update(
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
};

exports.member_delete = async (req, res) => {
  const id = req.params.id;

  try {
    if (req.session.role != 'Master')
      return res.redirect("/error-500");
    const deletedCount = await User.destroy({ where: { id: id } });
    if (deletedCount)
      return res.redirect("/list_members");
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).send({
      message: `Could not delete member with id ${id}.`
    });
  }
};



exports.get_buy_now = async (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'User') {

    await Products.findByPk(id)
      .then(data => {
        if (data) {
          res.render('buy_now', { locals: data, pay_status: "false" });
        } else {
          res.redirect("login1");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.issue = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'HR' || req.session.role == 'User') {
    ContactUs.findAll()
      .then(data => {
        res.render("issue", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");

};
exports.service_request_details = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'HR' || req.session.role == 'User') {
    ContactUs.findAll()
      .then(data => {
        res.render("service_request_details", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");

};
exports.save_ticket = async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    category: req.body.category,
  };
  await ContactUs.create(data)
    .then(data => {
      alert("Thank You!");
      res.redirect('dash_index');
    })
    .catch(err => {
      res.redirect("/error-500");
    });

};
exports.save_contact = async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    category: req.body.category,
  };
  await ContactUs.create(data)
    .then(data => {
      alert("Thank You!");
      res.redirect('/help-center');
    })
    .catch(err => {
      res.redirect("/error-500");
    });

};

exports.get_bookslot = async (req, res) => {
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
        user_details = await Response.findAll({ raw: true });
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
        const credt_query = `SELECT email, SUM(credit) AS total_credit FROM paymentdetails WHERE email = '${req.session.userid}' GROUP BY email;`;
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
          Response.findOne({ where: { application_id: req.session.application_id }, raw: true })
        ]);
        // Assuming execQueryPromise resolves with an array of results
        user_details = registered_user;
        credit_data = creditDataResult[0] ? creditDataResult[0].total_credit : 0;
        booked_slot_count = bookedCountResult[0] ? bookedCountResult[0].num_booked_meetings : 0;
        not_booked_slot_count = notBookedCountResult[0] ? notBookedCountResult[0].num_not_booked_meetings : 0;
        meetings = userMeetings;
      }
      res.render("book_slot", { locals: meetings, session: req.session, moment, booked_meetings, credit_data, booked_slot_count, not_booked_slot_count, user_details });
    } else {
      res.render("login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/error-500");
  }
};

// Helper function to convert MainQuery.execQuery to a promise-based function
function execQueryPromise(query) {
  return new Promise((resolve, reject) => {
    MainQuery.execQuery(query, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

exports.post_bookslot = async (req, res) => {
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
      res.redirect("book_slot");
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

        // res.render("book_slot", { locals, session , moment , booked_meetings});
        res.redirect("/book_slot");
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

      res.redirect("/book_slot");
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.render("login");
  }
};

exports.performance_hr = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin') {
    let mdata = await meetings.findAll({})
    await User.findAll({ where: { role: 'HR' } })
      .then(hrData => {
        res.render("performance_hr", { hrData, mdata, filterHrdata: undefined });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");
};

exports.filter_performance_hr = async (req, res) => {

  const email = req.body.filterSelect;
  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin') {
    let filterHrdata = await new Promise((resolve, reject) => {
      const query = `SELECT
      COUNT(*) AS total_meetings,
      SUM(CASE WHEN status = 'Booked' AND TO_CHAR("createdAt", 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM') THEN 1 ELSE 0 END) AS month_meetings
  FROM
      meetings
  WHERE
      "alloted_HR" = '${email}'
      AND status = 'Booked';`;

      MainQuery.execQuery(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    console.log(filterHrdata);
    await User.findAll({ where: { role: 'HR' } })
      .then(hrData => {
        res.render("performance_hr", { hrData, mdata: undefined, filterHrdata, email });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");
};
exports.meeting_details = async (req, res) => {

  if (req.session.role == 'User') {
    let locals;
    let user_Data = await Response.findAll({ where: { emailid: req.session.userid } });
    await meetings.findAll({ where: { email: req.session.userid } })
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
exports.get_resume = async (req, res) => {

  if (req.session.role == 'User') {
    let locals;
    await Resumes.findAll({})
      .then(data => {
        locals = data;
      })
      .catch(err => {
        res.redirect("/error-500");
      });
    res.render("resume", { locals: locals });
  } else
    res.render("login");
};

exports.get_resume1 = async (req, res) => {

  const email = req.session.userid;
  if (req.session.role == 'User') {
    Response.findOne({ where: { emailid: email } })
      .then(async data => {
        res.render('resume1', { locals: data });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.get_resume2 = async (req, res) => {

  const email = req.session.userid;
  if (req.session.role == 'User') {
    Response.findOne({ where: { emailid: email } })
      .then(async data => {
        res.render('resume2', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.get_resume3 = async (req, res) => {

  const email = req.session.userid;
  if (req.session.role == 'User') {
    Response.findOne({ where: { emailid: email } })
      .then(async data => {
        res.render('resume3', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.get_resume4 = async (req, res) => {

  const email = req.session.userid;
  if (req.session.role == 'User') {
    Response.findOne({ where: { emailid: email } })
      .then(async data => {

        res.render('resume4', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.get_resume5 = async (req, res) => {

  const email = req.session.userid;
  if (req.session.role == 'User') {
    Response.findOne({ where: { emailid: email } })
      .then(async data => {
        res.render('resume5', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};

exports.view_resume = async (req, res) => {

  if (req.session.role == 'User') {
    let locals;
    await Resumes.findAll({})
      .then(data => {
        locals = data;
      })
      .catch(err => {
        res.redirect("/error-500");
      });
    res.render("resume", { locals: locals });
  } else
    res.render("login");
};

exports.add_resume = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_resume', {
      locals: undefined,
    });
  } else
    res.redirect("/login");
};
exports.save_resume = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const data = {
      photo: req.file.photo,
      resume_title: req.body.resume_title,
      resume_category: req.body.resume_category,
    };
    if (!req.query.id) {
      //Create a Tutorial:
      Resumes.create(data, { raw: true })
        .then(data => {
          res.redirect("view_resumes");

        })
        .catch(err => {
          console.error(err);
          res.redirect("/error-500");
        });
    }
    else {
      Resumes.update(data, {
        where: {
          id: req.query.id
        }, raw: true,
      })
        .then(data => {
          res.redirect("view_resumes");
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({
            message: "Error adding Products with id=" + id
          });
        });
    }
  }
  else
    res.redirect("/login");
});

exports.view_resumes = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Resumes.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("view_resumes", {
          locals: data,
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.delete_resumes = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    Resumes.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/view_resumes");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/login");
  }
};

exports.get_products = async (req, res) => {

  if (req.session.role == 'User') {
    let locals;
    let user_Data = await Response.findAll({ where: { emailid: req.session.userid } });
    await Products.findAll({})
      .then(data => {
        locals = data;
        res.render("products", { locals: locals, user_Data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");
};

exports.view_products = (req, res) => {


  // Check if session and session role are defined
  if (req.session && req.session.role === 'Master') {
    Products.findAll({})
      .then(data => {
        res.render("view_products", {
          locals: data,
        });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else {
    res.redirect("/login");
  }
};


exports.edit_products = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    Products.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_products', {
            locals: data,
          });
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};

exports.add_products = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_products', {
      locals: undefined,
    });
  } else
    res.redirect("/login");
};

exports.save_products = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const data = {
      photo: req.file.photo,
      description: req.body.description,
      name: req.body.name,
      link: req.body.link,
      price: req.body.price
    };
    if (!req.query.id) {
      //Create a Tutorial:
      Products.create(data, { raw: true })
        .then(data => {
          res.redirect("view_products");

        })
        .catch(err => {
          console.error(err);
          res.redirect("/error-500");
        });
    }
    else {
      Products.update(data, {
        where: {
          id: req.query.id
        }, raw: true,
      })
        .then(data => {
          res.redirect("view_products");
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({


            message: "Error adding Products with id=" + id
          });
        });
    }
  }
  else
    res.redirect("/login");
});
exports.update_products = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    if (req.file) {
      var imageFile = req.file;
    } else {
      var imageFile = req.body.photo_file_name;
    }
    const data = {
      photo: imageFile.filename,
      description: req.body.description,
      name: req.body.name,
      link: req.body.link,
      price: req.body.price
    };

    await Products.update(data, {
      where: {
        id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("view_products");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating products with id=" + id
        });
      });
  }
});

exports.delete_products = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    Products.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/view_products");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/login");
  }
};

exports.delete_mou = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    Mou.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/view_mou");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/login");
  }
};


exports.get_mou = (req, res) => {
  const shortname = req.params.shortname;

  //  Mou.findByPk(shortname) 
  Mou.findOne({ where: { shortname: shortname } })
    .then(data => {
      if (data) {
        res.render('mou', { locals: data });
      } else {
        res.redirect("/login");
      }
    })
    .catch(err => {
      res.redirect("/login");
    });
};


exports.view_mou = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Mou.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master' || req.session.role == 'HR') {
        res.render("view_mou", {
          locals: data,
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.edit_mou = (req, res) => {
  const shortname = req.query.clg;

  if (req.session.role == 'Master') {
    Mou.findOne({ where: { shortname: shortname } })
      .then(data => {
        if (data) {
          res.render('add_mou', {
            locals: data,
          });
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};

exports.add_mou = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_mou', {
      locals: undefined,
    });
  } else
    res.redirect("/login");
};

exports.save_mou = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const data = {
      name: req.body.name,
      shortname: req.body.shortname,
      link: req.body.link,
      email: req.body.email,
      number: req.body.number,
      description: req.body.description,
      photo: req.file.photo,
      address: req.body.address,
      city: req.body.city,
      facebook: req.body.facebook,
      linkedin: req.body.linkedin,
      twitter: req.body.twitter,
      youtube: req.body.youtube,
      thread: req.body.thread,
      instagram: req.body.instagram,
      supportby: req.body.supportby,
      supportnumber: req.body.supportnumber,
      supportemail: req.body.supportemail
    };
    console.log(data);
    Mou.create(data, { raw: true })
      .then(data => {
        res.redirect("view_mou");

      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  }
  else
    res.redirect("/login");
});
exports.update_mou = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    if (req.file) {
      var imageFile = req.file;
    } else {
      var imageFile = req.body.photo_file_name;
    }
    const data = {
      name: req.body.name,
      shortname: req.body.shortname,
      link: req.body.link,
      email: req.body.email,
      number: req.body.number,
      description: req.body.description,
      photo: imageFile.filename,
      address: req.body.address,
      city: req.body.city,
      facebook: req.body.facebook,
      linkedin: req.body.linkedin,
      twitter: req.body.twitter,
      youtube: req.body.youtube,
      thread: req.body.thread,
      instagram: req.body.instagram,
      supportby: req.body.supportby,
      supportnumber: req.body.supportnumber,
      supportemail: req.body.supportemail
    };

    await Mou.update(data, {
      where: {
        id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("view_mou");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating mou with id=" + id
        });
      });
  }
});

exports.register_mou = async (req, res) => {
  const data = {
    name: req.body.name,
    emailid: req.body.email,
    phonenumber: req.body.number,
    gender: req.body.gender,
    password: req.body.password,
    city: req.body.city,
    urole: 'User',
    phone_verify: 'unverified',
    email_verify: 'unverified'
  };
  let createdby = `MOU_${req.body.shortname}`;
  const ddata = {
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 'User',
    createdby: createdby,
    phonenumber: req.body.number,
  };
  let user_registered = await Response.findOne({ where: { emailid: req.body.email } });
  if (!user_registered) {
    let dataid = await Response.create(data);
    await Response.update({
      application_id: 'UP1000' + dataid.id,
    }, {
      where: { emailid: req.body.email }
    })
    await User.create(ddata)
      .then(async () => {
        let res_data = await (Response.findOne({ where: { emailid: req.body.email } }))
        if (res_data !== null)
          await sendWelcomeEmail(req.body.email, req.body.password);
        res.send({
          status: true,
          msg: 'Successfully Registered, Thank You!',
        });
      })
      .catch(err => {
        console.error(err);
        res.send({
          status: false,
          msg: err.message
        });
        return;
      });
  }
  else {
    res.send({
      status: false,
      msg: 'User Already Registered!'
    });
    return;
  }

};

exports.register_mou = async (req, res) => {
  const data = {
    name: req.body.name,
    emailid: req.body.email,
    phonenumber: req.body.number,
    gender: req.body.gender,
    password: req.body.password,
    city: req.body.city,
    urole: 'User',
    phone_verify: 'unverified',
    email_verify: 'unverified'
  };

  const createdby = `MOU_${req.body.shortname}`;
  const ddata = {
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 'User',
    createdby: createdby,
    phonenumber: req.body.number,
  };

  try {
    let user_registered = await Response.findOne({ where: { emailid: req.body.email } });
    if (!user_registered) {
      let dataid = await Response.create(data);
      await Response.update({
        application_id: 'UP1000' + dataid.id,
      }, {
        where: { emailid: req.body.email }
      });

      await User.create(ddata);
      let res_data = await Response.findOne({ where: { emailid: req.body.email } });
      if (res_data !== null) {
        await sendWelcomeEmail(req.body.email, req.body.password);
      }
      return res.send({
        status: true,
        msg: 'Successfully Registered, Thank You!',
      });
    } else {
      return res.send({
        status: false,
        msg: 'User Already Registered!'
      });
    }
  } catch (err) {
    console.error(err);
    return res.send({
      status: false,
      msg: "Registration failed. Please try again later."
    });
  }
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
    res.redirect("/book_slot");

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
        redirectUrl: 'https://upreak.com/buy_now_details',
        redirectMode: 'POST',
        callbackUrl: 'https://upreak.com/buy_now_details',
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
    res.redirect("/login");
  }
};

exports.reset_password = async (req, res) => {
  try {
    const recipientEmail = req.body.email;
    let res_data = await User.findOne({ where: { email: recipientEmail } });
    if (res_data != null)
      await sendPasswordEmail(recipientEmail, res_data.password)
    res.redirect("/login");
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.redirect("/login");
  }
};

function generateOTP() {
  // Generate a 6-digit random number as the OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function verifyOTP(userOTP, storedOTP) {
  // Compare the user-entered OTP with the stored OTP
  return userOTP === storedOTP;
}

const verifyOTP1 = (userOTP, storedOTP) => {
  // Compare the user-entered OTP with the stored OTP
  return userOTP === storedOTP;
};
const verifyOTP2 = (userOTP, storedOTP, recipientEmail) => {
  // Compare the user-entered OTP with the stored OTP
  const isVerified = userOTP === storedOTP;

  if (isVerified) {
    sendVerificationSuccessEmail(recipientEmail);
  } else {
    sendVerificationFailureEmail(recipientEmail);
  }

  return isVerified;
};

exports.download_resume = async (req, res) => {
  const id = req.query.id;
  let data = await Response.findByPk(id)
  if (data.resume_file) {
    const filePath = 'uploads/' + data.resume_file;
    const fileName = data.resume_file;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Stream the file content to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
  else {
    res.redirect('/view_job_seekers');
  }


};


exports.generateQR = async (req, res) => {
  const shortname = req.query.shortname;

  // Validate and sanitize the shortname if necessary

  // Data you want to encode in the QR code
  const data = `${shortname}`;
  const options = {
    errorCorrectionLevel: 'H', // High error correction level
    type: 'image/png', // Output type (you can use 'svg', 'png', 'pdf', etc.)
    rendererOpts: {
      quality: 0.3, // Image quality (only for 'image/png' and 'image/jpeg')
    },
  };

  const outputFolder = path.join(__dirname, '../public/qr_images');
  const outputPath = path.join(outputFolder, `Qr_Image.png`);

  // Ensure the output folder exists, create it if not
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  QRCode.toFile(outputPath, data, options, (err) => {
    if (err) {
      console.error(`Error generating QR Code: ${err.message}`);
      return res.status(500).send({
        status: 500,
        msg: 'Error generating QR Code',
      });
    }

    console.log('QR Code generated successfully! Saved to:', outputPath);

    // Read the generated file as a buffer
    const buffer = fs.readFileSync(outputPath);

    // Send the buffer to the frontend along with a success message
    return res.send({
      status: 200,
      msg: 'QR Code generated successfully!',
      data: buffer.toString('base64'), // Convert buffer to base64 for sending to frontend
    });
  });
};

exports.verify_job_seeker = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {
    Response.findOne({
      where: {
        emailid: req.session.userid,
      },
      raw: true,
    })
      .then(data => {
        res.render('verify_job_seeker', { locals: data, otpSent: false, verified: false, otp: null });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.redirect("/login");

};

exports.verify_job_seeker1 = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {
    Response.findOne({
      where: {
        emailid: req.session.userid,
      },
      raw: true,
    })
      .then(data => {
        res.render('verify_job_seeker1', { locals: data, otpSent: false, verified: false, otp: null });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.redirect("/login");

};

exports.verify_job_seeker2 = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {
    Response.findOne({
      where: {
        emailid: req.session.userid,
      },
      raw: true,
    })
      .then(data => {
        res.render('verify_job_seeker2', { locals: data, email: '', otpSent: false, verified: false });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.redirect("/login");

};
exports.verify_details = async (req, res) => {

  const phoneNumber = req.body.phoneNumber;
  const otp = generateOTP();
  const type = 'otp';
  sendOTP(phoneNumber, otp, type)
    .then(message => {
      console.log('OTP sent successfully:');
      res.render('verify_job_seeker', { otpSent: true, verified: false, otp: otp });
    })
    .catch(error => {
      console.error('Error sending OTP:', error);
      res.render('verify_job_seeker', { otpSent: false, verified: false, otp: null });
    });
};
exports.verify_otp = async (req, res) => {

  const userEnteredOTP = req.body.otp;
  const storedOTP = req.body.storedOTP;

  if (verifyOTP(userEnteredOTP, storedOTP)) {
    console.log('OTP verification successful!');
    // Send alert to the user
    var email = req.session.userid;
    Response.update({ phone_verify: "verified" }, {
      where: {
        emailid: email,
      }
    });
    res.render('verify_job_seeker', { otpSent: true, verified: true, otp: storedOTP });
  } else {
    console.log('OTP verification failed!');
    // Send alert to the user
    // sendAlert('+917037564392', 'OTP verification failed!');
    res.render('verify_job_seeker', { otpSent: true, verified: false, otp: storedOTP });
  }

};

exports.verify_details1 = async (req, res) => {
  const whatsappnumber = req.body.Whatsappnumber;
  const otp = generateOTP();
  await sendMessageToWhatsApp(`91${whatsappnumber}`, `Dear ${req.session.username}, Your One Time Password is U- ${otp}. \nThanks And Regards, \nTeam Upreak`)
    .then(() => {
      console.log('Message sent successfully');
      res.render('verify_job_seeker1', { otpSent: true, verified: false, otp: otp });
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.render('verify_job_seeker1', { otpSent: false, verified: false, otp: null });
    });
};
exports.verify_otp1 = (req, res) => {

  const userEnteredOTP = req.body.otp;
  const storedOTP = req.body.storedOTP;

  if (verifyOTP1(userEnteredOTP, storedOTP)) {
    console.log('OTP verification successful!');
    var email = req.session.userid;
    Response.update({ whatsapp_verify: "verified" }, {
      where: {
        emailid: email,
      }
    });
    res.render('verify_job_seeker1', { otpSent: true, verified: true, otp: storedOTP });
  } else {
    console.log('OTP verification failed!');
    res.render('verify_job_seeker1', { otpSent: true, verified: false, otp: storedOTP });

  }
};


exports.verify_details2 = (req, res) => {
  const recipientEmail = req.body.email;
  const otp = generateOTP();

  sendVerificationEmail(recipientEmail, otp)
    .then(() => {
      res.render('verify_job_seeker2', { email: recipientEmail, otp: otp, otpSent: true, verified: false });
    })
    .catch((error) => {
      console.error('Error sending verification email:', error);
      res.render('verify_job_seeker2', { email: '', otpSent: false, verified: false });
    });
};
exports.verify_otp2 = (req, res) => {

  const userEnteredOTP = req.body.otp;
  const recipientEmail = req.body.email;
  const storedOTP = req.body.storedOTP;

  if (verifyOTP2(userEnteredOTP, storedOTP, recipientEmail)) {
    var email = req.session.userid;
    Response.update({ email_verify: "verified" }, {
      where: {
        emailid: email,
      }
    });
    res.render('verify_job_seeker2', { email: recipientEmail, otp: storedOTP, otpSent: true, verified: true });
  } else {
    res.render('verify_job_seeker2', { email: recipientEmail, otp: storedOTP, otpSent: true, verified: false });

  }
};
exports.findAll = async (req, res) => {
  try {
    const [testimonials, blogs] = await Promise.all([
      Testimonials.findAll(),
    ]);

    res.render("index", { testimonials });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  }
};


exports.getstarted = async (req, res) => {
  try {
    res.render("get_started");
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  }
};

exports.getlogin = (req, res) => {
  res.render('login');
};

exports.getsignup = (req, res) => {
  res.render('signup');
};
exports.blog = async (req, res) => {
  try {
    let data = await Blogs.findAll()
    res.render("blog", { locals: data });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  }
};

exports.save_partner = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      city: req.body.city,
    };
    await Partner.create(data);
    req.flash("Success", "Thank You for Registration!");
    res.redirect('registration_recruitment_partner');
  } catch (err) {
    console.error(err);
    req.flash('Error', 'Registration failed. Please try again.');
    res.redirect("/error-500");
  }
};
exports.registration_recruitment_partner = (req, res) => {
  res.render('registration_recruitment_partner');
};
exports.aboutus = (req, res) => {
  res.render('aboutus');
};
exports.contactus = async (req, res) => {
  let data = await Setting.findAll()
    .then(data => {
      res.render("contactus", { locals: data });
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.services = (req, res) => {
  res.render('services');
};
exports.privacypolicy = (req, res) => {
  res.render('privacypolicy');
};
exports.termsandconditions = (req, res) => {
  res.render('terms&conditions');
};
exports.getregister = (req, res) => {
  res.render('register');
};

exports.get404 = (req, res) => {
  res.render('error-404');
};

exports.get500 = (req, res) => {
  res.render('error-500');
};

exports.postlogin = async (req, res) => {
  try {
    const email = req.body.mail;
    const password = req.body.pswrd;
    if (!email || !password){
      req.flash("Error", "Enter Email and Password!");
      return res.redirect("/login");
    }
    const user = await User.findOne({ where: { email, password } });

   if(!user){
      req.flash("Error", "Invalid Email/Password!");
      return res.redirect("/login");
    }else {
      let phoneNumberResponse;
      if (email != 'superadmin@upreak.com') {
        phoneNumberResponse = await Response.findOne({
          attributes: ['phonenumber', 'application_id'], // Specify the attributes you want to retrieve
          where: { emailid: req.body.mail },
        });
      }
      
      req.session.id = user.id;
      req.session.userid = email; // Assuming 'email' is the user's email address
      req.session.username = user.username;
      req.session.role = user.role;
      req.session.createdby = user.createdby;
      req.session.application_id = phoneNumberResponse && phoneNumberResponse.application_id ? phoneNumberResponse.application_id : ''; // Using optional chaining (?.)
      req.session.phonenumber = user && user.phonenumber ? user.phonenumber :  phoneNumberResponse ? phoneNumberResponse.phonenumber : ''; // Using optional chaining (?.)

      // Create activity log for successful loginpm
      await createActivityLog(user.username, email, user.id, 'Login Successfully');
      if(user.two_step && user.two_step == 1){

        // Generate OTP and store it in Redis
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = 10 * 60; // 5 minutes in seconds

        await redisClient.set(`otp_${email}`, otp, 'EX', otpExpires);
        await sendTwoStepEmail(email, otp)

        return res.redirect('/two_step_verification');
      }else{
        req.flash("success", "Login Success!");
        return res.redirect('/dash_index');
      }
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/error-500");
  }
};

exports.postsignup = async (req, res) => {
  try {
    const email = req.body.mail;
    const password = req.body.pswrd;
    if (!email || !password)
      return res.redirect("/error-500");
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    const resp = await Response.findOne({
      where: {
        emailid: email,
      },
    });
    if (!user && !resp) {
      await User.create({
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
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.redirect("/error-500");
  }
};

const createActivityLog = async (username, email, adminId, activity) => {
  try {
    const newActivityLog = await Activitylog.create({
      name: username,
      email,
      admin_id: adminId,
      activity
    });
    return newActivityLog;
  } catch (error) {
    throw new Error(`Failed to create activity log: ${error.message}`);
  }
};
exports.view_activity = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Activitylog.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("view_activity", {
          locals: data,
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.get_index = async (req, res) => {


  if (!req.session || !req.session.userid) {
    return res.redirect("/login");
  }
  try {
    let referee_email = req.session.userid;
    let totalMeetingsAccepted = null, totalMeetingsCompleted = null, totalMeetingsCompletedCurrentMonth = null;
    const qryData = await new Promise((resolve, reject) => {
      const query = `
        SELECT 'blogs' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount FROM blogs
        UNION
        SELECT 'responses' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount FROM responses WHERE urole = 'User'
        UNION
        SELECT 'mou_students' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount FROM dashlogins WHERE role = 'User' AND createdby LIKE 'MOU_%'
        UNION
        SELECT 'mou_registrations' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount  FROM mou_registrations
        UNION
        SELECT 'questions' AS TableName, COUNT(*)::text AS RowCount, NULL::text AS AdminCount, NULL::text AS SubadminCount  FROM questions
        UNION
        SELECT 'dashlogins' AS TableName, 
            COUNT(CASE WHEN role = 'HR' THEN 1 END)::text AS RowCount,
            COUNT(CASE WHEN role = 'Admin' THEN 1 END)::text AS AdminCount,
            COUNT(CASE WHEN role = 'SubAdmin' THEN 1 END)::text AS SubadminCount
            FROM dashlogins;`;

      MainQuery.execQuery(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const [responseData, blogsData, testimonialsData, meetingsData, refCount] = await Promise.all([
      Response.findAll(),
      Blogs.findAll(),
      Testimonials.findAll(),
      meetings.findAll({ where: { status: 'Booked' } }),
      Response.count({ where: { referee_email: referee_email } })
    ]);
    if (req.session.role == 'HR') {

      // Total meetings accepted
      totalMeetingsAccepted = await meetings.count({
        where: { alloted_HR: req.session.userid, status: 'Booked' }
      });

      let currentDate = moment(new Date()).format('YYYY-MM-DD'); // Use 'YYYY-MM-DD' for a format compatible with most databases

      // Calculate the start date of the current month
      let startDateOfMonth = moment(currentDate, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');

      // Total meetings completed within the current month
      totalMeetingsCompletedCurrentMonth = await meetings.count({
        where: {
          alloted_HR: req.session.userid,
          process_status: '1',
          createdAt: {
            [Op.between]: [startDateOfMonth, currentDate]
          }
        }
      });

      totalMeetingsCompleted = await meetings.count({
        where: {
          alloted_HR: req.session.userid,
          process_status: '1'
        }
      });
    }
    res.render("dash_index", { locals: { responseData, blogsData, testimonialsData, meetingsData }, refCount, session: req.session, qryData, totalMeetingsAccepted, totalMeetingsCompletedCurrentMonth, totalMeetingsCompleted });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.redirect("/login");
  }
};

exports.contact_details = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'HR') {
    ContactUs.findAll()
      .then(data => {
        res.render("contact_details", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");

};

exports.registration_details = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin') {
    Partner.findAll()
      .then(data => {
        res.render("registration_details", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });


  } else
    res.render("login");

};

exports.help = (req, res) => {

  if (req.session.role) {
    res.render("error-404");

  } else
    res.redirect("/login");
};

exports.add_feedback = (req, res) => {

  if (req.session.role == 'User' || req.session.role == 'HR') {
    res.render('add_feedback');
  } else
    res.redirect("/login");

};

exports.getTokenData = async (req, res) => {

  if (req.session.role == 'Master') {
    const tokenData = (await Token.findOne({ raw: true }));
    res.render("update_token", { tokenData });
  } else
    res.redirect("/login");
};



exports.updateTokenData = async (req, res) => {

  if (req.session.role == 'Master') {
    if (!req.body.token) {
      res.redirect("/error-500");
      return;
    }
    await Token.update({ token: req.body.token }, { where: { id: req.body.id } });
  } else
    res.redirect("/login");
};

exports.add_job_seekers = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'User') {
    res.render('add_job_seekers', { locals: undefined, recordType: 'new', ViewUser: 'add', session: req.session });

  } else
    res.redirect("/login");

};
exports.add_ques = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    res.render('add_questions', { locals: undefined, recordType: 'new' });
  } else
    res.redirect("/login");

};

exports.add_report = async (req, res) => {

  if (req.session.role == 'HR') {
    const id = req.query.id;
    let meeting_details = await db.meetings.findAll({
      where: {
        id: id,
      },
      attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'meeting_id', 'process_status'],
      raw: true
    });
    let report_data = await Reports.findAll({ where: { meeting_id: meeting_details[0].meeting_id } })
    let dashLogin_detail = await User.findOne({ where: { email: meeting_details[0].email } });

    let shortname, mou_data = undefined;
    if (dashLogin_detail.createdby.includes('_')) {
      // Split the string after the underscore
      shortname = dashLogin_detail.createdby.split('_')[1];
      mou_data = await Mou.findOne({ where: { shortname: shortname } });
    }
    res.render('add_report', {
      meeting_details: !meeting_details ? undefined : meeting_details,
      report_data: !report_data ? undefined : report_data,
      mou_data: !mou_data ? undefined : mou_data
    });
  } else
    res.redirect("/login");
};

exports.save_report = async (req, res) => {
  try {
    const mid = req.body.data_id;
    const rid = req.body.rpt_id;
    let meeting_details = await db.meetings.findAll({
      where: {
        id: mid,
      },
      attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'meeting_id', 'process_status'],
      raw: true
    });
    const data = {
      meeting_id: meeting_details[0].meeting_id,
      interviewername: req.body.interviewerName,
      candidateid: req.body.candidateId,
      candidatename: req.body.candidateName,
      candidateemail: req.body.candidateEmail,
      candidatephone: req.body.candidatePhone,
      collegename: req.body.candidateCollege,
      interviewpreparedness: req.body.preparednessRating,
      confidencenervousness: req.body.confidenceRating,
      nonverbalcommunication: req.body.nonverbalRating,
      verbalcommunication: req.body.verbalRating,
      teamwork: req.body.teamworkRating,
      computerproficiency: req.body.computerRating,
      enthusiasmmotivation: req.body.enthusiasmRating,
      timemanagement: req.body.timeManagementRating,
      worklifebalance: req.body.workLifeRating,
      achievementsaccomplishments: req.body.achievementsRating,
      fresherexperienced: req.body.fresherExperienced,
      comments: req.body.comments,
      updatedAt: new Date()
    };
    if (!rid) {
      let mdata = {
        process_status: '1',
        updatedAt: new Date()
      }
      await Reports.create(data)
      await meetings.update(mdata, { where: { id: mid }, raw: true, });
    } else
      await Reports.update(data, { where: { id: rid }, raw: true, });
    res.redirect(`/add_report?id=${mid}`);
  } catch (error) {
    console.log(error);
    res.redirect("/error-500");
  };

};

exports.generate_report = async (req, res) => {

  if (req.session.role == 'HR') {
    const id = req.params.id;
    let meeting_details = await db.meetings.findAll({
      where: {
        id: id,
      },
      attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'meeting_id', 'process_status'],
      raw: true
    });
    let report_data = await Reports.findOne({ where: { meeting_id: meeting_details[0].meeting_id } })
    res.render('add_report', {
      meeting_details: !meeting_details ? undefined : meeting_details,
      report_data: !report_data ? undefined : report_data
    });
  } else
    res.redirect("/login");
};
exports.view_report = async (req, res) => {

  if (req.session.role == 'User') {
    const id = req.params.id;

    let report_data = await Reports.findAll({ where: { id: id } })
    let dashLogin_detail = await User.findOne({ where: { email: report_data[0].candidateemail } });
    let reponse_detail = await Response.findOne({ where: { emailid: report_data[0].candidateemail } });
    let meeting_detail = await meetings.findOne({ where: { meeting_id: report_data[0].meeting_id } });
    let shortname, mou_data = undefined;
    if (dashLogin_detail.createdby.includes('_')) {
      // Split the string after the underscore
      shortname = dashLogin_detail.createdby.split('_')[1];
      mou_data = await Mou.findOne({ where: { shortname: shortname } });
    }

    // Convert the string to a Date object
    const dateObject = new Date(meeting_detail.start_time);

    // Get the date in YYYY-MM-DD format
    const interviewDate = dateObject.toISOString().split('T')[0];


    res.render('report', {
      locals: report_data,
      mou_data: !mou_data ? undefined : mou_data, session: req.session, dashLogin_detail, reponse_detail, meeting_detail, interviewDate
    });
  } else
    res.redirect("/login");
};

exports.report_details = async (req, res) => {

  if (req.session.role == 'User') {
    try {
      let data = await Reports.findAll({
        where: {
          candidateemail: req.session.userid
        }
      });

      const currentDate = moment(); // Get the current date and time
      // Filter the data based on the criteria
      data = data.filter(report => {
        const createdAtDate = moment(report.createdAt, 'YYYY-MM-DD HH:mm:ss.SSSZ');
        const hoursDifference = currentDate.diff(createdAtDate, 'hours');

        return hoursDifference >= 24;
      });

      res.render("report_details", { locals: data });
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else
    res.render("login");
}

exports.add_testimonials = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_testimonials', {
      locals: undefined,
    });
  } else
    res.redirect("/login");
};
exports.edit_testimonials = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    Testimonials.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_testimonials', {
            locals: data,
          });
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.view_testimonials = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Testimonials.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("view_testimonials", {
          locals: data,
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.save_testimonials = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const data = {
      photo: req.file.filename,
      description: req.body.description,
      author: req.body.author
    };
    if (!req.query.id) {
      // Create a Tutorial:
      Testimonials.create(data, { raw: true })
        .then(data => {
          res.redirect("view_testimonials");

        })
        .catch(err => {
          console.error(err);
          res.redirect("/error-500");
        });
    }
    else {
      Testimonials.update(data, {
        where: {
          id: req.query.id
        },
        raw: true,
      })
        .then(data => {
          res.redirect("view_testimonials");
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({
            message: "Error updating testimonials with id=" + id
          });
        });
    }
  }
  else
    res.redirect("/login");
});
exports.update_testimonials = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    if (req.file) {
      var imageFile = req.file;
    } else {
      var imageFile = req.body.photo_file_name;
    }
    const data = {
      photo: imageFile.filename,
      description: req.body.description,
      author: req.body.author
    };

    await Testimonials.update(data, {
      where: {
        id: id,
      },
      raw: true,
    })
      .then(data => {
        res.redirect("view_testimonials");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating testimonials with id=" + id
        });
      });
  }
});
exports.testimonials_delete = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    Testimonials.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/view_testimonials");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/login");
  }
};


// blogs
exports.add_blogs = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_blogs', {
      locals: undefined,
    });
  } else
    res.redirect("/login");
};
exports.edit_blogs = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    Blogs.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_blogs', {
            locals: data,
          });
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.preview_blogs = (req, res) => {
  const url_title = req.params.url_title;

  // Blogs.findByPk(id)
  Blogs.findOne({ where: { url_title: url_title } })
    .then(data => {
      if (data) {
        res.render('preview_blogs', {
          locals: data,
        });
      } else {
        res.redirect("/blog");
      }
    })
    .catch(err => {
      console.error(err);
      res.redirect("/blog");
    });
};
exports.view_blogs = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Blogs.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("view_blogs", {
          locals: data,
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.save_blogs = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const data = {
      url_title: req.body.url_title,
      photo: req.file.filename,
      summary: req.body.description,
      heading: req.body.title,
      metatitle: req.body.title,
      metadescription: req.body.metadescription,
      metakeywords: req.body.metakeywords,
    };
    Blogs.create(data, { raw: true })
      .then(data => {
        res.redirect("view_blogs");

      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  }
  else
    res.redirect("/login");
});
exports.update_blogs = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    if (req.file) {
      var imageFile = req.file;
    } else {
      var imageFile = req.body.photo_file_name;
    }
    const data = {
      url_title: req.body.url_title,
      photo: imageFile.filename,
      summary: req.body.description,
      heading: req.body.title,
      metatitle: req.body.title,
      metadescription: req.body.metadescription,
      metakeywords: req.body.metakeywords
    };

    await Blogs.update(data, {
      where: {
        id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("view_blogs");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating blogs with id=" + id
        });
      });
  }
});
exports.blogs_delete = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    Blogs.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/view_blogs");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/login");
  }
};


// exports.view_job_seekers = async (req, res) => {

//   await Response.findAll({ where: { urole: 'User' } })
//     .then(async data => {
//       if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'SubAdmin' || req.session.role == 'HR') {
//         const results = [];
//         fs.createReadStream('db/data.csv')
//           .pipe(csv())
//           .on('data', (data) => results.push(data))
//           .on('end', () => {
//             res.render('view_job_seekers', { locals: data, srole: req.session.role, ViewUser: 'view' });
//           });
//       }
//       else
//         res.redirect("/login");
//     })
//     .catch(err => {
//       res.redirect("/error-500");
//     });
// };

exports.view_job_seekers = async (req, res) => {
  try {
      if (req.session.role != 'Master' && req.session.role != 'Admin' && req.session.role != 'SubAdmin' && req.session.role != 'HR')
      return res.redirect("/login");
    
    // Fetching data from responses table where urole is 'User'
    const responses = await Response.findAll({ where: { urole: 'User' } });

    // Extracting emails from responses to use in the next query
    const emails = responses.map(response => response.emailid);

    // Fetching two_step and role from dashlogins where email is in the emails list and role is 'User'
    const usersData = await User.findAll({
      attributes: ['email', 'two_step'],
      where: {
        email: emails,
        role: 'User'
      }
    });
    
    // Creating a map of email to two_step for quick lookup
    const twoStepMap = {};
    usersData.forEach(user => {
      twoStepMap[user.email] = user.two_step;
    });

     // Merging two_step into response data
     const responseData = responses.map(response => {
      const user = usersData.find(user => user.email === response.emailid);
      return {
        ...response.dataValues, // Accessing Sequelize model properties directly
        two_step: user ? user.two_step : 0 // Adding two_step if user data found, or null
      };
    });

    res.render('view_job_seekers', { locals: responseData, srole: req.session.role, ViewUser: 'view' });
  } catch (err) {
    console.error('Error:', err);
    res.redirect("/error-500");
  }
};

exports.edit_job_seeker = async (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {
    // const results = [];
    // fs.createReadStream('db/data.csv')
    // .pipe(csv())
    // .on('data', (data) => results.push(data))
    // .on('end', () => {
    // let college = results;
    // res.render('data', { data: results });
    // });  
    await Response.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_job_seekers', { locals: data, recordType: 'exsist', ViewUser: 'edit' });

        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        console.error(err);
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.edit_details = async (req, res) => {


  const email = req.session.userid;
  if (req.session.role == 'User') {
    await Response.findOne({ where: { emailid: email } })
      .then(data => {
        res.render('add_job_seekers', { locals: data, recordType: 'exsist', ViewUser: 'edit' });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.view_job_detail = (req, res) => {

  const id = req.query.id;
  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'SubAdmin') {
    Response.findByPk(id)
      .then(async data => {
        res.render('add_job_seekers', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.view_details = (req, res) => {

  const email = req.session.userid;
  if (req.session.role == 'User') {
    Response.findOne({ where: { emailid: email } })
      .then(async data => {
        res.render('add_job_seekers', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};

exports.save_job_seekers = (upload.fields([{ name: 'photo' }, { name: 'resume' }]), async function (req, res, next) {

  let googleData;
  if (req.files['photo']) {
    var imageFile = req.files['photo'][0];
  } else {
    var imageFile = req.body.photo_file_name;
  }
  if (req.files['resume']) {
    pdfFile = req.files['resume'][0];
    const response = await uploadFileToDrive(req, pdfFile);
    const publicUrls = await generatePublicUrl(response.id);
    googleData = {
      filename: response.name,
      fileId: response.id,
      publicUrls: publicUrls.webContentLink
    };
  } else {
    googleData = req.body.resume_file_name;
  }

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {

    const data = {
      name: req.body.name,
      emailid: req.body.email,
      password: req.body.password,
      phonenumber: req.body.phonenumber,
      whatsappnumber: req.body.whatsappnumber,
      area: req.body.area,
      dob: req.body.dob,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      gender: req.body.gender,
      languages: req.body.languages,
      marragestatus: req.body.maritalstatus,
      upload_photo: imageFile.filename,
      resume_file: googleData,
      skill1: req.body.skill1,
      skill2: req.body.skill2,
      skill3: req.body.skill3,
      skill4: req.body.skill4,
      skill5: req.body.skill5,
      exp_seeker_type: req.body.expd_seeker_type,
      company_project_name: req.body.expd_company_name,
      project_role_summary: req.body.expd_psummary,
      position: req.body.expd_position,
      exp_sdate: req.body.expd_sdate,
      exp_edate: req.body.expd_edate,
      experience: req.body.expd_experience,
      qualification_10: req.body.qualification_10,
      university_10: req.body.university_10,
      ctype_10: req.body.ctype_10,
      percent_10: req.body.percent_10,
      yos_10: req.body.yos_10,
      yoc_10: req.body.yoc_10,
      college_10: req.body.college_10,
      state_10: req.body.state_10,

      qualification_12: req.body.qualification_12,
      university_12: req.body.university_12,
      ctype_12: req.body.ctype_12,
      percent_12: req.body.percent_12,
      yos_12: req.body.yos_12,
      yoc_12: req.body.yoc_12,
      college_12: req.body.college_12,
      state_12: req.body.state_12,

      qualification_diploma: req.body.qualification_diploma,
      university_diploma: req.body.university_diploma,
      ctype_diploma: req.body.ctype_diploma,
      percent_diploma: req.body.percent_diploma,
      yos_diploma: req.body.yos_diploma,
      yoc_diploma: req.body.yoc_diploma,
      college_diploma: req.body.college_diploma,
      state_diploma: req.body.state_diploma,

      ugqualification: req.body.ugqualification,
      uguniversity: req.body.uguniversity,
      ugctype: req.body.ugctype,
      ugpercent: req.body.ugpercent,
      ugyos: req.body.ugyos,
      ugyoc: req.body.ugyoc,
      ugcollege: req.body.collegeug,
      ugstate: req.body.ugstate,

      pgqualification: req.body.pgqualification,
      pguniversity: req.body.pguniversity,
      pgctype: req.body.pgctype,
      pgpercent: req.body.pgpercent,
      pgyos: req.body.pgyos,
      pgyoc: req.body.pgyoc,
      pgcollege: req.body.pgcollege,
      pgstate: req.body.pgstate,

      job_category: req.body.job_category,
      job_location: req.body.job_location,
      job_role: req.body.job_role,
      job_industry: req.body.job_industry,
      job_department: req.body.job_department,
      preferred_designation: req.body.job_designation,
      preferred_ctc: req.body.job_pref_ctc,
      present_ctc: req.body.job_pres_ctc,
      job_type: req.body.job_type,
      job_jdate: req.body.job_jdate,
      referee_name: req.body.refree_name,
      referee_num: req.body.refree_num,
      referee_email: req.body.refree_email,
      referee_paynum: req.body.refree_paynum,
      urole: 'User',

      phone_verify: 'unverified',
      email_verify: 'unverified'
    };
    let user_data = await (User.findOne({ where: { email: req.body.email } }))
    let res_data = await (Response.findOne({ where: { emailid: req.body.email } }))
    if (!res_data || !user_data) {

      await User.create({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'User',
        createdby: req.session.userid
      })
      await Response.create(data)
        .then(async data => {
          await Response.update({
            application_id: 'UP' + moment().format('YY') + data.id,
          }, {
            where: { emailid: req.body.email, }
          });
          res.redirect("view_job_seekers");

        })
        .catch(err => {
          console.error(err);
          res.redirect("/error-500");
        });
    }
    else {
      await User.update({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'User',
        createdby: req.session.role
      }, {
        where: { email: req.body.email }
      })
      Response.update(data, {
        where: { emailid: req.body.email }
      })
        .then(data => {
          if (!(req.session.role === 'User')) {
            res.redirect("view_job_seekers");
          } else {
            res.redirect("view_details");
          }

        })
        .catch(err => {
          console.error(err);
          res.status(500).send({
            message: "Error updating job seekers with id=" + id
          });
        });
    }
    req.session.phonenumber = req.body && req.body.phonenumber ? req.body.phonenumber : '';
  }
  else
    res.redirect("/login");
});



exports.edit_ques = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    Question.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_questions', {
            locals: data
          });
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.save_ques = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    const data = {
      question: req.body.question,
      type: req.body.type,
      remarks: req.body.remarks,
      order_id: req.body.order_id,
      important: req.body.important,
      options: req.body.options ? JSON.parse(req.body.options) : null
    };
    if (!req.query.id) {
      // Create a Tutorial:
      Question.create(data)
        .then(data => {
          res.redirect("view_ques");

        })
        .catch(err => {
          CompositionListInstance.log(err);
          res.redirect("/error-500");
        });
    }
    else {
      Question.update(data, {
        where: {
          id: req.query.id
        }
      })
        .then(data => {
          res.redirect("view_ques");
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating question with id=" + id
          });
        });
    }
  }
  else
    res.redirect("/login");
};
exports.update_ques = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    const id = req.body.id;
    const data = {
      question: req.body.question,
      type: req.body.type,
      remarks: req.body.remarks,
      order_id: req.body.order_id,
      important: req.body.important,
      options: req.body.options ? JSON.parse(req.body.options) : null
    };
    Question.update(data, {
      where: {
        id: id,
      }
    })
      .then(data => {
        res.redirect("view_ques");
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating question with id=" + id
        });
      });
  }
};
exports.view_feedbacks = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Feedback.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'SubAdmin' || req.session.role == 'HR') {
        res.render("view_feedbacks", {
          locals: data
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.save_feedback = (req, res) => {

  if (req.session.role == 'User') {
    const data = {
      username: req.session.username,
      email: req.session.userid,
      title: req.body.title,
      description: req.body.description,
    };

    Feedback.create(data)
      .then(data => {
        res.redirect("dash_index");
      })
      .catch(err => {
        res.redirect("/error-500");
        console.error(err);
      });
  }
  else
    res.redirect("/login");
};


// blogs
exports.add_settings = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_settings', {
      locals: undefined,
    });
  } else
    res.redirect("/login");
};
exports.edit_settings = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    Setting.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_settings', {
            locals: data,
          });
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};

exports.view_settings = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Setting.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("view_settings", {
          locals: data
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.save_settings = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    const data = {
      phone: req.body.phone,
      email: req.body.email,
      timming: req.body.timming,
      website: req.body.website,
      location: req.body.location,
    };

    await Setting.update(data, {
      where: {
        id: id,
      }
    })
      .then(data => {
        res.redirect("/settings?id=1");
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating settings with id=" + id
        });
      });
  }
};
exports.view_ques = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  Question.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'SubAdmin') {
        res.render("view_questions", {
          locals: data,
          srole: req.session.role
        });
      }
      else
        res.redirect("/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};
exports.delete_ques = async (req, res) => {
  const id = req.params.id;

  await Question.destroy({
    where: { id: id }
  })
    .then(User => {
      res.redirect("/view_ques");
      // res.render('dash_index');     
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete question with id=" + id
      });
    });
};

exports.job_seeker_delete = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    let res_data = await (Response.findOne({ where: { id: id } }))

    await User.destroy({
      where: { email: res_data.emailid }
    })
    await Response.destroy({
      where: { id: id }
    })
      .then(data => {
        res.redirect("/view_job_seekers");
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/login");
  }
};

exports.testimonials_delete = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    Testimonials.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/view_testimonials");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/login");
  }
};

exports.get_logout = (req, res) => {
  req.session.destroy();
  res.redirect('login');
};

const data_board = [];

fs.createReadStream('db/board.csv')
  .pipe(csv())
  .on('data', (data) => {
    data_board.push(data.board);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });


exports.get_board_data = (req, res) => {
  const { query } = req.query;
  const matches = data_board.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  //  const matches = data.filter(item => item.toLowerCase() == query.toLowerCase()).slice(0, 10);
  res.json(matches);
};

const data_college = [];

fs.createReadStream('db/college.csv')
  .pipe(csv())
  .on('data', (row) => {
    data_college.push(row.college);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });


exports.get_college_data = (req, res) => {
  const { query } = req.query;
  const matches = data_college.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  //  const matches = data.filter(item => item.toLowerCase() == query.toLowerCase()).slice(0, 10);
  res.json(matches);
};

const data_university = [];

fs.createReadStream('db/university.csv')
  .pipe(csv())
  .on('data', (row) => {
    data_university.push(row.university);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

exports.get_university_data = (req, res) => {
  const { query } = req.query;
  const matches = data_university.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  //  const matches = data.filter(item => item.toLowerCase() == query.toLowerCase()).slice(0, 10);
  res.json(matches);
};

const data_skills = [];

fs.createReadStream('db/skills.csv')
  .pipe(csv())
  .on('data', (row) => {
    data_skills.push(row.Skills);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

exports.get_skills_data = (req, res) => {
  const { query } = req.query;
  const matches = data_skills.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  //  const matches = data.filter(item => item.toLowerCase() == query.toLowerCase()).slice(0, 10);
  res.json(matches);
};

const data_jobs = [];

fs.createReadStream('db/jobs.csv')
  .pipe(csv())
  .on('data', (row) => {
    data_jobs.push(row.jobs);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

exports.get_jobs_data = (req, res) => {
  const { query } = req.query;
  const matches = data_jobs.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  //  const matches = data.filter(item => item.toLowerCase() == query.toLowerCase()).slice(0, 10);
  res.json(matches);
};


// corporate Corner

exports.corporatecornerlist = async (req, res) => {
  try {
    // Assuming 'corporatecornerlist' is an EJS template in your views directory
    const corporatecorner = await Corporatecorner.findAll();
    if (!corporatecorner) {
      return res.redirect("partnernotfound"); // Redirect if Corporatecorner not found
    }

    res.render('corporatecornerlist',{corporatecorners: corporatecorner});
  } catch (err) {
    console.error('Error rendering corporate corner list:', err);
    // Respond with an appropriate error message or status code
    res.status(500).send('Internal Server Error');
  }
};


exports.corporatecorner = async (req, res) => {
  const company_url = req.params.company_name.toLowerCase();
  try {
    // Find the Corporatecorner record by company_url

    const corporatecorner = await Corporatecorner.findOne({ where: { company_url: company_url } });
    if (!corporatecorner) {
      return res.redirect("partnernotfound"); // Redirect if Corporatecorner not found
    }

    // Find associated Corporateservices by partner_id (assuming partner_id is associated with Corporatecorner)
    const corporateservice = await corporateservices.findAll({ where: { partner_id: corporatecorner.partner_id } });

    res.render('corporatecorner', { corporatecorner: corporatecorner, corporateservices: corporateservice });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.redirect("/"); // Redirect to homepage in case of any errors
  }
};

exports.viewcorporatecorner = (req, res) => {
  if (req.session.role === 'Master') {
    // Fetch data from Corporatecorner and corporateservices concurrently using Promise.all
    Promise.all([
      Corporatecorner.findAll(),
      corporateservices.findAll()
    ])
      .then(([corporatecorners, corporateservices]) => {
        res.render("view_corporatecorner", {
          corporatecorners, // Pass Corporatecorner data to view
          corporateservices, // Pass corporateservices data to view
          session: req.session
        });
      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  } else {
    res.redirect("/login");
  }
};
exports.addcorporatecorner = async (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_corporatecorner', {
      locals: undefined,
    });
  } else
    res.redirect("/login");
};
exports.savecorporatecorner = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const data = {
      heading: req.body.heading,
      subheading: req.body.subheading,
      company_name: req.body.company_name,
      company_url: req.body.company_category.replace(/\s+/g, '-').toLowerCase(),
      company_category: req.body.company_category,
      company_address: req.body.company_address,
      company_description: req.body.company_description,
      contact_person: req.body.contact_person,
      partner_status: req.body.contact_status,
      email: req.body.email,
      phone: req.body.phone,
      photo: imageFile.filename,
    };
    console.log(data);
    Corporatecorner.create(data, { raw: true })
      .then(data => {
        res.redirect("viewcorporatecorner");

      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  }
  else
    res.redirect("/login");
});

exports.editcorporatecorner = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    Corporatecorner.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_corporatecorner', {
            locals: data,
          });
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
};
exports.updatecorporatecorner = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    if (req.file) {
      var imageFile = req.file;
    } else {
      var imageFile = req.body.photo_file_name;
    }
    const data = {
      heading: req.body.heading,
      subheading: req.body.subheading,
      company_name: req.body.company_name,
      company_category: req.body.company_category,
      company_address: req.body.company_address,
      company_description: req.body.company_description,
      contact_person: req.body.contact_person,
      partner_status: req.body.contact_status,
      email: req.body.email,
      phone: req.body.phone,
      photo: imageFile.filename,
    };

    await Corporatecorner.update(data, {
      where: {
        partner_id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("viewcorporatecorner");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating services with id=" + id
        });
      });
  }
});

exports.delete_corporatecorner = async (req, res) => {
  try {
    if (req.session.role === 'Master') { // Assuming session information is stored in req.session.role
      const id = req.query.id;

      // Use Promise.all() to delete both Corporatecorner and associated Corporateservices
      await Promise.all([
        Corporatecorner.destroy({ where: { partner_id: id } }),
        corporateservices.destroy({ where: { partner_id: id } })
      ]);

      res.redirect("/viewcorporatecorner");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error("Error deleting corporate corner:", err);
    res.redirect("/error-404"); // Redirect to error page in case of error
  }
};



//coorporate services
exports.addcorporateservices = async (req, res) => {
  if (req.session.role == 'Master') {
    try {
      const corporateCorners = await Corporatecorner.findAll();
      res.render("add_corporateservices", {
        corporateCorners, // Pass Corporatecorner data to view
        locals: undefined,
      });
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.redirect("/login");
  }
};

exports.save_corporateservices = (upload.single('photo'), async (req, res) => {
  if (req.session.role == 'Master') {
    try {
      const data = {
        partner_id: req.body.partner_id,
        service_name: req.body.service_name,
        service_description: req.body.service_description,
        service_price: req.body.service_price,
        service_status: req.body.service_status,
      };

      await corporateservices.create(data, { raw: true });
      res.redirect("viewcorporatecorner");
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.redirect("/login");
  }
});

exports.editcorporateservices = async (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    try {
      const corporateCorners = await Corporatecorner.findAll();
      const data = await corporateservices.findByPk(id);
      if (data) {
        res.render('add_corporateservices', {
          locals: data,
          corporateCorners
        });
      } else {
        res.redirect("/viewcorporatecorner");
      }
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.redirect("/login");
  }
};

exports.update_corporateservices = (upload.single('photo'), async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    if (req.file) {
      var imageFile = req.file;
    } else {
      var imageFile = req.body.photo_file_name;
    }
    const data = {
      partner_id: req.body.partner_id,
      service_name: req.body.service_name,
      service_description: req.body.service_description,
      service_price: req.body.service_price,
      photo: imageFile.filename,
    };

    await corporateservices.update(data, {
      where: {
        service_id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("viewcorporatecorner");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating services with id=" + id
        });
      });
  }
});
exports.delete_corporateservices = async (req, res) => {
  if (req.session.role == 'Master') {
    const id = req.query.id;
    try {
      await corporateservices.destroy({
        where: { service_id: id }
      });
      res.redirect("/viewcorporatecorner");
    } catch (err) {
      console.error(err);
      res.redirect("/error-404");
    }
  } else {
    res.redirect("/login");
  }
};

exports.save_coorporate = async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    subject: 'Request For Services - ' + req.body.service,
    message: req.body.phone,
    category: 'corporate',
  };
  sendrequestreceivedmail('upreakofficial@gmail.com', req.body.email, req.body.name, req.body.phone, req.body.service,);
  sendrequestmail(req.body.email, req.body.name, req.body.service);
  await ContactUs.create(data)
    .then(data => {
      alert("Thank You!");
      res.redirect(req.headers.referer || '/');
    })
    .catch(err => {
      res.redirect("/error-500");
    });

};

//jobs
exports.list_job_application = async (req, res) => {
  try {
    if (req.session.role != 'Master' && req.session.role != 'Admin' && req.session.role != 'User') {
      return res.redirect("/error-500");
    }

    let jobs = await Jobs.findAll({ where: { status: 1 } });

    let applications;
    if (req.session.role === 'Master' || req.session.role === 'Admin') {
      applications = await JobApplications.findAll({ where: { status: 1 } });
    } else if (req.session.role === 'User') {
      let email = req.session.userid;
      applications = await JobApplications.findAll({ where: { status: 1, email } });
    }
    res.render("list_job_application", { locals: applications, srole: req.session.role, session: req.session, jobs });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  }
};

exports.list_jobs = async (req, res) => {
  try {
    if (req.session.role != 'Master' && req.session.role != 'Admin')
      return res.redirect("/error-500");
    let data = await Jobs.findAll({ where: { status: 1 } });

    res.render("list_jobs", { locals: data, srole: req.session.role, session: req.session });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  };
};

exports.add_job = async (req, res) => {
  try {
    if (req.session.role != 'Master' && req.session.role != 'Admin')
      return res.redirect("/error-500");
    res.render("add_job", { locals: undefined, session: req.session });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  };
};

exports.edit_job = async (req, res) => {
  try {
    if ((req.session.role != 'Master' && req.session.role != 'Admin') || !req.query.id)
      return res.redirect("/error-500");
    let data = await Jobs.findOne({ where: { status: 1, id: req.query.id } });
    res.render("add_job", { locals: data, session: req.session });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  };
};

  exports.save_job_application = (upload.single('resume'), async (req, res) => {
    let job_id = req.body.job_id;
    try {
      const job_application_data = {
        name: req.body.name,
        job_id: req.body.job_id,
        email: req.body.email,
        phone_number: req.body.phone_number,
        resume: req.file ? req.file.filename : '',
        status: 1,
      };
      await JobApplications.create(job_application_data);
      req.flash("Success", "Thank you for applying! We will review your application and get back to you soon.");
      res.redirect(`/job_details?jobId=${job_id}`);
    } catch (err) {
      console.error("Error saving job application:", err);
      req.flash("Error", "There was an error processing your application. Please try again later.");
      res.redirect(`/job_details?jobId=${job_id}`);
    }
  });

exports.save_job = (upload.single('photo'), async (req, res) => {
  if (req.session.role != 'Master' && req.session.role != 'Admin')
    return res.redirect("/login");
  try {
    const job_data = {
      heading: req.body.heading,
      sub_heading: req.body.sub_heading,
      job_type: req.body.job_type,
      location: req.body.location,
      company_size: req.body.company_size,
      website: req.body.website,
      relocation: req.body.relocation,
      amount: req.body.amount,
      description: req.body.description,
      photo: req.file ? req.file.filename : req.body.photo_file_name,
      status: 1,
      vacancy: req.body && req.body.vacancy ? req.body.vacancy : null,
      experience: req.body.experience
    };

    if (req.body.id)
      await Jobs.update(job_data, { where: { id: req.body.id } });
    else
      await Jobs.create(job_data);

    res.redirect("list_jobs");
  } catch (err) {
    console.error("Error saving job:", err);
    res.redirect("/error-500");
  }
});


exports.job_delete = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.session.role != 'Master')
      return res.redirect("/error-500");
    const deletedCount = await Jobs.update({ status: 0 }, { where: { id: id } });
    if (deletedCount)
      return res.redirect("/list_jobs");
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).send({
      message: `Could not delete job with id ${id}.`
    });
  }
};


exports.successGoogleLogin = async (req, res) => {
  try {
    if (!req.user)
      res.redirect('/error-500');

    // Check if the user exists in the database and add them if not
    let existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.user.emails[0].value },
          { googleid: req.user.id }
        ]
      }
    });

    let existingResp = await db.responses.findOne({
      attributes: ['phonenumber', 'application_id'],
      where: { emailid: req.user.emails[0].value },
    });

    if (!existingUser && !existingResp) {

      existingUser = await User.create({
        googleid: req.user.id,
        email: req.user.emails[0].value,
        username: req.user.displayName,
        password: req.user.id,
        role: 'User',
        createdby: 'User'
      });

      existingResp = await db.responses.create({
        name: req.user.displayName,
        emailid: req.user.emails[0].value,
        password: req.user.id,
        urole: 'User',
        phone_verify: 'unverified',
        whatsapp_verify: 'unverified',
        email_verify: 'unverified'
      });
    }

    req.session.id = existingUser.id;
    req.session.userid = existingUser.email; // Assuming 'email' is the user's email address
    req.session.username = existingUser.username;
    req.session.role = existingUser.role;
    req.session.createdby = existingUser.createdby;
    req.session.application_id = existingResp?.application_id || ''; // Using optional chaining (?.)
    req.session.phonenumber = existingResp?.phonenumber || ''; // Using optional chaining (?.)

    // Create activity log for successful login
    await createActivityLog(existingUser.username, existingUser.email, existingUser.id, 'Google Login Successfully');
    res.redirect('/dash_index');

  } catch (err) {
    console.error(err);
    res.redirect('/error-500');
  }
}

exports.failureGoogleLogin = async (req, res) => {
  console.error(req);
  res.redirect('/error-500');
}

exports.otp = async (req, res) => {
  res.render('otp',{session:req.session});
}

// Verify Login OTP
exports.verify_login_otp = async (req, res) => {
  const {otp1, otp2, otp3, otp4, otp5, otp6, email} = req.body; 
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
      return res.redirect('/dash_index');
    });
  } catch (error) {
    console.error(error);
    req.flash('Error', 'Error while verifying OTP.');
    return res.redirect('/login');
  }
};