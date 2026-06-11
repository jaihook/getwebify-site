# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Revenue-generating business website for **Getwebify** — a UK web services agency.

- **Domain**: `www.getwebify.uk`
- **Stack**: Astro + Sanity CMS + Vercel + GitHub
- **Contact**: +447446508333 (WhatsApp), `hello@getwebify.uk`
- **Goal**: SEO blog → service awareness → WhatsApp/contact CTA → leads

## Commands

```bash
# Astro site
npm run dev          # dev server
npm run build        # production build
npm run preview      # preview build output

# Sanity Studio (embedded at /studio route via @sanity/astro)
npx sanity@latest typegen generate   # regenerate TS types after schema changes
```

## Architecture

```text
getwebify-site/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ServiceCards.astro
│   │   ├── BlogGrid.astro
│   │   ├── WhatsAppButton.astro   ← fixed bottom-right, wa.me/447446508333
│   │   ├── ContactForm.astro
│   │   ├── ReviewCard.astro
│   │   ├── AffiliateCard.astro
│   │   └── AffiliateDisclosure.astro  ← UK ASA banner, shown when hasAffiliates=true
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro       ← renders AffiliateCard + disclosure if hasAffiliates
│   │   ├── work/
│   │   │   └── [slug].astro       ← case studies
│   │   ├── reviews.astro
│   │   ├── tools.astro            ← curated affiliate product listing
│   │   ├── thank-you.astro
│   │   └── api/
│   │       └── contact.ts         ← validate → Turnstile verify → Sheets append → Resend x2
│   └── lib/
│       ├── sanity.ts              ← GROQ client + query helpers
│       ├── sheets.ts              ← Google Sheets API v4 append helper
│       └── turnstile.ts           ← Cloudflare Turnstile server-side verify
├── sanity/
│   ├── schemas/
│   │   ├── post.ts
│   │   ├── author.ts
│   │   ├── service.ts
│   │   └── siteSettings.ts        ← singleton: businessName, tagline, whatsapp, email
│   └── sanity.config.ts
├── public/
│   └── robots.txt
├── astro.config.mjs
├── tailwind.config.mjs
└── vercel.json
```

## Sanity Schemas

| Schema | Key Fields |
| --- | --- |
| `Post` | `title`, `slug`, `excerpt`, `body` (Portable Text), `publishedAt`, `coverImage`, `seoMeta`, `hasAffiliates` (bool), `affiliateProducts[]` (ref) |
| `Author` | `name`, `bio`, `image` |
| `SiteSettings` (singleton) | `businessName`, `tagline`, `whatsapp`, `email`, `metaDescription` |
| `Service` | `title`, `description`, `icon`, `cta` |
| `Review` | `clientName`, `rating` (1-5), `quote`, `projectType`, `date` |
| `CaseStudy` | `title`, `slug`, `clientAnonymised`, `problem`, `solution`, `result`, `images[]` |
| `AffiliateProduct` | `name`, `description`, `logo`, `affiliateUrl`, `utmParams`, `category`, `featured` (bool) |

## Design System

### Aesthetic

"British Editorial Agency" — editorial magazine × premium small agency. Trustworthy, crafted, grown-up. Not Silicon Valley SaaS, not purple-gradient startup.

### Typography

| Role | Font | Google Fonts load string |
| --- | --- | --- |
| Display (H1, section titles) | `Fraunces` variable | `Fraunces:opsz,wght@9..144,300..900` |
| Body / UI | `Instrument Sans` | `Instrument+Sans:wght@400;500;600` |

- Hero headline: `Fraunces` optical size `144`, fluid `clamp(2.5rem, 8vw, 6rem)`
- Italic last word of hero headline (Fraunces italic is distinctive)
- Nav labels: uppercase, `0.08em` letter-spacing, `Instrument Sans`

### Colour Tokens (CSS variables)

```css
--cream:      #F7F3EE;  /* base bg */
--ink:        #141210;  /* primary text */
--terracotta: #C45C1A;  /* CTAs, links, active states */
--forest:     #1A3A2A;  /* footer bg, badges, secondary accent */
--muted:      #8A8480;  /* captions, metadata */
--rule:       #E2DDD8;  /* borders, dividers */
```

### Responsive Breakpoints

Standard Tailwind (`sm:640 md:768 lg:1024 xl:1280`). Max content width `1200px`. Mobile-first. No breakpoint jumps on type — use `clamp()`.

### Motion Rules

- Hero headline: words stagger fade-up `100ms` apart via CSS `animation-delay`
- Scroll cards: `IntersectionObserver` + CSS fade-up `20px`
- Nav links: underline `scaleX` left-to-right on hover
- WhatsApp dot: `2s` CSS pulse `@keyframes`
- CTA hover: `translateY(-2px)` + shadow
- All motion: respect `prefers-reduced-motion`; no JS animation libraries

### Component Design Rules

- **Header**: sticky `64px`, `--cream` bg, `1px --rule` border on scroll; logo = `GETWEBIFY` wordmark in Fraunces 600; WhatsApp pill = `--forest` bg + green pulse dot
- **Hero**: full-width `min-h-screen`; 3-line headline; subline max-width `480px`; 3 trust signals in small caps below CTAs
- **Services**: numbered `01/02/03` editorial list, ghosted ordinals in Fraunces `--rule` colour, `1px` rule separators, terracotta left-border on hover
- **Blog cards**: featured post full-width banner top; 3-col grid below; affiliate posts get `--forest` badge
- **Reviews**: `Fraunces` italic quotes, masonry 2-col desktop, SVG stars in `--terracotta`
- **Tools/Affiliates**: `AffiliateDisclosure.astro` banner (`--forest` tint) at page top; all links `rel="noopener noreferrer sponsored"`
- **Footer**: `--forest` bg, cream text, 4-col layout

### Accessibility

- WCAG AA: cream/ink = 14:1, terracotta/cream = 4.6:1
- Focus ring: `2px` terracotta outline, `2px` offset
- Semantic HTML: `<main>`, `<nav>`, `<article>`, `<section aria-label>`
- Skip-to-content link (visually hidden until focused)

## Env Vars

```sh
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                  # server-side only (write token)
RESEND_API_KEY=                    # contact form email delivery
GOOGLE_SERVICE_ACCOUNT_KEY=        # stringified JSON — service account for Sheets API
GOOGLE_SHEET_ID=                   # from Sheet URL (/d/<ID>/)
TURNSTILE_SECRET_KEY=              # Cloudflare dashboard — server-side only
PUBLIC_TURNSTILE_SITE_KEY=         # Cloudflare dashboard — safe to expose in client
```

## Key Patterns

- Sanity client in `src/lib/sanity.ts`; GROQ queries fetch at build time for static pages
- `[slug].astro` uses `getStaticPaths` + GROQ for blog post routes
- Images: `@sanity/image-url` builder from Sanity image refs
- Portable Text: `@portabletext/astro`
- Contact form: `honeypot` check → Turnstile verify → Sheets append → Resend alert to `hello@getwebify.uk` → Resend auto-reply to lead → redirect `/thank-you`
- `SiteSettings` singleton controls tagline/CTAs without code changes
- `/studio` route embeds Sanity Studio via `@sanity/astro` (locked by Sanity project auth)
- Affiliate URLs live in Sanity `AffiliateProduct.affiliateUrl` — never hardcoded in components
- Affiliate outbound links: `rel="noopener noreferrer sponsored"` + `target="_blank"`
- Posts with `hasAffiliates: true` render `AffiliateDisclosure.astro` at top (UK ASA compliance)
- UTM params stored in Sanity field — no JS tracking, cookie-free

## Sales Funnel

```text
SEO Blog Post (e.g. "Best AI website builders 2025")
    ↓
Reader clicks affiliate link (lovable.dev etc.) → commission earned
    ↓
Post CTA: "Want us to build it for you?" → lead captured
    ↓
hello@getwebify.uk → sales conversation → paid project
```

Dual income from same post: affiliate commission + service lead.
Every blog post ends with CTA: "Need help with X? Let's talk →"
`/reviews` — star-rated client reviews (JSON-LD for Google rich snippets)
`/tools` — curated affiliate recommendations by category

## Build Phases

1. ✅ GitHub repo + Astro scaffold + Tailwind + `@sanity/astro`
2. ✅ Sanity project init + schemas + Studio embed + CORS config — includes `Review`, `CaseStudy`, `AffiliateProduct`
3. ✅ Page architecture (Home, Blog, About, Contact, Studio, `/reviews`, `/tools`, `/work/[slug]`)
4. ✅ Component build — all 10 in `src/components/`, wired into `BaseLayout.astro` (Header, Footer, WhatsAppButton auto-included on every page)
5. 🔄 Sales funnel wiring — `index.astro` done (Hero, ServiceCards, BlogGrid, ReviewCard, LocalBusiness JSON-LD); remaining 4 pages below
6. ⏳ SEO — `@astrojs/sitemap` installed; needs: site URL in astro.config.mjs, robots.txt content, Article JSON-LD on blog/[slug].astro
7. ⏳ Vercel deployment + custom domain `www.getwebify.uk` + env vars + Sanity webhook
8. ⏳ Contact form API (`src/pages/api/contact.ts`) — requires `output: 'hybrid'` in astro.config.mjs

### Phase 5 remaining (start here next session)

- `src/pages/blog/index.astro` — replace inline markup with `<BlogGrid posts={posts} featured />`
- `src/pages/blog/[slug].astro` — add `<AffiliateDisclosure />` (when `hasAffiliates`), `<AffiliateCard>` per product, wire Portable Text body via `astro-portabletext` + `@sanity/image-url`
- `src/pages/contact.astro` — replace inline form with `<ContactForm />`
- `src/pages/reviews.astro` — replace inline blockquotes with `<ReviewCard>` per review

### Phase 6 tasks

- `astro.config.mjs` — add `site: 'https://www.getwebify.uk'` + `sitemap()` integration
- `public/robots.txt` — allow all, `Sitemap: https://www.getwebify.uk/sitemap-index.xml`
- `src/pages/blog/[slug].astro` — Article JSON-LD (`BlogPosting`, `headline`, `datePublished`, `author`)

### Phase 8 files to create

- `src/pages/api/contact.ts` — Astro API endpoint
- `src/lib/sheets.ts` — Google Sheets API v4 service account append
- `src/lib/turnstile.ts` — Cloudflare Turnstile server-side verify
- `astro.config.mjs` — change `output: 'static'` → `output: 'hybrid'` so `/api/contact` is server-side

## Dependencies

```text
astro  @astrojs/tailwind  @astrojs/sitemap  @astrojs/vercel
@sanity/astro  @sanity/client  @portabletext/astro
sanity  tailwindcss  resend  googleapis
```

Google Sheets: `googleapis` with service account auth — no Zapier/Make dependency.
Sheet columns: `Timestamp | Name | Business | Email | Phone | ProjectType | Message | Source`

## Risks

| Risk | Mitigation |
| --- | --- |
| DNS propagation delay | Test on `.vercel.app` first; add domain early |
| Contact form deliverability | Resend + SPF/DKIM on getwebify.uk |
| Studio exposed publicly | Locked by Sanity project-level user auth |
