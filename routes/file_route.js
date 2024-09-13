const main_controller = require("../controllers/main_controller");
var router = require("express").Router();
const { checkAuth,userData } = require('../middleware/checkAuth');
const passport = require('passport'); 
require('../config/passport-google-setup');
require('../config/passport-microsoft-setup');
require('../config/passport-linkedin-setup');

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

  // Index routes
router.get("/", userData,main_controller.index);
router.get("/index", userData,main_controller.index);
router.get("/index1", userData,main_controller.index1);

// Blog routes
router.get("/blog-grid", userData,main_controller.blogGrid);
router.get("/blog-grid-2", userData,main_controller.blogGrid2);
router.get("/blog-list", userData,main_controller.blogList);
router.get("/blog-single", userData,main_controller.blogSingle);
router.get("/blog-single-2", userData,main_controller.blogSingle2);

// Candidates routes
router.get("/candidates-grid", userData,main_controller.candidatesGrid);
router.get("/candidates-grid-2", userData,main_controller.candidatesGrid2);
router.get("/candidates-list", userData,main_controller.candidatesList);

// Employers routes
router.get("/become-employers", userData,main_controller.employersGrid);
router.get("/employers-grid-2", userData,main_controller.employersGrid2);
router.get("/employers-list", userData,main_controller.employersList);

// Jobs routes
router.get("/job-grid", userData,main_controller.jobGrid);
router.get("/job-grid-2", userData,main_controller.jobGrid2);
router.get("/job-list", userData,main_controller.jobList);
router.get("/healthCare", userData,main_controller.healthCare);
router.get("/job-details", userData,main_controller.jobSingle);
router.get("/job-single-2", userData,main_controller.jobSingle2);
router.get("/job-single-3", userData,main_controller.jobSingle3);

// Additional pages (like contact, about, etc.)
router.get("/page-about", userData,main_controller.pageAbout);
router.get("/page-contact",(req,res)=>{
  res.redirect('/contactUs');
});
router.get("/contactUs", userData,main_controller.pageContact);
router.get("/page-pricing", userData,main_controller.pagePricing);
router.get("/page-service", userData,main_controller.pageService);
router.get("/pages-faqs", userData,main_controller.pagesFaqs);

router.post('/job_application', userData,main_controller.applyForJob);
router.get("/termsandconditions", userData,main_controller.termsandconditions);
router.get("/privacypolicy", userData,main_controller.privacypolicy);
router.get("/preview_blogs", userData,main_controller.preview_blogs);
router.post("/subscribe", userData,main_controller.subscribe);
router.post("/save_contact", userData,main_controller.save_contact);

router.post('/signup', userData,main_controller.signup);
router.post('/login', userData,main_controller.login);
router.get('/logout', userData,main_controller.logout);


router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/googleFailure' 
  }),
  (req, res) => {
    // console.log('User in callback route:', req.user); // Check if user data is present
    res.redirect('/googleSuccess');
  }
);


router.get('/googleSuccess', main_controller.successGoogleLogin);
router.get('/googleFailure', main_controller.failureGoogleLogin);



// Microsoft Authentication
// router.get('/auth/microsoft',
//   passport.authenticate('azure_ad-openidconnect', { scope: ['email', 'profile'] })
// );

// Microsoft callback route
// router.get('/auth/microsoft/callback',
//   passport.authenticate('azure_ad-openidconnect', {
//     successRedirect: '/microsoftSuccess',
//     failureRedirect: '/microsoftFailure'
//   })
// );

// Success and Failure routes
// router.get('/microsoftSuccess', (req, res) => {
//   res.send('Microsoft Login Successful!');
// });

// router.get('/microsoftFailure', (req, res) => {
//   res.send('Microsoft Login Failed.');
// });


// LinkedIn Authentication
router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  failureRedirect: '/linkedinFailure'
}), main_controller.successLinkedInLogin);
router.get('/linkedinFailure', main_controller.failureLinkedInLogin);



router.post("/verify_phone_number", userData,main_controller.verify_phone_number);
router.post("/verify_otp", userData,main_controller.verify_otp);
router.post('/submit-enquiry', userData,main_controller.submitEnquiry);





module.exports = router;