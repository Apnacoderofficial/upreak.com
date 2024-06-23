var nodemailer = require('nodemailer');

// const MAIL_SETTINGS = {
//   service: 'gmail',
//   auth: {
//     user: 'upreakofficial@gmail.com',
//     pass: 'ejtliuujazvcfwlg'
//   },
// };

const MAIL_SETTINGS = {
  host: 'smtp.office365.com',
  port: 587,
  auth: {
    user: 'noreply@upreak.com',
    pass: '@#PmUpNO2024',
  },
};


const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const sendPasswordEmail = async (recipientEmail, password) => {
  try {
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Reset Password',
      text: `Your Email is: ${recipientEmail} and Password is: ${password}`,
    });

    console.log('Reset email sent successfully!');
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};

const sendVerificationEmail = async (recipientEmail, otp) => {
  try {
    const otpHtml = `
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>
<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">  </div>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#fff" align="center" style="background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff"valign="top" style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                      <center>
                     <img src="https://upreak.com/images/main_logo.png" width="200"  style="display: block; border: 0px;" />
                      </center>
                     <hr>
                      <h3>Dear Candidate</h3>
                      <p style="font-size: 16px;font-family: rubik,sans-serif;">You have requested for the One Time Password <br> So your One Time Password is </p>
                     <p style="font-size: 16px;font-family: rubik,sans-serif; text-align: center;" ><b style="font-size:30px;font-weight: bolder;">${otp}</h1></b>
                        
                        
                        <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thank you for visiting Upreak.  <br>                           
                            
                            
                            <strong>For more information, you can also contact us at</strong> <a href="mailto:info@upreak.com">info@upreak.com</a><br><br>
                            <hr>
                         <!-- <img src="https://upreak.com/images/social/srclogo.png" style="display: block; border: 0px;margin-top: 3px; "/> -->
                         <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal, Karnataka, 583227
                         <br>
                         <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a href="mailto:info@upreak.com">info@upreak.com</a> | <a href="https://upreak.com/">www.upreak.com</a>
                         <br><br>
                      <div style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                        <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" width="20"  style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;"/></a>
                        <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" width="20"  style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;"/></a>
                        <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" width="20"  style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;"/></a>
                        <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" width="20"  style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;"/></a>
                        <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" width="20"  style="display: block; border: 0px;margin-right: 15px;"/></a>
                        </div>
                       
                        </h1>
                   
                    </td>
                    
                </tr>
            </table>
        </td>
    </tr>
    
</table>
</body>
</html>
  `;
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'OTP Verification',
      html: otpHtml,
    });

    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

const sendWelcomeHrMail = async (recipientEmail,username,password) => {
  try {
    const welHtml = `
    <html>

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#fff" align="center" style="background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td bgcolor="#ffffff" valign="top" style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                  <center>
                    <img src="https://upreak.com/images/main_logo.png" width="200" style="display: block; border: 0px;" />
                  </center>
                  <hr>
                  <h3>Dear HR,</h3>
                  <p style="font-size: 16px;font-family: rubik,sans-serif;">Welcome to upreak team. <br> your credentials are given below : </p>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Username : ${username}</b>
                <p style="font-size: 16px;font-family: rubik,sans-serif; ">Password : ${password}</b>
              <p style="font-size: 16px;font-family: rubik,sans-serif; ">Login Link : <a href="https://upreak.com/login">Login</a></b>
    
                  <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thanks for time and patience.Feel free to contact on <a href="https://wa.me/+917975930773">whatsapp</a> <br>
    
                    <strong>For more information, you can also contact us at</strong> <a href="mailto:info@upreak.com">info@upreak.com</a><br><br>
                    
                    <hr>
                    <!-- <img src="https://upreak.com/images/social/srclogo.png" style="display: block; border: 0px;margin-top: 3px; "/> -->
                    <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal, Karnataka, 583227
                    <br>
                    <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a href="mailto:info@upreak.com">info@upreak.com</a> | <a href="https://upreak.com/">www.upreak.com</a>
                    <br><br>
                    <div style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                      <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" width="20" style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;" /></a>
                      <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" width="20" style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;" /></a>
                      <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" width="20" style="display: block; border: 0px;margin-right: 15px;" /></a>
                    </div>
    
                  </h1>
    
                </td>
    
              </tr>
            </table>
          </td>
        </tr>
    
      </table>
    </body>
    
    </html>
  `;
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Welcome to upreak Team',
      html: welHtml,
    });

    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

const sendVerificationSuccessEmail = async (recipientEmail) => {
  try {
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Verification Successful',
      text: 'Your OTP verification was successful. Thank you!',
    });

    console.log('Verification success email sent successfully!');
  } catch (error) {
    console.error('Error sending verification success email:', error);
  }
};

const sendVerificationFailureEmail = async (recipientEmail) => {
  try {
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Verification Failed',
      text: 'Your OTP verification failed. Please try again.',
    });

    console.log('Verification failure email sent successfully!');
  } catch (error) {
    console.error('Error sending verification failure email:', error);
  }
};

const sendWelcomeEmail = async (recipientEmail, password) => {
  try {
    const wlcmHtml =`<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">  </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#fff" align="center" style="background-color:#fff;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff"valign="top" style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                          <center>
                         <img src="https://upreak.com/images/main_logo.png" width="200"  style="display: block; border: 0px;" />
                          </center>
                         <hr>
                         <center>
                            <img src="https://gifdb.com/images/high/welcome-greeting-1y2timm763pcwtl2.webp" width="100%"  style="display: block; border: 0px;" />
                             </center>
                          <h3>Dear Candidate</h3>
                          <p style="font-size: 16px;font-family: rubik,sans-serif;">Welcome to upreak ! We are happy to see you <br>  Your login credentials are given below :</p>
                            <p style="font-size: 16px;font-family: rubik,sans-serif;" >Email: <b style="font-size:16px;font-weight: bolder;">${recipientEmail}</b>
                            <p style="font-size: 16px;font-family: rubik,sans-serif;" >Password: <b style="font-size:16px;font-weight: bolder;">${password}</b>
                                <p style="font-size: 16px;font-family: rubik,sans-serif;" >Link: <b style="font-size:16px;font-weight: bolder;"><a href="https://upreak.com/login">Login Link</a></b>
                            
                            <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thank you for visiting Upreak.  <br>                           
                                
                                
                                <strong>For more information, you can also contact us at</strong> <a href="mailto:info@upreak.com">info@upreak.com</a><br><br>
                                <hr>
                             <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal, Karnataka, 583227
                             <br>
                             <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a href="mailto:info@upreak.com">info@upreak.com</a> | <a href="https://upreak.com/">www.upreak.com</a>
                             <br><br>
                          <div style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                            <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" width="20"  style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;"/></a>
                            <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" width="20"  style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;"/></a>
                            <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" width="20"  style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;"/></a>
                            <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" width="20"  style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;"/></a>
                            <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" width="20"  style="display: block; border: 0px;margin-right: 15px;"/></a>
                            </div>
                           
                            </h1>
                       
                        </td>
                        
                    </tr>
                </table>
            </td>
        </tr>
        
    </table>
    </body>
    </html>`;
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Welcome To Upreak',
      html: wlcmHtml,
    });

    console.log('Welcome email sent successfully!');
  } catch (error) {
    console.error('Error sending Welcome email:', error);
  }
};

const sendSlotConfirmEmail = async (recipientEmail,username,link,start_time,end_time) => {
  try {
    const slotHtml =`<html>

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
      <div
        style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
      </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#fff" align="center" style="background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td bgcolor="#ffffff" valign="top"
                  style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                  <center>
                    <img src="https://upreak.com/images/main_logo.png" width="200" style="display: block; border: 0px;" />
                  </center>
                  <hr>
                  <h3>Dear ${username},</h3>
                  <p style="font-size: 16px;font-family: rubik,sans-serif;">Congratulation! Your Slot has been booked
                    successfully. <br> Your meeting details are given below : </p>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Email : ${recipientEmail}</b>
                    <p style="font-size: 16px;font-family: rubik,sans-serif; ">Meeting Time: ${start_time} to
                      ${end_time}</b>
                      <p style="font-size: 16px;font-family: rubik,sans-serif; ">Meeting Link : Kindly check link on the portal in Booked Slots under Booking Details.</b>
    
                        <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thanks for
                          time and patience.Feel free to contact on <a href="https://wa.me/+917975930773">whatsapp</a> <br>
    
                          <strong>For more information, you can also contact us at</strong> <a
                            href="mailto:info@upreak.com">info@upreak.com</a><br><br>
    
                          <hr>
                          <!-- <img src="https://upreak.com/images/social/srclogo.png" style="display: block; border: 0px;margin-top: 3px; "/> -->
                          <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal,
                          Karnataka, 583227
                          <br>
                          <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a
                            href="mailto:info@upreak.com">info@upreak.com</a> | <a
                            href="https://upreak.com/">www.upreak.com</a>
                          <br><br>
                          <div
                            style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                            <a href="https://www.linkedin.com/company/upreak" target="_blank"><img
                                src="https://upreak.com/images/social/li.png" width="20"
                                style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                            <a href="https://www.facebook.com/upreak" target="_blank"><img
                                src="https://upreak.com/images/social/f.png" width="20"
                                style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                            <a href="https://twitter.com/upreak" target="_blank"><img
                                src="https://upreak.com/images/social/t.png" width="20"
                                style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;" /></a>
                            <a href="https://www.youtube.com/@Upreak" target="_blank"><img
                                src="https://upreak.com/images/social/y.png" width="20"
                                style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;" /></a>
                            <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img
                                src="https://upreak.com/images/social/i.png" width="20"
                                style="display: block; border: 0px;margin-right: 15px;" /></a>
                          </div>
    
                        </h1>
    
                </td>
    
              </tr>
            </table>
          </td>
        </tr>
    
      </table>
    </body>
    
    </html>`;
     
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Regarding Slot Conformation - Upreak',
      html: slotHtml,
    });

    console.log('Slot Confirm email sent successfully!');
  } catch (error) {
    console.error('Error sending Slot Confirm email:', error);
  }
};

const sendHRSlotConfirmEmail = async (recipientEmail,recipientName,recipientPhone,link,start_time,end_time) => {
  try {
    const slotHRHtml =`<html>

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
      </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#fff" align="center" style="background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td bgcolor="#ffffff" valign="top" style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                  <center>
                    <img src="https://upreak.com/images/main_logo.png" width="200" style="display: block; border: 0px;" />
                  </center>
                  <hr>
                  <h3>Dear HR,</h3>
                  <p style="font-size: 16px;font-family: rubik,sans-serif;">Your Choosen Slot has been booked successfully. <br> Your meeting details are given below : </p>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Candidate Name : ${recipientName}</b>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Candidate Email : ${recipientEmail}</b>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Candidate Contact Detail : ${recipientPhone}</b>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Meeting Time: ${start_time} to
                    ${end_time}</b>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Meeting Link : Kindly check link on the portal in Booked Slot Table in Slots Section under Interview Slots.</b>
    
                  <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thanks for
                    time and patience.Feel free to contact on <a href="https://wa.me/+917975930773">whatsapp</a> <br>
    
                    <strong>For more information, you can also contact us at</strong> <a href="mailto:info@upreak.com">info@upreak.com</a><br><br>
    
                    <hr>
                    <!-- <img src="https://upreak.com/images/social/srclogo.png" style="display: block; border: 0px;margin-top: 3px; "/> -->
                    <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal,
                    Karnataka, 583227
                    <br>
                    <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a href="mailto:info@upreak.com">info@upreak.com</a> | <a href="https://upreak.com/">www.upreak.com</a>
                    <br><br>
                    <div style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                      <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" width="20" style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;" /></a>
                      <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" width="20" style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;" /></a>
                      <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" width="20" style="display: block; border: 0px;margin-right: 15px;" /></a>
                    </div>
    
                  </h1>
    
                </td>
    
              </tr>
            </table>
          </td>
        </tr>
    
      </table>
    </body>
    
    </html>`;
     
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Regarding Slot Conformation - Upreak',
      html: slotHRHtml,
    });

    console.log('HR Slot Confirm email sent successfully!');
  } catch (error) {
    console.error('Error sending HR Slot Confirm email:', error);
  }
};

const sendReportDownloadEmail = async (recipientEmail) => {
  try {
    const reportHtml = `<html>

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#fff" align="center" style="background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td bgcolor="#ffffff" valign="top" style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                  <center>
                    <img src="https://upreak.com/images/main_logo.png" width="200" style="display: block; border: 0px;" />
                  </center>
                  <hr>
                   <img src="https://www.gifcen.com/wp-content/uploads/2022/10/congratulations-gif-3.gif" width="100%" style="display: block; border: 0px;" />
                  <h3>Dear Candidate,</h3>
                  <p style="font-size: 16px;font-family: rubik,sans-serif;">Congratulation! Your report is ready. <br> You can view your report by following below Instruction : </p>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Step 1 : <a href="https://upreak.com/login">Login</a> into you Portal</b>
                <p style="font-size: 16px;font-family: rubik,sans-serif; ">Step 2 : Click on Product Tab </b>
                          <p style="font-size: 16px;font-family: rubik,sans-serif; ">Step 3 : Then after dropdown click on Reports </b>
                                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Step 4 : Now you can download you Report.</b>
    
                  <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thanks for time and patience.Feel free to contact on <a href="https://wa.me/+917975930773">whatsapp</a> <br>
    
                    <strong>For more information, you can also contact us at</strong> <a href="mailto:info@upreak.com">info@upreak.com</a><br><br>
    
                    <hr>
                    <!-- <img src="https://upreak.com/images/social/srclogo.png" style="display: block; border: 0px;margin-top: 3px; "/> -->
                    <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal, Karnataka, 583227
                    <br>
                    <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a href="mailto:info@upreak.com">info@upreak.com</a> | <a href="https://upreak.com/">www.upreak.com</a>
                    <br><br>
                    <div style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                      <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" width="20" style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;" /></a>
                      <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" width="20" style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;" /></a>
                      <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" width="20" style="display: block; border: 0px;margin-right: 15px;" /></a>
                    </div>
    
                  </h1>
    
                </td>
    
              </tr>
            </table>
          </td>
        </tr>
    
      </table>
    </body>
    
    </html>`;
     
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Download Report Remainder - Upreak',
      html: reportHtml,
    });

    console.log('Download Report Remainder email sent successfully!');
  } catch (error) {
    console.error('Error sending Download Report Remainder email:', error);
  }
};

const sendrequestmail = async (recipientEmail,name,service) => {
  try {
    const welHtml = `
    <html>

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#fff" align="center" style="background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td bgcolor="#ffffff" valign="top" style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                  <center>
                    <img src="https://upreak.com/images/main_logo.png" width="200" style="display: block; border: 0px;" />
                  </center>
                  <hr>
                  <h3>Dear ${name},</h3>
                  <p style="font-size: 16px;font-family: rubik,sans-serif;">Thank you For showing intrest in Upreak ${service} Services. Our Representative Will Call you shortly.</p>
                
              <p style="font-size: 16px;font-family: rubik,sans-serif; ">To Know More vist us at <a href="https://upreak.com">Upreak.com</a></b>
    
                  <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thanks for you time and patience.Feel free to contact on <a href="https://wa.me/+917975930773">whatsapp</a> <br>
    
                    <strong>For more information, you can also contact us at</strong> <a href="mailto:info@upreak.com">info@upreak.com</a><br><br>
                    
                    <hr>
                    <!-- <img src="https://upreak.com/images/social/srclogo.png" style="display: block; border: 0px;margin-top: 3px; "/> -->
                    <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal, Karnataka, 583227
                    <br>
                    <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a href="mailto:info@upreak.com">info@upreak.com</a> | <a href="https://upreak.com/">www.upreak.com</a>
                    <br><br>
                    <div style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                      <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" width="20" style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;" /></a>
                      <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" width="20" style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;" /></a>
                      <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" width="20" style="display: block; border: 0px;margin-right: 15px;" /></a>
                    </div>
    
                  </h1>
    
                </td>
    
              </tr>
            </table>
          </td>
        </tr>
    
      </table>
    </body>
    
    </html>
  `;
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Thanks for showing interest in our Services - Upreak',
      html: welHtml,
    });

    console.log('resqest mail sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};
const sendrequestreceivedmail = async (recipientEmail,email,name,phone,services) => {
  try {
    const welHtml = `
    <html>

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#fff" align="center" style="background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#fff" align="center" style="padding: 0px 10px 0px 10px;background-color:#fff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td bgcolor="#ffffff" valign="top" style="padding: 40px 70px 20px 70px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; line-height: 25px;">
                  <center>
                    <img src="https://upreak.com/images/main_logo.png" width="200" style="display: block; border: 0px;" />
                  </center>
                  <hr>
                  <h3>Dear Team,</h3>
                  <p style="font-size: 16px;font-family: rubik,sans-serif;">We got a New Request for our services, Details are Give Below </p>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Name : ${name}</b>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Email : ${email}</b>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Phone Number : ${phone}</b>
                  <p style="font-size: 16px;font-family: rubik,sans-serif; ">Service : ${services}</b>
              <p style="font-size: 16px;font-family: rubik,sans-serif; ">Login Link : <a href="https://upreak.com/login">Login</a></b>
    
                  <h1 style="font-size: 14px; font-weight: 400; margin: 2; font-family: rubik, sans-serif;">Thanks for time and patience.Feel free to contact on <a href="https://wa.me/+917975930773">whatsapp</a> <br>
    
                    <strong>For more information, you can also contact us at</strong> <a href="mailto:info@upreak.com">info@upreak.com</a><br><br>
                    
                    <hr>
                    <!-- <img src="https://upreak.com/images/social/srclogo.png" style="display: block; border: 0px;margin-top: 3px; "/> -->
                    <b>Address :</b> 1-3-4/1-2- 73, Kottureshwara College Road Pampa Nagara, Gangawati, Koppal, Karnataka, 583227
                    <br>
                    <b>Tel.:</b> <a href="tel:+91797530773">+91 7975930773</a> | <b>E-Mail:</b> <a href="mailto:info@upreak.com">info@upreak.com</a> | <a href="https://upreak.com/">www.upreak.com</a>
                    <br><br>
                    <div style="display:flex;list-style:none;padding: unset;text-align: center;justify-content: center;">
                      <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" width="20" style="display: block; border: 0px;margin-top: 0px;margin-right: 15px;" /></a>
                      <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" width="20" style="display: block; border: 0px;margin-top: 6px;margin-right: 15px;" /></a>
                      <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" width="20" style="display: block; border: 0px;margin-top: 3px;margin-right: 15px;" /></a>
                      <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" width="20" style="display: block; border: 0px;margin-right: 15px;" /></a>
                    </div>
    
                  </h1>
    
                </td>
    
              </tr>
            </table>
          </td>
        </tr>
    
      </table>
    </body>
    
    </html>
  `;
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Alert Team : We have received a new service request',
      html: welHtml,
    });

    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};


module.exports = {
  sendPasswordEmail,
  sendVerificationEmail,
  sendVerificationSuccessEmail,
  sendWelcomeHrMail,
  sendVerificationFailureEmail,
  sendWelcomeEmail,
  sendSlotConfirmEmail,
  sendReportDownloadEmail,
  sendHRSlotConfirmEmail,
  sendrequestmail,
  sendrequestreceivedmail
};


