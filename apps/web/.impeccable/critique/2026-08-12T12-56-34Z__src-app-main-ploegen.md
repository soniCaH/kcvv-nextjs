---
target: the /ploegen team surface (index, [slug] detail, wedstrijden)
total_score: 15
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 3
timestamp: 2026-08-12T12-56-34Z
slug: src-app-main-ploegen
---

Method: dual-agent (A: design review · B: detector + browser evidence)

Target: `src/app/(main)/ploegen` — the team index, `/ploegen/[slug]` detail, and `/ploegen/[slug]/wedstrijden`.
Baseline: `main` at `e19f8235`, measured 2026-08-12 against `https://kcvv-nextjs.vercel.app` (the apex still serves the old Gatsby site).
Mode: **Operate** with a Read tail — the visitor is completing a task ("find my kid's team", "where is the first team in the table").

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                                                                                                |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | Visibility of System Status     | 1         | No `aria-current` anywhere on the sticky section nav (grep returns nothing); no active state, no freshness signal, and `Klassement` vanishes with no trace on every page |
| 2         | Match System / Real World       | 1         | Three routes publish an `<h1>` that names a different team; `DEFENDER` and `attacker` ship untranslated on Dutch squad cards                                             |
| 3         | User Control and Freedom        | 1         | `/ploegen/[slug]/wedstrijden` has no visible back link, and the global nav has no `/ploegen` entry — browser-back is the only exit                                       |
| 4         | Consistency and Standards       | 2         | On `/wedstrijden` the `<h1>` and all eight `<h2>` month headings render at the same 72px; team detail has no content `<h2>` at all                                       |
| 5         | Error Prevention                | 2         | Two `/ploegen` cards read "U17", two read "U10"; the only discriminator is a 10px sub-line                                                                               |
| 6         | Recognition Rather Than Recall  | 2         | `<title>`, `<h1>` and OG card give three different names for the same team                                                                                               |
| 7         | Flexibility and Efficiency      | 2         | No filter or jump on a 5307px, 39-row fixture page; `AgendaScrollToNext` scrolls unrequested                                                                             |
| 8         | Aesthetic and Minimalist Design | 3         | Genuinely strong chrome; deductions for the meta pill duplicating the tagline verbatim, and the same fixture rendering twice within one mobile screen                    |
| 9         | Error Recovery                  | 1         | 13 of 16 `/wedstrijden` routes are "GEEN WEDSTRIJDEN GEPLAND." in 14px muted mono, then ~250px of empty cream, then the footer                                           |
| 10        | Help and Documentation          | n/a       | No task on this surface requires instruction; the club's help surface is `/hulp`                                                                                         |
| **Total** |                                 | **15/36** | **Poor (42%)**                                                                                                                                                           |

The band is harsh and the split is the point: the **composition** would score well above this. What fails is the **content contract** — six independent places where a component demands a field the pipeline does not supply, and the page silently erases itself instead of saying so.

## Design Specificity Verdict

**Strongly authored at the composition layer, category-interchangeable at the data layer — and the data layer is what the visitor actually reads.**

**LLM assessment.** The chrome is unmistakably KCVV and could not be swapped for a template club: the mirrored A/B flagship pair on `/ploegen` flips grid track order rather than reordering DOM (`TeamFlagship.tsx:146`) with the B-ploeg content right-aligned so the mirror is complete; the youth directory is taped polaroids on a sub-degree tilt pool (`YouthDirectory.tsx:16`, `CARD_ROTATIONS = [-1.1, 0.7, -0.5]`) reading as a scrapbook page; `TeamHero` pairs a taped landscape figure with a dashed "Seizoen" ticket stub (`TeamHero.tsx:180-193`); and `TeamAgendaRow` locks the score dead-centre and truncates names rather than borrowing width (`TeamAgendaRow.tsx:11-14`, the #2397 decision).

What that chrome frames is thinner than a Twizzit page. The squad grid is the largest surface on the page and is a wall of identical placeholder jerseys — 29 players on the flagship team, **3 with a photo**. The position grouping `SquadGrid.tsx:17-22` designs in four ordered buckets collapses to two in production (`Doelmannen 4`, `Spelers 25`). `StandingsTable` renders on **zero** of 16 team pages. `TeamEditorial` — 175 lines, three authored blocks with a pull-quote lift — renders on **zero** of 16. A template club that actually filled its fields would beat this on the exact metric PRODUCT.md calls "punch above the division".

**Deterministic scan.** `detect.mjs` over `src/app/(main)/ploegen` + `src/components/team`: **exit 2, 7 findings, all `design-system-font-size`, all in shipped components, none in tests or stories** — 9px at `PlayerCard.tsx:74`, `TeamAgendaRow.tsx:382,405`, `TeamStaff.tsx:113,120`; 10px at `TeamAgendaRow.tsx:148`, `YouthDirectory.tsx:110`. No ignore file, no suppression comments.

What did **not** fire is the more useful signal. All 65 rules loaded, and every rule that would punish this project's deliberate deviations stayed silent: `design-system-radius`, `gpt-thin-border-wide-shadow`, `hover-color-rules`, `cream-palette`, `ai-color-palette`, `kicker-above-heading`, `oversized-h1`, `italic-serif-display`. The detector and the committed world are not in tension here, so all 7 survivors are real drift.

The file scan **structurally under-reports**: URL mode needs puppeteer (`detect-url.mjs:344` exits 1 without it), so the browser-rendered rules — `tiny-text`, `undersized-ui-text`, `low-contrast`, `skipped-heading`, `text-overflow`, `clipped-overflow-container` — never ran. The browser pass found all six conditions present.

**Visual overlays.** None. `live-server.mjs` was not started and no script was injected, so there is no user-visible overlay in the browser. Script injection did work during measurement, so the step would likely have succeeded; it simply was not run.

## Overall Impression

This surface was designed well and then starved. Every band that has data looks like the club; every band that doesn't disappears without a word, and five of the six sections a first-team page implies exist are absent on a U6 page. The single biggest opportunity is not a redesign — it is deciding what a section says when it has nothing to say, because that one rule would repair the standings, the fixtures, the training times, the editorial block and the youth pages simultaneously.

## What's Working

1. **`TeamAgendaRow`'s two-layout split is the best thing on this surface.** Desktop is a symmetric scoreboard; mobile (`TeamAgendaRow.tsx:392-442`) collapses to a KCVV-centric row — opponent crest, opponent name, a `House`/`Bus` icon carrying a real `aria-label`, then the score. Measured 68px tall at 390px. It answers "who, home or away, what happened" one-handed in a glance, and the home/away affordance is a labelled icon rather than a hover. This is PRODUCT principle #1 executed properly.

2. **The `/ploegen` mirrored flagship pair.** `TeamFlagship.tsx:146` flips grid track order instead of DOM order and `:80` right-aligns the B-ploeg content, so the mirror is complete rather than half-done, while source order keeps the photo first so mobile stacks identically for both. It makes the A/B relationship legible without a word of copy.

3. **The auto-hide architecture is right even though its output is wrong.** `page.tsx:160-175` derives the section flags once and feeds _both_ the render gates and the nav list, with the invariant stated in the comment. Verified live: the U6 nav lists exactly the two sections that exist, and every anchor resolves to a real DOM id on all six pages measured. That single-source discipline prevents the far more common bug of a nav link that scrolls to nothing.

## Priority Issues

### [P0] Three routes publish an `<h1>` that names a different team

Measured across all 18 team pages:

| Route                         | `<h1>`         | `<title>`          |
| ----------------------------- | -------------- | ------------------ |
| `/ploegen/eerste-elftallen-a` | `A-ploeg.`     | Eerste Elftallen A |
| `/ploegen/reserven`           | **`A-ploeg.`** | Reserven           |
| `/ploegen/kcvve-u17`          | `U17.`         | KCVVE U17          |
| `/ploegen/kcvve-u16`          | **`U17.`**     | KCVVE U16          |
| `/ploegen/kcvve-u10`          | `U10.`         | KCVVE U10          |
| `/ploegen/kcvve-u10p`         | **`U10.`**     | KCVVE U10P         |

Two different causes. **Reserven is code**: its Sanity `name` is plainly `"Reserven"` (confirmed via the JSON-LD `SportsTeam.name` and `<title>`), so `nameSuffix` returns `"RESERVEN"`, the A/B suffix test fails, and the fallback at `TeamHero.tsx:56` catches `age === "A"` and returns `"A-ploeg"`. **U16→U17 and U10P→U10 are data**: for youth, `computeCategory` returns the Sanity `age` verbatim (`TeamHero.tsx:43-46`), and `kcvve-u16` carries `age = "U17"`.

**Why it matters.** PRODUCT.md stakes the club's uncopyable asset on competitive data "rendered as first-class pages (`/ploegen/[slug]`)", and the third success criterion is "show the club is serious". A page that misnames its own subject falsifies both. A supporter clicking _Reserven_ from `/ploegen` lands on a page headed `A-ploeg.` and reasonably concludes the click failed.

**Fix.** Delete the `age`-based senior fallback at `TeamHero.tsx:56-57` and return the Sanity `name` when the suffix test fails. Separately, resolve whether `kcvve-u16` is genuinely a U16 side carrying a wrong `age`, or a U16-named side that really plays U17 — that is a club-data question, not a code one. Add a uniqueness assertion to `ploegen/page.test.tsx`: no two `/ploegen/*` routes may produce the same `<h1>`.

**Suggested command:** `/impeccable clarify`

### [P0] Zero of 16 team pages renders a `Klassement`, and no page says why

`#klassement` exists on **zero** of the six pages measured, including the two 368KB senior pages. `StandingsTable.tsx:15` returns `null` on an empty array, `page.tsx:215` then gates the whole section including its seam, and `page.tsx:170` drops "Klassement" from the nav. Nothing is left behind — not a heading, not a line of copy. `#info` is likewise absent everywhere: `TeamEditorial` renders on 0 of 16 teams.

**Why it matters.** `apps/web/CLAUDE.md`'s feature→route map names `/ploegen/[slug]` as _the_ home of the league table. DESIGN.md's Navigation section justifies deleting all four nav dropdowns on the claim that "in-page section anchors on `/ploegen/[slug]`" index the page better than a transient panel could. That index is measured at **3 anchors on a senior page and 2 on a youth page**, and the highest-value one has never rendered. Nothing distinguishes "the season hasn't started" from "the sync is broken".

**Fix.** Keep the render gate but stop letting it erase the idea. Render `#klassement` whenever the team is in a league competition — the signal already exists as `competitionType === "league"`, never `standings.length` — with the table replaced by one line of paper-register copy. Apply the identical pattern to `showMatches` so youth pages stop silently losing their fixtures band.

**Suggested command:** `/impeccable harden`

### [P1] `/ploegen/[slug]/wedstrijden` is a one-way door onto a dead-end empty state

Two defects on one route. **No exit:** every `<a href>` in the body starts `/wedstrijd/`; links matching `/ploegen*` number **zero**. The breadcrumb exists only as JSON-LD (`wedstrijden/page.tsx:139`), and the global nav carries no `/ploegen` entry. **The empty state is 13 of 16 pages:** every youth `/wedstrijden` route renders `"Geen wedstrijden gepland."` in 14px muted mono (`wedstrijden/page.tsx:168-174`), then ~250px of blank cream, then the footer.

**Why it matters.** PRODUCT.md names youth parents as a co-equal primary audience whose first listed need is _schedule_. This is the route that serves it, reached from "Volledige kalender →", and for every U6–U21 parent it is a blank page with no way out. PRODUCT's Accessibility section — "no interaction that must be discovered" — makes browser-back an unacceptable answer for the less-digital visitor.

**Fix.** Add a visible back link above the kicker mirroring the JSON-LD breadcrumb that already exists, and replace the bare string with a bordered paper note carrying a reason, a link to `/kalender`, and a link back to the team. Reuse `TicketStub` or `TapedCard`, not new markup.

**Suggested command:** `/impeccable onboard`

### [P1] English position values leak onto squad cards and silently gut the position grouping

`player.repository.ts:68-70` falls through to the raw `positionPsd`. Live: one card on `/ploegen/eerste-elftallen-a` reads **`DEFENDER`**; the single card on `/ploegen/reserven` reads **`attacker`**. Sanity's own schema constrains `position` to Dutch, so any player whose Sanity field is unset renders English. Second-order: `SquadGrid.tsx:19` matches the exact string `"Verdediger"`, so those players also miss their bucket — the flagship team partitions into `Doelmannen 4` / `Spelers 25`, and three of the four designed groups never fire.

**Why it matters.** PRODUCT.md Operating Context: "Language: Dutch throughout the UI (labels, slugs, display values)." And it means the four-group front-to-back ordering is design work that has never reached a user.

**Fix.** Map `positionPsd` through a `PSD_POSITION_LABELS` record before the fallback chain — exactly as `TeamStaff.tsx:28-33` already does for function codes — and make `SquadGrid` match case-insensitively so an unmapped future value degrades to the catch-all instead of shipping raw English.

**Suggested command:** `/impeccable clarify`

### [P1] The team detail page has no `<h2>`, so its three advertised sections are invisible to heading navigation

`grep "level={2}\|<h2"` across `StandingsTable`, `TeamMatchesSection`, `SquadGrid` and `TeamStaff` returns **nothing**. Measured heading order on `/ploegen/eerste-elftallen-a`: `H1 "A-ploeg." → H3 "Doelmannen" → H3 "Spelers" → H2 "Met dank aan onze sponsors."` The first `<h2>` a screen-reader user reaches is the sponsor block; `#staf` has no heading at any level; every team-detail page skips h1→h3. On a youth page the only content `<h2>` is `TeamEnrolmentCta` — the recruitment ad.

**Why it matters.** The sticky nav advertises three sections that do not exist in the heading outline, so the two navigation systems disagree. `TeamSectionNav` also carries no `aria-current` and no focus style (both greps empty), and real keyboard Tab yields Chrome's default `outline: rgb(0,95,204) auto 1px` rather than DESIGN.md's 2px jersey-deep ring at 2px offset — only 1 of 87 focusable elements on the A-team page opts into the spec'd utility.

**Fix.** Give each gated section a real `<h2>` inside its `PageContainer`, add `aria-current` to the section nav, and decide whether the focus ring is opt-in per element or a base-layer default (site-wide question — see #2530).

**Suggested command:** `/impeccable harden`

## Persona Red Flags

**Wendy, mother of a U8, checking training times on a Thursday evening** (project-specific, derived from PRODUCT.md's second primary audience). Her task fails completely and every step is measured: `/ploegen/kcvve-u8` has no training schedule (`TeamEditorial` renders on 0 of 16 teams), no contact block, no fixtures section. The section nav offers exactly two links. Staff is three cards, **two of which read `STAF`** — she cannot tell which one is the trainer, and there is no phone or email. The largest, most prominent band on her child's page is **"Word lid — Sluit je aan bij de jeugd van Elewijt"** at display-lg on jersey-deep. Her child joined last season. Following "Volledige kalender →" gives "GEEN WEDSTRIJDEN GEPLAND." and no way back. She leaves with nothing, having been sold a membership she already has.

**Casey (distracted mobile, sideline).** "Volledige kalender →" measures **19.25px tall** with zero vertical padding — the only route to the full fixture list. Section-nav links measure **27px**. On `/ploegen/eerste-elftallen-a` at 390px the same fixture (`12 aug · VK Ninove · 20:00`) renders twice inside the first ~600px — once in `MatchStripSlot`, once as "Eerstvolgende". The competition caption under every score is 9px; on the A-team page **53 elements render `#6b6b6b` at ≤11px, 42 of them at 9px**. In daylight that line is gone. And `/ploegen/eerste-elftallen-a/wedstrijden` overflows horizontally by **31px** at 390px, traced to two elements in the `sm:hidden` mobile row (`TeamAgendaRow.tsx:392` and `:423-428`).

**Sam (screen reader / keyboard).** Navigating by heading on a team page goes team name → position group → _sponsors_; the three sections the nav advertises never appear. No `aria-current`, so activating an anchor gives no confirmation of position. No focus style on the section nav.

**Jordan (confused first-timer).** Clicks `A-PLOEG` in the nav and lands on a page headed "A-ploeg."; clicks `Reserven` from `/ploegen` and lands on **another page headed "A-ploeg."** He concludes he has not navigated. The tab says "Eerste Elftallen A", the heading says "A-ploeg.", the share card says "Eerste Elftallen A".

**Riley (edge-case stress tester).** `/ploegen/kcvve-u10p` has `squad = 0`, an `<h1>` duplicating `kcvve-u10`, and is still a tappable card on `/ploegen`. The A-team fixture list publishes **"KCVV Elewijt — 19:00 — KCVV Elewijt"** on 22 Aug as a clickable row (known pitch-reservation data, published unqualified). The sticky nav stays pinned at `top: 64px` while the site footer is on screen.

## Minor Observations

- **`Reserven` — a senior side — is filed under `<h2>Jeugdwerking</h2>`** on `/ploegen`, as the _first_ group above Bovenbouw.
- **Every youth card carries a redundant second line.** `YouthDirectory.tsx:108-113` gates the sub-line on a comparison that is true for all 16 cards because every name carries the "KCVVE " prefix. 13 cards repeat the caption, 1 contradicts it, only 2 are load-bearing — and for those 2 the discriminator sits at 10px under a 24px display line. The hierarchy is exactly inverted.
- **The hero meta pill and the tagline render verbatim identical strings** — `"3e Nationale VV A"` twice on the A-team, `"Reserven VV AH"` twice on Reserven.
- **The "Seizoen" ticket stub never renders for senior teams**: `season` is null on all of them, so one of the hero's most characterful artefacts is invisible on the club's three most-visited pages.
- **Five team `<title>`s carry a double space** (`KCVVE  U15`, `KCVVE  U13`, `KCVVE  U11 `, `KCVVE  U9`, `KCVVE  U6`) — stray whitespace in the Sanity `name` field.
- **Zero eager images across all six pages.** No `next/image` `priority` anywhere on this surface; every LCP candidate is `loading="lazy"` with no `fetchpriority`.
- **Loading-skeleton parity, four defects.** `[slug]/loading.tsx:73` draws a `rounded-full h-16 w-16` circle where `PlayerCard.tsx:37` renders an `aspect-[3/4]` rectangle — a staff-card shape standing in for a squad card, breaking the sharp-corner rule too. `:49` uses `border-y-2` where `TeamSectionNav.tsx:31` deliberately dropped the top border. `:51` renders 4 nav pills where real pages render 2–3. And `ploegen/loading.tsx:43` draws youth cards at `h-20`/`minmax(120px,1fr)` against a measured real card of 212px at `minmax(150px,1fr)`.
- **`ploegen/loading.tsx` uses bare `animate-pulse`** (lines 10, 25, 36) while its sibling `[slug]/loading.tsx` correctly uses `motion-safe:animate-pulse`.
- **Sticky chrome overlaps its own anchors.** Header 65px + section nav 47.75px = 112.75px against a `scroll-margin-top` of 104px at five sites, so an anchor jump lands ~8px behind the bar. The nav also sits 1px under the header.
- **`#ffffff` is the one off-palette colour** in `<main>` (11× on the A-team page), used as `text-white` on jersey-deep — the open reconciliation already tracked in #2421.
- **IBM Plex Mono renders nowhere** (`document.fonts.check` false on all six pages; 43–210 `.font-mono` elements per page fall back to the system stack). Site-wide, already owned by #2533 / #2520 — recorded here only because every type judgement on this surface is currently made against the wrong face.
- **`StandingsTable` has no `<caption>` and no visible heading** — only `role="region" aria-label="Klassement"`. When it does start rendering it will land as an unheaded table under a nav link.
- **`auto-fill` leaves ragged tracks**: at 1372px the youth grid computes 7 columns; the `Reserven` group holds 1 card and ~1050px of empty page.
- **Ruled out, not findings.** Section anchors and `AgendaScrollToNext` do work — smooth scroll is throttled while the extension backgrounds the tab. The "blank" flagship photos in early captures were pre-paint artefacts. Zero site-origin console errors on all six pages. No off-palette neutral grey: `#6b6b6b` is the palette's own `ink-muted`.

## Questions to Consider

1. DESIGN.md deleted four nav dropdowns on the argument that in-page section anchors on `/ploegen/[slug]` index the page better than a transient panel could. That index measures 3 links on a senior page and 2 on a youth page, with no active state, and the nav has no `/ploegen` entry to reach the index that would list them. Is the claim still true, or was it true only of the page the PRD imagined?
2. PRODUCT principle #3 says "a layout that needs a field the source may omit is a broken layout." `SquadGrid` needs four position values and PSD supplies one for 24 of 29; `TeamEditorial` needs a training schedule and Sanity has none for any team; `StandingsTable` needs a table and none exists anywhere. By the project's own rule, are these three broken layouts — or is the content pipeline the unfinished deliverable and the components innocent?
3. The homepage refuses to rank its two audiences and defends the refusal at length (principle #6). The team page ranks them by omission: senior pages get fixtures, youth pages get a recruitment ad. What is the youth team page's tail?
4. `page.tsx:8` describes the auto-hide as degrading gracefully. A U6 page showing squad, staff and a sales pitch — with no trace of the fixtures, table, training times or contact a first-team page implies exist — reads as unbuilt, not degraded. Would one line of paper-register copy per absent section cost anything the design cares about?
5. Three of sixteen team pages ship a heading naming a different team and no test caught it. `nav-reachability.test.ts` guards that every nav destination resolves; nothing guards that every destination is distinguishable. Is `<h1>` uniqueness across a route family a design invariant worth a test, or is that the CMS's problem?
