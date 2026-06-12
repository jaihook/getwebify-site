import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { verifyTurnstile } from '../../lib/turnstile';
import { appendContactRow } from '../../lib/sheets';

export const prerender = false;

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

// Strip CRLF to prevent header injection; hard-cap length
function sanitize(v: string, max = 200): string {
  return v.replace(/[\r\n]/g, ' ').slice(0, max);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // honeypot
  if (form.get('website')) return redirect('/thank-you');

  const name        = sanitize(String(form.get('name') ?? '').trim());
  const business    = sanitize(String(form.get('business') ?? '').trim());
  const email       = sanitize(String(form.get('email') ?? '').trim(), 254);
  const phone       = sanitize(String(form.get('phone') ?? '').trim(), 30);
  const projectType = sanitize(String(form.get('projectType') ?? '').trim(), 100);
  const message     = sanitize(String(form.get('message') ?? '').trim(), 2000);
  const cfToken     = String(form.get('cf-turnstile-response') ?? '');

  if (!name || !email || !projectType || !message) {
    return new Response('Missing required fields', { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return new Response('Invalid email address', { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(cfToken);
  if (!turnstileOk) {
    return new Response('Bot check failed', { status: 400 });
  }

  await Promise.allSettled([
    appendContactRow({ name, business, email, phone, projectType, message, source: 'website' }),
    sendEmails({ name, business, email, phone, projectType, message }),
  ]);

  return redirect('/thank-you');
};

async function sendEmails({ name, business, email, phone, projectType, message }: {
  name: string; business: string; email: string;
  phone: string; projectType: string; message: string;
}) {
  const key = import.meta.env.RESEND_API_KEY;
  if (!key) return;

  const resend = new Resend(key);
  const internalTo = 'hello@getwebify.uk';

  await Promise.all([
    // internal alert
    resend.emails.send({
      from: 'Getwebify <noreply@getwebify.uk>',
      to: internalTo,
      subject: `New enquiry: ${projectType} from ${name}`,
      text: [
        `Name: ${name}`,
        `Business: ${business || '—'}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `Project: ${projectType}`,
        '',
        message,
      ].join('\n'),
    }),
    // auto-reply (Turnstile already verified above; name/email sanitized)
    resend.emails.send({
      from: 'Getwebify <hello@getwebify.uk>',
      to: email,
      subject: 'Thanks for getting in touch — Getwebify',
      text: `Hi ${name},\n\nThanks for reaching out! We'll get back to you within one business day.\n\nIn the meantime you can message us on WhatsApp: https://wa.me/447446508333\n\nBest,\nThe Getwebify Team`,
    }),
  ]);
}
