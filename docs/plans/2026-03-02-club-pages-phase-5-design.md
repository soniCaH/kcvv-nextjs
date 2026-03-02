# Phase 5: Club Information Pages — Design

## Scope

Migrate 5 static club pages from Gatsby to Next.js:

| Route             | Title              | Content source                                         |
| ----------------- | ------------------ | ------------------------------------------------------ |
| `/club/history`   | Geschiedenis       | Gatsby `history.tsx` — timeline with 7 images          |
| `/club/downloads` | Downloads          | Gatsby `downloads.tsx` — 3 PDFs                        |
| `/club/register`  | Praktische Info    | Gatsby `register.tsx` — info sections + external links |
| `/club/ultras`    | KCVV Ultras        | Gatsby `ultras.tsx` — 3 sections + 3 images            |
| `/club/cashless`  | Cashless clubkaart | Live site content — 6 sections                         |

All pages are static (no Drupal/API fetches, no `revalidate`).

## Architecture

### Page pattern

Each page follows the existing convention (same as `/privacy`, `/club/contact`):

```text
src/app/(main)/club/<route>/page.tsx
```

- Inline hero: green gradient header with title + optional subtitle
- `generateMetadata` or `export const metadata` for SEO
- Content wrapped in `max-w-4xl mx-auto px-4 py-12`
- No shared PageHeader component (matches existing pattern)

### History page — timeline with animations

**Data:** Hardcoded array of timeline entries, each with `period`, `title`, `content` (JSX), and `side` (left/right).

**Animation:** IntersectionObserver (JS) toggles CSS classes; CSS handles the transitions:

- `useScrollReveal` client hook — observes `[data-reveal]` elements, adds `.revealed` class
- CSS transitions: `opacity 0 → 1`, `translateX(±60px) → 0` over 600ms
- Items alternate left/right on desktop, stack left-aligned on mobile
- Timeline vertical line via CSS `::before` pseudo-element (green, 3px wide, centered)
- Timeline dots: green circles at each entry point

**Images:** 7 historical photos in `public/images/history/`, rendered with `next/image` between timeline sections with `<figcaption>`.

### Downloads page

3 `DownloadCard` inline components (not extracted to design system — single-use):

- Title, description text, download link (`<a href="..." download>`)
- PDFs in `public/downloads/`
- Cards rendered as a simple vertical list with spacing

### Registration / Practical Info page

4 content sections with headings:

1. Inschrijvingen — text + email link + internal link to `/jeugd`
2. Bijdrage lidgeld — list of mutualiteit links
3. ProSoccerData — text + external link
4. Steuntje via Trooper/Makro — text + external links

Plus social media CTA buttons (Facebook, X/Twitter, Instagram).

### Ultras page

Hero header image (full-width) + 3 content sections:

1. Wie zijn we — text + inline image
2. Wat doen we — text + inline image
3. Lid worden — Facebook CTA button

Images in `public/images/ultras/`.

### Cashless page

6 content sections with headings:

1. Wat — what the cashless card is
2. Waarom — why the switch from jetons
3. Wat met mijn jetons? — exchange info
4. KNIP-app — app links (iOS/Android) + QR code info
5. Komt eraan — upcoming features (Payconiq, remote top-up)
6. Algemene voorwaarden — link to terms

## What we are NOT building

- No Storybook stories (static content pages, no reusable components)
- No tests for static pages (no logic to test)
- No design system components (all page-level compositions)
- No Drupal integration (all content hardcoded)
- No forms or interactivity beyond scroll animations
