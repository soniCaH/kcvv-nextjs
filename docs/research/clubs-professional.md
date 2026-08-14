# Primary-source research — Belgian professional football (Pro League + Challenger Pro League)

**Tier owner:** professional-clubs agent. Sibling agents own the other tiers and our own-site inventory — do not edit their files.
**Date of research:** 2026-08-13. Everything below was read live on that date; nothing is written from memory.
**Clubs read:** 18 with usable findings, 4 unreachable (documented in [Sites that could not be read](#sites-that-could-not-be-read)).

**Framing.** Pro clubs have a media department, a ticketing platform and a commercial team. Raw production value is not the lesson. What is transferable is: information architecture that survives 20+ teams, the shape of a match page across its lifecycle, content formats that cost almost nothing but read as premium, how a club writes about itself, and how sponsors are given real value without wrecking a page. Anything that needs a media department is flagged **[MEDIA DEPT]** with a poor-man's version named.

**Gap discipline.** Our current route inventory was read first from `apps/web/src/app/`, `apps/web/PRODUCT.md` and `apps/web/public/llms.txt`. We already ship: `/`, `/nieuws`, `/nieuws/[slug]`, `/ploegen`, `/ploegen/[slug]`, `/ploegen/[slug]/wedstrijden`, `/jeugd`, `/jeugd/[slug]`, `/kalender`, `/wedstrijd/[matchId]`, `/tegenstander/[clubId]`, `/spelers/[slug]`, `/staf/[slug]`, `/galerij`, `/galerij/[slug]`, `/evenementen`, `/evenementen/[slug]`, `/sponsors`, `/zoeken`, `/hulp`, `/privacy`, `/share`, `/scheurkalender` (private), `/club` + `/club/[slug]`, `/club/geschiedenis`, `/club/bestuur`, `/club/jeugdbestuur`, `/club/angels`, `/club/ultras`, `/club/contact`, `/club/word-lid`, plus `api/calendar.ics`, `api/membership`, `api/search`, `api/feedback`. Nothing below is recommended that we already have.

---

## 1. Executive summary — top 8 for KCVV, ranked by impact ÷ effort

| # | Recommendation | Why it wins | Effort |
| - | -------------- | ----------- | ------ |
| 1 | **Weekly training schedule per team** — a table with `Open training` / `Gesloten training` / `Geen training` per day, per team. Nobody in amateur football publishes this; it is the single thing a youth parent needs most and we do not have a route for it. Modelled on [stvv.com/nl/open-trainings](https://stvv.com/nl/open-trainings) and [krcgenk.be/nl/sportief/1ste-ploeg/trainingen](https://www.krcgenk.be/nl/sportief/1ste-ploeg/trainingen). | Directly serves primary audience #2. Data changes twice a season. | **S** |
| 2 | **Volunteer recruitment page** with named roles, a named human, and non-monetary rewards — [stvv.com/nl/wij-stvv/vrijwilligers](https://stvv.com/nl/wij-stvv/vrijwilligers). Our first success criterion is "recruit players and volunteers", and we have `/club/word-lid` (members) and `/hulp` (who-is-who) but **no volunteer surface at all**. | Closes a named product goal with one page. | **S** |
| 3 | **Sponsor cards with a real description, sector and link** instead of a bare logo wall — [stvv.com/nl/business/partners](https://stvv.com/nl/business/partners) gives every partner a name, description and outbound link across four tiers including **"Local heroes"**. | Turns `/sponsors` into a local business directory sponsors will cite when renewing. Product principle 4 verbatim. | **S–M** |
| 4 | **Per-match "wedstrijdsponsor" slot on `/wedstrijd/[matchId]`.** No club in this tier does this on the public match page (STVV sells "Wedstrijdpartner" as a product but never surfaces it: [stvv.com/nl/business/sponsoring](https://stvv.com/nl/business/sponsoring)). We already have match pages and a sponsor roster. | Genuine new sponsor inventory at near-zero page cost. Pure opportunity gap. | **M** |
| 5 | **Head-to-head block on the match page.** KV Kortrijk's match page carries a dedicated `H2H` tab: [kvk.be/wedstrijd/fda-2026-2027/club-brugge-kv-kortrijk-6](https://www.kvk.be/wedstrijd/fda-2026-2027/club-brugge-kv-kortrijk-6/). We already sync every historic result from PSD — this is computation over data we hold, not new data. | Depth on the highest-traffic page type, zero editorial cost. | **M** |
| 6 | **Youth charter for players *and parents*** — [kaagent.be/nl/jeugd/charter](https://www.kaagent.be/nl/jeugd/charter) publishes conduct rules, an escalation path (coach → coördinator → bestuur), a 48-hour cooling-off rule after a match, and a safeguarding contact. | "Show the club is serious" made concrete. Youth parents are a primary audience and this is the page that reassures them. | **M** |
| 7 | **Chaptered history with per-era URLs.** STVV splits `/geschiedenis` into decade chapters each with its own page and an "Ontdek deze periode" link: [stvv.com/nl/geschiedenis](https://stvv.com/nl/geschiedenis). Our `/club/geschiedenis` is one scrolling timeline. | Shareable, linkable, searchable; makes the merger story tellable in parts instead of one wall. | **M** |
| 8 | **A "Wat moet je weten" practical block on away fixtures** — the format KAA Gent runs before every match ([kaagent.be — wat moet je weten](https://www.kaagent.be/nl/nieuws/13-08-2026/kaa-gent-ifk-goteborg-wat-moet-je-weten)), reduced to what an amateur away trip actually needs: address, map link, kickoff, kantine. Nobody in Belgian football does this well below the Pro League. | Serves the third audience PRODUCT.md names explicitly — travelling opposition supporters who "do not scroll". | **M** |

---

## 2. Club-by-club notes

### 2.1 RSC Anderlecht — [rsca.be/nl](https://www.rsca.be/nl)

- Top-level nav is commercially driven and short: **News · Teams · Tickets & Memberships · Business & Hospitality · Mauve TV**. There is no "Club" or "History" item at top level — heritage is buried. For a club of this size that is a deliberate choice to lead with transactions.
- Teams are split as **First team / Futures / Women / Neerpede / Futsal** — "Neerpede" is the academy referred to by its *place name*, not by an age band. A named place carries more identity than "Jeugd". KCVV's equivalent would be naming the youth section after the ground or the street rather than a generic label.
- Homepage fixtures are **tabbed by team category**, not one merged list. With five distinct squads this is the only workable pattern; it is the same problem KCVV has with A/B/U6–U21.
- Business copy is unusually direct: *"De grootste businessclub van België, waar voetbal en kansen samenkomen"*, with a "500+ corporate members" number attached. They quantify. We must not — PRODUCT.md forbids fabricating engagement figures — but the *shape* (claim + number) is what makes it credible.
- Interior pages (`/nl/teams/first-team`, `/nl/club/geschiedenis`, `/nl/nieuws`, `/nl/tickets-abonnementen`) all returned 404 on the paths advertised in nav; the sitemap at `rsca.be/sitemap.xml` contains only the three language roots. **Their interior URL structure is not discoverable from outside.** Findings above are homepage-only.

### 2.2 Club Brugge — [clubbrugge.be](https://www.clubbrugge.be/nl)

**Unreadable.** HTTP 403 on the first attempt, then HTTP 429 behind a "Vercel Security Checkpoint — We're verifying your browser" interstitial on two further attempts with a full browser UA. No findings recorded. Flagged here rather than guessed at.

### 2.3 KV Mechelen — [kvmechelen.be](https://www.kvmechelen.be/)

- Homepage leads with a campaign line, not a fixture: **"Zonder jou? Geen show."** Second person, a question, and it makes the supporter the subject rather than the club. This is the strongest single piece of copywriting found in the tier.
- Teams are grouped **A-kern · Dames · Jong KVM · Academie · G-Team**, with the academy further split into `KVM U18 / U16 / U15 / U14 / U13` ([kvmechelen.be/nl/teams](https://www.kvmechelen.be/nl/teams)). Note the academy stops at U13 publicly — see §3 on youth privacy.
- The homepage band for youth is labelled **"Trots op onze jeugd"** — a role/emotion label, not a category label ("Jeugd"). Same trick on the G-team page: **"Trots op ons G-team"** ([kvmechelen.be/nl/g-team](https://www.kvmechelen.be/nl/g-team/)).
- The G-Team page lists **four separate squads (G-KVM A, B, C, D)** with their own fixture lists — adaptive football treated as real teams with real calendars, not a paragraph on an "inclusion" page.
- Social refrain used as a section device: **#trotsoponzekleuren**.

### 2.4 KRC Genk — [krcgenk.be/nl](https://www.krcgenk.be/nl)

- The homepage opens with **"Kampioen 1999, 2002, 2011, 2019"** as a standing masthead line. Honours as permanent chrome, not a page you navigate to.
- `Sportief` is the sport IA hub, and each team gets an identical five-item sub-nav: **Team · Wedstrijdkalender · Klassement · Trainingen · Vorige seizoenen** ([krcgenk.be/nl/sportief](https://www.krcgenk.be/nl/sportief)). Two of those five we do not have at all.
- **"Trainingen"** ([link](https://www.krcgenk.be/nl/sportief/1ste-ploeg/trainingen)) — the page exists in nav but rendered empty when read; the *slot* is the finding, STVV supplies the working example.
- **"Vorige seizoenen"** ([link](https://www.krcgenk.be/nl/sportief/1ste-ploeg/vorige-seizoenen)) — a per-team season archive. Also rendered empty, but again the slot is the point: pro clubs reserve a permanent home for last season, we currently overwrite it.
- The fixture calendar exposes **Download and Print** actions and a filter-bearing URL shape (`/nl/kalender/wedstrijdkalender/B/all/all/upcoming` — team / competition / season / tense) ([link](https://www.krcgenk.be/nl/sportief/1ste-ploeg/wedstrijdkalender)). Our `api/calendar.ics` is a strictly better answer than "Download"; the four-axis filter shape is worth stealing for `/kalender`.
- Brand video band titled **"Dit is KRC Genk, #mijnploeg"** **[MEDIA DEPT]**.

### 2.5 Standard de Liège — [standard.be/fr](https://www.standard.be/fr)

- Identity line, front and centre: **"Plus de 125 saisons de Passion, de Fierté et de Ferveur ! Un club historique, mythique et unique"**. Three abstract nouns and an em-dash-free rhythm. Note it counts **seasons**, not years since founding — a construction directly usable by a club (like ours) whose founding date is contested.
- **"Stade & Mobilité"** is a *top-level* nav item — how to physically get to the ground ranks alongside News and Teams. (The `/fr/stade-mobilite` path 404s; the item is visible in nav.)
- **"Standard Engagé"** as a named community programme with an attached credential ("Sustainability Label"). A named programme beats a generic "community" page.
- **"Safeguarding"** appears in top-level nav. Extremely rare and a strong signal for a club with minors.

### 2.6 Sporting Charleroi — [sporting-charleroi.be](https://www.sporting-charleroi.be/)

- Seven-item nav, all in French, entirely functional: **Actualités · Équipes · Matchs · Tickets & Cashless · Le Club · Les Supporters · La Fondation**. "Les Supporters" as a first-class nav peer of "Le Club" is the notable move — the fanbase is an *entity* on this site, not an audience.
- The squad ("Noyau A") is rendered **directly on the homepage** with 30 player profiles carrying position, age and height. Unusual: most clubs link out. It makes the homepage very long but means the squad is never more than a scroll away.
- Ticket pricing is stated in the open: subscriptions "starting at €170 for adults", with a heading **"Découvrez les prix des tickets pour les prochains matchs !"**. Price transparency as a content decision.
- Interior paths `/fr/matchs` and `/fr/les-supporters` both 404'd from outside; findings are homepage-level.

### 2.7 Royale Union Saint-Gilloise — [rusg.brussels](https://rusg.brussels/)

- Nav is: **Club · Marien Stadium · Union Inspires · Business · Union Academy · Fanclubs · FAQ**, with a header quick-link row of **ABO 26/27 · FAQ New stadium · News · Ticketing · Shop**.
- **A dedicated FAQ for a single ongoing project** ("FAQ New stadium") promoted into the header. When a club has one thing everyone is asking about, they build a FAQ for *that thing* rather than adding rows to a general FAQ. Directly applicable to any KCVV infrastructure or fee change.
- The news feed is **filterable by category**: `First Team · Ticketing · Club · Business · Union Inspires · Union Academy · Union Ladies · Merchandise`. Categories map to organisational units, not to content types.
- **Union TV** video band **[MEDIA DEPT]**.
- "Fanclubs" is top-level, same instinct as Charleroi's "Les Supporters".

### 2.8 KAA Gent — [kaagent.be/nl](https://www.kaagent.be/nl) — *deepest read of the tier*

The richest site in this tier for content-IA lessons. Twelve pages read.

- **"Mobiliteit" is a top-level nav item**, and it is a hub of four cards: **"fietsen" · "Parkings & Carpool" · "Supportersbussen" · "Pendelbussen"** ([kaagent.be/nl/mobiliteit](https://www.kaagent.be/nl/mobiliteit)). Cycling is listed *first*. For a Flemish club that is the correct and honest ordering.
- **"Onze club"** splits into five subpages: **Waarden · Geschiedenis · Logo · Native Americans · Vacatures** ([kaagent.be/nl/onze-club](https://www.kaagent.be/nl/onze-club)). Two of those are remarkable:
  - **"Waarden"** — exactly four values, one sentence each ([link](https://www.kaagent.be/nl/onze-club/waarden)): *"Familiaal — Onze club is inclusief, familiaal en toegankelijk voor iedereen."* · *"Sportief — Elke wedstrijd, elke actie die de ploeg onderneemt, vindt plaats in volle sportiviteit."* · *"Uitmuntend — De club wenst garant te staan voor excellency, in alles wat ondernomen wordt."* · *"Eigenzinnig — KAA Gent denkt out of the box, niet 'tegen' iets maar wel 'met een eigen kijk'."* Four words, four sentences, done. No mission-statement bloat.
  - **"Native Americans"** ([link](https://www.kaagent.be/nl/onze-club/native-americans)) — a page in which the club interrogates its own iconography rather than defending it, stating it *"asks with her logo in Europe attention for the social situation of the Indigenous American communities today"* and grounding it in "five centuries of persecution, discrimination and deprivation". Whatever one thinks of the position, **a club publishing a page that explains an awkward part of its own identity is the single most confident content move found in this tier.**
- **History is narrative with named highlight blocks, not a timeline** ([kaagent.be/nl/onze-club/geschiedenis](https://www.kaagent.be/nl/onze-club/geschiedenis)). It opens *"KAA Gent werd opgericht als voetbalafdeling van de Association Athlétique La Gantoise (AAG) op 31 oktober 1900…"* and then breaks the flow with bolded blocks: **BUFFALO** (the nickname's 1906 origin), **STAMNUMMER 7**, **DE KLEINE DOKVRIENDEN** (a 1952 supporter tragedy), **KAMPIOEN VAN BELGIË 2014-2015**, **WEMBLEY**. Note that **the stamnummer gets its own named block.**
- **Youth IA is the strongest in the tier.** Under `Jeugd` there are *cross-team* views — **Resultaten · Klassement · Kalender · Nieuws** — that work across all age groups without picking a team first, plus **Missie & Visie**, **Charter** and **Health & Sports Hub** ([kaagent.be/nl/jeugd/ploegen](https://www.kaagent.be/nl/jeugd/ploegen)). Teams are U8→U18 plus Jong KAA Gent.
- **The youth charter is a full governance document** ([kaagent.be/nl/jeugd/charter](https://www.kaagent.be/nl/jeugd/charter)) covering, for players: arrive 15 minutes early, official kit, shin guards, no phones in changing rooms, mandatory showers, no negative social posts; and for **parents**: a communication hierarchy (**coach → coördinator → management**), a **48-hour wait after a match before raising a concern**, immediate safeguarding reporting, transparency about transfers, a 21-day accident-reporting window for insurance, and a rule that outside sports are permitted until U12 with notification. It even sets financial penalties for parental misconduct.
- **The youth mission page** ([link](https://www.kaagent.be/nl/jeugd/missie-visie)) is headed *"We Are One Family – We Are Buffalo"* and closes with a wish for a *"succesvol, leerrijk, uitdagend en vooral plezant seizoen"* — note **"plezant"**, the same register as our own motto.
- **A U8 team page shows no player names.** [kaagent.be/nl/jeugd/ploegen/u9](https://www.kaagent.be/nl/jeugd/ploegen/u9) (renders U8) carries a **"Groepsfoto U8"** and a **"Technische staf"** list of eight named adults — coach, keeperstrainer, movement coach, three teambegeleiders, coördinator, rekruteringscoach — and nothing else. See §3.
- **The senior squad page carries no statistics** ([kaagent.be/nl/team/first-team/spelers](https://www.kaagent.be/nl/team/first-team/spelers)) — grouped `Doelmannen / Verdedigers / Middenvelders / Aanvallers`, and each card is photo + shirt number + name only. A **"Technische staf"** block of 12 follows the players on the same page. Our per-player season stats already beat this.
- **"Wigwam" is a digitised fan-magazine archive** ([kaagent.be/nl/supporter/wigwam](https://www.kaagent.be/nl/supporter/wigwam)) — cover thumbnails and PDF downloads organised by **"jaargang"**, running back to jaargang 20 (2016) and currently at jaargang 29. Zero ongoing cost once scanned.
- **Two repeatable article formats**, run before every fixture:
  - **"Voorbeschouwing <thuis> - <uit>"** ([example](https://www.kaagent.be/nl/nieuws/12-08-2026/voorbeschouwing-kaa-gent-ifk-goteborg)) — short, one coach quote, one injury line. Carries hashtags `#COBW #GNTIFK #UECL` and share buttons for X / LinkedIn / Facebook / WhatsApp. **WhatsApp is present and Instagram is not** — correct for a Belgian audience.
  - **"<match>: wat moet je weten?"** ([example](https://www.kaagent.be/nl/nieuws/13-08-2026/kaa-gent-ifk-goteborg-wat-moet-je-weten)) — pure practical logistics under plain headings: **"Consumptiekaart opladen"**, **"Parking en pendelbussen"**, **"Lucien Fietsersvestiaire gesloten"**. It tells fans a bike shed is shut. That level of specificity is what makes it feel like a club talking to its own people.

### 2.9 Royal Antwerp FC — [royalantwerpfc.be/nl](https://www.royalantwerpfc.be/nl)

- Youth recruitment is a **named, recurring, branded event series**: "Reds of Tomorrow: talentendag doelmannen" and "Nieuwe talentendag: Reds of Tomorrow". A goalkeeper-specific talent day is a real content hook, not a generic "kom eens proberen".
- The fan-day article is a model of practical writing ([nieuwe-fandag-nieuw-concept](https://www.royalantwerpfc.be/nieuws/nieuws/nieuwe-fandag-nieuw-concept)): date, location, then a bulleted programme — open training, player presentation, **signing sessions in small groups**, youth academy showcase in a named stand, partner activities — and a free-ticket CTA. Voice is casual and second-person: *"We trappen de dag af"*, *"Ben jij er bij?"*
- The sitemap surfaces **an obituary as a first-class news item** (`raymond-adrianssen-89-overleden`). Clubs at this level publish deaths of former players and volunteers as news. For a village club that is arguably *more* appropriate, not less.
- Share row on articles: Facebook, Twitter, WhatsApp, LinkedIn **and email**.
- **RAFC TV** highlights band **[MEDIA DEPT]**.

### 2.10 OH Leuven — [ohl.be](https://www.ohl.be/)

**Unreadable.** TLS certificate mismatch on both `www.ohl.be` and `ohl.be` (certificate presented is for `birmingham2022.com`), and a direct insecure fetch returns HTTP 404. No findings recorded.

### 2.11 KVC Westerlo — [kvcwesterlo.be](https://www.kvcwesterlo.be/)

- **The most complete homepage IA in the tier**, and the only one that reads like a club rather than a shop. Twelve bands in order: **Volgende wedstrijd → Klassement → JONG WESTEL → LADIES → EERSTE PLOEG → DE ONTMOETINGSPLEK VOOR ONDERNEMERS → ONZE PARTNERS → #ENALLEMAALSAMEN → VACATURES → Openingsuren → VEELGESTELDE VRAGEN → KVC WESTERLO-APP**.
- **Youth ("Jong Westel") is placed *above* the first team.** The only club in the tier that does this. It is a statement, and it is the same statement PRODUCT.md principle 2 makes.
- **Opening hours and an FAQ are homepage furniture**, not buried in a footer. Fanshop/ticketing hours are stated with closures ("closed Tuesdays/weekends"), and the FAQ covers ticket purchases, seat management and refund timelines.
- **"VACATURES" on the homepage** — the club advertises jobs to its own supporters. KAA Gent files vacancies under "Onze club" for the same reason: working for the club is framed as belonging, not as HR.
- The youth hub ([kvcwesterlo.be/nl/jong-westel](https://www.kvcwesterlo.be/nl/jong-westel)) publishes **two named coordinators with phone number and email**, alongside "Westel Performance Lab", "Club API", "Atheneum Westerlo" (a school partnership) and "Studiebegeleiding" (study guidance). Named humans with direct phone numbers is exactly the register our `/hulp` page works in.
- Refrain **#ENALLEMAALSAMEN**; app promo headed **"'t KUIPJE IN JE BROEKZAK"** — the stadium's nickname plus a colloquialism, in six words.
- Note: `kvcwesterlo.be/sitemap.xml` contains exactly one URL (the homepage), generated by a free online tool. Interior paths were not discoverable; several 404'd.

### 2.12 Cercle Brugge — [cerclebrugge.be/nl](https://www.cerclebrugge.be/nl)

- Nav is six items and heavily transactional: **Teams · Fans · Business · Shop · Abo & tickets · MyCercle**.
- **A memorial holds a permanent homepage slot** — the Miguel Van Damme tribute, carried with the line **"Voor eeuwig in ons groen-zwart hart"**. Club colours used as the emotional anchor of a memorial phrase. (The direct memorial URL 404'd; the band and its copy are on the homepage.)
- **"Volg Cercle van nog dichterbij"** heads a band promoting **WhatsApp and Messenger channels** — a broadcast channel, not a social feed embed. For a club that has ruled out a newsletter, this is the shape of the alternative: push without a mailing list.
- Newsletter band present — **reject** (see §4).

### 2.13 STVV — [stvv.com/nl](https://www.stvv.com/nl) — *second-deepest read*

- **Best identity line in the tier: "Stvv, dat is... Voetbal. Volk. Vuur."** Three nouns, alliterative, no verbs, and "Volk" (the people) sits between football and passion. It is the homepage's first band.
- **`#WijSTVV` is a named non-sporting hub with five children** ([stvv.com/nl/wij-stvv](https://stvv.com/nl/wij-stvv)): **Voetbal voor iedereen · Vrijwilligers · Activiteiten · Binkie** (the mascot) **· Vrienden van STVV**. Its three pillars are stated as **Traditie ("Al 100 jaar") · Ontspanning ("Voor iedereen") · Sociale meerwaarde ("Lokale gemeenschap")**. Note the framing sentence: *"STVV is echter meer dan een club."* — **we must never write this** (see §4).
- **Volunteers page** ([link](https://stvv.com/nl/wij-stvv/vrijwilligers)) — the highest-leverage page found for KCVV. It opens *"Wil jij deel uitmaken van dit team samen met 500 anderen? Een unieke ervaring met maatschappelijke bijdrage!"*, names concrete roles (stewards, catering, parkeerwachters, fanshop, jeugdafgevaardigden, trainers), states the three occasions volunteers are needed (**"Op matchdagen"**, **"Binnen onze jeugdwerking"**, **"Tijdens onze sociale activiteiten"**), lists non-monetary rewards (a unique pin, recognition, social activities with staff and players), and closes with *"Wil jij ook jouw steentje bijdragen?"* pointing at **a named person's email address**, not a form.
- **Open trainings** ([link](https://stvv.com/nl/open-trainings)) — a weekly table, Monday to Sunday, with a dated range ("10/08 t.e.m. 16/08") and three states per day: **"Open training" / "Gesloten training" / "Geen training"**, plus times and venues, with matches inlined into the same table. Copy: *"Elke week kan je hier een bijgewerkt trainingsprogramma terugvinden."* · *"Houd er rekening mee dat er last-minute wijzigingen in het programma kunnen optreden."* · *"Onze open trainingen zijn onbeperkt toegankelijk voor publiek."*
- **History is chaptered by decade with per-era pages** ([stvv.com/nl/geschiedenis](https://stvv.com/nl/geschiedenis), plus a `/geschiedenis/[slug]` route in the sitemap): **1924 "De beginjaren" · 1960 "De jaren '60" · 1970 · 1980 · 1990 · 2000 · 2010**, each with a summary and a "discover this period" link. Each era has a one-line characterisation (the '80s: recovery from financial trouble through local talent).
- **FAQ is five categories in accordions** ([stvv.com/nl/faq](https://stvv.com/nl/faq)): **Mijn STVV** (4) · **Abonnementen** (14) · **Cashless** (3) · **Online tickets** (6) · **Wedstrijddag** (5). The `Wedstrijddag` category is the transferable one — *"Hoe laat gaat het stadion open op wedstrijddag?"*, *"Waar kan ik parkeren op wedstrijddag?"* Questions written in the visitor's voice, not the club's.
- **Supportersclubs are listed with their café** ([stvv.com/nl/supportersclub](https://stvv.com/nl/supportersclub)) — e.g. *"De Witte Van Tilles | Café De Witte van Tilles"*, with *"Niet van toepassing"* where there is no venue. Flat, alphabetical, honest about gaps.
- **Sponsors are tiered four ways, and the fourth tier is "Local heroes"** ([stvv.com/nl/business/partners](https://stvv.com/nl/business/partners)): **Hoofd partners · Business partners · Media partners · Local heroes**. Every entry carries logo + company name + **a Dutch description of what the company does** + an outbound link, some with "Lees meer".
- The sponsorship sell ([stvv.com/nl/business/sponsoring](https://stvv.com/nl/business/sponsoring)) leads with *"Net als uw bedrijf is STVV begaan met het resultaat. Ons doel is een win-win."*, then reach numbers, then a list of **"Productfiches"** (3D Doeken, Dugout, Led Boarding, **Wedstrijdpartner**, …), then *"Contacteer ons"* with a named person. **"Wedstrijdpartner" is sold but never shown on a match page** — that is the gap recommendation #4 exploits.
- Teams: **Eerste elftal · Beloften · STVV Youth · Esports · Referee Academy** — a **Referee Academy** as a listed "team" is a genuinely original move for a club with a referee shortage.
- Fixtures page ([stvv.com/nl/wedstrijden](https://stvv.com/nl/wedstrijden)) filters on **Competitie** ("Alle competities / Croky Cup / Jupiler Pro League / Vriendschappelijk") × **Seizoen** × **Type** ("Volgende wedstrijden" / "Afgelopen wedstrijden"), with a hero next-fixture card carrying a **live countdown**. Empty state reads *"Geen data om weer te geven"* — bland; ours should do better.
- Inclusion page ([stvv.com/nl/wij-stvv/voor-iedereen](https://stvv.com/nl/wij-stvv/voor-iedereen)) defines G-voetbal in plain words — *"G-voetbal is voetbal voor kinderen en volwassenen met een mentale of fysieke beperking"* — and positions the club as *"draaischijf van het Haspengouwse voetbal"*, a regional hub rather than a summit.

### 2.14 KV Kortrijk — [kvk.be](https://www.kvk.be/) (redirects from kvkortrijk.be)

- **The best match-detail page in the tier.** [kvk.be/wedstrijd/fda-2026-2027/club-brugge-kv-kortrijk-6](https://www.kvk.be/wedstrijd/fda-2026-2027/club-brugge-kv-kortrijk-6/) uses one URL for the whole lifecycle of a fixture, tabbed **"Voor" · "Line-up" · "H2H" · "Live" · "Na"**, with status **"Gespeeld"**, a **"Voorbeschouwing"** block holding preview articles, a tactical formation diagram, a **"Nabeschouwing"** block holding the report and highlights, and prev/next fixture navigation at the foot. The link never changes as the match moves from preview to archive.
- Preview article titles on that page are written as *questions*: **"Wint de Veekaa voor het eerst op Jan Breydel?"** and, next to it, the purely practical **"Alle supportersbussen vol naar Brugge."**
- **"Waar was jij op 20/10/2013?"** ([matchvanhetdecennium](https://www.kvk.be/matchvanhetdecennium/)) — a single historic match given its own permanent page, opening: *"Een echte Kortrijkzaan weet dat nog goed. Het Guldensporenstadion daverde op haar grondvesten want onze Kerels stuurden Club Brugge naar huis met 4-1."* Note the construction — *"Een echte Kortrijkzaan weet dat nog goed"* — which flatters the reader into membership. The replay itself is gated behind MyKVK login; **the gate is the mistake, the page is the idea**.
- The `page-sitemap.xml` is a catalogue of cheap fan formats worth naming: `loop-mee-op` (walk out with the team), `kv-kids-erehaag` (kids' guard of honour), `kv-kids-tekening` (kids' drawing competition), `paaseierenraap` (Easter egg hunt), `jongleren` (keepy-uppy challenge), `wallpapers`, `derbyheersers-wallpaper`, `4-generaties-rood-wit-bloed` (four generations of one supporter family), `waar-was-jij`. **Almost none of these need a media department.**
- Slogan: **"Waar traditie thuishoort!"** The nickname "de Kerels" and "de Veekaa" are used in editorial copy, not just in chrome.
- Match content is entity-modelled: the sitemap has separate `opta_player`, `opta_team` and `opta_match` collections, i.e. every match, team and player is a first-class indexed page. We already do this; worth noting we are structurally level with a Pro League club here.

### 2.15 SV Zulte Waregem — [essevee.be](https://www.essevee.be/)

- Homepage's first heading is **"Wij zijn Essevee"** — first person plural, and the *nickname* rather than the legal name.
- **Dialect used as a positioning statement: "Tope Es Alles Meuglijk"** (West Flemish for "together everything is possible"), sitting directly above the corporate line *"de challenger voor de top van het Belgische voetbal"*. Dialect for the heart, standard Dutch for the ambition.
- The fanshop band is headed **"BOEREN KOPEN LOKAAL!"** — the club's own nickname ("de Boeren") turned into a pun about buying local. This is the sharpest use of a nickname found in the tier.
- Teams: **A-kern · Jong Essevee · Essevee Women · Academie**.
- Newsletter band present — **reject**.

### 2.16 Beerschot — [beerschot.be/nl](https://www.beerschot.be/nl)

- A **coherent naming system across three programmes**: **"Generation XIII"** (youth), **"Community XIII"** (community), **"Club XIII"** (institution) — one suffix, three domains. Compare KCVV's existing "Angels" and "Ultras": a shared naming grammar would let new programmes join without inventing a new register each time.
- Match band splits three states explicitly: **"Vorige wedstrijd" · "Laatste wedstrijd" · "Volgende wedstrijd"**. Distinguishing *previous* from *most recent* is a subtlety most clubs skip — it matters in a midweek/weekend double-fixture week.
- Nav: **Nieuws · Team · Wedstrijden · Club · Business · Shop · Tickets · Hospitality · Abonnementen** — nine items, four of them commercial. Overloaded; a counter-example.

### 2.17 Lommel SK — [lommelsk.be](https://www.lommelsk.be/)

- Nav puts **"Spelers"** as its own top-level item, separate from the team pages — a player *index*, not just squad lists nested under teams. We have `/spelers/[slug]` but no `/spelers` index in the route tree; this is a small, real gap.
- Team structure: **Heren · Dames · Jong Lommel · Youth Talent · ManCity Football Programs** — the last being a named external partnership treated as a team-level entity.
- Homepage carries **"Talent weekplanning"** updates — a weekly plan published for the academy. Same family as STVV's open-trainings table.

### 2.18 K. Patro Eisden Maasmechelen — [patroeisden.com](https://patroeisden.com/)

- **The cleanest per-team template in the tier, and the closest to KCVV's scale.** Every team — `1ste ploeg`, `Beloften`, `Ladies`, `Jeugd` — gets the identical four-tab page: **"Wedstrijden" · "Klassement" · "Resultaten" · "A-kern"** ([patroeisden.com/teams](https://patroeisden.com/teams/), [1ste ploeg](https://patroeisden.com/teams/1ste-ploeg/)). One template, four teams, no bespoke pages.
- **Separating "Wedstrijden" (upcoming) from "Resultaten" (past) as two tabs**, rather than one list with a divider. Worth A/B-thinking about for `/ploegen/[slug]/wedstrijden`.
- **The youth section lives on a separate subdomain** (`jeugd.patroeisden.com`) and photos are offloaded to Flickr. Both are cost decisions that fragment the club — a **reject**, and a validation of our unified `/jeugd` + `/galerij`.
- **"Het Patronaat"** is a top-level nav item — a themed section named after the club's own history rather than its function. Compare our `/club/[slug]` CMS pages, which could carry a named section rather than a generic slug list.
- Refrain: **"Forza Patro!"**, used as the heading of the partner band.

### 2.19 FCV Dender EH — [fcvdendereh.be](https://fcvdendereh.be/nl/home/)

- **The finding of the tier for matchday IA: "Praktische info" links attached to *specific fixtures* on the homepage.** Not a general practical-info page — practical info scoped to one match. That is precisely the shape an amateur away fixture needs (which ground, which entrance, is there a kantine).
- Nav: **Nieuws · Seizoen · Team · Club · Business & Hospitality · Fans · TICKETS · COMMUNITY**. **"Seizoen"** as a nav item groups fixtures + standings + squad under the *season* rather than under the team — a different and defensible axis when a club has one dominant team.
- Sponsor gallery runs to **17+ logos** in one grid with no tiering. A counter-example: undifferentiated logo walls give every sponsor the same nothing.
- Youth links out to a separate site — same fragmentation as Patro Eisden.

### 2.20 RAAL La Louvière — [raal.be](https://www.raal.be/)

- **Club sub-nav is four items and all four are substantive: "Histoire · Organigramme · Infrastructures · Règlements"** — history, org chart, facilities, **and the club's own regulations published as a page**. We have `/club/bestuur` and `/club/jeugdbestuur` (organigram) but no published règlement/huishoudelijk reglement.
- The history page ([raal.be/histoire](https://www.raal.be/histoire/)) is the most *useful* heritage page in the tier because the club died and restarted: it narrates the 2009 dissolution, an eight-year dormancy, the 2017 reconstitution, and — crucially — states that the rebuild is owned by **"over 250 shareholders … business owners, students, retirees, and community members"**. Ownership as heritage. **A club whose identity is discontinuous can still tell a strong story; it just has to tell the discontinuity.** That is directly the KCVV merger problem.
- **"Coeur de Loup"** is the membership scheme, **"Les Loups"** the nickname and **"la meute"** (the pack) the collective noun for the fanbase — one metaphor, three uses. Same lesson as Beerschot's "XIII" and Essevee's "Boeren".
- Nav also carries **"Clubs de supporters"** and a top-level **"FAQ"**.
- `/club/reglements/` and `/club/organigramme/` both 404 from the paths in nav (the real paths appear to be flat, e.g. `/organigramme/`); the nav items themselves are the finding.

### Sites that could not be read

Recorded rather than guessed at, per method.

| Club | URL attempted | Failure |
| ---- | ------------- | ------- |
| Club Brugge | `https://www.clubbrugge.be/nl` | HTTP 403, then HTTP 429 behind a "Vercel Security Checkpoint" browser-verification interstitial on retry with a full browser UA. |
| OH Leuven | `https://www.ohl.be/`, `https://ohl.be/nl` | TLS certificate mismatch (cert is for `birmingham2022.com`); insecure fetch returns HTTP 404. |
| RWDM | `https://www.rwdm.be/` | Resolves to a Level27 hosting placeholder page, not a club site. No club content served. |
| RFC Seraing | `https://www.rfcseraing.be/` | DNS `ENOTFOUND`. |
| RSC Anderlecht (interiors) | `/nl/teams/first-team`, `/nl/club/geschiedenis`, `/nl/nieuws`, `/nl/tickets-abonnementen` | All HTTP 404; sitemap exposes only the three language roots. Homepage-only findings recorded. |
| KRC Genk (Young Genkies) | `https://www.younggenkies.be/nl` | TLS chain error ("unable to get local issuer certificate"). |

---

## 3. Tier patterns

### What essentially every pro club does

1. **A next-match / last-result widget within the first screen.** Universal (Westerlo, KVM, Genk, Essevee, Beerschot, Patro, Dender, Lommel, RAAL, Charleroi, KVK, Union). Usually paired immediately with a **Klassement** block. KCVV already does the equivalent.
2. **A partner logo strip on every page, not just a sponsors page.** Antwerp, Patro, Charleroi, KVK, Genk, STVV all repeat the main-partner row site-wide.
3. **A tiered partner vocabulary.** "Hoofdpartners" (Antwerp), "Structurele partners" (Gent), "onze main partners" (Essevee), "ONZE PARTNERS" (Westerlo), "Key Partners" (Union), "Nos partenaires" (Charleroi), four named tiers (STVV).
4. **Teams as a hub with per-team sub-nav.** The recurring quartet is *squad / fixtures / results / standings* (Patro's `A-kern · Wedstrijden · Resultaten · Klassement`, Genk's `Team · Wedstrijdkalender · Klassement · Trainingen · Vorige seizoenen`).
5. **News categorised by organisational unit** (Union: First Team / Ticketing / Club / Business / Academy / Ladies / Merch), not by content type.
6. **A club-TV band** — Mauve TV, RAFC TV, Union TV, STTV, KRC Genk Play, KVK livestreams. **[MEDIA DEPT]** in all cases.
7. **A named community/foundation programme** — Standard Engagé, KAA Gent Foundation, Genk Foundation, Community XIII, #WijSTVV, Charleroi's La Fondation.
8. **A named recurring identity refrain**, deployed as a *section heading* rather than only as a footer signature: `#ENALLEMAALSAMEN`, `#trotsoponzekleuren`, `#WijSTVV`, `#mijnploeg`, `Forza Patro!`, `Wij zijn Essevee`, `la meute`.
9. **Youth squads below roughly U13 are not published by name.** KAA Gent's U8 page shows a **"Groepsfoto U8"** and named *staff* only; KV Mechelen's academy listing starts at U13. This is the tier's default posture toward minors.
10. **A newsletter signup.** Cercle, KAA Gent (twice on the homepage), Charleroi, Essevee, Genk. Out of scope for us by product decision.

### What none of them do — opportunity gaps

1. **Nobody publishes head-to-head history in a form a fan can read.** KVK has an `H2H` tab and is the only one. We already hold every historic KCVV result in PSD.
2. **Nobody surfaces the match sponsor on the match page.** STVV *sells* a "Wedstrijdpartner" product; the public match page shows a generic partner strip. Inventory sold, value never delivered.
3. **Nobody answers "is the match actually on?"** Not one site in this tier has a visible cancellation/postponement status. At pro level fixtures rarely fall through; **in Belgian amateur football, afgelasting is the single most urgent piece of matchday information there is**, and no club site of any level found here handles it as a first-class state.
4. **Nobody explains their own age categories.** U6 to U21 appear everywhere as bare labels. No club tells a new parent what U9 means, when a child moves up, or how many players are on the pitch at that level.
5. **Nobody publishes a training schedule in a form that survives the week** — Genk reserves the slot and leaves it empty; STVV is the lone working example, and only for the first team.
6. **Nobody does a genuinely good opponent page.** Away clubs are a crest and a name. We already ship `/tegenstander/[clubId]`, which is ahead of the entire tier.
7. **Nobody publishes a season archive that is easy to reach.** Genk reserves "Vorige seizoenen" and leaves it empty. Last season vanishes everywhere else.
8. **Almost nobody names the humans you would actually phone.** Westerlo's two youth coordinators with phone numbers and STVV's named volunteer contact are the exceptions; the norm is a generic `info@` address. Our `/hulp` is already an outlier in the right direction.
9. **Nobody writes an empty state.** STVV's fixtures page renders *"Geen data om weer te geven"*; several pages read as blank. Copy for the zero-data case is unowned across the whole tier.
10. **Nobody attaches practical info to a specific fixture** except FCV Dender, and it does so only as a link from the homepage.

---

## 4. Recommendations

### ADOPT

**A1 · Weekly training schedule per team** — **S**
*What:* a table per team: day → `Open training` / `Gesloten training` / `Geen training` / match, with time and pitch. Dated week range. Two lines of standing copy adapted from STVV: *"Elke week kan je hier een bijgewerkt trainingsprogramma terugvinden."* and *"Houd er rekening mee dat er last-minute wijzigingen in het programma kunnen optreden."*
*Why for KCVV:* youth parents are a co-primary audience and this is their most frequent question; it is currently answered only in WhatsApp groups. It also serves recruitment — a prospective member can see when a team trains without contacting anyone.
*Where:* a block on `/ploegen/[slug]` and `/jeugd/[slug]`, authored in Sanity per team. Not a new top-level route.
*Source:* [stvv.com/nl/open-trainings](https://stvv.com/nl/open-trainings), [krcgenk.be/nl/sportief/1ste-ploeg/trainingen](https://www.krcgenk.be/nl/sportief/1ste-ploeg/trainingen)

**A2 · Volunteer recruitment page** — **S**
*What:* `/club/vrijwilligers`. Concrete named roles (kantine, terreinverzorging, wedstrijdafgevaardigde, scheidsrechter, seingever, jeugdtrainer, fotograaf); the three occasions volunteering happens ("op wedstrijddagen", "binnen onze jeugdwerking", "tijdens onze activiteiten"); what you actually get out of it, stated honestly and non-monetarily; and a named person with an email, not a form.
*Why for KCVV:* PRODUCT.md's first success criterion is "recruit players and volunteers" and there is no surface for the second half of that sentence. This is the highest impact-per-hour recommendation in this document.
*Source:* [stvv.com/nl/wij-stvv/vrijwilligers](https://stvv.com/nl/wij-stvv/vrijwilligers)

**A3 · Sponsor cards with description, sector and link** — **S–M**
*What:* extend the existing three-tier `/sponsors` roster so each entry carries a one- or two-sentence Dutch description of what the business does, a sector, and an outbound link — not only a greyscale logo.
*Why for KCVV:* product principle 4 says sponsors get real estate, not decoration. A logo wall is decoration. A local business directory is a page an Elewijt resident might actually *use*, which is the return a sponsor can point at when renewing. Costs one Sanity field and one editorial pass.
*Source:* [stvv.com/nl/business/partners](https://stvv.com/nl/business/partners) (compare the undifferentiated 17-logo grid at [fcvdendereh.be](https://fcvdendereh.be/nl/home/))

**A4 · Head-to-head block on `/wedstrijd/[matchId]`** — **M**
*What:* previous meetings with this opponent — date, competition, score, link to that match page — plus a W/D/L summary. Derived entirely from data we already sync.
*Why for KCVV:* the only club in the tier that does it is KVK. It adds depth to our highest-traffic page type with zero editorial input, and it makes the archive we already hold *visible* instead of merely present.
*Note:* per `apps/web/CLAUDE.md`, any W/D/L aggregation belongs in the BFF, not in the page.
*Source:* [kvk.be/wedstrijd/fda-2026-2027/club-brugge-kv-kortrijk-6](https://www.kvk.be/wedstrijd/fda-2026-2027/club-brugge-kv-kortrijk-6/)

**A5 · Youth charter (spelers én ouders)** — **M**
*What:* a `/jeugd/charter` or `/club/[slug]` page setting out, plainly, what is expected of players and of parents — including a communication path (trainer → coördinator → jeugdbestuur), a cooling-off rule before raising a match-day complaint, a safeguarding contact, and what happens on transfer.
*Why for KCVV:* it is the clearest available expression of "show the club is serious", it pre-empts the most common source of friction in youth football, and it is the sort of document a parent screenshots. Copy should be considerably shorter and warmer than KAA Gent's — theirs runs to financial penalties, which would be wrong in our register.
*Source:* [kaagent.be/nl/jeugd/charter](https://www.kaagent.be/nl/jeugd/charter), [kaagent.be/nl/jeugd/missie-visie](https://www.kaagent.be/nl/jeugd/missie-visie)

**A6 · A four-value club statement** — **S**
*What:* four words, one sentence each, on `/club`. KAA Gent's shape is the model: *"Familiaal — Onze club is inclusief, familiaal en toegankelijk voor iedereen."*
*Why for KCVV:* our motto carries the *feeling* but not the *commitments*. Four sentences is a constraint that prevents the mission-statement bloat this genre invites, and it gives future design and editorial decisions something to be checked against.
*Source:* [kaagent.be/nl/onze-club/waarden](https://www.kaagent.be/nl/onze-club/waarden)

**A7 · FAQ with a "Wedstrijddag" category** — **S–M**
*What:* an accordion FAQ in the visitor's voice. Amateur-appropriate categories: **Lid worden** · **Wedstrijddag** · **Jeugd** · **Praktisch**. Questions like *"Waar kan ik parkeren op wedstrijddag?"*, *"Wat kost een lidgeld en wat zit erin?"*, *"Wat als de wedstrijd afgelast wordt?"*, *"Vanaf welke leeftijd kan mijn kind starten?"*, *"Hoe werkt ProSoccerData?"*
*Why for KCVV:* Westerlo puts its FAQ on the homepage; Union puts one in the header. `/hulp` answers *who*, never *what*. This is also the natural home for the age-category explainer nobody in the tier provides.
*Source:* [stvv.com/nl/faq](https://stvv.com/nl/faq), [kvcwesterlo.be](https://www.kvcwesterlo.be/) homepage band "VEELGESTELDE VRAGEN", [rusg.brussels](https://rusg.brussels/) header "FAQ"

**A8 · Publish deaths and milestones as news** — **S**
*What:* treat obituaries of former players, volunteers and supporters as first-class news, as Royal Antwerp does (`raymond-adrianssen-89-overleden`), and give a permanent home to memorials in the register Cercle uses: *"Voor eeuwig in ons groen-zwart hart"*.
*Why for KCVV:* at village level this matters more than at pro level, and it is the kind of content Facebook currently absorbs by default. Costs nothing but editorial permission to do it.
*Source:* [royalantwerpfc.be sitemap](https://www.royalantwerpfc.be/sitemap.xml), [cerclebrugge.be/nl](https://www.cerclebrugge.be/nl)

---

### ADAPT

**B1 · Match page as a lifecycle, not a snapshot** — **M–L** · *poor man's version below*
*Full version (KVK):* one URL, five tabs — `Voor` / `Line-up` / `H2H` / `Live` / `Na` — with preview articles, a formation diagram, live updates, and a report, plus prev/next fixture links. The `Live` tab needs a media department (and PRODUCT.md rules out live scores anyway).
***Poor man's version:*** keep one URL and one page, but let it change state. **Before:** kickoff, venue, how to get there, H2H, both teams' recent form, any linked preview article. **After:** score, goal events, lineup, standings snapshot, linked report. Add prev/next fixture navigation at the foot — that costs almost nothing and turns isolated match pages into a browsable season. No tabs needed; the page simply shows what exists.
*Source:* [kvk.be match page](https://www.kvk.be/wedstrijd/fda-2026-2027/club-brugge-kv-kortrijk-6/)

**B2 · "Wat moet je weten" — practical info scoped to one fixture** — **M** · *poor man's version below*
*Full version:* KAA Gent publishes a bespoke logistics article before every match (parking, shuttles, card top-ups, a closed bike shed); FCV Dender links per-fixture "Praktische info" from the homepage.
***Poor man's version:*** no article, no editing. A generated block on `/wedstrijd/[matchId]` for **away** fixtures: opponent ground address, a map link, kickoff, and — where we know it — one line about the venue. For **home** fixtures, a fixed block: Driesstraat 32, parking, kantine. Written once, rendered forever. This is what serves the "opposition supporter who does not scroll" audience PRODUCT.md names, and no amateur club in Belgium does it.
*Caveat:* venue is one of the fields PRODUCT.md flags as unreliable from PSD — the block must degrade to the club address or disappear entirely, never render half-empty.
*Source:* [kaagent.be — wat moet je weten](https://www.kaagent.be/nl/nieuws/13-08-2026/kaa-gent-ifk-goteborg-wat-moet-je-weten), [fcvdendereh.be](https://fcvdendereh.be/nl/home/)

**B3 · Heritage told in chapters, with the discontinuity told out loud** — **M**
*Full version:* STVV's decade-by-decade chapters with their own URLs; KAA Gent's narrative broken by named highlight blocks (**BUFFALO**, **STAMNUMMER 7**, **DE KLEINE DOKVRIENDEN**, **WEMBLEY**); RAAL narrating its own death and rebirth including who owns the club now.
***Adaptation for KCVV:*** our history problem is exactly RAAL's — the club's present form came out of mergers, and PRODUCT.md forbids asserting 1909 as a bare founding date. RAAL proves the discontinuity *is* the story. Split `/club/geschiedenis` into eras with their own URLs, and give **"Stamnummer 55"** its own named block the way KAA Gent gives one to stamnummer 7. Stamnummer 55 is a genuinely remarkable fact that currently lives only in `llms.txt`.
*Effort note:* the era split is **M**; writing the eras is an editorial job, not an engineering one.
*Source:* [stvv.com/nl/geschiedenis](https://stvv.com/nl/geschiedenis), [kaagent.be/nl/onze-club/geschiedenis](https://www.kaagent.be/nl/onze-club/geschiedenis), [raal.be/histoire](https://www.raal.be/histoire/)

**B4 · A single-match memory page** — **S–M**
*Full version:* KVK's "Waar was jij op 20/10/2013?" — one legendary match, its own permanent page, with the replay gated behind a login.
***Poor man's version:*** we already render every historic match. Pick five or six matches that Elewijt actually remembers, write two paragraphs each from someone who was there, and link them from `/club/geschiedenis` and from the relevant `/wedstrijd/[matchId]`. **Never gate anything** — the gate is KVK's mistake. Steal the second-person construction (*"Een echte Kortrijkzaan weet dat nog goed"*) which flatters the reader into belonging; the KCVV register for it is obvious.
*Source:* [kvk.be/matchvanhetdecennium](https://www.kvk.be/matchvanhetdecennium/)

**B5 · Cheap participatory fan formats** — **S each**
*Full version:* KVK's catalogue — `loop-mee-op` (walk out with the team), `kv-kids-erehaag` (kids' guard of honour), `kv-kids-tekening` (drawing competition), `jongleren` (keepy-uppy challenge), `paaseierenraap`, `wallpapers`, `4-generaties-rood-wit-bloed` (one supporter family across four generations).
***Adaptation:*** none of these need budget. Each is a page plus a form or an email address, and they turn `/evenementen` from a listing into a programme. `4-generaties` in particular is a format we could run indefinitely: one supporter family per season, photographed at the ground.
*Effort caveat:* each is cheap to *build* and requires a volunteer to *run*. Recommend two, not seven.
*Source:* [kvk.be page sitemap](https://www.kvk.be/page-sitemap.xml)

**B6 · A season archive** — **M**
*Full version:* Genk reserves "Vorige seizoenen" per team (and leaves it empty).
***Adaptation:*** we hold every past result, squad and standing in PSD. A per-team `vorige-seizoenen` view — final table position, squad photo, results list — is the differentiator PRODUCT.md's positioning section is describing: *"real, synced competitive data across the whole club"* is worth much more if it does not evaporate every June.
*Source:* [krcgenk.be/nl/sportief](https://www.krcgenk.be/nl/sportief)

**B7 · A digitised archive of club print** — **M–L, dependent on what exists**
*Full version:* KAA Gent's "Wigwam" — a fan magazine scanned back to 2016, organised by **jaargang**, cover thumbnail plus PDF.
***Adaptation:*** if the club has old matchday programmes, jubilee books or newsletters in a cupboard, a scanned archive is unmatched heritage content and needs no photographer. If nothing exists, skip this — do not invent it. Note PRODUCT.md's prohibition on fabricated magazine/edition chrome: this only works with **real scans of real documents**.
*Source:* [kaagent.be/nl/supporter/wigwam](https://www.kaagent.be/nl/supporter/wigwam)

**B8 · A club refrain used as a section heading, not just a signature** — **S**
*Full version:* `#ENALLEMAALSAMEN` (Westerlo), `#trotsoponzekleuren` and *"Trots op onze jeugd"* (KV Mechelen), *"Voetbal. Volk. Vuur."* (STVV), *"Tope Es Alles Meuglijk"* and *"BOEREN KOPEN LOKAAL!"* (Essevee), *"'t Kuipje in je broekzak"* (Westerlo), *"la meute"* (RAAL), *"Forza Patro!"* (Patro).
***Adaptation:*** we already own the best line in this list — *"Er is maar één plezante compagnie"* — but the tier pattern is to work the refrain *into section headings and band labels*, not to park it in the footer. KAA Gent's youth page closing wish for a *"vooral plezant seizoen"* shows the same register is live in Flemish football writing. Two sub-moves worth taking:
- **Role-based band labels over category labels** — "Trots op onze jeugd" rather than "Jeugd" (KV Mechelen). This aligns with our own recorded preference for action/role naming.
- **A shared naming grammar for programmes** — Beerschot's `Generation XIII / Community XIII / Club XIII`, RAAL's wolf metaphor across three uses. We have "Angels" and "Ultras" in two unrelated registers; a third programme should not invent a fourth.

**B9 · A published club reglement** — **S**
*Full version:* RAAL's `Club → Règlements` alongside Histoire, Organigramme and Infrastructures.
***Adaptation:*** publish the huishoudelijk reglement / gedragscode as a real page rather than a PDF handed out at signup. Pairs naturally with A5 (charter).
*Source:* [raal.be](https://www.raal.be/) club sub-nav

**B10 · Push without a mailing list** — **S**
*Full version:* Cercle Brugge's **"Volg Cercle van nog dichterbij"** band promoting WhatsApp and Messenger *channels* — one-way broadcast, no email address collected.
***Adaptation:*** we have ruled out newsletters permanently, but the underlying need (tell people the match moved) is real. A WhatsApp channel needs no signup form, no data storage, and no consent flow on our side; the site's job is a single band linking to it. This is the compliant answer to a need every club in the tier solves with email.
*Source:* [cerclebrugge.be/nl](https://www.cerclebrugge.be/nl)

---

### REJECT

**R1 · Newsletter signup of any kind.** Present on Cercle, KAA Gent (twice on the homepage), Charleroi, Essevee and Genk. Ruled out by product decision; B10 is the substitute. — [cerclebrugge.be/nl](https://www.cerclebrugge.be/nl), [kaagent.be/nl](https://www.kaagent.be/nl)

**R2 · Any gated or account-walled content.** KVK's greatest-match replay sits behind a MyKVK login ([kvk.be/matchvanhetdecennium](https://www.kvk.be/matchvanhetdecennium/)); Cercle has MyCercle; Genk and STVV both run "Mijn"-account FAQs. PRODUCT.md: all content is free and there is no login anywhere. Build the page, never the gate.

**R3 · "Meer dan een club" and its variants.** STVV writes *"STVV is echter meer dan een club"* ([stvv.com/nl/wij-stvv](https://stvv.com/nl/wij-stvv)). This is a locked prohibition for KCVV. Recording it here so it is not accidentally imported when adapting the #WijSTVV hub structure, which is otherwise excellent.

**R4 · A separate subdomain or external site for the youth section.** Patro Eisden pushes youth to `jeugd.patroeisden.com` and photos to Flickr; FCV Dender and Lommel link youth out. It fragments identity, splits search, and breaks the "youth is first-class, not a sub-section" principle. Our unified `/jeugd` and `/galerij` are correct.

**R5 · Commercial-first top-level navigation.** Anderlecht's nav is News / Teams / Tickets / Business / TV with no route to the club's own story; Beerschot runs nine items of which four are commercial. We have no tickets, shop or hospitality — this is a temptation we structurally cannot have, but it is worth naming why it looks bad even at pro scale.

**R6 · Undifferentiated logo walls.** FCV Dender's 17-logo grid with no tiering gives every sponsor the same nothing. Our three tiers are already better; A3 pushes further.

**R7 · Quantified reach claims.** Anderlecht's "500+ corporate members"; STVV's "150,000 spectators per season / 130,000 social followers". Effective for them, forbidden for us — PRODUCT.md bars fabricated attendance or engagement figures, and we should not publish real ones we cannot substantiate either.

**R8 · Club TV as a homepage band.** Mauve TV, RAFC TV, Union TV, STTV, KRC Genk Play. **[MEDIA DEPT]** — a video band with nothing durable behind it is worse than no band. The poor man's version is not "fewer videos"; it is **well-designed goal-event data**, which we already render on `/wedstrijd/[matchId]`, plus the occasional embed inside a news article where it belongs.

**R9 · Empty reserved slots.** Genk ships "Trainingen" and "Vorige seizoenen" in its navigation and serves nothing on either. A navigation promise with no content behind it is worse than the absence. If A1 or B6 ships, it ships with data.

---

### Flagged, not recommended: youth privacy

Worth recording as tier evidence rather than as a recommendation, because it cuts against a decision KCVV has already taken.

**Every pro club read here declines to publish the names of young minors.** KAA Gent's U8 page carries a **"Groepsfoto U8"** and a **"Technische staf"** list of eight named adults — and no players ([kaagent.be/nl/jeugd/ploegen/u9](https://www.kaagent.be/nl/jeugd/ploegen/u9)). KV Mechelen's public academy listing begins at **U13** ([kvmechelen.be/nl/teams](https://www.kvmechelen.be/nl/teams)). Neither club states a policy; the pattern is simply universal in the tier.

KCVV ships player profiles across U6–U21 by deliberate decision (PRODUCT.md principle 2, "including its privacy constraints"). The tier evidence does not overturn that, but two things follow from it:

1. **We are doing something no professional club in Belgium does.** If that is right — and there is a genuine argument that an amateur village club's relationship to its own children is not a Pro League academy's — then the privacy constraints referenced in principle 2 are load-bearing and should be *visible* somewhere a parent can find them. This is a strong argument for A5 (charter) carrying an explicit "wat publiceren we over je kind" section.
2. **The group photo is the tier's answer.** "Groepsfoto U8" plus named staff is the fallback shape if any age band's individual profiles ever need to be withdrawn.

---

## 5. Open questions for Kevin

1. **Training schedules — do they exist in a form we can publish?** A1 is the highest-value item here, but only if the club actually knows when each of ~20 teams trains and will keep it current. Does that live in ProSoccerData already, or is it WhatsApp-only? If PSD holds it, A1 drops from **S** to trivial.
2. **Afgelastingen.** No club at any level found here handles match cancellation as a first-class state, and in amateur football it is the most urgent matchday fact. Is there a data source (PSD? the KBVB?) that tells us a fixture is off, or would this necessarily be a manual flag someone sets on a Saturday morning?
3. **Volunteer roles — who is the named human?** A2 works because STVV names a person, not a form. Is there a volunteer coordinator willing to have their email on the page, or does this route to the algemeen secretaris?
4. **Does club print exist?** B7 (scanned archive) is either an outstanding heritage asset or nothing at all, depending entirely on whether there are old programmes, jubilee books or newsletters in a cupboard. Worth one question to the oldest board member before it is scoped.
5. **Youth publication policy.** Given that no pro club publishes minors' names and we publish U6 upward — is there a written policy behind that decision, and should it be surfaced on the site (see the flagged section above)? This affects whether A5's charter needs a data/photo section.
6. **Sponsor descriptions — who writes them?** A3 needs one or two sentences per sponsor. Does the sponsor supply them, or does the club write them? The second is better copy and more work.
7. **Do we want a per-match sponsor?** Recommendation #4 creates new commercial inventory that does not currently exist. That is a board conversation before it is an engineering one — is there appetite to sell a "wedstrijdsponsor", and would the design agent's constraints on the match page accommodate it?
8. **"Legendarische wedstrijden" — which ones?** B4 needs five or six matches Elewijt genuinely remembers, and someone who was there to write two paragraphs each. Does that person exist and are they willing?
9. **Should `/spelers` exist as an index?** Lommel makes "Spelers" a top-level nav item. We have `/spelers/[slug]` but no index in the route tree. Is that deliberate (players are reached via team pages) or an oversight?
10. **Age-category explainer — where does it live?** Nobody in the tier explains what U9 means. It could be a FAQ entry (A7), a block on `/jeugd`, or its own page. It is one of the cheapest genuine differentiators available.
