const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

module.exports = {

  add_testimonials : (req, res) => {

    if (req.session.role == 'Master') {
      res.render('add_testimonials', {
        locals: undefined,
      });
    } else
      res.redirect("/panel/login");
  },

  edit_testimonials : async (req, res) => {
    const id = req.query.id;

    if (req.session.role == 'Master') {
      db.testimonials.findByPk(id)
        .then(data => {
          if (data) {
            res.render('add_testimonials', {
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
  },

  view_testimonials : async (req, res) => {

    // && req.session.role== 'admin'where: {role:'admin'  }
    db.testimonials.findAll({})
      .then(data => {
        // && req.session.role== 'admin'
        if (req.session.role == 'Master') {
          res.render("view_testimonials", {
            locals: data,
          });
        }
        else
          res.redirect("/panel/login");
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  },

  save_testimonials :  async (req, res) => {

    if (req.session.role == 'Master') {
      const data = {
        photo: req.file.filename,
        description: req.body.description,
        author: req.body.author
      };
      if (!req.query.id) {
        // Create a Tutorial:
        db.testimonials.create(data, { raw: true })
          .then(data => {
            res.redirect('/panel/view_testimonials');

          })
          .catch(err => {
            console.error(err);
            res.redirect("/error-500");
          });
      }
      else {
        db.testimonials.update(data, {
          where: {
            id: req.query.id
          },
          raw: true,
        })
          .then(data => {
            res.redirect('/panel/view_testimonials');
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
      res.redirect("/panel/login");
  },

  update_testimonials : async (req, res) => {

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

      await db.testimonials.update(data, {
        where: {
          id: id,
        },
        raw: true,
      })
        .then(data => {
          res.redirect('/panel/view_testimonials');
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({

            message: "Error updating testimonials with id=" + id
          });
        });
    }
  },

  testimonials_delete : async (req, res) => {

    if (req.session.role == 'Master') {
      const id = req.params.id;
      db.testimonials.destroy({
        where: { id: id }
      })
        .then(User => {
          res.redirect('/panel/view_testimonials');
          // res.render('dash_index');     
        })
        .catch(err => {
          res.redirect("/error-404");
        });
    } else {
      res.redirect("/panel/login");
    }
  }

};