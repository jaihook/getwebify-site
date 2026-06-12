import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { verifyTurnstile } from '../../lib/turnstile';
import { appendContactRow } from '../../lib/sheets';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // honeypot
  if (form.get('website')) return redirect('/thank-you');

  const name        = String(form.get('name') ?? '').trim();
  const business    = String(form.get('business') ?? '').trim();
  const email       = String(form.get('email') ?? '').trim();
  const phone       = String(form.get('phone') ?? '').trim();
  const projectType = String(form.get('projectType') ?? '').trim();
  const message     = String(form.get('message') ?? '').trim();
  const cfToken     = String(form.get('cf-turnstile-response') ?? '');

  if (!name || !email || !projectType || !message) {
    return new Response('Missing required fields', { status: 400 });
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
  const to = 'hello@getwebify.uk';

  await Promise.all([
    resend.emails.send({
      from: 'Getwebify <noreply@getwebify.uk>',
      to,
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
    resend.emails.send({
      from: 'Getwebify <hello@getwebify.uk>',
      to: email,
      subject: 'Thanks for getting in touch — Getwebify',
      text: `Hi ${name},\n\nThanks for reaching out! We've received your message and will get back to you within one business day.\n\nIn the meantime, feel free to message us on WhatsApp: https://wa.me/447446508333\n\nBest,\nThe Getwebify Team`,
    }),
  ]);
}
