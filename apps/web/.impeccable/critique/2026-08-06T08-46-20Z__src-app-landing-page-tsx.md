---
target: src/app/(landing)/page.tsx
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
timestamp: 2026-08-06T08-46-20Z
slug: src-app-landing-page-tsx
---

Method: dual-agent (A: isolated design review · B: isolated detector + browser evidence)

## Design Health Score

Surface mode: **Persuade**. Heuristics 7 and 10 scored `n/a` — total renormalized to /32.

| #         | Heuristic                       | Score     | Key Issue                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | Visibility of System Status     | 2         | `revalidate = 900` over a BFF that can serve stale PSD data, and nothing anywhere states freshness — a missing score is indistinguishable from an unsynced one. Loading skeleton is a real `role="status"`, and console is clean at both viewports.                                                                                                                            |
| 2         | Match System / Real World       | 3         | Plain Dutch throughout, but `FirstTeamsBlock`'s two columns are unlabelled (nothing reads "uitslag" / "volgende"), and `firstTeamsHeading` prints "Dit weekend." for any fixture within 7 days including a midweek cup tie.                                                                                                                                                    |
| 3         | User Control and Freedom        | 2         | `UpcomingMatchesClient`'s "Toon alle N wedstrijden" is one-way — no "Toon minder", no filter, and `expanded` is local `useState`, so a back-navigation silently collapses it.                                                                                                                                                                                                  |
| 4         | Consistency and Standards       | 2         | Strong shared vocabulary (one `TeamAgendaRow` across homepage, `/ploegen/[slug]` and `/kalender`; three container widths honoured) undercut by measured drift: 8 competition labels render at **9px** against a documented 11px floor, `10px` is a de-facto undocumented 11th ramp step used 15× system-wide, and three desktop fixture rows visibly clip their opponent name. |
| 5         | Error Prevention                | 2         | `FeaturedEventBand.tsx:98` substitutes the literal `"Kantine"` for any missing location; `TeamAgendaRow`'s mobile branch renders KCVV as its own opponent when `is_home` is null — a field PSD is documented as omitting.                                                                                                                                                      |
| 6         | Recognition Rather Than Recall  | 2         | Every read-more affordance is `opacity-0` until hover, so it never appears on the stated primary device. Cream-vs-green as result-vs-fixture, and `bg-jersey-deep` on a `NewsCard` meaning "transfer", are both unlegended.                                                                                                                                                    |
| 7         | Flexibility and Efficiency      | n/a       | Anonymous product by design — no accounts, no saved state, no power-user path. There is no accelerator layer to evaluate.                                                                                                                                                                                                                                                      |
| 8         | Aesthetic and Minimalist Design | 3         | The world is coherent and nothing is decorative at the token level; zero horizontal overflow at 390px and 1440px. Deductions are compositional, not ornamental.                                                                                                                                                                                                                |
| 9         | Error Recovery                  | 2         | The all-empty fallback fires only when articles **and** matches are both empty. A BFF-only outage renders a complete-looking news page with every score and fixture silently gone, and says nothing.                                                                                                                                                                           |
| 10        | Help and Documentation          | n/a       | A landing page warrants no inline help; `/hulp` is correctly reachable from header nav and footer.                                                                                                                                                                                                                                                                             |
| **Total** |                                 | **19/32** | **59% — Acceptable**                                                                                                                                                                                                                                                                                                                                                           |

## Design Specificity Verdict

**Authored at the token and primitive layer. Category-interchangeable at the composition layer.**

**LLM assessment.** The visual world is unmistakably KCVV and could not be mistaken for the Sportlink/Twizzit house style: cream paper with hard 2px ink borders, `StripedSeam` 45° bands closing sections, tape at sub-degree angles, Freight Big Pro display against 11px IBM Plex Mono, green used exactly as the Rare Green Rule prescribes. Four sections are genuinely authored — `FirstTeamsBlock`'s jersey-deep-dark matchday desk with its perforated date stub and W/D/L outcome underline; `MatchStripView`'s "KCVV **vs.** Sporting X" with the `vs.` in Freight Display italic and an initial-badge crest fallback at identical dimensions so the strip never reflows; `YouthSection` + `YouthBackdrop`; and the footer's crest → wordmark → motto sequence, which is the one place the club's voice actually speaks.

What is interchangeable is the **spine**, not the vocabulary. `FeaturedUitgelichtRow` over `NewsGrid` is the default CMS landing page — a 3-up featured row above a 3×2 chronological grid, both built from the same `NewsCard` — and it sits ahead of any score.

**One correction to that reading, from live data:** the source composes twelve `SectionConfig` slots, but on the current dataset only **seven** emit. `FeaturedEventBand`, all three `BannerSlot`s and `UpcomingMatches` returned null and rendered nothing — no empty shells, no orphan headings. The live spine is hero → Uitgelicht → Dit weekend → Laatste nieuws → De toekomst van Elewijt → sponsors → clubshop. The graceful-degradation architecture works exactly as designed. But it also means the three generic ad rectangles are absent today and present the moment an editor fills a slot, so the composition critique stands as a latent risk rather than a current one.

**Deterministic scan.** Scoped to the homepage's actual import graph: **64 findings** — 40 `design-system-font-size` (advisory), 13 `design-system-color` (advisory), 11 `broken-image` (warning).

- **All 11 warnings are false positives.** Every one is a `vi.mock("next/image")` factory inside a `*.test.tsx` harness rendering `<img {...props} />` with no literal `src`.
- **All 13 colour findings are false positives or off-path.** Eight are `DownloadButton`'s file-type→brand-colour map (`pdf: "#c0392b"`, `doc: "#2563b3"`…), which is semantic file-format colour, not palette drift, and is not on the homepage; the rest are Storybook mocks. **Net: zero shipped, homepage-reachable colour violations.** The No-Grey-UI rule holds.
- **The font-size findings are the real signal**, and the detector caught something the design review did not: `10px` is not random drift, it is a **de-facto undocumented 11th ramp step used 15× across the design system** (`MonoLabel` md at 13px, `Label` at 10px, `EditorialHero/_variant-parts.tsx` at 10px and 9px, plus `Alert`, `DownloadButton`, `EndMark`, `FilterTabs`, `QASectionDivider`). Seven further hits are in stories and tests, and the `SubjectAvatar` values are element-sizing on a `h-8`/`h-16` box, not type — correctly excluded.

**Browser evidence.** The Chrome extension timed out three times (permission prompt never cleared), so Assessment B substituted the repo's own Playwright + Chromium against a live `next dev` on :3000 with the BFF on :8787, capturing 390×844 and 1440×900 in one batched round. Everything was torn down afterward and verified gone.

**Visual overlays.** The detector's in-page overlay **did** run — mutation preflight passed, `live-server.mjs` served `/detect.js` on :8400, 37 badges painted, `[impeccable] 19 anti-patterns found` at both viewports. But it ran inside a headless Playwright browser that has since been closed, so **there is no user-visible overlay tab in your browser**. The console output is reported below instead.

Overlay findings, deduplicated:

- **low-contrast ×5** — `Wedstrijddetails →` at **4.0:1**, the youth lead paragraph at **4.0:1**, `Ontdek onze jeugd →` at **4.0:1** (all cream `#f5f1e6` on jersey-deep `#008755`), the youth heading's `Elewijt` accent at **2.7:1** (warm `#f0c264` on jersey-deep), and on mobile the footer motto's `plezante` at **4.0:1** (jersey-deep on cream). Every one is an **in-palette pairing** — this is a documented property of the palette, not token drift. DESIGN.md already states jersey-deep is ~4.05:1 on cream and that `jersey-link` exists at ~4.6:1 for exactly this reason.
- **undersized-ui-text ×10** — 8 competition labels in `FirstTeamsBlock` at **9px** (`Beker van Vlaanderen`, `Vriendschappelijk`, `Beker van Brabant`, `Beker van Zemst`), plus the footer copyright, address, `PRIVACY` and `COOKIE-INSTELLINGEN` at 9.5px mobile / 10.5px desktop.
- **text-overflow ×3, desktop only** — `FirstTeamsBlock` fixture rows clip their opponent: `Ohr Hulde…` (19px over), `Boutersem …` (21px), `FC Zemst Spo…` (16px). Mobile stacks the row and escapes it.
- **kicker-above-heading** and **cream-palette** are documented house patterns flagged generically. Ignore both.

**Where the two assessments disagreed, and who was right.** Assessment B's DOM audit reported "no homepage content behind hover on mobile." Assessment A read the source and said every read-more CTA is hover-gated. A is correct, and the disagreement is instructive: `opacity-0 … group-hover:opacity-100` leaves the element _present in the DOM_ and invisible to the user, so a presence-based audit sees it and a phone user never does. Verified directly — `NewsCard.tsx:375`, `EditorialHero.tsx:587`, and `SponsorTile.tsx:43` (`grayscale … group-hover:grayscale-0`).

## Overall Impression

This is a genuinely authored design world executed with real conviction, wrapped around a spine that buries the one thing the product exists to deliver. Zero horizontal overflow at either viewport, a clean console, no empty shells on missing data, and a match-row vocabulary shared identically across three routes — the engineering underneath is better than most professional club sites. And then: on a phone on Sunday evening, the first viewport tells you who KCVV plays **next**, and the result of the match that just finished is three screens down.

The single biggest opportunity is a reorder plus one data fix, both small, both in files that already contain the logic needed.

## What's Working

**One match-row vocabulary, shared across three surfaces.** `FirstTeamAgendaRow` is a thin client wrapper around the same `TeamAgendaRow` used on `/ploegen/[slug]` and `/kalender`, adding only an analytics closure. `TeamAgendaRow` owns its own `<Link>`, so the row is a single touch target with no nested interactives. A supporter learns one row shape once — date stub, crest, venue glyph, outcome underline — and it means the same thing everywhere. Most codebases talk about this consolidation; this one did it.

**Ruthless graceful degradation, and it demonstrably works.** Every spine entry is `SectionConfig | null` and every repository call is individually `Effect.catchAll`'d. The live capture proves it: five of twelve sections returned null on the current dataset and the page rendered as a clean seven-section sheet with no empty headings, no orphan grids, no layout holes. For a product whose upstream omits `venue`, `is_home` and competition metadata at will, this is the correct architecture.

**The palette and shadow discipline hold under measurement.** Zero shipped colour violations on the homepage's import graph. No blurred shadow, no radius, no gradient outside the sanctioned photo overlay, no neutral grey. The `#2342` grey retirement stuck. That is unusual — design systems normally leak at exactly this seam.

## Priority Issues

### [P0] The first viewport answers "wat volgt" but never "wat gebeurde"

**What.** `getFirstTeamNextMatch()` in `src/lib/server/match-data.ts` calls `bff.getNextMatches()` → `mapMatchesToUpcomingMatches` → `[0]`. It is structurally incapable of returning a score, despite its own doc comment claiming "last result or next fixture." The live 390px capture confirms the consequence: sticky header, then a full-width bar reading `Ohr Huldenberg vs. KCVV` / `Za 8 augustus · 18:00` / `Wedstrijddetails →`, then the hero kicker at y≈300 and a five-line `<h1>` to y≈570. The last result lives in the "Dit weekend." band — section three, roughly 2,200px down.

**Why it matters.** This directly contradicts product principle 1, "the result is the headline… in a single glance on a phone." The supporter who opened the site to find out whether KCVV won must scroll past a hero and three featured cards to learn it. Every other issue in this report is downstream of this one.

**Fix.** Two changes, both small. (1) Make `getFirstTeamNextMatch` do what its comment says — the derivation already exists as `pickLastResult` / `pickNextFixture` in `first-teams.ts`; lift them out and have `MatchStripView` render result-then-fixture inside a recency window (72h), falling back to fixture-only outside it. (2) Move `firstTeamsSection` above `uitgelichtSection` in the `SectionStack` array in `page.tsx` — a one-line reorder that puts the result in the second screen.

**Suggested command**: `/impeccable shape` — the reorder and the data-shape change should be decided together before either is written.

### [P1] Every read-more affordance is hover-only, on a touch-first product

**What.** `NewsCard.tsx:375` — `opacity-0 … group-focus-within:opacity-100 group-hover:opacity-100`. `EditorialHero.tsx:587` — the `★ Lees verder →` CTA, same pattern. `SponsorTile.tsx:43` — `grayscale … group-hover:grayscale-0`. On a phone none of these ever fire.

**Why it matters.** DESIGN.md's Layout section says "nothing important hides behind hover"; PRODUCT.md makes the same commitment for less-digital visitors. The hero is the page's largest element and on mobile presents as a headline plus a photograph with **no affordance that it is tappable** — worse because `toEditorialHeroProps` never passes `lead`, so there is no dek either. And the sponsor wall — a commercial obligation with renewal consequences — renders all 14 logos **permanently greyscale** on the primary device, delivering only the worse half of the one sanctioned greyscale in the system.

**Fix.** Keep the reveal as a hover _enhancement_: wrap the opacity transition in `@media (hover: hover)` and render at full opacity on coarse pointers. Same change in all three files; the footer row already reserves its height so nothing reflows. For sponsors, invert the default on coarse pointers — colour at rest, greyscale is the desktop flourish. Separately, pass `lead` through `toEditorialHeroProps`.

**Suggested command**: `/impeccable adapt`

### [P1] A BFF outage renders a complete-looking page with all match data silently missing

**What.** The all-empty fallback at `page.tsx:333` fires only when `articles.length === 0 && matches.length === 0`. In the realistic failure — Sanity healthy, PSD/BFF down or quota-exhausted — hero, Uitgelicht, news grid, youth band and sponsors all render while `MatchStrip`, `FirstTeamsBlock` and `UpcomingMatches` each independently return null. Assessment B hit this for real: the first render happened before the BFF was up (`ECONNREFUSED localhost:8787`) and produced a page that looked finished.

**Why it matters.** This is precisely the failure a matchday supporter hits, and the design's answer is silence. Their conclusion is "the club never posted the result" — worse for the club than an honest error. Note the known read-path 429 storm can hold this state for up to 48h.

**Fix.** When `matches.length === 0` but articles exist, render a `TicketStub` or `MonoLabel`-framed notice in the `firstTeamsSection` slot: _"Uitslagen en wedstrijden zijn even niet beschikbaar. Probeer het later opnieuw."_ One extra `SectionConfig`, gated on the condition that already drops the three match sections. Also fix `page.tsx:339`, which uses `text-gray-600` — a token deleted in #2342, so the class no-ops.

**Suggested command**: `/impeccable harden`

### [P1] The section CTAs fail contrast and target size, measured, on the primary device

**What.** Measured at 390px: `AL HET NIEUWS →` is **113×11px**. `VOLLEDIGE KALENDER →` is 151×16. `ALLE SPONSORS & SYMPATHISANTEN →` is 281×20. All 13 footer nav links are ~20px tall. **21 sub-44px tap targets on mobile, 32 on desktop.** The one compliant CTA is `Wedstrijddetails →` at 163×40 — still 4px short, and measured at **4.0:1** contrast. Root cause is `EditorialLink`'s `cta` variant: `font-mono text-[length:var(--text-label)]` (11px) in `TEXT_TONE.light = "text-jersey-deep"` with **zero padding**.

**Why it matters.** DESIGN.md itself documents that jersey-deep is ~4.05:1 on cream — below AA for normal text — and that `jersey-link` at ~4.6:1 exists for this. PRODUCT.md makes sunlight contrast and generous tap targets _functional_ requirements for a phone held outdoors. WCAG 2.2 AA's 24px target floor is missed by more than half.

**Fix.** In `EditorialLink`, switch `TEXT_TONE.light` to `text-jersey-link` and add `py-2 -my-2` so the hit area reaches ~28px with no visual shift. Same in `NewsCard`'s read-more span and `FirstTeamsBlock`'s kalender link. Purely additive. The `#f5f1e6`-on-`#008755` pairings at 4.0:1 need a separate decision — either lighten the cream on green surfaces or accept them as large-text-only.

**Suggested command**: `/impeccable audit`

### [P2] The matchday band — the best thing on the page — breaks its own type floor and clips on desktop

**What.** Two defects the design review could not see and the detector measured. (1) Eight competition labels in `FirstTeamsBlock` render at **9px** (`Beker van Vlaanderen`, `Vriendschappelijk`, `Beker van Brabant`, `Beker van Zemst`) — the documented label token is 11px, and DESIGN.md's No Middle Register Rule sets 11px mono as the floor. (2) On desktop, three fixture rows visibly clip their opponent name: `Ohr Hulde…`, `Boutersem …`, `FC Zemst Spo…` — 16–21px of overflow on a `min-w-0 truncate` span. Mobile stacks the row and escapes it, so this only shows on the wider viewport.

**Why it matters.** This is the section that carries the result — the payload of the whole page — and it is the section where an opponent's name gets cut in half on a desktop screen with room to spare. It undercuts "punch above the division" at exactly the moment the page is doing its job.

**Fix.** Promote the 9px labels to the 11px label token, or document a `label-xs` step if the tighter size is deliberate — but decide, because `10px` is already an undocumented 11th step used 15× system-wide. For the clipping, give the fixture column its share of the row: the opponent name should get the remaining width rather than a fixed fraction.

**Suggested command**: `/impeccable typeset`

## Persona Red Flags

**Jordan (confused first-timer)** — The wordmark is the only identity statement above the fold; the motto and the founding year appear **only** in the footer, ~7,000px down. Nothing in the spine says who this club is. `MatchStripView`'s `MetaCell` captions — `Aftrap`, `Competitie`, `Terrein` — are Flemish football jargon **and are `hidden lg:flex`**, so on his phone the strip collapses to a bare `Za 8 augustus · 18:00` with no label saying what that date is. The hero gives him a 44px Dutch sentence, "Door redactie", and a photo — with no visible read-more. `FirstTeamsBlock` shows two unlabelled columns; nothing tells him which number is a final score and which is a kickoff time.

**Riley (deliberate stress tester)** — Zero-item handling is genuinely good and was proven live: five sections dropped cleanly. But: one article in `FeaturedUitgelichtRow` renders a single card in the left third of a `md:grid-cols-3` under a full-size "Uitgelicht." heading. "Toon alle N wedstrijden" renders the entire non-senior feed uncapped and unvirtualised, with no "Toon minder", and `expanded` is local `useState` so a back-navigation collapses it. Long names truncate in both directions — `MatchStripView` gives "KCVV Elew… vs. Sporting Ele…", while `TeamAgendaRow` pins the team suffix _outside_ the truncation so "… U23" survives and the club name disappears. `FeaturedEventBand.tsx:98` fabricates `"Kantine"` for any event missing a location. And in `TeamAgendaRow`'s mobile branch, `const opponent = isHome ? match.awayTeam : match.homeTeam` — when the BFF omits `is_home`, which PSD does, `isHome` is `undefined`, the falsy branch runs, and **KCVV is rendered as its own opponent, with its own crest**.

**Casey (distracted, one-handed, slow connection)** — LCP is handled correctly: `priority: true` on the hero cover only, with proper `sizes`. But nothing below the fold has a blur placeholder — `NewsCard` accepts `imageLqip` and neither `toUitgelichtArticle` nor `toHomepageArticles` forwards one, so three featured covers, six grid covers, the youth backdrop and all 14 sponsor logos pop in blank-then-image. Her thumb targets are the 11–20px links measured above. And every read-more on the page is invisible to her.

**Nele (project persona: mother of a U13 player, Saturday 08:00 — "where and when?")** — On the current dataset her answer is _not on this page at all_: `UpcomingMatches` returned null and did not render. When it does render, it is section seven, an unfiltered chronological mix of all 16 non-senior teams with no team filter. `MatchRow` gives her date · time · "Team A — Team B" · a `THUIS`/`UIT` pill — and **not** `match.venue`, despite `mapMatchToUpcomingMatch` already mapping that field onto the object. For an away game she gets "UIT" and no address. The band named for her child, `YouthSection`, sells the academy to people who aren't in it ("Word jeugdspeler", "Schrijf je in") and offers a parent already inside it nothing. Product principle 2 says youth is first-class; on this page it is one recruitment band and one unfiltered list that may not appear.

## Minor Observations

- **The `<h1>` hyphenates mid-word at 390px** — the live capture shows `BREUGEL-/MANS` and `doorzettingsvermo-/gen` breaking across lines in Freight Big Pro at display size. On the flagship headline of a brand whose bar is "punch above the division", this is the most visible craft defect on the page. Check for `break-words` fighting `hyphens-auto` — the known fix is `hyphens-auto` alone with a correct `lang`.
- **`loading.tsx` mirrors a stale spine** — omits `FirstTeamsBlock` and `FeaturedEventBand`, uses `aspect-[3/2]` where `NewsCard` is `aspect-[16/9]`, and `md:grid-cols-2 lg:grid-cols-3` where `NewsGrid` is `sm:grid-cols-3`. The skeleton→content swap visibly reflows.
- **`YouthSection` hardcodes "220+ spelers · 16 ploegen"** as a string literal — a club fact with no data source, which will drift silently.
- **The youth band reads flat** — `YouthBackdrop` reported `imgs=0` in the DOM audit; the photograph sits behind at low opacity under a gradient and a 5% halftone, so the band lands as flat green rather than as the composed image it is in source.
- **Homepage sponsor clicks are untracked.** `SponsorTile` emits `data-sponsor-id`/`data-sponsor-tier` but `SponsorsAnalytics` is mounted only in `SponsorsPage`; the three `BannerSlot`s have no `trackEvent` at all, while `ClubshopBanner` tracks both impression and click. For a success criterion that reads "give sponsors a reason to renew", the homepage's sponsor surfaces produce no evidence.
- **`getFirstTeamNextMatch`'s doc comment lies** about its own behaviour — fix the comment or the function; right now it misleads the next reader.
- **`MatchStripView` uses a raw `<img>`** with an eslint-disable for opponent crests, where every other image goes through `next/image`. (The 28 "incomplete" images in the DOM audit were CloudFront 302s the audit didn't follow — the crests render fine. Not a bug.)
- **`BannerSlot` is `aspect-[6/1] min-h-[60px]`** — on a 358px mobile column that is a 60px strip with `object-cover`. Any text in a 1280-wide banner artwork will be unreadable or cropped. None are populated today.

## Questions to Consider

1. If "the result is the headline" is principle 1, why is the one element pinned to the top of every landing page hard-wired to a fixture and structurally incapable of showing a score?
2. What would this page be if `FirstTeamsBlock` were section one and the editorial hero section two? It is a one-line reorder of the `SectionStack` array — has anyone actually looked at it?
3. Two co-equal primary audiences, seven live sections. Which of them belong to the youth parent? Today the honest answer is one recruitment band, plus one agenda that didn't render.
4. The spine ends with a greyscale sponsor wall and an off-site merch handoff. If peak-end effects are real, what _should_ be the last thing a supporter sees on their own club's homepage?
5. `THUIS`/`UIT` pills in `UpcomingMatches` and `House`/`Bus` icons in `TeamAgendaRow` encode the same fact in two vocabularies on the same page. Which one is the system's, and why does the other still exist?
6. `10px` appears 15× across the design system and is in no document. Is it a real ramp step that needs naming, or fifteen separate small decisions that should collapse to 11px?
