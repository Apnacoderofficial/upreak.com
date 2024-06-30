const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.list_job_application = async (req, res) => {
  try {
    if (req.session.role != 'Master' && req.session.role != 'Admin' && req.session.role != 'User') {
      return res.redirect("/error-500");
    }

    let jobs = await db.jobs.findAll({ where: { status: 1 } });

    let applications;
    if (req.session.role === 'Master' || req.session.role === 'Admin') {
      applications = await db.job_applications.findAll({ where: { status: 1 } });
    } else if (req.session.role === 'User') {
      let email = req.session.userid;
      applications = await db.job_applications.findAll({ where: { status: 1, email } });
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
    let data = await db.jobs.findAll({ where: { status: 1 } });

    res.render("/panel/list_jobs", { locals: data, srole: req.session.role, session: req.session });
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
    let data = await db.jobs.findOne({ where: { status: 1, id: req.query.id } });
    res.render("add_job", { locals: data, session: req.session });
  } catch (err) {
    console.error(err);
    res.redirect("/error-500");
  };
};

exports.save_job =  async (req, res) => {
  if (req.session.role != 'Master' && req.session.role != 'Admin')
    return res.redirect("/panel/login");
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
      await db.jobs.update(job_data, { where: { id: req.body.id } });
    else
      await db.jobs.create(job_data);

    res.redirect("/panel/list_jobs");
  } catch (err) {
    console.error("Error saving job:", err);
    res.redirect("/error-500");
  }
};

exports.job_delete = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.session.role != 'Master')
      return res.redirect("/error-500");
    const deletedCount = await db.jobs.update({ status: 0 }, { where: { id: id } });
    if (deletedCount)
      return res.redirect("/panel/list_jobs");
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).send({
      message: `Could not delete job with id ${id}.`
    });
  }
};