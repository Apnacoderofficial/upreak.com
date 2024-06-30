const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.add_blogs = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_blogs', {
      locals: undefined,
    });
  } else
    res.redirect("/panel/login");
};
exports.edit_blogs = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    db.blogs.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_blogs', {
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
exports.view_blogs = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  db.blogs.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("/panel/view_blogs", {
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
exports.save_blogs = async (req, res) => {

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
    db.blogs.create(data, { raw: true })
      .then(data => {
        res.redirect("/panel/view_blogs");

      })
      .catch(err => {
        console.error(err);
        res.redirect("/error-500");
      });
  }
  else
    res.redirect("/panel/login");
};

exports.update_blogs = async (req, res) => {

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

    await db.blogs.update(data, {
      where: {
        id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("/panel/view_blogs");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating blogs with id=" + id
        });
      });
  }
};
exports.blogs_delete = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    db.blogs.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/panel/view_blogs");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/panel/login");
  }
};
