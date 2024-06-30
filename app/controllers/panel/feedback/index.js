const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');


exports.list_feedbacks = async (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  db.viewer_feedbacks.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'SubAdmin' || req.session.role == 'HR') {
        res.render("view_feedbacks", {
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

exports.save_feedback = async (req, res) => {

  if (req.session.role == 'User') {
    const data = {
      username: req.session.username,
      email: req.session.userid,
      title: req.body.title,
      description: req.body.description,
    };

    db.viewer_feedbacks.create(data)
      .then(data => {
        res.redirect("/panel/dash_index");
      })
      .catch(err => {
        res.redirect("/error-500");
        console.error(err);
      });
  }
  else
    res.redirect("/panel/login");
};

exports.add_feedback = async (req, res) => {

  if (req.session.role == 'User' || req.session.role == 'HR') {
    res.render('add_feedback');
  } else
    res.redirect("/panel/login");

};
