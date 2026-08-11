import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    let auth;
    if (process.env.GOOGLE_CREDENTIALS) {
      auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } else {
      const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
      if (!fs.existsSync(credentialsPath)) {
        return NextResponse.json({ completed: false });
      }
      auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const MAIN_FOLDER_ID = process.env.MAIN_FOLDER_ID;
    const MAIN_SHEET_URL = process.env.MAIN_SHEET_URL;

    if (!MAIN_SHEET_URL) {
      return NextResponse.json({ completed: false });
    }

    const match = MAIN_SHEET_URL.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match || !match[1]) {
      return NextResponse.json({ completed: false });
    }
    const masterSheetId = match[1];

    try {
      const spreadsheetInfo = await sheets.spreadsheets.get({ spreadsheetId: masterSheetId });
      
      // Buscar si ya existe alguna pestaña de Brief o Reglas de negocio
      const hasData = spreadsheetInfo.data.sheets?.some(
        sheet => sheet.properties?.title === 'Brief de Configuración' || sheet.properties?.title === 'Reglas de Negocio'
      );

      if (hasData) {
        // Enviar la URL maestra. El usuario aterrizará en la pantalla de éxito.
        return NextResponse.json({
          completed: true,
          folderLink: `https://drive.google.com/drive/folders/${MAIN_FOLDER_ID}`,
          spreadsheetLink: MAIN_SHEET_URL,
        });
      }
    } catch (e: any) {
      // Si falla la lectura, asumimos que no hay datos
      return NextResponse.json({ completed: false });
    }

    return NextResponse.json({ completed: false });

  } catch (error: any) {
    console.error("Error comprobando estado en Sheets:", error);
    return NextResponse.json({ completed: false });
  }
}
