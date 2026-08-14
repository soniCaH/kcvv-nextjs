# International benchmark — non-Belgian small clubs that punch above their weight online

Primary-source research, August 2026. Scope: **non-Belgian** clubs only. Sibling documents cover the
Belgian tiers and our own-site inventory.

Every club below is marked with its country and league level. Every claim carries a source URL. Where a
site blocked fetching or was unreachable, that is stated explicitly rather than filled in from memory.

**Our baseline** (what we already ship, so nothing here proposes it as new): `/`, `/nieuws`,
`/nieuws/[slug]`, `/ploegen`, `/ploegen/[slug]`, `/ploegen/[slug]/wedstrijden`, `/jeugd`,
`/jeugd/[slug]`, `/kalender`, `/wedstrijd/[matchId]`, `/tegenstander/[clubId]`, `/spelers/[slug]`,
`/staf/[slug]`, `/evenementen`, `/galerij`, `/sponsors`, `/zoeken`, `/hulp`, `/privacy`,
`/club/geschiedenis`, `/club/bestuur`, `/club/jeugdbestuur`, `/club/angels`, `/club/ultras`,
`/club/contact`, `/club/word-lid`, CMS pages at `/club/[slug]` (incl. praktische informatie), iCal
export at `/api/calendar.ics`, share cards, membership form. Source:
`apps/web/src/app/` route tree, `apps/web/PRODUCT.md`, `apps/web/public/llms.txt`.

---

## 1. Executive summary — top 10 from this tier, ranked by impact ÷ effort

| # | Recommendation | Effort | Why it wins |
| --- | --- | --- | --- |
| 1 | **`/club/bereikbaarheid` — a real "how to get to the Driesstraat" page.** Train/bus/car/bike/walk, parking reality, minutes-on-foot from each option, what3words or a pin. | S | We have a named audience — "opposition supporters travelling to a national-league fixture" (`PRODUCT.md`). **Corrected 2026-08-14:** `/club/contact` is not bare — its "Kom naar ons." section already carries a maps route link, parking, entry prices, kantine hours and accessibility. What it does not carry is the *travel* half: no train, no bus, no bike, no minutes-on-foot. So this is an extension of `/club/contact`, not a new page beside it. Lewes, Clapton and Wingate & Finchley all treat this as a first-class page. |
| 2 | **A matchday-practicals page: what a first-time visitor should expect.** Entry price, cash or card, kantine opening time, what's on the menu, dogs, kids, toilets, when the gate opens. | S | Wingate & Finchley's "Visiting Fans Guide" is the single highest-value-per-word page found in this whole tier — and it needs no photographer, no CMS work beyond one authored page. |
| 3 | **`/club/vrijwilligers` — named volunteer roles with a named contact each, not a general "help us" plea.** | S | "Recruit players and volunteers" is success criterion #1 in `PRODUCT.md`, and we have no volunteering surface at all. Clapton lists five concrete roles, each with its own e-mail and an explicit skill floor ("no special skills", "no commitment – just join when you can"). |
| 4 | **A toegankelijkheid block (accessibility of the ground, not the website).** Where to park if you can't walk far, is the path to the terrace flat, where's the accessible toilet, who to ask for help. | S | Zero Belgian amateur clubs do this. Lewes's page is short, plainly written, and admits what the club *cannot* yet do — which is the part that makes it credible. |
| 5 | **A "veilig sporten" / API page with a real named person and a real reporting route.** | S | Flanders already expects clubs to have an Aanspreekpunt Integriteit. Roter Stern Leipzig turns this into a *feature* — a standing "Vorfall melden" page in the club menu. We currently surface nothing. Lowest-effort, highest-trust item on the list. |
| 6 | **Appearance milestones / erelijst derived from the PSD data we already sync.** | M | Clapton's Hall of Fame is just a sorted table — bronze at 50 caps, silver at 100, gold at 150, with photo + name + number. We already have per-player season statistics for **every** team U6–U21. Nobody in this tier has that data; we do and don't use it. |
| 7 | **A club calendar/programme PDF or "clubblad" archive as a permanent, browsable section.** | M | Dulwich and Lewes both run programme archives. We already have `/scheurkalender` as a private poster source and a real editorial archive in Sanity — the archive-as-destination pattern is the gap, not the content. |
| 8 | **"Waar gaat je lidgeld naartoe?" — a plain-language money page, no accounts required.** | M | Lewes publishes 14 years of audited accounts; Clapton publishes monthly income & expenditure. Neither register transfers. What transfers is the *question*: a one-page, honest breakdown of what a season costs a member and what it buys. |
| 9 | **A bestuur page that shows faces and says what each person actually does.** | S | We have `/club/bestuur` and `/hulp` already — the gap is qualitative. Lewes lists board + staff with photo, role and a working e-mail for the club secretary. Clapton lists committees with a remit sentence and a dedicated address each. |
| 10 | **A club "gedragscode" / supporterscharter written in club voice, not legal voice.** | M | Lewes's fan behaviour policy opens by *encouraging* supporters to be "passionate and loud" before it sets any boundary. That inversion is the transferable part. |

---

## 2. Club-by-club notes

### 2.1 Lewes FC — England, Isthmian League Premier Division (tier 7, non-league)

<https://www.lewesfc.com/> · read: homepage, Equality FC, Finances, Disability Access, Admission
Prices, Fan Behaviour Policy, travel, Online Programmes, Anti-gamblification, Club Officials, Become an
Owner (11 pages).

- **Top-level nav contains an "Our Ethos" section** alongside News / Teams / Matchday / Ownership /
  Commercial / Club Information. Its children are Equality FC, Equal FA Cup, Anti-gamblification of
  Football Campaign, Environmental Sustainability. This is the clearest example in the tier of a club
  giving *stances* their own IA branch rather than burying them in news.
  (<https://www.lewesfc.com/>)
- **"Matchday" is a navigation branch, not a page.** Its children: Admission Prices, How to Get to Us,
  Online Programmes, Fan Behaviour Policy, Disability Access. Every practical question a visitor has is
  one click from the top nav. We have none of these five.
- **Finances page publishes 14 years of audited accounts (2011–2024) for two legal entities** — the
  community club and the operating company. Framing quote below. Salaries explicitly excluded.
  (<https://www.lewesfc.com/finances/>)
- **Travel page is sustainability-framed, not car-framed.** Train first ("three to five minute walk from
  the ground"), then bus, then a blunt admission that "there is no dedicated parking at The Dripping
  Pan", then cycling, then walking. (<https://lewesfc.com/matchday-information/>)
- **Disability access page names the limits.** It says wheelchair access to the clubhouse "isn't
  currently available" and that the club is exploring a fix. It also asks non-disabled fans to respect
  the reserved bays, "noting some disabilities are invisible".
  (<https://lewesfc.com/disability-access/>)
- **Ownership is a nav item with a live scale claim** — "over 1,500 Owners from over 30 countries" — and
  a price ladder from £5/month to £1,000 lifetime, plus a £20 junior tier.
  (<https://www.lewesfc.com/become-an-owner/>)
- **Club Officials page = photo + name + role for board and staff**, with an e-mail only for the club
  secretary. (<https://www.lewesfc.com/club-officials/>)

### 2.2 Clapton Community FC — England, Essex Senior League (tier 9)

<https://www.claptoncfc.co.uk/> · read: homepage, Transparency, Accountability, Membership, Volunteer,
Directions, About, Committees, Hall of Fame, Club index (10 pages).

The most *structurally* interesting site in the tier, and the one furthest from KCVV in register.

- **The "Club" menu is entirely governance:** Membership, Committees, Volunteer, Transparency,
  Accountability, Safeguarding, EDI policy, Community groups to support, Donate, Honours and records,
  Hall of fame, In memoriam, About us, Contact. Not one of those fourteen is a marketing page.
  (<https://www.claptoncfc.co.uk/club/>)
- **Transparency page publishes monthly income & expenditure back to 2018**, annual accounts to 2024/25,
  AGM minutes and submitted motions 2019–2025, and documentation of major purchases (warehouse, ground).
  Notably it does *not* publish membership numbers. (<https://www.claptoncfc.co.uk/transparency/>)
- **Hall of Fame is a plain statistics table with a medal ladder** — bronze at 50 competitive
  appearances, silver at 100, gold at 150; ~60 players; photo + hyperlinked name + appearance count;
  counted across women's and men's first, reserve and development teams; friendlies excluded; a visible
  "last updated November 1 2025". This is a pure-data feature that needs no photographer and no writer.
  (<https://www.claptoncfc.co.uk/clapton-cfc-player-appearances-the-hall-of-fame/>)
- **Committees page gives each committee a remit sentence, a joining invitation and its own e-mail.**
  The Youth Training committee commits to "putting each volunteer through their level 1 coaching badge"
  — a concrete offer, not a request. (<https://www.claptoncfc.co.uk/committees/>)
- **Volunteer page lists five named jobs with a difficulty floor**: merch packing ("light work, requires
  no special skills"), matchday safety reps, merch stall, video editing from Veo footage ("you don't
  need to be an editing genius"), youth coaching. Each has its own inbox.
  (<https://www.claptoncfc.co.uk/volunteer/>)
- **Directions page counts minutes, not distances**: seven stations "within walking distance", each with
  a walk time (Forest Gate 14 min … Stratford 28 min); bus stops at 4 and 7 minutes; exact bike-stand
  counts (12 inside, 3 outside, parking for 30); an honest "there is no parking on site"; and a
  what3words address per entrance.
  (<https://www.claptoncfc.co.uk/directions-to-the-old-spotted-dog-ground/>)
- **Admission is on the homepage, not buried**: "Standard: £5 · Concessions: Pay what you can · Under
  13s: Free". (<https://www.claptoncfc.co.uk/>)
- **The footer contact form routes by committee** via a dropdown (operations, teams, development,
  welfare…) instead of a single info@ address.

### 2.3 FC United of Manchester — England, Northern Premier League (tier 7/8)

<https://www.fc-utd.co.uk/> · read: homepage, Manifesto, Membership, Every Voice Matters, Resolutions.

- **Published resolutions archive spanning 2006–2026** with exact vote tallies and percentages per
  motion and per board candidate — e.g. stadium naming rights passed 546–183 (74.9%), training-kit
  sponsor logo passed 725–29 (96.2%), adult membership at £60 passed 73.3%. This is the most complete
  member-democracy artefact found anywhere in this research. (<https://fc-utd.co.uk/resolutions>)
- **Manifesto is seven numbered principles under the heading "Manifesto: Who We Are and What We Mean".**
  Quoted in full in §3. (<https://www.fc-utd.co.uk/our-club/governance/manifesto/>)
- **"Every Voice Matters" is a suggestion box with a stated boundary** — an online form *and* a physical
  box at the membership stall, explicitly "not intended for complaints", which route to a separate
  procedure. The boundary is what makes it usable.
  (<https://fc-utd.co.uk/our-club/membership/every-voice-matters/>)
- **Membership page sells information access, not merchandise**: members get "board reports and minutes
  to key documents and honest blogs – you're trusted with the same information we share at the top
  table." (<https://fc-utd.co.uk/our-club/membership/>)
- **Campaigns are a nav branch**: Unite for Access, Period Poverty, Women's Safety Charter, White Ribbon.
  (The individual campaign pages 404'd on fetch; only the nav labels are confirmed.)

### 2.4 Bohemian FC — Republic of Ireland, League of Ireland Premier Division (tier 1, fan-owned)

<https://bohemians.ie/> · read: splash/homepage, `/home/`, Bohs in the Community. The root URL serves a
cookie-consent splash with an "Enter Site" link — the real homepage is at `/home/`.

- **"Bohs In The Community" is a top-level nav branch with four sub-categories** — Health & Wellbeing,
  Rehabilitation, Education & Empowerment, Anti-Discrimination & Inclusion, plus Climate Justice &
  Sustainability. Fifteen named programmes hang off it.
  (<https://bohemians.ie/bohs-in-the-community/>)
- **Community work is reported with numbers, not adjectives**: "6,865 people across 15 programmes with
  751 hours" in 2025, and the club launched what it calls the first League of Ireland social impact
  report. Quantifying community output is the transferable move, independent of the politics.
- **Named programmes are specific and legible**: Walking Football for 55+, Down Syndrome Futsal (16+,
  founded 2024), VI Football for visually impaired juniors, Girls Street Leagues, a free
  July–August summer programme.
- **The club has a house historian producing curated history articles** as an ongoing content stream —
  a format that needs an archive and a writer, not a camera.
- The dedicated climate-justice page 404'd on fetch; the programme is confirmed only via the community
  index.

### 2.5 Roter Stern Leipzig '99 e.V. — Germany, Sachsen regional leagues (~tier 7) + multi-sport

<https://www.rotersternleipzig.de/> · read: homepage, Verein index, RSL-Selbstverständnis & RSL-Thesen.

- **"Vorfall melden" (report an incident) is a standing item in the club menu** — not buried in a policy
  PDF. Alongside it: AG support you (conflict resolution), Taskforce Antisexismus, AG Kinderschutzkonzept
  (child protection working group). (<https://www.rotersternleipzig.de/verein/>)
- **The RSL-Thesen are six numbered theses with headings and explanations**: Zielsetzung,
  Entscheidungsfindung, Schwerpunkt Jugendarbeit, Selbstorganisation der Jugendlichen, Ehrenamt &
  Hauptamt, Finanzen. The structure — *principles with a paragraph each, including one on money and one
  on volunteers vs paid staff* — is reusable at any register.
  (<https://rotersternleipzig.de/rsl-selbstverstaendnis-rsl-thesen/>)
- **Thesis 3 is a membership guarantee**, not a mission statement: every child and young person who
  wants to play at RSL can. A club that writes down its intake promise is doing something few do.
- **"more than soccer" is a nav item covering 15 other sports** — darts, roller derby, croquet, boule.
  Not applicable to KCVV, but it shows a club treating its non-football life as first-class IA.
- **The homepage carries a live fundraising campaign** ("Moos für Klos" — money for toilets) as a
  content block, with a concrete, unglamorous target.

### 2.6 SV Babelsberg 03 — Germany, Regionalliga Nordost (tier 4)

<https://www.babelsberg03.de/> · read: homepage, Der Verein. (The `svbabelsberg03.de` domain does not
resolve; `babelsberg03.de` is correct.)

- **"Engagement" is a sub-branch of Verein & Stadion**, containing anti-racism initiatives and a "Grünes
  Stadion" programme. Values sit inside the club section, not in news.
- **"Vereinsleben" is a separate top-level branch** — fan projects, membership, children's programmes,
  child protection (Kinderschutz). Splitting "the club as an institution" from "the club as a life" is a
  useful IA distinction we do not currently make.
- **Geschichte & Chronik covers both club history and the stadium's evolution** as separate strands.
- The club ships a mobile app alongside the site — relevant only as evidence of what tier 4 German clubs
  now consider baseline.

### 2.7 Altona 93 — Germany, Oberliga Hamburg (tier 5)

<https://www.altona93.de/> · read: homepage, Mitgliedschaft.

- **"Stadionzeitung" (matchday programme) is a top-level nav item under AFC Live**, sitting beside News,
  Live-Stream and Presse. The programme is treated as a publication channel, not a paper artefact.
- **Membership page states the mechanics plainly**: how to join (signed form to the office or by e-mail),
  when membership starts, how dues are collected, notice period for leaving, and a lifetime membership
  priced at **€1,893** — the club's founding year as the price. That is the kind of small, cheap,
  memorable detail this research was looking for.
  (<https://www.altona93.de/verein/mitgliedschaft/>)
- **Youth intake is handled through a separate portal "due to high demand"** — the site says so out
  loud rather than leaving parents to guess.
- **Six non-football departments** (karate, handball, roller derby, volleyball, walking football,
  running) plus referees, each with its own section.

### 2.8 Tennis Borussia Berlin — Germany, Berlin Oberliga/Regionalliga (tier 4/5)

<https://www.tebe.de/> · **partially blocked** — the homepage returned HTTP 429 and the Leitbild page
returned only navigation. Confirmed from the club section index:

- Nav includes Das ist TeBe, Leitbild, Vereinsorgane, Mitglied werden, Natürlich Fussball, Mommsenstadion.
- Club tagline rendered with the crest: **"Come As You Are"**.
- No further verbatim content could be retrieved; nothing else about this club is asserted here.

### 2.9 Östersunds FK — Sweden, Superettan (tier 2)

<https://www.ostersundsfk.se/> · read: homepage, CSR.

- **"Kulturakademi" is a standing club programme and a news category.** The club runs performances,
  author meetings, dance and writing projects *as part of player development*, and files them on the
  site under a "Kultur" news category alongside Nyheter, Akademi, Föreningen and Superettan. A club
  publishing a non-football editorial strand under its own category label is a genuinely novel content
  format. (<https://www.ostersundsfk.se/csr/>)
- **CSR is a top-level nav item** with three named programmes: HBTQ certification (2017, via RFSL),
  Kulturakademi, and Team 12-17 — free match access for 12–17-year-olds who sign a sobriety pledge, run
  with the regional authority and the local energy company. The last one is a partnership shape a
  village club could copy without any politics attached.
- **Season-ticket scarcity is shown as live state on the homepage** — "endast 500 säsongskort kvar",
  2,031 claimed. Numbers-as-content, updated, no photography needed.
- **"Om ÖFK" contains a Dokument section and a Valberedning (election committee) page** — governance
  surfaced in the about menu.

### 2.10 KÍ Klaksvík — Faroe Islands, Betri deildin (tier 1, town of ~5,000)

<https://ki.fo/> · read: homepage.

- **The site is Faroese-first with an EN toggle**, not English-first. A small-language club that refuses
  to demote its own language is a direct precedent for a Dutch-first KCVV.
- **"KÍ Varpið" — the club's own streaming/video channel — is the second nav item**, ahead of the squad.
- **Nav is short and concrete**: Tíðindi (news), Varpið, Lið (squad), Videos, Dystir (fixtures), Akademi,
  Søgan (history), Felagið (club), Fjepparar (supporters), Nethandil (shop). Eleven items, no dropdown
  sprawl.
- Homepage puts the next fixture, latest results and the full league table above the fold — the same
  matchday-legibility priority `PRODUCT.md` principle 1 states.

### 2.11 UMF Stjarnan — Iceland, multi-sport club (football in Besta deild)

<https://www.stjarnan.is/> · read: homepage.

- **Nine sport departments (football, basketball, handball, gymnastics, swimming, weightlifting, general
  fitness…) each mirror the same internal structure** — news, youth, elite men, elite women, coaches,
  governance. Consistency across departments is the mechanism that keeps a nine-sport club navigable.
  The transferable version for KCVV: make every youth team page structurally identical to the first-team
  page, which `PRODUCT.md` principle 2 already demands.
- **"Æfingatöflur" (training schedules) is its own top-level nav item**, with registration and
  sport-specific timetables. For a parent, the training timetable is a *destination*, not a detail
  inside a team page. We do not have one.
- **Office hours and a phone number are surfaced globally** ("13:00-16:00"), not hidden on a contact
  page — a small less-digital-visitor affordance.

### 2.12 AFC (Amsterdamsche Football Club) — Netherlands, Tweede Divisie (top amateur tier)

<https://www.afc.nl/> · read: homepage.

- **A Dutch amateur club that escaped the VoetbalAssist/Sportlink template** — custom WordPress with its
  own layout, its own photo galleries (Flickr-backed), and its own component vocabulary. Confirms the
  premise that the template is a choice, not a constraint.
- **"Verjaardagen" (birthdays) is a homepage block.** Trivial to build, unmistakably a club rather than a
  product, and needs no photographer. This is the strongest *small* idea in the Dutch tier.
- **Sponsors are branded as "AFC Vriendelijke Bedrijven"** (AFC-friendly businesses) rather than
  "sponsors" — a naming move that reframes a commercial list as a community list.
- **Clubinfo contains a "geschiedenis/archief" branch and a "veiligheidszaken" (safety matters) page.**
- **Senioren and Jeugd are separate top-level branches**, each with its own contact, team assignment,
  training and match schedule pages. KCVV splits `/ploegen` and `/jeugd` the same way; the difference is
  AFC also puts *organisation* and *training times* in each branch.

### 2.13 Wingate & Finchley FC — England, Isthmian League (tier 7/8)

<https://www.wingatefinchley.com/> · read: homepage, Visiting Fans Guide.

- **"Visiting Fans Guide" is a top-level nav item** — nine items in the whole nav, and this is one of
  them. (<https://www.wingatefinchley.com/visiting-fans-guide/>)
- It answers, in order: how long from Central London ("under 30 minutes"), car + a *social* parking
  request ("Please park considerately and do not use Finchley Rugby Club's car park"), tube with walk
  times, the exact bus ("take a northbound bus (including the 263 towards Barnet) and get off at Leisure
  Way"), full price ladder including "under-10s enter free" and free entry for NHS staff and carers,
  what's actually behind the bar and in the food hatch, when they open ("at least 90 minutes prior to
  kickoff"), the dog policy ("The club welcomes all well-behaved dogs on matchdays if kept on a lead"),
  the flare ban, and where the baby-changing facilities are.
- **What it deliberately omits** is as instructive: no ground-layout diagram, no pub recommendations. It
  is one page, written once, that never needs a photographer.
- **Community Membership is framed as "more than a season ticket — it's our way of giving back"**,
  bundling local-business benefits — a members-club shape rather than a ticket product.

### 2.14 Bath City FC — England, National League South (tier 6)

<https://www.bathcityfc.com/> · read: homepage.

- **The ownership percentage is stated on the homepage**: "Major shareholder: Bath City Supporters
  Society Ltd 54.6%". A hard number in chrome, not a claim in an about page.
- **"Board Meetings" is a nav item under Club**, alongside stadium redevelopment and safeguarding.
- **"Supporters" is a top-level nav branch** containing Supporter Liaison, supporters clubs and a
  **code of conduct** — the code sits with supporters, not with legal.
- Ticketing nav includes an explicit **accessibility** entry.

### 2.15 Exeter City FC — England, EFL League One (trust-majority-owned)

<https://www.exetercityfc.co.uk/> · read: homepage.

- **Trust ownership is surfaced in chrome, repeatedly**: a "Join the Club" CTA in the main nav pointing
  at the trust's separate site, plus a footer "Supporters' Trust" link and an ownership statement in the
  footer policies. Ownership is not a page you have to look for.
- **"The Club" branch is mostly fan infrastructure**: 50/50 matchday draw, Supporter Liaison Officer,
  Disabled Supporters Association, community fund, Grecian Groups, Senior Reds, Soccer Sight, Supporters'
  Club, plus a **Fan Engagement Plan** and a **Staff Directory and Board**.
- A published **Fan Engagement Plan** as a linked document is a format no Belgian amateur club has.

### 2.16 The Dons Trust / AFC Wimbledon — England, EFL (fan-owned)

<https://www.thedonstrust.org/> · read: trust homepage. (The club-side `/club/dons-trust/` page returned
truncated content and is not quoted.)

- **The ownership stake is expressed as a headline number — "50.01 Majority Fan Control"** — and as a
  personal promise: members get "Equal ownership of AFC Wimbledon through The Dons Trust, with the same
  stake as every other member."
- **Published governance artefacts**: AGM and SGM papers, board meeting minutes, and *monthly summaries*
  of board discussions for members. The monthly summary — shorter than minutes, more frequent — is the
  practical format.
- **An independent review of the 2025 board elections was commissioned and publicly thanked.** Auditing
  your own democracy in public is unusual even in this tier.
- Membership was unified with club membership from 2026/27 at £60 adult / £45 over-65 / £25 under-18.

### 2.17 Criacao Shinjuku — Japan, Japan Football League (tier 4, semi-professional)

<https://criacao.co.jp/> · read: root, philosophy. (The `www.` host does not resolve; use the apex.)

- **The philosophy page is a structured document, not a slogan**: a core mission sentence, a stated
  belief, then four named dimensions (physical/mental development, character building, human connection,
  social impact), then a tagline ("Enrich the World").
  (<https://criacao.co.jp/philosophy/>)
- **The mission sentence is deliberately unglamorous** — see §3. A tier-4 club writing "earnestly
  building upon the ordinary before us" and *then* claiming world-class ambition is a tonal model worth
  studying, because it is exactly KCVV's position: outsized ambition, ordinary means.
- The site advertises a **universal-accessibility matchday programme** and community events tied to the
  Shinjuku neighbourhood; the individual programme pages were not read, so nothing further is asserted.

### 2.18 Dulwich Hamlet FC — England, Isthmian League Premier Division (tier 7)

<https://dulwichhamletfc.co.uk/> · read: homepage only. **Every interior page attempted (`/faq/`,
`/community-work/`, `/programme-archives/`, `/club-documents/`) returned HTTP 404** on this host, so only
the navigation structure is reported.

- Confirmed nav branches worth noting: **Match Centre Live**, **FAQ**, **Ground Regulations**, **Fan
  Discounts**, **Programme Archives**, **Site Search** — all under a single "Matchday" group; plus
  **Club Documents**, **Safeguarding**, **Vacancies** and **Programme Editor Resources** under "Club";
  plus a Community group containing Community Work, Albrighton Food Bank, Her Game Too, London Pride and
  **Get Involved**.
- "**Programme Editor Resources**" as a public page is genuinely novel — the club publishes the assets a
  volunteer needs to *produce* the matchday programme, treating volunteer enablement as web content.
- The News branch is split by **team and by type** (Men's, Women's, Club, Video, Management Notes, Match
  Centre, Features, Community News) — "Management Notes" as a recurring authored column is a
  no-photographer content format.
- A **2025 Hall of Fame Entries** page sits inside the News branch.

### 2.19 Clubs attempted and not usable

Reported for honesty; nothing about these is claimed in this document.

| Club | Country / level | Outcome |
| --- | --- | --- |
| Detroit City FC | USA, USL Championship | Fetches returned empty bodies on `/`, `/news`, `/pages/about`. Also no longer an amateur benchmark. |
| Chattanooga FC | USA, MLS Next Pro | Now a professional club; deprioritised, not read. |
| Hashtag United | England, Isthmian | `ECONNRESET` on fetch. |
| Whitehawk FC | England, Isthmian | Server returned title only, no content. |
| Enfield Town FC | England, Isthmian | `enfieldtown.co.uk` is a parked domain for sale — the club's site is elsewhere and was not located. |
| HB Tórshavn | Faroe Islands, Betri deildin | `hbtorshavn.fo` does not resolve. |
| Koninklijke HFC | Netherlands, amateur | TLS certificate expired; fetch refused. |
| vv Katwijk | Netherlands, Tweede Divisie | HTTP 403. |
| SV Babelsberg 03 | — | Only the wrong domain failed; the club **was** read at `babelsberg03.de`. |

---

## 3. The statements file

Verbatim, with a judgement on each. KCVV is a Flemish village club, not a political club. The test
applied throughout: *would a KCVV volunteer say this out loud in the kantine without irony?*

### 3.1 Identity and ambition

> "Earnestly building upon the ordinary before us, we aim to be a group that creates new value and
> become the world's greatest Football Club."
> — Criacao Shinjuku, <https://criacao.co.jp/philosophy/> (English rendering of 目の前にある当たり前のことを真摯に積み上げ…)

**Transfers with rewording.** This is the only statement found in the tier that pairs outsized ambition
with ordinary means, which is exactly KCVV's stated position ("best amateur club site in the world" from
third amateur division). The transferable shape: *ambition stated in the same breath as the smallness*,
never ambition alone.

> "Direkt, rau, herzlich. Ohne Tamtam. Ohne wenn und aber."
> — SV Babelsberg 03, <https://www.babelsberg03.de/verein-stadion/sv-babelsberg-03-e-v/der-verein>

**Transfers with rewording.** Three adjectives and a refusal of fuss. This is tonally the closest thing
in the German tier to "Er is maar één plezante compagnie" — a self-description that is a *manner*, not a
mission. A Dutch equivalent in club voice would sit naturally alongside the motto.

> "Wir sind alle einer von uns!"
> — Altona 93, <https://www.altona93.de/verein/mitgliedschaft/>

**Transfers with rewording.** Deliberately ungrammatical, warm, untranslatable — and it lives on the
*membership* page, where it does work. Do not translate it; note the pattern of putting the club's
warmest line where someone is deciding whether to join.

> "Come As You Are"
> — Tennis Borussia Berlin, <https://www.tebe.de/>

**Does not transfer.** English-language borrowed slogan on a Dutch site; and KCVV already has one
tagline, which `PRODUCT.md` fixes as the only one.

### 3.2 Democracy, ownership and member voice

> "The Board will be democratically elected by its members."
> "Decisions taken by the membership will be decided on a one member, one vote basis."
> "The club will develop strong links with the local community and strive to be accessible to all,
> discriminating against none."
> "The club will endeavour to make admission prices as affordable as possible, to as wide a constituency
> as possible."
> "The club will encourage young, local participation - playing and supporting - whenever possible."
> "The Board will strive wherever possible to avoid outright commercialism."
> "The club will remain a non-profit organisation."
> — FC United of Manchester, seven manifesto principles,
> <https://www.fc-utd.co.uk/our-club/governance/manifesto/>

**Transfers with rewording — principles 3, 4, 5 only.** Principles 1, 2, 6 and 7 describe a
fan-ownership structure KCVV does not have and should not claim. Principles 3–5 (local links,
affordability, encouraging young local participation) are true of KCVV already and currently unwritten
anywhere on the site. The *format* — numbered, one sentence each, plainly worded — transfers entirely.

> "You'll vote on big decisions, elect the Board, help shape our identity – even choose the kit. One
> member, one vote."
> — FC United, <https://fc-utd.co.uk/our-club/membership/>

**Does not transfer as written**, because KCVV is a vzw with a members' structure, not a
one-member-one-vote co-op, and overstating this would be a lie. What *does* transfer is the adjacent
line:

> "…board reports and minutes to key documents and honest blogs – you're trusted with the same
> information we share at the top table."
> — FC United, <https://fc-utd.co.uk/our-club/membership/>

**Transfers with rewording.** "Trusted with the same information" is a promise a village club can keep
cheaply — publish the algemene vergadering summary, not the audited accounts.

> "Every Lewes FC Owner has a vote. Every owner has a voice. Every owner helps shape the future of
> Lewes FC." / "Community ownership isn't symbolic. It's real, practical, and powerful."
> — Lewes FC, <https://www.lewesfc.com/become-an-owner/>

**Does not transfer.** KCVV does not sell ownership and should not imply it does. Flag: the underlying
*sentiment* is already covered by our existing `/club/word-lid` — the gap there is concreteness, not
rhetoric.

> "Clapton Community Football Club is not just owned by the fans, it is 100% run by the fans."
> — Clapton CFC, <https://www.claptoncfc.co.uk/committees/>

**Does not transfer.** Untrue of KCVV. But note the *sentence shape*: "not just X, it is Y" is how these
clubs escape vagueness. And note `PRODUCT.md`'s standing rule that "meer dan een club" is banned — this
is a reminder that the same trap exists in English.

### 3.3 Values, stances and politics

> "Der Rote Stern Leipzig '99 ist ein antifaschistisches Sportprojekt. Der Verein organisiert sich
> selbstbestimmt, hierarchiefrei und basisdemokratisch."
> — Roter Stern Leipzig, <https://www.rotersternleipzig.de/>

**Does not transfer, because** KCVV is not a political project and adopting this register would be
imported posturing — the exact failure mode this research was asked to guard against. RSL's statement is
credible because the club was *founded* for that purpose in that city. KCVV was not.

> "Always anti-fascist, anti-sexist, anti-racist, anti-homophobe, anti-transphobe."
> — Clapton CFC, <https://www.claptoncfc.co.uk/about/>

**Does not transfer.** Same reasoning. A five-item list of things a village club is *against* reads, in
Elewijt, as a costume borrowed from East London.

> "Der SV Babelsberg 03 tritt grundsätzlich gegen jede Art von Rassismus, Diskriminierung und Gewalt
> ein."
> — SV Babelsberg 03, <https://www.babelsberg03.de/verein-stadion/sv-babelsberg-03-e-v/der-verein>

**Transfers with rewording — this is the line that does.** One sentence, three universals (racism,
discrimination, violence), no political vocabulary, no enemy named. Every KCVV volunteer would sign it.
Compare the three statements above: the difference between "unsayable" and "obvious" is entirely the
register, not the content.

> "Dalymount Park is a place of inclusion. Racist, xenophobic, sectarian, misogynistic, homophobic,
> transphobic or any other discriminatory abuse…is strictly forbidden."
> — Bohemian FC, <https://bohemians.ie/home/>

**Transfers with rewording, if attached to the ground rather than the club.** Note the construction: the
subject is the *stadium*, not the club's identity. "Op de Driesstraat is iedereen welkom" is a house rule,
not a political position — and a house rule is exactly what a supporterscharter needs.

> "Lewes Football Club is committed to the safety and comfort of all visitors" … supporters are
> encouraged to be "passionate and loud".
> — Lewes FC fan behaviour policy, <https://lewesfc.com/fan-behaviour-policy/>

**Transfers.** The inversion — permission before prohibition — is the single most copyable tonal move in
this document, and it costs nothing.

> "In 2004 a young person watching football saw little advertising for gambling. Today, a young person
> watching football sees advertising for gambling all the time." … "Do we really want children and
> vulnerable adults to constantly be exposed to messages that normalise betting?" … "We don't."
> — Lewes FC, <https://www.lewesfc.com/anti-gamblification-of-football-campaign/>

**Does not transfer as a campaign**, but flag it as a **sponsorship-policy question for Kevin** (§6).
KCVV runs three sponsor tiers; whether the club has any category it would refuse is a values decision,
not a web decision.

> "Equal playing budgets. Equal everything. It's not impossible." … "We are committed to treating our
> men's and women's teams with equal ambition, equal respect and an equal belief in what they can
> achieve."
> — Lewes FC, <https://www.lewesfc.com/equality-fc/>

**Does not transfer** — KCVV has no women's first team, so the claim has no referent and would be empty.
**But the second sentence transfers if repointed at youth**: `PRODUCT.md` principle 2 already states that
youth is first-class, and the site currently *demonstrates* that without ever *saying* it. "Equal
ambition, equal respect" repointed from women's football to U6–U21 is a true, unclaimed KCVV statement.

> "Genom att vara inkluderande ökar vi kunskapen och förståelsen för människors lika rättigheter."
> — Östersunds FK, <https://www.ostersundsfk.se/csr/>

**Does not transfer.** Certification-language; reads as institutional Swedish, not village Flemish.

### 3.4 Transparency

> "…determined to be as transparent as possible, though allowing for the fact that information relating
> to individuals' salaries etc should always remain confidential."
> — Lewes FC, <https://www.lewesfc.com/finances/>

**Transfers with rewording.** The valuable half is the *limit*: naming what you will not publish is what
makes the rest believable. A KCVV money page that says "we publish X, we don't publish Y, here's why"
would be more credible than one that publishes more.

> "…any documentation, if it exists, is kept 'in the bottom of a locked filing cabinet stuck in a
> disused lavatory with a sign on the door saying Beware of the Leopard'."
> — Lewes FC, <https://www.lewesfc.com/finances/>

**Transfers.** A Hitchhiker's joke on a *finance* page. Proof that transparency does not require a
solemn register — and a direct precedent for KCVV's "plezante compagnie" voice being used on the driest
page on the site.

> "We accept that each of us is individually responsible for our own actions and we are collectively
> responsible for supporting those around us."
> — Clapton CFC Accountability Agreement, <https://www.claptoncfc.co.uk/accountability/>

**Transfers with rewording.** Stripped of its committee apparatus, this is a one-line code of conduct
that works for a youth club: everyone answers for themselves, everyone looks out for the rest.

> "That the Club may enter into a sponsorship arrangement for the naming rights to Broadhurst Park." —
> passed 546–183 (74.9%).
> — FC United resolutions archive, <https://fc-utd.co.uk/resolutions>

**Does not transfer** at this level of formality. Flag as the *ceiling* of what transparency can look
like, so we know where the bar is.

### 3.5 Community and access

> "Standard: £5 · Concessions: Pay what you can · Under 13s: Free"
> — Clapton CFC, <https://www.claptoncfc.co.uk/>

**Transfers with rewording.** Not the "pay what you can" model — that is a different club's politics —
but **the placement**: the price of getting in is on the homepage. KCVV does not state its entry price
anywhere on the site.

> "Please park considerately and do not use Finchley Rugby Club's car park."
> — Wingate & Finchley, <https://www.wingatefinchley.com/visiting-fans-guide/>

**Transfers verbatim in spirit.** A village club with neighbours has exactly this sentence to write, and
writing it on the site is more effective than a sign on a gate.

> "The club welcomes all well-behaved dogs on matchdays if kept on a lead."
> — Wingate & Finchley, <https://www.wingatefinchley.com/visiting-fans-guide/>

**Transfers.** Trivial, warm, genuinely useful, and the kind of detail that makes a practical page feel
like a club rather than a notice board.

> "if possible come by public transport, bike or walk"
> — Clapton CFC, <https://www.claptoncfc.co.uk/directions-to-the-old-spotted-dog-ground/>
>
> "We encourage our fans and visitors to travel to the ground by sustainable transport wherever possible
> to reduce congestion and emissions."
> — Lewes FC, <https://lewesfc.com/matchday-information/>

**Transfers with rewording — the Clapton version, not the Lewes version.** The Clapton line is advice;
the Lewes line is a policy statement. In Elewijt, where most visitors will arrive by car and the club
depends on street parking goodwill, advice works and policy does not.

> "light work, requires no special skills, and full training will be provided" … "you don't need to be
> an editing genius, just keen with basic skills" … "there's no commitment – just join when you can"
> — Clapton CFC volunteer roles, <https://www.claptoncfc.co.uk/volunteer/>

**Transfers.** This is the whole trick of volunteer recruitment copy: state the *lowest* qualifying bar
in the job description itself. Nothing on kcvvelewijt.be currently does this.

> "Reps are there to answer questions – but not tell anyone what to do"
> — Clapton CFC, <https://www.claptoncfc.co.uk/volunteer/>

**Transfers.** Defining a volunteer role by what it does *not* require is how you get people to say yes.

> "We are committed to putting each volunteer through their level 1 coaching badge."
> — Clapton CFC, <https://www.claptoncfc.co.uk/committees/>

**Transfers.** KCVV almost certainly already pays for coaching diplomas. Saying so on the volunteer page
converts an existing cost into a recruitment asset at zero marginal effort.

> "There is a toilet for people with disabilities at the top of the stand to the right after you come in
> through the main turnstile." … wheelchair access to the clubhouse "isn't currently available".
> — Lewes FC, <https://lewesfc.com/disability-access/>

**Transfers.** Note that the page is *more* trustworthy for admitting a gap. A KCVV accessibility page
that says "the path from the parking to the terrace is X, and here is what we cannot yet do" beats
silence and beats a claim.

---

## 4. World record: what the best amateur club site currently does

An honest description of the bar, assembled from what was actually observed. **No single club does all
of this.** The record is a composite, and that is the useful finding: the world record is beatable by one
club doing all of it at once.

**The bar today:**

1. **Practical information is a top-level navigation branch, not a footer link.** Lewes and Dulwich both
   put "Matchday" in the primary nav with five to seven children: prices, travel, programme, conduct,
   accessibility, ground regulations, FAQ. Wingate & Finchley compresses the whole thing into one
   nine-item nav slot called "Visiting Fans Guide". A visitor never hunts.
2. **The club's governance is public and findable.** Somewhere between Bath City's homepage ownership
   percentage, Lewes's 14 years of accounts, Clapton's monthly income-and-expenditure back to 2018, and
   FC United's twenty-year archive of motions with exact vote counts. The floor is *board with faces and
   roles*; the ceiling is *every decision, every tally, since founding*.
3. **The club says one thing out loud that a template site would never say**, and says it in its own
   register: Babelsberg's three adjectives, Lewes's leopard joke on the finance page, Criacao's
   "ordinary before us". The statement is short, specific and structurally placed (a manifesto page, a
   membership page, a policy page) rather than sprayed across the homepage.
4. **Volunteering is a page with named jobs, named contacts and a stated minimum skill level.** Clapton
   is the reference implementation; nobody else in this tier matches it.
5. **At least one content format that needs no photographer runs continuously.** Dulwich's Management
   Notes column and programme archive; Östersunds' Kultur news category; Bohemians' club historian;
   Clapton's appearance-milestone table; AFC's birthday block; KÍ's own video channel.
6. **Access and inclusion are stated concretely and with their limits admitted.** Lewes's disability page
   is the model precisely because it names what is missing.
7. **Numbers are used as content.** 1,500 owners in 30 countries (Lewes); 54.6% shareholding (Bath City);
   6,865 people across 15 programmes, 751 hours (Bohemians); 2,031 season tickets, 500 left (Östersunds);
   546–183, 74.9% (FC United); 222 appearances (Clapton); 12 bike stands, parking for 30 (Clapton).
   Nobody in this tier writes "many" or "a lot".
8. **The site is in the club's own language first**, with translation as an option rather than a
   substitute (KÍ, Roter Stern, Babelsberg, Criacao).

**Where the record is weak, and where KCVV can beat it outright:**

- **Nobody in this tier has real, synced competitive data for their whole club.** Squads, results,
  lineups, goal events, cards, standings and per-player season statistics down to U6 — which `PRODUCT.md`
  already names as our positioning — do not exist on any of the eighteen sites read. Clapton's Hall of
  Fame is hand-maintained and stamped "last updated November 1 2025". Stjarnan's nine departments each
  publish separately. **This is the single largest unexploited advantage we have.**
- **Youth is a second-class citizen almost everywhere.** Altona routes youth intake to an external portal;
  Dulwich's youth fixtures are a nav afterthought; most German and English clubs treat the youth section
  as an org chart rather than a set of team pages. Stjarnan's training-timetable page is the only
  parent-first affordance found in the whole tier.
- **Opponent-facing content is absent everywhere.** We ship `/tegenstander/[clubId]`. Not one of the
  eighteen clubs has anything comparable, and several of them are the clubs most famous for hospitality.
- **Craft is inconsistent.** Bohemians hides its homepage behind a cookie splash. Dulwich's own nav links
  404. Tennis Borussia rate-limits. Enfield Town has lost its domain. Being reliably fast, linkable and
  unbroken is itself a differentiator at this level.

---

## 5. Recommendations

### Adopt

| # | What | Why it fits KCVV | Effort | Source |
| --- | --- | --- | --- | --- |
| A1 | **`/club/bereikbaarheid`** — one authored page: trein/bus naar Elewijt, met de auto + waar wél en niet parkeren, met de fiets, te voet, minuten per optie, kaartpin. Include the neighbour-friendly parking request verbatim in club voice. | Serves a named `PRODUCT.md` audience (visiting opposition supporters) that currently has no page. Pure text, no photography, no data dependency. | S | <https://www.wingatefinchley.com/visiting-fans-guide/> · <https://www.claptoncfc.co.uk/directions-to-the-old-spotted-dog-ground/> · <https://lewesfc.com/matchday-information/> |
| A2 | **A matchday-practicals section on that same page or beside it** — inkom, cash/kaart, wanneer de kantine opengaat, wat er te eten is, honden, kinderen, toiletten. | Answers the questions a first-time visitor and a youth parent both have. Written once, changes once a season. | S | <https://www.wingatefinchley.com/visiting-fans-guide/> · <https://www.claptoncfc.co.uk/> |
| A3 | **`/club/vrijwilligers`** — five to eight named roles, each with one sentence of remit, the *lowest* qualifying bar stated in the description, and a named person to contact. | Success criterion #1 in `PRODUCT.md` is recruiting volunteers, and we have no surface for it. `/hulp` is a who-is-who, not a call to action. | S | <https://www.claptoncfc.co.uk/volunteer/> · <https://www.claptoncfc.co.uk/committees/> |
| A4 | **Accessibility block on the bereikbaarheid page** — flat route or not, where to drop someone off, nearest toilet, who to ask. State what the ground cannot do. | Older supporters are an explicit `PRODUCT.md` audience. Admitting limits is what makes it credible. | S | <https://lewesfc.com/disability-access/> |
| A5 | **A "veilig sporten" page: club API by name and photo, plus a reporting route that is not a generic info@ address.** | Flemish clubs are already expected to have this; RSL shows it can be a standing menu item rather than a buried PDF. Trust-per-euro is unmatched. | S | <https://www.rotersternleipzig.de/verein/> · <https://www.babelsberg03.de/> |
| A6 | **Numbers-as-content discipline across existing pages** — replace every "veel", "heel wat" and "talrijke" with the actual figure (aantal jeugdploegen, aantal leden, aantal vrijwilligers, aantal ploegen die op zaterdag spelen). | Zero build effort, applies to copy we already have, and it is the one habit shared by every site in this tier. Constraint: `PRODUCT.md` forbids fabricated figures, so only ship numbers the club can verify. | S | <https://www.lewesfc.com/become-an-owner/> · <https://bohemians.ie/bohs-in-the-community/> · <https://www.bathcityfc.com/> |
| A7 | **Bestuur/jeugdbestuur upgrade: photo + role + one line of "what this person actually decides" + a working contact where appropriate.** | We already have the routes; the gap is that a name and a title do not tell a parent who to ask about a training schedule. | S | <https://www.lewesfc.com/club-officials/> · <https://www.claptoncfc.co.uk/committees/> |

### Adapt

| # | What | How to change it for Elewijt | Effort | Source |
| --- | --- | --- | --- | --- |
| B1 | **Appearance / milestone records built on the ProSoccerData sync.** | Clapton hand-maintains a medal ladder at 50/100/150 caps. We can generate the equivalent automatically — and, uniquely, for youth teams too. Two constraints: PSD only covers the synced seasons, so the page must be honest about its window ("sinds seizoen X"); and youth privacy rules from `PRODUCT.md` principle 2 govern what a nine-year-old's milestone page may show. | M | <https://www.claptoncfc.co.uk/clapton-cfc-player-appearances-the-hall-of-fame/> |
| B2 | **A "waar gaat je lidgeld naartoe" page instead of published accounts.** | Do not copy Lewes's 14 years of audited PDFs or Clapton's monthly ledgers — wrong register and a governance decision, not a web one. Do copy the *limit-naming*: "dit publiceren we, dit niet, en waarom." Pair it with the existing praktische-informatie CMS page. | M | <https://www.lewesfc.com/finances/> · <https://www.claptoncfc.co.uk/transparency/> |
| B3 | **A short club-principles page — five or six numbered sentences, KCVV voice.** | Take FC United's *format* and Babelsberg's *register*. Only include principles that are already true: local roots, affordability, youth participation, everyone welcome on the Driesstraat, volunteers are the club. Explicitly exclude anything about ownership, democracy or politics. Must not become a second tagline — `PRODUCT.md` fixes the motto. | M | <https://www.fc-utd.co.uk/our-club/governance/manifesto/> · <https://rotersternleipzig.de/rsl-selbstverstaendnis-rsl-thesen/> · <https://www.babelsberg03.de/verein-stadion/sv-babelsberg-03-e-v/der-verein> |
| B4 | **Supporterscharter / gedragscode with permission before prohibition.** | Open by encouraging supporters to be loud and partisan; *then* state the boundaries; make the subject the ground, not the club's identity ("Op de Driesstraat…"). Avoid the five-item list-of-isms register entirely. | M | <https://lewesfc.com/fan-behaviour-policy/> · <https://bohemians.ie/home/> |
| B5 | **A training-timetable destination for parents.** | Stjarnan makes "Æfingatöflur" a top-level nav item. For KCVV this is a `/jeugd` affordance: one page, all teams, all training times, printable. Currently a parent must open each team page. | M | <https://www.stjarnan.is/> |
| B6 | **A recurring authored column that needs no photographer** — e.g. a monthly note from the trainer or the jeugdcoördinator, published as a news `articleType`. | Dulwich's "Management Notes" and Bohemians' club historian both prove the format sustains itself. Uses editorial machinery we already have in Sanity; the gap is that it is a *named recurring format*, not a one-off article. Authoring friction is a real constraint per `PRODUCT.md` — keep the format short by design. | M | <https://dulwichhamletfc.co.uk/> · <https://bohemians.ie/home/> |
| B7 | **Programme/clubblad archive as a browsable section.** | Lewes runs its programme on a separate subdomain; Dulwich keeps an archive; Altona puts "Stadionzeitung" in the top nav. For KCVV the equivalent is likely the existing `/scheurkalender` source material and any historic clubblad — an archive destination, PDF-backed, no new editorial burden. Verify what physical archive actually exists before scoping. | M | <https://lewesfc.com/20068-2/> · <https://www.altona93.de/> |
| B8 | **"Ambition stated with the smallness" as a homepage or club-page line.** | Criacao's construction, in Dutch, in KCVV voice. This is a copy decision, not a feature — but it is the one register move that would let the site say what it is trying to be without sounding like a corporate about-page. Must not displace the motto. | S | <https://criacao.co.jp/philosophy/> |

### Reject

| # | What | Why |
| --- | --- | --- |
| C1 | **Explicit political self-definition** (antifascist sports project; anti-sexist/anti-racist/anti-homophobe/anti-transphobe lists). | KCVV is not a political club and was not founded as one. Adopting Clapton's or RSL's register would be imported posturing — credible in Leipzig and East London precisely because of who founded those clubs and why. Babelsberg's single sentence against racism, discrimination and violence is the version that transfers; the lists are not. Sources: <https://www.rotersternleipzig.de/> · <https://www.claptoncfc.co.uk/about/> |
| C2 | **Fan-ownership / one-member-one-vote claims and any "Become an Owner" surface.** | Structurally untrue of a Belgian vzw. Publishing it would be a fabricated claim, which `PRODUCT.md` forbids. Source: <https://www.lewesfc.com/become-an-owner/> |
| C3 | **Published audited accounts and full AGM vote tallies.** | Correct ceiling to know about, wrong instrument for a village club. High governance cost, near-zero visitor value at this level, and it is a bestuur decision rather than a web decision. Replaced by B2. Sources: <https://www.lewesfc.com/finances/> · <https://fc-utd.co.uk/resolutions> |
| C4 | **Equal-pay / Equality FC positioning.** | KCVV has no women's first team; the claim has no referent and would be empty. The usable half — "equal ambition, equal respect" — is repointed at youth in §3.3 and already covered by `PRODUCT.md` principle 2. Source: <https://www.lewesfc.com/equality-fc/> |
| C5 | **Newsletter signup**, which Dulwich, Lewes, Bath City and Clapton all run as a core membership benefit. | Explicitly excluded by `PRODUCT.md` and by standing instruction. Noted only so nobody re-proposes it after reading these sites. |
| C6 | **A cookie-consent splash gate in front of the homepage** (Bohemians). | Actively destroys the matchday-legibility requirement in `PRODUCT.md` principle 1. Listed as an anti-pattern found in the field. Source: <https://bohemians.ie/> |
| C7 | **Multi-sport / non-football department IA** (RSL's "more than soccer", Altona's six departments, Stjarnan's nine). | No referent at KCVV. Included in the notes only for the structural lesson — mirror the same page shape across every department — which is already covered by B5 and `PRODUCT.md` principle 2. |
| C8 | **Sobriety-pledge ticketing, HBTQ certification, culture academy** (Östersunds). | Institutional Swedish register with a public-authority partner behind each. The partnership *shape* (club + municipality + local company funds free youth access) is worth Kevin knowing about; the programmes themselves do not transfer. Source: <https://www.ostersundsfk.se/csr/> |

---

## 6. Open questions for Kevin

These are club-values or club-fact decisions, not web decisions. Nothing in §5 that depends on them
should be built until they are answered.

1. **Is there any sponsor category the club would refuse?** Lewes built a whole nav branch on refusing
   gambling money. KCVV runs three sponsor tiers and `PRODUCT.md` calls sponsors a commercial obligation.
   If the answer is "no category is refused", that is fine and the question closes — but it should be
   decided rather than defaulted. (<https://www.lewesfc.com/anti-gamblification-of-football-campaign/>)
2. **How much money talk is the bestuur comfortable with?** B2 assumes "what a season costs and what it
   buys", not accounts. Is even that too much? Is there an existing algemene-vergadering summary that
   could be published as-is?
3. **Does the club want a written principles page at all** (B3), or does it consider "Er is maar één
   plezante compagnie" to be the complete statement? A principles page that nobody in the bestuur
   believes in is worse than none.
4. **Who is the club's Aanspreekpunt Integriteit, and are they willing to be named and photographed on
   the site?** A5 is worthless with a generic address behind it.
5. **What is the actual entry price on a matchday, and are under-12s free?** No page on the site states
   it and this research could not determine it. A2 needs the real numbers.
6. **What physical archive exists** — old clubbladen, programmaboekjes, scheurkalenders — and is anyone
   willing to scan it? B7's scope is entirely determined by this answer.
7. **How far back does the ProSoccerData sync actually go?** B1's honesty depends on being able to write
   "sinds seizoen X" truthfully, and on whether pre-sync appearances exist anywhere (the legacy Drupal
   JSON:API is noted elsewhere in the repo as historical-only and 54% stale).
8. **What are the privacy limits on a youth milestone page?** `PRODUCT.md` principle 2 requires youth
   affordances to hold up "including its privacy constraints", but the constraint itself is a club
   decision — is a U9 player's appearance count publishable at all?
9. **Are there neighbour-parking sensitivities in the Driesstraat** that A1 should address directly?
   Wingate & Finchley's parking sentence works because it names a specific neighbour.
10. **Would the club sustain a monthly authored column** (B6)? Editorial friction is named in
    `PRODUCT.md` as a real product constraint; committing to a recurring format that dies after three
    issues is worse than not starting.

---

## Method note

Eighteen non-Belgian clubs were fetched and read between three and eleven pages deep each; nine further
candidates could not be read and are listed with their failure mode in §2.19. Nothing in this document is
written from memory of a site. Where a page returned only navigation or was truncated, that limitation is
stated at the point of use rather than filled in.
