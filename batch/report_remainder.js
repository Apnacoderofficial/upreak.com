const path = require('path');
const moment = require("moment");
const db = require("../config/dbconfig");
const { sendMessageToWhatsApp } = require('./../controllers/whatsappSender');
const { sendReportDownloadEmail } = require('./../controllers/emailSender');
const cron = require('node-cron');

const reportDownloadEmail = async () =>{

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

        // Send Whatsapp  to filteredReports concurrently
        await Promise.all(filteredReports.map(report => sendMessageToWhatsApp(`91${report.candidatephone}`, `Dear ${report.candidatename},\nCongratulation! Your report is ready.
            \nYou can view your report by following below Instruction :
            \nStep 1 : Login into you Portal
            \nStep 2 : Click on Product Tab 
            \nStep 3 : Then after dropdown click on Reports
            \nStep 4 : Now you can download you Report.
            \n
            \nThanks for time and patience.Feel free to contact here
            \n
            \nBest Regards
            \nUpreak`)));
};

module.exports = { reportDownloadEmail };
