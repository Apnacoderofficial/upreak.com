const db = rootRequire('app/models')
const { Op } = require('sequelize');


exports.add_member = (req, res) => {

  if (req.session.role == 'Master')
    res.render('add_member');
  else
    res.redirect("/panel/login");
};

exports.save_member = async (req, res) => {

  if (req.session.role != 'Master' || !req.body.email || !req.body.password || !req.body.role)
    return res.redirect("/error-500");
  try {
    const member = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      createdby: req.session.userid,
      phonenumber: req.body.phonenumber,
      two_step : req.body.two_step
    };
    await db.dash_logins.create(member);
    res.redirect("/panel/list_members");
  } catch (err) {
    console.error("Error saving member:", err);
    res.redirect("/error-500");
  }
};

exports.list_members = async (req, res) => {

  if (req.session.role == 'Master') {
    await db.dash_logins.findAll({ where: { role: { [Op.notIn]: ['Master', 'User'] } } })
      .then(data => {
        res.render("list_members", { locals: data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else
    res.redirect("/panel/login");
};

exports.member_delete = async (req, res) => {
  const id = req.params.id;

  try {
    if (req.session.role != 'Master')
      return res.redirect("/error-500");
    const deletedCount = await db.dash_logins.destroy({ where: { id: id } });
    if (deletedCount)
      return res.redirect("/panel/list_members");
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).send({
      message: `Could not delete member with id ${id}.`
    });
  }
};
