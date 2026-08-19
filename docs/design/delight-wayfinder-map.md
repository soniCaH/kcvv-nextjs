# Homepage delight — findings map (`apps/web`, 2026-08-12)

> Not yet filed. When it is, the issue becomes canonical — update it there, not here.

Visual instrument: [`docs/design/mockups/homepage-delight/candidates.html`](mockups/homepage-delight/candidates.html) — four moments, three candidates each, candidate A always the shipped baseline. Throwaway; nothing in it is imported from `src/`.

## Destination

`apps/web` has a **written motion and response vocabulary**, so a component that wants to acknowledge something has one place to look — and the homepage's four undecided moments (waiting, the off-season, the sponsor logo on a phone, the drawn match) each have a decided answer rather than a default.

Three of those four were never decided because there was nowhere to decide them. **The off-season is different**: it _was_ decided, built and tested, and then half-deleted — see its Note below. It is a defect, not a design gap, and it is the only item here doing damage today.

The walk **decides, it does not build.** Each ticket resolves to one rule plus the files that must change; `/spec` then makes it ready for `/ralph`. Like [#2490](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2490) and per [#2425](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2425), this map is **not a go-live blocker** — it runs alongside.

Baseline measured 2026-08-12 against `main` at `3cf10b62`.

## The constraint every finding here runs into

PRODUCT.md principle 6: **the homepage does not declare a primary section.** Its bands sit at one weight by deliberate choice; five ranked alternatives were built and rejected ([#2408](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2408)).

Delight is emphasis. So delight landing on the _content_ of any band re-ranks a page that refuses ranking. What is left — and what all four moments below are — is delight on the **states the page passes through** (waiting, absence, failure) and on its **connective tissue** (seams, chrome, the sheet itself). Any ticket here that starts arguing a band deserves more weight has left the map.

Principle 1 carries the same warning one level down: the result is a **legibility** requirement, "not a ranking one, and this principle must never be cited to argue that it outranks the rest of a page." Ticket 7 is where that bites.

## Notes

### DESIGN.md has no Motion section — that is the finding the map hangs on

Eight top-level sections: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. **Motion is not one of them.** Everything the document says about movement is four scattered sentences:

| Where             | What it says                                                            |
| ----------------- | ----------------------------------------------------------------------- |
| Overview `:157`   | "motion-heavy hero video" named as a big-club anti-reference            |
| Elevation `:283`  | The Press-Down Rule — the translate is `motion-safe:`, the shadow isn't |
| Components `:335` | Disabled fields freeze "all motion"                                     |
| Do's `:377`       | Restates the press-down                                                 |

There is no duration scale, no easing, no policy on what may loop, no statement of what reduced motion means beyond that one press-down sentence, and no named rule the way every other axis has two or three. So there is no document to check a delight proposal against — which is why the four moments below all read as oversights rather than decisions. **They were never decided; there was nowhere to decide them.**

### Tailwind's animation namespace is live and unreset — the third instance of the same bug

`grep -rn '\-\-animate-' src` returns **nothing**. Tailwind v4 is CSS-first with no `tailwind.config.*`, so `@theme` in `globals.css` is the only reset point, and it never resets `--animate-*`. Tailwind's default `animate-pulse` / `animate-spin` / `animate-bounce` therefore sit alongside the project's own five keyframes with nothing distinguishing them.

This is structurally identical to [#2490](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2490)'s ramp B (`--text-*` never reset, 124 uses) and ramp B′ (`--leading-*` defined nowhere, 122 uses). Three namespaces, one cause. Worth saying once, in one place, rather than a third time per-axis.

### 69 of 113 `animate-pulse` uses are unguarded — that is an accessibility defect, not a taste question

113 non-test uses across 32 files. **69 of them carry no `motion-safe:` prefix**, so a visitor with reduced motion set gets an oscillating skeleton:

| File                                       | uses | guarded | unguarded |
| ------------------------------------------ | ---: | ------: | --------: |
| `(main)/hulp/loading.tsx`                  |   11 |       0 |    **11** |
| `(main)/scheurkalender/loading.tsx`        |    7 |       0 |     **7** |
| `(landing)/jeugd/loading.tsx`              |    6 |       0 |     **6** |
| `(main)/tegenstander/[clubId]/loading.tsx` |    6 |       0 |     **6** |
| `(main)/kalender/loading.tsx`              |    5 |       0 |     **5** |
| `club/BestuurPage/BoardPageLoading.tsx`    |    5 |       1 |     **4** |
| `(landing)/nieuws/loading.tsx`             |    4 |       0 |     **4** |
| `match/MatchEvents/MatchEvents.tsx`        |    4 |       0 |     **4** |
| `(main)/ploegen/loading.tsx`               |    3 |       0 |     **3** |
| `match/MatchLineup/MatchLineup.tsx`        |    3 |       0 |     **3** |
| `organigram/HubSearch/HubSearch.tsx`       |    3 |       0 |     **3** |
| _9 further files_                          |   14 |       0 |    **14** |
| **the rest (guarded)**                     |   44 |      44 |         0 |

The homepage's own `(landing)/loading.tsx` is **clean** — 8 uses, all `motion-safe:`. Its siblings in the same route group are not. DESIGN.md's Press-Down Rule already establishes the project's position ("the translate is gated behind `motion-safe:`"); nothing extends it to skeletons because nothing had to.

### The club owns a loading device and its front door does not use it

`.kcvv-spinner-scarf` (`globals.css:40–168`) is a barber-pole club scarf: a `-45°`-rotated repeating stripe scrolling a clean 80px per 1.5s cycle to dodge sub-pixel seams, in four sizes, three colourways, with `prefers-reduced-motion` handled at `:165`. It is the most product-specific object in the entire CSS file.

`<Spinner>` is mounted at **exactly one** non-test call site, site-wide: `search/SearchInterface.tsx:312`.

Meanwhile every `loading.tsx` in the app — including the homepage's — waits with Tailwind's default. The club built a scarf and puts it on the search box.

### Two keyframes are dead, one of them from a component that no longer exists

- `@keyframes fadeIn` + `.animate-fadeIn` (`globals.css:237–250`) — **0 consumers.**
- `@keyframes carousel-progress` + `.carousel-progress-fill` (`globals.css:964–977`) — **0 consumers**, and `find src -iname '*Carousel*'` returns nothing. `<HomepageHeroCarousel>` was retired by R1.B (see the docblock at `(landing)/page.tsx:9-12`); its progress-bar animation was not.

Live keyframes: `kcvv-scarf-scroll`, `kcvv-spinner-dot-pulse` (both via `.kcvv-spinner-*`), `spotlight-pop` (2 consumers, `OrganigramExplorer`). Plus one lone `animate-in fade-in` at `layout/NavTakeover/NavTakeover.tsx:106` — a `tailwindcss-animate` idiom used once and nowhere else.

### A drawn match gets no mark at all

`OUTCOME_UNDERLINE` (`lib/utils/match-display.ts:106–113`) is the whole system response to a result:

```ts
win:  "inset 0 -9px 0 color-mix(in srgb, var(--color-jersey-deep) 34%, var(--color-cream))",
draw: undefined,
loss: "inset 0 -9px 0 color-mix(in srgb, var(--color-alert)      38%, var(--color-cream))",
```

Two things follow. **A draw is indistinguishable from an unplayed row** — `undefined`, no band, nothing. And the win/loss band is 34–38% mixed into cream, i.e. a pale wash, on a page PRODUCT.md explicitly designs for "a phone held in daylight on the sideline." Whether that band survives that scene has never been measured; ticket 8 measures it.

This is the site's most emotional recurring moment and its response is one soft 9px edge with a hole in the middle of the three cases.

### The off-season was already solved, and half of it was deleted

**This is not a missing design. It is a live editorial trap.** The first pass of this map framed the off-season as an undesigned empty state and proposed inventing one; that framing was wrong and is corrected here.

[#1349](https://github.com/soniCaH/www.kcvvelewijt.be/issues/1349) (April 2026) shipped a purpose-built off-season component for the homepage matches block:

- `components/home/MatchesSliderEmptyState/MatchesSliderEmptyState.tsx` — 201 lines
- `decisionRule.ts` — 76 lines, **four modes**: `baseline` (eyebrow TUSSENSEIZOEN) · `countdown` (NIEUW SEIZOEN + days until kickoff) · `today` · `announcement` (MEDEDELING), with calendar-day diffing anchored to `Europe/Brussels`
- `decisionRule.test.ts` — 117 lines
- driven by a Sanity object `matchesSliderPlaceholder`, titled for editors **"Placeholder wedstrijdenblok (tussenseizoen)"**, with `nextSeasonKickoff` (date), `announcementText` (≤80 chars), `announcementHref`, and a `highlightImage` override

`aeed5e41` ([#1922](https://github.com/soniCaH/www.kcvvelewijt.be/issues/1922)) deleted the renderer out of `_legacy/` during the redesign. **Everything editor-facing survived:**

| Half                 | Where                                                     | State                  |
| -------------------- | --------------------------------------------------------- | ---------------------- |
| Schema               | `packages/sanity-schemas/src/matchesSliderPlaceholder.ts` | **live**               |
| Studio registration  | `index.ts:43,70,101` + `homePage.ts:43-45`                | **live, both studios** |
| GROQ query           | `homepage.repository.ts:30` `HOMEPAGE_PLACEHOLDER_QUERY`  | **live**               |
| View-model + fetcher | `toPlaceholderVM` `:97`, `getPlaceholder()` `:144`        | **live**               |
| Renderer             | —                                                         | **deleted**            |
| Call site            | `getPlaceholder()` is called from **nowhere**             | **none**               |

So a volunteer editor can open Studio today, fill in "Aftrap nieuw seizoen" and a mededeling, publish — and nothing happens anywhere on the site. PRODUCT.md → Operating Context names this exact class of cost: _"Authoring friction is a real product constraint, not a nicety."_ An input that silently does nothing is worse than an absent one.

**The off-season also drops a whole band.** `(landing)/page.tsx:370-379` sets `upcomingMatchesSection` to `null` when `upcomingMatches.length === 0`, so the agenda band vanishes from the spine entirely — the same failure [#2399](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2399) fixed for `<FirstTeamsBlock>` (which now holds its shape and names the reason) and never applied to its neighbour. `<FeaturedEventBand>` behaves the same way. Off-season the homepage is therefore two bands shorter **and** carrying "Nog geen wedstrijden ingepland."

`<BannerSlot>` A/B/C are wired and do render, so an editor can put something in the summer today — but a banner is an image with a link, not the countdown-and-announcement mechanism the club already specified and built.

**How long this state lasts is still not established** and must not be asserted from the calendar — ticket 5 measures it off the real feed.

### DESIGN.md contradicts itself about sponsor logos, and the phone loses

Three tiles render the same treatment — `grayscale … group-hover:grayscale-0 group-focus-visible:grayscale-0`:

- `sponsors/SponsorTile/SponsorTile.tsx:43`
- `sponsors/HoofdSponsorTile/HoofdSponsorTile.tsx:40`
- `sponsors/FeaturedSponsorCard/FeaturedSponsorCard.tsx:43`

Neither `:hover` nor `:focus-visible` fires for a supporter scrolling on a phone. So on the device PRODUCT.md names as the realistic scene, **a paying sponsor's logo is permanently greyscale.**

Two rules in the same documents give opposite answers:

- DESIGN.md → Do's: _"keep photographs in colour…; greyscale-to-colour-on-hover belongs to sponsor logos alone."_ — sanctions it.
- DESIGN.md → Don'ts: _"**Don't** rely on hover to reveal anything necessary — the primary usage scene is a phone, outdoors."_ — forbids it.
- PRODUCT.md → principle 4: _"Sponsors get real estate, not decoration."_ — and principle: sponsors are a **commercial obligation**.

Nobody has decided which wins, because the greyscale rule was written as a photography rule and never tested against the no-hover scene. This is a contradiction to resolve, not a design to mock up.

**Decided:** [#2511](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2511) resolved this — the wall's rule wins; `/sponsors` is a second, narrower exception. Built in [#2655](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2655). See ticket 6 below — this map stays open per its own rule (a map closes on graduation, not on build). **Canonical: `apps/web/DESIGN.md`.**

### One thing that looks like a finding and is not

The motto — "Er is maar één plezante compagnie", PRODUCT.md's _only_ sanctioned tagline — is the homepage's `<title>` (`(landing)/page.tsx:77`) and appears in body copy at `SiteFooter.tsx:42`, `HistoryTimeline.tsx:41`, `(main)/ploegen/page.tsx:77` and `TeamEnrolmentCta.tsx:103`. It appears **nowhere in the homepage's own body.**

That reads like an omission and is not one. [#2422](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2422) decided the homepage tail is audience-neutral by design and that **the club's signature is the footer's job, not a second identity band**. Recorded here so the next walk does not re-open it. If anyone wants it re-opened, that is a change to principle 6, not a delight ticket.

## How to re-derive every number here

Per the #2425 lesson — charted measurements go stale, so re-run rather than trust. From `apps/web`:

```bash
# animate-pulse: total, and the unguarded subset (the 113 / 69)
grep -ro "animate-pulse" src --include='*.tsx' | grep -vE '\.(test|stories)' | wc -l
for f in $(grep -rl "animate-pulse" src --include='*.tsx' | grep -vE '\.(test|stories)'); do
  t=$(grep -o "animate-pulse" "$f" | wc -l); g=$(grep -o "motion-safe:animate-pulse" "$f" | wc -l)
  [ $((t-g)) -gt 0 ] && printf "%-58s %3d %3d %3d\n" "$f" "$t" "$g" "$((t-g))"
done

# Tailwind's animation namespace — expected: no output, that IS the finding
grep -rn '\-\-animate-' src

# every keyframe and whether its class has a consumer
grep -oE '@keyframes [a-zA-Z-]+' src/app/globals.css
for c in kcvv-spinner-scarf kcvv-spinner-pulse animate-fadeIn carousel-progress-fill spotlight-pop; do
  printf "%-24s %s\n" "$c" "$(grep -rn "$c" src --include='*.tsx' --include='*.ts' | wc -l)"
done

# <Spinner> mount sites (expected: 1)
grep -rn "<Spinner" src --include='*.tsx' | grep -vE '\.(test|stories)'

# sponsor greyscale treatment
grep -rn "grayscale" src/components/sponsors --include='*.tsx' | grep -vE '\.(test|stories)'

# DESIGN.md's section list — expected: no "## Motion"
grep -n "^## " DESIGN.md
```

## Read first

`apps/web/DESIGN.md` — Overview (the three anti-references) and Elevation's **Press-Down Rule**, which is the only motion policy that exists · `apps/web/PRODUCT.md` — **principle 6** (the homepage declares no primary section), **principle 1** (the result is legibility, not rank), **principle 4** (sponsors get real estate), and Accessibility (the sideline-phone scene) · `globals.css:40-168` for the scarf, `:237-250` and `:964-977` for the two dead blocks · `lib/utils/match-display.ts:106` for `OUTCOME_UNDERLINE` · `components/home/FirstTeamsBlock/` for the held-open register · [#2408](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2408) and [#2422](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2422) before arguing anything about homepage hierarchy · the mockup above for what each candidate costs.

## Tickets

Ordered cheapest-and-most-constraining first. Nothing is claimed yet.

**1, 3 and 5 need no design decision and are blocked by nothing** — an accessibility defect, dead CSS, and a half-deleted feature. They can start today. Everything else waits on ticket 2, because there is no motion vocabulary to decide against. Ticket 5 keeps its position for numbering stability but is the one to do first if only one gets done.

1. **Guard the 69 unguarded `animate-pulse` uses** · `wayfinder:task`
   19 files, mechanical, no design decision. Reduced-motion visitors currently get an oscillating skeleton on most of the site. Do this first — it opens every file the later tickets touch, and it is the one item here that is a defect rather than a question. **Blocks nothing, but makes 2 and 4 cheaper.**

2. **Write DESIGN.md's Motion section** · `wayfinder:grilling`
   There isn't one, which is why moments 4–7 below were never decided. Outcome: a duration/easing vocabulary, a statement of what may loop, a reduced-motion policy that covers more than the press-down, and — mirroring the type ramps — a ruling on whether Tailwind's unreset `--animate-*` namespace is legal. **Blocks 4, 5, 6, 7**: each of those is a motion or response decision with nothing to decide against until this exists.

3. **Delete the two dead keyframe blocks** · `wayfinder:task`
   `fadeIn` / `.animate-fadeIn` (`:237-250`) and `carousel-progress` / `.carousel-progress-fill` (`:964-977`), the latter orphaned by R1.B's carousel retirement. Zero consumers each. Independent of everything else here.

4. **Decide the homepage's waiting device** · `wayfinder:grilling`
   Three candidates in the mockup, judged live: guarded pulse (baseline) · one scarf, bars static · the `<StripedSeam>` section rules scroll while bars hold still. The club's own device has one mount site and the front door isn't it. Constraint from the delight brief: waiting may be made informative, but **never fake work or stage a flourish that delays completion** — a sequential "printing" fill was considered and dropped for exactly that reason. _Blocked by 2._

5. **Reconnect or remove the orphaned off-season placeholder** · `wayfinder:task`
   **Not a design ticket and not blocked by 2** — this is a half-deleted feature with a live editor-facing input that does nothing. Three honest outcomes, and the ticket picks one:
   **(a) Restore.** `git show 8103b710` has the whole renderer, the four-mode `decisionRule.ts` and its tests. The rule is still sound and its Brussels-zone handling is correct for a Sanity date (the opposite rule to PSD kickoffs, which carry Belgian wall-clock in UTC fields — do not "fix" it). Restoring means reskinning 201 lines of pre-redesign markup into the current world, not pasting it back.
   **(b) Rewire only.** Keep the schema and `getPlaceholder()`, drop the old component, and let `<FirstTeamsBlock>`'s existing held-open notice read the placeholder — heading from `nextSeasonKickoff`, body from `announcementText`. Much smaller, and it reuses the register [#2427](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2427) already locked.
   **(c) Remove.** Delete the schema, the studio registration, the GROQ query and the view-model. Legitimate if the club would rather use `<BannerSlot>`, but it must be a decision — leaving it is the one option that is not.
   Whichever wins, **fix the neighbour too**: `upcomingMatchesSection` and `featuredEventSection` still go `null` on empty, so the off-season spine loses two bands. That is #2399's finding, unapplied.
   **Measure first**: how many days a year does the feed actually yield zero fixtures? Derive it from real data — do not inherit this map's discarded "about ten weeks."

   _Ask the club before (c), and before writing any summer copy: the editor-facing half is theirs, not the design system's._

6. **Resolve the sponsor greyscale contradiction** · `wayfinder:grilling`
   Not a design question — two DESIGN.md rules give opposite answers and one of them has to lose. Candidates: keep as-is · colour on `(pointer: coarse)`, greyscale-to-colour retained for mouse · colour by tier. The third turns a style rule into a price list, which makes it a **club decision, not a design one** — flag it as such rather than deciding it in a design ticket. Commercial consequence, so bring it to the board rather than settling it in a PR. _Blocked by 2._
   **Decided in [#2511](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2511), built in [#2655](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2655):** none of the three listed candidates — the wall stays as-is, `/sponsors` gets its own page-scoped exception instead. Left open here per this map's own rule — a map closes on graduation, not on build. **Canonical: `apps/web/DESIGN.md`.**

7. **Decide the draw, then decide the mark** · `wayfinder:grilling`
   `draw: undefined` means a drawn match is visually identical to an unplayed row. Settle the three-case rule **before** any candidate: any treatment that marks only a win turns the row into a scoreboard with a mood, and principle 1 forbids letting the result outrank the page. Candidates once the rule exists: the pale band as-is · a `<StampBadge>` on the row · the band's seams carry the tone and the data stays flat. _Blocked by 2 and 8._

8. **Measure `OUTCOME_UNDERLINE` in the scene it was designed for** · `wayfinder:research`
   34% jersey-deep and 38% alert mixed into cream, 9px, on a phone in daylight. Nothing in this walk rendered it — the numbers above are read off source. One session with a real device outdoors answers whether the band is a legibility failure (making ticket 7 urgent) or fine (making ticket 7 purely expressive). Cannot be done by grep. _Blocks 7._

9. **Enforcement** · `wayfinder:task`
   Nothing lints motion. `motion-safe:` coverage will re-drift the moment ticket 1 lands, the same way the type ramps did. Options: an eslint rule requiring `motion-safe:` on `animate-*`, or folding it into whatever [#2490](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2490) ticket 8 lands on — the two are the same enforcement gap on different axes and should probably ship as one rule. Last ticket, once there is a vocabulary worth enforcing.

## Not yet specified

- **Whether tickets 1–3 and 9 belong in this map at all, or in #2490.** All four are the same finding on a different axis: an unreset Tailwind namespace, an undocumented vocabulary, dead tokens, and no lint. A single "design-system drift" issue owning all axes may beat two maps that each rediscover the pattern. Decide before filing.
- **Whether any of this needs a VR baseline sweep.** Ticket 1 changes no pixels at rest and ticket 3 deletes dead CSS, so neither should. Tickets 4 and 7 change rendered output; per the [#2380](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2380) precedent a site-wide change goes through the bot, not a local scoped run. Loading skeletons are not currently VR-tested at all — confirm that before assuming a capture is even possible.
- **Whether `<Spinner>`'s single mount site is itself the finding.** This map treats the scarf as underused. The opposite reading is available: a full-page spinner is the wrong device for a streaming App Router page, and one search box is exactly the right amount of it. Ticket 4 must not assume the scarf wins by default.
- **The `animate-in fade-in` at `NavTakeover.tsx:106`.** A `tailwindcss-animate` idiom used once, nowhere else, on the mobile nav takeover. Either the drawer is a sanctioned exception or it is a fourth vocabulary with one member. Fold into ticket 2.
- **Whether the homepage's `loading.tsx` should exist in its current shape at all.** [#2432](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2432) found that a segment `loading.tsx` ships in every descendant's HTML — 6 leaking into 15 routes. If that changes what a loading file is for, ticket 4 changes with it. Check #2432's status before starting.

## Out of scope

- **The press-down interaction.** DESIGN.md's one documented motion rule, on every interactive surface, and it holds after the hundredth use. Not a delight opportunity; it is the thing delight must not contradict.
- **Adding a band, a claim, or a signature to the homepage.** Principle 6 and #2422 already decided the spine and the tail. Nothing here proposes a new section — see "One thing that looks like a finding and is not".
- **`/scheurkalender`.** Its 7 unguarded pulses are counted in ticket 1's list because they are the same mechanical fix, but the page is a private poster source, not public UI. If it complicates the sweep, drop it and say so.
- **Sound and haptics.** No surface on this site has audio and none should acquire one to be delightful.
- **`apps/studio` / `apps/studio-staging`.** Sanity Studio has its own everything.
- **Test and story files.** All counts here exclude `*.test.tsx` and `*.stories.tsx`.
