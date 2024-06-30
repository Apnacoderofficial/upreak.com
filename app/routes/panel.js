const express = require('express'),
    router = express.Router(),
    dashboard = require('../controllers/panel'),
    blog = require('../controllers/panel/blog'),
    candidate_detail = require('../controllers/panel/candidate_detail'),
    chatbot = require('../controllers/panel/chatbot'),
    corporate_corner = require('../controllers/panel/corporate_corner'),
    corporate_service = require('../controllers/panel/corporate_service'),
    form_detail = require('../controllers/panel/form_detail'),
    feedback = require('../controllers/panel/feedback'),
    hr = require('../controllers/panel/hr'),
    job = require('../controllers/panel/job'),
    job_seeker = require('../controllers/panel/job_seeker'),
    meeting_slot = require('../controllers/panel/meeting_slot'),
    member = require('../controllers/panel/member'),
    mou = require('../controllers/panel/mou'),
    product = require('../controllers/panel/product'),
    question = require('../controllers/panel/question'),
    report = require('../controllers/panel/report'),
    resume = require('../controllers/panel/resume'),
    setting_data     = require('../controllers/panel/setting_data'),
    testimonial = require('../controllers/panel/testimonial'),
    authMiddleWare = require('../middlewares/authMiddleware'),
    asyncMiddleware = require('../middlewares/asyncMiddleware'),
    canMiddleware = require('../middlewares/canMiddleware'),
    { upload } = require('../baseController/localUpload'),
    { passport } = require('../../config/passport');

module.exports = function (app) {
    app.use('/panel', router);
};

router.get('/auth/google' , 
    passport.authenticate('google', { scope: [ 'email', 'profile' ] })); 

router.get( '/auth/google/callback', 
    passport.authenticate( 'google', { successRedirect: '/panel/google_success', failureRedirect: '/panel/google_failure' }) );

router.get("/dash_index", authMiddleWare, 
    asyncMiddleware(dashboard.get_index));

router.get("/logout", authMiddleWare, 
    asyncMiddleware(dashboard.get_logout));

router.get('/google_success', 
    asyncMiddleware(dashboard.success_google_login)); 

router.get('/google_failure', 
    asyncMiddleware(dashboard.failure_google_login));

router.get("/login", authMiddleWare,
    asyncMiddleware(dashboard.get_login));

router.post("/login", 
    asyncMiddleware(dashboard.post_login));

router.get("/two_step_verification", 
    asyncMiddleware(dashboard.otp));

router.post("/verify_login_otp", 
    asyncMiddleware(dashboard.verify_login_otp));

router.get("/signup", 
    asyncMiddleware(dashboard.get_signup));

router.post("/signup", 
    asyncMiddleware(dashboard.post_signup));

router.post("/reset_password", 
    asyncMiddleware(dashboard.reset_password));

router.post("/update_two_step", authMiddleWare, 
    asyncMiddleware(dashboard.update_two_step));


router.get("/list_jobs", authMiddleWare, 
    asyncMiddleware(job.list_jobs));

router.get("/add_job", authMiddleWare, 
    asyncMiddleware(job.add_job));

router.get("/edit_job", authMiddleWare, 
    asyncMiddleware(job.edit_job));

router.post("/save_job", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(job.save_job));

router.get("/delete_job/:id", authMiddleWare, 
    asyncMiddleware(job.job_delete));

router.get("/list_job_application", authMiddleWare, 
    asyncMiddleware(job.list_job_application));


router.get("/chat_upreak", authMiddleWare, 
    asyncMiddleware(chatbot.chat_upreak));

router.get("/thankyou", 
    asyncMiddleware(chatbot.thankyou_file));

router.post("/save_chat_upreak", authMiddleWare, 
    asyncMiddleware(chatbot.save_chat_upreak));
  

router.get("/add_candidate_details", authMiddleWare, 
    asyncMiddleware(candidate_detail.add_candidate_details));

router.get("/edit_candidate_details", authMiddleWare, 
    asyncMiddleware(candidate_detail.edit_candidate_details));

router.get("/view_candidate_details", authMiddleWare, 
    asyncMiddleware(candidate_detail.view_candidate_details));

router.post("/save_candidate_details", authMiddleWare, 
    upload.fields([{ name: 'photo' }, { name: 'resume' }]), 
    asyncMiddleware(candidate_detail.save_candidate_details));

router.get("/list_candidate_details", authMiddleWare, 
    asyncMiddleware(candidate_detail.list_candidate_details));

router.get("/candidate_combined_list", authMiddleWare, 
    asyncMiddleware(candidate_detail.candidate_combined_list));

router.get("/delete_candidate_details/:id", authMiddleWare, 
    asyncMiddleware(candidate_detail.delete_candidate_details));
  

router.get("/add_member", authMiddleWare, 
    asyncMiddleware(member.add_member));

router.post("/save_member", authMiddleWare, 
    asyncMiddleware(member.save_member));

router.get("/list_members", authMiddleWare, 
    asyncMiddleware(member.list_members));

router.get("/delete_member/:id", authMiddleWare, 
    asyncMiddleware(member.member_delete));


router.post("/verify_details", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_details));

router.post("/verify_details1", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_details1));

router.post("/verify_details2", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_details2));

router.post("/verify_otp", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_otp));

router.post("/verify_otp1", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_otp1));

router.post("/verify_otp2", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_otp2));

router.get("/view_job_seekers", authMiddleWare, 
    asyncMiddleware(job_seeker.view_job_seekers));

router.get("/add_job_seekers", authMiddleWare, 
    asyncMiddleware(job_seeker.add_job_seekers));

router.get("/edit_job_seeker", authMiddleWare, 
    asyncMiddleware(job_seeker.edit_job_seeker));

router.get("/view_job_detail", authMiddleWare, 
    asyncMiddleware(job_seeker.view_job_detail));

router.get("/edit_details", authMiddleWare, 
    asyncMiddleware(job_seeker.edit_details));

router.get("/view_details", authMiddleWare, 
    asyncMiddleware(job_seeker.view_details));

router.get("/verify_job_seeker", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_job_seeker));

router.get("/verify_job_seeker1", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_job_seeker1));

router.get("/verify_job_seeker2", authMiddleWare, 
    asyncMiddleware(job_seeker.verify_job_seeker2));

router.post("/save_job_seekers", authMiddleWare, 
    upload.fields([{ name: 'photo' }, { name: 'resume' }]), 
    asyncMiddleware(job_seeker.save_job_seekers));

router.get("/delete_job_seeker/:id", authMiddleWare, 
    asyncMiddleware(job_seeker.job_seeker_delete));



router.get("/list_feedbacks", authMiddleWare, 
    asyncMiddleware(feedback.list_feedbacks));

router.get("/add_feedback", authMiddleWare, 
    asyncMiddleware(feedback.add_feedback));

router.post("/save_feedback", authMiddleWare, 
    asyncMiddleware(feedback.save_feedback));


router.post("/update_ques", authMiddleWare, 
    asyncMiddleware(question.update_ques));

router.post("/save_ques", authMiddleWare, 
    asyncMiddleware(question.save_ques));

router.get("/view_ques", authMiddleWare, 
    asyncMiddleware(question.view_ques));

router.get("/add_ques", authMiddleWare, 
    asyncMiddleware(question.add_ques));

router.get("/edit_ques", authMiddleWare, 
    asyncMiddleware(question.edit_ques));

router.get("/delete_ques/:id", authMiddleWare, 
    asyncMiddleware(question.delete_ques));
  

router.get("/view_settings", authMiddleWare, 
    asyncMiddleware(setting_data.view_settings));

router.get("/edit_settings", authMiddleWare, 
    asyncMiddleware(setting_data.edit_settings));

router.get("/settings", authMiddleWare, 
    asyncMiddleware(setting_data.edit_settings));

router.get("/add_settings", authMiddleWare, 
    asyncMiddleware(setting_data.add_settings));

router.post("/save_settings", authMiddleWare, 
    asyncMiddleware(setting_data.save_settings));
  

router.get("/view_testimonials", authMiddleWare, 
    asyncMiddleware(testimonial.view_testimonials));

router.get("/add_testimonials", authMiddleWare, 
    asyncMiddleware(testimonial.add_testimonials));

router.get("/edit_testimonials", authMiddleWare, 
    asyncMiddleware(testimonial.edit_testimonials));

router.post("/save_testimonials", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(testimonial.save_testimonials));

router.post("/update_testimonials", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(testimonial.update_testimonials));

router.get("/delete_testimonials/:id", authMiddleWare, 
    asyncMiddleware(testimonial.testimonials_delete));
  

router.get("/view_blogs", authMiddleWare, 
    asyncMiddleware(blog.view_blogs));

router.get("/add_blogs", authMiddleWare, 
    asyncMiddleware(blog.add_blogs));

router.get("/edit_blogs", authMiddleWare, 
    asyncMiddleware(blog.edit_blogs));

router.get("/delete_blogs/:id", authMiddleWare, 
    asyncMiddleware(blog.blogs_delete));

router.post("/save_blogs", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(blog.save_blogs));

router.post("/update_blogs", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(blog.update_blogs));
  

router.get("/performance_hr", authMiddleWare, 
    asyncMiddleware(hr.performance_hr));

router.post("/filter_performance_hr", authMiddleWare, 
    asyncMiddleware(hr.filter_performance_hr));


router.get("/resume", authMiddleWare, 
    asyncMiddleware(resume.get_resume));

router.get("/resume1", authMiddleWare, 
    asyncMiddleware(resume.get_resume1));

router.get("/resume2", authMiddleWare, 
    asyncMiddleware(resume.get_resume2));

router.get("/resume3", authMiddleWare, 
    asyncMiddleware(resume.get_resume3));

router.get("/resume4", authMiddleWare, 
    asyncMiddleware(resume.get_resume4));

router.get("/resume5", authMiddleWare, 
    asyncMiddleware(resume.get_resume5));

router.get("/view_resume", authMiddleWare, 
    asyncMiddleware(resume.view_resume));

router.get("/add_resume", authMiddleWare, 
    asyncMiddleware(resume.add_resume));

router.get("/view_resumes", authMiddleWare, 
    asyncMiddleware(resume.view_resumes));

router.get("/delete_resumes/:id", authMiddleWare, 
    asyncMiddleware(resume.delete_resumes));

router.post("/save_resume", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(resume.save_resume));
  

router.get("/products", authMiddleWare, 
    asyncMiddleware(product.get_products));

router.get("/add_products", authMiddleWare, 
    asyncMiddleware(product.add_products));

router.get("/view_products", authMiddleWare, 
    asyncMiddleware(product.view_products));

router.get("/edit_products", authMiddleWare, 
    asyncMiddleware(product.edit_products));

router.get("/delete_products/:id", authMiddleWare, 
    asyncMiddleware(product.delete_products));

router.post("/save_products", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(product.save_products));

router.post("/update_products", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(product.update_products));
  

router.get("/view_mou", authMiddleWare, 
    asyncMiddleware(mou.view_mou));

router.get("/add_mou", authMiddleWare, 
    asyncMiddleware(mou.add_mou));

router.get("/edit_mou", authMiddleWare, 
    asyncMiddleware(mou.edit_mou));

router.get("/delete_mou/:id", authMiddleWare, 
    asyncMiddleware(mou.delete_mou));

router.post("/save_mou", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(mou.save_mou));

router.post("/update_mou", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(mou.update_mou));
  

router.get("/issue", authMiddleWare, 
    asyncMiddleware(form_detail.issue));

router.get("/service_request_details", authMiddleWare, 
    asyncMiddleware(form_detail.service_request_details));

router.get("/contact_details", authMiddleWare, 
    asyncMiddleware(form_detail.contact_details));

router.get("/registration_details", authMiddleWare, 
    asyncMiddleware(form_detail.registration_details));
  

router.get("/book_slot", authMiddleWare, 
    asyncMiddleware(meeting_slot.get_book_slot));

router.get("/meeting_details", authMiddleWare, 
    asyncMiddleware(meeting_slot.meeting_details));

router.post("/book_slot", authMiddleWare, 
    asyncMiddleware(meeting_slot.post_book_slot));

router.get("/accept_slot/:id", authMiddleWare, 
    asyncMiddleware(meeting_slot.accept_slot));

router.get("/reschedule_slot/:id", authMiddleWare, 
    asyncMiddleware(meeting_slot.reschedule_slot));

router.get("/getTokenData", authMiddleWare, 
    asyncMiddleware(meeting_slot.getTokenData));

router.post("/updateTokenData", authMiddleWare, 
    asyncMiddleware(meeting_slot.updateTokenData));

router.get("/buy_now", authMiddleWare, 
    asyncMiddleware(meeting_slot.get_buy_now));

router.post("/buy_now", authMiddleWare, 
    asyncMiddleware(meeting_slot.save_payment_details));

router.post("/buy_now_details", authMiddleWare, 
    asyncMiddleware(meeting_slot.purchase));

router.get("/payment_details", authMiddleWare, 
    asyncMiddleware(meeting_slot.get_payment_details));  
  

router.get("/add_report", authMiddleWare, 
    asyncMiddleware(report.add_report));

router.post("/save_report", authMiddleWare, 
    asyncMiddleware(report.save_report));

router.get("/generate_report/:id", authMiddleWare, 
    asyncMiddleware(report.generate_report));

router.get("/view_report/:id", authMiddleWare, 
    asyncMiddleware(report.view_report));

router.get("/report_details", authMiddleWare, 
    asyncMiddleware(report.report_details));
  

router.get("/view_corporate_corner", authMiddleWare, 
    asyncMiddleware(corporate_corner.view_corporate_corner));

router.get("/add_corporate_corner", authMiddleWare, 
    asyncMiddleware(corporate_corner.add_corporate_corner));

router.get("/edit_corporate_corner", authMiddleWare, 
    asyncMiddleware(corporate_corner.edit_corporate_corner));

router.post("/save_corporate_corner", authMiddleWare, 
    upload.single('photo'),
    asyncMiddleware(corporate_corner.save_corporate_corner));

router.post("/update_corporate_corner", authMiddleWare, 
    upload.single('photo'),
    asyncMiddleware(corporate_corner.update_corporate_corner));

router.get("/delete_corporate_corner", authMiddleWare, 
    asyncMiddleware(corporate_corner.delete_corporate_corner));


router.get("/add_corporate_services", authMiddleWare, 
    asyncMiddleware(corporate_service.add_corporate_services));

router.post("/save_corporate_services", authMiddleWare, 
    upload.single('photo'), 
    asyncMiddleware(corporate_service.save_corporate_services));

router.get("/edit_corporate_services", authMiddleWare, 
    asyncMiddleware(corporate_service.edit_corporate_services));

router.post("/update_corporate_services", authMiddleWare, 
    upload.single('photo'),
    asyncMiddleware(corporate_service.update_corporate_services));

router.get("/delete_corporate_services", authMiddleWare, 
    asyncMiddleware(corporate_service.delete_corporate_services)); 