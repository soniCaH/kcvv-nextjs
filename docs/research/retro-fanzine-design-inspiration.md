# Retro-terrace fanzine — non-football design inspiration

> Primary-source research, 2026-08-13. Target: take the shipped "retro-terrace fanzine" direction from **good** to **state of the art** without breaking a single locked rule.
>
> **Scope:** deliberately **non-football**. Football club sites are covered by five sibling files in this directory (`clubs-professional.md`, `clubs-national-amateur.md`, `clubs-provincial-regional.md`, `clubs-international-benchmark.md`, `belgian-club-websites.md`). Nothing here duplicates them.
>
> **Method:** sites opened in a headless Chromium at 1440×900, screenshotted at three scroll depths, and fingerprinted for computed styles — background/foreground colours, font stacks, border radii, border weights, box-shadows, `mix-blend-mode` / `filter` / `background-blend-mode`, transforms, transitions, `@keyframes` names, and `:root` custom properties. Where a mechanism is stated below it was **read off the live CSS**, not guessed. Where it was not verifiable, it says so.

---

## 1. Executive summary — ten highest-leverage moves

Ranked by distinctiveness ÷ effort. Every one of these is compatible with sharp corners, press-down hover, our four typefaces, and the cream/jersey palette.

| #   | Move                                                                                                                                                                                                              | Effort | Where                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------- |
| 1   | **Hairline data-tables hung off headline right edges** — a 3-row mono mini-table pinned to the baseline of a display heading (source: Teenage Engineering). Turns every hero into a spec sheet.                    | S      | `EditorialHero`, match detail, team detail        |
| 2   | **A persistent thin "wire strip" under the header** — boxed numeral + live status + venue, hairline-bordered, one row tall (source: NTS Radio's channel bar).                                                      | M      | `SiteHeader`, match-day only                      |
| 3   | **Real riso misregistration on the crest / display headings** — 2-layer duplicate offset by 1–2px in a second ink, `mix-blend-mode: multiply`. Pure CSS, no images.                                                | S      | `Crest`, `EditorialHeading`, `StripedSeam`        |
| 4   | **Numbered index pages with leader dots** — `flex` + `border-bottom: 1px dotted` filler between label and value, the contents-page device from print. No new primitive.                                            | S      | `/ploegen`, `/kalender`, footer, article "in dit stuk" |
| 5   | **`::selection` in jersey-deep on cream** and a cream-on-ink flip inside dark bands — three lines of CSS, noticed by everyone who ever drags across text.                                                          | S      | global                                            |
| 6   | **Overprint duotone for photos instead of a warm-tint filter** — `background-blend-mode: multiply` of the photo against a jersey-deep→cream ramp, kept in colour by only tinting shadows.                          | M      | `TapedFigure`                                     |
| 7   | **Scroll-driven progress as a printed ruler**, not a bar — tick marks + a mono page number that counts up, via `animation-timeline: scroll()` (CSS-only, Chrome/Edge/Safari 26).                                   | M      | `/nieuws/[slug]`                                  |
| 8   | **Marquee only where it means "live"** — a single ticker reserved for match-day, never decorative, `motion-safe:` gated (source: NTS `@keyframes marquee`, Justseeds).                                             | M      | match day band                                    |
| 9   | **Oversized ghost numerals bled off the container edge** — section index numbers at display scale, `ink/6`, clipped by `overflow: hidden` (source: foundry specimen pages).                                        | S      | `SectionHeader`                                   |
| 10  | **"Continued on p.4" / "← back to the index" print-navigation footers** on every article and team page, set in mono with a rule above.                                                                             | S      | article + team page footers                       |

---

## 2. What our design already does well — baseline

Read from `apps/web/DESIGN.md`, `apps/web/src/app/globals.css` `@theme`, and the 50-odd primitives in `src/components/design-system/`.

**Genuinely strong, keep and build on:**

- **A committed, unfashionable palette.** One paper (`#f5f1e6`), one ink (`#0a0a0a`), one meaning-bearing green (`#007c46`), one warm (`#f0c264`), and aged status tones (`#b84a3a` / `#c68b2c` / `#d8e7d0`). No grey UI layer at all. This is more disciplined than most of the print-referencing sites surveyed here.
- **The shadow system is the best single idea in it.** Seven tokens, all `blur: 0`, plus the press-down inversion. Very few sites commit this hard — most that try a "hard shadow" still ship one blurred token somewhere.
- **A real type contrast.** Display serif at up to 96px against 11px tracked mono, with the middle register explicitly banned. That is a print decision, and it holds.
- **Ornament with a physical logic** — tape, stamps, perforations, striped seams, highlighter strokes. The sub-degree rotation pool is exactly right: the grid stops being perfect without becoming twee.
- **Restraint rules that are actually written down** — Rare Green, Two Greens, Whole Cream, No Grey UI, No Middle Register, 11px Floor. Named rules are why the system does not drift.

**Where the gap to "state of the art" sits, on the evidence of the references below:**

1. **Texture is present but timid.** One 4%-opacity turbulence grain and one 5%-alpha halftone. Real riso work reads because of *misregistration and overprint*, not grain. We have zero misregistration and zero overprint anywhere.
2. **Motion is undefined.** `DESIGN.md` has eight sections and none of them is Motion (confirmed in `docs/design/delight-wayfinder-map.md`). Tailwind's `--animate-*` namespace is unreset; 69 of 113 `animate-pulse` uses are unguarded. Every reference site below has a *motion opinion*; we have a press-down and four scattered sentences.
3. **Small delights are almost absent.** No page numbers, no leader dots, no index device, no margin notes, no `::selection` styling, no "continued on" device. This is the cheapest category to win and we score near zero.
4. **Photos are treated, not printed.** `--filter-photo-newsprint` is a subtle warm shift. Overprint duotone — where the ink literally sits *on* the image — is the print move we are not making.
5. **Dense-information layouts are conventional.** Fixtures, standings and the calendar are card grids and tables. The best print-derived sites make density itself the aesthetic (see Fonts In Use, Are.na, NTS).

---

## 3. Reference sites

> Batch 1 (deep read, live CSS verified). More below; this document is written incrementally.

### 3.1 NTS Radio — <https://www.nts.live/>

**What it is:** London community internet radio, two live channels, a schedule, thousands of archived shows.
**Why relevant:** the single best *dense-listing chrome* on the web, and it is entirely built from 1px hairlines and 12px uppercase type — no imagery, no rounding, no shadow. Our fixture lists, calendar and standings want exactly this vocabulary.

Extractable details (mechanism verified from computed styles):

1. **The live channel strip.** A one-row bar directly under the masthead: `LIVE NOW ●` then a **boxed numeral** `1`, a play triangle, the show title, and the city right-aligned; then channel `2` in the same shape. It is the single most identity-defining element on the site and it costs one row of height. Border `1px solid rgb(76,76,76)` — the site's dominant border (55 instances), never 2px, never a radius on the strip.
2. **Hairlines carry all structure.** Three border colours only: `#4c4c4c` (55×), `#666` (28×), `#999` (18×). No box-shadow does structural work anywhere. Compare our system, where a 2px ink border is the default — NTS proves a *second, thinner* rule weight is a whole extra layer of hierarchy we do not have.
3. **The type ramp is brutally small and uppercase.** Top computed steps: `12px/14px 700 uppercase` (55×), `16px/18px 700 uppercase` (39×), `12px/18px 400 uppercase` (38×), `14px/16px 700 uppercase` (27×), `11px/14px 400 uppercase` (14×). Note the **11px floor is theirs too** — we already match this instinct.
4. **`@keyframes flickerAnimation 2s infinite`** on the LIVE dot — three elements only. Motion is rationed to the one thing that is genuinely live. (Also present: `@keyframes marquee`, `slide-up-down`, `fadeInScrollDown`.)
5. **`filter: drop-shadow(rgba(0,0,0,.25) 0 0 6px)` on 54 elements** — used to lift white text off arbitrary artwork. Not for us (blur), but the *problem* it solves is ours too on `EditorialHero`.
6. Transition discipline: `opacity .1s linear` (96×), `background-color .1s linear` (74×). Everything interactive answers in 100ms.

**Lands on KCVV as:** a match-day wire strip; a 1px `paper-edge` hairline as a second border weight below our 2px ink; rationing looping motion to live state only.

---

### 3.2 Teenage Engineering — <https://teenage.engineering/>

**What it is:** Swedish synth/hardware manufacturer. The reference for technical-drawing-as-brand.
**Why relevant:** it is a *product manual* rendered as a website — exactly the register shift our "photocopied team sheet" mono labels are reaching for, executed at the highest level anywhere.

Extractable details:

1. **The spec table hung off the headline.** `DAILY LIFE OF MR. UPDATE` set in enormous condensed black type; flush to its right edge, a 3-row hairline-ruled mini-table — `EP–133 2.5 / EP–40 2.5 / EP–1320 1.5` — with the **numbers in the one spot colour (orange)** and the labels in black. The table is the same optical height as the last line of the headline and shares its baseline. Cheap, and it makes the page read as *documentation*.
2. **Spot colour is used only on values, never on labels.** Orange appears on version numbers and one `UPDATE` sticker. That is the same discipline as our Rare Green Rule, but applied at a finer grain than we apply it: *the number is the accent, not the noun*.
3. **The navigation is a row of hand-drawn glyph + word + sub-list groups**, not a row of links. Five columns, each an icon over a 2-level list, all at ~12px. A nav that reads as a parts diagram.
4. **Illustration carries everything; there is no photography above the fold.** Ink line-art at 1px, no fills, no gradients. This is directly relevant: our brief says no professional photographer, so *drawn* assets are the escape hatch, and TE proves they can carry a whole brand.
5. **A tear-off calendar sheet** — a rectangle with two punch holes and a curled bottom-left corner drawn as a filled triangle. A pure-CSS/SVG "physical object" that is not tape and not a stamp. Our ornament vocabulary has five objects; this is a sixth idea worth having.

**Lands on KCVV as:** a mono spec-table beside `EditorialHeading` on match and team pages (kickoff / venue / referee / competition); accent-on-the-number discipline in `NumberDisplay`; a drawn-object ornament to sit beside tape and stamps.

---

### 3.3 Risotto Studio — <https://risottostudio.com/>

**What it is:** Glasgow risograph print studio and stationery shop.
**Why relevant:** it is the actual medium our design is imitating, run by people who print it daily. Their **colour choices are ground truth for riso punch.**

Extractable details (colours read off computed backgrounds):

1. **The riso palette, observed:** fluoro pink `rgb(255,157,233)` = `#ff9de9`, bright red-orange `rgb(255,51,0)` = `#ff3300` (the dominant surface, 105 elements), green `rgb(0,103,62)` = **`#00673e` — within a hair of our `jersey-deep #007c46`**, cream `rgb(253,245,238)` = `#fdf5ee` (ours is `#f5f1e6`), blue `rgb(0,172,255)` = `#00acff`. So: our paper and our green are already correct riso inks. What we lack is their **fluoro**.
2. **Colour arrives as full-bleed flat blocks, never as tint or gradient.** The hero is literally half photograph, half `#ff9de9`, split on a vertical edge at the container line. Zero shadows do structural work (only two blurred shadows exist on the whole page, both from third-party widgets).
3. **Photography is in colour, warm, documentary, and sits *against* the flat block rather than inside a card** — the same instinct as our "photos stay in colour" rule.
4. **Type is two weights of one grotesk** (Moderat Bold 253×, Moderat Regular 139×) with uppercase at `16px/19.2px` for all UI labels. A tighter constraint than ours.

**Caveat:** their interactive shapes are `border-radius: 9999px` pills (22 instances). That part is not for us.

**Lands on KCVV as:** licence to introduce **one fluoro accent** as the "violent accent" our palette lacks — a fluoro pink or orange used *once per page at most*, on the thing that is genuinely urgent (a cancelled match, a live score). It would sit beside `--color-alert #b84a3a` as the loud sibling of the dusty brick.

---

### 3.4 Klim Type Foundry — <https://klim.co.nz/>

**What it is:** New Zealand type foundry, widely regarded as having the best specimen writing in the industry.
**Why relevant:** long-form editorial done by people whose entire product is type. Our article pages want what they have.

Extractable details:

1. **Breadcrumbs as solid label chips, not text.** Top-left: two black rectangles, `Klim Type Foundry` and `Fonts`, red text on black, sharp-cornered, sitting *on top of* the full-bleed image. A caption chip that survives any background — this is the answer to the drop-shadow problem NTS solves with a blur.
2. **A caption chip in the same style at the bottom-left of the image** (`American Grotesk Collection`) — so the image is bracketed by two identical chips, top and bottom. It reads like a plate caption in a printed catalogue.
3. **Full-bleed imagery with type set *behind* it**, so oversized text is half-occluded by the photo. Deliberate collage overlap rather than a stacking accident.
4. **Red is the only accent** and it appears only inside those black chips and on links.

**Lands on KCVV as:** replace any text-on-photo in `EditorialHero` with an ink label chip (we already have `MonoLabel` as a solid pill — this is the same object, just used as a caption anchor); bracket `TapedFigure` with a top chip and a bottom chip.

---

### 3.5 OH no Type Company — <https://ohnotype.co/>

**What it is:** James Edmondson's one-man type foundry (Obviously, Vulf Mono, Degular).
**Why relevant:** structurally the **closest match to our system found anywhere in this survey**, and it is not a football site, a magazine or a print shop — it is a shop selling fonts.

Extractable details:

1. **`156 × 2px solid rgb(0,0,0)` and nothing else.** No 1px, no 3px, no colour borders. Compare our "solid 2px ink border defines nearly every surface" — identical instinct, executed with more nerve because there is no second border weight to fall back on.
2. **Zero border-radius entries in the entire computed fingerprint.** Not one rounded thing on the page. Proof that sharp-only is a viable whole-site position, not a quirk.
3. **`162 elements at 12px / lh 16.8px / tracking 0.6px / uppercase`** — a single label style used 162 times, which is *more* uses than the body style (47). The site is mostly label. Ours is `11px / 0.08em` — same idea; we should be using it more, not less.
4. **`@keyframes ants`** — a marching-ants animated dashed border. This is the delight our system is missing: a border that *travels*. Mechanism (standard technique, not read from their source): animate `background-position` on a repeating-linear-gradient border image, or animate `stroke-dashoffset` on an SVG rect. Both are CSS-only and cheap.
5. **Square pagination markers**, not dots: a row of small outlined squares with the current one filled solid. Sharp-cornered pagination.
6. **Two-register nav**, exactly like ours: an italic serif primary list (`fonts / custom / drawer / sign in`) sitting above an uppercase 12px secondary list. Confirms our display-serif-plus-mono split is a foundry-grade choice, not a compromise.

**Lands on KCVV as:** marching-ants border for the "match in progress" state; square pagination in `HorizontalSlider` and gallery; permission to lean *harder* on `MonoLabel`.

---

### 3.6 Field Notes — <https://fieldnotesbrand.com/>

**What it is:** Chicago memo-book maker. Kraft covers, letterpress, "I'm not writing it down to remember it later."
**Why relevant:** a brand whose entire product is cheap printed paper, sold on the web without ever looking cheap. Closest commercial cousin to a fanzine.

Extractable details:

1. **Paper is a real bitmap, not a filter.** `background-image: url(.../kraft-bg.jpg)` — an actual scanned kraft texture tiled behind sections. Our `--pattern-paper-grain` is a 160×160 SVG turbulence at 4%; theirs is a photograph of card. Worth testing a single small tiling JPEG of real cream stock against our procedural noise.
2. **The palette is a paper-goods palette,** and it is close enough to ours to steal from directly: ink `#302e2a`, rust/red `#9c3e14`, kraft tan `#aea288`, olive `#5f6633`, bone `#e3ded5`. Their "rust" is the same family as our `alert #b84a3a`; their olive is a green we do not have and could not use (Rare Green Rule) — but as a *tape* colour it would be legal.
3. **Tracking is enormous on labels.** Computed steps include `12px / lh 42px / tracking 1.8px uppercase` (52×) and `14px / tracking 2.1px uppercase`. Note the **line-height 42px on a 12px label** — 3.5× leading. That is a label given a whole band of air to itself, which reads as letterpress. Our label token is `lh 1`; a "banded label" variant with heavy leading is a one-token addition.
4. **Badges rotated 18°** (`matrix(0.951057, 0.309017, …)`), much steeper than our sub-degree pool — but these are *stamps*, and our Sub-Degree Rule already exempts "explicitly named polaroid compositions". A `StampBadge` at 18° would be a legal, louder sibling.
5. **`@keyframes twinkle`** on a small ornament — a two-frame opacity flicker, the cheapest possible delight.

---

### 3.7 Justseeds Artists' Cooperative — <https://justseeds.org/>

**What it is:** a decentralised network of 30-odd political printmakers selling posters, patches and graphics packages.
**Why relevant:** actual protest print. Also, the closest thing to our situation — a *collective of named people* who need to be indexed.

Extractable details:

1. **Hairlines in the accent colour, not in ink.** `41 × 1px solid rgb(255,97,52)` — every chip, rule and box is drawn in the orange `#ff6134`, on a pale-pink `#feefea` tint band. This is a move we have never made: our rules are always ink or `paper-edge`. A section where the hairlines go **jersey-deep** would read as a different chapter of the same zine without adding a colour.
2. **The artist index is a wall of sharp-cornered outlined chips** — 40+ names, uppercase, 10px, four to a row, all identical, plus a `SEE ALL ARTISTS` chip in the same shape. Dense, flat, no hierarchy. This is the right answer for our staff/board/youth-coach listings, which currently want to be cards and should not be.
3. **Product metadata as a bare key–value stack** — `Size: 78.32 MB` / `Format: ZIP` set in the same serif as the title, no icons, no pills. Reads like a library catalogue card. Our match and player cards could drop to this.
4. **Century Schoolbook for everything** plus **Belgika** (an ultra-condensed display) for headers — a schoolbook serif is the "printed by a community group" voice; freight-display-pro can hit the same note.
5. `10px / lh 15px uppercase` used 48× — again the sub-11px uppercase floor.

---

### 3.8 Fonts In Use — <https://fontsinuse.com/>

**What it is:** an archive of typography in the wild — 20k+ entries, each tagged by typeface, industry, format and period.
**Why relevant:** the best **dense index** on the web. Our `/nieuws`, `/ploegen` and `/kalender` are all indexes pretending to be feature pages.

Extractable details:

1. **`348 elements at 10px / lh 11px`.** The site is built almost entirely from 10px type and it is completely readable, because everything is short and in a grid.
2. **A 45° corner ribbon** — `Staff Pick` set diagonally across the top-right corner of a card, `transform: matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)` = exactly `rotate(45deg)`, clipped by the card's `overflow: hidden`. Six instances on the page. Pure CSS, no image, and it is the only ornament they allow themselves.
3. **Typeface names are set in the typeface being named.** Under each image, the fonts used are listed *rendered in themselves*, separated by 1px hairlines. Self-demonstrating metadata. Our analogue: set a player's shirt number in the numeral style that appears on the actual shirt, or set a competition name in the register that competition uses.
4. **`59 × 1px solid rgb(240,240,240)` and `6 × 75px solid rgb(0,0,0)`** — a hairline for structure, and a *very* thick black border used once as a framing device. Two weights, 75× apart. Our 2px-everywhere could use one deliberate heavyweight frame.

---

### 3.9 Public Domain Review — <https://publicdomainreview.org/>

**What it is:** a journal of out-of-copyright curiosities — essays and image collections.
**Why relevant:** editorial long-form built on scanned print, with a colour palette that is *aged* rather than retro-styled.

Extractable details:

1. **Section headings flanked by rules on both sides** — `EDITOR'S PICKS`, `CONJECTURES`, `POPULAR POSTS` each sit centred with a horizontal rule running out to the column edge left and right. The classic newspaper device, and it costs a `flex` row with two `flex-1` `<hr>`s. We currently open sections with a kicker + heading and no rule at all.
2. **The palette is ink-navy, not black:** `#1d2731` (152 text elements), `#0b3c5d` blue, `#c3460e` orange, `#f7f5f4` off-white. Warm-neutral rather than pure ink. Instructive: they never use `#000`, exactly as we never use `#fff` as page.
3. **`10 × 3px solid rgb(29,39,49)`** — a 3px frame around collection images, so the image reads as a mounted plate.
4. **Alegreya (serif) + Open Sans, and a category breadcrumb in coloured caps above every title** (`IMAGES / Maps, Natural World`). A two-part kicker: type-of-thing, then subject tags. Ours is a single kicker; a `TYPE / TAGS` split is more informative at the same size.

**Offline sibling worth naming:** their essays lean on drop caps, marginal plate captions and figure numbers — devices we have one of (`DropCapParagraph`) and could have three of.

---

### 3.10 Letterform Archive — <https://letterformarchive.org/>

**What it is:** San Francisco archive of 100k+ items of graphic design, lettering and type.
**Why relevant:** it is a *physical archive* on the web, and it has solved "how do you make a catalogue feel like an institution".

Extractable details:

1. **One violent accent on a black-and-white base:** `rgb(255,25,25)` = `#ff1919`, used on 10 backgrounds and 18 text runs and nowhere else. That is a red with no brown in it — the opposite of our dusty `#b84a3a`. The lesson is not the hue, it is the **ratio**: 28 uses of the accent against 289 black/white text runs.
2. **`36px / lh 38px / weight 900` headings** — negative-ish leading on a heavy sans, stacked tight. Our display steps run `lh 1` at the top, which is the same instinct.
3. **`filter: brightness(0) grayscale(1)`** to force partner logos to flat black. That is exactly the mechanism we should be using for the greyscale-to-colour sponsor treatment if we are not already — `brightness(0)` collapses a logo to a silhouette, which is stronger than `grayscale(1)` alone.

---

### 3.11 Are.na — <https://www.are.na/>

**What it is:** a research/bookmarking tool with a cult following among designers.
**Why relevant:** dense, hairline-only, deliberately unstyled — and it uses `mix-blend-mode` in production.

Extractable details:

1. **`mix-blend-mode: screen` on 12 elements** — used so overlapping thumbnails read through each other. This is the blend-mode family we would use for overprint (though `multiply` is the print-correct one on light paper).
2. **`64 × 1px solid rgba(0,0,0,0)`** — transparent 1px borders reserved on every interactive element so that a hover can colour them in **without shifting layout by a pixel**. A small engineering discipline worth copying wherever our hover adds a border.
3. **Base type is `12.5px`**, headings `19.2px`. The whole product runs in a two-step ramp.
4. **`transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)`** — an ease-out-quart. Ours is `cubic-bezier(0.2, 0.8, 0.2, 1)` for `--motion-base`, which is the same family.

---

### 3.12 Klim Type Foundry — <https://klim.co.nz/> (mechanism note)

Two mechanisms worth recording beyond §3.4:

1. **A fully fluid type ramp computed off a design width.** `--viewportBasis: 1680`, then `--fontSizeFluid7: calc(64 / var(--viewportBasis) * 100vw)` for fourteen steps, with a parallel `--fontSizeFixed*` set. Our ramp uses `clamp()` per step, which is better (it has floors and ceilings) — but their *pairing* of a fluid and a fixed ramp under matching names is a clean way to have "this heading scales" and "this label never does" without inventing two vocabularies.
2. **The black chips are a named token**: `--lozengeColor` / `--lozengeBackgroundColor`. They treat the caption chip as a first-class primitive, not a utility class. Ours is `MonoLabel` — same object, but we do not use it as an image caption anchor anywhere.

---

### 3.13 Teenage Engineering — <https://teenage.engineering/> (mechanism note)

**`filter: url(#luminosity-invert)`** — an inline SVG filter applied to fixed chrome so it inverts against whatever scrolls beneath it. That is how their header survives crossing a black band without a background plate. Sketch of the mechanism:

```html
<svg width="0" height="0" aria-hidden="true">
  <filter id="luminosity-invert" color-interpolation-filters="sRGB">
    <feColorMatrix
      type="matrix"
      values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" />
  </filter>
</svg>
```

```css
.site-header--inverting {
  filter: url(#luminosity-invert);
  /* falls back to no-op where unsupported */
}
```

Relevant to us because our header currently sits on cream and our `StripedSeam` / jersey-deep bands scroll under it. A **`mix-blend-mode: difference`** header is the cheaper cousin and needs no SVG:

```css
.site-header {
  mix-blend-mode: difference;
  color: #f5f1e6; /* renders ink on cream, cream on ink */
}
```

Risk: `difference` on our exact cream/green pair produces a magenta, so it would need testing against `--color-jersey-deep` before adoption.

---

### 3.14 The Pudding — <https://pudding.cool/>

**What it is:** a visual-essay publication (data journalism).
**Why relevant:** the reference for scroll-driven storytelling and dense data made friendly.

Extractable details:

1. **Atlas Typewriter (a mono) is the most-used face on the page** — 74 elements, ahead of their grotesk (55). A mono-forward publication. Our mono is IBM Plex; we use it as connective tissue but not as a *primary* voice anywhere.
2. **`27 × 1px solid rgb(38,38,38)` hairlines** and only four blurred shadows on the page.
3. **Card rotations of exactly ±2°** (`matrix(0.999391, ±0.0348995, …)`). Note: **±2°, not sub-degree.** Our pool is −0.5° to +0.5°. Theirs is visible and it works because the cards are small and isolated. Not a reason to change our rule, but a data point that ±2° is not automatically seasick.
4. **A per-story accent colour** — each story card gets one saturated colour from a fixed set (`#fbcd51`, `#f693ff`, `#e68f33`, `#4c82b8`, `#b51670`, `#41b8be`). One violent colour per *item*, none on the chrome. That is a legal pattern for us if the colour set is restricted to our existing status tones.
5. `14px / lh 19.6px uppercase` is their label step — 54 uses.

---

### 3.15 Stripe Press — <https://press.stripe.com/>

**What it is:** Stripe's book imprint.
**Why relevant:** the best "physical object rendered in a browser" on the web, and it does it with blend modes rather than 3D.

Extractable details:

1. **`mix-blend-mode: lighten` (13×) and `filter: invert(1)` (13×)** — how a book cover's foil and ink react as you hover. Both are cheap, GPU-friendly, and neither is a shadow.
2. **One serif family at three optical sizes** — Ivar Text (1077 uses), Ivar Display (222), Ivar Headline (104). A *single* family carrying display, headline and body via optical sizes. We do the same across Freight Big / Display / Sans, which is the same idea with a sans in the body slot.
3. **Body copy at `17px / lh 25.5px / weight 500`** — note weight **500 for body**, not 400. A half-step of weight is what makes a serif hold on a dark ground. Our body is 400 on cream, which is correct; but inside our **ink and jersey-deep bands**, a 500 step would help and we do not currently make one.
4. **A deep near-black with colour in it: `#201819`** (warm aubergine-black) rather than `#000`. Ours is `#0a0a0a` — neutral. A *warm* ink would sit better on cream and is a one-token experiment.

---

### 3.16 Dinamo — <https://abcdinamo.com/>

**What it is:** Basel/Berlin type foundry, famous for interactive specimen tools.
**Why relevant:** the motion vocabulary is the most disciplined in this survey.

Extractable details:

1. **Two easing curves carry the whole site.** `cubic-bezier(0.55, 0.08, 0, 1)` on 128 elements (an in-out with a hard, late finish) and `cubic-bezier(0.1, 0.6, 0.4, 1)` on ~114 (a gentle out). Durations are almost always `0.25s`. That is the entire motion system. **We have no such document** — see the gap note in §2.
2. **Sub-degree rotation is theirs too:** `matrix(0.99998, 0.00628314, …)` = `rotate(0.36deg)`, 27 elements. Independent confirmation that our Sub-Degree Rule is a real professional technique, not a quirk.
3. A second, loud tier at `rotate(-33deg)` for stickers — again, sub-degree for the grid, steep for the stamp.
4. Yellow `#fff837` as the single loud surface against black-on-white.

---

### 3.17 Interference Archive — <https://interferencearchive.org/>

**What it is:** a Brooklyn volunteer-run archive of social-movement material — posters, flyers, zines, badges.
**Why relevant:** the single closest *spiritual* match in this survey. A volunteer organisation, no budget, no photographer, and it looks like the thing it archives.

Extractable details:

1. **Coloured copy-paper bands.** Full-bleed section backgrounds in cheap-photocopier tints: pale yellow `rgb(255,239,183)` = `#ffefb7` (9×), peach `rgb(253,184,152)` = `#fdb898`, saffron `#ffca0f`, cyan `#08b1bc`. Black type sits directly on all of them. This is the band vocabulary our system does not have: today a section is cream, cream-soft, ink, or jersey-deep. A **fourth kind of band — coloured copy stock —** would give the page chapters without touching the Rare Green Rule.
2. **Courier as the metadata voice.** `Saturday, August 15, 2026 @ 7:00 PM` set in Courier, while the headline and body are in a neutral sans. A typewriter face for dates, times and categories. We already do this with IBM Plex Mono; the lesson is *how much* they run it — 73 elements.
3. **`25 × 2px solid rgb(0,0,0)` and a hard offset shadow on buttons.** Their `MORE` button is a pale-yellow rectangle with a 2px black border and a visible hard offset shadow — i.e. **they independently invented our button**. Confirmation the idiom is right.
4. **Category breadcrumb as slash-separated underlined caps** — `EVENTS / PANEL/DISCUSSION / WORKING GROUPS / EXHIBITIONS` above the title. Multiple taxonomies, one line, no pills.
5. **`letter-spacing: 0.8px` on body text**, not just labels. Slightly open tracking across the whole page is what makes it read as photocopied rather than digital. Ours is `normal` on body.
6. **`[x]` in square brackets as the close affordance** on the donation banner — a typewriter's answer to an icon.

---

### 3.18 Standards Manual — <https://standardsmanual.com/>

**What it is:** the publisher that reissued the 1970 NYCTA Graphics Standards Manual, the NASA Graphics Standards Manual, and similar. Transit wayfinding, literally.
**Why relevant:** the "unexpected category" the brief asked for, and its chrome is a masterclass in a **context bar**.

Extractable details:

1. **A sticky sub-header context bar.** A single hairline row under the nav: `● Pre-order` (a filled dot in the accent, left), the product title on two tight lines (centre), and `add to cart +` as a solid accent button (right). One row, three zones, `1px solid rgb(255,49,0)`. Directly transferable to `/wedstrijd/[matchId]` — `● LIVE` / competition + kickoff / `Voeg toe aan agenda +`.
2. **One accent and it is a safety colour:** `rgb(255,49,0)` = `#ff3100`, on 13 backgrounds and 10 borders, against pure black. A transit-signage red-orange.
3. **`letter-spacing: -0.224px` on every heading step** — a consistent negative tracking expressed in px, not em, so it does not scale with size. (Ours is `-0.025em`, which does scale — arguably the better choice, but worth knowing they chose the opposite.)
4. **Two faces: NYCTA (a Helvetica derivative) and Pitch (a mono).** Display sans + mono, no serif. The inverse of our split, same two-register logic.
5. Nav items are preceded by a small `▸` triangle — a wayfinding marker rather than a bullet.

---

### 3.19 Velvetyne Type Foundry — <https://velvetyne.fr/>

**What it is:** a French libre/open-source type foundry.
**Why relevant:** the most extreme constraint in this survey, and it proves how far one size and one face can go.

Extractable details:

1. **307 of 316 text elements are at exactly `23px / lh 32.2px`.** One size. No ramp. Hierarchy comes entirely from position, colour and hover — not scale.
2. **`348 elements share `transition: background 0.4s ease-out`.** The entire interaction model is "the background of the thing under your cursor fills in". No transforms, no shadows, no fades. It is a *single* interaction repeated everywhere, which is why the site feels coherent.
3. **One tracked outlier:** a label at `18.4px` with `letter-spacing: 28.8px` — that is **1.56em**, a spacing so wide the word becomes a rule. A legal, dramatic device with our mono.
4. Body `#efefef`, ink `#000`, one purple `rgb(108,40,104)`.

**Lands on KCVV as:** an argument that our press-down could be *joined* by a single alternate — a background-fill hover for text-only lists (nav, index, fixture rows) where translating a whole row is too much. One extra interaction, applied everywhere it applies.

---

### 3.20 Numero Group — <https://www.numerogroup.com/>

**What it is:** a Chicago reissue record label — obsessive archival compilations, each with a catalogue number.
**Why relevant:** catalogue-number-driven design, and the heaviest mono usage found anywhere.

Extractable details:

1. **`Roboto Mono` on 389 elements** — nearly as many as their body sans (405). Notably `241 elements at 12px / lh 21.6px / tracking 0.48px / weight 500 / uppercase`: a mono label with **1.8× leading**. Again the "label with air" pattern seen at Field Notes.
2. **`87 × 11px / lh 13px / tracking 0.44px uppercase`** — an 11px mono micro-label at 0.04em. Almost exactly our `text-label` token (11px, 0.08em). We are in the right place; they simply use it four times as often.
3. **`68 × 1px solid rgb(0,0,0)`** hairlines and one `1px dashed rgb(255,255,255)` — a **dashed** rule used once, as a tear-guide. We have exactly one dashed line in the system (the ticket-stub tear guide). Using dashed as "this is separable/optional" is a consistent semantic worth formalising.
4. `bryant-web-condensed` for headlines — a condensed face for dense catalogue titles. We have no condensed face and cannot add one; the substitute is Freight Display Pro at tight tracking with `text-wrap: balance`.

---

### 3.21 The Lot Radio — <https://www.thelotradio.com/>

**What it is:** a Brooklyn radio station broadcasting from a shipping container in a vacant lot.
**Why relevant:** it is a live-event site for a tiny organisation, and the way it signals "on air" is the best answer to our match-day problem.

Extractable details:

1. **A marquee band framing the video, top and bottom.** Bold italic caps repeating one word, scrolling. It is loud, it is unmistakably "live", and it exists only because there is a live stream. When nothing is on, the band is gone.
2. **A transport strip above it**: pause `II`, volume, a violet chip `THE LOT LIVE`, and `● RESTREAM` with a status dot. Chips + dot + label, one row.
3. **Display type at `220px / line-height 160.6px / tracking -8.8px` uppercase** — line-height **0.73**, i.e. genuinely negative leading, so stacked lines interlock. Our top display step is `lh 1`; going below 1 on a two-line hero is a free step of drama.
4. **Stickers rotated hard** — `matrix(0.62, 0.78, …)` ≈ 51°, `matrix(0.90, 0.43, …)` ≈ 25°. A studio wall covered in stickers as the actual brand asset.
5. `111 elements at 12px/14px uppercase` mono. `@keyframes pulse 2s infinite` on two elements only.

**Lands on KCVV as:** the match-day marquee, existing only on match day; and negative leading on the two-line hero.

---

### 3.22 Future Fonts — <https://www.futurefonts.xyz/>

**What it is:** a marketplace selling typefaces *in progress*, at version numbers, cheaper the earlier you buy.
**Why relevant:** an entire visual identity built on **version numbers as the ornament**. Also: mono-only.

Extractable details:

1. **All 167 text elements are in one mono (`VCTR Mono Web`).** A commercial site that never leaves the mono. Confirms our mono can carry more than labels.
2. **`filter: grayscale(1)` → colour on hover on 7 elements**, with `transition: filter 0.1s ease-in`. That is precisely our sponsor-logo treatment, and the 100ms duration is worth matching (ours is unspecified).
3. **`27 × 1px solid rgb(51,51,51)`** hairline boxes; blue `#1d49ff` as the single accent.
4. `@keyframes image-loading-animation` / `image-loaded-animation` — a **named pair** for the load transition of every image. Our loading story is `animate-pulse`, 69 instances of which are unguarded for reduced motion.

---

### 3.23 Cooper Hewitt Collection — <https://collection.cooperhewitt.org/>

**What it is:** the Smithsonian design museum's collection browser — 200k+ objects.
**Why relevant:** an archive browser at scale; one genuinely clever CSS mechanism.

Extractable detail — **the gradient-drawn underline**, used on 77 + 49 + 4 elements:

```css
.underlined {
  background-image: linear-gradient(
    rgb(0 0 0 / 0) 0px,
    rgb(0 0 0 / 0) calc(100% - 1px),
    var(--rule-colour) calc(100% - 1px),
    var(--rule-colour) 100%
  );
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
```

A 1px rule painted as a background layer rather than a `border-bottom` or `text-decoration`. Why it matters: it can be animated (`background-size: 0% 100%` → `100% 100%` for a wipe-in underline), it can be positioned off the baseline, and it never affects layout. Their accent is `#ffcd00` on `#101820`.

**Lands on KCVV as:** the underline mechanism behind `EditorialLink` / `HighlighterStroke` — a wipe-in rule is one property animation, no SVG, and it composites cheaply.

**Caveat:** their cards are `border-radius: 12px` on 390 elements. Not for us.

---

### 3.24 Horst — <https://www.horst.be/>

**What it is:** a Belgian arts-and-music festival on a former military domain in Vilvoorde — about 15 km from Elewijt.
**Why relevant:** a Belgian cultural organisation on a cream page with black ink, and the most complete **page-transition vocabulary** in this survey.

Extractable details:

1. **Cream and ink, Belgian.** Body `rgb(252,249,245)` = `#fcf9f5`, text `rgb(25,25,25)` = `#191919`. Ours is `#f5f1e6` / `#0a0a0a` — warmer paper, harder ink. Theirs is the same decision made two shades cooler.
2. **A named page-transition keyframe set:** `page-fade-in-up`, `page-slide-reveal-across`, `page-slide-reveal-down`, `paint-across`, `paint-across-small`, `rise-up`, `zoom-fade`, plus matching `-out` variants for every one. Twenty-five keyframes, all paired. This is what a Motion section looks like when it exists.
3. **`paint-across`** in particular — a wipe that reads as a brush or a squeegee pulling across. For a print-referencing site, a **squeegee wipe is the correct page transition**: it is literally how ink gets onto paper in screen printing.
4. `letter-spacing: 2.56px` on `12.8px` uppercase = **0.2em**, far wider than our 0.08em label.

---

### 3.25 The Gentlewoman — <https://www.thegentlewoman.co.uk/>

**What it is:** a biannual women's magazine with a famously severe visual identity.
**Why relevant:** the discipline of one face, 2px rules and two loud accents — structurally our system with different ingredients.

Extractable details:

1. **One typeface (Futura) for all 70 text elements**, at `80px / lh 105px` for the masthead down to `14px` for captions.
2. **`7 × 2px solid rgb(0,0,0)`** plus **`2px solid rgb(43,219,207)`** and **`2px solid rgb(255,54,35)`** — the *same* 2px rule redrawn in each accent, one instance each. A rule weight held constant while its colour marks the section. Cheap, and we do not do it.
3. **`mix-blend-mode: difference`** on one element (the logo over imagery) — the no-SVG version of Teenage Engineering's inverting chrome, applied to exactly one thing.
4. Accents `#2bdbcf` (cyan) and `#ff3623` (red) — two, used sparingly, never together.

---

### 3.26 Truelove Seeds — <https://trueloveseeds.com/>

**What it is:** a small Pennsylvania farm selling culturally-important seed varieties, grown by a network of named growers.
**Why relevant:** the seed-catalogue category the brief asked for, and a structure identical to ours (a small organisation indexing named people and their produce).

Extractable details:

1. **A seed-packet palette**, all observed: wheat `rgb(228,213,141)` = `#e4d58d`, pale yellow `#ffeea2`, pale blue `#b4e1f9`, teal `#61a2b6`, and one hot red `#e70b40`. Soft tinted grounds with a single hot accent — the same architecture as our cream + status tones, but the tints are *saturated pastels* rather than desaturated ones.
2. **Every product is attributed to a named grower**, with the grower's name treated as important as the variety. Our player/team pages have exactly this shape and under-use it.
3. `64 elements at 22.5px / lh 22px / weight 700 / uppercase` — a condensed-feeling display step with line-height **below** 1.

---

### 3.27 New Yorker — Goings On About Town — <https://www.newyorker.com/goings-on-about-town>

**What it is:** the magazine's weekly listings section — theatre, movies, music, art, for one city, for one week.
**Why relevant:** the canonical printed listings page, and the closest published analogue to `/kalender`.

Extractable details:

1. **`242 × 1px solid rgb(229,229,229)`** — every entry separated by a hairline, nothing else. No cards, no shadows (one on the whole page), no fills.
2. **`445 of ~700 text elements are at 12px / lh 19.6px`.** A listings page runs at 12px and it is fine, because each entry is three lines.
3. The house display face (`IrvinHeadingPro`, the Rea Irvin lettering) appears **21 times on the whole page** — the identity face is rationed to headings only, everything else is a neutral sans. Same discipline as our display-serif ration.

---

### 3.28 Present & Correct — <https://www.presentandcorrect.com/>

**What it is:** a London shop selling office and stationery objects, old and new, photographed obsessively.
**Why relevant:** proof that a print-object shop can be *quiet*, and one detail worth stealing.

Extractable details:

1. **`5 × 3px solid rgb(17,17,17)`** — a heavy 3px frame around hero imagery on an otherwise borderless page. One heavyweight frame, used five times.
2. **`transition: text-decoration-thickness 0.1s ease` and `transition: text-decoration 0.1s ease`** — links thicken their underline on hover rather than changing colour. A typographic hover, no layout shift, three lines of CSS.
3. `26 × 12px / lh 15.6px / tracking 0.4px uppercase` labels, everything else `18px/23.4px`. A two-step ramp.

---

### 3.29 Also surveyed (not deep-read)

Opened and fingerprinted or reviewed, but not written up because they either duplicated a keeper above or offered nothing legal for us. Listed so the survey breadth is auditable:

Type foundries and specimens — <https://www.colophon-foundry.org/>, <https://pangrampangram.com/>, <https://lineto.com/>, <https://grillitype.com/>, <https://sharptype.co/>.
Archives, museums, collections — <https://wellcomecollection.org/collections>, <https://www.artic.edu/collection>, <https://oa.letterformarchive.org/>, <https://designreviewed.com/>, <https://www.somersethouse.org.uk/>, <https://www.designmuseumgent.be/>.
Radio, music, film — <https://refugeworldwide.com/>, <https://mubi.com/>, <https://www.nts.live/schedule>.
Food, drink, farm, brewery — <https://www.cantillon.be/>, <https://burialbeer.com/>, <https://www.dishoom.com/>, <https://www.floretflowers.com/>.
Shops and makers — <https://www.hoxtonminipress.com/>, <https://www.snowpeak.com/>, <https://www.palaceskateboards.com/>, <https://www.numerogroup.com/>.
Culture and community — <https://thecreativeindependent.com/>, <https://www.leguesswho.com/>, <https://www.horst.be/>, <https://lichess.org/>.
Offline print references — Letterform Archive's physical holdings, the NYCTA Graphics Standards Manual (1970, Unimark), Design Reviewed's scan library, Public Domain Review's plate reproductions, and mid-century seed catalogues (Burpee, Vilmorin). Each is **offline**; the concrete web mechanisms they suggest are folded into §4 rather than credited to a URL.

---

## 4. Idea catalogue by category

Effort: **S** ≈ under a day inside one primitive · **M** ≈ a few days, touches 2–5 files · **L** ≈ a design decision plus a build.

### 4.1 Texture and print artefacts

| # | Idea | Source | How it lands on KCVV | Effort | Risk |
| - | ---- | ------ | -------------------- | ------ | ---- |
| T1 | **Misregistration.** Duplicate an element in a second ink, offset 1–2px, `mix-blend-mode: multiply`. This is the single artefact that reads as "riso" to anyone who has seen riso, and we have none of it. | Risotto (medium), riso practice | `Crest`, `EditorialHeading` display step, `StripedSeam`. Offset the green layer, keep the ink layer crisp. | S | `mix-blend-mode` promotes a compositing layer; keep it off long scrolling lists. Reads as a bug above ~2px. |
| T2 | **Overprint duotone on photographs.** Instead of tinting with `filter`, blend the image against a jersey-deep→cream ramp with `background-blend-mode: multiply`, so shadows go green and highlights stay paper. Photo stays in colour. | Stripe Press (`mix-blend-mode: lighten`), riso practice | `TapedFigure`, as an opt-in `data-print="overprint"` alongside the existing warm tint. | M | Must not become greyscale — locked rule. Test on skin tones. |
| T3 | **Real paper, not procedural noise.** A single small tiled JPEG/WebP of scanned cream stock behind the page, replacing or layering under `--pattern-paper-grain`. | Field Notes (`kraft-bg.jpg`) | `body` background, one asset, `background-repeat: repeat`. | S | Weight — must be a small tile (≤20 KB) or it costs more than it gives. Keep the SVG turbulence as the fallback. |
| T4 | **Ink bleed on the seam.** Feed `StripedSeam`'s SVG through a small `feTurbulence` + `feDisplacementMap` so the stripe edges wobble like ink into fibre. | riso/screenprint practice | `StripedSeam` only — one SVG, all four pairs inherit it. | S | SVG filters are rasterised; keep `baseFrequency` low and the seam short. |
| T5 | **Photocopy degradation on the crest.** A high-contrast threshold pass (`feColorMatrix` + `feComponentTransfer`) on a *duplicate* crest used only at large decorative sizes, so the big crest looks third-generation photocopied while the header crest stays clean. | Interference Archive, zine practice | A `Crest` variant, hero use only. | M | Legibility — never on the small header instance. |
| T6 | **Coloured copy-paper bands.** A fourth band type beside cream / cream-soft / ink / jersey-deep: a saturated-pastel ground in one of our aged status tones (`warning-soft #ecddb8`, `alert-soft #e8d5cf`, `success-soft #d8e7d0`) with plain ink type on it. | Interference Archive (`#ffefb7`, `#fdb898`), Truelove Seeds | `SectionBg` gains a `paper-tint` option. Gives the page chapters without spending green. | M | Brushes the No-Grey-UI spirit — these must be *tints*, never neutrals. One per page maximum. |
| T7 | **Deckle / torn edge.** A CSS `mask-image` with a hand-drawn torn SVG on the bottom edge of one band per page, so the section looks torn from a sheet. | zine practice | `SectionTransition`. | M | Masks + full-bleed can seam badly at fractional device pixel ratios. |

### 4.2 Motion

The prerequisite: **write a Motion section into `DESIGN.md`**, and reset Tailwind's `--animate-*` namespace in `@theme` the way `--text-*` was reset in #2417. Everything below assumes that lands first.

| # | Idea | Source | How it lands | Effort | Risk |
| - | ---- | ------ | ------------ | ------ | ---- |
| M1 | **Two easing curves and three durations, written down.** Dinamo runs on `cubic-bezier(0.55,0.08,0,1)` + `cubic-bezier(0.1,0.6,0.4,1)` at 0.25s. We already have `--motion-fast/base/tape`; the gap is a rule saying which is used when. | Dinamo, Are.na | `DESIGN.md` Motion section + the existing tokens. | S | None. Cheap. |
| M2 | **Marching ants on a live border.** `stroke-dasharray` + animated `stroke-dashoffset` on an SVG rect, or an animated `background-position` on a repeating-linear-gradient border. | OH no (`@keyframes ants`) | The "match in progress" state on a fixture card; the currently-open filter tab. `motion-safe:` gated; static dashes when reduced. | S | Looping motion — must be reserved for genuinely live state, per NTS's discipline. |
| M3 | **A live marquee that only exists on match day.** Bold italic display caps, one phrase, scrolling; absent every other day. CSS-only via `@keyframes` on `transform: translateX`, duplicated content for seamless loop. | The Lot Radio, NTS `@keyframes marquee` | A full-bleed band under `SiteHeader`, match day only. | M | Reduced motion must show a static band, not nothing. Temporal correctness needs an hour-by-hour table before build. |
| M4 | **Squeegee wipe as the page/section reveal.** A `clip-path: inset()` or `background-size` wipe left-to-right, 240ms, on section entry — the ink-onto-paper gesture. | Horst (`paint-across`) | `SectionStack` / `SectionTransition`, `motion-safe:` only, via `IntersectionObserver` or `animation-timeline: view()`. | M | Scroll-driven animation support varies; must degrade to "already visible". |
| M5 | **Wipe-in underline on links.** Animate `background-size: 0% 100%` → `100% 100%` on a gradient-drawn rule. | Cooper Hewitt | Merge into `HighlighterStroke` / `EditorialLink` — replaces the SVG stroke with one animated property. | S | Keep the existing SVG stroke for heading accents; this is for inline links. |
| M6 | **Thickening underline on hover.** `transition: text-decoration-thickness 0.1s ease`. Zero layout cost, purely typographic. | Present & Correct | Every inline link that is not already a `HighlighterStroke`. | S | None. |
| M7 | **A single alternate hover for text rows: background fill.** For nav, index rows and fixture lists where translating the whole row is too heavy. `transition: background 0.4s ease-out`. | Velvetyne (348 elements) | A documented second interaction beside press-down, scoped to list rows. | S | Must be *documented as scoped*, or it will erode the press-down. |
| M8 | **Scroll progress as a printed ruler.** Tick marks along the reading column plus a mono counter, driven by `animation-timeline: scroll(root block)` — no JS. | print/measurement convention | `/nieuws/[slug]`. | M | `animation-timeline` is Chromium + Safari 26; needs `@supports` and a no-op fallback. |
| M9 | **Named image load pair.** `image-loading` / `image-loaded` keyframes replacing `animate-pulse`, and **fixing the 69 unguarded `animate-pulse` uses** while we are in there. | Future Fonts | Every `loading.tsx` and skeleton. | M | This is an accessibility defect fix, not a nicety. |
| M10 | **A two-frame flicker on the live dot only.** `@keyframes` opacity 1 → 0.25, 2s, on at most three elements site-wide. | NTS (`flickerAnimation`), Field Notes (`twinkle`) | The `● LIVE` dot. | S | Reserve it; a flicker anywhere else cheapens it. |

### 4.3 Colour

| # | Idea | Source | How it lands | Effort | Risk |
| - | ---- | ------ | ------------ | ------ | ---- |
| C1 | **One fluoro accent, rationed harder than green.** Riso's punch comes from a fluorescent ink used once per sheet. Candidates observed: `#ff3300` (Risotto), `#ff3100` (Standards Manual), `#ff1919` (Letterform), `#ff9de9` (Risotto fluoro pink). | Risotto, Standards Manual, Letterform | A `--color-fluoro` token used **at most once per page**, on the genuinely urgent thing (cancelled match, live score, an alert stamp). Sits beside `alert #b84a3a` as its loud sibling. | M | This is a palette change and needs a decision, not a PR. Must not become a second brand colour. |
| C2 | **Hairlines in the accent, not in ink.** A section whose rules, chips and dividers are all drawn `1px` in `jersey-deep` instead of `paper-edge`. | Justseeds (41 × `1px solid #ff6134`) | One section type — e.g. the sponsors index or the youth directory. | S | Brushes the Rare Green Rule: green as *structure* is arguably a wash. Needs a ruling; the honest read is that 1px hairlines are not a surface. |
| C3 | **A second, thinner rule weight.** Our border is 2px everywhere. NTS, Numero, Fonts In Use and The New Yorker all run structure on 1px and reserve heavier weights for framing. | NTS, New Yorker, Numero | Add `1px paper-edge` as the *listing* rule; keep `2px ink` as the *object* border. | S | Two weights must be semantically split, or it is drift. |
| C4 | **A warm ink.** Stripe Press uses `#201819` (warm near-black) rather than `#000`; Public Domain Review uses `#1d2731` (cool). Our `#0a0a0a` is neutral. | Stripe Press, Public Domain Review | A one-token experiment: shift `--color-ink` a few points warm so it sits on cream like printed ink rather than like a screen. | S | Touches every surface; must be A/B'd graphically, and it changes every VR baseline. |
| C5 | **Per-item accent from a fixed set.** One saturated colour per card, drawn from a closed list, never on chrome. | The Pudding | Team pages: each senior/youth team gets one tone from our existing status set, used on its kicker and nothing else. | M | Risks looking like a category-colour system, which is product UI. Only viable if the set is ≤4 and the usage is one element. |
| C6 | **`::selection`.** Three lines: jersey-deep ground with cream text on the page, inverted inside ink/jersey bands. | universal, absent here | `globals.css`. | S | None. |

### 4.4 Shape and layout

| # | Idea | Source | How it lands | Effort | Risk |
| - | ---- | ------ | ------------ | ------ | ---- |
| S1 | **Spec table hung off the headline.** A 3–5 row mono key/value table pinned to the right edge of a display heading, sharing its last baseline, hairline-ruled, values in the accent. | Teenage Engineering | `EditorialHeroShell` variant on `/wedstrijd/[matchId]`, `/ploegen/[slug]`, `/events/[slug]`. | S | Mobile: it stacks under the heading, which is fine — but must be authored to stack, not shrink. |
| S2 | **Rule–heading–rule section openers.** Centred section title flanked by hairlines running to the column edges. | Public Domain Review | `SectionHeader` gains a `rule` variant. Note #2552 put section-heading air in `SectionHeader`, so this is the right owner. | S | Do not put it on `EditorialHeading` — that breaks nine heroes (#2552). |
| S3 | **45° corner ribbon.** `rotate(45deg)` label clipped by a card's `overflow: hidden`. | Fonts In Use (`Staff Pick`) | "Man van de match", "Uitverkocht", "Afgelast" on a `TapedCard`. | S | Steeper than the Sub-Degree Rule allows — but so are stamps, which are already exempted. Formalise it as an ornament, not a card rotation. |
| S4 | **A wall of identical outlined chips as an index.** 40+ names, uppercase 10–11px, sharp, hairline-bordered, four to a row, no hierarchy. | Justseeds artist wall, Are.na | Staff/board listing, youth coaches, the sponsors index, the player index on `/ploegen/[slug]`. | S | Replaces cards — check nothing depends on the card's photo slot. |
| S5 | **Leader dots.** `label ......... value` via a `flex` row with a `flex: 1` dotted border between. | print contents pages | `/kalender` entries, article "in dit stuk", footer link columns, match facts. | S | Dotted fill must not be announced by screen readers — use `aria-hidden` on the filler. |
| S6 | **One deliberate heavyweight frame.** A single very thick border used once per page as a framing device, against 1px structure. | Fonts In Use (`75px solid`), Present & Correct (`3px`) | The hero image on `/nieuws/[slug]`, or the crest block on `/club`. | S | One per page. Two is a pattern; three is noise. |
| S7 | **Sticky context bar.** One hairline row under the header: status dot + subject + one action. | Standards Manual, NTS | `/wedstrijd/[matchId]` and `/ploegen/[slug]`. | M | Sticky chrome eats mobile viewport — the primary scene is a phone outdoors. Cap it at 40px and drop it on scroll-down. |
| S8 | **Transparent reserved borders.** `border: 1px solid transparent` on every element whose hover adds a border, so nothing shifts. | Are.na (64 instances) | Wherever our hover recolours or adds a rule. | S | None. Pure discipline. |

### 4.5 Small delights

This is the category where we currently score near zero and the cost is near zero.

| # | Idea | Source | How it lands | Effort | Risk |
| - | ---- | ------ | ------------ | ------ | ---- |
| D1 | **"Verder op p. 4" / "← terug naar het overzicht"** print-navigation footers with a rule above, set in mono. | print convention | Article and team page footers. Real destinations only — no fabricated page numbers. | S | Must reference a real next article; a fake page number is fabricated magazine chrome. |
| D2 | **Square pagination markers.** Outlined squares, current one filled. | OH no | `HorizontalSlider`, gallery, `FilterTabs`. | S | None. |
| D4 | **`[x]` and `[?]` in square brackets** as typewriter affordances beside (not instead of) Phosphor icons — for dismiss and hint. | Interference Archive | Alerts, cookie banner, form hints. | S | Never *instead* of an accessible name. |
| D5 | **Margin notes.** A `<aside>` hung in the left gutter of the 680px reading column at `text-label-sm`, for editor's notes and figure references. | Public Domain Review, print convention | `/nieuws/[slug]` Portable Text. | M | At 680px there is no gutter on mobile — must collapse inline. |
| D6 | **A real index page.** One dense route listing every team, player, article and event, contents-page style. | Fonts In Use, Are.na, Justseeds | See signature move C. | M | See §5. |
| D7 | **Self-demonstrating metadata.** Set the thing in the register it names — a shirt number in the numeral style of the shirt; a competition name in its own voice. | Fonts In Use | `NumberDisplay`, `MatchStatusBadge`. | M | Only where a real second register exists; do not invent one. |
| D8 | **A postmark/date stamp on the article byline** — rotated ~2°, mono, showing the publication date as if cancelled by a post office. We already have `StampBadge` and a Phase 8 search postmark; this extends a decided idiom. | print convention, existing `StampBadge` | `EditorialByline`. | S | Must use the real publish date. |
| D9 | **The label with air.** A `text-label` variant at 1.8–3.5× line-height, so a kicker occupies a band rather than a line. | Field Notes (`12px/42px`), Numero (`12px/21.6px`) | `SectionKicker`, `EditorialKicker`. | S | One more type token; must go in the ramp, not as a hand-applied `leading-*` (#2417). |

### 4.6 Type craft within our constraint

No new fonts. Everything here is Freight Big Pro, Freight Display Pro, Freight Sans Pro or IBM Plex Mono.

| # | Idea | Source | How it lands | Effort | Risk |
| - | ---- | ------ | ------------ | ------ | ---- |
| Y1 | **Negative leading on the two-line hero.** `line-height: 0.85` so descenders and ascenders interlock. | The Lot Radio (`lh 0.73`), Truelove Seeds (`lh < 1`) | A `display-2xl` sibling step for two-line heroes only. | S | Clipping — needs `padding-block` and a check against Freight Big's ascenders. |
| Y2 | **A 0.2em tracked label step**, and one theatrical 1.5em outlier used once. | Horst (`0.2em`), Velvetyne (`1.56em`) | A `label-wide` token; the outlier only on a full-bleed band word. | S | 0.08em → 0.2em changes label wrapping; check the nav's `max-w-[14ch]` bound. |
| Y3 | **Oversized ghost numerals bled off the edge.** Section index numbers at display scale in `ink/6`, clipped by the container. | foundry specimen convention | `SectionHeader`, `/ploegen` team ordering. | S | Contrast is decorative only — must be `aria-hidden`. |
| Y4 | **Lining vs oldstyle figures used deliberately.** Our Typekit figure sets are documented: `tabular-nums` is inert, `lining-nums` is the only switch, the default is oldstyle. So a **scoreline in oldstyle figures is wrong** and a scoreline in mono is right — and a *date in oldstyle* inside prose is right. | Typekit figure-set behaviour (project reference) | Audit every numeral: scores/tables → mono or `lining-nums`; in-prose dates → leave oldstyle. | M | Already a known trap; this is applying it consistently rather than discovering it. |
| Y5 | **Body at weight 500 on dark grounds.** Freight Sans at 400 on cream, 500 inside ink and jersey-deep bands. | Stripe Press (body at 500) | A `.on-ink` body modifier. | S | Only if Freight Sans 500 is in the served kit — check before promising it. |
| Y6 | **Hanging punctuation on pull quotes.** `hanging-punctuation: first last` (Safari) plus a negative-indent fallback so the opening quote sits outside the measure. | print convention | `PullQuote`, `BodyQuote`, `QuoteMark`. | S | Support is Safari-only; the fallback is a `text-indent`, so it must not double-apply. |
| Y7 | **A second drop cap style: the raised initial.** We have `DropCapParagraph` (a dropped cap). The raised initial — same size, sitting *on* the baseline and pushing the line down — is the other half of the pair and costs one variant. | print convention | `DropCapParagraph` variant. | S | One per article, like the existing rule. |
| Y8 | **Tighter tracking on display, looser on mono, nothing in between.** Our display is `-0.025em` and our label is `0.08em`. Push display to `-0.035em` at the two largest steps only, where Freight Big can take it. | Standards Manual, Letterform | The `display-2xl` / `display-xl` steps. | S | Must be per-step in the ramp, never hand-applied. |

---

## 5. Three signature moves

Bigger, riskier, and each one could become the thing people remember.

### A. Two-ink registration — make the whole site a two-colour print job

**The idea.** Commit to the fiction that the site is printed in exactly two inks: **ink black** and **jersey green**, on cream stock. Then make the registration imperfect, on purpose, everywhere it matters:

- the crest carries a green plate offset 1.5px from its black plate;
- `StripedSeam`'s green band is offset from its ink band by a hair, with a `feTurbulence` displacement so the edge is fibrous, not vector-clean;
- the display heading's accent `<em>` is a green plate that sits 1px off the black one;
- everything overlaps in `multiply`, so where green crosses black you get a third, darker value for free — which is exactly what happens on paper.

```css
/* one utility, applied to the wrapper of anything that gets a second plate */
.plate {
  position: relative;
  isolation: isolate;
}
.plate::before {
  content: attr(data-plate);
  position: absolute;
  inset: 0;
  translate: 1.5px 1.5px;
  color: var(--color-jersey-deep);
  mix-blend-mode: multiply;
  z-index: -1;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) { /* static either way — no motion involved */ }
```

**Where it lives.** `Crest`, `StripedSeam`, `EditorialHeading` accent, `StampBadge`. Four sites, one utility.

**Cost.** M. One CSS utility, one SVG filter, four call sites, and a decision about the offset distance (1px reads as a rendering artefact; 3px reads as a mistake; 1.5–2px reads as print).

**What could go wrong.** `mix-blend-mode` creates a stacking context and forces compositing — on a page with many instances it costs paint time, so it must be capped. Text duplicated via `::before content: attr()` is invisible to assistive tech (good) but must not be the *only* copy. On low-DPI displays a 1.5px offset lands on a half-pixel and can look blurry, which is the one thing this design language forbids — so it needs a `@media (min-resolution: 2dppx)` check or a whole-pixel offset. And there is a real chance a reviewer reads the first build as a bug; the offset has to be confident enough to be legible as intent.

### B. Match day is a different register

**The idea.** The site has a mode. On the day of a match — and only then — a set of already-decided elements switch on together:

1. a **wire strip** under the header: `● LIVE` / boxed team numeral / competition / kickoff / venue, one hairline row (NTS, Standards Manual);
2. a **marquee band** in Freight Big italic caps, one phrase, scrolling, `motion-safe:` gated with a static fallback (The Lot Radio);
3. the fixture card gets **marching ants** while the match is in progress (OH no);
4. the crest gets its **misregistration plate** (move A) only today;
5. the live dot **flickers** — the only looping motion on the site (NTS).

Off-day, none of it exists. The page returns to being a printed programme.

**Where it lives.** `SiteHeader` + a match-day band + `MatchStatusBadge`.

**Cost.** L. Not because any one piece is hard — each is S — but because the *temporal* logic is the hard part, and the project's own guidance is that behaviour-over-time needs an hour-by-hour table before an option list. Kickoff is Belgian wall-clock; the BFF owns the state; ISR caching means "today" is not free to compute.

**What could go wrong.** The classic failure is the mode being stuck on (a cached page showing `● LIVE` at 3 a.m. on a Tuesday) — the project has already shipped one 10-hour-stale scoreline from a caching mistake, so this needs `revalidate` discipline and probably a client-side clock check that can *remove* the band but never add it. Second risk: the marquee is the loudest thing the site has ever done, and it must be gated behind reduced-motion with a static band rather than nothing. Third: it must not tip into "big-club broadcast slick", which is a named anti-reference — the wire strip is a bus timetable, not a Sky Sports bug.

### C. `/index` — the contents page

**The idea.** One route, no images, that lists **everything**: every team with its division, every player with their team and number, every article with its date, every event with its date, every club page. Set as a printed contents page — display serif section heads, mono entries, leader dots to the right-hand value, hairline rules, three columns at 1280px collapsing to one. Alphabetical *and* chronological toggles. It is the back of the programme.

**Where it lives.** A new route, plus a footer link, plus the Justseeds-style chip wall as the player/staff index inside it.

**Cost.** M. The data all exists and is already fetched elsewhere; the work is one dense page and a rule about how it sorts.

**What could go wrong.** `PRODUCT.md` owns what surfaces this site has, so a new route is a product decision, not a design one — it needs to be argued as an *index of existing content*, not a new feature. It could also become a maintenance tax if it hand-lists anything (`llms.txt` has already drifted this way once, shipping a dead route long after it was removed) — so every entry must be derived from the CMS or the BFF, never authored. And it must not become the site's real navigation: the nav is flat and stays flat.

---

## 6. Explicitly rejected

Attractive ideas from the references above that break a locked rule. Named so nobody re-proposes them.

| Idea | Where it came from | Rule it breaks |
| ---- | ------------------ | -------------- |
| Pill-shaped CTAs (`border-radius: 9999px`) and 12px-rounded cards | Risotto (22 instances), Cooper Hewitt (390 instances), Letterform | **The Sharp Corner Rule.** Radius is 0 on every rectangle; only true circles curve. |
| `filter: drop-shadow(rgba(0,0,0,.25) 0 0 6px)` to lift white text off photography | NTS (54 instances) | **The No Blur Rule.** Use Klim's solid ink caption chip instead — it solves the same problem with a rectangle. |
| Greyscaling photography for a duotone or archival look | Klim (`filter: grayscale(1)`, 6 instances), Letterform (`brightness(0) grayscale(1)`) | **Photos stay in colour.** Greyscale→colour on hover belongs to sponsor logos alone. (The `brightness(0)` *technique* is still worth adopting — for sponsor logos, where it is legal.) |
| Adding Courier / a typewriter face for dates and metadata | Interference Archive (73 elements) | **No new fonts.** IBM Plex Mono already occupies this slot; the fix is to use it more, not to add a second mono. |
| Adding a condensed display face for dense catalogue titles | Numero (`bryant-web-condensed`), Justseeds (`Belgika`) | **No new fonts.** Substitute: Freight Display Pro at `-0.035em` with `text-wrap: balance`. |
| Adopting Moderat / Monument Grotesk / Soehne / Univers Condensed as the UI face | Risotto, Dinamo, Klim, NTS | **No new fonts.** Freight Sans Pro is the body face. |
| Large flat panels of bright green, as Risotto does with `#ff3300` | Risotto (105 elements on one colour) | **No bright jersey** + **The Rare Green Rule.** `jersey #4acf52` is decorative only and never on cream; green is an event, not a surface treatment. |
| `backdrop-filter: blur(50px)` translucent nav | Palace Skateboards, Are.na | **SaaS anti-reference** — no glassmorphism, no blur. |
| A neutral grey structural layer (`#f0f0f0` / `#f7f7f7` panels behind listings) | Fonts In Use (59 elements), Are.na (56) | **The No-Grey-UI Rule.** `gray-100` was deleted outright in #2342; a section that steps down gets `cream-soft`. |
| A 16px semibold sans "section label" between display serif and mono | Stripe Press, Horst, most of the survey | **The No Middle Register Rule.** |
| Autoplaying hero video / live video wall | NTS, The Lot Radio | **Big-club broadcast slick** is a named anti-reference, and we have no photographer or videographer. |
| Fabricated issue numbers, edition dates, "Vol. III No. 7" mastheads | magazine convention generally | **No fabricated magazine chrome.** "Verder op p. 4" is only legal because it points at a real next article. |
| Emoji ornaments and emoji-based status markers | common across small-org sites | **Icons over emojis** — Phosphor Fill only. |
| A dropdown mega-nav grouping teams and club pages | most listings sites in this survey | **The nav is flat** — the four dropdowns were deleted deliberately in #2409/#2415 and each destination page indexes its own children. |
| A newsletter capture band, however well-designed | Field Notes, Numero, Truelove Seeds, Risotto — nearly all of them | **No newsletter.** `PRODUCT.md` lists it in what this site does not do. |
| Sub-10px type | Fonts In Use (`10px/11px`, 348 elements), Justseeds (`10px/15px`) | **The 11px Floor Rule.** 10px uppercase tracked mono (`text-label-sm`) is the floor and it is already spent. |
| A blurred offset shadow on "mounted plate" images | Public Domain Review (`8px 4px 8px -4px`) | **The Complete Vocabulary Rule** — seven shadow tokens, all `blur: 0`, and adding a blurred one changes the language. |

---

## Appendix — method notes

- Fingerprints were captured with headless Chromium (Playwright 1.60) at 1440×900, `deviceScaleFactor: 1`, three scroll depths per site, waiting 3.5 s after `domcontentloaded`. Counts like "55 × `1px solid rgb(76,76,76)`" are **element counts within the first 4000 DOM nodes of `<body>`** on the page as it rendered at that moment — they are a reliable signal of dominance, not an exhaustive audit.
- Colours are reported as observed computed values, converted to hex where useful. Where a site's own `:root` custom properties were readable, those are quoted instead.
- Cookie/consent overlays were **not** dismissed (per the privacy default of declining rather than accepting), so a few screenshots carry a consent dialog. This did not affect the computed-style capture.
- Where a mechanism is described but was not read off the live source — for example OH no's marching-ants implementation — the text says so explicitly.

