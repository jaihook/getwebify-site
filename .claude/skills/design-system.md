---
name: design-system
description: Getwebify.uk design tokens, typography, colour, motion, and component rules. Invoke before building any UI component or page.
metadata:
  type: reference
---

# Getwebify Design System

Aesthetic: **British Editorial Agency** — editorial magazine × premium small agency. Warm, crafted, trustworthy. No purple gradients, no generic SaaS.

## Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

| Role | Font | Class |
| --- | --- | --- |
| Display — H1, section titles, pull quotes | Fraunces (variable) | `font-display` |
| Body, UI, nav, buttons | Instrument Sans | `font-body` |

Tailwind config:

```js
fontFamily: {
  display: ['Fraunces', 'Georgia', 'serif'],
  body: ['Instrument Sans', 'system-ui', 'sans-serif'],
}
```

Hero headline: `font-display` + `font-variation-settings: 'opsz' 144` + `clamp(2.5rem, 8vw, 6rem)`. Italic last word — Fraunces italic is the signature detail.

## Colour Tokens

```css
:root {
  --cream:      #F7F3EE;
  --ink:        #141210;
  --terracotta: #C45C1A;
  --forest:     #1A3A2A;
  --muted:      #8A8480;
  --rule:       #E2DDD8;
}
```

Tailwind config:

```js
colors: {
  cream:      '#F7F3EE',
  ink:        '#141210',
  terracotta: '#C45C1A',
  forest:     '#1A3A2A',
  muted:      '#8A8480',
  rule:       '#E2DDD8',
}
```

Usage rules:
- Page bg: `cream`. Primary text: `ink`. CTAs + links: `terracotta`.
- Footer bg, affiliate badges: `forest`. Captions, dates: `muted`. Borders, `<hr>`: `rule`.
- WCAG AA: cream/ink = 14:1, terracotta/cream = 4.6:1

## Spacing & Layout

- Max content width: `1200px`, centred, `px-6 md:px-10`
- Section vertical padding: `py-20 md:py-32`
- Mobile-first. Fluid type via `clamp()` — no breakpoint type jumps.

## Motion

All CSS-only. No animation libraries. Always add `prefers-reduced-motion` guard.

```css
/* word stagger (hero) */
.word { opacity: 0; transform: translateY(16px); animation: fadeUp 0.5s ease forwards; }
.word:nth-child(2) { animation-delay: 0.1s; }
.word:nth-child(3) { animation-delay: 0.2s; }

/* scroll cards */
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.4s ease, transform 0.4s ease; }
.reveal.visible { opacity: 1; transform: none; }

/* nav underline */
.nav-link { background: linear-gradient(currentColor, currentColor) bottom / 0% 1px no-repeat; transition: background-size 0.2s; }
.nav-link:hover { background-size: 100% 1px; }

/* CTA hover */
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(196,92,26,0.25); }

/* WhatsApp pulse */
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.wa-dot { animation: pulse 2s ease-in-out infinite; }

@keyframes fadeUp { to { opacity:1; transform:none; } }

@media (prefers-reduced-motion: reduce) {
  .word, .reveal, .btn-primary { animation: none; transition: none; }
  .reveal { opacity: 1; transform: none; }
}
```

Use `IntersectionObserver` to add `.visible` to `.reveal` elements on scroll.

## Component Patterns

### Header

- Sticky, `h-16`, `bg-cream`, `border-b border-rule` added on scroll
- Logo: `GETWEBIFY` in `font-display font-semibold text-ink`
- Nav: `uppercase tracking-widest text-sm font-body`
- WhatsApp pill: `bg-forest text-cream rounded-full px-4 py-2` + green `wa-dot`

### Hero

```astro
<h1 class="font-display text-ink leading-[1.05]"
    style="font-size: clamp(2.5rem, 8vw, 6rem); font-variation-settings: 'opsz' 144">
  <span class="word">We build websites</span><br>
  <span class="word">that win you</span><br>
  <em class="word" style="font-style: italic">business.</em>
</h1>
```

Trust signals: `uppercase tracking-widest text-xs text-muted` separated by `·`

### Service Items

- `<ol>` with large ghosted ordinal in Fraunces `text-rule` (~`text-8xl`), name overlaid
- `border-b border-rule` between items
- Hover: `border-l-2 border-terracotta` slides in via `transition-all`

### Blog Card

- Category pill: `bg-rule text-ink text-xs uppercase tracking-wider`
- Title: `font-display text-xl`
- Meta: `text-muted text-sm font-body`
- Affiliate badge: `bg-forest text-cream text-xs px-2 py-0.5 rounded`

### Affiliate Disclosure Banner

```astro
<div class="bg-forest/10 border border-forest/20 text-forest text-sm px-4 py-3 rounded">
  This page contains affiliate links. We only recommend tools we use ourselves.
</div>
```

### Review Card

- Quote: `font-display italic text-xl text-ink`
- Attribution: `font-body text-sm uppercase tracking-widest text-muted`
- Stars: SVG, `fill-terracotta`

### Footer

- `bg-forest text-cream`
- 4-col grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Bottom bar: `border-t border-cream/20 text-cream/50 text-xs`

## Accessibility Checklist

- `<main>`, `<nav aria-label="Main">`, `<footer>`, `<article>`, `<section aria-label>`
- Skip link: `sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-terracotta text-cream px-4 py-2 z-50`
- Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta`
- All images: descriptive `alt`. Decorative: `alt=""`.
- Affiliate links: `rel="noopener noreferrer sponsored"` always.
