const { google } = require('googleapis');
const { fs } = require('fs');

// google api setup
const CLIENT_ID='284537906431-bt88gme95e81utbm67g7th6j0d40n4a8.apps.googleusercontent.com';
const CLIENT_SECRET='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';
const REDIRECT_URI='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN='1//04td118-RTCmQCgYIARAAGAQSNwF-L9Ir2u_oWspxLozVEjp8bc5wi3PoaOYvKyuJo78FGaiMNbvhPrfhcug5e-z426bzcedM6LM';

const oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2client
});
// Automatically refresh the access token if it's expired
oauth2client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    REFRESH_TOKEN = tokens.refresh_token;
  }
});

// google api setup end

// Function to upload file to Google Drive
const uploadFileToDrive = async (req, file) => {
  try {
    const filePath = file.path; // Path of the uploaded file

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname, // Use original filename for Google Drive
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(filePath),
      },
    });

    // Delete the uploaded file from the server
    fs.unlinkSync(filePath);

    console.log('File uploaded to Google Drive:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw new Error('An error occurred while uploading the file to Google Drive.');
  }
};

const generatePublicUrl = async (fileId) => {
  try {
    // Grant read permission to anyone for the file
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Retrieve web view link and direct download link for the file
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webContentLink',
    });

    const { webContentLink } = result.data;
    return {webContentLink };
  } catch (error) {
    console.error('Error generating public URL:', error);
    throw error;
  }
};

module.exports = {
    uploadFileToDrive,
    generatePublicUrl
};
  