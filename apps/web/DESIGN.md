---
name: KCVV Elewijt
description: A retro-terrace fanzine for a Belgian amateur football club — cream paper, hard ink, tape and stamps.
colors:
  cream: "#f5f1e6"
  cream-soft: "#ede8da"
  cream-deep: "#e1d7bf"
  paper-edge: "#d9d2bd"
  ink: "#0a0a0a"
  ink-soft: "#1f1f1f"
  ink-muted: "#6b6b6b"
  jersey: "#4acf52"
  jersey-deep: "#007c46"
  jersey-bright: "#22c55e"
  jersey-deep-dark: "#133d28"
  warm: "#f0c264"
  tape-cream: "rgb(232 224 200 / 0.85)"
  alert: "#b84a3a"
  alert-soft: "#e8d5cf"
  warning: "#c68b2c"
  warning-soft: "#ecddb8"
  success-soft: "#d8e7d0"
  card-red: "#c93f1c"
typography:
  display:
    fontFamily: "freight-big-pro, Freight Display Fallback, georgia, Times New Roman, serif"
    fontSize: "clamp(3.5rem, 1.5rem + 8vw, 6rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "freight-display-pro, Freight Display Fallback, georgia, Times New Roman, serif"
    fontSize: "clamp(2.75rem, 1.5rem + 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "freight-display-pro, Freight Display Fallback, georgia, Times New Roman, serif"
    fontSize: "clamp(2rem, 1.25rem + 3vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  subtitle:
    fontFamily: "freight-display-pro, Freight Display Fallback, georgia, Times New Roman, serif"
    fontSize: "clamp(1.5rem, 1rem + 1.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "freight-sans-pro, Freight Sans Fallback, -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-lg:
    fontFamily: "freight-sans-pro, Freight Sans Fallback, -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "freight-sans-pro, Freight Sans Fallback, -apple-system, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  mono:
    fontFamily: "IBM Plex Mono, Consolas, Liberation Mono, Courier, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: "IBM Plex Mono, Consolas, Liberation Mono, Courier, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  none: "0"
  full: "9999px"
spacing:
  card-sm: "0.75rem"
  card-md: "1.25rem"
  card-lg: "2rem"
  prose: "680px"
  wide: "1040px"
  index: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.jersey-deep}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "0.75rem 2rem"
  button-primary-hover:
    backgroundColor: "{colors.jersey-deep}"
    textColor: "{colors.cream}"
  button-inverted:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 2rem"
  button-secondary:
    backgroundColor: "{colors.cream-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 2rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 2rem"
  card-paper:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-md}"
  card-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-md}"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.5rem"
  input-focus:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
  pill-jersey-deep:
    backgroundColor: "{colors.jersey-deep}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.5rem"
  stamp-badge:
    backgroundColor: "{colors.jersey-deep}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.875rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
---

# Design System: KCVV Elewijt

## Overview

**Creative North Star: "The Retro-Terrace Fanzine"**

This is a self-published supporter zine that happens to be a website. Everything is printed on cream paper stock, everything is drawn in hard black ink, and everything that matters is stuck down with tape or hit with a rubber stamp. Nothing glows, nothing blurs, nothing floats. The page has a physical thickness: cards cast a hard offset shadow with no blur, as if a rectangle of paper were laid on the page and lit from a single fixed point. Press one and it slides into its own shadow.

The register is confident and slightly rough. Headlines are enormous serif display type set tight, with a single italic word pulled out in green or a hand-drawn highlighter stroke swiped across it. Structural labels — kickers, statuses, timestamps, scores — are set in uppercase monospace at 11px, tracked wide, the typeface of a photocopied team sheet. Photographs are warm-tinted like aged newsprint and laid on the page under a barely-visible paper grain. Tape strips sit at sub-degree angles, enough to break the perfect grid without looking seasick.

What this deliberately is not: the Sportlink/Twizzit amateur-club house style (stock hero, rounded cards, generic sans, logo on a blue gradient); modern SaaS product UI (soft blurred shadows, gradient fills, glassmorphism, Inter); and big-club broadcast slick (dark glossy panels, neon data viz, motion-heavy hero video). Those three are the anti-references. When a decision could go either way, go toward print and away from all three.

**Key Characteristics:**

- Cream paper surface with near-black ink — never white-on-grey product chrome
- Zero border radius on every rectangle; circles are the only curve
- Hard offset shadows (`4px 4px 0 0` ink), never blur
- Press-down interaction: surfaces slide into their shadow instead of lifting
- Serif display type at extreme scale against 11px uppercase mono labels — no middle register
- Tape, stamps, perforations and hand-drawn strokes as the ornament vocabulary
- Green is rare and load-bearing, never a wash

## Colors

A print palette: one paper, one ink, one green, one warm accent, and a small set of aged status tones. There is no grey UI layer — depth comes from stepping the cream down or flipping the whole surface to ink.

### Primary

- **Jersey Deep** (`#007c46`): the club green, and on cream the only green allowed to carry meaning. Primary buttons, large display headings, italic accent words in headlines, inline prose links, active states, and dark section fills. It reads 4.69:1 on cream — text-safe at any size, and still ≥3:1 against surrounding ink so a link stays distinguishable by colour alone. Darkened one shade from `#008755` by #2395, which also absorbed the former `jersey-link` (it held this exact value) so cream carries one text-bearing green instead of two. On ink that job belongs to `jersey-bright`, below.
- **Jersey** (`#4acf52`): the bright terrace green. Decorative only — stripe patterns, tape strips, spinner bars. **Never text, never on cream.**
- **Jersey Bright** (`#22c55e`): green text on ink surfaces only, where the deep green disappears.
- **Jersey Deep Dark** (`#133d28`): desaturated retro forest. The far stop of the photo-overlay gradient and the darkest green field.

### Secondary

- **Warm** (`#f0c264`): aged-poster yellow. Warm tape strips, accent words on dark green surfaces, button stripe details. It is the only accent that survives on a jersey-deep field, where green tape has no contrast.

### Neutral

- **Cream** (`#f5f1e6`): the page. Every surface starts here.
- **Cream Soft** (`#ede8da`): a card sitting on the page — the first step down.
- **Cream Deep** (`#e1d7bf`): the deepest paper tone; section bands that need to recede.
- **Paper Edge** (`#d9d2bd`): card outlines and dividers on cream, where a full ink border would be too loud.
- **Ink** (`#0a0a0a`): primary text, every border, every hard shadow, and the fill for dark interlude panels.
- **Ink Soft** (`#1f1f1f`): a dark surface layered on a dark surface.
- **Ink Muted** (`#6b6b6b`): bylines, timestamps, metadata, and the soft shadow offset used where pure ink would vanish.
- **Tape Cream** (`rgb(232 224 200 / 0.85)`): the tape colour that nearly disappears into the paper — read by edge and shadow only.

### Tertiary

Status tones, tuned for print rather than for a dashboard. Each pairs a saturated stroke colour with a desaturated body tint.

- **Alert / Alert Soft** (`#b84a3a` / `#e8d5cf`): dusty brick red. Error field chrome, error alerts, alert-tone stamps.
- **Warning / Warning Soft** (`#c68b2c` / `#ecddb8`): aged mustard ochre.
- **Success Soft** (`#d8e7d0`): desaturated sage. Body tint only — success has no stroke colour of its own; it borrows jersey-deep.
- **Card Red** (`#c93f1c`): reserved severity tone for a cancelled/dead match state. Pairs with cream foreground text.

### Named Rules

**The Rare Green Rule.** Green is an event, not a surface treatment. On any given screen it appears on the primary CTA, the accent word in one heading, and active state — and effectively nowhere else. If a screen reads as green, it is wrong.

**The Two-Greens Rule.** There are exactly two greens on cream, split by one question — does it carry text? `jersey` decorates and never touches text; `jersey-deep` carries everything that does, inline prose links included. Until #2395 the rule named three greens and was not literally true; `jersey-link` has since been absorbed into `jersey-deep`. Picking the wrong green is the single most common colour error in this system.

**The Whole-Cream Rule.** Cream on a jersey-deep surface is cream, never a fraction of it. `text-cream/90` costs more contrast than a whole shade step of green does (4.05 → 3.56, where the #2395 shade step bought 4.05 → 4.69), so the fraction is always the worse trade. Scoped to jersey-deep: on `jersey-deep-dark` (~10.9:1) and ink (17.5:1) cream has contrast to spare and a fraction is harmless. One known exception is still shipping — `<NumberDisplay tone="cream">` hardcodes `text-cream/70` on its label, which lands on jersey-deep wherever the component sits in a jersey-deep `<TapedCard>`. Fixing it means touching a shared primitive whose other callers are all on dark surfaces, so it is tracked separately rather than swept here.

**The No-Grey-UI Rule.** There is no neutral grey in this system — not as a token, not as an option. A surface is cream, a step of cream, or ink. `gray-100` (`#f3f4f6`) was the last holdout, sitting under four homepage sections; #2342 deleted the token outright and reduced `SectionBg` to `jersey-deep | transparent`, so those sections now let the page cream through. If a section ever needs to step down from the page without going dark, add `cream-soft` to `SectionBg` — never reintroduce a grey.

## Typography

**Display Font:** Freight Big Pro (`freight-big-pro`, with metric-matched Georgia fallback) — the heaviest headline register only
**Secondary Display:** Freight Display Pro (`freight-display-pro`, same fallback) — every other heading, and all italic accents
**Body Font:** Freight Sans Pro (`freight-sans-pro`, with metric-matched Arial fallback)
**Label/Mono Font:** IBM Plex Mono (self-hosted)

**Character:** A newspaper masthead bolted to a photocopied team sheet. The serif display faces carry all the drama — set at up to 96px with line-height 1 and negative tracking, they stack into dense blocks rather than sitting on a line. Freight Sans below them is quiet and highly legible at 1.6 line-height. The mono is the system's connective tissue: it labels, times, numbers and categorises everything, always uppercase, always tracked open.

### Hierarchy

- **Display** (900, `clamp(3.5rem, 1.5rem + 8vw, 6rem)`, lh 1): Freight Big Pro. Page-defining hero headings, one per page at most.
- **Headline** (700, `clamp(2.75rem, 1.5rem + 5vw, 4.5rem)`, lh 1.05): Freight Display Pro. Section-opening editorial headings.
- **Title** (700, `clamp(2rem, 1.25rem + 3vw, 3rem)`, lh 1.1): the default editorial heading size.
- **Subtitle** (700, `clamp(1.5rem, 1rem + 1.5vw, 2rem)`, lh 1.2) and a **small** step (600, `clamp(1.25rem, 1rem + 1vw, 1.5rem)`, lh 1.3): card headings and sub-sections.
- **Body** (400, 1rem, lh 1.6): all prose. Reading column capped at 680px.
- **Body Large / Small** (400, 1.125rem lh 1.55 / 0.875rem lh 1.55): leads and captions.
- **Mono** (500, 0.875rem, lh 1.4): scores, dates, stat values, inline data.
- **Label** (500, 0.6875rem / 11px, lh 1, tracking 0.08em, uppercase): kickers, badges, pills, statuses, nav. The most-used non-body style in the system.

Navigation sits just outside the label token — uppercase mono, 600 weight, tracking 0.04em, scaling 11px → 13px → 14px across `xl` / `2xl`.

### Named Rules

**The Missing Italic Rule.** Freight Big Pro ships italic at 400 and 700 only — there is no 900 italic. So a Display-size heading with an accent word switches the `<em>` down to Freight Display Pro italic rather than faking a heavy italic. Never pin an accent `<em>` to `font-black`.

**The One Emphasis Rule.** An editorial heading gets exactly one emphasis moment: an accent-coloured italic word _or_ a highlighter stroke, never both, and never two accented words. Emphasis is authored as a Portable Text `accent` decorator, never as a separate "accent word" string field.

**The Terminal Period Rule.** Editorial headings are auto-terminated with a period unless they already end in `.`, `?` or `!`. The period is part of the voice — declarative, printed, finished.

**The No Middle Register Rule.** There is display serif and there is 11px mono. Resist inventing a 16px semibold sans "section label" — that is product-UI language and it flattens the contrast the system runs on.

## Layout

The body is a single centred column at one of exactly three widths, chosen by the page's role: **680px** for reading (articles, forms, legal), **1040px** for detail pages (the default), and **1280px** for card-grid indexes and landing pages. Every page routes through one container primitive; hand-rolled `mx-auto max-w-*` wrappers are drift.

Three things sit outside those widths and only three: global chrome (header and footer span 1440px, the only value above 1280); element sizing (a photo, a quote measure, a scaled diagram keeps its own max-width); and full-bleed bands (striped seams, hero backgrounds, coloured CTA bands) which span the viewport and are never wrapped in a container.

Horizontal gutters are 1rem on mobile, 2rem from `md` up. Vertical rhythm belongs to the consuming section, not the container. Card padding steps 0.75rem / 1.25rem / 2rem.

Breakpoints: 640 (`sm`), 768 (`md`), 960 (`desk`), 1024 (`lg`), 1280 (`xl`), 1536 (`2xl`). The 960 step is inherited and used sparingly.

The real usage scene is a phone held outdoors on the sideline. Layouts collapse to a single column early, tap targets stay generous, and nothing important hides behind hover.

### Named Rules

**The Three Widths Rule.** A content container may use 680, 1040 or 1280 and no other value. If a layout seems to need 900px, it needs one of the three.

**The Full-Bleed Never Wraps Rule.** Striped seams and coloured bands are viewport-wide by definition. Wrapping one in a max-width container is always a bug.

## Elevation & Depth

The system is **flat-graphic, not lifted**. Depth is drawn, not simulated: a hard offset rectangle of pure ink with zero blur radius, exactly as a print designer would fake a drop shadow with a second black box. There is no ambient light, no spread, no colour bleed.

Only three weights exist, plus a muted sibling for surfaces where black-on-black would vanish and an alert-tinted sibling for error fields.

### Shadow Vocabulary

- **Paper Small** (`box-shadow: 4px 4px 0 0 #0a0a0a`): the default. Buttons, badges, stamps, chrome.
- **Paper Medium** (`box-shadow: 6px 6px 0 0 #0a0a0a`): cards at rest — the most common card weight.
- **Paper Lift** (`box-shadow: 8px 8px 0 0 #0a0a0a`): the hover target of a tilt-mode card, and emphasis cards.
- **Paper Small Soft** (`box-shadow: 4px 4px 0 0 #6b6b6b`): the same offset in ink-muted, for anything sitting on an ink or dark-green surface where pure ink loses its silhouette. Also the resting shadow of every form field.
- **Paper Small Soft Hover** (`box-shadow: 3px 3px 0 0 #6b6b6b`): the 1px compression a form field makes on hover.
- **Paper Small Alert** / **Alert Hover** (`4px 4px 0 0 #e8d5cf` / `3px 3px 0 0 #e8d5cf`): error-state fields only, so the offset reads as part of the alert moment.

### Named Rules

**The No Blur Rule.** Every shadow in this system has a blur radius of `0`. A blurred shadow is from a different design language and does not belong here — no exceptions, including "just a subtle one".

**The Press-Down Rule.** Interactive paper does not rise on hover; it presses. The surface translates `+1px, +1px` (buttons and cards) or `+1px/+2px` (fields) and its shadow collapses to `none`, so it appears pushed flat against the page. The translate is gated behind `motion-safe:`; the shadow collapse is not, so reduced-motion users keep the affordance.

**The Complete Vocabulary Rule.** The seven tokens above are the entire shadow system — there is nothing else to reach for. The pre-redesign blurred family (`--shadow-sm`, `--shadow-DEFAULT`, `--shadow-md`, `--shadow-lg`, `--shadow-card-hover`, `--shadow-input`, `--shadow-input-focus`, `--shadow-soft`) and the orphaned asymmetric pair (`--shadow-photo-tape`, `--shadow-photo-tape-lift`) were removed from `globals.css`; all ten had zero consumers. Adding a blurred token back is a change to the design language, not a convenience.

## Shapes

**Everything rectangular is sharp.** Border radius is `0` on cards, buttons, inputs, selects, textareas, pills, badges, modals, images and bands. The only curve in the system is a true circle (`rounded-full`) for avatars, timeline bullets, spinner dots and score circles. There is no small-radius softening step, and there is no "just 2px" exception.

Borders are the primary structural device: a solid `2px` ink border defines nearly every surface, dropping to `1.5px` on stamps and `2px` at reduced opacity (`ink/30` → `ink/40` → `ink/60` → `ink`) to encode form-field state. Dividers on cream use paper-edge rather than ink.

The ornament vocabulary is physical: **tape strips** (small solid rectangles anchored half-over a card edge at −0.5° to +0.5°, or −5°/+4° for polaroid compositions), **stamps** (rotated ~2°, mono uppercase, bordered and shadowed), **perforations** (a masked half-disc column with a dashed tear guide, on ticket-stub alerts), **striped seams** (45° two-tone SVG bands used as full-bleed section rules), and **highlighter strokes** (a hand-drawn SVG marker that sweeps left-to-right on hover behind inline links and heading accents).

Photographs get a newsprint treatment: a warm-tint filter (`sepia(0.06) saturate(0.94) hue-rotate(-4deg) contrast(1.02) brightness(1.01)`) plus a 4%-opacity SVG turbulence grain in multiply. They stay in colour.

### Named Rules

**The Sharp Corner Rule.** If it is a rectangle, its radius is `0`. Circles are circles. There is nothing in between.

**The Sub-Degree Rule.** Grid card and tape rotations live in a −0.5° to +0.5° pool. Individual tilt should be barely perceptible; the effect is only that the grid stops being perfect. Steeper angles are reserved for explicitly named polaroid compositions.

## Components

### Buttons

- **Shape:** sharp (`0` radius), solid `2px` ink border, hard offset shadow at all times.
- **Primary:** jersey-deep fill, cream text, `4px 4px 0 0` ink shadow. Padding 0.75rem / 2rem at the default size (0.5/1.5 small, 1/2.5 large).
- **Inverted:** cream fill, ink text, muted-ink shadow — for placement on dark surfaces.
- **Secondary:** cream-soft fill, ink text. **Ghost:** transparent, ink text, `ink/5` hover wash.
- **Hover:** the canonical press-down — `translate(1px, 1px)` with the shadow collapsing to none over 300ms, and for primary that is the whole hover. Primary is the only variant with no hover fill: it used to brighten 110%, but a filter-based relight necessarily lands off-token (it pushed jersey-deep to `#00884d`), so #2395 removed it rather than mint a hover green.
- **Focus:** a 2px jersey-deep ring at 2px offset.
- **Disabled:** 50% opacity, `not-allowed` cursor, and every hover effect neutralised back to the resting surface so the button visibly does not react.
- An optional trailing `→` glyph translates 4px right on group hover.

### Cards / Containers

- **Corner Style:** sharp (`0`).
- **Background:** cream, cream-soft, ink, jersey or jersey-deep — the text colour flips with the surface.
- **Border:** solid `2px` ink on every variant. On an ink card the border merges into the fill and the shadow alone defines the silhouette — which is why ink cards must use the muted shadow.
- **Shadow Strategy:** Paper Medium at rest by default; see Elevation.
- **Internal Padding:** 0.75rem / 1.25rem / 2rem, or none for flush-edge media cards.
- **Rotation:** optional, from the sub-degree pool, applied as a CSS-variable transform so it composes with the press or tilt hover rather than fighting it.
- **Tape:** zero or more tape strips as children, so they translate with the card frame on press.

### Inputs / Fields

An eight-state machine shared identically by text input, select and textarea — the border weight encodes progress through the state, and the shadow encodes pressure.

- **Style:** white surface (the one white in the system — a field is a form you write on, not paper you print), sharp corners, `2px` border at `ink/30`, resting muted-ink offset shadow.
- **Hover:** border to `ink/40`, shadow compresses to `3px 3px`, surface nudges 1px.
- **Filled** (text present, not focused): border anchors at `ink/60`, resting shadow returns.
- **Focus:** border goes full ink, shadow snaps to none, surface presses 2px — the deepest press in the system.
- **Error:** border and shadow both switch to the alert pair; an `AlertBadge` renders below. Error survives focus.
- **Disabled:** `ink/15` border, cream-soft fill, 50% opacity, all motion frozen — deliberately still inside the paper vocabulary rather than shadowless.
- **Sizes:** 2rem / 2.5rem / 3rem tall with 0.75 / 1 / 1.25rem inline padding. Hints render in italic `ink/60` beneath.

### Chips / Labels

- **Mono Label:** the workhorse. Uppercase mono, 11px, tracking 0.08em, weight 500. Plain (inline, ink or cream) or as a solid pill in jersey, jersey-deep, ink or cream-soft.
- Pills are sharp-cornered with 0.5rem / 0.25rem padding. The jersey-deep pill uses pure white text, not cream. It was adopted when cream on the old `#008755` was the weaker pairing; on today's darker green full cream clears comfortably, so the white is inherited rather than required — reconciling it (and the handful of other white-on-jersey-deep surfaces) back to cream is an open consistency question, not a rule. Fractional cream, however, is never the answer here: see The Whole-Cream Rule.

### Navigation

- Uppercase mono, weight 600, tracking 0.04em, 11px scaling to 14px on wide viewports, no underline.
- Default ink; hover and active shift to jersey-deep, colour only, 150ms.
- The utility action carries a 1px ink border that recolours to jersey-deep on hover.
- **The nav is flat — no dropdowns.** Every top-level entry is a plain link. Mobile uses a full takeover drawer of the same flat list, not a squeezed menu.

#### The top-level bar is exempt from the ≤4 working-memory limit

A persistent nav is **scanned, not memorised**. The reader is not holding nine options in working memory and choosing between them; they are sweeping a fixed bar for the one word they already came for, and it sits in the same place on every page. The ≤4 ceiling governs a decision point — a set of options presented once, weighed against each other, then gone. The top-level bar is not one, so a count alone is not a finding against it.

Two constraints do bite, and they are the ones to measure against:

1. **One-line fit at `lg` (1024px)** with the longest realistic labels. This is a hard limit — the row must never wrap. Senior nav labels come from Sanity team names, so the desktop row bounds each entry itself (`max-w-[14ch] truncate`, exact because every nav label is mono) rather than trusting whatever an editor types. The bound lives at the desktop render site on purpose: the mobile drawer has no width constraint, and truncating the label string instead would chop the drawer too and put the ellipsis into the link's accessible name.
2. **Glance-scannability for any transient panel.** This is what the ≤4 rubric was reaching for, and it is the constraint to apply if a panel is ever proposed again — it governs panels, not the persistent bar.

Decided on [#2409](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2409), built by [#2415](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2415). The four dropdowns were **deleted rather than regrouped**, because each destination page already indexes its own children better than a transient panel can — `<ClubEditorialHub>` on `/club`, `<YouthDirectory>` on `/jeugd`, in-page section anchors on `/ploegen/[slug]`. `nav-reachability.test.ts` is the standing guard on that claim.

The footer is a second, intent-based organisation of the same site and is **not** required to mirror the nav. The rule binding them: **every top-level nav destination appears somewhere in the footer as that same href**; the footer may hold more. One alias is supported, and only one — a `/ploegen/<slug>` team entry is covered by the footer's `/ploegen` index, because a per-team footer link would grow with the roster. Anything else must match exactly: a general "same branch of the route tree" rule reads well but cannot fail where it matters, since `/club` would then count as covered by an unrelated `/club/*` CTA in another column. Enforced by `footerLinks.test.ts`.

### Stamp Badge

A rotated, content-bearing paper stamp that pins over the edge of a card — 14px above the parent, 36px in from its anchoring side, rotated ~2°. Uppercase mono 11px bold at 0.1em tracking, `1.5px` ink border, Paper Small shadow, in jersey-deep, ink or alert tone. Distinct from a tape strip: the stamp carries text, the tape is purely graphic.

### Striped Seam

A full-bleed 45° two-tone stripe band (12 / 18 / 24 / 28px tall) rendered as an SVG pattern, used as a section rule. Four pairs: ink-cream (default, high contrast), jersey-cream, jersey-tonal-dark, and cream-jersey-deep. The angle can flip so a top and bottom seam lean toward each other and "tape" a section shut.

## Do's and Don'ts

### Do:

- **Do** set every rectangle's border radius to `0` and reserve curves for true circles.
- **Do** use hard offset shadows with `0` blur, in exactly the seven documented tokens.
- **Do** press interactive surfaces into their shadow on hover (`translate(1px, 1px)` + `shadow-none`), gating only the translate behind `motion-safe:`.
- **Do** pick the right green: `jersey` decorative only, `jersey-deep` for anything carrying text (headings, CTAs, inline prose links), `jersey-bright` for green text on ink.
- **Do** reach for an existing primitive — taped card, ticket stub, mono label, editorial heading, tape strip, stamp badge, striped seam — before writing new markup.
- **Do** route every page through the three container widths (680 / 1040 / 1280).
- **Do** keep photographs in colour with the newsprint warm-tint; greyscale-to-colour-on-hover belongs to sponsor logos alone.
- **Do** author heading emphasis as a Portable Text `accent` decorator, one emphasis per heading.
- **Do** use Phosphor Fill icons from the single icon source.

### Don't:

- **Don't** introduce a blurred shadow, a gradient fill, or a glassmorphic surface — those are the SaaS anti-reference.
- **Don't** reintroduce a blurred shadow token. The pre-redesign family and the orphaned `--shadow-photo-tape*` pair were deleted from `globals.css`; re-adding one changes the design language.
- **Don't** put a radius on a loading skeleton. A skeleton must match the sharp shape of what it stands in for — 44 stray `rounded` / `rounded-sm` classes were removed from eight skeleton files for exactly this reason.
- **Don't** set `jersey` (`#4acf52`) as a text colour, and don't put it on cream.
- **Don't** wrap a striped seam or a coloured band in a max-width container.
- **Don't** invent a container width outside 680 / 1040 / 1280 (chrome's 1440 is header and footer only).
- **Don't** pin a Display-size heading's italic accent to a heavy weight — Freight Big Pro has no 900 italic.
- **Don't** add a new typeface. Freight Sans Pro, Freight Display Pro, Freight Big Pro and IBM Plex Mono are the whole set.
- **Don't** build a 16px semibold sans "section label" register between display serif and 11px mono.
- **Don't** reintroduce a neutral grey. `gray-100`, `foundation-gray-light` and the four `table-*` tokens have all been deleted; a section that needs to step down from the page gets `cream-soft`, not a grey.
- **Don't** rely on hover to reveal anything necessary — the primary usage scene is a phone, outdoors.
- **Don't** use emoji as icons.
