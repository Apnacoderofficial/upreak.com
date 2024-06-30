const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

module.exports = {
    
  get_resume : async (req, res) => {

    if (req.session.role == 'User') {
      let locals;
      await db.resumes.findAll({})
        .then(data => {
          locals = data;
        })
        .catch(err => {
          res.redirect("/error-500");
        });
      res.render("resume", { locals: locals });
    } else
      res.render("login");
  },

  get_resume1 : async (req, res) => {

    const email = req.session.userid;
    if (req.session.role == 'User') {
      db.responses.findOne({ where: { emailid: email } })
        .then(async data => {
          res.render('resume1', { locals: data });
        })
        .catch(err => {
          res.redirect("/panel/login");
        });
    } else {
      res.redirect("/panel/login");
    }
  },

  get_resume2 : async (req, res) => {

    const email = req.session.userid;
    if (req.session.role == 'User') {
      db.responses.findOne({ where: { emailid: email } })
        .then(async data => {
          res.render('resume2', { locals: data, ViewUser: 'view' });
        })
        .catch(err => {
          res.redirect("/panel/login");
        });
    } else {
      res.redirect("/panel/login");
    }
  },

  get_resume3 : async (req, res) => {

    const email = req.session.userid;
    if (req.session.role == 'User') {
      db.responses.findOne({ where: { emailid: email } })
        .then(async data => {
          res.render('resume3', { locals: data, ViewUser: 'view' });
        })
        .catch(err => {
          res.redirect("/panel/login");
        });
    } else {
      res.redirect("/panel/login");
    }
  },

  get_resume4 : async (req, res) => {

    const email = req.session.userid;
    if (req.session.role == 'User') {
      db.responses.findOne({ where: { emailid: email } })
        .then(async data => {

          res.render('resume4', { locals: data, ViewUser: 'view' });
        })
        .catch(err => {
          res.redirect("/panel/login");
        });
    } else {
      res.redirect("/panel/login");
    }
  },

  get_resume5 : async (req, res) => {

    const email = req.session.userid;
    if (req.session.role == 'User') {
      db.responses.findOne({ where: { emailid: email } })
        .then(async data => {
          res.render('resume5', { locals: data, ViewUser: 'view' });
        })
        .catch(err => {
          res.redirect("/panel/login");
        });
    } else {
      res.redirect("/panel/login");
    }
  },

  view_resume : async (req, res) => {

    if (req.session.role == 'User') {
      let locals;
      await db.resumes.findAll({})
        .then(data => {
          locals = data;
        })
        .catch(err => {
          res.redirect("/error-500");
        });
      res.render("resume", { locals: locals });
    } else
      res.render("login");
  },

  add_resume : async (req, res) => {

    if (req.session.role == 'Master') {
      res.render('add_resume', {
        locals: undefined,
      });
    } else
      res.redirect("/panel/login");
  },

  save_resume : async (req, res) => {

    if (req.session.role == 'Master') {
      const data = {
        photo: req.file.photo,
        resume_title: req.body.resume_title,
        resume_category: req.body.resume_category,
      };
      if (!req.query.id) {
        //Create a Tutorial:
        db.resumes.create(data, { raw: true })
          .then(data => {
            res.redirect('/panel/view_resumes');

          })
          .catch(err => {
            console.error(err);
            res.redirect("/error-500");
          });
      }
      else {
        db.resumes.update(data, {
          where: {
            id: req.query.id
          }, raw: true,
        })
          .then(data => {
            res.redirect('/panel/view_resumes');
          })
          .catch(err => {
            console.error(err);
            res.status(500).send({
              message: "Error adding Products with id=" + id
            });
          });
      }
    }
    else
      res.redirect("/panel/login");
  },

  view_resumes : async (req, res) => {

    // && req.session.role== 'admin'where: {role:'admin'  }
    db.resumes.findAll({})
      .then(data => {
        // && req.session.role== 'admin'
        if (req.session.role == 'Master') {
          res.render("view_resumes", {
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
  
  delete_resumes : async (req, res) => {

    if (req.session.role == 'Master') {
      const id = req.params.id;
      db.resumes.destroy({
        where: { id: id }
      })
        .then(User => {
          res.redirect('/panel/view_resumes');
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