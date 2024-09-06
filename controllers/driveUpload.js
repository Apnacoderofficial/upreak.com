const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const tenantId = 'c8230646-977d-418c-b850-2becb408151f';
const clientId = '6bb00d74-1849-4222-8acc-3991c65fbfa8';
const clientSecret = '76W8Q~DSW9DUaz59.KIoGJtHPQCFv0BVXlj02csD';

const userId = '77b2cf89-9370-49ef-b07f-d53b9111d6c8'; // Replace with the target user's ID

const uploadFile = async (filePath) => {
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const accessToken = await credential.getToken('https://graph.microsoft.com/.default');

  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken.token);
    }
  });

  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';

  try {
    const uploadResponse = await client.api(`/users/${userId}/drive/root:/${fileName}:/content`)
      .header('Content-Type', mimeType)
      .put(fileContent);

    // Generate view URL
    const viewLink = await client.api(`/users/${userId}/drive/items/${uploadResponse.id}/createLink`).post({
      type: "view",
      scope: "anonymous"
    });

    // Generate download URL
    const downloadLink = await client.api(`/users/${userId}/drive/items/${uploadResponse.id}/createLink`).post({
      type: "edit",
      scope: "anonymous"
    });

    // Remove the file after successful upload
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting the file from server:', err);
      } else {
        console.log('File deleted successfully from server.');
      }
    });

    return {
      uploadResponse : uploadResponse,
      viewUrl: viewLink.link.webUrl,
      downloadUrl: downloadLink.link.webUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.response) {
      console.error('Error Response:', await error.response.text());
    }
    throw error;
  }
}

module.exports = { uploadFile };
