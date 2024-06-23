const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const db = require("./config/dbconfig");
const winston = require("./config/winston");
const cron = require('node-cron');
const moment = require("moment");
var morgan = require('morgan');
const { loadCorporateCorners } = require('./middleware/middleware');
// const { sendMessageToWhatsApp } = require('./controllers/whatsappSender');
const { sendReportDownloadEmail } = require('./controllers/emailSender');

const app = express();


app.set('view engine', 'ejs');

app.use(loadCorporateCorners);

app.use(express.static("public"));
app.use('/uploads',express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(morgan('combined', { stream: winston.stream }));

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

app.use(function (req, res, next) {
    if ('HEAD' == req.method || 'OPTIONS' == req.method) return next();
    // break session hash / force express to spit out a new cookie once per second at most
    app.locals.session = req.session;
    next();
  });

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
        // await Promise.all(filteredReports.map(report => sendMessageToWhatsApp(`91${report.candidatephone}`, `Dear ${report.candidatename},\nCongratulation! Your report is ready.
        //     \nYou can view your report by following the below instructions:
        //     \nStep 1: Login into your Portal
        //     \nStep 2: Click on the Product Tab 
        //     \nStep 3: Then after the dropdown, click on Reports
        //     \nStep 4: Now you can download your Report.
        //     \nThanks for your time and patience. Feel free to contact us.
        //     \nBest Regards
        //     \nUpreak`)));

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
app.listen(port,function(){
    console.log("Upreak Server has started on port",port);
});
