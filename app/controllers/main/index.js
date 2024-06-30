const db = rootRequire('app/models')
const moment = require("moment");
const { Op } = require('sequelize');

const {
  sendWelcomeEmail,
  sendRequestMail,
  sendRequestReceivedMail
} = require('../../utils/emailSender');

module.exports = {

  jobs: async (req, res) => {
    let data = await db.jobs.findAll({
      raw: true,
      order: [
        ['status', 'DESC'],
        ['id', 'DESC']
      ]
    });
    res.render('jobs', { locals: data, bData: undefined })
  },

  filtered_jobs: async (req, res) => {
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
      data = await db.jobs.findAll({
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
  },

  job_details: async (req, res) => {
    let job_id = req.query.jobId;
    let data = await db.jobs.findOne({ where: { job_id, status: 1 } });
    res.render('job_details', { locals: data })
  },

  save_ticket: async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      category: req.body.category,
    };
    await db.contact_us.create(data)
      .then(data => {
        alert("Thank You!");
        res.redirect('/panel/dash_index');
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  },

  save_contact: async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      category: req.body.category,
    };
    await db.contact_us.create(data)
      .then(data => {
        alert("Thank You!");
        res.redirect('/help_center');
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  },

  get_mou: async (req, res) => {
    const shortname = req.params.shortname;

    //  db.mou_registrations.findByPk(shortname) 
    db.mou_registrations.findOne({ where: { shortname: shortname } })
      .then(data => {
        if (data) {
          res.render('mou', { locals: data });
        } else {
          res.redirect("/panel/login");
        }
      })
      .catch(err => {
        res.redirect("/panel/login");
      });
  },

  register_mou: async (req, res) => {
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
      let user_registered = await db.responses.findOne({ where: { emailid: req.body.email } });
      if (!user_registered) {
        let dataid = await db.responses.create(data);
        await db.responses.update({
          application_id: 'UP1000' + dataid.id,
        }, {
          where: { emailid: req.body.email }
        });

        await db.dash_logins.create(ddata);
        let res_data = await db.responses.findOne({ where: { emailid: req.body.email } });
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
  },

  index: async (req, res) => {
    try {
      const [testimonials] = await Promise.all([
        db.testimonials.findAll(),
      ]);

      res.render("index", { testimonials });
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  },

  get_started: async (req, res) => {
    try {
      res.render("get_started");
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  },


  // resume_builder: async (req, res) => {
  //   try {
  //     res.render("resume_builder");
  //   } catch (err) {
  //     console.error(err);
  //     res.redirect("/error-500");
  //   }
  // },

  // resume_templates: async (req, res) => {
  //   try {
  //     res.render("resume_templates");
  //   } catch (err) {
  //     console.error(err);
  //     res.redirect("/error-500");
  //   }
  // },

  blog: async (req, res) => {
    try {
      let data = await db.blogs.findAll()
      res.render("blog", { locals: data });
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  },

  save_partner: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        city: req.body.city,
      };
      await db.partner_registrations.create(data);
      req.flash("Success", "Thank You for Registration!");
      res.redirect('registration_recruitment_partner');
    } catch (err) {
      console.error(err);
      req.flash('errors', 'Registration failed. Please try again.');
      res.redirect("/error-500");
    }
  },

  registration_recruitment_partner: async (req, res) => {
    res.render('registration_recruitment_partner');
  },

  about_us: async (req, res) => {
    res.render('aboutus');
  },

  help_center: async (req, res) => {
    let data = await db.settings.findAll()
      .then(data => {
        res.render("contactus", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  },

  services: async (req, res) => {
    res.render('services');
  },

  privacy_policy: async (req, res) => {
    res.render('privacypolicy');
  },

  terms_and_conditions: async (req, res) => {
    res.render('terms&conditions');
  },

  preview_blogs: async (req, res) => {
    const url_title = req.params.url_title;

    // db.blogs.findByPk(id)
    db.blogs.findOne({ where: { url_title: url_title } })
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
  },

  corporate_corner_list: async (req, res) => {
    try {
      // Assuming 'corporatecornerlist' is an EJS template in your views directory
      const corporateCorner = await db.corporate_corners.findAll();
      if (!corporateCorner) {
        return res.redirect("partnernotfound"); // Redirect if CorporateCorner not found
      }

      res.render('corporatecornerlist', { corporatecorners: corporateCorner });
    } catch (err) {
      console.error('Error rendering corporate corner list:', err);
      // Respond with an appropriate error message or status code
      res.status(500).send('Internal Server Error');
    }
  },

  corporate_corner: async (req, res) => {
    const company_url = req.params.company_name.toLowerCase();
    try {
      // Find the Corporatecorner record by company_url

      const corporateCorner = await db.corporate_corners.findOne({ where: { company_url: company_url } });
      if (!corporateCorner) {
        return res.redirect("partnernotfound"); // Redirect if corporateCorner not found
      }

      // Find associated Corporateservices by partner_id (assuming partner_id is associated with corporateCorner)
      const corporateservice = await db.corporate_services.findAll({ where: { partner_id: db.corporate_corners.partner_id } });

      res.render('corporatecorner', { corporatecorner: corporateCorner, corporateservices: corporateservice });
    } catch (err) {
      console.error("Error fetching data:", err);
      res.redirect("/"); // Redirect to homepage in case of any errors
    }
  },

  save_corporate: async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      subject: 'Request For Services - ' + req.body.service,
      message: req.body.phone,
      category: 'corporate',
    };
    sendRequestReceivedMail('upreakofficial@gmail.com', req.body.email, req.body.name, req.body.phone, req.body.service,);
    sendRequestMail(req.body.email, req.body.name, req.body.service);
    await db.contact_us.create(data)
      .then(data => {
        alert("Thank You!");
        res.redirect(req.headers.referer || '/');
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  },

  save_job_application: async (req, res) => {
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
      await db.job_applications.create(job_application_data);
      req.flash("Success", "Thank you for applying! We will review your application and get back to you soon.");
      res.redirect(`/job_details?jobId=${job_id}`);
    } catch (err) {
      console.error("Error saving job application:", err);
      req.flash("Error", "There was an error processing your application. Please try again later.");
      res.redirect(`/job_details?jobId=${job_id}`);
    }
  },

};