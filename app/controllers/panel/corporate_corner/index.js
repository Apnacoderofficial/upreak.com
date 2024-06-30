const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.view_corporate_corner = (req, res) => {
  if (req.session.role === 'Master') {
    // Fetch data from Corporatecorner and corporateservices concurrently using Promise.all
    Promise.all([
      db.corporate_corners.findAll(),
      db.corporate_services.findAll()
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
    res.redirect("/panel/login");
  }
};

exports.add_corporate_corner = async (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_corporatecorner', {
      locals: undefined,
    });
  } else
    res.redirect("/panel/login");
};

exports.save_corporate_corner = async (req, res) => {

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
    db.corporate_corners.create(data, { raw: true })
      .then(data => {
        res.redirect("/panel/viewcorporatecorner");

      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  }
  else
    res.redirect("/panel/login");
};

exports.edit_corporate_corner = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    db.corporate_corners.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_corporatecorner', {
            locals: data,
          });
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
exports.update_corporate_corner =  async (req, res) => {

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

    await db.corporate_corners.update(data, {
      where: {
        partner_id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("/panel/viewcorporatecorner");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating services with id=" + id
        });
      });
  }
};

exports.delete_corporate_corner = async (req, res) => {
  try {
    if (req.session.role === 'Master') { // Assuming session information is stored in req.session.role
      const id = req.query.id;

      // Use Promise.all() to delete both Corporatecorner and associated Corporateservices
      await Promise.all([
        db.corporate_corners.destroy({ where: { partner_id: id } }),
        db.corporate_services.destroy({ where: { partner_id: id } })
      ]);

      res.redirect("/panel/view_corporate_corner");
    } else {
      res.redirect("/panel/login");
    }
  } catch (err) {
    console.error("Error deleting corporate corner:", err);
    res.redirect("/error-404"); // Redirect to error page in case of error
  }
};
