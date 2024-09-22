const axios = require('axios');

async function sendOTP(phoneNumber, otp, type) {
  try {
    console.log("Send OTP through API:", phoneNumber, otp, type);

    const apiKey = 'fcda2Gn4FEa58udXkwA2Ng';
    const senderID = 'UPREAK';
    let message;
    if (type === 'otp') {
      message = `Welcome to the UPREAK. Your OTP for registration is U-${otp}. UPREAK`;
    }

    const url = `https://cloud.smsindiahub.in/vendorsms/pushsms.aspx?APIKey=${apiKey}&msisdn=91${phoneNumber}&sid=${senderID}&msg=${encodeURIComponent(message)}&fl=0&gwid=2`;

    const response = await axios.get(url);
    console.log('API response:', response.data);

    if (response.data.ErrorCode === '000') {
      console.log('OTP sent successfully.');
      return { success: true, message: 'OTP sent successfully' };
    } else {
      console.log('Sending OTP failed:', response.data.ErrorMessage);
      return { success: false, message: response.data.ErrorMessage };
    }
  } catch (error) {
    console.error('Failed to send OTP:', error.message);
    return { success: false, message: 'Failed to send OTP' };
  }
}

module.exports = { sendOTP };
