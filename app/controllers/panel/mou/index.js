const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.delete_mou = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    db.mou_registrations.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/panel/view_mou");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/panel/login");
  }
};

exports.view_mou = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  db.mou_registrations.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master' || req.session.role == 'HR') {
        res.render("view_mou", {
          locals: data,
        });
      }
      else
        res.redirect("/panel/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};

exports.edit_mou = (req, res) => {
  const shortname = req.query.clg;

  if (req.session.role == 'Master') {
    db.mou_registrations.findOne({ where: { shortname: shortname } })
      .then(data => {
        if (data) {
          res.render('add_mou', {
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

exports.add_mou = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_mou', {
      locals: undefined,
    });
  } else
    res.redirect("/panel/login");
};

exports.save_mou = async (req, res) => {

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
    db.mou_registrations.create(data, { raw: true })
      .then(data => {
        res.redirect("/panel/view_mou");

      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  }
  else
    res.redirect("/panel/login");
};

exports.update_mou = async (req, res) => {

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

    await db.mou_registrations.update(data, {
      where: {
        id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("/panel/view_mou");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating mou with id=" + id
        });
      });
  }
};
