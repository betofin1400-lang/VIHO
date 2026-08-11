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
        const reglasTabTitle = 'Reglas de Negocio';
        let reglasSheetId = null;
        const existingReglasTab = spreadsheetInfo.data.sheets?.find(
          sheet => sheet.properties?.title === reglasTabTitle
        );

        if (existingReglasTab) {
          reglasSheetId = existingReglasTab.properties?.sheetId;
          // Limpiamos todo para que no queden columnas viejas, pero mantenemos las reglas desde A3 hacia abajo intactas.
          // En este caso, si están reescribiendo desde el formulario, limpiamos A1:A2. Si no queremos borrar reglas anteriores, 
          // solo limpiamos encabezados. PERO el requerimiento original era limpiar todo. 
          // El usuario pidió: "que si le falto añadir puede complementar esta informacion de forma manual"
          // Así que limpiemos solo A1:A2 para no borrar lo que añadan a mano en A3 hacia abajo!
          await sheets.spreadsheets.values.clear({
            spreadsheetId: masterSheetId,
            range: `'${reglasTabTitle}'!A1:Z2`
          });
        } else {
          const addSheetResponse = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: masterSheetId,
            requestBody: { requests: [{ addSheet: { properties: { title: reglasTabTitle } } }] }
          });
          reglasSheetId = addSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;
        }

        const reglasInstruction = [
          ['💡 Guía de Reglas de Negocio: Una regla de negocio es una condición o directriz que afecta un precio, un servicio o una respuesta (ej. "Si el cliente está fuera de la ciudad, cobrar $100.000 de viáticos" o "Siempre pedir un anticipo del 50%").\nSi te faltó añadir alguna regla, puedes escribirla de forma manual aquí abajo.'],
          ['Regla de Negocio']
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: masterSheetId,
          range: `'${reglasTabTitle}'!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: reglasInstruction }
        });

        if (reglasNegocio) {
          const reglasArray = reglasNegocio.split('\n').map((r: string) => r.trim()).filter((r: string) => r !== '').map((r: string) => [r.replace(/^-/, '').trim()]);
          
          if (reglasArray.length > 0) {
            // Re-escribir las reglas que vengan del form. Si queremos acumular, usamos append, pero como limpiamos solo A1:A2, append agregará ABAJO de lo que exista.
            await sheets.spreadsheets.values.append({
              spreadsheetId: masterSheetId,
              range: `'${reglasTabTitle}'!A3:A`,
              valueInputOption: 'USER_ENTERED',
              requestBody: { values: reglasArray },
            });
          }
        }

        if (reglasSheetId !== null && reglasSheetId !== undefined) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: masterSheetId,
            requestBody: {
              requests: [
                { updateDimensionProperties: { range: { sheetId: reglasSheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 1000 }, fields: 'pixelSize' } },
                {
                  repeatCell: {
                    range: { sheetId: reglasSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 1 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.9, green: 0.95, blue: 0.9 }, textFormat: { foregroundColor: { red: 0.05, green: 0.17, blue: 0.11 }, bold: true }, horizontalAlignment: 'CENTER', wrapStrategy: 'WRAP' } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)'
                  }
                },
                {
                  repeatCell: {
                    range: { sheetId: reglasSheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 1 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.05, green: 0.17, blue: 0.11 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true }, horizontalAlignment: 'CENTER' } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
                  }
                }
              ]
            }
          });
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
          ['💡 Guía del Brief: Este es el resumen de la configuración de tu Agente.\nSi te faltó alguna información o necesitas corregir algo, puedes editar y complementar esta hoja manualmente.', ''],
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
                // Combinar la primera celda para la guía
                { mergeCells: { range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 2 }, mergeType: 'MERGE_ALL' } },
                // Formato Fila 1 (Instrucciones)
                {
                  repeatCell: {
                    range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 2 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.9, green: 0.95, blue: 0.9 }, textFormat: { foregroundColor: { red: 0.05, green: 0.17, blue: 0.11 }, bold: true }, horizontalAlignment: 'CENTER', wrapStrategy: 'WRAP' } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)'
                  }
                },
                // Formato para los títulos (ahora desplazados 1 fila: Fila 2, 8, 15, 20 => indices 1, 7, 14, 19)
                ...[1, 7, 14, 19].map(rowIndex => ({
                  repeatCell: {
                    range: { sheetId: sheetId, startRowIndex: rowIndex, endRowIndex: rowIndex + 1, startColumnIndex: 0, endColumnIndex: 2 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.05, green: 0.17, blue: 0.11 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true } } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat)'
                  }
                })),
                // Formato para las celdas de "Campo" (Columna A) desde la fila 3
                {
                  repeatCell: {
                    range: { sheetId: sheetId, startRowIndex: 2, startColumnIndex: 0, endColumnIndex: 1 },
                    cell: { userEnteredFormat: { textFormat: { bold: true } } },
                    fields: 'userEnteredFormat.textFormat.bold'
                  }
                }
              ]
            }
          });
        }

        // --- C. Pestaña Valores ---
        const valoresTabTitle = 'Valores';
        let valoresSheetId = null;
        const existingValoresTab = spreadsheetInfo.data.sheets?.find(
          sheet => sheet.properties?.title === valoresTabTitle
        );

        if (existingValoresTab) {
          valoresSheetId = existingValoresTab.properties?.sheetId;
          // Limpiamos solo los encabezados anteriores (Fila 1 y 2) para no borrar la data del cliente abajo
          await sheets.spreadsheets.values.clear({
            spreadsheetId: masterSheetId,
            range: `'${valoresTabTitle}'!A1:D2`
          });
        } else {
          const addSheetResponse = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: masterSheetId,
            requestBody: { requests: [{ addSheet: { properties: { title: valoresTabTitle } } }] }
          });
          valoresSheetId = addSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;
        }

        // Datos para Valores
        const valoresData = [
          ['Guía de Valores: Ingresa la descripción, el valor por unidad o m2, y observaciones importantes (ej. aclarar si el precio varía según la cantidad o el tipo de acabado).\n💡 NOTA: Si ya tienes archivos de valores, puedes cargarlos directamente en la carpeta de Drive y no será necesario diligenciar esta hoja de forma manual.', '', '', ''],
          ['Descripción', 'Valor (Unidad / m2)', 'Observaciones', '']
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: masterSheetId,
          range: `'${valoresTabTitle}'!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: valoresData }
        });

        if (valoresSheetId !== null && valoresSheetId !== undefined) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: masterSheetId,
            requestBody: {
              requests: [
                // Ajustar anchos de columnas
                { updateDimensionProperties: { range: { sheetId: valoresSheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 300 }, fields: 'pixelSize' } },
                { updateDimensionProperties: { range: { sheetId: valoresSheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
                { updateDimensionProperties: { range: { sheetId: valoresSheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 500 }, fields: 'pixelSize' } },
                // Descombinar A1:D1 por si ya estaba combinada, para evitar errores
                { unmergeCells: { range: { sheetId: valoresSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 } } },
                // Combinar celdas A1:D1
                { mergeCells: { range: { sheetId: valoresSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 }, mergeType: 'MERGE_ALL' } },
                // Formato Fila 1 (Instrucciones)
                {
                  repeatCell: {
                    range: { sheetId: valoresSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.9, green: 0.95, blue: 0.9 }, textFormat: { foregroundColor: { red: 0.05, green: 0.17, blue: 0.11 }, bold: true }, horizontalAlignment: 'CENTER', wrapStrategy: 'WRAP' } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)'
                  }
                },
                // Formato Fila 2 (Headers)
                {
                  repeatCell: {
                    range: { sheetId: valoresSheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 4 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.05, green: 0.17, blue: 0.11 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true }, horizontalAlignment: 'CENTER' } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
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
