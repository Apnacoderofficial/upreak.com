const db = require("../config/dbconfig");

const Blogs = db.blogs;
const Setting = db.settings;
const Payment = db.paymentdetails;
const meetings = db.meetings;
const Reports = db.assessmentreports;
const Products = db.products;
const Mou = db.mou_registrations;
const ContactUs = db.contactus;
const Partner = db.partner_registration;
const Feedback = db.feedback;
const User = db.dashlogins;
const MainQuery = db.mainquery;
const Question = db.questions;
const Response = db.responses;
const Resumes = db.resumes;
const Testimonials = db.testimonials;
const Token = db.tokendata;
const CandidateDetails = db.candidate_details;
const Corporatecorner = db.corporatecorner;
const corporateservices = db.corporateservices;
const Activitylog = db.activitylog;
const Jobs = db.jobs;
const JobApplications = db.job_applications;

exports.index = (req, res) => {
  res.render('index');
};


