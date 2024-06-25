const Sequelize = require('sequelize');

const sequelize = new Sequelize('upreak', 'upreak', 'upreak', {
    host: '143.110.249.17',
    dialect: 'postgres'
});

try{
    sequelize.authenticate();
    console.log("server connection done");
}catch(error){
    console.error("not done",error);
}

const db={};
db.Sequelize=Sequelize;
db.sequelize=sequelize; 

db.dashlogins = require("../models/LoginModel")(sequelize,Sequelize.DataTypes);
db.mainquery = require("../models/mainModel")(sequelize,Sequelize.DataTypes); 
db.feedback = require("../models/feedbackModel")(sequelize,Sequelize.DataTypes); 
db.questions = require("../models/questionModel")(sequelize,Sequelize.DataTypes); 
db.responses= require("../models/responseModel")(sequelize,Sequelize.DataTypes); 
db.candidate_details = require("../models/candidateModel")(sequelize,Sequelize.DataTypes); 
db.partner_registration= require("../models/partnerModel")(sequelize,Sequelize.DataTypes); 
db.contactus= require("../models/contactModel")(sequelize,Sequelize.DataTypes);
db.products= require("../models/productModel")(sequelize,Sequelize.DataTypes);
db.resumes= require("../models/resumeModel")(sequelize,Sequelize.DataTypes);
db.mou_registrations= require("../models/mouModel")(sequelize,Sequelize.DataTypes);
db.paymentdetails= require("../models/paymentModel")(sequelize,Sequelize.DataTypes); 
db.testimonials= require("../models/testimonialModel")(sequelize,Sequelize.DataTypes);
db.settings= require("../models/settingModel")(sequelize,Sequelize.DataTypes);
db.meetings= require("../models/meetingModel")(sequelize,Sequelize.DataTypes);
db.assessmentreports= require("../models/assessmentreportsModel")(sequelize,Sequelize.DataTypes);
db.tokendata= require("../models/tokenModel")(sequelize,Sequelize.DataTypes);
db.blogs= require("../models/blogsModel")(sequelize,Sequelize.DataTypes); 
db.corporatecorner= require("../models/corporatecornerModel")(sequelize,Sequelize.DataTypes); 
db.corporateservices= require("../models/corporateservicesModel")(sequelize,Sequelize.DataTypes); 
db.activitylog= require("../models/activitylogModel")(sequelize,Sequelize.DataTypes); 
db.jobs= require("../models/jobModel")(sequelize,Sequelize.DataTypes); 
db.job_applications = require("../models/jobApplication")(sequelize,Sequelize.DataTypes); 

db.sequelize.sync({force:false}).then(() =>{
    console.log("Resync is done");
});

module.exports = db;
