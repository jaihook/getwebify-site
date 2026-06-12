import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import { Resend } from 'resend';

export const prerender = false;

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

function sanitize(v: string, max = 254): string {
  return v.replace(/[\r\n]/g, ' ').slice(0, max);
}

export const POST: APIRoute = async ({ request }) => {
  let email = '';
  let source = 'website';

  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    const body = await request.json();
    email = sanitize(String(body.email ?? '').trim());
    source = sanitize(String(body.source ?? 'website').trim(), 50);
  } else {
    const form = await request.formData();
    email = sanitize(String(form.get('email') ?? '').trim());
    source = sanitize(String(form.get('source') ?? 'website').trim(), 50);
  }

  if (!email || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await Promise.allSettled([
    appendSubscriberRow(email, source),
    addToResendAudience(email),
  ]);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

async function appendSubscriberRow(email: string, source: string): Promise<void> {
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
    range: 'Subscribers!A:C',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[new Date().toISOString(), email, source]],
    },
  });
}

async function addToResendAudience(email: string): Promise<void> {
  const key = import.meta.env.RESEND_API_KEY;
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) return;

  const resend = new Resend(key);
  // contacts.create is typed in newer resend SDK versions
  await (resend.contacts as any).create({
    audienceId,
    email,
    unsubscribed: false,
  });
}
