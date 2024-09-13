const main_controller = require("../controllers/main_controller");
const workspace_controller = require("../controllers/workspace_controller");
var router = require("express").Router();
const { checkAuth,userData } = require('../middleware/checkAuth');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // cb(null, file.originalname)
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage:storage});


router.get('/',checkAuth,userData, workspace_controller.workspace);
router.get('/profile',checkAuth,userData, workspace_controller.myprofile);
router.get('/edit-profile',checkAuth,userData, workspace_controller.editProfile);
router.get('/Jobs-application-status',checkAuth,userData, workspace_controller.appliedjobs);
router.get('/subscription',checkAuth,userData, workspace_controller.subscription);

router.get('/payment-history',checkAuth,userData,  workspace_controller.getPaymentHistory);
router.get('/book-slots',checkAuth,userData,  workspace_controller.getBookSlots);
router.get('/booked-slots',checkAuth,userData,  workspace_controller.getBookedSlots);
router.get('/interview-results',checkAuth,userData,  workspace_controller.getInterviewResults);
router.get('/raise-issue',checkAuth,userData,  workspace_controller.getRaiseIssue);
router.get('/referral-program',checkAuth,userData,  workspace_controller.getreferralprogram);
router.post('/submitProfile', checkAuth,userData,  workspace_controller.updateProfile);

module.exports = router;