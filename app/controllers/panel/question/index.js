const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.add_ques = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    res.render('add_questions', { locals: undefined, recordType: 'new' });
  } else
    res.redirect("/panel/login");

};

exports.edit_ques = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    db.questions.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_questions', {
            locals: data
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

exports.save_ques = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    const data = {
      question: req.body.question,
      type: req.body.type,
      remarks: req.body.remarks,
      order_id: req.body.order_id,
      important: req.body.important,
      options: req.body.options ? JSON.parse(req.body.options) : null
    };
    if (!req.query.id) {
      // Create a Tutorial:
      db.questions.create(data)
        .then(data => {
          res.redirect("/panel/view_ques");

        })
        .catch(err => {
          CompositionListInstance.log(err);
          res.redirect("/error-500");
        });
    }
    else {
      db.questions.update(data, {
        where: {
          id: req.query.id
        }
      })
        .then(data => {
          res.redirect("/panel/view_ques");
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating question with id=" + id
          });
        });
    }
  }
  else
    res.redirect("/panel/login");
};

exports.update_ques = (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'Admin') {
    const id = req.body.id;
    const data = {
      question: req.body.question,
      type: req.body.type,
      remarks: req.body.remarks,
      order_id: req.body.order_id,
      important: req.body.important,
      options: req.body.options ? JSON.parse(req.body.options) : null
    };
    db.questions.update(data, {
      where: {
        id: id,
      }
    })
      .then(data => {
        res.redirect("/panel/view_ques");
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating question with id=" + id
        });
      });
  }
};

exports.view_ques = (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  db.questions.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master' || req.session.role == 'Admin' || req.session.role == 'SubAdmin') {
        res.render("view_questions", {
          locals: data,
          srole: req.session.role
        });
      }
      else
        res.redirect("/panel/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};

exports.delete_ques = async (req, res) => {
  const id = req.params.id;

  await db.questions.destroy({
    where: { id: id }
  })
    .then(User => {
      res.redirect("/panel/view_ques");
      // res.render('dash_index');     
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete question with id=" + id
      });
    });
};
