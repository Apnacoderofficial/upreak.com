const axios = require('axios'),
      config = rootRequire('config/config');

async function sendMessageToWhatsApp(campaignName, phoneNumber, userName, templateParams, url = null, fileName = null) {
  try {
    const apiUrl = config.whatsAppKey.apiUrl;
    const apiKey = config.whatsAppKey.apiKey;

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
