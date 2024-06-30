const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');


exports.add_settings = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_settings', {
      locals: undefined,
    });
  } else
    res.redirect("/panel/login");
};
exports.edit_settings = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    db.settings.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_settings', {
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

exports.view_settings = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  db.settings.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("view_settings", {
          locals: data
        });
      }
      else
        res.redirect("/panel/login");
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

    await db.settings.update(data, {
      where: {
        id: id,
      }
    })
      .then(data => {
        res.redirect("/panel/settings?id=1");
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating settings with id=" + id
        });
      });
  }
};
