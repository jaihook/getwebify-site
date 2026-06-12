#!/usr/bin/env node
/**
 * Prospect outreach script — find UK tradespeople with bad websites, send cold email via Resend.
 *
 * Usage:
 *   npm run prospect -- --trade plumber --city oxford          # dry run (no emails)
 *   npm run prospect -- --trade plumber --city oxford --send   # send emails
 *   npm run prospect -- --trade electrician --city coventry --send --limit 20
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import { createClient } from '@sanity/client';
import { Resend } from 'resend';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

// ---- Load .env (script runs outside Vite, so no import.meta.env) ----
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../../.env');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = val;
  });
}

// ---- CLI args ----
const args = process.argv.slice(2);
const flag = (f: string) => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : undefined; };
const trade  = flag('--trade');
const city   = flag('--city');
const doSend = args.includes('--send');
const limit  = parseInt(flag('--limit') ?? '12', 10);

if (!trade || !city) {
  console.error('Usage: npm run prospect -- --trade <trade> --city <city> [--send] [--limit 12]');
  process.exit(1);
}

if (!process.env.FIRECRAWL_API_KEY) {
  console.error('Missing FIRECRAWL_API_KEY — get one at app.firecrawl.dev and add to .env');
  process.exit(1);
}

// ---- Clients ----
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const sanity = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset:   process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_TOKEN ?? '',
  useCdn:    false,
});

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

// ---- Types ----
interface Prospect {
  businessName: string;
  website: string;
  email: string;
  phone: string;
  trade: string;
  city: string;
  siteScore: number;
  siteIssues: string[];
}

// ---- Site quality scoring (higher = worse site = better prospect) ----
function scoreSite(url: string, html: string, markdown: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let pts = 0;

  if (!url.startsWith('https://')) { issues.push('No HTTPS'); pts += 3; }

  if (!html.includes('name="viewport"') && !html.includes("name='viewport'")) {
    issues.push('Not mobile-friendly'); pts += 3;
  }

  const yearMatch = markdown.match(/©\s*(\d{4})|[Cc]opyright\s*(?:©\s*)?(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1] || yearMatch[2]);
    if (year <= new Date().getFullYear() - 3) { issues.push(`Last updated ~${year}`); pts += 2; }
  }

  return { score: pts, issues };
}

const EMAIL_RE  = /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/gi;
const PHONE_RE  = /(?:(?:\+44|0)[\s-]?(?:\d[\s-]?){9,10})/g;
const SKIP_DIRS = /yell\.com|checkatrade|rated\.com|trustatrader|mybuilder|bark\.com|google\.|bing\.|facebook\.|instagram\.|twitter\./i;

function extractContact(text: string): { email: string; phone: string } {
  const emails = (text.match(EMAIL_RE) ?? [])
    .filter(e => !/example|sentry|test@|noreply|no-reply/i.test(e));
  const phones = text.match(PHONE_RE) ?? [];
  return { email: emails[0] ?? '', phone: (phones[0] ?? '').replace(/\s/g, '') };
}

// ---- Email template ----
function buildEmail(p: Prospect): { subject: string; text: string } {
  const issue = p.siteIssues.length
    ? `I noticed ${p.siteIssues.join(' and ').toLowerCase()} on your website`
    : 'your website looks like it could bring in more work';

  return {
    subject: `Quick note about ${p.businessName}'s website`,
    text: [
      `Hi,`,
      ``,
      `I came across ${p.businessName} while looking for ${p.trade}s in ${p.city} — ${issue}.`,
      ``,
      `I run Getwebify, a UK web agency. We build fast, mobile-friendly websites for tradespeople that get you more calls. Turnaround is usually under a week.`,
      ``,
      `Happy to take a free look at what we'd do differently — no hard sell, just honest feedback.`,
      ``,
      `Reply here or WhatsApp me directly: +447446508333`,
      ``,
      `Best,`,
      `Jai`,
      `Getwebify — www.getwebify.uk`,
      ``,
      `---`,
      `You're receiving this because your business was found via a public web search.`,
      `To opt out, reply "unsubscribe" and we will never contact you again.`,
    ].join('\n'),
  };
}

// ---- Sanity helpers ----
async function alreadyContacted(email: string): Promise<boolean> {
  if (!process.env.SANITY_API_TOKEN) return false;
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const hit = await sanity.fetch(
    `*[_type == "prospect" && email == $email && emailSentAt >= $cutoff][0]._id`,
    { email, cutoff }
  );
  return !!hit;
}

async function saveProspect(p: Prospect, emailSentAt?: string): Promise<void> {
  if (!process.env.SANITY_API_TOKEN) return;
  await sanity.create({
    _type: 'prospect',
    ...p,
    outreachStatus: emailSentAt ? 'sent' : 'pending',
    ...(emailSentAt ? { emailSentAt } : {}),
  });
}

// ---- Confirm prompt ----
function confirm(q: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(q, a => { rl.close(); res(a.trim().toLowerCase() === 'y'); }));
}

// ---- Main ----
async function main() {
  console.log(`\nSearching for ${trade}s in ${city} (limit: ${limit})...\n`);

  const searchResult = await firecrawl.search(`${trade} ${city}`, {
    limit,
    scrapeOptions: { formats: ['markdown', 'rawHtml'] },
  } as any);

  if (!searchResult.success || !(searchResult as any).data?.length) {
    console.error('No results returned from Firecrawl.');
    process.exit(1);
  }

  const prospects: Prospect[] = [];

  for (const r of (searchResult as any).data) {
    const url: string = r.url ?? '';
    if (!url || SKIP_DIRS.test(url)) continue;

    const markdown: string = r.markdown ?? '';
    const html: string     = r.rawHtml ?? '';
    const { email, phone } = extractContact(markdown + '\n' + html);
    if (!email) continue;

    const { score, issues } = scoreSite(url, html, markdown);
    const rawTitle: string  = r.title ?? '';
    const businessName = rawTitle.split(/[|\-–—]/)[0].trim()
      || url.replace(/https?:\/\/(?:www\.)?/, '').split('/')[0];

    prospects.push({ businessName, website: url, email, phone, trade, city, siteScore: score, siteIssues: issues });
  }

  const qualified = prospects.filter(p => p.siteScore >= 3).sort((a, b) => b.siteScore - a.siteScore);

  if (!qualified.length) {
    console.log('No qualifying prospects found (sites looked decent, or no contact emails found).');
    for (const p of prospects) await saveProspect(p);
    return;
  }

  const col = (s: string, w: number) => s.slice(0, w).padEnd(w);
  console.log(`Found ${qualified.length} qualifying prospect(s):\n`);
  console.log(col('Business', 28), col('Email', 32), 'Score', 'Issues');
  console.log('─'.repeat(85));
  for (const p of qualified) {
    console.log(col(p.businessName, 28), col(p.email, 32), String(p.siteScore).padEnd(5), p.siteIssues.join(', '));
  }

  if (!doSend) {
    console.log('\nDry run — use --send to send emails.');
    for (const p of qualified) await saveProspect(p);
    return;
  }

  const ok = await confirm(`\nSend outreach emails to ${qualified.length} prospect(s)? (y/N) `);
  if (!ok) { console.log('Aborted.'); return; }

  let sent = 0;
  for (const p of qualified) {
    if (await alreadyContacted(p.email)) {
      console.log(`  Skipping ${p.email} — contacted within 90 days.`);
      continue;
    }
    const { subject, text } = buildEmail(p);
    const { error } = await resend.emails.send({
      from: 'Jai at Getwebify <hello@getwebify.uk>',
      to: p.email,
      subject,
      text,
      tags: [
        { name: 'trade', value: trade },
        { name: 'city', value: city },
        { name: 'score', value: String(p.siteScore) },
      ],
    });
    if (error) {
      console.error(`  ✗ ${p.email}: ${error.message}`);
      await saveProspect(p);
    } else {
      console.log(`  ✓ Sent to ${p.businessName} (${p.email})`);
      await saveProspect(p, new Date().toISOString());
      sent++;
    }
  }
  console.log(`\nDone — ${sent} email(s) sent.`);
}

main().catch(err => { console.error(err); process.exit(1); });
