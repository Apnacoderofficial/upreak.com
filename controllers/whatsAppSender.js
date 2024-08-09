const axios = require('axios');

async function sendMessageToWhatsApp(campaignName, phoneNumber, userName, templateParams, url = null, fileName = null) {
  try {
    const apiUrl = 'https://backend.aisensy.com/campaign/t1/api/v2';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGYxY2YwZTY0OWY5MGMxMWE1MGIzNCIsIm5hbWUiOiJVcHJlYWsgNTQyNSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NjRmMWNlZmU2NDlmOTBjMTFhNTBiMjkiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcxNjQ2MDc4NH0.PcEcQihSBxBHKNafYfXyYMU-w0xV_nWYk5PrrOUZRnQ';

    const requestBody = {
      apiKey: apiKey,
      campaignName: campaignName,
      destination: phoneNumber,
      userName: userName,
      templateParams: templateParams,
    };

    // Add media property only if url and fileName are provided
    if (url && fileName) {
      requestBody.media = {
        url: url,
        filename: fileName,
      };
    }

    const response = await axios.post(
      apiUrl,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        maxBodyLength: Infinity,
      }
    );
    
    if (response.data.success === 'true') {
      console.log('Message sent successfully :', response.data.submitted_message_id);
    } else {
      console.error("Message can't be sent successfully :", response.data);
    }
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

module.exports = { sendMessageToWhatsApp };
