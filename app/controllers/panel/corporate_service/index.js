const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.add_corporate_services = async (req, res) => {
  if (req.session.role == 'Master') {
    try {
      const corporateCorners = await db.corporate_corner.findAll();
      res.render("add_corporateservices", {
        corporateCorners, // Pass Corporatecorner data to view
        locals: undefined,
      });
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.redirect("/panel/login");
  }
};

exports.save_corporate_services =  async (req, res) => {
  if (req.session.role == 'Master') {
    try {
      const data = {
        partner_id: req.body.partner_id,
        service_name: req.body.service_name,
        service_description: req.body.service_description,
        service_price: req.body.service_price,
        service_status: req.body.service_status,
      };

      await db.corporate_services.create(data, { raw: true });
      res.redirect("/panel/viewcorporatecorner");
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.redirect("/panel/login");
  }
};

exports.edit_corporate_services = async (req, res) => {
  const id = req.query.id;

  if (req.session.role == 'Master') {
    try {
      const corporateCorners = await db.corporate_corner.findAll();
      const data = await db.corporate_services.findByPk(id);
      if (data) {
        res.render('add_corporateservices', {
          locals: data,
          corporateCorners
        });
      } else {
        res.redirect("/panel/view_corporate_corner");
      }
    } catch (err) {
      console.error(err);
      res.redirect("/error-500");
    }
  } else {
    res.redirect("/panel/login");
  }
};

exports.update_corporate_services =  async (req, res) => {

  if (req.session.role == 'Master') {
    const id = req.body.id;
    if (req.file) {
      var imageFile = req.file;
    } else {
      var imageFile = req.body.photo_file_name;
    }
    const data = {
      partner_id: req.body.partner_id,
      service_name: req.body.service_name,
      service_description: req.body.service_description,
      service_price: req.body.service_price,
      photo: imageFile.filename,
    };

    await db.corporate_services.update(data, {
      where: {
        service_id: id,
      }, raw: true,
    })
      .then(data => {
        res.redirect("/panel/viewcorporatecorner");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({

          message: "Error updating services with id=" + id
        });
      });
  }
};
exports.delete_corporate_services = async (req, res) => {
  if (req.session.role == 'Master') {
    const id = req.query.id;
    try {
      await db.corporate_services.destroy({
        where: { service_id: id }
      });
      res.redirect("/panel/view_corporate_corner");
    } catch (err) {
      console.error(err);
      res.redirect("/error-404");
    }
  } else {
    res.redirect("/panel/login");
  }
};