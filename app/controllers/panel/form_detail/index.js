const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.issue = async (req, res) => {

    if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'HR' || req.session.role == 'User') {
      db.contact_us.findAll()
        .then(data => {
          res.render("issue", { locals: data });
        })
        .catch(err => {
          res.redirect("/error-500");
        });
  
    } else
      res.render("login");
  
};

exports.service_request_details = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'HR' || req.session.role == 'User') {
    db.contact_us.findAll()
      .then(data => {
        res.render("service_request_details", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");

};

exports.contact_details = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin' || req.session.role == 'HR') {
    db.contact_us.findAll()
      .then(data => {
        res.render("contact_details", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");

};

exports.registration_details = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin') {
    db.partner_registrations.findAll()
      .then(data => {
        res.render("registration_details", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });


  } else
    res.render("login");

};