const db = require("../config/dbconfig");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTP } = require('./smsOTPSender');
const passport = require('passport'); 
const { sendMessageToWhatsApp } = require('./whatsAppSender');

// Import your Passport setup files
require('../config/passport-google-setup');
require('../config/passport-linkedin-setup');
require('dotenv').config();

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
  sendNewJobAlertMail,
  sendAppliedMail,
  sendAppliedReferredMail,
  sendReferrerMail
} = require('./emailSender');
const { response } = require("express");

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
const Industry = db.industry;
const docs = db.docs;

// controllers/main_controller.js

exports.index = async (req, res) => {
  let jobs = await Jobs.findAll({
    where: {
      status: 1
    }
  });
  let industries = await Industry.findAll({
    where :{
      status:"1"
    }
  });
  let blogs = await Blogs.findAll();
  res.render('index', {
    locals: jobs,
    blogs,
    industries
  });
};
exports.index1 = async (req, res) => {
  let jobs = await Jobs.findAll({
    where: {
      status: 1
    }
  });
  let blogs = await Blogs.findAll();
  res.render('index-2', {
    locals: jobs,
    blogs
  });
};

exports.docs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page query param
  const limit = 9; // Limit to 10 items per page
  const offset = (page - 1) * limit; // Calculate offset

  // Find and count all blogs
  const { rows: blogs, count } = await docs.findAndCountAll({
    limit,
    offset,
  });

  // Calculate total pages
  const totalPages = Math.ceil(count / limit);

  // Render blogs with pagination data
  res.render('docs', {
    blog: blogs,
    currentPage: page,
    totalPages,
  });
};
exports.preview_docs = async (req, res) => {
  try {
    // Get file_url from the query parameters
    const url_title = req.query.file_url;
    console.log("Requested file_url:", url_title);
    
    // If file_url is not provided, redirect to the docs page
    if (!url_title) {
      return res.redirect("/docs");
    }

    // Get all documents for the 'docs' section
    let docsAll = await docs.findAll();
    console.log("All documents:", docsAll);
    
    // Find the specific document by file_url
    let data = await docs.findOne({
      where: {
        file_url: url_title.trim() // Ensure trimming of any excess spaces
      }
    });
    console.log("Single document found:", data);
    
    // If the document is found, render the 'docs-single' view
    if (data) {
      return res.render('docs-single', {
        blog: data,
        blogs: docsAll
      });
    } else {
      // If the document is not found, redirect to the docs page
      return res.redirect("/docs");
    }
  } catch (err) {
    console.error("Error fetching document:", err);
    return res.redirect("/docs");
  }
};


exports.blogGrid = (req, res) => {
  res.render('blog-grid');
};

exports.blogGrid2 = (req, res) => {
  res.render('blog-grid-2');
};

exports.blogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page query param
  const limit = 9; // Limit to 10 items per page
  const offset = (page - 1) * limit; // Calculate offset

  // Find and count all blogs
  const { rows: blogs, count } = await Blogs.findAndCountAll({
    limit,
    offset,
  });

  // Calculate total pages
  const totalPages = Math.ceil(count / limit);

  // Render blogs with pagination data
  res.render('blogs', {
    blog: blogs,
    currentPage: page,
    totalPages,
  });
};


exports.blogSingle = (req, res) => {
  res.render('blog-single');
};
exports.privacypolicy = (req, res) => {
  res.render('privacypolicy');
};
exports.termsandconditions = (req, res) => {
  res.render('termsandconditions');
};
exports.preview_blogs = async (req, res) => {
  const url_title = req.query.url_title;
  let blogs = await Blogs.findAll();

  Blogs.findOne({
      where: {
        url_title: url_title
      }
    })
    .then(data => {
      if (data) {
        // Render the view with the blog data
        res.render('blog-single', {
          blog: data,
          blogs
        });
      } else {
        res.redirect("/blog");
      }
    })
    .catch(err => {
      console.error(err);
      res.redirect("/blog");
    });
};

exports.blogSingle2 = (req, res) => {
  res.render('blog-single-2');
};

exports.candidatesGrid = (req, res) => {
  res.render('candidates-grid');
};

exports.candidatesGrid2 = (req, res) => {
  res.render('candidates-grid-2');
};

exports.candidatesList = (req, res) => {
  res.render('candidates-list');
};

// Employers-related routes
exports.employersGrid = (req, res) => {
  res.render('for-employers');
};

exports.employersGrid2 = (req, res) => {
  res.render('employers-grid-2');
};

exports.employersList = (req, res) => {
  res.render('employers-list');
};

exports.employersSingle = (req, res) => {
  res.render('employers-single');
};

exports.employersSingle2 = (req, res) => {
  res.render('employers-single-2');
};

// Jobs-related routes
exports.jobGrid = (req, res) => {
  res.render('job-grid');
};

exports.jobGrid2 = (req, res) => {
  res.render('job-grid-2');
};

exports.jobList = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, location, job_type, experience, salary, postedDate, search,industry
    } = req.query;
    console.log(req.query);
    


    const filters = {};

    if (search) {
      filters[Op.or] = [{
          heading: {
            [Op.like]: `%${search}%`
          }
        },
        {
          description: {
            [Op.like]: `%${search}%`
          }
        },
        {
          sub_heading: {
            [Op.like]: `%${search}%`
          }
        },
        {
          job_type: {
            [Op.like]: `%${search}%`
          }
        },
        {
          location: {
            [Op.like]: `%${search}%`
          }
        },
        {
          company_size: {
            [Op.like]: `%${search}%`
          }
        },
        {
          website: {
            [Op.like]: `%${search}%`
          }
        },
        {
          relocation: {
            [Op.like]: `%${search}%`
          }
        },
        {
          amount: {
            [Op.like]: `%${search}%`
          }
        },
        {
          experience: {
            [Op.like]: `%${search}%`
          }
        },
        {
          industry: {
            [Op.like]: `%${industry}%`
          }
        }
      ];
    }

    // Filters
    if (location) {
      filters.location = {
        [Op.like]: `%${location}%`
      };
    }
    if (job_type) {
      filters.job_type = job_type;
    }
    if (experience) {
      filters.experience = {
        [Op.like]: `%${experience}%`
      };
    }
    if (salary) {
      filters.amount = {
        [Op.like]: `%${salary}%`
      };
    }
    if (postedDate) {
      filters.createdAt = {
        [Op.gte]: new Date(postedDate)
      };
    }
    if (industry) {
      filters.industry = {
        [Op.gte]:  `%${industry}%`
      };
    }


    // Pagination logic
    const offset = (page - 1) * limit; // Calculate offset
    const totalJobs = await Jobs.count({
      where: filters
    }); // Total number of jobs that match the filters
    const totalPages = Math.ceil(totalJobs / limit); // Total pages

    // Fetch jobs with sorting by createdAt in descending order
    const jobs = await Jobs.findAll({
      where: filters,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['createdAt', 'DESC']
      ] // Sort by createdAt in descending order
    });

    // Calculate start and end indices for the current page
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, totalJobs);
    
    let industries = await Industry.findAll({});

    res.render('job-list', {
      locals: jobs,
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalJobs: totalJobs,
      startIndex: startIndex,
      endIndex: endIndex,
      industries
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
exports.healthCare = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, location, job_type, experience, salary, postedDate, search
    } = req.query;
    console.log(req.query);
    


    const filters = {};

    if (search) {
      filters[Op.or] = [{
          heading: {
            [Op.like]: `%${search}%`
          }
        },
        {
          description: {
            [Op.like]: `%${search}%`
          }
        },
        {
          sub_heading: {
            [Op.like]: `%${search}%`
          }
        },
        {
          job_type: {
            [Op.like]: `%${search}%`
          }
        },
        {
          location: {
            [Op.like]: `%${search}%`
          }
        },
        {
          company_size: {
            [Op.like]: `%${search}%`
          }
        },
        {
          website: {
            [Op.like]: `%${search}%`
          }
        },
        {
          relocation: {
            [Op.like]: `%${search}%`
          }
        },
        {
          amount: {
            [Op.like]: `%${search}%`
          }
        },
        {
          experience: {
            [Op.like]: `%${search}%`
          }
        }
      ];
    }

    // Filters
    if (location) {
      filters.location = {
        [Op.like]: `%${location}%`
      };
    }
    if (job_type) {
      filters.job_type = job_type;
    }
    if (experience) {
      filters.experience = {
        [Op.like]: `%${experience}%`
      };
    }
    if (salary) {
      filters.amount = {
        [Op.like]: `%${salary}%`
      };
    }
    if (postedDate) {
      filters.createdAt = {
        [Op.gte]: new Date(postedDate)
      };
    }


    // Pagination logic
    const offset = (page - 1) * limit; // Calculate offset
    const totalJobs = await Jobs.count({
      where: filters
    }); // Total number of jobs that match the filters
    const totalPages = Math.ceil(totalJobs / limit); // Total pages

    // Fetch jobs with sorting by createdAt in descending order
    const jobs = await Jobs.findAll({
      where: filters,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['createdAt', 'DESC']
      ] // Sort by createdAt in descending order
    });

    // Calculate start and end indices for the current page
    const startIndex = offset + 1;
    const endIndex = Math.min(offset + limit, totalJobs);
    
    

    res.render('job-list', {
      locals: jobs,
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalJobs: totalJobs,
      startIndex: startIndex,
      endIndex: endIndex
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
// Handle job application form submission
exports.applyForJob = async (req, res) => {
  let job_id = req.body.jobid;
  let email = req.body.email;

  console.log(req.body); // Log incoming data

  try {
    // Check if the email already exists for the given job ID
    const existingApplication = await JobApplications.findOne({
      where: {
        job_id: job_id,
        email: email,
      },
    });
    // Check if the email already exists for the given job ID
    const  jobData = await Jobs.findOne({
      where: {
        job_id: job_id,
      },
    });
    

    if (existingApplication) {
      return res.json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    let googleData;
    if (req.file) {
      const response = await uploadFile(req.file.path);
      googleData = {
        filename: response.uploadResponse.name,
        fileId: response.uploadResponse.id,
        publicUrls: response.downloadUrl,
      };
    } else {
      googleData = req.body.resume_link_name;
    }

    const job_application_data = {
      name: req.body.name,
      job_id: job_id,
      email: req.body.email,
      phone_number: req.body.phone,
      resume: req.file ? req.file.filename : null,
      resume_link: googleData,
      status: 1,
      refered: {
        referrer_name: req.body.referrer_name ?? null,
        referrer_email: req.body.referrer_email ?? null,
        referrer_phone: req.body.referrer_phone ?? null,
        relation: req.body.referrer_relation ?? null,
      },
    };

    console.log("Job application data to be saved:", job_application_data); // Log the data you're saving
    
    // Save the job application

    // Save the job application and get the created application object
    const createdJobApplication = await JobApplications.create(job_application_data);

    // Extract the job application ID from the created object
    const jobApplicationId = `A${new Date().getFullYear()}${createdJobApplication.id}`; // Assuming 'id' is the auto-generated application ID

    // await JobApplications.create(job_application_data);

    //send mail
    if (req.body.referrer_name && req.body.referrer_email && req.body.referrer_phone && req.body.referrer_relation) {
      sendAppliedReferredMail(req.body.email,req.body.name,req.body.referrer_name,jobData.heading,jobApplicationId,jobData.experience,jobData.job_type,jobData.amount,process.env.BASE_URL+'job-details?jobId='+jobData.job_id ,process.env.BASE_URL)
      sendReferrerMail(req.body.referrer_email,req.body.referrer_name,req.body.name,jobData.heading,jobApplicationId);
    }else{
      sendAppliedMail(req.body.email,req.body.name,jobApplicationId,jobData.heading,jobData.experience,jobData.job_type,jobData.amount,process.env.BASE_URL+'job-details?jobId='+jobData.job_id ,process.env.BASE_URL)
    }

    // Send a WhatsApp message on successful application
    // sendMessageToWhatsApp('jobappliedsuccessfully', `91${req.body.phone}`, req.body.name, [req.body.name, '1', job_id, new Date().toLocaleDateString()]);

    return res.json({
      success: true,
      message: "Thank you for applying! We will review your application and get back to you soon.",
    });
  } catch (err) {
    console.error("Error saving job application:", err); // Log full error

    return res.json({
      success: false,
      message: "There was an error processing your application. Please try again later.",
      error: err.message, // Return detailed error message for debugging
    });
  }
};



exports.jobSingle = async (req, res) => {
  try {
    const job_id = req.query.jobId;

    // Fetch the specific job by job_id
    const data = await Jobs.findOne({
      where: { job_id }
    });

    // Fetch all active jobs
    const jobs = await Jobs.findAll({
      where: { status: 1 }
    });

    let user = null;

    // Check if the user is logged in (i.e., token exists)
    if (req.cookies.token) {
      const userData = decodeToken(req.cookies.token);

      if (userData && userData.email) {
        // Fetch user data (job applications or similar) using the decoded email
        user = await Response.findOne({
          where: { emailid: userData.email }
        });
      }
    }

    // Render the 'job-single' view with the fetched data
    res.render('job-single', {
      locals: data || {}, // Prevent null/undefined in case the job is not found
      jobs: jobs || [],   // Prevent null/undefined in case no jobs are found
      userData: user || {}    // Provide an empty object if no user data is found
    });
  } catch (error) {
    console.error('Error fetching job details:', error);

    // Render an error page or return a meaningful response
    res.status(500).render('error', {
      message: 'Something went wrong while fetching job details',
      error
    });
  }
};


exports.jobSingle2 = (req, res) => {
  res.render('job-single-2');
};

exports.jobSingle3 = (req, res) => {
  res.render('job-single-3');
};

// Additional Pages (About, Contact, Pricing, etc.)
exports.pageAbout = async (req, res) => {
  let blogs = await Blogs.findAll();
  res.render('page-about',{blogs});
};

exports.pageContact = (req, res) => {
  res.render('page-contact');
};

exports.pagePricing = (req, res) => {
  res.render('page-pricing');
};

exports.pageService = (req, res) => {
  res.render('page-service');
};

exports.pagesFaqs = (req, res) => {
  res.render('pages-faqs');
};

exports.pageBlank = (req, res) => {
  res.render('page-blank');
};

exports.save_contact = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      category: req.body.category,
    };

    // Save contact data to the database
    await ContactUs.create(data);

    // Return success response to the AJAX call
    res.status(200).json({
      message: 'Message sent successfully!'
    });
  } catch (error) {
    // Handle errors
    console.error('Error saving contact message:', error);

    // Return error response to the AJAX call
    res.status(500).json({
      message: 'Failed to send message. Please try again later.'
    });
  }
};
// Controller method for handling the enquiry form submission
exports.submitEnquiry = async (req, res) => {
  try {
    const { category, name, email, phone, cname, cloc, message,plan } = req.body;

    // Construct the message combining company details
    const fullMessage = `Company Name: ${cname}, Company Location: ${cloc}, Phone Number: ${phone}, Choosen  Plan: ${plan}`;

    // Save to ContactUs model
    const newContact = await ContactUs.create({
      category,
      name,
      email,
      message: fullMessage,  // Saving combined message with company details
    });

    // If save is successful
    if (newContact) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return res.json({ success: false });
  }
};


exports.subscribe = async (req, res) => {
  try {
    const {
      email
    } = req.body;
    console.log(email);




    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    // Check if the email already exists in the database
    const existingSubscription = await ContactUs.findOne({
      where: {
        email: email
      }
    });


    if (existingSubscription) {
      return res.status(400).json({
        message: 'Email is already subscribed'
      });
    }

    // If email doesn't exist, create a new subscription
    await ContactUs.create({
      email: email,
      category: 'subscribed'
    });

    res.status(200).json({
      message: 'Subscription successful'
    });
    await sendSubscribedMail(req.body.email);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Subscription failed',
      error: error.message
    });
  }
};




exports.login = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const user = await Response.findOne({
      where: {
        emailid:email
      }
    });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isMatch = (password == user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateAccessToken({
      id: user.id,
      role: 'candidate',
      name: user.name,
      email: user.emailid,
      phonenumber: user.phonenumber,
      isLoggedIn: true,
    });
    console.log(token);
    saveTokenInCookie(res, token);

    res.json({
      token
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.signup = async (req, res) => {
  try {
      const { name, emailid, phonenumber, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({
          where: {
              email:emailid,
              phonenumber:phonenumber
          }
      });

      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: 'User already exists with this email.'
          });
      }

      // Create a new user
      await User.create({
          username:name,
          email:emailid,
          password,
          phonenumber,
          createdby:"System",
          role:'candidate'
      });

      await Response.create({
        name,
        emailid,
        password,
        phonenumber,
        whatsappnumber:phonenumber,
        urole:'candidate',
        phone_verify: 'unverified',
        whatsapp_verify: 'unverified',
        email_verify: 'unverified'
    });
    await sendMessageToWhatsApp('user_signup', `91${req.body.phone}`,  req.body.uname, [ req.body.uname,  req.body.mail,  req.body.pswrd], 'https://upreak.com/images/main_logo.png', 'upreak logo');

      sendWelcomeEmail(name,emailid,password);
      
      const user = await User.findOne({
        where: {
            email:emailid
        }
    }); 

      const token = generateAccessToken({
        id: user.id,
        role: 'candidate',
        name: user.username,
        email: user.email,
        phonenumber: user.phonenumber,
        isLoggedIn: true,
      });

      console.log(token);
      saveTokenInCookie(res, token);

      return res.status(201).json({
          success: true,
          message: 'User registered successfully.'
      });
  } catch (err) {
      console.error('Error during signup:', err);
      return res.status(500).json({
          success: false,
          message: 'Server error. Please try again later.'
      });
  }
};

exports.logout = async (req, res) => {
  try {
    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Error logging out');
      }

      // Clear the token cookie
      res.clearCookie('token', {
        httpOnly: true, // Ensures the cookie is only accessible via HTTP(S) and not by client-side scripts
        secure: false,  // Set to true if you're using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day expiration (make sure this matches the token's expiration if applicable)
      });

      // Redirect to the login page or home page
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Internal Server Error');
  }
};


const crypto = require('crypto');

function generatePassword(length = 12) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}
exports.successGoogleLogin = async (req, res) => {
  console.log(req.user);  
  try {
    // Fetch user by email
    const fetchedUser = await Response.findOne({
      where: {
        emailid: req.user.emails[0].value
      }
    });

    if (!fetchedUser) {
      // Generate a new password (securely hash this in production)
      const createdPassword = generatePassword();

      // Create a new user in the User collection
      await User.create({
        username: req.user.displayName,
        email: req.user.emails[0].value,
        password: createdPassword, // In a real scenario, hash the password before storing
        createdby: "System",
        role: 'candidate',
        googleid: req.user.id
      });

      // Create a new user response record
      await Response.create({
        name: req.user.displayName,
        emailid: req.user.emails[0].value,
        password: createdPassword, // In a real scenario, hash the password before storing
        urole: 'candidate',
        phone_verify: 'unverified',
        whatsapp_verify: 'unverified',
        email_verify: 'verified',
        upload_photo: req.user.photos[0].value
      });

      // Send a welcome email with the new user's information
      sendWelcomeEmail(req.user.displayName, req.user.emails[0].value, createdPassword);

      // Retrieve the newly created user
      const user = await User.findOne({
        where: {
          email: req.user.emails[0].value
        }
      });

      // Generate an access token
      const token = generateAccessToken({
        id: user.id,
        role: 'candidate',
        name: user.username,
        email: user.email,
        phonenumber: user.phonenumber,
        isLoggedIn: true,
      });

      // Save the token in a cookie
      saveTokenInCookie(res, token);

      // Flash a success message and redirect to the workspace
      req.flash('success', 'Signup successfully!');
      return res.redirect('/myworkspace');
    } else {
      // User already exists, proceed with login
      const token = generateAccessToken({
        id: fetchedUser.id,
        role: 'candidate',
        name: fetchedUser.name,
        email: fetchedUser.emailid,
        phonenumber: fetchedUser.phonenumber,
        isLoggedIn: true,
      });

      // Save the token in a cookie
      saveTokenInCookie(res, token);

      // Flash a success message and redirect to the workspace
      req.flash('success', 'Logged in successfully!');
      return res.redirect('/myworkspace');
    }
  } catch (err) {
    req.flash('error', 'Something went wrong!');
    res.status(500).json({ message: 'Server error' });
    console.error('Error during Google login:', err);
  }
};






exports.failureGoogleLogin = async (req, res) => {
  console.error(req);
  res.redirect('/error-500');
}

exports.successMicrosoftLogin = (req, res) => {
  // Successful Microsoft login
  res.redirect('/dashboard'); // or wherever you want to redirect
};

exports.failureMicrosoftLogin = (req, res) => {
  // Failed Microsoft login
  res.redirect('/'); // or wherever you want to redirect
};

exports.successLinkedInLogin = async (req, res) => {
  console.log('LinkedIn user:', req.user); // Inspect profile structure
  try {
    const fetchedUser = await Response.findOne({
      where: {
        emailid: req.user.emails[0].value // Ensure this is the correct path
      }
    });

    if (!fetchedUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateAccessToken({
      id: fetchedUser.id,
      role: 'candidate',
      name: fetchedUser.name,
      email: fetchedUser.emailid,
      phonenumber: fetchedUser.phonenumber,
      isLoggedIn: true,
    });

    console.log(token);
    saveTokenInCookie(res, token);
    req.flash('success', 'Logged in successfully!');
    res.redirect('/myworkspace');
  } catch (err) {
    req.flash('error', 'Something Went Wrong!');
    res.status(500).json({ message: 'Server error' });
    console.error('Error during LinkedIn login:', err);
  }
};


exports.failureLinkedInLogin = (req, res) => {
  // Failed LinkedIn login
  res.redirect('/'); // or wherever you want to redirect
};


function generateOTP() {
  // Generate a 6-digit random number as the OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}



// OTP sending logic
exports.verify_phone_number = async (req, res) => {
  const phoneNumber = req.body.phone;
  const otp = generateOTP(); // Ensure this function generates an OTP

  

  try {
     // Find the user by phone number
     const user = await Response.findOne({
      where: {
        phonenumber: phoneNumber // Ensure the phone number field is correct
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'No User Found' });
    }
    const otpResult = await sendOTP(phoneNumber, otp, 'otp');

    if (otpResult.success) {
      req.session.otp = otp; // Save OTP in session
      req.session.phoneNumber = phoneNumber; // Save phone number in session
      res.json({ otpSent: true, verified: false, otp, message: 'OTP sent successfully' });
    } else {
      res.json({ otpSent: false, verified: false, otp: null, message: otpResult.message });
    }
  } catch (err) {
    console.error('Error while sending OTP:', err);
    res.status(500).json({ otpSent: false, verified: false, otp: null, message: 'Server error' });
  }
};





// OTP verification logic
exports.verify_otp = async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = req.session.otp;
  console.log(req.session.otp);
  console.log(req.body.otp);
  
  try {
    // Find the user by phone number
    const user = await Response.findOne({
      where: {
        phonenumber: phone // Ensure the phone number field is correct
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'No User Found' });
    }

    if (storedOtp && otp === storedOtp) {
      // Generate an access token for the user
      const token = generateAccessToken({
        id: user.id,
        role: 'candidate',
        name: user.name,
        email: user.emailid,
        phoneNumber: user.phonenumber, // Ensure this is the correct field
        isLoggedIn: true
      });

      // Log token for debugging (optional)
      console.log('Generated Token:', token);

      // Save token in a cookie
      saveTokenInCookie(res, token);

      // Clear the OTP from the session
      req.session.otp = null;

      res.json({ verified: true, message: 'OTP verified successfully!' });
    } else {
      res.status(400).json({ verified: false, message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    console.error('Error during OTP verification:', err);
    res.status(500).json({ verified: false, message: 'Server error' });
  }
};

