const db = require("../config/dbconfig");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const {
  Op
} = require('sequelize');
const {
  generateAccessToken,
  saveTokenInCookie,
  decodeToken
} = require('../middleware/jwt');
const {
  sendPasswordEmail,
  sendVerificationEmail,
  sendWelcomeHrMail,
  sendVerificationSuccessEmail,
  sendVerificationFailureEmail,
  sendWelcomeEmail,
  sendSlotConfirmEmail,
  sendHRSlotConfirmEmail,
  sendrequestmail,
  sendrequestreceivedmail,
  sendTwoStepEmail,
  sendSubscribedMail,
  sendNewJobAlertMail
} = require('./emailSender');
const candidateModel = require("../models/candidateModel");

const Jobs = db.jobs;
const JobApplications = db.job_applications;
const Response = db.responses;
const Payment = db.paymentdetails;
const meetings = db.meetings;
const Reports = db.assessmentreports;

/*const Blogs = db.blogs;
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
const JobApplications = db.job_applications;*/

exports.workspace = async (req, res) => {
  try {
    const userData = decodeToken(req.cookies.token);

    // Fetch user data (job applications or similar)
    let data = await Response.findOne({
      where: {
        emailid: userData.email
      }
    });

    // Extract query parameters
    const { page = 1, limit = 10, location, job_type, experience, salary, postedDate, search } = req.query;

    // Ensure `page` and `limit` are integers and positive
    const pageNumber = Math.max(1, parseInt(page));
    const pageLimit = Math.max(1, parseInt(limit));

    // Initialize filters object
    const filters = {};

    // Add search filter (Op.or)
    if (search) {
      filters[Op.or] = [
        { heading: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { sub_heading: { [Op.like]: `%${search}%` } },
        { job_type: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { company_size: { [Op.like]: `%${search}%` } },
        { website: { [Op.like]: `%${search}%` } },
        { relocation: { [Op.like]: `%${search}%` } },
        { amount: { [Op.like]: `%${search}%` } },
        { experience: { [Op.like]: `%${search}%` } }
      ];
    }

    // Apply location filter
    if (location) {
      filters.location = { [Op.like]: `%${location}%` };
    }

    // Apply job_type filter
    if (job_type) {
      filters.job_type = job_type;
    }

    // Apply experience filter
    if (experience) {
      filters.experience = { [Op.like]: `%${experience}%` };
    }

    // Apply salary filter
    if (salary) {
      filters.amount = { [Op.like]: `%${salary}%` };
    }

    // Apply posted date filter
    if (postedDate) {
      filters.createdAt = { [Op.gte]: new Date(postedDate) };
    }

    // Pagination logic
    const offset = (pageNumber - 1) * pageLimit;

    // Get total job count for pagination
    const totalJobs = await Jobs.count({ where: filters });
    const totalPages = Math.ceil(totalJobs / pageLimit);

    // Fetch jobs based on filters and pagination
    const jobs = await Jobs.findAll({
      where: filters,
      limit: pageLimit,
      offset: offset,
      
      order: [['createdAt', 'DESC']]
    });

    // Calculate start and end index for pagination display
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + pageLimit, totalJobs);

    // Render the 'workspace' template with jobs and pagination info
    res.render('workspace', {
      title: 'My Workspace',
      locals: jobs,
      user:data,
      currentPage: pageNumber,
      totalPages: totalPages,
      totalJobs: totalJobs,
      startIndex: startIndex,
      endIndex: endIndex,
      currentPath: req.path 
    });

  } catch (error) {
    // Log and return error if something goes wrong
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.myprofile = async (req, res) => {
  const userData = decodeToken(req.cookies.token);

    // Fetch user data (job applications or similar)
    let data = await Response.findOne({
      where: {
        emailid: userData.email
      }
    });

  res.render('workspace-profile',{title: 'View & Edit Profile',user:data,currentPath: req.path });
};
exports.editProfile = async (req, res) => {
  const userData = decodeToken(req.cookies.token);

    // Fetch user data (job applications or similar)
    let data = await Response.findOne({
      where: {
        emailid: userData.email
      }
    });

  res.render('workspace-edit-profile',{title: 'View & Edit Profile',user:data,profile:data,currentPath: req.path });
};


exports.appliedjobs = async (req, res) => {
  try {
    const userData = decodeToken(req.cookies.token);

    // Fetch user data
    let user = await Response.findOne({
      where: {
        emailid: userData.email,
      },
    });

    // Fetch all job applications for the logged-in user
    let jobApplications = await JobApplications.findAll({
      where: {
        email: userData.email,
      },
    });

    // Extract only the job_id from each job application
    const jobIds = jobApplications.map((job) => job.dataValues.job_id);

    // Fetch job details based on applied jobs
    let appliedJobDetails = await Jobs.findAll({
      where: {
        job_id: {
          [Op.in]: jobIds,
        },
      },
      attributes: ['job_id', 'heading', 'location', 'job_type', 'createdAt', 'description', 'experience'],
    });

    // Render the applied jobs to the client-side using AJAX
    res.render('workspace-applied-jobs', {
      title: 'Jobs application status',
      userData,
      user,
      jobs: jobApplications,
      locals: appliedJobDetails, // Pass the filtered jobs to locals
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).send('Server Error');
  }
};


exports.subscription = async (req, res) => {
  const userData = decodeToken(req.cookies.token);

  // Fetch user data (job applications or similar)
  let data = await Response.findOne({
    where: {
      emailid: userData.email
    }
  });
  res.render('workspace-subscription',{title: 'Subscription',user:data});
};
exports.getPaymentHistory = async (req, res) => {
  try {
    // Decode token to retrieve user data
    const userData = decodeToken(req.cookies.token);

    // Fetch payment history from the database
    let paymentHistory = await Payment.findAll(
      {
        where: {
          email: userData.email
        }
      }
    );  // Ensure `Payment.findAll()` is awaited

    // Fetch user data (job applications or similar)
    let user = await Response.findOne({
      where: {
        emailid: userData.email
      }
    });

    // Render the payment history view and pass the necessary data
    res.render('paymentHistory', {
      moment,
      title: 'Payment History',
      user: user,  // Pass user data
      payment: paymentHistory  // Pass payment history data
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.getBookSlots = async (req, res) => {
  // Logic to handle booking slots for mock interview
  const userData = decodeToken(req.cookies.token);

  // Fetch user data (job applications or similar)
  let data = await Response.findOne({
    where: {
      emailid: userData.email
    }
  });
  res.render('bookSlots', { title: 'Book Slots',user:data });
};

exports.getBookedSlots = async (req, res) => {
  // Logic to display already booked slots
  const userData = decodeToken(req.cookies.token);
  // Fetch user data (job applications or similar)
  let slots = await meetings.findAll({
    where: {
      email: userData.email
    }
  });

  // Fetch user data (job applications or similar)
  let data = await Response.findOne({
    where: {
      emailid: userData.email
    }
  });
  res.render('bookedSlots', { title: 'Booked Slots',user:data,slots,moment });
};

exports.getInterviewResults = async (req, res) => {
  // Logic to fetch and display interview results
  const userData = decodeToken(req.cookies.token);

  // Fetch user data (job applications or similar)
  let report = await Reports.findAll({
    where: {
      candidateemail: userData.email
    }
  });
  let data = await Response.findOne({
    where: {
      emailid: userData.email
    }
  });
  res.render('interviewResults', { title: 'Interview Results',user:data,report });
};

exports.getRaiseIssue = async (req, res) => {
  // Render a form where the user can raise issues
  const userData = decodeToken(req.cookies.token);

  // Fetch user data (job applications or similar)
  let data = await Response.findOne({
    where: {
      emailid: userData.email
    }
  });
  res.render('workspace-raiseIssue',{title: 'Raise Issue',user:data});
};

exports.getreferralprogram = async (req, res) => {
  try {
    // Decode user token from cookies
    const userData = decodeToken(req.cookies.token);

    // Fetch user data based on email
    const user = await Response.findOne({
      where: {
        emailid: userData.email
      }
    });

    // Fetch referral details based on the user's email
    const referDetail = await JobApplications.findAll({
      where: {
        'refered.referrer_email': userData.email
      }
    });
    console.log(referDetail);
    

    // Render the view with fetched data
    res.render('workspace-referral-program', {
      title: 'Referral Program',
      referDetail: referDetail.length > 0 ? referDetail : null,
      user: user || null
    });
  } catch (error) {
    // Log the error and handle it
    console.error('Error fetching referral program data:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.updateProfile = async (req, res) => {
  try {
    // Access form data
    const formData = req.body;

    // Log the form data for debugging
    console.log('Form Data:', formData);

    // Update the profile in the database
    await Response.update(formData, {
      where: {
        id: formData.id
      }
    });

    // Send a success JSON response
    res.json({ message: 'Profile updated successfully!' });
  } catch (error) {
    // Handle any errors that occur during the update
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'An error occurred while updating the profile.' });
  }
};
