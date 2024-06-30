// const nodemailer = require('nodemailer');
// //require('tls').DEFAULT_MIN_VERSION = 'TLSv1';
// const fs = require('fs');
// const { env, smtp } = rootRequire('config/config');
// const transporter = nodemailer.createTransport(smtp);
// const ejs = require('ejs');
// const path = require('path');
// let tempEmail = {
//     lastDate: new Date(),
//     mailIDs: {}
// };
// function emailLog(err) {
//     var date = new Date();
//     var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
//     fs.appendFile(path.normalize(__dirname + './../../logs/') + "mailSent" + time + ".txt", "\r\n" + err, function (err) {
//         if (err) return console.log(err);
//     });
// }

// const _encodeHtml = function (str) {
//     return str.replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;")
// }

// //Send Mail Function
// function sendMail(req, callback) {
//     let mailData = {};
//     if (new Date() > tempEmail.lastDate) {
//         tempEmail.mailIDs = {};
//     }

//     if (tempEmail.mailIDs.hasOwnProperty(req.to) && tempEmail.mailIDs[req.to] > 10) {
//         emailLog(new Date() + ' Can\'t Send Mail to (Limit Exceed) : ' + mailData.to + ' with Subject : ' + mailData.subject);
//         callback({ status: false, error: ' Can\'t Send Mail to (Limit Exceed)' });
//         return false;
//     } else if (!tempEmail.mailIDs.hasOwnProperty(req.to)) {
//         tempEmail.mailIDs[req.to] = 1;
//     } else if (tempEmail.mailIDs.hasOwnProperty(req.to) && tempEmail.mailIDs[req.to] < 10) {
//         tempEmail.mailIDs[req.to] += 1;
//     }
//     if (env == 'development') {
//         mailData = {
//             from: '',
//             to: '',
//             bcc: '',
//             subject: '',
//             html: 'HTML version of the message'
//         };
//     } else {
//         mailData = {
//             from: '',
//             to: '',
//             bcc: '',
//             subject: ``,
//             html: ''
//         };
//     }
//     if (req.to) {
//         mailData.to = req.to;
//     }
//     if (req.from != undefined) {
//         mailData.from = req.from;
//     }
//     if (req.subject != undefined) {
//         mailData.subject = req.subject;
//     }
//     if (req.html != undefined) {
//         mailData.html = req.html;
//     } else if (req.template != undefined) {
//         let htmlstream = fs.readFileSync(path.normalize(__dirname + '/../views/email') + '/' + req.template, 'utf8');
//         let data = req.data || {};
//         data.siteUrl = '';
//         let html = ejs.render(htmlstream, data);
//         mailData.html = html;
//     }
//     if (req.attachments) {
//         mailData.attachments = req.attachments;
//     }
//     if(req.cc && req.cc.length){
//         mailData.cc = req.cc;
//     }
//     // emailLog(new Date() + ' Sending Mail to : ' + mailData.to + ' with Subject : ' + mailData.subject + ' With CC : ' +  mailData.cc);

//     // db.mail_testing.update({
//     //     mail_response_from_mailer : `Mail CC : ${mailData.cc}, Mail To : ${mailData.to}`
//     // }, {
//     //     where: {
//     //         id: req.mailIdRes
//     //     }
//     // })
//     transporter.sendMail(mailData, function (error, info) {
//         let logData = {};
//         if (req.client_id)
//             logData.client_id = req.client_id.toString();
//         if (error) {
//             let mailLogData = { mail_to: `'${mailData.to}'`, mail_cc : mailData.cc || null, mail_subject: mailData.subject, mail_body: _encodeHtml(mailData.html), createdAt: new Date(), mail_sent: false, mail_response: error };
//             logData = { ...logData, ...mailLogData };
//             logMail({ ...mailLogData, ...logData });
//             callback({ status: false, error: error });
//         } else {
//             let mailLogData = { mail_to: `'${mailData.to}'`, mail_cc : mailData.cc || null, mail_subject: mailData.subject, mail_body: _encodeHtml(mailData.html), createdAt: new Date(), mail_sent: true, mail_response: info }
//             console.log('mail sent sent to client !');
//             logData = { ...logData, ...mailLogData };
//             logMail({ ...mailLogData, ...logData });
//             callback({ status: true, data: info });
//         }
//     });
// }

// const logMail = async data => {
//     try {
//         //await db.mail_logs.create(data);
//     } catch (error) {
//         console.error('Error While Logging Mail', error);
//     }
// }

// module.exports = sendMail;
