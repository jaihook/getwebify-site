# Getwebify — Business Development Plan

Last updated: 2026-06-12

---

## Honest Assessment

### What Works
- Tech stack is production-grade. Solid foundation — don't touch it.
- Dual income model (affiliate + services) from same blog content is smart.
- WhatsApp CTA is correct for UK SMBs — they respond to it.
- Sanity CMS means non-technical team can publish without touching code.
- Lead pipeline works end-to-end (form → Sanity leads → email).

### The Core Problem
**No clients. No reviews. No case studies. No proof.**

SEO takes 6–12 months to compound. Revenue needed before Google notices. Everything below closes that gap fast.

---

## Priority 1 — Get Cash In (Weeks 1–4)

**Cold outreach — local tradespeople first:**
- Plumbers, electricians, builders, cleaners, estate agents
- Google `[trade] [city]` — find ones with no site or embarrassing old sites
- Script: "I found your business. Your site cost you 3 leads last month. I can fix it for £499 this week."
- Tradespeople pay fast, don't haggle, refer friends

**First 3 clients:**
- Charge below market (£299–£499) to earn case studies
- Get written permission to quote + photograph result
- These become the social proof machine

**LinkedIn (parallel):**
- Post daily: before/after screenshots, "built this in 3 days with AI tools", site speed scores
- DM founders of 5–20 person companies with outdated sites
- UK LinkedIn is underutilised — low competition for this niche

---

## Priority 2 — Fix Trust Signals (Week 1)

**Critical gaps killing conversion:**

1. **No pricing page** — UK buyers want transparency. "Starting from £799" beats "contact us" every time. Add `/pricing` route.

2. **Empty `/reviews`** — worse than no reviews page. Ask 3 people (friends, ex-colleagues, anyone who's seen the work) for a quote. Add to Sanity.

3. **Empty `/work`** — add personal projects, internal projects, anything. Frame every project ever touched. No client? Use "Internal project".

4. **No analytics** — add Plausible (privacy-friendly, cheap) or Google Analytics. Currently blind on which content works.

---

## Priority 3 — Fix Affiliate Setup (Week 2)

Current affiliate products need verification:

| Tool | Program | Action |
|---|---|---|
| Lovable.dev | ✅ Yes — referral in dashboard | Get actual referral URL, update Sanity `affiliateUrl` |
| Claude.ai | ❌ No public affiliate program | Remove or swap — Anthropic doesn't run one |
| **Add instead** | Hostinger (£60–£130/signup) | High-paying, proven UK traffic |
| **Add instead** | Webflow (25% recurring) | Recurring commissions |
| **Add instead** | Framer affiliate | Popular with designers |

Update affiliate products in Sanity Studio → Affiliate Product section.

---

## Priority 4 — Content That Converts (Ongoing)

The 10 seeded blog posts are too generic. Add these types:

**Buyer-intent posts ("best X for specific person"):**
- "Best website builder for UK plumbers 2025"
- "Best web design agency for startups in [city]"
- "Lovable.dev review: is it worth it for non-coders?"

**Local SEO landing pages (not blog — actual pages):**
- `/web-design-[city]` — rank faster than generic terms
- `/web-design-for-tradespeople`
- `/affordable-web-design-uk`

**Schema improvement needed:**
- Add `targetKeyword` field to Sanity `Post` schema so each post tracks its target keyword

---

## Priority 5 — Retainer Products (Month 2)

No retainer product = feast/famine. Add to services:

| Product | Price | Includes |
|---|---|---|
| Maintenance Plan | £99/month | Hosting, updates, backups, 1hr changes |
| Growth Plan | £299/month | Above + 2 blog posts + monthly report |

Pitch every project client at delivery. 5 on £99/month = £5,940/year recurring before any new work.

Add these to Sanity `Service` schema and homepage `ServiceCards`.

---

## Priority 6 — Email Capture (Month 2)

Currently: visitor reads blog → leaves → never seen again.

**Lead magnet:** "Free Website Audit — I'll review your site and tell you exactly what's costing you leads."

Implementation:
- Inline CTA on blog posts
- Resend email list
- Manual audit → sales conversation

---

## 90-Day Execution Plan

| Week | Focus | Target |
|---|---|---|
| 1–2 | Cold outreach (tradespeople) + fix trust signals | 2 discovery calls booked |
| 3–4 | Close first client, start work | £499+ revenue |
| 5–8 | Deliver → get case study → upsell retainer | 1 case study live, 1 retainer signed |
| 9–12 | Repeat + LinkedIn content machine | 3 retainers + SEO compounding |

---

## What to Ignore Until Month 3

- Social media (except LinkedIn)
- Paid ads (need case studies first for retargeting)
- Expanding the tech stack further
- More blog posts before validating one converts to a lead

---

## Single Most Important Action

Find 10 local business websites that look bad. Call or WhatsApp the owner today. Offer to rebuild for £299 this week. This beats everything else on this list.

---

## Revenue Targets

| Month | Source | Target |
|---|---|---|
| 1 | 2 × project (£499 each) | £998 |
| 2 | 3 × project + 2 × retainer (£99) | £1,695 |
| 3 | 2 × project + 5 × retainer + affiliate starts | £2,495+ |
| 6 | 2 × project + 10 × retainer + affiliate (£200+) | £4,188+ |
| 12 | 1-2 × project + 20 × retainer + affiliate (£500+) | £6,380+ |
