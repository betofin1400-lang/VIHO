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

    // Cargar variables de entorno simuladas
    require('dotenv').config({ path: '.env.local' });
    const MAIN_FOLDER_ID = process.env.MAIN_FOLDER_ID;
    const MAIN_SHEET_URL = process.env.MAIN_SHEET_URL;

    console.log("Folder ID:", MAIN_FOLDER_ID);
    console.log("Sheet URL:", MAIN_SHEET_URL);

    const match = MAIN_SHEET_URL.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const masterSheetId = match[1];

    console.log("Creating blank spreadsheet via Drive API...");
    const fileMetadata = {
      name: 'Prueba_Clonado_Tabs',
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: [MAIN_FOLDER_ID]
    };
    
    const newFile = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id'
    });
    
    const newSheetId = newFile.data.id;
    console.log("New Spreadsheet ID:", newSheetId);

    console.log("Fetching tabs from Master Sheet...");
    const masterSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId: masterSheetId });
    const tabs = masterSpreadsheet.data.sheets;

    for (const tab of tabs) {
      const tabId = tab.properties.sheetId;
      console.log("Copying tab:", tab.properties.title);
      await sheets.spreadsheets.sheets.copyTo({
        spreadsheetId: masterSheetId,
        sheetId: tabId,
        requestBody: {
          destinationSpreadsheetId: newSheetId
        }
      });
    }

    console.log("Copied all tabs! Deleting default 'Hoja 1'...");
    // Get the ID of the default sheet in the new spreadsheet to delete it
    const newSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId: newSheetId });
    const defaultTab = newSpreadsheet.data.sheets[0]; // the first one is the blank one
    
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: newSheetId,
      requestBody: {
        requests: [
          {
            deleteSheet: {
              sheetId: defaultTab.properties.sheetId
            }
          }
        ]
      }
    });

    console.log("SUCCESS. You can check the new spreadsheet at: https://docs.google.com/spreadsheets/d/" + newSheetId);

  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

test();
