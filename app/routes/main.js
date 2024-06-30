const express = require('express'),
    router = express.Router(),
    main = require('../controllers/main'),
    general = require('../controllers/general'),
    asyncMiddleware = require('../middlewares/asyncMiddleware'),
    authMiddleWare = require('../middlewares/authMiddleware'),
    { upload }  = require('../baseController/localUpload');

module.exports = function (app) {
    app.use('/', router);
};

router.get("/",
    authMiddleWare,
    asyncMiddleware(main.index));

router.get("/privacy_policy",
    authMiddleWare,
    asyncMiddleware(main.privacy_policy));

router.get("/about_us",
    authMiddleWare,
    asyncMiddleware(main.about_us));

router.get("/help_center",
    authMiddleWare,
    asyncMiddleware(main.help_center));

router.post("/save_contact",
    authMiddleWare,
    asyncMiddleware(main.save_contact));

router.get("/services",
    authMiddleWare,
    asyncMiddleware(main.services));

router.get("/terms_and_conditions",
    authMiddleWare,
    asyncMiddleware(main.terms_and_conditions));

router.get("/blog",
    authMiddleWare,
    asyncMiddleware(main.blog));

router.get("/preview_blogs/:url_title",
    authMiddleWare,
    asyncMiddleware(main.preview_blogs));

router.get("/registration_recruitment_partner",
    authMiddleWare,
    asyncMiddleware(main.registration_recruitment_partner));

router.post("/save_partner",
    authMiddleWare,
    asyncMiddleware(main.save_partner));

router.post("/save_ticket",
    authMiddleWare,
    asyncMiddleware(main.save_ticket));

router.post("/save_contact",
    authMiddleWare,
    asyncMiddleware(main.save_contact));

router.post("/save_corporate",
    authMiddleWare,
    asyncMiddleware(main.save_corporate));

router.get("/corporate_services/:company_name",
    authMiddleWare,
    asyncMiddleware(main.corporate_corner));

router.get("/corporate_services",
    authMiddleWare,
    asyncMiddleware(main.corporate_corner_list));

router.get("/jobs",
    authMiddleWare,
    asyncMiddleware(main.jobs));

router.post("/jobs",
    authMiddleWare,
    asyncMiddleware(main.filtered_jobs));

router.get("/job_details",
    authMiddleWare,
    asyncMiddleware(main.job_details));

router.post("/job_application",
    authMiddleWare,
    upload.single('resume'), 
    asyncMiddleware(main.save_job_application));

router.get("/register/:shortname",
    authMiddleWare,
    asyncMiddleware(main.get_mou));  

router.post("/register_mou",
    authMiddleWare,
    asyncMiddleware(main.register_mou));

router.get("/get_started",
    authMiddleWare,
    asyncMiddleware(main.get_started));

// router.get("/resume-builder",
//         authMiddleWare,
//         asyncMiddleware(main.resume_builder));

// router.get("/resume-templates",
//             authMiddleWare,
//             asyncMiddleware(main.resume_templates));

    
// general
router.get("/error-404",
    authMiddleWare,    
    asyncMiddleware(general.get404));

router.get("/error-500",
    authMiddleWare,    
    asyncMiddleware(general.get500));

router.get("/export/:tableName",
    authMiddleWare,
    asyncMiddleware(general.export_table));

router.post("/import_csv/:tableName",
    authMiddleWare,
    upload.single('bulk_csv'), 
    asyncMiddleware(general.import_csv));

router.get("/generate_qr",
    authMiddleWare,    
    asyncMiddleware(general.generate_qr));

router.get('/autocomplete_clg', 
    asyncMiddleware(general.get_college_data));

router.get('/autocomplete_uty', 
    asyncMiddleware(general.get_university_data));

router.get('/autocomplete_skills', 
    asyncMiddleware(general.get_skills_data));

router.get('/autocomplete_jobs', 
    asyncMiddleware(general.get_jobs_data));

router.get('/autocomplete_board', 
    asyncMiddleware(general.get_board_data));

router.get("/view_activity",
    authMiddleWare,    
    asyncMiddleware(general.view_activity));  

router.get("/download_resume",
    authMiddleWare,    
    asyncMiddleware(general.download_resume));