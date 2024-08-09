const dash_path = require("../controllers/file_controllers");
var router = require("express").Router();
const multer = require("multer");
const passport = require('passport'); 
require('../passport');

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


module.exports = app => {

  router.use(passport.initialize()); 
  router.use(passport.session());

  // Auth 
  router.get('/auth/google' , passport.authenticate('google', { scope: [ 'email', 'profile' ] })); 

  // // Auth Callback 
  router.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
      successRedirect: '/googleSuccess', 
      failureRedirect: '/googleFailure'
    })
  );

  // // Success 
  router.get('/googleSuccess' , dash_path.successGoogleLogin); 

  // // failure
  router.get('/googleFailure' , dash_path.failureGoogleLogin);
  
  router.get("/jobs", dash_path.jobs);
  router.post("/jobs", dash_path.filteredJobs);
  router.get("/job_details", dash_path.job_details);
  router.get("/list_jobs", dash_path.list_jobs);
  router.get("/add_job", dash_path.add_job);
  router.get("/edit_job", dash_path.edit_job);
  router.post("/save_job", upload.single('photo'), dash_path.save_job);
  router.post("/job_application", upload.single('resume'), dash_path.save_job_application);
  router.get("/delete_job/:id", dash_path.job_delete);
  router.get("/list_job_application", dash_path.list_job_application);


  router.get("/export/:tableName", dash_path.export_table);
  router.post("/uploadCSV/:tableName",upload.single('bulk_csv'), dash_path.import_csv);

  router.get("/chatUpreak", dash_path.chatbot);
  router.get("/thankyou", dash_path.thankyou_file);
  router.post("/save_chatbot", dash_path.save_chatbot);

  router.get("/add_candidate_details", dash_path.add_candidate_details);
  router.get("/edit_candidate_details", dash_path.edit_candidate_details);
  router.get("/view_candidate_details", dash_path.view_candidate_details);
  router.post("/save_candidate_details",upload.fields([{ name: 'photo' }, { name: 'resume' }]), dash_path.save_candidate_details);
  router.get("/list_candidate_details", dash_path.list_candidate_details);
  router.get("/candidate_combined_list", dash_path.candidate_combined_list);
  router.get("/delete_candidate_details/:id", dash_path.delete_candidate_details);

  router.get("/add_member", dash_path.add_member);
  router.post("/save_member", dash_path.save_member);
  router.get("/list_members", dash_path.list_members) 
  router.post("/updatetwostep", dash_path.updatetwostep);
  router.get("/delete_member/:id", dash_path.member_delete);

  router.get("/", dash_path.findAll);
  router.get("/getStarted", dash_path.getstarted);
  router.post("/reset_password", dash_path.reset_password);
  router.get("/generateQR", dash_path.generateQR);
  router.get("/privacypolicy", dash_path.privacypolicy);
  router.get("/dash_index", dash_path.get_index);
  router.get("/login", dash_path.getlogin);
  router.get("/signup", dash_path.getsignup);
  router.get("/aboutus", dash_path.aboutus);
  router.get("/help-center", dash_path.contactus);
  router.get("/contact_details", dash_path.contact_details);
  router.get("/registration_details", dash_path.registration_details);
  router.get("/services", dash_path.services);
  router.get("/termsandconditions", dash_path.termsandconditions);
  router.get("/blog", dash_path.blog);
  router.post("/save_contact", dash_path.save_contact);
  router.post("/save_partner", dash_path.save_partner);
  router.get("/registration_recruitment_partner", dash_path.registration_recruitment_partner);
  router.post("/verify_details", dash_path.verify_details);
  router.post("/verify_details1", dash_path.verify_details1);
  router.post("/verify_details2", dash_path.verify_details2);
  router.post("/verify_otp", dash_path.verify_otp);
  router.post("/verify_otp1", dash_path.verify_otp1);
  router.post("/verify_otp2", dash_path.verify_otp2);
  router.get("/view_job_seekers", dash_path.view_job_seekers);
  router.get("/add_job_seekers", dash_path.add_job_seekers);
  router.get("/edit_job_seeker", dash_path.edit_job_seeker);
  router.get("/view_job_detail", dash_path.view_job_detail);
  router.get("/view_feedbacks", dash_path.view_feedbacks);
  router.get("/edit_details", dash_path.edit_details);
  router.get("/view_details", dash_path.view_details);
  router.get("/add_feedback", dash_path.add_feedback);
  router.post("/update_ques", dash_path.update_ques);
  router.post("/save_ques", dash_path.save_ques);
  router.post("/save_feedback", dash_path.save_feedback);
  router.get("/view_ques", dash_path.view_ques);
  router.get("/add_ques", dash_path.add_ques);
  router.get("/edit_ques", dash_path.edit_ques);
  router.get("/delete_ques/:id", dash_path.delete_ques);

  router.get("/view_settings", dash_path.view_settings);
  router.get("/edit_settings", dash_path.edit_settings);
  router.get("/settings", dash_path.edit_settings);
  router.get("/add_settings", dash_path.add_settings);
  router.post("/save_settings", dash_path.save_settings);

  router.get("/view_testimonials", dash_path.view_testimonials);
  router.get("/add_testimonials", dash_path.add_testimonials);
  router.get("/edit_testimonials", dash_path.edit_testimonials);
  router.post("/save_testimonials",upload.single('photo'), dash_path.save_testimonials);
  router.post("/update_testimonials",upload.single('photo'), dash_path.update_testimonials);

  router.get("/preview_blogs/:url_title", dash_path.preview_blogs);
  router.get("/view_blogs", dash_path.view_blogs);
  router.get("/add_blogs", dash_path.add_blogs);
  router.get("/edit_blogs", dash_path.edit_blogs);
  router.get("/delete_blogs/:id", dash_path.blogs_delete);
  router.post("/save_blogs",upload.single('photo'), dash_path.save_blogs);
  router.post("/update_blogs",upload.single('photo'), dash_path.update_blogs);
  router.post("/save_job_seekers",upload.fields([{ name: 'photo' }, { name: 'resume' }]), dash_path.save_job_seekers);
  router.get("/delete_job_seeker/:id", dash_path.job_seeker_delete);
  router.get("/delete_testimonials/:id", dash_path.testimonials_delete);
  router.get("/error-404", dash_path.get404);
  router.get("/error-500", dash_path.get500);
  router.post("/login",dash_path.postlogin);
  router.post("/signup", dash_path.postsignup);
  router.get("/logout", dash_path.get_logout);

  // router.get("/ocr", dash_path.ocr);
  // router.post("/ocr", dash_path.ocr);
  router.get("/report_resume_download", dash_path.report_resume_download);

  router.get("/download_resume", dash_path.download_resume);

  router.get("/verify_job_seeker", dash_path.verify_job_seeker);
  router.get("/verify_job_seeker1", dash_path.verify_job_seeker1);
  router.get("/verify_job_seeker2", dash_path.verify_job_seeker2);

  router.get("/resume", dash_path.get_resume);
  router.get("/performance_hr", dash_path.performance_hr);
  router.post("/filter_performance_hr", dash_path.filter_performance_hr);
  router.get("/resume1", dash_path.get_resume1);
  router.get("/resume2", dash_path.get_resume2);
  router.get("/resume3", dash_path.get_resume3);
  router.get("/resume4", dash_path.get_resume4);
  router.get("/resume5", dash_path.get_resume5);
  router.get("/add_resume", dash_path.add_resume);
  router.get("/view_resumes", dash_path.view_resumes);
  router.get("/edit_resumes", dash_path.edit_resumes);
  router.get("/delete_resumes/:id", dash_path.delete_resumes);
  router.post("/save_resume",upload.fields([{ name: 'photo' }, { name: 'resume_link' }]), dash_path.save_resume);
  // router.post("/update_products",upload.single('photo'), dash_path.update_products);

  router.get("/getTokenData", dash_path.getTokenData);
  router.post("/updateTokenData", dash_path.updateTokenData);


  router.get("/products", dash_path.get_products);
  router.get("/add_products", dash_path.add_products);
  router.get("/view_products", dash_path.view_products);
  router.get("/edit_products", dash_path.edit_products);
  router.get("/delete_products/:id", dash_path.delete_products);
  router.post("/save_products",upload.single('photo'), dash_path.save_products);
  router.post("/update_products",upload.single('photo'), dash_path.update_products);

  router.get("/register/:shortname", dash_path.get_mou);
  router.get("/view_mou", dash_path.view_mou);
  router.get("/add_mou", dash_path.add_mou);
  router.get("/edit_mou", dash_path.edit_mou);
  router.post("/register_mou", dash_path.register_mou);
  router.get("/delete_mou/:id", dash_path.delete_mou);
  router.post("/save_mou",upload.single('photo'), dash_path.save_mou);
  router.post("/update_mou",upload.single('photo'), dash_path.update_mou);

  router.get("/view_activity", dash_path.view_activity);



  router.get("/issue", dash_path.issue);
  router.get("/service_request_details", dash_path.service_request_details);
  router.get("/subscribe_list", dash_path.subscribe_list);
  router.post("/subscribe", dash_path.subscribe);
  router.post("/save_ticket", dash_path.save_ticket);
  router.post("/save_contact", dash_path.save_contact);
  router.post("/save_coorporate", dash_path.save_coorporate);

  router.get("/book_slot", dash_path.get_bookslot);
  router.get("/meeting_details", dash_path.meeting_details);
  router.post("/book_slot", dash_path.post_bookslot);
  router.get("/accept_slot/:id", dash_path.accept_slot);
  router.get("/reschedule_slot/:id", dash_path.reschedule_slot);

  router.get("/add_report", dash_path.add_report);
  router.post("/save_report", dash_path.save_report);
  router.get("/generate_report/:id", dash_path.generate_report);
  router.get("/view_report/:id", dash_path.view_report);
  router.get("/report_details", dash_path.report_details);

  router.get("/buy_now", dash_path.get_buy_now);
  router.post("/buy_now", dash_path.save_payment_details);
  router.post("/buy_now_details", dash_path.purchase);
  router.get("/payment_details", dash_path.get_payment_details);


  router.get('/autocomplete_clg', dash_path.get_college_data);
  router.get('/autocomplete_uty', dash_path.get_university_data);
  router.get('/autocomplete_skills', dash_path.get_skills_data);
  router.get('/autocomplete_jobs', dash_path.get_jobs_data);
  router.get('/autocomplete_board', dash_path.get_board_data);

  router.get("/corporateservices/:company_name", dash_path.corporatecorner);
  router.get("/corporateservices", dash_path.corporatecornerlist);
  router.get("/viewcorporatecorner", dash_path.viewcorporatecorner);
  router.get("/addcorporatecorner", dash_path.addcorporatecorner);
  router.get("/editcorporatecorner", dash_path.editcorporatecorner);
  router.post("/save_corporatecorner", upload.single('photo'),dash_path.savecorporatecorner);
  router.post("/update_corporatecorner", upload.single('photo'),dash_path.updatecorporatecorner);
  router.get("/deletecorporatecorner", dash_path.delete_corporatecorner);
  
  router.get("/addcorporateservices", dash_path.addcorporateservices);
  router.post("/save_corporateservices", upload.single('photo'), dash_path.save_corporateservices);
  router.get("/editcorporateservices", dash_path.editcorporateservices);
  router.post("/update_corporateservices", upload.single('photo'),dash_path.update_corporateservices);
  router.get("/deletecorporateservices", dash_path.delete_corporateservices); 

  router.get("/two_step_verification", dash_path.otp);
  router.post("/verify_login_otp", dash_path.verify_login_otp);

  router.get("/resume-builder", dash_path.resume_builder); 
  router.get("/resume-builder-editor", dash_path.resume_builder_editor); 
  router.get("/resume-templates", dash_path.resume_templates); 
  router.post("/apply_resume", dash_path.apply_resume); 

  router.get("/chatgpt",dash_path.getOpenAIResponse);
  router.post("/chatgpt",dash_path.getOpenAIResponse);

  router.get("/gemini",dash_path.gemini);
  router.post("/gemini",dash_path.gemini);



    // -------------------------------------------------------------------------------------------------error Route

// Handle 404 errors (middleware for catching non-existing routes)
// router.use((req, res, next) => {
//   res.render('error-404')
//   err.status = 404;
//   next(err);
// });


  app.use('/', router);
};
