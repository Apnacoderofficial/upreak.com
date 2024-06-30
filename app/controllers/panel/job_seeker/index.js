const db = rootRequire('app/models');
const { sendMessageToWhatsApp } = require('../../../utils/whatsAppSender');
const { sendOTP } = require('../../../utils/smsOTPSender');
const moment = require("moment");
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');
const { sendVerificationEmail, sendVerificationSuccessEmail, sendVerificationFailureEmail } = require('../../../utils/emailSender');


exports.add_candidate_details = (req, res) => {
  if (req.session.role == 'Master' || req.session.role == 'Manager')
    res.render('add_candidate_details', { locals: undefined, recordType: 'new', srole: req.session.role, ViewUser: 'add', info: 'new' });
  else
    res.redirect("/panel/login");
};

exports.save_candidate_details = async function (req, res, next) {

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
        await db.candidate_details.create(data)
      else
        await db.candidate_details.update(data, { where: { id: id } })
      res.redirect("/panel/list_candidate_details");
    } else
      return res.redirect("/error-500");
  } catch (err) {
    console.error("Error saving member:", err);
    res.redirect("/error-500");
  }
};

exports.edit_candidate_details = async (req, res) => {
  const id = req.query.id;

  if (req.session.role != 'Master' && req.session.role != 'Manager')
    return res.redirect("/error-500");
  await db.candidate_details.findByPk(id)
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
      return res.redirect("/panel/login");
    if (info == 'new')
      data = await db.candidate_details.findByPk(id)
    else
      data = await db.responses.findByPk(id)
    res.render('add_candidate_details', { locals: data, ViewUser: 'view', srole: req.session.role, info });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  };
};

exports.list_candidate_details = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Manager') {
    await db.candidate_details.findAll({})
      .then(data => {
        res.render("list_candidate_details", { data, srole: req.session.role });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else
    res.redirect("/panel/login");
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
    res.redirect("/panel/login");
};

exports.delete_candidate_details = async (req, res) => {
  session = req.session;
  try {
    if (req.session.role != 'Master')
      return res.redirect("/error-404");
    await db.candidate_details.destroy({ where: { id: req.params.id } });
    res.redirect("/panel/list_candidate_details");
  } catch (err) {
    console.error("Error deleting details:", err);
    res.redirect("/error-500");
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

exports.verify_job_seeker = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {
    db.responses.findOne({
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
    res.redirect("/panel/login");

};

exports.verify_job_seeker1 = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {
    db.responses.findOne({
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
    res.redirect("/panel/login");

};

exports.verify_job_seeker2 = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'User') {
    db.responses.findOne({
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
    res.redirect("/panel/login");

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
    db.responses.update({ phone_verify: "verified" }, {
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
    db.responses.update({ whatsapp_verify: "verified" }, {
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
    db.responses.update({ email_verify: "verified" }, {
      where: {
        emailid: email,
      }
    });
    res.render('verify_job_seeker2', { email: recipientEmail, otp: storedOTP, otpSent: true, verified: true });
  } else {
    res.render('verify_job_seeker2', { email: recipientEmail, otp: storedOTP, otpSent: true, verified: false });

  }
};

exports.add_job_seekers = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'User') {
    res.render('add_job_seekers', { locals: undefined, recordType: 'new', ViewUser: 'add', session: req.session });

  } else
    res.redirect("/panel/login");

};

exports.view_job_seekers = async (req, res) => {
  try {
    if (req.session.role != 'Master' && req.session.role != 'Admin' && req.session.role != 'SubAdmin' && req.session.role != 'HR')
      return res.redirect("/panel/login");

    // Fetching data from responses table where urole is 'User'
    const responses = await db.responses.findAll({ where: { urole: 'User' } });

    // Extracting emails from responses to use in the next query
    const emails = responses.map(response => response.emailid);

    // Fetching two_step and role from dashlogins where email is in the emails list and role is 'User'
    const usersData = await db.dash_logins.findAll({
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
    await db.responses.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_job_seekers', { locals: data, recordType: 'exsist', ViewUser: 'edit' });

        } else {
          res.redirect("/panel/login");
        }
      })
      .catch(err => {
        console.error(err);
        res.redirect("/panel/login");
      });
  } else {
    res.redirect("/panel/login");
  }
};
exports.edit_details = async (req, res) => {


  const email = req.session.userid;
  if (req.session.role == 'User') {
    await db.responses.findOne({ where: { emailid: email } })
      .then(data => {
        res.render('add_job_seekers', { locals: data, recordType: 'exsist', ViewUser: 'edit' });
      })
      .catch(err => {
        res.redirect("/panel/login");
      });
  } else {
    res.redirect("/panel/login");
  }
};
exports.view_job_detail = (req, res) => {

  const id = req.query.id;
  if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'SubAdmin') {
    db.responses.findByPk(id)
      .then(async data => {
        res.render('add_job_seekers', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/panel/login");
      });
  } else {
    res.redirect("/panel/login");
  }
};
exports.view_details = (req, res) => {

  const email = req.session.userid;
  if (req.session.role == 'User') {
    db.responses.findOne({ where: { emailid: email } })
      .then(async data => {
        res.render('add_job_seekers', { locals: data, ViewUser: 'view' });
      })
      .catch(err => {
        res.redirect("/panel/login");
      });
  } else {
    res.redirect("/panel/login");
  }
};

exports.save_job_seekers =  async function (req, res, next) {

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
    let user_data = await (db.dash_logins.findOne({ where: { email: req.body.email } }))
    let res_data = await (db.responses.findOne({ where: { emailid: req.body.email } }))
    if (!res_data || !user_data) {

      await db.dash_logins.create({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'User',
        createdby: req.session.userid
      })
      await db.responses.create(data)
        .then(async data => {
          await db.responses.update({
            application_id: 'UP' + moment().format('YY') + data.id,
          }, {
            where: { emailid: req.body.email, }
          });
          res.redirect("/panel/view_job_seekers");

        })
        .catch(err => {
          console.error(err);
          res.redirect("/error-500");
        });
    }
    else {
      await db.dash_logins.update({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'User',
        createdby: req.session.role
      }, {
        where: { email: req.body.email }
      })
      db.responses.update(data, {
        where: { emailid: req.body.email }
      })
        .then(data => {
          if (!(req.session.role === 'User')) {
            res.redirect("/panel/view_job_seekers");
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
    res.redirect("/panel/login");
};

exports.job_seeker_delete = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    let res_data = await (db.responses.findOne({ where: { id: id } }))

    await db.dash_logins.destroy({
      where: { email: res_data.emailid }
    })
    await db.responses.destroy({
      where: { id: id }
    })
      .then(data => {
        res.redirect("/panel/view_job_seekers");
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/panel/login");
  }
};