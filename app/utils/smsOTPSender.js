const axios = require('axios');
const config = rootRequire('config/config');

async function sendOTP(phoneNumber, otp, type) {
  try {
    const apiKey = config.smsOtp.apiKey;
    const senderID = config.smsOtp.senderID;
    let message;
    if (type === 'otp') {
      message = `Welcome to the UPREAK. Your OTP for registration is U-${otp}. UPREAK`;
    }
    const url = `https://cloud.smsindiahub.in/vendorsms/pushsms.aspx?APIKey=${apiKey}&msisdn=91${phoneNumber}&sid=${senderID}&msg=${encodeURIComponent(message)}&fl=0&gwid=2`;

    const response = await axios.get(url);
    if (response.status === 200) {
      
//      && response.data.toLowerCase().includes('success')
      console.log('OTP sent successfully.');
      // Handle the response and any other logic (e.g., saving the OTP in the database)
    } else {
      console.log('Sending OTP Failed!.');
      // Handle the failure, if needed
    }
  } catch (error) {
    console.error('Failed to send OTP:', error.message);
  }
}

module.exports = { sendOTP };
