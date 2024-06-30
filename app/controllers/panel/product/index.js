const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.get_products = async (req, res) => {

  if (req.session.role == 'User') {
    let locals;
    let user_Data = await db.responses.findAll({ where: { emailid: req.session.userid } });
    await db.products.findAll({})
      .then(data => {
        locals = data;
        res.render("products", { locals: locals, user_Data });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");
};

exports.view_products = (req, res) => {


  // Check if session and session role are defined
  if (req.session && req.session.role === 'Master') {
    db.products.findAll({})
      .then(data => {
        res.render("view_products", {
          locals: data,
        });
      })
      .catch(err => {
        res.redirect("/error-500");
      });
  } else {
    res.redirect("/panel/login");
  }
};

exports.edit_products = (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    db.products.findByPk(id)
      .then(data => {
        if (data) {
          res.render('add_products', {
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

exports.add_products = (req, res) => {

  if (req.session.role == 'Master') {
    res.render('add_products', {
      locals: undefined,
    });
  } else
    res.redirect("/panel/login");
};

exports.save_products =  async (req, res) => {

  if (req.session.role == 'Master') {
    const data = {
      photo: req.file.photo,
      description: req.body.description,
      name: req.body.name,
      link: req.body.link,
      price: req.body.price
    };
    if (!req.query.id) {
      //Create a Tutorial:
      db.products.create(data, { raw: true })
        .then(data => {
          res.redirect("/panel/view_products");

        })
        .catch(err => {
          console.error(err);
          res.redirect("/error-500");
        });
    }
    else {
      db.products.update(data, {
        where: {
          id: req.query.id
        }, raw: true,
      })
        .then(data => {
          res.redirect("/panel/view_products");
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
};

exports.update_products =  async (req, res) => {

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
      name: req.body.name,
      link: req.body.link,
      price: req.body.price
    };

    await db.products.update(data, {
      where: {
        id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("/panel/view_products");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating products with id=" + id
        });
      });
  }
};

exports.delete_products = async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.params.id;
    db.products.destroy({
      where: { id: id }
    })
      .then(User => {
        res.redirect("/panel/view_products");
        // res.render('dash_index');     
      })
      .catch(err => {
        res.redirect("/error-404");
      });
  } else {
    res.redirect("/panel/login");
  }
};
