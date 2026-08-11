const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function test() {
  try {
    const credentialsPath = path.join(__dirname, 'google-credentials.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
    });

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    console.log("1. Creating folder...");
    const folder = await drive.files.create({
      requestBody: {
        name: 'Test_Folder',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, webViewLink',
    });
    const folderId = folder.data.id;
    console.log("Folder created:", folderId);

    console.log("2. Creating spreadsheet via Drive API...");
    const spreadsheet = await drive.files.create({
      requestBody: {
        name: 'Test Sheet',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [folderId]
      },
      fields: 'id, webViewLink',
    });
    const spreadsheetId = spreadsheet.data.id;
    console.log("Spreadsheet created:", spreadsheetId);

    console.log("3. Testing permissions...");
    await drive.permissions.create({
      fileId: folderId,
      requestBody: { role: 'writer', type: 'user', emailAddress: 'serafinmontoya18@gmail.com' },
      sendNotificationEmail: false,
    });
    console.log("Success sharing!");

  } catch (error) {
    console.error("ERROR:", error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

test();
