# Prospect Outreach — How It Works

Last updated: 2026-06-12

## Setup (one-time)

Add to `.env` and Vercel env vars:

```
FIRECRAWL_API_KEY=fc-xxxxx   # get from app.firecrawl.dev
RESEND_API_KEY=re_xxxxx      # already needed for contact form
SANITY_API_TOKEN=skXXXX      # already set
```

`FIRECRAWL_API_KEY` is local only — not needed in Vercel.

---

## Running the Script

```bash
# Dry run — find prospects, print table, save to Sanity, NO emails sent
npm run prospect -- --trade plumber --city oxford

# Send outreach emails (prompts y/N confirmation)
npm run prospect -- --trade plumber --city oxford --send

# More results
npm run prospect -- --trade electrician --city coventry --send --limit 20
```

Supported trades: plumber, electrician, builder, cleaner, decorator, roofer, carpenter, glazier — any UK trade term works.

---

## What It Does

1. **Firecrawl** searches `"[trade] [city]"` — finds up to 12 (or `--limit N`) business websites
2. Skips directories: Yell, Checkatrade, Bark, Google, Facebook, etc.
3. Scrapes each site — extracts email, phone, checks HTTPS + mobile viewport + copyright year
4. **Scores** problems (higher = worse site = better prospect for us):
   - No HTTPS: +3
   - Not mobile-friendly: +3
   - Copyright year ≤ 3 years old: +2
5. Qualifies: score ≥ 3 AND email found
6. Prints table — review before sending
7. With `--send`: asks for confirmation → sends personalized Resend email → logs `emailSentAt`
8. **90-day dedup**: skips any email already contacted within 90 days

---

## Sanity Studio — Prospect CRM

Go to `/studio` → **Prospects** in sidebar.

Each prospect has:
- Auto-filled: business name, website, email, phone, trade, city, site score, issues, email sent date
- **You edit**: Status dropdown + Notes

Status pipeline:
```
pending → sent → replied → booked → won → lost
```

Update status as you work the lead. Add notes after calls.

---

## Cold Email Template

Subject: `Quick note about [businessName]'s website`

Body mentions:
- Their specific trade + city
- The exact issue found (e.g. "not mobile-friendly" / "no HTTPS")
- Free look offer, no hard sell
- WhatsApp: +447446508333
- Unsubscribe line (GDPR/UK PECR compliant)

---

## Weekly Workflow (suggested)

| Day | Action |
|-----|--------|
| Mon | `npm run prospect -- --trade plumber --city oxford --send` |
| Tue | `npm run prospect -- --trade electrician --city northampton --send` |
| Wed | Check Studio → update statuses on any replies |
| Thu | `npm run prospect -- --trade builder --city coventry --send` |
| Fri | Follow up via WhatsApp on replied prospects |

10 emails/day × 5 days = 50 outreach/week. If 5% convert to calls = 2–3 calls/week.

---

## Target Trades for UK Cities

High-value, pay fast, refer friends:
- Plumbers, electricians, builders, roofers (emergency work = cash quick)
- Cleaners, decorators (high volume, word of mouth)
- Estate agents (recurring retainer potential)

Priority cities already in CLAUDE.md:
Oxfordshire, Oxford, Banbury, Coventry, Cambridge, Rugby, Brackley, Northampton
