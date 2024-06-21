const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var flash = require('express-flash');
const db = require("./config/dbconfig");
// const winston = require("./config/winston");
const cron = require('node-cron');
const moment = require("moment");
// var morgan = require('morgan');
const { sendMessageToWhatsApp } = require('./controllers/whatsappSender');
const { sendReportDownloadEmail } = require('./controllers/emailSender')
const redisClient = require('./config/redisClient');

const app = express();

// app.use(morgan('combined', { stream: winston.stream }));

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

app.use(flash());

app.use(function (req, res, next) {
    if ('HEAD' == req.method || 'OPTIONS' == req.method) return next();
    // break session hash / force express to spit out a new cookie once per second at most
    req.session._garbage = Date();
    req.session.touch();
    res.locals.session = req.session;
    app.locals.session = req.session;
    app.locals.errors = req.flash('Error');
    app.locals.Success = req.flash('Success');
    next();
});

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use('/uploads',express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require("./routes/file_route")(app);

cron.schedule('0 22 * * *', async () => {
    try {
        console.log('Cron running at 10 PM');
        console.log(new Date());
        await reportDownloadEmail();
        console.log('Cron running done at 10 PM');
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

async function reportDownloadEmail() {
    try {
        // let meeting_details = await db.meetings.findAll({ raw: true });
        let report_data = await db.assessmentreports.findAll({ raw: true });
        const currentDate = moment().startOf('day'); // Get the current date without time

        // Filter the data based on the criteria
        const filteredReports = report_data.filter(report => {
            const createdAtDate = moment(report.createdAt, 'YYYY-MM-DD').startOf('day'); // Extract date without time
            const daysDifference = currentDate.diff(createdAtDate, 'days');
            return daysDifference == 1;
        });

        // Send emails to filteredReports concurrently
        await Promise.all(filteredReports.map(report => sendReportDownloadEmail(report.candidateemail)));

        // Send WhatsApp messages to filteredReports concurrently
        await Promise.all(filteredReports.map(report => sendMessageToWhatsApp(`91${report.candidatephone}`, `Dear ${report.candidatename},\nCongratulation! Your report is ready.
            \nYou can view your report by following the below instructions:
            \nStep 1: Login into your Portal
            \nStep 2: Click on the Product Tab 
            \nStep 3: Then after the dropdown, click on Reports
            \nStep 4: Now you can download your Report.
            \nThanks for your time and patience. Feel free to contact us.
            \nBest Regards
            \nUpreak`)));

        console.log('Cron running done');
    } catch (error) {
        console.error('Error in reportDownloadEmail:', error);
        throw error; // Rethrow the error to ensure the cron job stops if there's an issue
    }
}

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
// app.listen(port,function(){
//     console.log("Upreak Server has started on port",port);
// });


// Check if Redis is connected before starting the server
redisClient.once('connect', () => {
    // Start your Express server
    app.listen(port, () => {
        console.log(`Upreak Server is running on port ${port}`);
    });
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
    process.exit(1); // Exit with non-zero code to indicate failure
});