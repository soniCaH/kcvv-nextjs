# Belgian (and other) football club websites — what to steal, adapt, and refuse

Primary-source research, August 2026. Every site below was fetched and read; nothing here is
from memory or from secondary write-ups. Sites that blocked fetching are listed as blocked
rather than guessed at.

> **Per-tier detail lives in the sibling `clubs-*.md` files in this directory.** Four tier
> specialists went deep on pro, national-amateur, provincial-regional and international
> benchmarks. This file owns three things they do not: (1) the accurate inventory of what
> kcvvelewijt.be already ships, (2) the platform/template baseline — what every Belgian club
> gets for free, which is the line between "differentiating" and "merely present", and
> (3) the cross-cutting synthesis and recommendations.

---

## 1. Executive summary — top 10, ranked by impact ÷ effort

| # | Recommendation | Effort | Source |
|---|---|---|---|
| 1 | **Publish the youth lidgeld as text — itemised, with sibling/local discounts and what it buys back.** Walloon clubs do this to the euro; Flemish clubs hide it in PDFs or let it go stale. First Flemish club to answer "wat kost het?" in one tap wins every searching parent. | S | [rusrebecquoise.be](https://www.rusrebecquoise.be/infos-saison-2026-2027), [fcliege.be](https://www.fcliege.be/fr/edj/cotisations/) |
| 2 | **A real "hoe geraak ik er" page** — car, bike, bus, train-plus-walk, parking, which gate. Not one club in this research, at any tier or either language, solved arrival. | S | [kdiegemsport.be/routebeschrijving](https://www.kdiegemsport.be/routebeschrijving/) |
| 3 | **Match-postponement / afgelasting notice as a first-class site state.** The cheapest template on the market ships this ("Notificatie centrum afgelast / herkeuring"); we do not. Highest-frequency real-world question there is. | M | [voetbalassist.be](https://www.voetbalassist.be/clubwebsite/) |
| 4 | **Matchbal / wedstrijdbal sponsorship with a published price and named deliverables.** Racing Mechelen sells it at €300 with six named returns. Nobody francophone runs it at all. We have 33 sponsors and no productised entry tier. | S | [racingmechelen.be](https://racingmechelen.be/word-sponsor-van-onze-matchbal/) |
| 5 | **Group youth by game format — 2v2/5v5 · 8v8 · 11v11 — not as a flat U6→U21 list.** Matches how the game is actually played at each age and how parents think. Costs a grouping change on `/jeugd`. | S | [rusrebecquoise.be](https://www.rusrebecquoise.be/equipes-de-jeunes), [rupelboomfc.be](https://www.rupelboomfc.be/jeugd) |
| 6 | **Per-season archive pages** — final table, every result, per-player appearances/goals/assists, short narrative. We already hold richer data than anyone and bin it every summer. | M | [kdiegemsport.be/geschiedenis](https://www.kdiegemsport.be/geschiedenis/archief-seizoen-2024-2025/) |
| 7 | **One open door for helping out** — a single "stel je voor" page welcoming volunteers, coaches, students and job-seekers together, plus named shifts attached to events. | S–M | [unionnamur.be](https://www.unionnamur.be/contact-8), [kdiegemsport.be](https://www.kdiegemsport.be/evenementen/mosselfeest/meewerken-op-het-mosselfeest/) |
| 8 | **Publish the club's charters and safeguarding route in HTML**, not PDFs — gedragscode per role, who the API is, how to report something. A whole content pillar Flemish clubs skip entirely. | M | [fcliege.be](https://www.fcliege.be/fr/comite-de-vigilance/), [rcsbrainois.com](https://www.rcsbrainois.com/bien-vivre-ensemble) |
| 9 | **Entry prices, stated.** Diegem prints "staanplaats 10 euro / zitplaats 15 euro". We print nothing, and away supporters are a named audience. | S | [kdiegemsport.be](https://www.kdiegemsport.be/supporteren-tickets/) |
| 10 | **Get content into `matchPreview` / `matchRecap` at go-live.** Both types already exist in our schema, bound to a PSD match id, with **zero** documents in production. Table stakes on a €455/yr template, built here and empty. No feature work needed — decide whether they are staged or stalled. Same question for the **80 events, none of them in the future**. | S | inventory + [voetbalassist.be](https://www.voetbalassist.be/clubwebsite/) |

---

## 2. Already covered by kcvvelewijt.be

Read from `apps/web/src/app/` (route tree), `apps/web/PRODUCT.md`, `apps/web/public/llms.txt`,
`apps/web/src/components/`, and a live GROQ query against the production Sanity dataset
(`vhb33jaz`, dataset `production`). **Do not propose any of the following as new.**

### Routes shipped

```text
/                             homepage (flat bands, no declared primary section)
/nieuws  /nieuws/[slug]       news index + article detail
/kalender                     club-wide calendar, all teams
/wedstrijd/[matchId]          match detail: lineup, goal events, cards, standings snapshot
/tegenstander/[clubId]        opponent page
/ploegen  /ploegen/[slug]     senior team overview + detail (squad, fixtures, league table)
/ploegen/[slug]/wedstrijden   per-team match list
/jeugd  /jeugd/[slug]         youth landing + youth team pages (U6–U21)
/spelers/[slug]               player profile + season statistics
/staf/[slug]                  staff/coach profile
/evenementen  /[slug]         events index + event detail
/galerij  /galerij/[slug]     photo galleries
/sponsors                     tiered sponsor overview (main / second / regular)
/club                         club hub
/club/geschiedenis            club history (the only place 1909 is narrated)
/club/bestuur                 board
/club/jeugdbestuur            youth board
/club/angels  /club/ultras    supporter groups
/club/contact                 contact
/club/word-lid                membership application form
/club/[slug]                  CMS-driven club pages (see below)
/hulp                         help / wie-is-wie finder
/zoeken                       site search (semantic, Cloudflare Vectorize)
/privacy                      privacy policy
/share                        share-card generator
/scheurkalender               private poster source, not a public page
```

**CMS-driven `/club/[slug]` pages live in production right now** (GROQ `*[_type=="page"]`):
`cashless` ("Cashless Clubkaart"), `downloads` ("Digitale documenten - downloads"),
`praktische-informatie` ("Praktische Informatie"), `vrijwilliger` ("Word vrijwilliger").

### Navigation (flat, from `src/components/layout/menuItems.ts`)

`Nieuws` · `Wedstrijden` · `Evenementen` · `<senior teams, data-driven>` · `Jeugd` ·
`Sponsors` · `Hulp` · `De club`. Home is the wordmark. Dropdowns were deliberately deleted
(#2409/#2415).

### Features already shipped

- **Live competitive data for the whole club**, not just the first team — results, lineups,
  goal events, cards, standings, per-player season statistics for senior A/B *and* every
  youth team, synced from ProSoccerData via the BFF.
- **iCal subscription** (`/api/calendar.ics` + `CalendarSubscribePanel`).
- **Share cards** — Kickoff, Halftime, Goal (KCVV), Goal (opponent), Full-time, plus square
  pre-game and square result templates (`src/components/share/`).
- **Semantic site search** with filters, related results, no-results feedback capture.
- **Organigram explorer** and a **who-is-who finder** (`HulpFinder`, `OrganigramExplorer`) —
  41 `responsibility` records, 32 organigram nodes.
- **Online membership application** (`/club/word-lid` → `/api/membership`).
- **Tiered sponsor treatment** with a featured/hoofdsponsor slot and a homepage sponsor wall.
- **Youth as first-class**: `/jeugd` landing, per-team pages, youth board, enrolment CTA,
  Bovenbouw / Middenbouw / Onderbouw grouping.
- **Match-day standings snapshot** embedded in match detail.
- **Analytics instrumentation**, JSON-LD structured data, OG share cards, `llms.txt`.

### Real content in production Sanity today

| Type | Count | Notes |
|---|---|---|
| `article` | 125 | types: `announcement`, `interview`, `transfer` |
| `event` | 80 | `eventType` is only `Clubevent` or null |
| `player` | 294 | |
| `staffMember` | 143 | |
| `team` | 26 | |
| `responsibility` | 41 | |
| `organigramNode` | 32 | |
| `sponsor` | 33 | |
| `photoGallery` | **1** | the gallery feature is built but effectively unused |

### Deliberately excluded by `PRODUCT.md` — never recommend these

Ticket sales, online shop (the homepage `ClubshopBanner` links out), live streaming, live
in-play scores, betting/odds, paid or gated content, user accounts or login, and **any
newsletter or email signup**.

### Three things the inventory itself reveals

- **Match previews and match recaps are already built and have never been used.**
  `packages/sanity-schemas/src/article.ts` ships six `articleType` values — `interview`,
  `announcement`, `transfer`, `event`, **`matchPreview`**, **`matchRecap`** — and the last two
  carry a validated numeric PSD match-id field so an article binds to `/wedstrijd/[matchId]`.
  Production counts: `matchPreview` **0**, `matchRecap` **0**, `event` **0**. All 125 articles
  are `announcement`, `interview` or `transfer`.

  This reframes two of the headline recommendations below: match previews and reports are not a
  build — the capability exists and is waiting for content. Whether that is because it is
  staged for go-live or because something deters editors is an open question, treated in full
  below.
- **`eventType` is effectively a single value.** 80 events, all `Clubevent` or null. The
  events model is not distinguishing eetfestijn from tornooi from quiz.
- **`/galerij` is built and effectively unused** — one gallery in production. Given there is no
  photographer (#2411), this is a candidate for retirement rather than expansion.

### An open question for go-live — the newer capability layer has no content in it

`matchPreview` is not an isolated case. Counted live against production Sanity:

| Feature | Built | Documents in production |
|---|---|---|
| `matchPreview` article type | yes, with PSD match binding | **0** |
| `matchRecap` article type | yes, with PSD match binding | **0** |
| `event` article type | yes | **0** |
| `eventFact` block | yes | **0** |
| `videoBlock` | yes | **0** |
| Article `subject` (attribution) | yes, with a UI component | **0** |
| `photoGallery` | yes, with lightbox + grid | **1** |
| `banner` | yes | **1** |
| `qaBlock` | yes | 4 |
| `transferFact` block | yes | 9 |
| `htmlTable` | yes | 10 |

**This is a question, not a verdict.** The counts are solid, but three things cut against
reading them as "features nobody uses":

1. **Editors author a great deal.** Production holds **125 articles** and **80 `event`
   documents**. That is not a disengaged editorial team. What is empty is specifically the
   *newer* capability layer.
2. **The Next.js site is not publicly live.** The apex still serves Gatsby 5.16.0 and `/nieuws`
   404s. A capability an editor cannot yet see rendered is not a capability they have declined
   to adopt — it is one they have not been given a reason to reach for.
3. **This repo has been burned by exactly this inference before.** A previous audit flagged
   staged-but-not-yet-live capabilities as dead code and was wrong on the facts. Staged and
   unadopted look identical from a document count.

There is, however, one number that is not explained by staging: **of the 80 `event` documents,
zero are in the future.** A feature that was adopted and then went quiet is a different problem
from one never adopted, and it is the more urgent of the two — an events section with nothing
upcoming is worse than no events section, and it is visible to every visitor on day one.

So the questions to answer at go-live are:

- Are `matchPreview` / `matchRecap` / `videoBlock` / `subject` **staged** for launch, or has
  something about the authoring flow put editors off? What would make an editor reach for them
  in week one?
- **Why did the events calendar stop?** Is it seasonal, is it an ownership gap, or did the
  authoring path break?

PRODUCT.md is explicit that *"Club editors — volunteers, not professionals … Authoring friction
is a real product constraint, not a nicety."* Whatever the answers, they should be settled
before commissioning any of the new content types in section 6 — otherwise those join this
table. And it is worth noting that the highest-leverage recommendations below are deliberately
not new content types: they are copy, pricing, travel and charter content, written once by a
volunteer, which then stay true.

---

## 3. The default-template baseline — what every Belgian club already gets

If a feature is on this list, building it does **not** differentiate us; it only stops us
looking behind. If a feature is absent from it, building it is genuinely distinguishing.

> **Full platform analysis lives in
> [`platform-vendors-and-templates.md`](./platform-vendors-and-templates.md)** — Wix,
> Squarespace, WordPress + SportsPress, real Belgian and Dutch club sites with the platform
> verified from markup, exact prices, and the `kopie-van-u14a` evidence that Wix's answer to a
> new youth team is "duplicate the page". Read that file for the vendor detail; this section
> only carries what bears directly on our gap analysis, plus the two vendors it does not cover
> (VoetbalAssist pricing and Kicksite).

The headline from that file, which changes how our own position should be read: **Wix and
Squarespace lack the football domain entirely** — no fixture, result, standings, season or
player entity, no federation sync, no season rollover, and a new youth team is manual labour
forever. **WordPress + SportsPress closes most of the sporting gap** but still has no
federation sync, no member administration, no lidgeld, no volunteer scheduling — and **not one
of the five Belgian/Dutch WordPress club sites fetched actually runs SportsPress**; they run
Elementor plus an external admin SaaS and pay the per-team-page tax by hand.

So the "table stakes" line is not uniform. Against the DIY builders our synced whole-club data
is a genuine moat. Against **VoetbalAssist specifically**, it is not — and VoetbalAssist is the
one our neighbours actually use.

### VoetbalAssist — the volume player, and the only real benchmark

[voetbalassist.be/clubwebsite](https://www.voetbalassist.be/clubwebsite/) claims
*"1/3 van alle voetbalclubs in Nederland en België hebben een VoetbalAssist website"* and
**1202 clubs**. Pricing at [voetbalassist.be/kosten](https://www.voetbalassist.be/kosten/):
**€100 one-time setup, €2 per clublid per jaar, minimum €455/yr, maximum €2000/yr**, plus
€100/yr for the KBVB data service and €150 one-time for the mobile app.

> Reconciliation: the sibling vendor file records VoetbalAssist's pricing as *"gated behind a
> demo request"*. That is true of `voetbalassist.be/clubwebsite` and the `Tarieven` nav item;
> the figures above come from `voetbalassist.be/kosten`, which does publish them. Both readings
> are correct — the price is published, just not where the marketing page points.

For that money a club gets **37 modules**, verbatim as named:

```text
Nieuwsmodule · Tekstmodule · Rechten · Statistieken · OnzeClubwinkel · Vrijwilligersmodule
Vraag & Aanbod · Polls · Mediagallery · Webshop · Pupil van de week · Crowdfunding · FAQ
Agenda · Digitale formulieren · Wie-is-wie · Forum · Vacaturebank · Bestandsbeheer
Kleedkamerindeling planner · Veldindeling planner · Toernooi beheer · Oefenwedstrijden beheer
Notificatie centrum afgelast / herkeuring · Nieuwsbrief · Opstelling · Social media
Liveblog (ClubApp vereist) · Live tussenstanden · Wedstrijddetails · Topscorers
Wedstrijdstatistieken en historie · Spelerscarriere · Team informatie · Wedstrijdverslagen
Verjaardagen · Voorbeschouwing
```

Plus *"Automatische koppeling met KBVB wedstrijden"* and, per
[the layout page](https://www.voetbalassist.be/functies/layout-mogelijkheden/), **5 templates**
(CleanSheet, Catenaccio, Hattrick, Counter, Tiki-Taka) and *"30 voorgebakken (voetbal)widgets"*.

### Kicksite — the Belgian all-in-one

[kicksite.be](https://www.kicksite.be/) sells six modules: *"Nieuwe clubwebsite"*,
*"Sportieve module"*, *"Centraal ledenbeheer"*, *"Koppeling met federatie"*,
*"Online bestellingen"*, *"Kantine kassa"*. Positioning: *"Eén platform voor uw volledige
sportclub"* / *"Minder administratie, meer overzicht"*. Pricing is *"Prijzen op aanvraag"*
plus *"1.20% per online betaling"*. Named Belgian users include KSVK Maldegem, Eendracht
Buggenhout, KSK Sint-Amands, KSV Bornem, FC Lebbeke, BOKA United.

The tell here is **"Kantine kassa"** — the vendors understand that a Belgian amateur club's
real digital surface is the canteen till and the member roster, not the public website. The
public site is a by-product of the admin system.

### Blocked / unverifiable

- **Twizzit** — [twizzit.com/nl](https://www.twizzit.com/nl) 302-redirects to
  `app.twizzit.com/nl`, which serves only a login form. No public feature list or pricing was
  retrievable. Not guessed at. The sibling vendor file does however establish its real-world
  role from markup: KFC Witgoor Sport runs **WordPress + Twizzit**, i.e. Twizzit is an admin
  SaaS bolted behind a public site, not a website product — the same shape as ProSoccerData at
  Wambeek-Ternat and Sportlink at VV Dirkshorn.
- **ProSoccerData** — [prosoccerdata.com/nl](https://www.prosoccerdata.com/nl) 302-redirects
  to a splash page. Whether PSD offers any public-facing club portal could not be verified
  from the marketing site. Note we consume PSD as a data source already, and Racing Mechelen
  links "ProSoccerData" from its youth nav as a *parent-facing login*, not a public page
  ([racingmechelen.be](https://racingmechelen.be/)).
- **Voetbal Vlaanderen's free club page** — `voetbalvlaanderen.be/club/1634` renders
  client-side only and returned an empty document to fetching. What the federation gives each
  club for free could not be captured directly; it is reachable in a browser.

### Table stakes vs genuinely rare

**Table stakes** (on the €455 template — having it is not a win, lacking it is a loss):
news, agenda, results, standings, squads, sponsors, photo gallery, wie-is-wie, FAQ, digital
forms, webshop, match details, lineups, topscorers, match reports, match previews,
birthdays, polls, volunteer module, vacancy bank, crowdfunding, postponement notices,
federation data sync, a mobile app.

**Rare / genuinely differentiating** (found on almost nothing at any tier):
honest published pricing (lidgeld, entry, sponsor packages); real travel and parking
guidance; per-season permanent archives; away-guides for visiting supporters; a stated club
charter written in human language rather than legalese; volunteer asks scoped to a shift
rather than a role; anything editorial with a voice; accessibility for less-digital
visitors; and the whole club's data treated equally rather than the first team's data
treated well and the U11's not at all.

**The uncomfortable read:** four of our ten headline recommendations (postponements, match
previews, topscorers, career pages) are things a club can buy for €455 a year. We are ahead
on data depth and design and behind on ordinary club-site furniture.

---

## 4. Site-by-site notes

Grouped by tier. Per-tier depth is in the sibling `clubs-*.md` files; these are the
observations this pass captured directly.

### Professional

**RSC Anderlecht — [rsca.be/nl](https://www.rsca.be/nl)** (Jupiler Pro League)

- Navigation is a commerce funnel: News · Teams · **Tickets & Memberships** ·
  **Business & Hospitality** · Mauve TV. Four of five items sell something.
- The upcoming-matches widget tabs across **First Team / Futures / Women / Futsal**, and each
  fixture row carries its own action buttons — Tickets, Live, Match Centre. This is the one
  genuinely good pro pattern: *the fixture row is the navigation*, not a link to a page that
  then has the actions.
- Business pitch: *"De grootste businessclub van België, waar voetbal en kansen samenkomen"*,
  with *"Ontdek onze hospitality"* and *"Word lid van de Business Club"*.
- **[rsca.be/nl/neerpede](https://www.rsca.be/nl/neerpede) is a cautionary tale.** Belgium's
  most famous academy presents itself as ten clickable cards, U18 down to U8, with **no**
  philosophy, no trial information, no parent guidance, no pathway copy. A pro club with
  every resource says less about its youth work than Rupel Boom does.

**KV Mechelen — [kvmechelen.be](https://www.kvmechelen.be/)** (Jupiler Pro League)

- Best pro tone-of-voice found. Hero: **"Zonder jou? Geen show."** The news section is not
  "Nieuws" but **"Geel-Rood nieuws"**. The result widget's CTA is
  **"Herbeleef de match"**, not "match report". The social block is labelled
  **"#trotsoponzekleuren"** and the footer signs off **"Trots op onze kleuren"**.
- Every generic label has been replaced with a club-specific one. That is a pure copy
  exercise with zero engineering cost, and it is the single most transferable thing on any
  pro site.
- [The teams page](https://www.kvmechelen.be/nl/teams) leads youth with a
  **"Trots op onze jeugd"** band and an Academie sub-nav of *Structuur* / *Voetbalstages*.

**KRC Genk — [krcgenk.be/nl](https://www.krcgenk.be/nl)**

- Carries a **"Kampioen 1999, 2002, 2011, 2019"** line in the header — permanent, quiet
  honours display rather than a trophy page nobody visits.
- **Puts the full league table on the homepage.** Rare at pro level; standard at amateur level.
- Tile grid for the club's non-football surfaces: Academy, Ladies, Young Genkies, Foundation,
  Stadium tour, **SLO (Supporters Liaison Officer)**, OSV. The SLO tile is notable — a named
  human whose job is answering supporters.
- Video section framed as **"Dit is KRC Genk, #mijnploeg"**.

**Union Saint-Gilloise — [rusg.brussels/nl](https://www.rusg.brussels/nl)**

- Navigation carries **"Union Inspires"**, **"B Corp"**, **"Jobs"** and **"AML"** as
  first-class items. A football club advertising its B Corp certification in the top nav is a
  values-forward posture no Belgian amateur club attempts.
- Trilingual EN/NL/FR with news filterable by category (Eerste ploeg, Ticketing, Club,
  Business, Union Inspires, Union Academy, Union Ladies, Merchandise).
- Sponsors labelled **"Onze hoofdpartners"** with *"Bekijk al onze partners!"*.

**Club Brugge — [clubbrugge.be](https://www.clubbrugge.be/)** — **BLOCKED.** Returned HTTP 403
Forbidden on `/nl` and HTTP 429 Too Many Requests on the root. No content was retrieved and
none is guessed at here.

### National amateur / semi-professional

**K. Diegem Sport — [kdiegemsport.be](https://www.kdiegemsport.be/)** (1e Nationale VV) —
**the richest amateur site found anywhere in this research.** Its
[sitemap](https://www.kdiegemsport.be/page-sitemap.xml) is worth reading in full.

- **Per-season permanent archives**, 2018-19 through 2025-26. Each
  ([e.g. 2024-2025](https://www.kdiegemsport.be/geschiedenis/archief-seizoen-2024-2025/))
  contains a narrative summary, *"Eindstand seizoen 2024-2025"* (full 16-team table),
  *"Wedstrijden seizoen 2024-2025"* (all 32 results), *"Individuele statistieken 2024-2025"*
  (appearances, goals, assists, W/D/L%), and a 16-photo gallery. **We hold richer data than
  this and throw it away every summer.**
- **[/voetbalwet/](https://www.kdiegemsport.be/voetbalwet/)** — a plain-language explainer of
  the Belgian football law, opening *"Wat elke voetbalsupporter zou moeten weten!"*, covering
  Heysel, the 1998 statute, fines of €250–€5,000, stadium bans of three months to five years,
  stewards and police spotters — written and signed by a named police officer, and closing
  with **"Diegem Sport heeft voorbeeldige supporters, laten we het zo houden!"** A legal
  obligation turned into a piece of warm club writing.
- **[Volunteer shift sign-up per event](https://www.kdiegemsport.be/evenementen/mosselfeest/meewerken-op-het-mosselfeest/)**:
  *"Via onderstaand formulier kan je je voorkeur opgeven"*, with five named shifts (setup,
  Fri 18–22, Sat 17–21, Sun 11–15, Sun cleanup 16–19) and five role choices — including
  **"Het maakt me niet uit"** as an explicit first option. Closing promise:
  *"Wij contacteren je nadien zo snel mogelijk om je medewerking te bevestigen"*. This is how
  you actually recruit volunteers: not "become a volunteer", but "Sunday, 11 to 3, washing up".
- **[Ploeg van het decennium](https://www.kdiegemsport.be/ploeg-van-het-decennium/)** — a fan
  poll run weekly, one shirt number at a time, five candidates per position, *"slechts op 1
  speler stemmen"*. Framed with no ceremony:
  *"Bij zo'n terugblik leek het ons een leuk idee om een poll te organiseren naar 'De ploeg
  van het decennium'."*
- **Prices, printed.** [Entry](https://www.kdiegemsport.be/supporteren-tickets/):
  *"Inkomprijs volwassen staanplaats: 10 euro"*, *"Inkomprijs volwassen zitplaats: 15 euro"*.
- **[Routebeschrijving](https://www.kdiegemsport.be/routebeschrijving/)** — two grounds, three
  car routes each, and real parking detail (*"Er is een grote parking achteraan het complex"*,
  parking disc required, the Okay supermarket car park). But **car only** — no train, bus,
  bike or walking route. Even the best example in Belgium solves one third of the problem.
- Event programme with its own pages: Zomerstage, Spaghettiweekend, Mosselfeest
  (*"De lekkerste mosselen van het jaar vind je in Diegem!"*), Paasstage, Paasmaandag
  (*"Op Paasmaandag doet KDS ieder jaar mee aan de jaarmarkt in Diegem!"*), Jeugdtornooien,
  Legends Cup, Wintervoetbal, Techniekdag, Diegem Wintert, Kaas- en wijnavond — the last with
  **table reservation and a home-delivery option** (`/kaas/reserveer-je-tafel/levering/`).
- Carries **Double Pass 4-star** and **Panathlon ethics** certification, the latter on its own
  page. Also ships a `/rechtzetting/` page — a public corrections notice.
- **Where it fails:** [the lidgeld page](https://www.kdiegemsport.be/jeugdpagina/lidgeld/)
  lists four categories (*U5-U6-Futbalista*, *U7*, *U8-U18 2x trainen*, *U10-U19 3x trainen*)
  and then locks every actual amount inside a downloadable PDF. And its
  [opponent pages](https://www.kdiegemsport.be/club/kfc-eppegem/) carry full head-to-head
  history back to 2018 but give a visiting supporter no address, no travel, no price.

**Racing Mechelen — [racingmechelen.be](https://racingmechelen.be/)** (Belgian Division 2)

- **[Matchbal sponsorship, priced and productised](https://racingmechelen.be/word-sponsor-van-onze-matchbal/):**
  *"Een matchbal sponsoren kost 300 euro (excl. btw)"* — and then six named deliverables:
  *"Artikel op onze website"*, *"Vermelding op onze Facebook-pagina"*,
  *"Vermelding op het scorebord"*, *"Vermelding op het matchblad"*,
  *"Aankondiging door de stadionspeaker"*, and — the one that sells it —
  **"Je geeft de aftrap van de wedstrijd"**.
- The youth navigation is the most complete found at any tier: *Wie is wie?*,
  *Huishoudelijk reglement*, **API (Aanspreekpersoon Integriteit)**, *Missie & Visie*,
  *Voetballen bij Racing*, *Medische begeleiding*, *Sportongeval*, *ProSoccerData*,
  **Vacatures Jeugd**. The API (safeguarding contact) being a named nav item is a strong
  signal to parents.
- **[Vacatures Jeugd](https://racingmechelen.be/jeugd/vacatures-jeugd/)** reads like an actual
  job ad and lowers the barrier explicitly: *"Diploma is geen vereiste. We stimuleren wel het
  behalen van diploma o.a. via terugbetaling op cursuskosten."* It offers *"Een correcte
  vrijwilligersvergoeding"*, coordinator support, course reimbursement and free first-team
  access — and invites spontaneous applications.
- Note: `kracingmechelen.be` **does not resolve**; the live domain is `racingmechelen.be`.

**K. Rupel Boom F.C. — [rupelboomfc.be](https://www.rupelboomfc.be/)** (national amateur)

- **Runs a podcast**, [*Booms Kwartiertje*](https://www.rupelboomfc.be/podcast), 11 episodes
  across two seasons: *"Welkom bij Booms Kwartiertje, de officiële podcast van Rupel Boom,
  waar elke maand blauw-wit-zwarte beleving op je staat te wachten."* Interviews with players,
  coaches, **volunteers and supporters** — not just the manager.
- **Countdown timers on upcoming fixtures**, plus standings on the homepage.
- [Youth](https://www.rupelboomfc.be/jeugd) is structured as a curriculum, not a team list:
  *Missie & Visie*, *Voetbaltechnisch beleid*, *Opleidingsvisie*, **Gedragsregels**, and named
  programmes — *Speeltuin Young Stars*, *Fun&Formation 2v2/3v3/5v5*, *Voetbalschool*,
  *Voetbalacademie*, *Doelmannen*, *Techniek en REVA*, and a *Talentlijn* under Scouting.
- Honest about access: the secretariat is *"Enkel bereikbaar bij een thuiswedstrijd van het
  Eerste Elftal, vanaf 1 uur vóór de aftrap tot 1 uur ná het einde van de wedstrijd"*
  ([onze-club](https://www.rupelboomfc.be/onze-club)). Publishing your real, narrow
  availability beats implying you're always reachable.
- Splits [history](https://www.rupelboomfc.be/onze-club) into its two predecessor clubs
  (K. Rupel Sportkring, K. Boom F.C.) — directly relevant to how KCVV narrates its mergers.

**Sporting Hasselt — [sportinghasselt.be](https://www.sportinghasselt.be/)**

- Homepage is two match bands — *"Laatste wedstrijd"* and *"Volgende wedstrijd"* — then team
  sections that each carry a written claim rather than a photo:
  *"Het eerste elftal van Sporting Hasselt is méér dan een ploeg, het is pure passie in blauw,
  wit en groen."* and for youth: *"De toekomst van onze club. Iedereen krijgt de kans om te
  groeien in blauw, wit en groen."*
- **Six sponsor tiers** — main, official, supporting, suppliers, local, youth. Compare our
  three.
- Newsletter CTA written in Limburgish dialect: **"Schref oeg in"**. A one-line joke that does
  more identity work than the rest of the page.
- **[The FAQ is 100% ticketing](https://www.sportinghasselt.be/faq)** — account validation via
  itsme/Onfido, downloading tickets, buying for someone else. *"Het is niet mogelijk om
  meerdere tickets op één naam of emailadres te zetten."* A club FAQ that answers only the
  club's own commercial friction, not the visitor's questions.

**K. Berchem Sport — [berchem-sport.com](https://berchem-sport.com/)** (Derde Afdeling VV A —
our direct rival)

- **"Club 28"** — the supporters area named after the club's stamnummer, containing a
  *Supportersraad*. Naming a section after your matricule is exactly the kind of
  insider-warmth move that cannot be copied by anyone else.
- Cup headline with genuine voice: *"Croky Cup: Herleving RS Haasdonk – KBS 2-2 (strafschoppen
  4-1) … Berchem gaat de Crokyboot in!"*
- Publishes ground capacity precisely — *"360 overdekte zitplaatsen, 1.250 overdekte
  staanplaatsen"* ([club](https://berchem-sport.com/club/)) — and dates its history to an 1906
  wrestling and athletics club that turned to football in 1908.
- Ships **"KALENDERWIJZIGING"** as a news headline format — fixture changes announced as news
  because there is no better mechanism. This is the postponement gap made visible.
- Note: `berchemsport.be` and `kberchemsport.be` **do not resolve**.

**Other Derde Afdeling VV A rivals** (our own series,
[per Wikipedia](https://nl.wikipedia.org/wiki/Derde_afdeling_2026-27_(voetbal_België))):

- **SC City Pirates Antwerpen — [citypirates.be](https://www.citypirates.be/)** is the most
  distinctive club site in our division and possibly in Belgium. Top-level navigation is
  *Voetbalclub · Sociaal · Events · **Vrijwilligers** · Partners · **Doneren***. It publishes
  hard numbers — 1,645 members, 215 volunteers, **4,000+ on the waiting list**, 801 youth
  activities, 14 social coaches, 17 employees.
  [Its donation page](https://www.citypirates.be/doneren) is properly designed:
  *"Jouw gift maakt een direct verschil in het leven van onze spelers en de community."*, then
  three tiers tied to concrete things — **€26** buys a match ball for one of
  *"2.000 wedstrijden die jaarlijks bij City Pirates worden gespeeld"*, **€45** funds
  *huiswerkbegeleiding*, **€100** gives *"een complete voetbaluitrusting, inclusief een
  trainingspak, short, T-shirt en sokken, aan twee spelers"* — plus a 30% tax deduction over
  €40 with a *fiscaal attest*. Volunteers are asked for with
  *"Zonder onze vrijwilligers zouden we niet kunnen"*.
  [The social page](https://www.citypirates.be/sociaal) describes *"huisbezoeken,
  huiswerkbegeleiding en workshops"*. (`citypirates.be/partners` returned a redirect loop.)
- **KVK Ieper — [kvkieper.be](https://www.kvkieper.be/)**: English slogan on a Dutch site,
  **"We stand our ground."** — a good pun for Ieper specifically. Self-description:
  *"KVK Ieper is een ambitieuze voetbalclub uit Ieper die sportieve prestaties combineert met
  sterke waarden."* Teams include **G-Voetbal and Wandelvoetbal**. Roughly 40 sponsor logos
  presented completely undifferentiated — the anti-pattern to our tiering.
- **K. Olsa Brakel — [olsabrakel.be](https://www.olsabrakel.be/)**: tagline
  **"Olsa … méér dan voetbal alleen"** — i.e. the exact register KCVV has ruled out. Useful
  as proof that "meer dan een club" is a genre cliché, not a differentiator.
- **Avanti Stekene — [avantistekene.be](https://www.avantistekene.be/)**: a club in our series
  whose homepage headline is literally **"UNDER CONSTRUCTION"**, with *"Hello world!"* still
  sitting in its recent posts. Worth remembering when calibrating ambition.
- **Erpe-Mere United — [em-united.be](https://www.em-united.be/)**: motto
  **"OUR GOAL, OUR FAMILY"** (English, on a Dutch site — a recurring amateur tic);
  *"KLASSEMENT 2025-2026"* on the homepage; charters and fairplay policies published.
- **KVK Ninove — [kvkninove.be](https://www.kvkninove.be/)**: **"SAMEN STERK"**, and a
  top-level nav item **"Socio Business club"** promoted with *"RESERVEER NU UW GASTRONOMISCHE
  BELEVING IN ONZE SOCIO BUSINESS CLUB"* — matchday dining by a named chef, sold from the
  homepage. Amateur clubs monetising hospitality harder than we do.

**Blocked or unreachable at this tier:** `thessport.be`, `mandelunited.be`, `fcvdender.be`,
`kscblankenberge.be` — DNS does not resolve. `hoogstratenvv.be` and `kfcnijlen.be` — HTTP 403.
`fcgullegem.be` — self-signed TLS certificate. `lyra-lierse.be` — connection reset on both `/`
and `/nl`. No content from these is represented above.

### Neighbouring village clubs — our direct peers

**KFC Eppegem — [kfceppegem.be](https://www.kfceppegem.be/)**

- Single-page site with anchor navigation. Identity line is simply **"KFC EPPEGEM - sinds
  1947"** — a bare founding year stated as fact, which is exactly what KCVV cannot do.
- Runs **"Feestzaal huren"** as a homepage section — professional kitchen, parking, central
  location, `info@kfceppegem.be`. A revenue line presented as a service. We have a canteen and
  say nothing about it.
- **"Komende activiteiten"** plus a published **"Jaarplanning 2026-2027"** — the full club
  year in one artefact, which is a genuinely useful thing for a parent and something our
  `/evenementen` (80 events, one type) does not assemble.

**FC Zemst Sportief — [fczemst.be](http://www.fczemst.be/)**

- Tagline **"Da's tof sjotten!"** — pure dialect warmth, the closest register to
  *"Er is maar één plezante compagnie"* found in the neighbourhood.
- Recruitment written the same way: *"Interesse om te komen sjotten bij FC Zemst. Schrijf je
  dat snel in via het inschrijvingsformulier."*
- **Uses the same Bovenbouw / Middenbouw / Onderbouw grouping we do.** Our youth IA is not
  differentiating locally; what we do inside it has to be.
- Nav carries *Club (Contact, Organisatie, **Missie en visie**, Historiek)*, *Activiteiten*,
  **Formulieren** (contact, player registration, accident form, documents), *Inschrijven*,
  *Webshop*. A dedicated "Formulieren" section is a small, honest IA idea.

**SK Laar — [sklaar.be](https://www.sklaar.be/)**

- Two-item navigation: Home, Ploegen. 300+ members, 5 senior and 12 youth teams behind a
  two-link site.
- **Explicitly abdicates to social media**: *"Het laatste nieuws over evenementen en
  wedstrijden kan je terugvinden op onze Instagram en Facebook pagina"*. This is the honest
  version of what most village clubs do silently.
- Events named without ceremony: Krolcup (May), mussels (November), youth camp (August).

**FC Verbroedering Hofstade — [fchofstade.be](https://www.fchofstade.be/)**

- Fundraising told as a story: a signed KV Mechelen shirt auctioned to fund new changing
  rooms — *"Dit truitje zal geveild worden en zo een startschot zijn voor verschillende
  acties"*. Concrete goal, concrete object, concrete start.
- Youth includes a **G Ploeg** and **Veteranen** and a **U5/Voetbalspeeltuin**; ran a youth
  initiation day for children born 2016–2020.
- Handled a pitch renovation by publishing the temporary relocation to VK Weerde — an
  operational disruption treated as publishable news.
- Webshop is a third-party link (`brandsfit.com`) with discount code **"HOF"**.
- **Stale-content warning:** the nav still reads **"Lidgeld 2024-25"** in August 2026. The
  cautionary example for any pricing page we publish — a fee page that goes stale is worse
  than none.

### Provincial

**R.A.S. Saintoise — [rassaintoise.be](https://www.rassaintoise.be/)** (P1 Brabant Wallon)

- The best small-club homepage found in Belgium at any tier, and it is provincial.
- Hero: **"R.A.S. Saintoise — Plus forts que jamais"** with the sub-line
  **"Un club de cœur, une ambition de haut niveau"** — outsized ambition stated plainly by a
  provincial club, which is precisely KCVV's posture.
- **The primary hero CTA is "Inscrire mon enfant"**, paired with "Voir les matchs". A village
  club that has correctly identified the youth parent as a co-equal primary audience and put
  the conversion in the hero. Reinforced further down with **"Rejoins la famille R.A.S. !"**
- Standing achievement banner: **"🥈 Vice-Champions P1 Brabant Wallon 2025–2026"**.
- Publishes a **48-hour contact response promise** and states **free on-site parking** — two
  tiny commitments that cost nothing and signal seriousness.
- Full nav for a provincial club: Équipe · Calendrier · Club · Academy (+ Stages) · Infos ·
  Partenaires · **Boutique** · **Billetterie**.

### Francophone Belgium — Wallonia and Brussels

Read as a separate axis because the tone-of-voice and governance conventions differ sharply
from Flanders. Twelve sites read; the ones that changed a conclusion are below.

**RUS Rebecquoise — [rusrebecquoise.be](https://www.rusrebecquoise.be/)** (P1/P3 + ~300-player
academy) — **the closest structural peer to KCVV found anywhere, and the best fee page in
Belgium.**

- Motto is a chant, not a positioning line: **"Tous ensemble. On va le faire !"**
- [Fees published to the euro *and itemised*](https://www.rusrebecquoise.be/infos-saison-2026-2027):
  **450 €** U6–U9 (2×/week), **550 €** U10–U19 (3×/week). Then the discounts —
  *"Réduction de 50 € pour les joueurs domiciliés dans la commune de Rebecq"*,
  *"Réduction de 25 € pour le deuxième enfant issu d'une même famille (50 € pour le
  troisième)"* — a late fee of *"une majoration de 20 € … par mois de retard"*, and a full
  breakdown of what the money covers (federation affiliation, referees, accident insurance,
  qualified coaching, kit, utilities, pitch maintenance). Then what you get *back*: two free
  permanent parent passes, a full Adidas pack, and **a €15 credit toward the autumn-festival
  meal** if you pay early. A membership fee that buys you a drink at the club party is the
  entire register in one line.
- [Youth grouped by game format](https://www.rusrebecquoise.be/equipes-de-jeunes), not by age
  list: **"Jeu à 2 - 3 - 5"** (U6/U7 *Festifoot*, U8, U9), **"Jeu à 8"** (U10–U13),
  **"Jeu à 11"** (U14–U19).
- **`Connexion PSD` sits in the public primary nav** — same ProSoccerData stack we use,
  exposed as a parent login.
- The webshop sells exactly two things (season ticket €80, scarf €15) with the delivery policy
  shouted: **"PAS DE LIVRAISON — UNIQUEMENT ENLEVEMENT AU CLUB"**.
- But [the sponsors page](https://www.rusrebecquoise.be/sponsors) is three sentences and a
  named contact. No tier, no price, no deliverable.

**RFC Liège — [fcliege.be](https://www.fcliege.be/fr/)** (Challenger Pro League) — **the richest
governance content found on any club site in this research.**

- **[A "Comité de vigilance"](https://www.fcliege.be/fr/comite-de-vigilance/)** — a standing
  safeguarding/disciplinary committee with six named members, three-year terms, two chambers
  of three, majority decisions, a duty to convene **within ten days**, and the right of both
  parties to be *"assisté par un avocat"*. Remit stated verbatim: *"Examiner … si le
  comportement dénoncé est transgressif et indésirable."*
- **[A reporting channel with its own mailbox](https://www.fcliege.be/fr/signalement/)** —
  `safeguarding@fcliege.be` — naming the protected grounds explicitly (*"racisme, homophobie,
  islamophobie, antisémitisme, sexisme"*) and promising *"Votre signalement sera traité de
  manière discrète et confidentielle."*
- **[A named "Parent Fair-Play" officer](https://www.fcliege.be/fr/parents-fair-play/)** with a
  real job description — welcoming the away team and their parents, positioning parents at the
  touchline — and the closing line **"tout acte discriminant ou propos raciste n'a pas sa
  place au RFCL !"**
- [Fees](https://www.fcliege.be/fr/edj/cotisations/): **435 €** (U6–U9), **470 €** (U10–U13),
  **610 €** (U14–U18), with instalments and the blunt *"Pas de liquide."*
- [The full 13-category training grid on one HTML page](https://www.fcliege.be/fr/entrainement/),
  U6→U21, with goalkeeper sessions split by format — and the warmest practical sentence found
  anywhere: **"L'entrée est libre, tout comme l'accès à la buvette."**
- **But four live nav items 404** (`/sangmarine/`, `/pmr-au-stade/`, `/cashless-au-stade/`,
  `/histoire/`) and the Business Club page still advertises a 2019 event.

**RAAL La Louvière — [raal.be](https://www.raal.be/)** (Jupiler Pro League)

- **One metaphor carried through the entire IA.** The club is "Les Loups", so news is
  **"L'actu des Loups"**, sponsorship is **"Rejoignez la meute"**, the academy is
  **"Wolves Academy"**, the CSR programme is **"Cœur de Loup"**, and there is a recurring
  short-notes rubric called **"Les brèves des Loups"**. A Flemish club would have labelled all
  five "Nieuws", "Sponsors", "Jeugd".
- [The CSR section takes inbound proposals](https://www.raal.be/coeur-de-loup/): six named
  programmes (*Développement humain, Environnement, Collectes de sang, Handifoot, École des
  devoirs, RAAL Younited*) and an open ask — *"Vous souhaitez soumettre un projet social?"*
- **Match reports are written, not scored.** After a 2-1 defeat at Anderlecht:
  *"C'est reparti ! Nos Loups ont débuté leur deuxième année en Jupiler Pro League…"*, then
  *"la RAAL ne baissait pas les bras"*, *"une solidarité remarquable"*, closing on
  *"organisation, du caractère, de la solidarité"*. Defeat narrated as character.
- History as resurrection: *"En 2009, la Royale Association Athlétique Louviéroise
  disparaissait de la carte du football belge"* — then a 2017 relaunch and **250+ shareholders**
  described as *"entrepreneurs, students, retirees, volunteers, players"*.
- **Supporters-club directory as a first-class nav item** — four named groups, each with an
  email, and *"Vous souhaitez en faire partie? N'hésitez pas à les contacter et à vous
  affilier!"*

**Royal Excelsior Virton — [revirton.be](https://www.revirton.be/)** (Challenger Pro League)

- Strapline anchored to a region, not a town: **"Depuis 1922, le coeur vert du football
  gaumais"**.
- **[The centenary page is about people, not trophies](https://www.revirton.be/les-100-ans)** —
  titled **"Des générations en vert et blanc"**, describing the club as *"une grande famille
  ayant touché énormément de monde"* and running activities with schools, youth movements,
  shopkeepers, seniors, former players and neighbouring clubs. The jubilee content type done
  properly.
- **[Supporters get an editorial page in their own words](https://www.revirton.be/12e-homme)**,
  called **"12e homme"**, quoting each group's own charter and signing off **"Allez l'Excel!"**
- **[A real steward vacancy](https://www.revirton.be/candidature-steward)** with duties,
  boundaries (*"Les stewards ont un rôle primordial d'observation et n'interviennent qu'à titre
  préventif."*), a CV requirement and two phone numbers, one flagged "after 5 PM".
- [The most complete price grid found](https://www.revirton.be/billetterie): season tickets
  €185/€240/€60/€1,000 with early-bird rates, under-12s free, and an unusual product —
  **"Tribune Bus" at €80 including the pre-match meal**.
- But [the sponsoring page](https://www.revirton.be/sponsoring) leads with market statistics
  (*"71 % des intéressés football déclarent qu'une marque qui fait du sponsoring est
  particulièrement attractive"*) and then hides every offer behind a PDF.

**Union Namur — [unionnamur.be](https://www.unionnamur.be/)** (Nationale 1)

- Slogan as stadium banner: **"UNION | PASSION | FIERTE"**.
- **["SE PROPOSER" is a top-level nav item — a verb, not a noun.](https://www.unionnamur.be/contact-8)**
  The page is headed **"CANDIDATURES SPONTANEES"**: *"Nous sommes toujours ouverts à toutes
  personnes souhaitant s'investir pour le club"* — explicitly open to *"bénévole, étudiant,
  formateur ou à la recherche d'un contrat de travail"* — closing on **"Tous les talents sont
  les bienvenus."** Four form fields. **The single most copyable page in this research: one
  open door for volunteers, students, coaches and job-seekers alike.**
- `Bénévole` also sits as a club sub-page, sibling to *Histoire* and *Règlement* — volunteering
  framed as membership, not a favour.
- Homepage leads on the *seasonal* asks — *"LES INSCRIPTIONS 2026-2027 SONT OUVERTES!"*,
  *"STAGE D'ETE"*, *"RECRUTEMENT STAFF"* — not on the first team.

**RCS Brainois — [rcsbrainois.com](https://www.rcsbrainois.com/)** (Division 2 ACFF)

- **["Bien vivre ensemble"](https://www.rcsbrainois.com/bien-vivre-ensemble) is a youth nav
  item**, and its content is startlingly domestic — changing rooms kept in order, showers
  supervised, litter picked up, goals *"attachés lors de leur utilisation"* — framed as
  **"En collectivité, ces petits gestes permettent le bon fonctionnement de l'ensemble."**
  Coaches are made guarantors: *"Chaque formateur doit … être le garant de ces valeurs."*
- A top-level **"Chartes"** menu with four separate charters (joueur, entraineur, parents,
  *Vivons sport*) — charters as a destination, not an appendix.
- Youth nav also carries **"Accidents & Assurances"** — insurance in the parent journey.
- **`Inscription` is a top-level nav item — and so is `Démission`.** A "how to leave the club"
  page in primary navigation appeared on no other site, Flemish or francophone. Quietly
  excellent service design.

**RFC Seraing — [rfc-seraing.be](https://www.rfc-seraing.be/)** — identity stated via matricule
(*"titulaire du matricule 167 auprès de l'URBSFA"*), and **the only club found that handles a
closed recruitment window properly**: *"La période de test pour la saison 2026-2027 est
désormais clôturée"*, followed by *"Les informations concernant les prochains tests seront
publiées dans le courant du mois de janvier 2027."*
([recrutement](https://www.rfc-seraing.be/recrutement/)). Telling people when to come back is a
free UX win. Its [access page](https://www.rfc-seraing.be/acces/) is prose driving directions
with no transit, no parking and no map.

**RUTB Tubize-Braine — [rutb.be](https://www.rutb.be/)** (Nationale 1 ACFF) — first-person-plural
CTAs: **"Devenons partenaires"** (let's become, not "become"), **"We are RUTB"**,
**"Suivez la #RUTBFAMILY"**. The academy is separately branded *CDF 343* with the mission
**"Former des joueurs, mais surtout des hommes épanouis"**.
[Sponsor tiers are named publicly](https://www.rutb.be/partenaires/) — *Or / Argent / Bronze /
Starter* — with an explicitly anti-transactional pitch (*"l'idée n'est pas de faire du one-shot
mais de construire une relation durable"*) but still **no euro figures**. Its "Calendrier" nav
item still points at `/calendrier-2023-2024/`.

**RDC Cointe — [dccointe.be](https://www.dccointe.be/)** (~50 teams, Liège regional) — best
slogan of the whole survey, and it is an *anti*-performance statement:
**"Le sport entre amis d'abord."** The homepage is a kit-ordering and training-times flow
rather than a news feed, and the club archives its *Saint-Nicolas party*. It also publishes a
moderation policy with a human rationale: *"Conscient que ce site doit être celui de tous les
cointois, nous vous invitons à faire vos remarques et suggestions"*.

**Royal Léopold FC — [leopoldfc.com](https://www.leopoldfc.com/)** (Brussels, founded 1893) —
302-redirects to `rlfc.base44.app`: an amateur club shipping a **web app built on an AI
app-builder**, branded "LeopoldHub". Notable for **three separate joining doors** —
*Rejoindre* (players), *Coach Rejoindre* (coaches), *Jobs* — plus **Réinscription** as its own
route, treating the returning member as a distinct path from the new one. The cost of the
approach: no server-rendered content on `/Rejoindre`, and **no history page at all** for a
133-year-old club.

**Royal Olympic Charleroi — [olympic-charleroi.be](https://www.olympic-charleroi.be/)** — sells
itself as belonging to a people: *"Depuis 1911, l'Olympic de Charleroi fait vibrer le coeur des
Carolos"*, with news labelled **"Actu des dogues"**. But its
[ticket tariffs are inside a JPEG](https://www.olympic-charleroi.be/infos-billetterie/) —
unsearchable, uncopyable, invisible to screen readers — and its page called "Le club" contains
no history and no values, only a partner wall and the line *"Où voulez-vous aller ? Choisissez
ci-dessus !"* — a menu apologising for itself.

**Union Saint-Gilloise — [rusg.brussels/fr](https://www.rusg.brussels/fr)** — the only genuinely
trilingual site read (FR/NL/EN), and even there the French menu's B Corp link points into
`/nl/`. Publishes a mission/vision/values triad including
**"Diversité : source d'enrichissement mutuel."** and displays 4★ FSR, **B Corp**, *Label
Ecodyn* and *EcoVadis* as brand furniture.

> **Fact worth propagating beyond this file:** **ACFF has rebranded to FFA — "Football
> Francophone Amateur"** (`acff.be` 302-redirects to `ffa.be`). Any KCVV copy, glossary entry
> or `llms.txt` line referencing ACFF may now be stale.

---

## 5. Cross-cutting patterns

### What everybody does

- **Next match / last result on the homepage.** Universal from RSCA down to two-page village
  sites. Table stakes.
- **A sponsor wall.** Universal, and almost universally undifferentiated — KVK Ieper's ~40
  identical logos is the norm, our three-tier treatment is above average.
- **League table on the homepage** at amateur level (Rupel Boom, Erpe-Mere, KVK Ninove, and
  even Genk at pro level).
- **A "Missie & visie" page** — Diegem, Rupel Boom, FC Zemst, KVK Ieper, Racing Mechelen all
  have one. Almost all of them read like a grant application.
- **Newsletter signup**, at every tier. We have correctly ruled this out.
- **An English slogan on a Dutch site** — "We stand our ground.", "OUR GOAL, OUR FAMILY".
  Widespread and almost always weaker than the club's own dialect would be.
- **Deferring to Facebook/Instagram for anything time-sensitive** — stated outright by SK
  Laar, implied by most others.

### The language split — the single most useful finding

Flemish and francophone club sites fail in *different* places, and neither half knows what the
other does well.

| | Flanders | Wallonia / Brussels |
|---|---|---|
| **Youth fees** | Hidden in PDFs, or stale ([kdiegemsport.be](https://www.kdiegemsport.be/jeugdpagina/lidgeld/), [fchofstade.be](https://www.fchofstade.be/)) | Published to the euro, itemised, with sibling and local-resident discounts ([rusrebecquoise.be](https://www.rusrebecquoise.be/infos-saison-2026-2027), [fcliege.be](https://www.fcliege.be/fr/edj/cotisations/)) |
| **Governance / safeguarding** | Largely absent; Racing Mechelen's API link is the exception | A whole content pillar — vigilance committees, reporting mailboxes, named fair-play officers, role-split charters |
| **Section naming** | Functional ("Nieuws", "Sponsors", "Jeugd") | Driven by the club nickname ("L'actu des Loups", "Rejoignez la meute", "Actu des dogues") |
| **Volunteering** | A page called "word vrijwilliger" | A verb in the nav ("SE PROPOSER"), open to volunteers, students, coaches and job-seekers at once |
| **Match-ball sponsorship** | A live product ([racingmechelen.be](https://racingmechelen.be/word-sponsor-van-onze-matchbal/)) | Found on no francophone site at all |
| **Match reports** | Rare; filed as generic news | Rare below tier 2, but RAAL writes genuine narrative |

KCVV can take the francophone half — fee transparency, published governance, nickname-driven
naming, the open-door volunteer page — and pair it with the Flemish half we already sit in.
None of our Flemish rivals will recognise where it came from.

### What almost nobody does

1. **Publish sponsor prices.** Member-end pricing is solved in Wallonia and broken in Flanders,
   but **sponsor-end pricing is broken everywhere**: not one of the twenty-plus clubs read
   published a package price on an HTML page. All defer to a PDF or *"demandez un rdv"* —
   [raal.be](https://www.raal.be/business/), [revirton.be](https://www.revirton.be/sponsoring),
   [unionnamur.be](https://www.unionnamur.be/business),
   [rutb.be](https://www.rutb.be/partenaires/),
   [rusrebecquoise.be](https://www.rusrebecquoise.be/sponsors),
   [rfc-seraing.be](https://www.rfc-seraing.be/partenariat/). Racing Mechelen's €300 match ball
   is the only published sponsor price found in Belgium, and it is a news article, not a
   product page. **A club that publishes tiers with prices and deliverables would be alone in
   this market.**
2. **Tell a visitor how to physically get there.** Diegem's car-only route page is the *best*
   example found; Seraing's is prose driving directions with no transit, parking or map; RAAL's
   arena page offers one parking sentence. No train, no bus, no bike, no "which gate". For a
   Nationale 3 club receiving away supporters, this is a real and unserved need — and it is one
   of our two named primary audiences.
3. **Answer "when and where does my kid play" in one place.** Training grids exist, calendars
   exist, but no club combines *this week's fixture + kick-off + address + who to call* on a
   team page. Parents are pushed to ProSoccerData or Facebook —
   [rusrebecquoise.be](https://www.rusrebecquoise.be/) literally puts "Connexion PSD" in its
   public nav. **The biggest unclaimed UX prize in the survey, and we already own the data.**
4. **Keep a memorial.** No club site read has a permanent in memoriam page; Diegem's "Marianne"
   post is a news article that will scroll away. Tributes live on Facebook and in the regional
   press. Virton's centenary is the closest anyone comes to durable club memory.
5. **Handle a closed door.** Only [rfc-seraing.be](https://www.rfc-seraing.be/recrutement/)
   tells a parent when trials reopen. Everyone else's recruitment page is either permanently
   open or silently dead.
6. **Keep the past.** Diegem's season archives are the only permanent competitive record
   found. Everyone else's history page stops at the founding decade and resumes at "last
   season". We already hold the richest per-season dataset of any club at our level and bin
   it annually.
7. **Handle the abnormal matchday.** Postponements, pitch changes, cancelled fixtures,
   relocations. Berchem announces "KALENDERWIJZIGING" as a news article; Hofstade published
   a relocation as a blog post. Nobody has a *state* for it. The cheap template ships a whole
   notification centre for this and the custom sites don't.
8. **Ask for volunteers in a way anyone can say yes to.** Everyone has a "word vrijwilliger"
   page; only Diegem asks for a named three-hour shift with "het maakt me niet uit" as a
   legitimate answer.
9. **Write anything.** Across every Belgian site read, the total volume of genuine editorial
   voice was: KV Mechelen's labels, FC Zemst's *"Da's tof sjotten!"*, Sporting Hasselt's
   dialect newsletter button, Berchem's Crokyboot pun, Diegem's football-law explainer, Rupel
   Boom's podcast — and on the francophone side RAAL's narrated match reports, Cointe's
   *"Le sport entre amis d'abord."*, Virton's *"Des générations en vert et blanc"* and Liège's
   *"L'entrée est libre, tout comme l'accès à la buvette."* That is the entire national output,
   both languages, every tier. **Voice is the cheapest available differentiator and it is
   essentially unclaimed.**
10. **Treat youth information as content rather than a team list.** RSCA's Neerpede page is ten
   cards. Rupel Boom and Racing Mechelen are the only clubs found that explain their youth
   work to a parent, and Racing Mechelen is the only one that names its safeguarding contact
   (API) in navigation.
11. **Serve the visiting supporter.** Diegem builds opponent pages full of head-to-head
   statistics and gives the actual away traveller nothing. We already ship
   `/tegenstander/[clubId]`.

### The structural insight

Belgian club websites split cleanly into two failure modes. **Pro clubs** build excellent
commerce funnels and abandon everything that doesn't sell — RSCA's academy page is emptier
than a provincial club's. **Amateur clubs** build honest, information-dense sites with no
craft, no voice, and no maintenance discipline (a rival in our own series is publicly "UNDER
CONSTRUCTION"; a neighbour's fee page is two years stale).

Nobody is occupying the middle: **the craft of a pro site applied to the honesty of an amateur
one.** That is the position KCVV can take, and it is mostly a content and copy programme, not
an engineering one.

---

## 6. Recommendations

### Adopt

| What | Why it fits KCVV | Effort | Source |
|---|---|---|---|
| **Published lidgeld, in text, per age band, with what it includes and the mutualiteit refund** | Youth parents are a named co-equal primary audience. The one question they all have is unanswered by every peer. Extend `/club/praktische-informatie` or add `/club/lidgeld`. | S | [kdiegemsport.be](https://www.kdiegemsport.be/jeugdpagina/lidgeld/) (as anti-pattern), [fchofstade.be](https://www.fchofstade.be/) |
| **A real travel page** — car, bike, bus, train-plus-walk, parking, which entrance, for both home and away visitors | PRODUCT.md's second audience is the away supporter with a "narrow and sharp" need. This is that need. Nobody in Belgium serves it. | S | [kdiegemsport.be/routebeschrijving](https://www.kdiegemsport.be/routebeschrijving/) |
| **Entry prices on the site** | Same audience, same tap. Costs one CMS field. | S | [kdiegemsport.be](https://www.kdiegemsport.be/supporteren-tickets/) |
| **Matchbal / wedstrijdsponsor as a priced product with named deliverables** | Direct hit on the "deliver sponsor value" success criterion, and creates an entry-tier sponsor product below our three existing tiers. Copy the deliverable list; "je geeft de aftrap" is the hook. | S | [racingmechelen.be](https://racingmechelen.be/word-sponsor-van-onze-matchbal/) |
| **Per-season archive pages** (`/seizoen/[jaar]` or under `/club/geschiedenis`) — final table, all results, per-player appearances/goals/assists, narrative paragraph | We already sync every one of these fields from PSD for **all** teams including youth. Diegem does this by hand for one team. This is a pure "punch above the division" play using data we already have. | M | [kdiegemsport.be](https://www.kdiegemsport.be/geschiedenis/archief-seizoen-2024-2025/) |
| **Named-shift volunteer sign-up attached to each event** | `/club/vrijwilliger` exists but asks for a role, not a shift. Attach shifts to `event` documents; keep "het maakt me niet uit" as an option. | M | [kdiegemsport.be](https://www.kdiegemsport.be/evenementen/mosselfeest/meewerken-op-het-mosselfeest/) |
| **A postponement / afgelasting state** on match, team and calendar surfaces | The most common real matchday question in Belgian amateur football, and the €455 template ships a notification centre for it while we ship nothing. | M | [voetbalassist.be](https://www.voetbalassist.be/clubwebsite/), [berchem-sport.com](https://berchem-sport.com/) |
| **Adopt the `matchPreview` / `matchRecap` types that already exist** | Both are in the schema with a validated PSD match-id binding, and both have zero documents in production. Reports are currently filed as `announcement`, so they are unfilterable, unarchivable and invisible on the match they describe — while the correct type sits unused one radio button away. Investigate the authoring blocker first; PRODUCT.md is explicit that authoring friction is a real product constraint. | S | inventory + [voetbalassist.be](https://www.voetbalassist.be/clubwebsite/) |
| **Club-wide topscorers, and a player career view across seasons** | 294 player records, per-season stats already synced. Cheap to derive, and it is the page supporters actually argue about. | M | [voetbalassist.be](https://www.voetbalassist.be/clubwebsite/) |
| **Name the labels.** Replace generic UI nouns with KCVV ones, the way KVM ships "Geel-Rood nieuws" and "Herbeleef de match" | Zero engineering. Highest voice-per-euro move available, and directly serves "Er is maar één plezante compagnie" without ever printing the motto again. | S | [kvmechelen.be](https://www.kvmechelen.be/) |
| **Name the safeguarding contact (API) in navigation, not buried** | Parent trust; a legal role most clubs hide. Racing Mechelen is the only club found doing it. | S | [racingmechelen.be](https://racingmechelen.be/) |
| **A published club year — "Jaarplanning"** — one artefact showing the whole season's events | We have 80 event records and no annual view. Eppegem publishes theirs as a PDF; we can render it. | S | [kfceppegem.be](https://www.kfceppegem.be/) |
| **Group youth by game format** — 2v2/3v3/5v5 · 8v8 · 11v11 — above or instead of the flat age list | Maps to how the game is actually played at each age, which is the parent's real mental model. `/jeugd` already groups Bovenbouw/Middenbouw/Onderbouw — but so does FC Zemst, so that grouping is not differentiating locally. | S | [rusrebecquoise.be](https://www.rusrebecquoise.be/equipes-de-jeunes), [rupelboomfc.be](https://www.rupelboomfc.be/jeugd) |
| **One open door for helping out** — a single page welcoming volunteers, coaches, students and job-seekers together, in the nav as a verb | `/club/vrijwilliger` exists but reads as one narrow ask. Union Namur's "SE PROPOSER" / *"Tous les talents sont les bienvenus"* is one page doing four jobs, and it fits "plezante compagnie" exactly. | S | [unionnamur.be](https://www.unionnamur.be/contact-8) |
| **Publish the charters in HTML** — gedragscode per role (speler, trainer, afgevaardigde, ouder), plus who the API is and how to report something | An entire content pillar francophone clubs treat as a destination and Flemish clubs skip. Directly serves youth parents, costs no engineering, and cannot be faked by a rival overnight. | M | [rcsbrainois.com](https://www.rcsbrainois.com/bien-vivre-ensemble), [rusrebecquoise.be](https://www.rusrebecquoise.be/roi-et-chartes-jeunes), [fcliege.be](https://www.fcliege.be/fr/comite-de-vigilance/) |
| **A "hoe stop ik" / uitschrijven page** | `Démission` in RCS Brainois's primary nav was unique across every site read. Trust-building, honest, and something a club confident in its own atmosphere can afford to publish. | S | [rcsbrainois.com](https://www.rcsbrainois.com/) |
| **State when a closed door reopens** | If youth intake or a team is full, say when to come back. Only one club in Belgium does this. | S | [rfc-seraing.be](https://www.rfc-seraing.be/recrutement/) |
| **Publish sponsor tiers *with* prices and deliverables** | Not one Belgian club — Flemish or francophone — publishes a sponsor package price on a web page. Doing so would make us the only one, and directly serves the "deliver sponsor value" criterion. | S–M | absence across [raal.be](https://www.raal.be/business/), [revirton.be](https://www.revirton.be/sponsoring), [unionnamur.be](https://www.unionnamur.be/business), [rutb.be](https://www.rutb.be/partenaires/) |

### Adapt

| What | How to change it for KCVV | Effort | Source |
|---|---|---|---|
| **Away-guide on `/tegenstander/[clubId]`** | The route already exists. Diegem fills opponent pages with head-to-head stats and no logistics; do the inverse *as well* — ground name, address, travel, entry price, plus our head-to-head. Serves the away-travelling KCVV supporter, which nothing currently does. | M | [kdiegemsport.be](https://www.kdiegemsport.be/club/kfc-eppegem/) |
| **"Ploeg van het decennium"-style fan poll** | Diegem's weekly per-position vote is genuinely good fanzine material and fits "retro-terrace fanzine" exactly. Adapt as a one-off editorial series rather than a permanent feature; it needs no new data model. Watch PRODUCT.md's "no accounts" rule — must work anonymously. | M | [kdiegemsport.be](https://www.kdiegemsport.be/ploeg-van-het-decennium/) |
| **The football-law / matchday-conduct explainer** | Diegem's works because a named human wrote it and it ends warmly. Adapt to a short, plain-Dutch "wat mag wel en niet op de Dries" written in club voice — not a legal reprint. Fits the "less-digital visitors" accessibility commitment. | S | [kdiegemsport.be/voetbalwet](https://www.kdiegemsport.be/voetbalwet/) |
| **Kantine / feestzaal information** | Eppegem rents its hall and says so. We have a canteen and publish nothing — opening hours, what's on, whether it's open after a U11 match. Adapt as practical info rather than as a commercial page, unless the club wants the rental revenue. | S | [kfceppegem.be](https://www.kfceppegem.be/) |
| **Concrete-outcome donation/fundraising tiers** | City Pirates ties €26 to a match ball and €100 to two kits. If KCVV ever fundraises for a specific thing (Hofstade's changing-room auction is the local model), copy the specificity, not the charity framing — we are not a social-work organisation and shouldn't pose as one. | M | [citypirates.be/doneren](https://www.citypirates.be/doneren), [fchofstade.be](https://www.fchofstade.be/) |
| **A supporters section with its own name** | Berchem's "Club 28" is named after its stamnummer. Ours is 55. `/club/angels` and `/club/ultras` already exist; an umbrella with a stamnummer-derived name is a free identity win. | S | [berchem-sport.com](https://berchem-sport.com/) |
| **Youth presented as a curriculum, not a team list** | Rupel Boom names its programmes and publishes its *Opleidingsvisie* and *Gedragsregels*. `/jeugd` already has a `JeugdVisie` component — extend to named programmes, training frequency per age, and what a parent's week looks like. | M | [rupelboomfc.be/jeugd](https://www.rupelboomfc.be/jeugd) |
| **A podcast or a recurring editorial format** | Rupel Boom interviews volunteers and supporters, not just players — that is the "plezante compagnie" register. Adapt to whatever the club can actually sustain; a written recurring column is a valid lower-effort version. | L | [rupelboomfc.be/podcast](https://www.rupelboomfc.be/podcast) |
| **Sponsor tiering depth** | Sporting Hasselt runs six tiers (main, official, supporting, suppliers, local, youth). We run three. "Suppliers" and "youth sponsor" are real distinct relationships worth naming — but do not tier for its own sake; PRODUCT.md warns against sponsor-hierarchy reasoning. | S | [sportinghasselt.be](https://www.sportinghasselt.be/) |
| **A "Formulieren" / downloads hub** | `/club/downloads` exists. FC Zemst groups contact, registration, accident-report and documents into one honest section — worth checking ours matches that completeness, especially the *aangifte sportongeval*, which every peer surfaces and parents genuinely need. | S | [fczemst.be](http://www.fczemst.be/), [sklaar.be](https://www.sklaar.be/) |
| **A nickname-driven naming layer** | RAAL renames five sections off "Les Loups"; Charleroi off "Les Dogues". We should not invent a mascot — but "plezante compagnie" is already a name for the *people*, and the labels can lean on it the way KVM leans on "Geel-Rood". Adapt as copy, never as fabricated chrome. | S | [raal.be](https://www.raal.be/), [olympic-charleroi.be](https://www.olympic-charleroi.be/) |
| **A permanent in memoriam page** | Nobody in Belgium has one; Diegem's tribute is a news post that will scroll away. Adapt carefully — this is a club decision about who is listed and who decides, not a feature. See open questions. | S | absence everywhere; [kdiegemsport.be](https://www.kdiegemsport.be/) |
| **Itemise what the lidgeld buys** | Rebecquoise lists federation fees, referees, insurance, coaching, kit, utilities and pitch maintenance — then what the family gets back. Adapt the *itemisation*, which is what converts a price into a justification. | S | [rusrebecquoise.be](https://www.rusrebecquoise.be/infos-saison-2026-2027) |
| **Hand the supporter groups the microphone** | `/club/angels` and `/club/ultras` are club-written today. Virton's "12e homme" quotes each group's own charter and sign-off. Adapt as guest copy from the groups themselves — free content with a voice we cannot write ourselves. | S | [revirton.be/12e-homme](https://www.revirton.be/12e-homme) |
| **A jubilee page about people, not honours** | Virton's centenary is framed as *"Des générations en vert et blanc"* and organised around schools, shopkeepers, seniors and neighbouring clubs. If KCVV ever marks an anniversary, this is the model — and it sidesteps the 1909 problem entirely by being about generations rather than a founding date. | M | [revirton.be/les-100-ans](https://www.revirton.be/les-100-ans) |

### Reject

| What | Why we should not do it | Source |
|---|---|---|
| **Newsletter signup** | Ruled out by PRODUCT.md. Present on RSCA, Genk, Racing Mechelen, Erpe-Mere, Sporting Hasselt, RAS Saintoise — its ubiquity is not an argument. | multiple |
| **"Méér dan voetbal alleen" / "more than a club" register** | Olsa Brakel's literal tagline and Sporting Hasselt's "méér dan een ploeg". A genre cliché, and explicitly forbidden by our brand commitments. | [olsabrakel.be](https://www.olsabrakel.be/), [sportinghasselt.be](https://www.sportinghasselt.be/) |
| **English slogans on a Dutch site** | "We stand our ground.", "OUR GOAL, OUR FAMILY". Reads as borrowed ambition. Our dialect motto is stronger than any English line we could write. | [kvkieper.be](https://www.kvkieper.be/), [em-united.be](https://www.em-united.be/) |
| **A bare founding year** | Eppegem's "sinds 1947" is legitimate for Eppegem. 1909 is inherited via mergers and is not ours to assert (#2422/#2435). Do not copy the pattern even though every neighbour has one. | [kfceppegem.be](https://www.kfceppegem.be/) |
| **A ticketing-only FAQ** | Sporting Hasselt's FAQ answers only its own commercial friction. If we build an FAQ it must answer visitor questions (when does my kid play, what does it cost, how do I get there, is the match on). | [sportinghasselt.be/faq](https://www.sportinghasselt.be/faq) |
| **Business-club / hospitality funnel as navigation** | RSCA gives four of five nav slots to commerce; KVK Ninove promotes gastronomic matchday dining from the homepage. Our nav is deliberately flat and audience-neutral (#2408); a commerce item would rank sponsors above both primary audiences. | [rsca.be](https://www.rsca.be/nl), [kvkninove.be](https://www.kvkninove.be/) |
| **Live scores / liveblog / live tussenstanden** | On the VoetbalAssist module list and therefore tempting as "table stakes". Explicitly excluded by PRODUCT.md, and our PSD read-path cannot support it. | [voetbalassist.be](https://www.voetbalassist.be/clubwebsite/) |
| **A stats-only opponent page** | Diegem's head-to-head archive is impressive and useless to the person actually reading it. If we extend `/tegenstander/`, logistics first. | [kdiegemsport.be](https://www.kdiegemsport.be/club/kfc-eppegem/) |
| **Certification badges as decoration** | Diegem and Olsa Brakel display Double Pass 4-star and Panathlon marks. Only display a certification we actually hold; PRODUCT.md forbids fabricated credentials. | [kdiegemsport.be](https://www.kdiegemsport.be/panathlonverklaring-ethiek-in-de-sport/) |
| **PDF- and JPEG-only content** | The most common failure in the survey. Ticket tariffs as an image; parent info as three PDFs; all seven charters as PDFs; every sponsorship deck. Unsearchable, unlinkable, hostile on a phone, invisible to screen readers — and directly against our "less-digital visitors" commitment. If we publish charters or fees, they are HTML. | [olympic-charleroi.be](https://www.olympic-charleroi.be/infos-billetterie/), [rcsbrainois.com](https://www.rcsbrainois.com/), [rusrebecquoise.be](https://www.rusrebecquoise.be/roi-et-chartes-jeunes) |
| **Google Forms at the moment of joining** | Union Namur, RFC Liège and RUTB all hand a family to an unbranded third-party form at the single point where the club actually touches them. We already own `/club/word-lid` → `/api/membership`. Never regress to this. | [unionnamur.be](https://www.unionnamur.be/), [fcliege.be](https://www.fcliege.be/fr/rejoignez-lecole-des-jeunes/) |
| **App-shell / SPA club sites** | Royal Léopold FC (founded 1893) ships an AI-app-builder "hub" whose join page has no server-rendered content and which has **no history page at all**. A cautionary tale about treating a club site as an internal tool. | [leopoldfc.com](https://www.leopoldfc.com/) |
| **Emoji as section headings** | RDC Cointe's homepage headings are 🟢 ENTRAÎNEMENTS / ⚽ MATCHS / 🛍️ COMMANDER. The *ordering of concerns* is right and worth stealing; the emoji violate our Phosphor-Fill-no-emoji rule. | [dccointe.be](https://www.dccointe.be/) |
| **Nav items that outrun the site** | Four live RFC Liège menu items 404; RUTB's "Calendrier" points at a 2023-24 URL. Do not add a nav entry before the page behind it is real — our `nav-reachability.test.ts` guard already encodes this and should stay. | [fcliege.be](https://www.fcliege.be/fr/), [rutb.be](https://www.rutb.be/) |

---

## 7. Open questions for Kevin

1. **Can we publish lidgeld?** This is recommendation #1 and it is a club decision, not a
   product one. If the answer is yes, who owns keeping it current — Hofstade's page has been
   stale since 2024 and a wrong price is worse than no price.
2. **Is there an entry price at the Dries, and can it go on the site?** Needed for the away
   supporter, who PRODUCT.md names as an audience.
3. **Does the club want to sell a wedstrijdbal sponsorship?** €300 is Racing Mechelen's
   Division 2 price; ours would differ. The question is whether the club can deliver the
   package (scoreboard, speaker, kickoff) — the deliverables are the product, not the page.
4. **Who is the API / aanspreekpersoon integriteit, and may we name them in navigation?**
5. **What is the canteen's actual schedule?** We publish nothing about the one place everyone
   physically goes.
6. **Is there an appetite for a recurring editorial format** — a column, a podcast, a
   volunteer interview series? Several recommendations depend on someone writing regularly,
   and PRODUCT.md is explicit that editors are volunteers and authoring friction is real.
7. **How do fixture postponements currently reach people?** Facebook, presumably. Knowing the
   real current workflow determines whether a site-side afgelasting state helps or duplicates.
8. **Only one photo gallery exists in production.** Is `/galerij` a feature the club wants to
   use, or should it be quietly retired? Building more image-dependent surfaces is a bad bet
   given there is no photographer (#2411).
9. **Do we hold any certification** (Double Pass, Panathlon, Voetbal Vlaanderen quality
   label)? If so it should be visible; if not, nothing should imply it.
10. **Is a fan poll acceptable** given the no-accounts rule? A "ploeg van het decennium"
    series is anonymous-friendly but needs an abuse stance.
11. **Do the club's charters / gedragscodes exist in writing?** If they do, publishing them as
    HTML is a small job with outsized trust value. If they do not, writing them is a board
    decision, not a website one.
12. **Do we want a permanent in memoriam page, and who decides who is on it?** No Belgian club
    has one, which is an opportunity — but it is also the single most sensitive page a club
    can publish, and the policy has to come before the page.
13. **Can we publish sponsor package prices?** Nobody in Belgium does. It would be a genuine
    first, but it constrains negotiation and is squarely a commercial call.
14. **Does the club use "ACFF" anywhere in its copy or glossary?** The federation has rebranded
    to **FFA (Football Francophone Amateur)** — `acff.be` now redirects to `ffa.be`.
15. **Are `matchPreview` / `matchRecap` staged for go-live, or stalled?** The types exist, bind
    to a match, and have zero documents — but the Next.js site is not publicly live yet, so
    "unadopted" and "not yet launched" are indistinguishable from a count. If stalled: is it
    that editors don't know they exist, that the form is too heavy, or that the PSD match id is
    hard to find? Each answer implies a different fix, and every "add a match report feature"
    proposal is wasted until this is settled.
16. **Why are none of the 80 events in the future?** This one is not explained by staging. An
    events section with nothing upcoming is worse than none at all, and it is visible to every
    visitor from day one. Seasonal gap, ownership gap, or broken authoring path?

---

## Appendix — sites that could not be read

Stated explicitly rather than guessed at.

| Site | Failure |
|---|---|
| [clubbrugge.be](https://www.clubbrugge.be/) | HTTP 403 on `/nl`, HTTP 429 on root |
| [lyra-lierse.be](https://lyra-lierse.be/) | Connection reset on `/` and `/nl` |
| [hoogstratenvv.be](https://www.hoogstratenvv.be/) | HTTP 403 |
| [kfcnijlen.be](https://www.kfcnijlen.be/) | HTTP 403 |
| fcgullegem.be | Self-signed TLS certificate |
| thessport.be · mandelunited.be · fcvdender.be · kscblankenberge.be · kslonderzeel.be · berchemsport.be · kberchemsport.be · kracingmechelen.be | DNS does not resolve |
| [voetbalvlaanderen.be/club/1634](https://www.voetbalvlaanderen.be/club/1634) | Client-side rendered; returned an empty document |
| [twizzit.com/nl](https://www.twizzit.com/nl) | 302 to a login-only app shell; no public feature list |
| [prosoccerdata.com/nl](https://www.prosoccerdata.com/nl) | 302 to a splash page |
| [citypirates.be/partners](https://www.citypirates.be/partners) | Redirect loop |
| URSL Visé (`urslvise.be`) | HTTP 404 — no live site (consistent with the club's 2024 licence refusal) |
| RWDM (`rwdm.brussels`) | TLS failure — certificate presented is for `*.l27powered.eu` |
| Crossing Schaerbeek (`crossingschaerbeek.com`) | DNS does not resolve, with or without `www` |
| RSD Jette (`rsdjette.brussels`) | Self-signed certificate |
| RRC Stockay-Warfusée (`rrcstockay-warfusee.be`) | DNS does not resolve; Footeo mirror returned HTTP 403 |
| [acff.be](https://www.acff.be/) | 302 to `ffa.be`, which returned an empty JS shell |

Partial failures inside sites that were otherwise readable: `fcliege.be/fr/sangmarine/`,
`/pmr-au-stade/`, `/cashless-au-stade/` and `/histoire/` all 404 despite being live nav items;
`rcsbrainois.com/informations-aux-parents` and every charter on `rusrebecquoise.be` are
PDF-only; `raal.be/business/`, `revirton.be/sponsoring` and `unionnamur.be/business` all defer
pricing to PDFs.
