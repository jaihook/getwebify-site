import { google } from 'googleapis';

export interface ContactRow {
  name: string;
  business: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  source: string;
}

export async function appendContactRow(row: ContactRow): Promise<void> {
  const keyJson = import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const sheetId = import.meta.env.GOOGLE_SHEET_ID;
  if (!keyJson || !sheetId) return;

  const key = JSON.parse(keyJson);
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        row.name,
        row.business,
        row.email,
        row.phone,
        row.projectType,
        row.message,
        row.source,
      ]],
    },
  });
}
