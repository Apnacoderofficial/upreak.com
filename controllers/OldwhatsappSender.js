const axios = require('axios');

async function sendMessageToWhatsApp(phoneNumber, message) {
  try {
    const apiUrl = 'https://wa.intractly.com/api/send';
    const accessToken = '65dc418d3bc90'; // Replace with your actual access token
    const instanceId = '65E6C94B7054E'; // Replace with your actual instance ID

    const response = await axios.post(
      apiUrl,
      {
        number: phoneNumber,
        message: message,
        instance_id: instanceId,
        access_token: accessToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    if (response.data.status == 'success') {
      console.log('Message sent successfully.',response.data.status);
    } else {
      console.error("Message can't be sent successfully.",response.data.message);
    }
  } catch (error) {
    console.error('Failed to send message:', error.message);
  }
}

module.exports = { sendMessageToWhatsApp };
