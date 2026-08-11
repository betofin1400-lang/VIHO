import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const { nombreContacto, correo, tiposProyecto, tipologiasCocina, estructuraWeb, disenoResponsive, seccionesWeb, estiloVisual, referenciasVisuales, reglasNegocio, pregunta1, pregunta2, pregunta3, pregunta4, tipoEntregaEstimado, dominioUser, hostingUser } = formData;

    let auth;
    if (process.env.GOOGLE_CREDENTIALS) {
      auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
        scopes: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/spreadsheets'
        ],
      });
    } else {
      const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
      if (!fs.existsSync(credentialsPath)) {
        throw new Error('No se encontró el archivo de credenciales de Google Cloud ni la variable de entorno GOOGLE_CREDENTIALS.');
      }
      auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/spreadsheets'
        ],
      });
    }

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    const MAIN_FOLDER_ID = process.env.MAIN_FOLDER_ID || 'PENDIENTE_DE_CONFIGURAR';
    const MAIN_SHEET_URL = process.env.MAIN_SHEET_URL || 'PENDIENTE_DE_CONFIGURAR';

    // 1. Compartir la carpeta existente con el cliente
    const emailsToShare = [];
    if (correo && correo.includes('@')) {
      emailsToShare.push(correo);
    }

    for (const email of emailsToShare) {
      try {
        await drive.permissions.create({
          fileId: MAIN_FOLDER_ID,
          requestBody: { role: 'writer', type: 'user', emailAddress: email },
          sendNotificationEmail: true,
        });
      } catch (permError: any) {
        console.warn(`No se pudo enviar notificación/compartir a ${email}:`, permError.message);
      }
    }

    // 2. Inyectar todo en la Hoja Maestra (Para evitar error de cuota de Drive 0 bytes)
    let finalSheetUrl = MAIN_SHEET_URL;
    try {
      const match = MAIN_SHEET_URL.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const masterSheetId = match[1];
        const spreadsheetInfo = await sheets.spreadsheets.get({ spreadsheetId: masterSheetId });
        
        // --- A. Pestaña de Reglas de Negocio ---
        const hasReglasTab = spreadsheetInfo.data.sheets?.some(
          sheet => sheet.properties?.title === 'Reglas de Negocio'
        );

        if (!hasReglasTab) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: masterSheetId,
            requestBody: { requests: [{ addSheet: { properties: { title: 'Reglas de Negocio' } } }] }
          });
          // Headers
          await sheets.spreadsheets.values.append({
            spreadsheetId: masterSheetId,
            range: 'Reglas de Negocio!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [['Regla de Negocio']] },
          });
        } else {
          // Limpiar las reglas anteriores si están reescribiendo
          // Limpiamos todo A:Z para asegurar que no queden columnas viejas de pruebas anteriores (como Cliente o Correo)
          await sheets.spreadsheets.values.clear({
            spreadsheetId: masterSheetId,
            range: `'Reglas de Negocio'!A:Z`
          });
          // Re-escribimos el header porque acabamos de limpiar todo
          await sheets.spreadsheets.values.append({
            spreadsheetId: masterSheetId,
            range: 'Reglas de Negocio!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [['Regla de Negocio']] },
          });
        }

        if (reglasNegocio) {
          const reglasArray = reglasNegocio.split('\n').map((r: string) => r.trim()).filter((r: string) => r !== '').map((r: string) => [r.replace(/^-/, '').trim()]);
          
          if (reglasArray.length > 0) {
            await sheets.spreadsheets.values.append({
              spreadsheetId: masterSheetId,
              range: 'Reglas de Negocio!A2:A',
              valueInputOption: 'USER_ENTERED',
              requestBody: { values: reglasArray },
            });
          }
        }

        // --- B. Pestaña dedicada para el Brief Vertical ---
        const tabTitle = `Brief de Configuración`;
        
        let sheetId = null;
        const existingTab = spreadsheetInfo.data.sheets?.find(
          sheet => sheet.properties?.title === tabTitle
        );

        if (existingTab) {
          sheetId = existingTab.properties?.sheetId;
          // Limpiamos los datos anteriores
          await sheets.spreadsheets.values.clear({
            spreadsheetId: masterSheetId,
            range: `'${tabTitle}'!A:B`
          });
        } else {
          // Si no existe, creamos la pestaña
          const addSheetResponse = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: masterSheetId,
            requestBody: { requests: [{ addSheet: { properties: { title: tabTitle } } }] }
          });
          sheetId = addSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;
        }

        // Datos Verticales
        const verticalData = [
          ['🎯 INFORMACIÓN GENERAL', ''],
          ['Nombre del Contacto', nombreContacto],
          ['Correo Electrónico', correo],
          ['Dominio Web', dominioUser || 'No especificado'],
          ['Hosting / DNS', hostingUser || 'No especificado'],
          ['', ''], // Espaciador
          ['🖥️ DISEÑO DE LA PÁGINA', ''],
          ['Estructura Web', estructuraWeb === 'one-page' ? 'Landing Page (One-page)' : 'Multi-sección'],
          ['Enfoque de Diseño', disenoResponsive === 'mobile-first' ? 'Mobile First (Celulares)' : 'PC / Tablet First'],
          ['Secciones Adicionales', seccionesWeb?.join(', ') || 'Ninguna'],
          ['Estilo Visual', estiloVisual || 'No especificado'],
          ['Referencias Visuales', referenciasVisuales || 'Ninguna'],
          ['', ''],
          ['🤖 CONFIGURACIÓN DEL AGENTE', ''],
          ['Tipos de Proyecto', tiposProyecto?.join(', ') || 'No especificado'],
          ['Tipologías de Cocina', tipologiasCocina?.join(', ') || 'No especificado'],
          ['Qué entrega al final', tipoEntregaEstimado || 'No especificado'],
          ['', ''],
          ['💬 PREGUNTAS DEL AGENTE', ''],
          ['Pregunta 1', pregunta1],
          ['Pregunta 2', pregunta2],
          ['Pregunta 3', pregunta3],
          ['Pregunta 4', pregunta4],
        ];

        // Escribir datos
        await sheets.spreadsheets.values.update({
          spreadsheetId: masterSheetId,
          range: `'${tabTitle}'!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: verticalData }
        });

        // Formato visual atractivo (Negritas y colores para las cabeceras)
        if (sheetId !== null && sheetId !== undefined) {
          finalSheetUrl = `https://docs.google.com/spreadsheets/d/${masterSheetId}/edit#gid=${sheetId}`;
          
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: masterSheetId,
            requestBody: {
              requests: [
                // Ajustar ancho de la columna A (Campo)
                { updateDimensionProperties: { range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 250 }, fields: 'pixelSize' } },
                // Ajustar ancho de la columna B (Respuesta)
                { updateDimensionProperties: { range: { sheetId: sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 450 }, fields: 'pixelSize' } },
                // Formato para los títulos (Fila 1, 7, 14, 19)
                ...[0, 6, 13, 18].map(rowIndex => ({
                  repeatCell: {
                    range: { sheetId: sheetId, startRowIndex: rowIndex, endRowIndex: rowIndex + 1, startColumnIndex: 0, endColumnIndex: 2 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.05, green: 0.17, blue: 0.11 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat)'
                  }
                })),
                // Formato para las celdas de "Campo" (Columna A)
                {
                  repeatCell: {
                    range: { sheetId: sheetId, startColumnIndex: 0, endColumnIndex: 1 },
                    cell: { userEnteredFormat: { textFormat: { bold: true } } },
                    fields: 'userEnteredFormat.textFormat.bold'
                  }
                }
              ]
            }
          });
        }
      }
    } catch (sheetError: any) {
      console.error("Error al escribir en Sheets:", sheetError.message);
    }

    // Eliminamos la creacion de Brief_VIHO.md y Brief_Cliente.md porque la cuota falla.
    // El Check-Status ahora verificará si la hoja del cliente o alguna hoja de brief existe.
    // No usamos drive.files.create() en absoluto.

    console.log('¡Workspace generado exitosamente sin usar cuota de Drive!');
    return NextResponse.json({
      success: true,
      folderLink: `https://drive.google.com/drive/folders/${MAIN_FOLDER_ID}`,
      spreadsheetLink: finalSheetUrl,
    });

  } catch (error: any) {
    console.error("Error generando workspace:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
