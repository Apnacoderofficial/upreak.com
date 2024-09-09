const main_controller = require("../controllers/main_controller");
var router = require("express").Router();



module.exports = app => {
  router.get("/", main_controller.index);

  app.use('/', router);
};
