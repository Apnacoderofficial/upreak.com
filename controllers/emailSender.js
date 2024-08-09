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

const sendTwoStepEmail = async (recipientEmail, otp) => {
  try {
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: 'Login - Two Step Verification',
      text: `Your Email is: ${recipientEmail} and OTP is: ${otp} valid upto 10 min`,
    });

    console.log('Reset email sent successfully!');
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};

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

const sendSubscribedMail = async (recipientEmail) => {
  try {
    const welHtml = `
    <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    </head>

    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        You're now subscribed to our job alerts!
      </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td bgcolor="#ffffff" >
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td  valign="top" style="padding: 40px 10px 40px 10px;" align="center">
                  <img src="https://upreak.com/images/main_logo.png" width="200" style="display: block; border: 0px;" />
                </td>
              </tr>
              <tr>
                <td bgcolor="#ffffff"  style="padding: 20px 30px 40px 30px; color: #111111; font-family: rubik, sans-serif; font-size: 32px; font-weight: 400; line-height: 25px;">
                  <h1 style="font-size: 24px; font-weight: bold; margin: 0;">Congratulations!</h1>
                  <p style="font-size: 16px; font-family: rubik, sans-serif;">Dear Subscriber,</p>
                  <p style="font-size: 16px; font-family: rubik, sans-serif;">Thank you for subscribing to our job alerts. You'll now receive regular updates on the latest job opportunities that match your preferences.</p>
                  <p style="font-size: 16px; font-family: rubik, sans-serif;">We are thrilled to have you with us and look forward to helping you find your next career move.</p>
                  <p style="font-size: 16px; font-family: rubik, sans-serif;">Stay tuned for exciting job opportunities directly in your inbox!</p>
                  
                  <p style="font-size: 16px; font-family: rubik, sans-serif;">
                    For more quick updates, you can join our WhatsApp group: 
                    <a href="https://whatsapp.com/channel/0029VakqglnFnSzBl9TPPs0t" target="_blank">Join WhatsApp Group</a>
                  </p>
                  <p style="font-size: 16px; font-family: rubik, sans-serif;">
                    Follow us on social media for the latest news and updates: 
                    <a href="https://www.instagram.com/upreakofficial/" target="_blank">@upreakofficial</a>
                  </p>
                  
                  <hr>
                  <h1 style="font-size: 14px; font-weight: 400; margin: 2;">
                    If you have any questions or need further assistance, feel free to <a href="mailto:info@upreak.com">contact us</a>.
                  </h1>
                  <h1 style="font-size: 14px; font-weight: 400; margin: 2;">
                    <strong>For more information, visit our website at</strong> <a href="https://upreak.com/">www.upreak.com</a>
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
      subject: 'Congratulations on Subscribing to Job Alerts!',
      html: welHtml,
    });

    console.log('Subscription email sent successfully!');
  } catch (error) {
    console.error('Error sending subscription email:', error);
  }
};
const sendNewJobAlertMail = async (recipientEmail, jobTitle, jobLocation, jobExperience, jobNature, jobCTC, jobApplyLink) => {
  try {
    const jobAlertHtml = `
    <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style>
        body {
          font-family: 'Rubik', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          margin: 0 auto;
          padding: 20px;
          max-width: 600px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px;
        }
        .header img {
          width: 150px;
        }
        .job-details {
          margin: 20px 0;
        }
        .job-details h3 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .job-details p {
          color: #666666;
          font-size: 16px;
          margin: 5px 0;
        }
        .cta {
          text-align: center;
          margin-top: 30px;
        }
        .cta a {
          text-decoration: none;
          background-color: #007bff;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
          display: inline-block;
        }
        .cta a:hover {
          background-color: #0056b3;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #999999;
        }
        .social-links a {
          margin: 0 10px;
          display: inline-block;
        }
        .social-links img {
          width: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://upreak.com/images/main_logo.png" alt="Upreak Logo" />
          <h2>New Job Alert!</h2>
        </div>
        <div class="job-details">
          <h3>${jobTitle}</h3>
          <p><strong>Location:</strong> ${jobLocation}</p>
          <p><strong>Experience Required:</strong> ${jobExperience}</p>
          <p><strong>Job Nature:</strong> ${jobNature}</p>
          <p><strong>CTC:</strong> ${jobCTC}</p>
        </div>
        <div class="cta">
          <a href="${jobApplyLink}">Apply Now</a>
        </div>
        <div class="footer">
          <p>For more updates, join our WhatsApp group: <a href="https://whatsapp.com/channel/0029VakqglnFnSzBl9TPPs0t">Join WhatsApp Group</a></p>
          <p>Follow us on social media: <a href="https://www.instagram.com/upreakofficial/" target="_blank">@upreakofficial</a></p>
          <div class="social-links">
            <a href="https://www.linkedin.com/company/upreak" target="_blank"><img src="https://upreak.com/images/social/li.png" alt="LinkedIn" /></a>
            <a href="https://www.facebook.com/upreak" target="_blank"><img src="https://upreak.com/images/social/f.png" alt="Facebook" /></a>
            <a href="https://twitter.com/upreak" target="_blank"><img src="https://upreak.com/images/social/t.png" alt="Twitter" /></a>
            <a href="https://www.youtube.com/@Upreak" target="_blank"><img src="https://upreak.com/images/social/y.png" alt="YouTube" /></a>
            <a href="https://www.instagram.com/upreakofficial/" target="_blank"><img src="https://upreak.com/images/social/i.png" alt="Instagram" /></a>
          </div>
          <p>If you have any questions, feel free to <a href="mailto:info@upreak.com">contact us</a>.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    const msg = await transporter.sendMail({
      to: recipientEmail,
      from: MAIL_SETTINGS.auth.user,
      subject: `New Job Alert: ${jobTitle}`,
      html: jobAlertHtml,
    });

    console.log('New job alert email sent successfully!');
  } catch (error) {
    console.error('Error sending job alert email:', error);
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
  sendrequestreceivedmail,
  sendTwoStepEmail,
  sendSubscribedMail,
  sendNewJobAlertMail
};


