// const { ClientSecretCredential } = require('@azure/identity');
// const { Client } = require('@microsoft/microsoft-graph-client');
// require('isomorphic-fetch');
const fs = require('fs');
const path = require('path');

const tenantId = 'c8230646-977d-418c-b850-2becb408151f';
const clientId = '6bb00d74-1849-4222-8acc-3991c65fbfa8';
const clientSecret = '76W8Q~DSW9DUaz59.KIoGJtHPQCFv0BVXlj02csD';

const userId = '77b2cf89-9370-49ef-b07f-d53b9111d6c8'; // Replace with the target user's ID

async function uploadFile(filePath) {
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const accessToken = await credential.getToken('https://graph.microsoft.com/.default');

  const client = Client.init({
      authProvider: (done) => {
          done(null, accessToken.token);
      }
  });

  const fileName = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);

  try {
      const uploadResponse = await client.api(`/users/${userId}/drive/root:/${fileName}:/content`).put(fileStream);
      
      // Log the webUrl and @microsoft.graph.downloadUrl
      console.log({
          "webUrl": uploadResponse['webUrl'],
          "@microsoft.graph.downloadUrl": uploadResponse['@microsoft.graph.downloadUrl']
      });

      return uploadResponse;
  } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
  }
}


module.exports = { uploadFile };
