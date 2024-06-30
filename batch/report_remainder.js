const moment = require("moment");
const db = rootRequire('app/models')
const { sendMessageToWhatsApp } = require('../app/utils/whatsAppSender');
const { sendReportDownloadEmail } = require('./../app/utils/emailSender');


async function reportDownloadEmail(){
    try {
        // let meeting_details = await db.meetings.findAll({ raw: true });
        let report_data = await db.assessment_reports.findAll({ raw: true });
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
        await Promise.all(filteredReports.map(report => 
            sendMessageToWhatsApp('report_alert', `91${report.candidatephone}`, report.candidatename, [report.candidatename])
        ));
        
        console.log('Cron running done');
    } catch (error) {
        console.error('Error in reportDownloadEmail:', error);
        throw error; // Rethrow the error to ensure the cron job stops if there's an issue
    }
};

await reportDownloadEmail();