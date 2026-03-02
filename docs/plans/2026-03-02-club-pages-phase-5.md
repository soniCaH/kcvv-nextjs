# Phase 5: Club Information Pages — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate 5 static club pages (history, downloads, register, ultras, cashless) from Gatsby to Next.js.

**Architecture:** All pages are static with hardcoded content (no API fetches). The history page uses IntersectionObserver (JS) to toggle CSS classes for fly-in animations. Images and PDFs are copied from the Gatsby source to `public/`.

**Tech Stack:** Next.js App Router, Tailwind CSS, `next/image`, IntersectionObserver API

---

### Task 1: Copy static assets from Gatsby

**Files:**

- Create: `public/images/history/` (7 images)
- Create: `public/images/ultras/` (3 images)
- Create: `public/downloads/` (3 PDFs)

**Step 1: Create directories and copy files**

```bash
mkdir -p public/images/history public/images/ultras public/downloads

# History images
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/history-52-53.png public/images/history/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/history-58-59.png public/images/history/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/history-63-64.png public/images/history/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/history-fusie.png public/images/history/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/history-bvb.png public/images/history/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/history-2018.jpeg public/images/history/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/history-2022.jpeg public/images/history/

# Ultras images
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/header-ultras.jpg public/images/ultras/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/ultras-kampioen.jpeg public/images/ultras/
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/images/ultras-sjr.jpg public/images/ultras/

# Download PDFs
cp /Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/downloads/*.pdf public/downloads/
```

**Step 2: Optimize the large history-2022.jpeg (7.5MB)**

Use `sips` (macOS built-in) to resize to max 1920px wide:

```bash
sips --resampleWidth 1920 public/images/history/history-2022.jpeg
```

**Step 3: Commit**

```bash
git add public/images/history/ public/images/ultras/ public/downloads/
git commit -m "chore: copy static assets from Gatsby (history images, ultras images, PDFs)"
```

---

### Task 2: Create useScrollReveal hook

**Files:**

- Create: `src/hooks/useScrollReveal.ts`

**Step 1: Create the hook**

```typescript
"use client";

import { useEffect } from "react";

/**
 * Observes elements with [data-reveal] and adds "revealed" class when visible.
 * Uses IntersectionObserver for performant scroll-based animations.
 */
export function useScrollReveal(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll("[data-reveal]");
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [containerRef]);
}
```

**Step 2: Commit**

```bash
git add src/hooks/useScrollReveal.ts
git commit -m "feat(club): add useScrollReveal hook for timeline animations"
```

---

### Task 3: Create History page

**Files:**

- Create: `src/app/(main)/club/history/page.tsx`

This is the most complex page. It has:

- A client component wrapper for scroll animations
- A timeline with alternating left/right items
- Full-width image sections between timeline blocks
- Credits section at the bottom

**Step 1: Create the page**

The page uses the same hero header pattern as other pages. The timeline is built with Tailwind CSS:

- Vertical green line: `before:absolute before:left-1/2 before:w-[3px] before:h-full before:bg-green-main`
- Timeline dots: green circles with `w-12 h-12 rounded-full bg-green-main`
- Items: `w-[45%]` on each side, collapsing to `w-[90%] ml-auto` on mobile
- Animation classes: `data-reveal` items start with `opacity-0 translate-x-[-60px]` (left) or `translate-x-[60px]` (right), transition to `opacity-100 translate-x-0` when `.revealed`

Content: Copy all text verbatim from the Gatsby `history.tsx` (lines 29-494). Each `ScrollAnimation` wrapper becomes a `div` with `data-reveal` and `data-direction="left"` or `data-direction="right"`.

Images: Use `next/image` with `sizes="100vw"` for full-width images. Include `<figcaption>` with the same text.

The page needs `"use client"` because it uses `useScrollReveal`.

Reference the Gatsby source at:
`/Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/pages/club/history.tsx`

Metadata:

```typescript
export const metadata: Metadata = {
  title: "Geschiedenis | KCVV Elewijt",
  description:
    "Tijdslijn van de rijkgevulde geschiedenis van KCVV Elewijt van 1909 tot nu!",
  keywords: [
    "geschiedenis",
    "history",
    "KCVV Elewijt",
    "tijdslijn",
    "Crossing Elewijt",
  ],
  openGraph: {
    title: "Geschiedenis - KCVV Elewijt",
    description:
      "Tijdslijn van de rijkgevulde geschiedenis van KCVV Elewijt van 1909 tot nu!",
    type: "website",
  },
};
```

Note: Since `"use client"` pages can't export `metadata`, split into:

- `page.tsx` — server component with metadata export, renders `<HistoryContent />`
- `HistoryContent.tsx` — client component with `"use client"`, uses `useScrollReveal`, contains timeline JSX

**Step 2: Verify it renders**

```bash
npm run build
```

Should see `/club/history` in the build output as a static page.

**Step 3: Commit**

```bash
git add src/app/\(main\)/club/history/
git commit -m "feat(club): add history page with timeline and scroll animations"
```

---

### Task 4: Create Downloads page

**Files:**

- Create: `src/app/(main)/club/downloads/page.tsx`

**Step 1: Create the page**

Simple static page with 3 download cards. Each card has:

- Title
- Description text
- Download link (`<a href="/downloads/filename.pdf" download>`)

Content sections (from Gatsby source):

1. **Aangiftes** heading
   - Ongevalsaangifte — `insurance_medical_attest_template_nl.pdf`
2. **Reglementen** heading
   - Reglement van Inwendige Orde — `reglement_inwendige_orde_2022.pdf`
   - De 'ideale' voetbal(groot)ouders — `2022-2023_-_De_ideale_voetbalgrootouder.pdf`

Each card: white background, rounded, shadow, with a download icon/button.

Metadata:

```typescript
export const metadata: Metadata = {
  title: "Downloads | KCVV Elewijt",
  description:
    "Download digitale documenten van KCVV Elewijt — ongevalsaangifte, reglementen en meer.",
  keywords: [
    "downloads",
    "documenten",
    "KCVV Elewijt",
    "ongevalsaangifte",
    "reglement",
  ],
  openGraph: {
    title: "Downloads - KCVV Elewijt",
    description: "Download digitale documenten van KCVV Elewijt",
    type: "website",
  },
};
```

Reference Gatsby source at:
`/Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/pages/club/downloads.tsx`

**Step 2: Commit**

```bash
git add src/app/\(main\)/club/downloads/
git commit -m "feat(club): add downloads page with PDF download cards"
```

---

### Task 5: Create Register / Practical Info page

**Files:**

- Create: `src/app/(main)/club/register/page.tsx`

**Step 1: Create the page**

Static page with 4 content sections. All text from Gatsby `register.tsx`.

Sections:

1. **Inschrijvingen** — text with `Link` to `/jeugd` and `mailto:jeugd@kcvvelewijt.be`
2. **Bijdrage lidgeld** — list of mutualiteit links (CM, Solidaris, Liberale mutualiteit, VNZ, Helan)
3. **ProSoccerData** — text + link to `https://kcvv.prosoccerdata.com/`
4. **Steuntje via Trooper of Makro** — text + links to Trooper and MyMakro

Plus social media buttons at the bottom (Facebook, X/Twitter, Instagram) — styled as colored buttons.

All external links: `target="_blank" rel="noopener noreferrer"`.

Metadata:

```typescript
export const metadata: Metadata = {
  title: "Praktische Info | KCVV Elewijt",
  description:
    "Praktische informatie rond inschrijvingen, lidgeld, ProSoccerData en meer bij KCVV Elewijt.",
  keywords: [
    "inschrijving",
    "praktische info",
    "lidgeld",
    "ProSoccerData",
    "KCVV Elewijt",
  ],
  openGraph: {
    title: "Praktische Info - KCVV Elewijt",
    description: "Praktische informatie rond inschrijvingen bij KCVV Elewijt",
    type: "website",
  },
};
```

Reference Gatsby source at:
`/Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/pages/club/register.tsx`

**Step 2: Commit**

```bash
git add src/app/\(main\)/club/register/
git commit -m "feat(club): add practical info page (register)"
```

---

### Task 6: Create Ultras page

**Files:**

- Create: `src/app/(main)/club/ultras/page.tsx`

**Step 1: Create the page**

Static page with hero header image and 3 content sections. All text from Gatsby `ultras.tsx`.

Structure:

- Full-width hero image: `/images/ultras/header-ultras.jpg` via `next/image` with `fill` + `object-cover`
- Section 1: **Wie zijn we** — text paragraphs + inline image `ultras-kampioen.jpeg`
- Section 2: **Wat doen we** — blockquote + text + inline image `ultras-sjr.jpg`
- Section 3: **Lid worden** — text + Facebook CTA button linking to `https://www.facebook.com/KCVV.ULTRAS.55/`

Metadata:

```typescript
export const metadata: Metadata = {
  title: "KCVV Ultras | KCVV Elewijt",
  description:
    "Supportersclub van KCVV Elewijt: De Ultra's! Positief aanmoedigen van onze ploeg.",
  keywords: ["ultras", "supporters", "KCVV Elewijt", "sfeeracties"],
  openGraph: {
    title: "KCVV Ultra's 55 - KCVV Elewijt",
    description: "Supportersclub van KCVV Elewijt: De Ultra's!",
    type: "website",
  },
};
```

Reference Gatsby source at:
`/Users/kevinvanransbeeck/Sites/KCVV/KCVV-Elewijt-Gatsby/src/pages/club/ultras.tsx`

**Step 2: Commit**

```bash
git add src/app/\(main\)/club/ultras/
git commit -m "feat(club): add KCVV Ultras supporter page"
```

---

### Task 7: Create Cashless page

**Files:**

- Create: `src/app/(main)/club/cashless/page.tsx`

**Step 1: Create the page**

Static page with 6 content sections. Content extracted from the live site at `https://www.kcvvelewijt.be/club/cashless/`.

Sections:

1. **Wat** — explanation of the cashless club card replacing jetons since Jan 2023
2. **Waarom** — why the switch (pricing accuracy, stock tracking, convenience)
3. **Wat met mijn jetons?** — jetons can be exchanged, each worth 1 euro
4. **KNIP-app** — QR code on card, iOS/Android app links, mobile payment
5. **Komt eraan** — upcoming: Payconiq, remote top-up via app
6. **Algemene voorwaarden** — link to terms document

Metadata:

```typescript
export const metadata: Metadata = {
  title: "Cashless Clubkaart | KCVV Elewijt",
  description:
    "Informatie over de cashless clubkaart van KCVV Elewijt — betalen, opladen en de KNIP-app.",
  keywords: ["cashless", "clubkaart", "KNIP", "betalen", "KCVV Elewijt"],
  openGraph: {
    title: "Cashless Clubkaart - KCVV Elewijt",
    description: "Informatie over de cashless clubkaart van KCVV Elewijt",
    type: "website",
  },
};
```

**Step 2: Commit**

```bash
git add src/app/\(main\)/club/cashless/
git commit -m "feat(club): add cashless club card info page"
```

---

### Task 8: Final verification and build

**Step 1: Type check**

```bash
npx tsc --noEmit
```

**Step 2: Build**

```bash
npm run build
```

Verify all 5 new routes appear in build output:

- `/club/history`
- `/club/downloads`
- `/club/register`
- `/club/ultras`
- `/club/cashless`

**Step 3: Run tests to ensure nothing is broken**

```bash
npx vitest run
```

All existing tests should still pass.
