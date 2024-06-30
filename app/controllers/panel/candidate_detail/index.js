const db = rootRequire('app/models')
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

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
        const publicUrls = await generatePublicUrl(db.responses.id);
        googleData = {
          filename: db.responses.name,
          fileId: db.responses.id,
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