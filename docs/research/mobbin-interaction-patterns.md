# Interaction & Flow Patterns — Research

Research into **behaviour**, not visual style. Our visual language is locked (retro-terrace fanzine, see `apps/web/DESIGN.md`); every pattern below is reported as *what it does*, followed by an explicit translation into our idiom.

Researched 2026-08-13, in two passes. Mobbin's **library is behind a login wall**; its **glossary is not**, and the glossary turned out to carry the corpus statistics that make Mobbin worth citing. See the access report.

---

## 1. Access report

Two passes, because the first hit an environmental fault.

**Pass 1 — browser unavailable.** Only one browser was paired and it was unresponsive: `tabs_context_mcp` ×3 and `navigate` ×2 all timed out at the extension before any page loaded. A transport failure, not a gate.

**Pass 2 — browser working, Mobbin's library gated.** With `Browser 1` (`e6dd876c-…`) selected, `https://mobbin.com` loaded and the nav rendered **"Log in" / "Join for free"** — no active session. Navigating directly to `https://mobbin.com/browse/ios/apps` **redirected to `/?redirect_to=%2Fdiscover%2Fapps%2Fios`**, a marketing landing page. That is a hard login wall on the screenshot library. Per instructions I did not attempt to log in, did not sign up, and did not request credentials. **The Mobbin screenshot corpus was not seen.**

**What I did reach on Mobbin: the entire public glossary** (`mobbin.com/glossary`, ~55 component entries). This is the part that matters more than it sounds, and it is worth being precise about why. The glossary is not generic advice — each entry reports **what Mobbin found by counting its own corpus**: "we studied over 2,600+ segmented control components", "12,000+ stacked list components", "1,500+ table components", "6,000+ search bar components", "4,000+ empty state examples". So I could not *see* the screenshots, but I could read **the aggregate conclusions drawn from them**, which for a project with a locked visual language is the more useful half anyway. Notably these pages return **HTTP 403 to automated fetch** — they only render in a real browser, which is why pass 1 concluded they were closed.

**Also reached:** FotMob, Sofascore and OneFootball on the open web (see §6), plus the published UX research used throughout (NN/g, Baymard, Fluent/Apple).

**What remains unreached, and it is a real gap:** Mobbin's flow-by-flow screenshots. Its value is seeing twelve team-switchers side by side, and no amount of prose substitutes. Every Mobbin claim below is a *stated corpus finding*, not something I verified visually. Where that distinction matters I have said so.

---

## 2. Executive summary — highest-leverage patterns

Ranked by user benefit ÷ effort. Section references in brackets.

| # | Pattern | Why it wins | Effort |
|---|---|---|---|
| 1 | **Name which emptiness you are in** — four distinct empty states, not one sentence [3.5] | Turns "this page is broken" into "this part of the season hasn't happened". Pure copy plus a flag. | S |
| 2 | **"No stats" is a fact about the league, not the team** [3.5] | Highest dignity-per-character change available. One sentence rewrite. | S |
| 3 | **Sticky day header on the agenda** [3.2] | A dense Saturday currently loses its date after three rows. `position: sticky` + a border. | S |
| 4 | **Printed blank instead of `0-0` for unreported results** [3.3] | Removes a live factual lie from the fixture list. | S |
| 5 | **Applied-filter chips with individual removal** [3.1] | `RemovableChip` already exists; 28% of sites miss this and it is why filtered pages read as empty ones. | S |
| 6 | **Validate on blur, not on keystroke** [3.7] | Stops short volunteer forms feeling hostile. Timing change only — the eight-state field is already built. | S |
| 7 | **Recent searches in the zero state** [3.6] | Our search intent is overwhelmingly repeat. Reuses the existing chip. | S |
| 8 | **Follow-a-team persistence, no account** [3.1] | Collapses the parent's weekly journey to zero navigation. The single biggest user win here. | M |
| 9 | **Row expansion for hidden standings columns** [3.4] | Closes a real hole: W/G/V are currently unreachable on a phone. | M |
| 10 | **Jump-to-today + past/future seam** [3.2] | Makes a season-long list navigable without tabs. | S–M |

**Added by the second pass** (Mobbin glossary + the sports apps opened directly), ranked into the same scale:

| # | Pattern | Why it wins | Effort |
|---|---|---|---|
| 1= | **Counted state chips — `UITSLAGEN \| 12`, `KOMEND \| 3`** [6] | Sofascore. `FilterTabs` already renders counts after a hairline pipe. Near-zero cost, and it pre-empts the "is this empty or filtered?" confusion. | S |
| 3= | **End-of-season is a *post-completion* empty state** [3.5] | Mobbin's taxonomy caught a case NN/g's misses. A June team page currently says "Nog geen wedstrijden ingepland", which is simply false. | S |
| 4= | **Colour-coded categories always ship a printed legend** [6] | FotMob. Directly answers our colour-alone outcome underline. | S |
| 8= | **Relative-then-absolute day strip — `GISTEREN \| VANDAAG \| MORGEN \| 15 ZA`** [6] | OneFootball. Subsumes jump-to-today, carries the weekday, and maps onto `FilterTabs` almost unchanged. | M |
| 9= | **Two-line match row that never truncates** [6] | Sofascore. Fixes a live defect: `AgendaMatchRow` truncates two long club names into uselessness on a phone. | M |
| 9= | **"Next opponent" as a standings column** [6] | FotMob. The densest idea found — league position and next fixture in one glance. | M |
| — | **Component-level filters on long lists** [3.6] | Mobbin's global/page/component hierarchy names a gap: `YouthDirectory` and squad lists have no in-place filter. | M |

Findings that are not patterns but change what gets built:

- **Live-match patterns are out of scope by product decision**, not taste — `PRODUCT.md` lists live scores among the things this site does not do [3.3].
- **A 20-team segmented control is past every published ceiling** (~5 segments). Index + persistence + small-category chips is correct, and we already have all three pieces [3.1].
- **Our `FilterTabs` are tabs, not segmented controls** — Mobbin's definition turns on whether items share a track. Chips scrolling horizontally is therefore *not* a violation, which narrows the rule above usefully [3.1].
- **Standings-as-a-table is the archetype, not a compromise** — Mobbin names "sport statistics & results" as one of three canonical table cases, while warning off tables on mobile generally. That is precisely the "no choice" exception [3.4].
- **Following should be a *view*, not a setting** — Sofascore puts `Favourites` as a peer tab beside `All` [6].

---

## 3. Pattern catalogue

### 3.1 Twenty teams, one navigation

#### Onboarding-free team following ("my teams" without an account)

**What it is.** FotMob asks, on first run, which teams you follow, then filters the whole app against that set — the home screen defaults to matches, and a toggle narrows it to "only teams I follow" ([FotMob onboarding description, MWM](https://mwm.ai/apps/fotmob-soccer-live-scores/488575683); [FotMob official](https://fotmob.us/)). The critical property for us is that the choice is *one tap, reversible, and drives every subsequent screen* — not a profile setting buried in an account.

**Why it solves our problem.** A parent has exactly one question, repeatedly: when and where does U13 play. Today they re-navigate the twenty-team list every visit. Persisting one team locally collapses that to zero navigation.

**No login needed.** `localStorage` holds a slug. `PRODUCT.md` rules out accounts; this pattern does not need one. Server-render the neutral page, hydrate the personalised strip client-side (avoids caching a per-visitor page on a CDN-cached route).

**Retro-fanzine translation.** Not a rounded avatar row. A **`TicketStub` pinned to the top of `/ploegen` and the homepage** — "JOUW PLOEG" in `MonoLabel`, the team name in `EditorialHeading` subtitle size, the next fixture in mono underneath, perforated edge on the left. Setting it is a `StampBadge`-style "VOLG" stamp on each team card that, once pressed, reads "GEVOLGD" in jersey-deep. Unsetting is an ink `×` on the stub. No animation on set beyond the canonical press-down.

**Effort:** M. **Risk:** the personalised strip must not cause layout shift — reserve its height, or render it below the fold on first paint. Announce the change with `aria-live="polite"` so the stamp toggle is not silent to a screen reader.

#### Twenty teams is past every segmented-control ceiling — do not reach for one

**What it is.** The published ceilings are consistent and low. Apple's guidance is to limit segmented controls to five segments on iPhone; Fluent and the general tab literature agree that a segmented control's entire value is that *all options are visible at once*, so it stops working the moment options are hidden ([Fluent 2, *Segmented control*](https://fluent2.microsoft.design/components/ios/core/segmentedcontrol/usage); [Apple, *Segmented Controls Overview*](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/SegmentedControl/Articles/SegmentedControlBasics.html)). Beyond roughly five, the recommendation is a scrollable tab bar; beyond a moderate count, a dropdown or a real index page ([Setproduct](https://www.setproduct.com/blog/tabs-ui-design); [Lollypop](https://lollypop.design/blog/2025/december/tabs-design/)).

**Why it matters for us.** This kills a tempting idea before someone builds it. A "team switcher" segmented control across ~20 teams would be a horizontally scrolling row where the reader's own team is off-screen at rest — strictly worse than the current index page, because it hides the option set *and* costs a swipe. The literature says the right structure for 20 peers is an index, which is what `/ploegen` already is.

**The correct three-layer answer**, and each layer already has a home:

1. **Index** (`/ploegen`) — the complete, scannable set. Already exists.
2. **Persistence** — the followed team, per the pattern above, so most visits skip the index entirely.
3. **Scoped chip row** — used only where the option count is genuinely small (a *category* filter: Eerste elftallen / Bovenbouw / Middenbouw / Onderbouw is four, comfortably inside the ceiling), never as a 20-item team switcher.

**Retro-fanzine translation.** Layer 3 is `FilterTabs`, which we already own and which is already correct: paper chips, 2px ink border, `shadow-paper-sm`, mono caps, sharp corners, active state inverting to `bg-ink text-cream`, canonical press-down hover, and — importantly — it already wires `useScrollHint` + `ScrollArrowButton` for overflow. Nothing new to design; the finding is *where to apply it and where not to*.

**Effort:** S (it is a constraint, not a build). **Risk:** none. The risk is in the pattern this rules out.

**Mobbin adds a definitional correction here, and it is load-bearing.** From its study of 2,600+ segmented controls: *"While tabs and segmented control can serve the same purpose of selecting a view, the items in a segmented control are always connected by the track. If the items are separated (not connected by a track), then it becomes a tab."* ([Mobbin, *Segmented Control UI*](https://mobbin.com/glossary/segmented-control)).

By that definition **our `FilterTabs` are not a segmented control at all** — they are separated paper chips with no shared track, i.e. tabs. That matters, because the ≤5 ceiling is a property of the *track*: a segmented control must show every segment at once or the track is a lie, whereas tabs are legitimately allowed to scroll. So the correct statement of the rule for us is narrower and more useful than the one I gave above:

- **Never build a tracked segmented control for teams** — the ceiling is real and 20 breaks it.
- **`FilterTabs` scrolling horizontally is not a violation**, because chips are tabs. It is already correct, and `useScrollHint` is the right affordance for it.
- The thing to avoid is not "a scrolling chip row" but "a chip row as the *primary* way to reach one of 20 teams" — that is an index's job.

Mobbin also notes an icon-only variant used "if you have multiple segments and you don't want to take up too much space", with the caveat that icons "must be clear and distinct". For us that is a dead end regardless: teams are not iconifiable, and DESIGN.md's usage scene (phone, outdoors) argues against icon-only labels.

#### Applied-filter overview with individual removal

**What it is.** Baymard's benchmark finds 28% of sites give no overview of which filters are active, and 42% fail to surface them prominently; the recommended mobile form is a horizontally scrolling row of applied filters with a per-filter `×`, a count label ("4 Filters Applied") and a "Clear all" ([Baymard, *Display "Applied Filters" in an Overview*](https://baymard.com/blog/how-to-design-applied-filters)). Crucially: **show the actual filters, not just a count.**

**Why it solves our problem.** `/kalender` can combine team, type and month. Once a reader has narrowed twice and sees three fixtures, the question "is that all there is, or have I filtered something out?" is the exact confusion Baymard measures — and it is the confusion most likely to make our calendar look broken when it is merely filtered.

**Retro-fanzine translation.** We already have `RemovableChip` in the design system, which is precisely this component. Applied filters render as a row of removable chips under the filter bar, on a `cream-deep` band so the strip reads as a step down from the page, with `WIS ALLES` as a plain ink text link at the row's end. The `×` is a Phosphor Fill glyph, never a rounded close button. If the row overflows, cut it hard at the container edge and use `ScrollHint` — never a soft fade.

**Effort:** S — the primitive exists; this is composition and wiring. **Risk:** the strip appearing and disappearing shifts layout. Reserve its height or accept the shift only below the fold. Give it `aria-live="polite"` and a result count so a screen-reader user learns both what changed and what it produced.

---

### 3.2 A fixture list that is both calendar and archive

Grounding: `CalendarAgenda.tsx` today is **month-windowed** — it renders per-day groups for one navigated month, with a plain `<h3>` day heading and a count caption. There is no sticky day header, no "today" anchor, and no past/future distinction beyond whether a score happens to be present. That is a deliberate 6.D lock ("never a flat upcoming feed"), and the patterns below are additive to it rather than replacements for it.

#### Sticky day header that survives the scroll

**What it is.** In a date-grouped list, the group header pins to the top of the viewport while any row in that group is on screen, then is pushed up by the next group's header. NN/g's table guidance makes the same point for column headers — sticky headers exist so the reader "knows what they are looking at" mid-scroll ([NN/g, *Mobile Tables*](https://www.nngroup.com/articles/mobile-tables/)). Smashing's sticky-menu guidance adds the constraint: the sticky element must be there from the start, not slide in after a delay ([Smashing, *Designing Sticky Menus*](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)).

**Why it solves our problem.** A busy Saturday in our agenda is fifteen rows long. Scroll three rows in and the date is gone — the reader is looking at a wall of times with no day attached. This is exactly the failure the current "labelled wall" design is trying to avoid, and it reappears the moment the wall is taller than the viewport.

**Retro-fanzine translation.** `position: sticky` on the existing day-heading row, with the header sitting on a solid `cream` band and a **2px ink bottom rule** so it visually cuts the rows beneath it — a printed running head, not a floating chip. No blur, no shadow, no translucency (a translucent sticky header is a glassmorphism tell and is banned outright by DESIGN.md). Keep the existing mono 11.5px uppercase. Optionally add the perforation motif from `TicketStub` along the rule so a day boundary reads as a tear line.

**Effort:** S — it is a `sticky top-0 z-10 bg-cream` plus a border on the existing `<div>` in `DayGroup`. **Risk:** low. `position: sticky` needs no JS and no motion, so `prefers-reduced-motion` is a non-issue. Watch that the sticky offset accounts for the site header if that is also sticky, or the two will overlap.

#### The past/future seam, not the past/future tab

**What it is.** Fixture UIs generally choose one of two structures: a segmented control splitting "results" from "fixtures", or a single continuous list with today as an anchor point. FotMob's home screen takes the continuous route, layering *filters* (ongoing / on TV / by time / followed teams) on top of one list rather than splitting it ([FotMob](https://fotmob.us/)).

**Why it solves our problem.** Our data is genuinely one timeline — a season. A parent checking "did the B team win Saturday, and when do they play next" wants both halves in one scroll. Tabs would force two navigations for one question. But the *boundary* still needs to be visible, because "not yet played" and "played, score not entered" look identical otherwise (see §3.3).

**Retro-fanzine translation.** Not a tab bar — a **`StripedSeam` laid horizontally across the list at the today boundary**, with the word `VANDAAG` stamped on it via `StampBadge` at its ~2° rotation. This is the single most idiomatic thing in this whole document: we already own a full-bleed 45° two-tone band whose documented job is "a section rule", and a season split at today is exactly a section rule. Past rows sit on `cream-deep` (recede), future rows on `cream` (the page). No tabs, no toggle, no state.

**Effort:** S–M. **Risk:** `StripedSeam` is full-bleed by contract and must not be wrapped in a container (DESIGN.md, *The Full-Bleed Never Wraps Rule*) — so this only works if the agenda list is itself allowed to break out, or a non-bleed variant is agreed first. Flag before building.

#### Jump-to-today as a persistent affordance, not an auto-scroll

**What it is.** Long date-grouped lists give the reader a way back to the present without dragging. The important sub-decision is *manual, not automatic*: auto-scrolling the page to today on load steals scroll position and is disorienting.

**Why it solves our problem.** Our agenda is month-windowed, so "today" is at most one month away — but once a reader navigates back to check September, getting home is currently a month-by-month walk.

**Retro-fanzine translation.** A `MonoLabel` pill reading `→ VANDAAG` in the month-nav row, sharp-cornered, jersey-deep, using the canonical press-down. When the current month is already in view it does not disappear — it goes to the disabled treatment (50% opacity, `not-allowed`, hover neutralised), because DESIGN.md's disabled spec already exists and a vanishing control is worse than an inert one on a phone. Scroll behaviour must be `scroll-behavior: smooth` gated behind `motion-safe:`, falling back to an instant jump.

**Effort:** S. **Risk:** the reduced-motion gate is mandatory here — a long smooth scroll is a vestibular trigger and this is the one pattern in this document that can actually hurt someone.

#### Calendar subscription over calendar export

**What it is.** A one-time `.ics` download gives a snapshot; a subscribed feed (webcal) keeps updating when a fixture moves. Amateur football fixtures move constantly, so the difference is not cosmetic.

**Why it solves our problem.** We already ship `src/app/api/calendar.ics/route.ts` and a `CalendarSubscribePanel`, so the capability exists. The pattern gap is *placement*: the subscribe affordance belongs next to the team's fixture list, at the moment the parent is looking at the fixtures, not only on a central calendar page.

**Retro-fanzine translation.** A `TicketStub` at the foot of each team's fixture list — perforated edge, `MonoLabel` reading `ZET IN JE AGENDA`, and the subscribe action as the stub's tear-off half. The ticket metaphor is already load-bearing in our system and a calendar subscription is literally "keep this stub".

**Effort:** S (reuse) / M (if per-team feed filtering does not exist yet). **Risk:** none visual. Note the existing `unstable_cache` exception on that route is documented as deliberate and not to be copied.

---

### 3.3 A match that changes state over its life

**A correction to the brief first.** The brief frames this as *upcoming → live → finished*. But `PRODUCT.md`'s hard list of things this site does not do includes **live scores** (alongside tickets, shop, streaming, accounts, newsletter). So the entire live-indicator family — pulsing dots, minute tickers, animated score flips — is out of scope by product decision, not by design taste. Proposing it later would be re-opening a settled product question.

The real state machine, and it is more interesting than the broadcast one, is:

`gepland` → `bezig (unobserved)` → `gespeeld, uitslag nog niet doorgegeven` → `gespeeld, uitslag bekend`, with `uitgesteld / geannuleerd / forfait / gestopt` as exits at any point.

Grounding: `MatchStatusBadge` already models the exits well — `FT / FF / PP / STOP / CANC` with both an abbreviation and a long form, tinted by severity (`cancelled` gets `card-red`, `stopped` gets `warm`), and `matchStatusWording()` exists specifically so a status is never spelled differently on two surfaces (#2423). That is a genuinely good piece of system design. The gap is that `scheduled` returns `null` — the badge says nothing — and there is no state at all for *played but unreported*, which is the state our data spends the most time in.

#### Score reveal / spoiler control

**What it is.** The most-requested unbuilt feature in FotMob is a "hide scores" mode — users report being unable to read stats without being spoiled on concurrent games ([AlternativeTo user reports](https://alternativeto.net/software/soccer-scores--fotmob/)). Dedicated apps exist purely to fill the gap ([Spoiler-Free Sports](https://spoilerfreesports.com/)), and BBC Sport users hand-roll CSS overlays to suppress World Cup results ([theAdhocracy](https://theadhocracy.co.uk/wrote/hiding-bbc-world-cup-spoilers)).

**Why it solves our problem.** Marginal for us — we do not carry video, so the spoiler case is thin. But the *inverse* is strong: a played match whose score has not yet been entered by a volunteer is currently indistinguishable from a match that ended 0–0. The same UI machinery that hides a score can honestly say "not yet reported".

**Retro-fanzine translation.** A **blank scoreline is a printed blank, not a zero** — two ink-ruled boxes with a hairline, the way a paper programme prints an empty result grid, plus a `MonoLabel` reading `UITSLAG NOG NIET DOORGEGEVEN`. Never `0-0`, never a spinner.

**Effort:** S. **Risk:** none beyond making sure the empty state is not read as a score by assistive tech — the boxes need an accessible text equivalent, not just visual emptiness.

#### One card component, state as a prop — never one component per state

**What it is.** The state-driven card is the dominant structure in every scores app: a single fixture component that swaps its right-hand slot by status (kick-off time → score → status abbreviation), keeping the left-hand identity block (crest, teams, competition) fixed. FotMob's home list is one row component filtered and re-stated, not several ([FotMob](https://fotmob.us/)).

**Why it solves our problem.** We are close to this already — `AgendaMatchRow` conditionally renders time *and* score in the same row. The risk as states multiply is divergence: a "postponed" fixture rendering differently on the homepage than on the team page. `matchStatusWording()` was created to stop exactly that drift for wording; the same discipline should govern layout.

**Retro-fanzine translation.** A fixture row is a **printed fixture line** whose right-hand column is a fixed-width slot holding exactly one of: mono kick-off time, `NumberDisplay` score with the existing outcome underline (`inset 0 -4px 0` jersey-deep for a win, `alert` for a loss), the ruled blank for unreported, or a `MatchStatusBadge`. Fixed width matters — it is what makes a column of fixtures align down the page like a printed results grid rather than ragging.

**Effort:** M. **Risk:** the outcome underline is currently colour-only (green win / red loss). That is a colour-alone signal. Pair it with the existing `W/G/V` wording or a shape difference so the result survives colour-blindness — this is a live a11y gap, not a hypothetical one.

#### Give the exit states more room than a badge

**What it is.** Cancellation, postponement and forfeit are the states where the reader most needs *narrative* — not just a code. A postponed match's useful content is "postponed, new date to follow" or "postponed to 14/12".

**Why it solves our problem.** A parent who drives to a cancelled match is the single worst outcome this site can produce, and `PP` in a 10px badge is a thin defence against it.

**Retro-fanzine translation.** On the match detail hero, promote the exit state from badge to **`TicketStub` with the perforated tear edge** — DESIGN.md already documents perforations as belonging to "ticket-stub alerts", so this is the primitive's stated purpose. `AFGELAST` in mono caps on `card-red` with cream text, the reason in body sans beneath, and the new date as a `StampBadge` if one exists. Keep the small `MatchStatusBadge` in list contexts; escalate only on the detail page.

**Effort:** S–M. **Risk:** `card-red` with cream foreground is already the documented pairing for this exact severity, so no new colour decision is needed. Do not animate the stub in.

---

### 3.4 Dense tabular data on a phone

Grounding: `StandingsTable.tsx` currently **hides** W/G/V below `sm` via `hidden sm:table-cell`, while also wrapping the table in `overflow-x-auto`. Those two strategies are mutually exclusive in practice — because the columns are removed rather than pushed off-screen, the horizontal scroll container never actually scrolls on mobile. So we are paying for a scroll affordance we do not use, and the mobile reader has no route to the hidden numbers at all. NN/g's guidance is that hiding non-essential columns is legitimate, but only when the hidden data is reachable some other way ([NN/g, *Mobile Tables*](https://www.nngroup.com/articles/mobile-tables/)).

#### Row expansion as the escape hatch for hidden columns

**What it is.** The table shows a deliberately short set of columns; tapping a row expands it in place to reveal the rest as a labelled block. NN/g endorses both accordion-grouping of related attributes and starting rows collapsed, so the reader gets an overview plus "direct access to information of interest".

**Why it solves our problem.** It closes the exact hole above: W/G/V stop being unreachable on a phone. It also scales to squad lists, where per-player stats are far too wide for any phone table.

**Retro-fanzine translation.** The expanded panel is **not** a soft accordion — it is a `cream-soft` block that opens directly beneath the row, bounded by a 2px ink top and bottom rule, with the revealed stats as a `MonoLabelRow` (which we already own): `W 8 · G 3 · V 5`. The row's disclosure indicator is a Phosphor Fill caret, never a chevron that rotates smoothly — flip it between two Fill glyphs, or gate the rotation behind `motion-safe:`. Height animation must be `motion-safe:` too, with an instant open under reduced motion.

**Effort:** M. **Risk:** real a11y work — the row needs `aria-expanded`, `aria-controls`, and the expanded region must be a real region, not a visually-placed sibling. A `<tr>` containing a full-width `<td colspan>` is the correct markup; do not break the table semantics to get the layout.

#### Frozen first column with a cut-off scroll affordance

**What it is.** When a table genuinely must scroll sideways, the leftmost identity column is pinned so labels stay visible, and the scroll is signalled by **arrows or a visibly cut-off element** — NN/g is explicit that dots are the weakest signal because "users frequently miss them", and that forcing device rotation is a last resort that annoys people.

**Why it solves our problem.** This is the alternative to row expansion for standings, and the better one if the goal is *comparison across teams* rather than *detail on one team*. Position + team name stay pinned; M/W/G/V/+−/Ptn scroll under them.

**Retro-fanzine translation.** The frozen column gets a **2px solid ink right border** as its seam — in a system where borders are the primary structural device, that is the natural "this column is pinned" signal, and it doubles as the cut-off edge. The scroll hint is our existing `ScrollHint` component; per the two-registers note in project memory, standings sit on paper so use the paper register. Never a gradient fade — a soft fade-out is a blur effect and violates *The No Blur Rule*. Cut the content hard at the border instead.

**Effort:** M. **Risk:** `position: sticky` on a `<td>` inside `overflow-x-auto` is well-supported but needs a background colour on the sticky cell or rows will show through — and that background must be the row's own tone, including the jersey-deep-tinted KCVV highlight row, or the highlight will visibly break at the seam.

#### Choose one strategy per table, by task

**What it is.** NN/g frames table design around which of three tasks the reader has: find one record, compare records, or act on data. The strategy follows the task, and mixing strategies is what produces our current dead `overflow-x-auto`.

**Why it solves our problem.** It gives a decision rule instead of a preference. **Standings = compare** → frozen column + horizontal scroll, no expansion. **Squad list = find one person** → drop the table entirely on mobile and render one card per player, since comparison across players is not the job. That split also resolves the "dense tabular data" problem without inventing anything.

**Retro-fanzine translation.** The squad card-per-row is already largely built (`SquadGrid`, `PlayerFigure`); the change is to stop thinking of the squad as a table that degrades and start treating the card as the mobile-native form. Cards are `TapedCard` at sub-degree rotation, one per player, shirt number in `NumberDisplay`.

**Effort:** S (decision) + whatever the chosen strategy costs. **Risk:** none — this is a rule, not a component.

**Mobbin corroborates this split from both sides, and names our exact use case.** Its table entry (1,500+ components studied) lists **"Sport statistics & results"** as one of only three canonical table patterns: *"Tables are ideal for showing scores, rankings, or player statistics across different teams and matches"* ([Mobbin, *Table UI*](https://mobbin.com/glossary/table)). So standings-as-a-table is not a compromise — it is the archetypal case.

But the same entry is blunt about the phone: *"Try to avoid tables in mobile devices unless you have no choice — especially if you have too many columns or rows"*, because mobile forces horizontal scrolling. And the stacked-list entry (12,000+ components, Mobbin's largest sample of the ones I read) states the preference outright: *"Mobile designers tend to prefer stacked lists over table UI components. Tables require dual axis scrolling, which makes UX more complicated on a mobile screen"* ([Mobbin, *Stacked List UI*](https://mobbin.com/glossary/stacked-list)).

Mobbin's own framing of the boundary is the cleanest formulation of our rule I found anywhere: *"Stacked lists are a type of table with a single column."* Which gives the decision rule directly:

- **Standings** — genuinely multi-dimensional, and comparison across rows is the whole point. Keep the table; accept dual-axis scrolling; pin the identity column (§3.4). This is the "no choice" case Mobbin allows.
- **Squad** — one entity per row, no cross-row comparison. A stacked list, i.e. a single-column table. Not a degraded table.

**One caution from the same entry, aimed straight at us.** Mobbin distinguishes *standard* stacked lists (divider-separated, compact) from *card-based* ones, and warns card-based is *"less compact compared to the standard stacked list — and may lead to excessive scrolling."* Our fanzine instinct is to reach for `TapedCard` for everything. On a dense fixture list that instinct is wrong, and `CalendarAgenda`'s existing 6.D "labelled wall" lock — dashed-divider rows, no bordered card — already resists it. Mobbin's 12,000-component sample independently supports that call. It also notes *"dividers are optional"*, which is worth knowing but is not our idiom: a ruled page is the fanzine, so keep the dashed divider.

---

### 3.5 Empty and thin states

Grounding: we already have empty states, and they are honest but interchangeable — `Geen wedstrijden of evenementen deze maand.`, `Nog geen uitslag`, `Nog geen gebeurtenissen in deze wedstrijd.`, `Nog geen hulpvragen beschikbaar.` All are centred mono text with `role="status"`. That is better than most amateur club sites manage. The gap is that they do not distinguish *kinds* of emptiness, and a B team in the lowest series hits several of them at once, which compounds into a page that reads as broken.

#### Name which of the four emptinesses you are in

**What it is.** Empty states come in four distinct flavours — first use, user-cleared, error, and no-data/no-results — and the copy must differ because the reader's next action differs ([UXPin](https://www.uxpin.com/studio/blog/ux-best-practices-designing-the-overlooked-empty-states/); [Carbon Design System](https://carbondesignsystem.com/patterns/empty-states-pattern/)). NN/g's first guideline is *communicate system status*, precisely because an empty container otherwise reads as "still loading" or "I broke it" ([NN/g, *Designing Empty States in Complex Applications*](https://www.nngroup.com/articles/empty-state-interface-design/)).

**Why it solves our problem.** For a B team the honest answers are all different, and all currently collapse into one sentence:

- *No fixtures published yet* → the season has not been drawn. Temporary, nobody's fault.
- *No stats* → the series does not publish them. Permanent, and not a deficiency of this team.
- *No photos* → nobody has sent any in. Actionable — by the reader.
- *Fetch failed* → our problem, not theirs.

Saying which one it is turns "this page is empty" into "this page is complete, and this part of the season has not happened yet."

**Retro-fanzine translation.** This is where our idiom has a genuine advantage over glossy SaaS, and the translation is the point of the pattern. A SaaS empty state is a pastel spot illustration and a friendly apology. Ours is **a printed blank on a form**: a `cream-soft` panel bounded by a 2px ink rule, a `MonoLabel` naming the state (`NOG GEEN KALENDER`, `GEEN STATISTIEKEN IN DEZE REEKS`), and one line of body sans stating the fact without apologising. No illustration, no sad face, no "Oops!". A printed programme that has a blank results grid for next month does not apologise for it — the blank *is* the design, and it signals a season in progress. Where an action genuinely exists (photos), it is a `StampBadge`-style CTA (`STUUR JE FOTO'S IN`), not a pastel button.

**Effort:** S per state, M to sweep all of them. **Risk:** keep `role="status"` — that is already right. Do not attach `aria-live` to a state that is present on first paint; it is only correct for states that appear after an interaction.

**Mobbin's taxonomy differs from NN/g's in one way that earns its keep.** Drawing on 4,000+ empty-state examples, it names four types: *first-time use*, *no results found*, **post-completion**, and **feature education** ([Mobbin, *Empty State UI*](https://mobbin.com/glossary/empty-state)). The two in bold are absent from the NN/g framing and one of them is genuinely ours:

- **Post-completion** ("you're all caught up") — Mobbin's example is GitHub's cleared inbox. We have one real instance: **the end of the season.** A team page in June is not missing fixtures, it is *finished*. That deserves `SEIZOEN AFGELOPEN` and a final-standings pointer, not `Nog geen wedstrijden ingepland.`, which is currently what it would say and which is simply wrong.
- **Feature education** — the case for our calendar-subscribe affordance (§3.2): the empty state is where you teach that fixtures can be subscribed to.

Mobbin also answers the question this raises: *"Should every empty state have an action button? Not always… informative states might not require action."* Good — an end-of-season state has nothing to ask for, and forcing a CTA there would be the apologetic register we are trying to avoid.

**Where Mobbin is actively wrong for us**, and it is worth recording because someone will cite it: its stated do's include *"Incorporate illustrations or icons to make the empty state visually appealing and engaging"*, and its FAQ lists "Visual appeal: Includes engaging visuals or illustrations" as a defining property of a good empty state. That is the glossy-SaaS reflex named in §4. Our answer is the printed blank — and it is not a compromise, it is a *better* fit for the actual content, because a fixture list with nothing in it is a real thing that exists in print and needs no mascot to explain it.

#### Absence of stats is a property of the competition, not of the team

**What it is.** NN/g's second guideline — *provide learning cues* — is that an empty state is the natural place to teach something, at the moment it is relevant.

**Why it solves our problem.** This is the single highest-dignity change available to us. "Geen statistieken" reads as *this team is too unimportant to have stats*. "In deze reeks worden geen individuele statistieken bijgehouden" reads as *a fact about the league*. Identical data, opposite emotional result, and the second one is also simply more true.

**Retro-fanzine translation.** A one-line mono footnote under a 2px ink rule, set like a printed asterisk note at the foot of a programme page. `text-label-sm` (10px) is the right register — it is a label attached directly to body content, which is exactly the documented use of that step.

**Effort:** S — copy change plus a per-competition flag. **Risk:** none.

#### Thin ≠ broken: hold the layout

**What it is.** The failure mode of a data-poor page is not the empty message, it is the *collapse* — sections vanish, the page becomes two screens tall, and it reads as a stub.

**Retro-fanzine translation.** Keep the section headers and their rules even when the body is a blank. A `SectionHeader` followed by an ink rule followed by a printed blank is a page with structure; the same page with the section deleted is a page that looks unfinished. This is a print instinct and it happens to be the right product instinct.

**Effort:** S. **Risk:** do not overshoot into rendering skeleton loaders permanently — a skeleton means "loading", and a permanent one is a lie. (Also: skeletons in this system must be sharp-cornered, per DESIGN.md.)

---

### 3.6 Search and wayfinding

Grounding: `/zoeken` already has scoped search done well — `SearchFilters` renders `FilterTabs` with per-type result counts (`Alles / Nieuws / Spelers / Staf / Ploegen`), and `SearchPreSearchCard` fills the zero state with three static example chips. The counts-in-tabs pattern is the one Baymard-style behaviour most sites miss, and we already have it.

#### Recent searches in the zero state

**What it is.** The zero state — search focused, nothing typed — should carry recent queries rather than only static examples; prior searches are the fastest path back to a repeated task ([IxDF, *How to Design for Mobile Search*](https://www.interaction-design.org/literature/article/navigating-the-maze-of-mobile-apps-design-for-mobile-app-search)).

**Why it solves our problem.** Our search traffic is overwhelmingly repeat-intent: the same parent looking up the same team or the same player. Static examples teach the *shape* of a query once; recents serve the actual repeated query forever.

**Retro-fanzine translation.** Reuse the exact chip already in `SearchPreSearchCard` — bordered, `2px 2px 0` shadow, mono 11px uppercase — under a `MonoLabel` reading `RECENT GEZOCHT`, with the existing static examples staying underneath as a second row for first-time visitors. No clock icons. `localStorage`, capped at five, with a `WIS` (clear) control.

**Effort:** S. **Risk:** privacy — recents are user-authored input, so per repo convention they must never be forwarded to analytics unsanitised. Store locally only; do not sync.

#### Name the three levels of search — global, page, component

**What it is.** Mobbin's search-bar entry (6,000+ components studied) frames search as a **hierarchy**, not one feature: *global search* across all app content, *page search* within one page, and *component search* within a single component — "for example, a search feature on a data table UI". Its worked example is WhatsApp: a global bar across all conversations, plus a local search inside each chat ([Mobbin, *Search Bar UI*](https://mobbin.com/glossary/search-bar)).

**Why it solves our problem.** We currently have exactly one level — global `/zoeken`. That is the right first level, but it means a reader on a 20-row squad list or a long youth directory has no way to filter *in place* and must leave the page to search the whole site, then come back. The hierarchy names the gap precisely.

The two component-level searches worth having: **`YouthDirectory`** (many teams, scannable but long) and **squad lists**. Both are "filter this list I am already looking at", which global search answers badly.

**Retro-fanzine translation.** A component-level filter is not a second search bar — visually competing search bars are confusing. It is a **single ink-ruled input with no container fill**, sitting directly under the section rule, styled from the existing field vocabulary (2px `ink/30` border, muted offset shadow, sharp corners) with a `MonoLabel` above reading `FILTER` rather than a magnifying glass placeholder. Mobbin notes the clear button is by far the most common auxiliary control, and that is worth keeping — as a Phosphor Fill `X` in ink, appearing only when the field has content.

**Effort:** M. **Risk:** it must filter client-side and instantly, with an `aria-live` result count, or it is slower than scanning. Do not add a submit button — a filter that needs Enter is a search bar in disguise.

#### Grouped results over a ranked mixed list

**What it is.** When a corpus holds several entity kinds, grouping results by kind with a few per group beats one relevance-ranked stream, because it lets the reader skip to the kind they meant.

**Why it solves our problem.** A search for "Van Ransbeeck" can legitimately hit a player, a staff member and six articles. Our filter tabs let the reader *narrow* to a kind, but only after they have seen a mixed list and worked out what kinds exist.

**Retro-fanzine translation.** A grouped zero-filter view where each kind is introduced by a `SectionHeader`-style mono rule (`SPELERS ——`), showing three results and a `MEER →` link that switches to that filter tab. This is an index page in a fanzine — grouped, ruled, with a "continued" pointer. Keep the tabs; they become the drill-down, not the first move.

**Effort:** M. **Risk:** the tab-vs-group interaction needs one clear rule or it will feel like two competing controls. Decide: groups when filter is `all`, flat ranked list when a filter is active.

#### Keyboard and touch parity in the suggestion list

**What it is.** Up/Down to move through suggestions, Enter to commit, Escape to dismiss — with the same list being a plain tappable list on touch ([UX Patterns for Developers, *Search Field*](https://uxpatterns.dev/patterns/forms/search-field)).

**Why it solves our problem.** Our documented primary scene is a phone outdoors, and DESIGN.md is explicit that nothing necessary may hide behind hover. Any suggestion list we add must therefore be tap-first, with keyboard support as the parallel path rather than the primary one.

**Retro-fanzine translation.** The active suggestion is marked by a **solid jersey-deep left bar and a cream-soft row fill** — the same inset-bar device `StandingsTable` already uses to mark the KCVV row, so the system gains no new vocabulary. Never a rounded highlight pill.

**Effort:** M. **Risk:** the real a11y cost of this pattern is the combobox contract (`role="combobox"`, `aria-expanded`, `aria-activedescendant`). Either implement it fully or ship the tap-only list — a half-built combobox is worse for screen readers than a plain list.

---

### 3.7 Forms a volunteer or parent fills in

#### Validate on blur, re-validate on keystroke only after an error exists

**What it is.** The research consensus is that first-time validation fires on blur, not per keystroke — telling someone who has typed `a` that it is not a valid email is noise. Once a field is *already* in error, live re-checking is welcome, because now the keystrokes are a fix attempt ([Baymard, *Usability Testing of Inline Form Validation*](https://baymard.com/blog/inline-form-validation)).

**Why it solves our problem.** Our form audience is volunteers and parents on phones, often one-handed, often outdoors. Premature red is the fastest way to make a short form feel hostile.

**Retro-fanzine translation.** The state machine is already built — DESIGN.md documents an eight-state field where border weight encodes progress (`ink/30` → `ink/40` → `ink/60` → full ink) and the alert pair takes over on error. The change is purely *when* the error state is entered, not what it looks like. `AlertBadge` below the field, in the dusty brick `alert` tone, never a floating tooltip.

**Effort:** S. **Risk:** the error message must be programmatically tied to the field (`aria-describedby`) and the field marked `aria-invalid` — visual-only error state is the common miss.

#### State the requirement, not the violation

**What it is.** A good error says what went wrong, why, and what to do. "Invalid input" is described as the error-message equivalent of a shrug ([Baymard](https://baymard.com/blog/inline-form-validation)).

**Why it solves our problem.** Pure copy work, near-zero effort, and it is the difference between a parent finishing an availability form and giving up.

**Retro-fanzine translation.** Our voice is already declarative and printed — DESIGN.md's *Terminal Period Rule* says headings are "declarative, printed, finished". Error copy should match: `Vul een telefoonnummer in, bijvoorbeeld 0475 12 34 56.` Not `Ongeldig telefoonnummer.` Set in body sans, not mono — mono is for labels and data, and an error sentence is prose.

**Effort:** S. **Risk:** none.

#### Progressive disclosure by real branch, not by arbitrary step count

**What it is.** Splitting a form into steps helps only when the split follows a genuine decision; slicing eight fields into four screens of two adds taps without reducing load.

**Why it solves our problem.** Our forms are short. The honest application is *conditional reveal* — ask which team, then show only that team's relevant questions — rather than a wizard.

**Retro-fanzine translation.** A revealed block drops in as a `cream-soft` panel under a 2px ink rule, appearing instantly (no height animation, or `motion-safe:` only). If a multi-step form is ever genuinely warranted, the progress indicator is a row of `MonoLabel` numerals with the current one stamped — a numbered form, not a progress bar with a rounded fill.

**Effort:** S–M. **Risk:** newly revealed fields must be announced; move focus to the new block's heading or wrap it in a live region, or a screen-reader user will not know the form grew.

#### Save-and-resume for anything longer than one screen

**What it is.** Persisting in-progress input locally so a dropped connection or an accidental back-navigation does not cost the whole form.

**Why it solves our problem.** Sideline connectivity is unreliable by definition, and this is the highest-frustration failure a volunteer form can produce.

**Retro-fanzine translation.** No autosave spinner and no "Saved ✓" toast. A `MonoLabel` under the form reading `CONCEPT BEWAARD · 14:32`, and on return a `TicketStub` offering `VERDERGAAN` / `OPNIEUW BEGINNEN`. The stub metaphor is right: a draft is a stub you kept.

**Effort:** M. **Risk:** never persist sensitive fields to `localStorage`. For a club site this means being deliberate about anything that identifies a child.

---

### 3.8 Scroll and transition choreography

#### The system already made this decision — inherit it, don't re-litigate

**What it is.** DESIGN.md's *Press-Down Rule* is unusually well-specified for reduced motion: the surface translates `+1px, +1px` **gated behind `motion-safe:`**, while the shadow collapse is **not gated** — so a reduced-motion user still gets the full affordance, just without the movement. That is a better reduced-motion story than most design systems have, because the fallback is not "nothing happens".

**Why it matters here.** It supplies the rule for every new pattern in this document: **every motion must have a non-motion channel carrying the same information.** A pattern that only communicates through movement is not portable into this system. Applying that test:

- Sticky day header (§3.2) — no motion at all. Safe.
- Row expansion (§3.4) — height animation gated; content presence is the real signal. Safe.
- Jump-to-today (§3.2) — smooth scroll **must** be gated; instant jump is the fallback. This is the one genuine vestibular risk in the document.
- Score reveal (§3.3) — state change, not motion. Safe.

**Retro-fanzine translation.** Nothing to translate — this is already ours. The one thing worth adding is a house rule for scroll-triggered reveals: **do not add them.** A fanzine page is printed all at once. Fade-up-on-scroll is a SaaS-marketing reflex, costs a `motion-safe:` gate and an intersection observer, and buys nothing a printed page would have.

**Effort:** S (it is a rule). **Risk:** the known outstanding issue from project memory — 69 of 113 `animate-pulse` usages lack `motion-safe:`. Any new pattern that ships a skeleton inherits that bug unless it is gated at the point of use.

#### Preserve scroll position across filter changes

**What it is.** Baymard's mobile filtering guidance is that users should be able to change filters "without losing their position in the results" ([Baymard, via summary](https://baymard.com/blog/how-to-design-applied-filters)).

**Why it solves our problem.** Changing the team filter on `/kalender` should not throw the reader back to the top of the month. On a phone this is the difference between comparing two teams' Saturdays and giving up.

**Retro-fanzine translation.** Behaviour only, no visual surface. Combine with the sticky day header (§3.2) so the reader's context is doubly preserved.

**Effort:** S–M. **Risk:** if filters are URL-driven, Next.js scroll restoration needs `scroll: false` on the navigation — easy to miss and it silently regresses.

---

## 4. Patterns we should explicitly not copy

Named here so nobody proposes them in six months with a Mobbin screenshot attached. Most are glossy-SaaS reflexes that DESIGN.md already bans; the point of listing them is that they arrive disguised as *interaction* improvements rather than visual ones, which is how banned aesthetics get re-imported.

| Reflex | Why it is wrong here |
|---|---|
| **Rounded bottom sheet with a blurred scrim** | The standard mobile filter container everywhere. Two violations at once (*Sharp Corner Rule*, *No Blur Rule*). If a sheet is genuinely needed, it is a paper ticket stub sliding up with a hard edge, a solid ink-at-opacity scrim, and no blur. |
| **Gradient fade to signal horizontal scroll** | A soft fade is a blur effect. Cut content hard at a 2px ink border and use `ScrollHint`. |
| **Skeleton shimmer sweep** | The travelling-highlight gradient is a SaaS tell. Our skeletons are sharp blocks (already enforced — 44 stray radii were removed for this) and any pulse needs `motion-safe:`. |
| **Toast notifications** | Floating rounded pills with auto-dismiss. Our confirmations are printed marks — a stamp that changes state, a `MonoLabel` timestamp. A stamp does not fade out after four seconds. |
| **Pull-to-refresh with a spinner** | Web-app cosplay. Our data cadence does not need it and the affordance is invisible. |
| **Scroll-triggered fade-up reveals** | Marketing-page reflex. A printed page arrives all at once. Costs a motion gate and buys nothing. |
| **Animated number count-up on scores and stats** | Turns a fact into a performance, and reads as broadcast slick — one of DESIGN.md's three named anti-references. A score is printed, not dealt. |
| **Live pulsing dot / minute ticker** | Out of product scope (no live scores), and the pulse is a motion-only signal. |
| **Progress bar with a rounded animated fill** | If a multi-step form ever exists, progress is numbered mono labels with the current step stamped. |
| **Avatar-circle team switcher row** | Fails the segmented-control ceiling at 20 teams and imports a social-app vocabulary we do not have. |
| **Segmented control as the primary team selector** | See [3.1] — past every published ceiling; hides the option set and costs a swipe. |
| **Empty-state spot illustration with an apology** | "Oops! Nothing here yet 😕" — wrong on three counts (illustration register, apologetic voice, emoji). A printed blank does not apologise. |
| **Infinite scroll on the fixture archive** | Destroys the ability to reach the end of a season, breaks the footer, and fights the month-window lock. Paginate by month, as we already do. |
| **Hover-revealed actions on fixture rows** | DESIGN.md is explicit: never rely on hover for anything necessary — the primary scene is a phone, outdoors. FotMob reveals its per-match star on row hover; Sofascore renders it always. **Sofascore is right and FotMob is wrong** for our usage scene — copy Sofascore. |
| **Empty-state illustrations "to make it visually appealing"** | Mobbin lists this among its empty-state *do's*, and its FAQ makes "visual appeal / engaging visuals or illustrations" a defining property of a good empty state. Named here because it is now citable to a source someone will reach for. Our answer is the printed blank [3.5]. |
| **A tracked segmented control for anything with more than ~5 options** | The track is a promise that every option is visible. 20 teams breaks it. Separated chips (tabs) may scroll; a tracked control may not [3.1]. |
| **Betting odds, predictions, and "who will win?" vote widgets** | Sofascore and FotMob both lead with these. Entirely off-brand for an amateur club site, and a gambling surface aimed at a parent audience is a straightforward no. |
| **A persistent live-score ticker pinned above the header** | Sofascore's top strip. Out of scope (no live scores) and it would crowd out the masthead, which is the fanzine's strongest asset. |
| **Row-count badges rendered as filled pills** | We want counts, but `FilterTabs` already sets the house form: inline after a 1px hairline pipe, no pill, no badge. Do not reintroduce the pill. |

---

## 5. Open questions for Kevin

1. **Is a followed team persisted in `localStorage` acceptable given the no-accounts rule?** It is not an account, but it is per-device state that changes what the page shows. It also interacts with CDN caching — the personalised strip has to hydrate client-side. Worth a decision before anyone builds [3.1].

2. **`StripedSeam` is full-bleed by contract.** The past/future "today" seam [3.2] wants exactly that component but inside a list. Do we (a) let the agenda list break out, (b) add a contained seam variant, or (c) use a plain 2px ink rule with a `VANDAAG` stamp and drop the stripe? Option (c) is cheapest and still idiomatic.

3. **Standings: comparison or lookup?** The two strategies in [3.4] are mutually exclusive and the current code half-implements both (columns hidden *and* a scroll container that never scrolls). Which is the real job — comparing teams across the table, or checking where we sit?

4. **Does the data distinguish "played, unreported" from "played, 0-0"?** The printed-blank pattern [3.3] is only possible if the BFF exposes that difference. If a missing score and a genuine nil-nil are the same shape upstream, this is a data question before it is a design one.

5. **Which competitions genuinely publish no individual stats?** The dignity fix in [3.5] needs a per-competition flag. Is that knowable from PSD, or does it need to be authored in Sanity?

6. **The outcome underline is currently colour-alone** (green win / red loss) [3.3]. Given the "no WCAG target, readable is the test" stance, is that an accepted trade or something to pair with wording? It is the one accessibility finding here that affects existing shipped UI rather than a proposal.

7. **How much of this is worth doing at all before go-live?** The S-tier items across both passes are copy-and-composition changes against existing primitives. The M-tier are real builds. A reasonable split is to take the S-tier now and issue the rest.

Added by the second pass:

8. **Does the two-line match row survive the 6.D "labelled wall" lock?** [6] Sofascore's stacked row fixes a real truncation defect, but doubles row height and 6.D deliberately chose density. My instinct is responsive — stacked below `sm`, single-line above — but 6.D was a considered decision and this should not be overridden by a research doc.

9. **Zone colouring vs the KCVV highlight bar.** `StandingsTable` already spends the inset-left-bar channel on "this is our row". FotMob spends the same channel on promotion/relegation zones. If we ever want both, one needs a different channel. Which wins?

10. **Is "follow" a strip, a view, or both?** [3.1, 6] Sofascore makes favourites a peer tab. That is more capable than the homepage strip I originally proposed, but also more surface area. Both, one, or start with the strip?

11. **Should the day strip replace the month window on `/kalender`?** [6] OneFootball's strip is day-scoped; our calendar is month-windowed by an explicit lock, and the two are different mental models. The strip may belong only on a per-team fixture list — or not at all.

---

## 6. The sports apps, inspected directly

Opened in a real browser rather than read about. These are our closest analogues and the pass produced the most directly transferable findings in this document.

### FotMob — the date control is three-tier in one row

**What it is.** The fixture list header is a single row: `‹` `Today ▾` `›`. Three affordances in one control — arrows step ±1 day, the **label names the anchor in words rather than a date**, and tapping the label opens a month grid with today ringed ([fotmob.com](https://www.fotmob.com/), observed 13 Aug 2026).

**Why it solves our problem.** This is a better answer than the separate "jump to today" button I proposed in §3.2. One control does three jobs, and because the label reads `Today` rather than `13 August`, the reader always knows whether they have wandered — the word changes to a date when they are elsewhere. It is self-labelling state.

**Retro-fanzine translation.** `‹ VANDAAG ▾ ›` in `MonoLabel`, arrows as Phosphor Fill carets in ink, the whole row sitting on a 2px ink rule. The month grid opens as a **hard-edged paper panel** with `shadow-paper-md`, no blur, no scrim — sharp corners, today marked with the `StampBadge` rotation rather than a ring. Crucially the panel is *anchored and opaque*, not a floating rounded popover.

**Effort:** M. **Risk:** the month grid is a date picker and needs real keyboard support (arrow keys, Escape). If that is too much, ship the arrows plus the word — two-thirds of the value at a fraction of the cost.

### FotMob — "Next opponent" as a column in the standings table

**What it is.** The league table's rightmost column is headed `Next` and contains a **single opponent crest** per row. The page title even advertises it: "Premier League table, form and next opponent".

**Why it solves our problem.** It is the densest idea I found all day. It answers two questions with one glance — where we sit, and who is next — without a second page. For a parent this is close to the whole information need.

**Retro-fanzine translation.** A `Next` column holding the opponent `Crest` at 16px, ink-bordered, with the fixture's home/away encoded by our existing `MatchVenueTag` letter (`T`/`U`) rather than by colour. On mobile this is exactly the column that should scroll under a pinned identity column (§3.4) — or, better, the one to surface *instead of* W/G/V, since "who's next" beats "how many draws" for our audience.

**Effort:** M. **Risk:** it needs a crest per opponent and a fallback. Our PSD notes say club logos never 404 (a grey shield placeholder is served), so the fallback is already handled — but a grey shield collides with our no-grey rule, so it needs a paper-toned substitute.

### FotMob — colour-coded zones always ship with a legend

**What it is.** Table rows carry a coloured left bar marking qualification zones, and a legend sits directly under the table: `● Champions League  ● Europa League  ● Relegation`.

**Why it matters for us.** This is the direct answer to the a11y gap I flagged in §3.3, where our win/loss outcome underline is colour-alone. FotMob's own pattern is *never colour alone* — the colour is an index into a printed key. That is also a very fanzine device: a printed key at the foot of a results grid.

**Retro-fanzine translation.** If we colour anything by category, a `MonoLabel` legend row goes under it, using our tokens (`jersey-deep` / `warm` / `alert`) with the label spelled out. Note a collision to resolve first: `StandingsTable` already uses an inset left bar to mark the KCVV row, so zone bars would need a different channel (row tint, or a marker in the position cell).

**Effort:** S. **Risk:** none — this reduces risk.

### FotMob — "Sync to calendar" and "Follow" are top-level, not buried

**What it is.** The league header carries three controls at equal prominence: `Sync to calendar`, a season dropdown (`2026/2027 ▾`), and `Follow`.

**Why it solves our problem.** It independently confirms two of my proposals and corrects their placement. Calendar subscription (§3.2) and following (§3.1) are **header-level actions on the entity page**, not footer afterthoughts. And season-as-a-dropdown is the archive pattern — not tabs, not a separate page.

**Retro-fanzine translation.** On `/ploegen/[slug]`, a row under the team hero: `VOLG DEZE PLOEG` as a `StampBadge` toggle, `ZET IN JE AGENDA` as a `TicketStub` action, and the season as a `Select` from our existing field vocabulary. All three sharp, ink-bordered, press-down on hover.

**Effort:** M. **Risk:** three controls in a row must not read as a toolbar — space them as printed marks, not as a button group.

### FotMob — an in-place text filter *alongside* mode chips

**What it is.** The fixture bar holds mode chips (`Ongoing` / `On TV` / `By time`) **and** a free-text `Filter` input in the same row.

**Why it solves our problem.** This is Mobbin's "component search" level (§3.6) made concrete, and it is the pattern for our `/kalender` and `YouthDirectory`: chips for the two or three modes that matter, plus a text filter for the long tail. It is how you serve 20 teams without a 20-item control.

**Retro-fanzine translation.** `FilterTabs` for the modes, then our ink-ruled filter field to their right on desktop, stacked beneath on mobile. Applied results feed the `RemovableChip` strip from §3.1.

**Effort:** M. **Risk:** two filtering mechanisms in one bar need one obvious relationship (AND). Show the combined result count so it is never ambiguous.

### FotMob — group by competition when the date is already the window

**What it is.** With a single day selected, matches are grouped under **collapsible competition headers**, not date headers — because the date is already the page-level filter.

**Why it solves our problem.** It names the axis choice we face. Our calendar windows by month and groups by day. The transferable insight is the *inversion*: once the reader has filtered to one team, day-grouping carries little information (a team plays once a week), and grouping by **competition** — league / cup / friendly — would carry more. Worth considering for the per-team fixture list specifically, not for `/kalender`.

**Effort:** S–M. **Risk:** collapsible groups that remember state across navigations can hide content unexpectedly. Default every group open.

### Sofascore — the state split as counted chips

**What it is.** Above the fixture list sit three chips: **`Live (21)` · `Finished` · `Upcoming`**. The count on the active state is the detail that matters — you know whether a bucket has anything in it *before* tapping ([sofascore.com](https://www.sofascore.com/), observed 13 Aug 2026). Competition group headers carry counts too (`3`, `12`) alongside a collapse chevron.

**Why it solves our problem.** This is a better answer than my §3.2 "seam, not tabs" proposal for the *filtered* case, and the two are complementary rather than competing. The seam works for one continuous scroll; counted chips work when the reader wants only one half. And the count directly attacks the empty-state confusion from §3.5 — a chip reading `Uitslagen (0)` tells the truth before the reader has invested a tap.

**Retro-fanzine translation.** We already have the exact component: `FilterTabs` supports `count` and renders it "inline after a 1px hairline pipe — no pill, no badge". So this is `UITSLAGEN | 12` and `KOMEND | 3` in the existing paper-chip vocabulary, zero new design. A zero-count chip takes the documented disabled treatment rather than disappearing.

**Effort:** S — the primitive already does this. **Risk:** none. This is the cheapest high-value item found in the whole second pass.

### Sofascore — favourites as a peer of "All", and a star on every row

**What it is.** The list's top-level tabs are **`All` · `Favourites` · `Competitions`** — following is not a setting, it is a *view*, sitting as an equal beside the default. Every match row also carries an always-visible star toggle (not hover-revealed).

**Why it solves our problem.** It sharpens §3.1. The followed team should not only drive a strip on the homepage — it should be a *view* the reader can switch to. And the always-visible star is the correct call for us on rule as well as taste: DESIGN.md forbids hover-revealed necessary controls, and Sofascore, which could rely on hover on desktop, chooses not to.

**Retro-fanzine translation.** On `/kalender`, a `FilterTabs` row of `ALLES | MIJN PLOEGEN | PER REEKS`. The per-row follow control is a `StampBadge`-weight toggle in ink, always rendered, reading as an unstamped outline when off and a filled jersey-deep stamp when on — a rubber stamp pressed onto the row, not a star.

**Effort:** M. **Risk:** an always-visible toggle on every row adds tap targets next to a row-level link. Keep the stamp outside the link's hit area and give it a distinct accessible name (`Volg Eerste Elftallen A`), or thumbs will mis-tap.

### Sofascore — the two-line match row never truncates

**What it is.** Each match is **two lines**: time/status stacked at the left (`00:00` over `FT`), the two team names stacked one per line, and the two scores stacked at the right. Nothing is truncated because each team owns a full line.

**Why it solves our problem.** This is a direct, concrete fix for a live weakness. Our `AgendaMatchRow` renders `{home} — {away}` on **one** line with `truncate` — so on a narrow phone, two long Belgian club names get cut off, and the reader loses the very information the row exists to convey. Sofascore's stacked form is immune to that by construction.

**Retro-fanzine translation.** This is also *more* fanzine, not less: a printed results grid stacks home over away with the score in a right-hand column — it does not run them together with an em dash. Keep the mono time at the left, stack the two team names in body sans, right-align the two score digits in `NumberDisplay`, and keep the existing outcome underline on the winning line. The dashed divider stays between matches.

**Effort:** M — it is a real reflow of a shipped component with tests and stories. **Risk:** it doubles row height, which fights the "labelled wall" density lock (6.D). The honest resolution is probably **responsive**: stacked below `sm`, single-line above it. Worth checking against the 6.D rationale before committing, since that lock was deliberate.

### OneFootball — a day strip that names the days you actually care about

**What it is.** The date control is a horizontally scrolling strip of day chips: **`‹ | Yesterday | Today | Tomorrow | 15 Sat | 16 Sun | 17 Mon | 18 Tue | ›`**, with `Today` outlined as active and a `Calendar month: August` label above ([onefootball.com/en/matches](https://onefootball.com/en/matches), observed 13 Aug 2026).

**Why it solves our problem.** The relative-then-absolute progression is the cleverest small thing found in this pass. The three days a reader most often wants are addressed **by name**, so no date arithmetic is required; everything beyond falls back to `15 Sat`, which carries the weekday — the single most useful token for "when does my kid play", since amateur fixtures cluster on Saturdays and Sundays. It beats both a bare arrow-stepper and a full month grid for the common case.

**Retro-fanzine translation.** This maps onto our vocabulary almost too neatly: a `FilterTabs`-style row of paper chips reading `GISTEREN | VANDAAG | MORGEN | 15 ZA | 16 ZO`, mono uppercase, sharp, `ScrollHint` on overflow, active chip inverted to `bg-ink text-cream` exactly as `FilterTabs` already does. It is a printed date strip along the top of a programme page. It also subsumes the separate "jump to today" control from §3.2 — `VANDAAG` is always in the strip.

**Effort:** M. **Risk:** a horizontally scrolling date strip must scroll the active chip into view on load, and that scroll needs a `motion-safe:` guard. Also make each chip's accessible name the full date (`zaterdag 15 augustus`), not the abbreviation.

**Note on OneFootball's IA:** its top-level nav is `Matches | Teams | Competitions` — **Teams as a first-class destination**, peer to fixtures. That independently supports the §3.1 conclusion that a 20-team roster wants an *index*, not a switcher stuffed into a control.

---

## Appendix — sources

Reachable and used:

- [NN/g — Mobile Tables: Comparisons and Other Data Tables](https://www.nngroup.com/articles/mobile-tables/)
- [NN/g — Designing Empty States in Complex Applications](https://www.nngroup.com/articles/empty-state-interface-design/)
- [NN/g — Sticky Headers: 5 Ways to Make Them Better](https://www.nngroup.com/articles/sticky-headers/)
- [Baymard — Display "Applied Filters" in an Overview](https://baymard.com/blog/how-to-design-applied-filters)
- [Baymard — Usability Testing of Inline Form Validation](https://baymard.com/blog/inline-form-validation)
- [Smashing Magazine — Designing Sticky Menus: UX Guidelines](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)
- [Fluent 2 — iOS Segmented control usage](https://fluent2.microsoft.design/components/ios/core/segmentedcontrol/usage)
- [Apple — Segmented Controls Overview](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/SegmentedControl/Articles/SegmentedControlBasics.html)
- [Setproduct — Tab UI design rules](https://www.setproduct.com/blog/tabs-ui-design)
- [Lollypop — The Ultimate Guide to Tab Design](https://lollypop.design/blog/2025/december/tabs-design/)
- [Carbon Design System — Empty states pattern](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [UXPin — Designing the Overlooked Empty States](https://www.uxpin.com/studio/blog/ux-best-practices-designing-the-overlooked-empty-states/)
- [UX Patterns for Developers — Search Field](https://uxpatterns.dev/patterns/forms/search-field)
- [IxDF — How to Design for Mobile Search](https://www.interaction-design.org/literature/article/navigating-the-maze-of-mobile-apps-design-for-mobile-app-search)
- [FotMob](https://fotmob.us/) · [FotMob onboarding description, MWM](https://mwm.ai/apps/fotmob-soccer-live-scores/488575683) · [AlternativeTo user reports](https://alternativeto.net/software/soccer-scores--fotmob/)
- [Spoiler-Free Sports](https://spoilerfreesports.com/) · [theAdhocracy — Hiding BBC Sport World Cup Spoilers](https://theadhocracy.co.uk/wrote/hiding-bbc-world-cup-spoilers)

Mobbin (public glossary only — the screenshot library is gated):

- [Mobbin — Empty State UI](https://mobbin.com/glossary/empty-state) (4,000+ examples)
- [Mobbin — Segmented Control UI](https://mobbin.com/glossary/segmented-control) (2,600+ components)
- [Mobbin — Table UI](https://mobbin.com/glossary/table) (1,500+ components)
- [Mobbin — Stacked List UI](https://mobbin.com/glossary/stacked-list) (12,000+ components)
- [Mobbin — Search Bar UI](https://mobbin.com/glossary/search-bar) (6,000+ components)
- [Mobbin — Glossary index](https://mobbin.com/glossary) (~55 entries)

Apps opened and inspected directly, 13 Aug 2026:

- [FotMob](https://www.fotmob.com/) — home fixture list, date control, [Premier League table](https://www.fotmob.com/leagues/47/table/premier-league)
- [Sofascore](https://www.sofascore.com/) — home fixture list, state chips, favourites tabs
- [OneFootball](https://onefootball.com/en/matches) — day strip, match-type filters, top-level IA

Not reachable:

- **Mobbin's screenshot library** — hard login wall. `mobbin.com/browse/ios/apps` redirects to a marketing page; the nav offers only "Log in" / "Join for free". Not pursued further. This is the main gap in the document: every Mobbin claim here is a *stated corpus finding*, not a flow I saw.
- **OneFootball's full home page** — its consent banner offers only "I Accept" with no visible decline, so it was left in place rather than accepting tracking. The `/matches` page rendered enough above the banner to read the patterns cited.
- Page Flows, Screenlane, UI Sources, Refero and the other screenshot galleries were not attempted — with three real analogue apps inspected directly, their marginal value was low against the time left.

Consent handling: FotMob and Sofascore both presented TCF consent dialogs. In both cases I took "Manage options" and confirmed with every vendor toggle off (the default), i.e. declined all non-essential processing. Nothing was accepted on the user's behalf.
