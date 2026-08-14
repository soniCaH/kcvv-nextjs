# Competitor research — Belgian national amateur tier

**Scope:** Eerste / Tweede / Derde Afdeling VV and Nationale 1/2/3 FFA (formerly ACFF).
**Date of research:** 13 August 2026 (season 2026-27, first fixtures 22 August 2026).
**Researcher note:** every claim below carries its source URL inline. Where a site blocked
fetching or does not exist, that is stated explicitly rather than guessed.

## 0. Where we actually sit

KCVV Elewijt plays in **Derde Afdeling VV A** in 2026-27. Confirmed against the series list at
[nl.wikipedia.org/wiki/Derde_afdeling_2026-27](https://nl.wikipedia.org/wiki/Derde_afdeling_2026-27_(voetbal_België)),
which lists our sixteen: Avanti Stekene, K. Berchem Sport, KSC Blankenberge, K. Olsa Brakel,
SC City Pirates Antwerpen, KV Eendracht Drongen, Eendracht Elene-Grotenberge, **KCVV Elewijt**,
Erpe-Mere United, FC Gullegem, KVK Ieper, K. White Star Lauwe, KSV Rumbeke, KVV Sint-Denijs Sport,
KFC Wambeek-Ternat, VC Zwevegem Sport.

That makes this tier report unusually concrete: fifteen of the clubs named below are the teams we
will physically play this season, and one tier up
([Tweede afdeling 2026-27](https://nl.wikipedia.org/wiki/Tweede_afdeling_2026-27_(voetbal_België)))
and one tier down are our promotion and relegation neighbours.

**Terminology change worth knowing:** ACFF was renamed **FFA — Football Francophone Amateur** in
April 2026 ([royal-belgian-football-association.prezly.com](https://royal-belgian-football-association.prezly.com/acff-devient-ffa-football-francophone-amateur),
[walfoot.be](https://www.walfoot.be/news/2026-04-15/grand-changement-pour-le-foot-wallon--lacff-nest-plus--une-nouvelle-page-tournee-vers-lavenir)).
Any copy of ours that says "ACFF" is now dated.

### A hard number first

I probed every club in our own series for a working website. Result:

| Club (Derde Afdeling VV A) | Own website | Notes |
| --- | --- | --- |
| Avanti Stekene | [avantistekene.be](https://www.avantistekene.be/) | Live but labelled "UNDER CONSTRUCTION" |
| K. Berchem Sport | [berchem-sport.be](https://berchem-sport.be/) | **Invalid TLS certificate** (self-signed) — browsers will interstitial |
| KSC Blankenberge | [sportingclubblankenberge.be](https://sportingclubblankenberge.be/) | via `kscblankenberge.be` 302 |
| K. Olsa Brakel | [olsabrakel.be](https://www.olsabrakel.be/) | Thin; SPA that renders little to a fetcher |
| SC City Pirates | [citypirates.be](https://citypirates.be/) | Strong, but a social-project club, not a typical peer |
| KV Eendracht Drongen | none found | `eendrachtdrongen.be` does not resolve |
| Eendracht Elene-Grotenberge | [eendrachtelenegrotenberge.be](https://eendrachtelenegrotenberge.be/) | |
| **KCVV Elewijt** | ours | |
| Erpe-Mere United | none found | `erpemereunited.be` does not resolve |
| FC Gullegem | [fcgullegem.be](https://fcgullegem.be/) | **Invalid TLS certificate** (self-signed) |
| KVK Ieper | [kvkieper.be](https://kvkieper.be/) | |
| K. White Star Lauwe | none found | `whitestarlauwe.be` does not resolve |
| KSV Rumbeke | [ksvrumbeke.be](https://www.ksvrumbeke.be/) | **Best site in our series** |
| KVV Sint-Denijs Sport | none found | no candidate domain resolved |
| KFC Wambeek-Ternat | [kfcwambeekternat.be](https://kfcwambeekternat.be/) | |
| VC Zwevegem Sport | [zwevegemsport.be](https://zwevegemsport.be/) | |

**Eleven of sixteen have a reachable site; two of those eleven serve an invalid certificate; one is
under construction.** Four clubs in our own series have no website at all. This is the single most
important framing fact in this report: at our level the baseline is not "a decent site" — it is
"maybe a site". Our ambition is not competing with these clubs. It is competing with the two or
three tiers above, and with what a parent has already learned to expect from any other website.

---

## 1. Executive summary — top 10, ranked by impact ÷ effort

1. **Ship an `/afgelastingen` page.** Three clubs in and around our tier have one; we have none. A
   Belgian youth parent checks this before every winter Saturday. Effort **S** if it starts as a
   CMS-driven notice board. ([zwevegemsport.be](https://zwevegemsport.be/),
   [kfcturnhout.be/afgelastingen](https://www.kfcturnhout.be/afgelastingen),
   [tempo-overijse.be/afgelastingen](https://www.tempo-overijse.be/afgelastingen/))
2. **Publish named volunteer vacancies, not a generic form.** City Pirates lists ten specific roles
   with a named human and his mobile number. We list a dropdown option. Effort **S**.
   ([citypirates.be/vrijwilligers/aanmelden-als-vrijwilliger](https://citypirates.be/vrijwilligers/aanmelden-als-vrijwilliger/),
   [ksvrumbeke.be/vacatures](https://www.ksvrumbeke.be/vacatures))
3. **Publish sponsor packages with real prices.** KSV Oudenaarde publishes matchbal €100,
   wedstrijdsponsor €500, boarding €150–250 per running metre. Our `/sponsors` is a logo roster.
   Effort **S–M**. ([ksvoudenaarde.be/business/sponsoringsmogelijkheden-en-tarieven](https://ksvoudenaarde.be/business/sponsoringsmogelijkheden-en-tarieven))
4. **"Bring a sponsor, cut your own membership fee."** FC PAC Buzet: *"Voulez-vous alléger le prix
   de votre cotisation ? Venez avec un sponsor."* One page, converts parents into a sales channel.
   Effort **S**. ([fcpacbuzet.be](https://www.fcpacbuzet.be/))
5. **A named ombudsdienst with two faces, phone numbers and a stated escalation order.** KM Torhout
   does this better than anyone in the tier. We have an API node in the organigram; we do not have
   the page that tells an unhappy parent what to do. Effort **S**.
   ([kmtorhout.be/ombudsdienst](https://www.kmtorhout.be/ombudsdienst))
6. **Human-readable match URLs.** Torhout uses `/ploegen/kmt-a/wedstrijden/2026-2027/KM-Torhout-RC-Gent~<uuid>`;
   we use `/wedstrijd/<numeric-id>`. Shareable, guessable, indexable. Effort **M** (redirects).
   ([kmtorhout.be](https://www.kmtorhout.be/ploegen/kmt-a/wedstrijden/2026-2027/KM-Torhout-RC-Gent~69a12f7f-bd75-40b6-a2ba-7e91ef9437e8))
7. **A per-mutualiteit reimbursement page, not a sentence.** Torhout names CM, Solidaris, Helan,
   Liberale Mutualiteit and Vlaams Neutraal Ziekenfonds, links each form, and says where to drop it
   off and when to collect it. Effort **S**. ([kmtorhout.be/terugbetalingen-ziekenfonds](https://www.kmtorhout.be/terugbetalingen-ziekenfonds))
8. **Tournaments as a first-class content type with a live bracket.** Oudenaarde and Tempo Overijse
   both embed Tournify live brackets for their own tournaments. We have `/evenementen` but no
   tournament shape. Effort **M**. ([tournifyapp.com/live/ksvo-patrick-cup-2026](https://tournifyapp.com/live/ksvo-patrick-cup-2026),
   [tournifyapp.com/live/tempo-u14cup2026](https://tournifyapp.com/live/tempo-u14cup2026))
9. **A club matchday paper, digital.** Torhout's *KM-Krantje* per matchday, archived at
   `/km-krantjes`. Costs nothing but authoring; enormously "serious club". Effort **M**.
   ([kmtorhout.be/km-krantjes](https://www.kmtorhout.be/km-krantjes))
10. **Trooper.** Two clubs at our level fund themselves through affiliate shopping links. One page,
    zero maintenance, real money. Effort **S**. ([trooper.be/tempo](http://www.trooper.be/tempo),
    [kfcwambeekternat.be](https://kfcwambeekternat.be/))

---

## 2. Club-by-club notes

### 2.1 In our own series (Derde Afdeling VV A)

#### KSV Rumbeke — [ksvrumbeke.be](https://www.ksvrumbeke.be/) — Derde Afdeling VV A

The strongest site in our division and the club we should measure ourselves against week to week.

- **Navigation is organised by need, not by org chart.** Top level: Club / Nieuws / Teams / Dames /
  Jeugd / **Tickets & Info** / Webshop / **Tornooien** / Sponsors. The Club dropdown carries
  Clubinfo, Contact, Organigram, Hoofdbestuur, Medewerkers, Events, **Vacatures**,
  **Blessurepreventie**, **Gezondheidspreventie**, Historiek, Archief, Nieuwsbrief, **Lotenlening**,
  Eindeseizoenshappening.
- **They use the same youth taxonomy we do** — Bovenbouw / Middenbouw / Onderbouw — with 25 youth
  teams individually routed (`/ksvr-2627-IPU13A` and so on). Ours is the better implementation, but
  we are not alone in the model.
- **`/blessurepreventie` and `/gezondheidspreventie` are club-authored health content** covering
  barefoot walking, stretching, footwear, hydration, nutrition, first aid, **groeipijnen** and shin
  splints — written for parents and coaches, not for players. Nobody else in the tier has this.
  ([ksvrumbeke.be/blessurepreventie](https://www.ksvrumbeke.be/blessurepreventie))
- **`/lotenlening` is the boldest thing in this whole report.** To fund a second synthetic pitch
  they issued **320 bonds of €500 each = €160,000**, repaying "*Ieder jaar betaalt de club 10% van
  de loten terug met een intrest van 1%*" over ten years. The page shows the ledger:
  "*Aantal: 320, Verkocht: 320*". All sold.
  ([ksvrumbeke.be/lotenlening](https://www.ksvrumbeke.be/lotenlening))
- **`/vacatures` names actual open roles** — "*Vacature: Verzorger/sportmasseur voor de selectie in
  seizoen '26-'27*", "*Gezocht trainer IPU19*", "*Gezocht trainer GU15*", "*KSVR zoekt gepassioneerde
  trainers*" — each with a "Lees verder". Weakness: no form and no single named recruiter; you land
  on the club secretary's mobile. ([ksvrumbeke.be/vacatures](https://www.ksvrumbeke.be/vacatures))
- **Events are real and dated**: Zomerstage 17–20 Aug, Wandelvoetbaltornooi 21 Aug, Memorial Tornooi
  U8–U15 22–23 Aug, **Comedy Show 11 Dec**, Meisjestornooi 12 Dec. Weakness: no prices and no
  sign-up on the index — every event is a click into an unstructured detail page.
  ([ksvrumbeke.be/events](https://www.ksvrumbeke.be/events))
- **Voice is genuinely human in news**: "*Deze groep moet voor niemand schrik hebben*",
  "*De Rumbeekse Dames kiezen vol overtuiging voor ervaring én eigen jeugd in seizoen 2026-2027*".
- **Where they lose to us:** `/tickets-info` promises practical info and delivers a hub with no
  prices, no kantine hours, no parking and no directions. Our contact page beats it outright.
  Platform is classic ASP (`nieuws.asp?artikel=3406`), and one route is literally still called
  `wedstrijd-detail-test.asp`.

#### KFC Wambeek-Ternat — [kfcwambeekternat.be](https://kfcwambeekternat.be/) — Derde Afdeling VV A

- **Volunteer and trainer recruitment are homepage sections 3 and 4**, above the club's own mission
  statement and above the news. That is a deliberate, defensible ranking decision, and it is braver
  than ours.
- Club dropdown is a governance shelf: Visie, **Panathlonverklaring**, Waarden, Fairplay, Sportieve
  visie, **Trainer worden**, **Vrijwilliger worden**, Trainingsschema, **Aanspreekpunt**,
  Accommodatie, Management, Organigram club, Sportongeval.
- **KFCWT-betaalkaart** — a cashless canteen card with member discounts. We already ship
  `/club/cashless`, so this is parity, not a gap.
- **Trooper** and a "40 WAT" project sit in the top nav as funding channels.
- Voice: "*Voetbal voor iedereen, elk op zijn of haar niveau!*" and the mission
  "*Wij, van KFC Wambeek Ternat willen erkend worden als dé referentie in het pajottenland qua
  voetbalopleiding*".
- **Broken:** the `/vrijwilliger-worden` page linked from their own menu returns
  "*Deze pagina werd niet gevonden*". Their flagship recruitment call is a 404.

#### VC Zwevegem Sport — [zwevegemsport.be](https://zwevegemsport.be/) — Derde Afdeling VV A

- A **"Nuttige informatie"** menu that is exactly the right idea: Documenten, **Attest Ziekenkas**,
  Over Zwevegem Sport, **Afgelastingen**. Naming a menu after the user's state of mind ("I need
  something practical") rather than after the club's departments.
- **Contact → "Ligging terreinen"** as a distinct item from "Contactinfo". Directions are treated as
  their own answer, not a footnote on a contact page.
- Homepage is results-and-fixtures-per-team then sponsors. No news at all.
- Voice: "*Zwevegem Sport staat voor… Samen Sterker, Samen Winnen! Onze passie, onze kracht, onze
  trots*", "*Familiale club*".

#### KVK Ieper — [kvkieper.be](https://kvkieper.be/) — Derde Afdeling VV A

- Best-articulated *identity* copy in the series: "*KVK Ieper is een ambitieuze voetbalclub uit
  Ieper die sportieve prestaties combineert met sterke waarden*" and, playing on the city's history,
  "*We stand our ground weerspiegelt die mentaliteit: vastberaden op het veld, respectvol ernaast,
  en altijd trouw aan de waarden van onze club*". A club slogan that means something local.
- **Jeugd → Documenten** publishes exactly three things and no more: **Opleidingsvisie**,
  **Ethische code KVK Ieper jeugd**, **Intern reglement KVK Ieper jeugd** — "*alle belangrijke
  documenten van onze jeugdwerking*". Restraint is the feature.
  ([kvkieper.be/kvk-ieper-jeugd/documenten](http://www.kvkieper.be/kvk-ieper-jeugd/documenten/))
- Carries **G-Voetbal** and **Wandelvoetbal** as first-class teams alongside A and B.
- **Nothing operational.** No match reports, no standings, no kantine, no events, no ticket prices,
  no volunteer call. A handsome brochure over an empty building.

#### SC City Pirates — [citypirates.be](https://citypirates.be/) — Derde Afdeling VV A

An outlier — a social-mission club across six Antwerp neighbourhoods — but its volunteer machinery
is the best in the tier and is copyable.

- **Vrijwilligers is a top-level nav item** with two children: "Vrijwilligers in the Picture" and
  "Aanmelden als vrijwilliger".
- **Ten named open roles**: Trainer, Terreinverzorger, Visietrainer Dam, Communicatievrijwilliger,
  Coördinator vrijwilligers, Fondsenwerver, Visietrainer Linkeroever, Secretariaat,
  Loket (ticketverkoop), Delegee/afgevaardigde. Framed as
  "*Hieronder vind je alle openstaande functies en vacatures. Klik en ontdek of de functie iets voor
  jou is*" and routed to a named human, **Michiel**, with a mobile number.
- "*Zonder onze vrijwilligers zouden we niet kunnen doen wat we doen.*"
- **Publishes its own numbers on the homepage**: 1,645 members, 215 volunteers, 4,000-person
  waiting list, 801 youth activities. Note: our PRODUCT.md forbids fabricating engagement figures —
  this is a reminder that *real* numbers are powerful, not that we should invent any.
- Weakness: the volunteer flow ends in downloadable PDFs, not a form.

#### Eendracht Elene-Grotenberge — [eendrachtelenegrotenberge.be](https://eendrachtelenegrotenberge.be/)

- The most *village* site in the series, and its events are the reason to look: a
  **Spaghetti-croque eetfestijn (28/08)** and a summer tournament (22/08) sit in the homepage
  carousel with the same weight as the football.
- The best sentence found anywhere in this research, because it is so unmistakably a person typing:
  "*Nog 1 plaats voor U10 (vmd) wie komt mee deel uitmaken van ons tornooi?*"
- 25 individually listed youth teams; a "Sport injury reporting banner" persistent on the homepage.

#### Others in our series

- **KSC Blankenberge** ([sportingclubblankenberge.be](https://sportingclubblankenberge.be/)) — an
  **Info** menu worth stealing wholesale: Aangifte sportongeval, **Club-API**, **Jeugdcharter
  ouders**, Huishoudreglement, **Ouderraad**, **Uitpas**. A *parents' council* and the Flemish
  **UiTPAS** social-tariff scheme both surfaced in navigation. Homepage voice is warm but truncated:
  "*Het einde van het seizoen vieren we zoals elk jaar met onze gezellige en ondertussen…*", plus a
  walking-football-55+ pitch, "*Zin om te blijven bewegen, plezier te maken én nieuwe mensen te…*".
- **K. Olsa Brakel** ([olsabrakel.be](https://www.olsabrakel.be/)) — a client-rendered site that
  serves a fetcher almost nothing. Tagline "*Olsa … méér dan voetbal alleen*". Runs its own **IBY
  Cup** as a nav item.
- **Avanti Stekene** ([avantistekene.be](https://www.avantistekene.be/)) — live, in our series, and
  still shipping a WordPress "Hello world!" post and an "UNDER CONSTRUCTION" banner. Nav is four
  items: Heren, Dames, Jeugd, G-Voetbal, Contact.
- **K. Berchem Sport** and **FC Gullegem** — both serve **self-signed TLS certificates**; every
  visitor gets a browser security interstitial before the homepage.
- **KV Eendracht Drongen, Erpe-Mere United, K. White Star Lauwe, KVV Sint-Denijs Sport** — no
  website found on any candidate domain.

### 2.2 One tier up (Tweede Afdeling VV)

#### KM Torhout — [kmtorhout.be](https://www.kmtorhout.be/) — Tweede Afdeling VV A

**The best amateur club site I found at or near this level.** Not the prettiest — the deepest.

- **Nav organised around the whole club as an institution**: Club / Ploegen / Jeugd / **Business** /
  **Supporters** / **Community** / Contact / Webshop.
- **Real ticket prices, published, per category**
  ([kmtorhout.be/tickets-en-abonnementen](https://www.kmtorhout.be/tickets-en-abonnementen)):

  | Category | Price | 65+ |
  | --- | --- | --- |
  | VIP-abonnement (zonder sponsorcontract) | €275.00 | — |
  | KMT A zitplaats (genummerd) | €140.00 | €130.00 |
  | KMT A staanplaats | €115.00 | €105.00 |
  | KMT B abonnement | €80.00 | €70.00 |

  With the cross-sell stated plainly: "*Een houder van een (VIP-)abonnement KM Torhout A heeft ook
  toegang tot de thuiswedstrijden van KM Torhout B.*" Sold through ClubCollect, not a homebrew form.
- **`/terugbetalingen-ziekenfonds`** — "*Sommige mutualiteiten betalen een deel van het
  inschrijvingsgeld voor een sportkamp en/of een deel van het lidgeld van een sportclub terug*",
  then a form per mutualiteit (CM, Solidaris, Helan, Liberale Mutualiteit, Vlaams Neutraal
  Ziekenfonds), and a three-step physical process: download the right form, hand it in at the youth
  centre *de Velodroom*, collect it a few days later. Named contact: Kelly Coenye, reachable through
  PSD or by email.
- **`/ombudsdienst`** — the standout governance page of the tier. "*Elke speler / ouder / trainer /
  afgevaardigde / medewerker die ontevreden is of een klacht heeft over de clubwerking, kan de
  ombudsdienst vragen om tussen te komen.*" Two named vertrouwenspersonen with e-mail **and**
  mobile: Marina Waerlop (0471 20 59 33), Jelle Dudal (0497 08 30 27). It also states the
  escalation order — speak to the coach or coordinator first, escalate second — and promises
  confidentiality.
- **`/procedure-aansluiting`** — explains the three competitive levels honestly:
  *Gewestelijk* ("*trainen 2x per week*", U7–U21, "*in principe toegankelijk voor iedereen*"),
  *Provinciaal* ("*trainen 3x per week*", U8–U9, on "*talent en kwaliteit*"), *Interprovinciaal*
  (U10–U19, on "*voetbaltalent*"). And for the youngest: "*Voor de voetbalschool (U6) is deze
  procedure niet van toepassing. Voor de U6 organiseren we instapdagen vóór en tijdens het
  seizoen.*" Weakness: the actual next step collapses to "*Neem gerust contact met ons op*".
- **`/km-krantjes`** — a per-matchday club paper, first issue of 2026-27 already out:
  "*Een nieuw voetbalseizoen staat voor de deur! Een nieuw seizoen betekent ook een nieuw
  KM-Krantje!*". Published via Microsoft Sway, which is ugly but free and zero-ops.
- **Recurring social rituals given their own news slots**: *footlunch*, *supportersmaaltijd* during
  KM Torhout B home games, *levend tafelvoetbal*, *Raf Demol Paashappening*, *Hector Tanghe
  Winterhappening*, *KMT-Jeugddag*, *Come Together*.
- **`/supportersclubs`** — "*KM Torhout is gezegend met niet één, maar drie prachtige
  supportersclubs die al tientallen jaren actief zijn*" (Clubboys, De Vrije Supporters, De Lustige
  Supporters). Weakness: no fees or contacts on the index page.
- **Community as a nav concept**: Wandelvoetbal 55+, G-voetbal KM.
- **Human-readable match URLs** with the fixture in the path and a UUID suffix.
- **Where they lose to us, badly:** the match page itself. Their KM Torhout – RC Gent page shows a
  date, competition, a 1–0 scoreline, a standings table and sponsor logos — and **no lineups, no
  goal timeline, no cards, no venue, no report**. Our `/wedstrijd/[matchId]` (MatchHero, lineup
  section, events section, linked preview/recap card, standings snapshot) is in a different league.
  Their `/sponsoring` page also still says "*seizoen 2023-2024*" — three seasons stale.

#### KSV Oudenaarde — [ksvoudenaarde.be](https://www.ksvoudenaarde.be/) — Tweede Afdeling VV A

The best *editorial* operation in the tier, and the only club publishing sponsor rate cards.

- **Every fixture has both a `voorbeschouwing` and a `verslag`**, on parallel URL patterns:
  `/teams/a-kern/voorbeschouwing/wedstrijd-7615` and `/teams/a-kern/verslag/wedstrijd-7615`. Youth
  gets the same treatment: `/teams/jeugdteams/informatie/team-u16/verslag/wedstrijd-8436`.
- **The preview is a genuine piece of writing**, bylined **Nic De Zitter**: a stakes section
  ("*D-Day aan de boorden van de Schelde*"), the relegation permutations, recent-form analysis, an
  opponent profile, the opponent's full 29-match record and scorer distribution, and the table.
  Hard numbers used argumentatively: "*De ploeg haalde 24 punten uit de voorbije 13 wedstrijden,
  tegenover 13 voor KSVO.*" No lineup news, no referee, no quotes.
- **The report uses thematic sub-headings, not a chronology** — "*Shawn, de verlosser*",
  "*Mechelen de meeste kansen…*" — over lineups, a goal timeline (63' 1-0 Shawn Golike Eba), cards
  with timestamps and the **named match officials**. No quotes, no man of the match.
- **`/business/sponsoringsmogelijkheden-en-tarieven` publishes actual money**
  ([source](https://ksvoudenaarde.be/business/sponsoringsmogelijkheden-en-tarieven)):
  - **Matchbal €100** — includes 2 one-day VIP cards, the announcement, a website mention, the
    ceremonial kickoff and "*koffie-gebak-digestief tijdens de rust*". Bundles: 3 for €250; premium
    (min. 2 top matches guaranteed) 3 for €400; single €300, three-pack €800.
  - **Vaste boarding**, €40 one-off setup per running metre, then per metre per year: centrale
    tribune €250 (min. 6 m), onder tribune/piste €200 (min. 3 m), zijbocht €175 (min. 3 m), achter
    de doelen €150 (min. 4 m).
  - **Wedstrijdsponsor €500** — 6 seated VIP tickets with half-time invitations, 10 seated + 10
    standing tickets, 2 free parking passes, "*publiciteit voor en aan de rust van de match
    (micro)*", LED screen mention.
  - LED boarding sold as timelapse slots ("*timelapse 2 minuten (6 x 20 seconden)*" up to 8
    minutes), and a 6 m² LED screen with single-match "*exclusiviteit*".
- **`/business/prijzen-tickets-seizoen-2025-2026` 404s** while still being linked from the live
  homepage. Even the best operators here rot their own links.
- Runs the **Patrick Cup** with a live public bracket on Tournify.
- Headlines are descriptive rather than voiced: "*Oumar Traoré effent de weg naar vlotte zege*",
  "*KSVO goed bij schot*".

#### TEMPO Overijse — [tempo-overijse.be](https://www.tempo-overijse.be/) — Tweede Afdeling VV B

- **The only club in this research running a real interview series.** Three in one month, each
  headlined on the player's own words: "*Maak kennis met Ali Srihi: 'Ik ben een echte teamspeler die
  het verschil wil maken'*", "*Maak kennis met Ryan Lenoir: 'Ik geef nooit op'*",
  "*Maak kennis met Xavier Bwangombo: 'Ik probeer altijd een goede sfeer te creëren'*". Content
  taxonomy has `interviews` and `wedstrijdverslagen` as sibling categories under `tempo-a`.
- **`/afgelastingen`** — organised by youth training, Brabant division and interprovincial, and
  honest about who owns the truth: it links to the federation's cancellation database rather than
  pretending to be authoritative. Real posted example:
  "*HAGAARD BLIJFT GESLOTEN WEGENS SNEEUW*" / "*Jeugdcomplex Hagaard blijft voorlopig dicht omwille
  van de winterse omstandigheden*", with training-resumption updates promised via **PSD**.
- **`/club98`** — the clubhouse *is* content. Business seats named after the founding year 1998:
  "*Ook tijdens het seizoen 2026-2027 kan u vooraf de wedstrijd genieten van een lekker gerecht*",
  a mosselen-met-friet night, and "*Onze CLUB 98 kan ook afgehuurd worden voor familiefeestjes of
  andere activiteiten*" with a named contact and mobile. Weakness: "*Binnenkort kan je hier de
  kalender terugvinden*" — the opening hours are still coming soon.
- **PARKING Begijnhofstadion is a top-level nav item** (linking to a 2018 post).
- **Trooper** as a funding channel; **Panathlonverklaring** on the homepage.
- Voice: "*Het aftellen kan beginnen! Op maandag 20 juli werkt de A-kern van TEMPO Overijse de
  eerste training van het seizoen*"; "*Onze selectie is nog niet compleet*";
  "*Zaterdag mosselen met friet in Club98*".
- Weakness: the recruitment page "*Wil je voetballen bij TEMPO Overijse?*" is an **embedded iframe**
  that renders nothing to a fetcher — and, one suspects, little to a phone.

#### KRC Mechelen — [racingmechelen.be](https://www.racingmechelen.be/) — Tweede Afdeling VV B

- **A matchbal price stated in a news item, not buried in a rate card**: "*Ook dit seizoen houden we
  vast aan deze traditie. Een matchbal sponsoren kost 300…*" Selling a sponsorship as a *tradition*
  is a better frame than selling it as a product.
- Operational honesty done well: "*Jammer genoeg moeten we de digitale voorverkoop voor de
  wedstrijd tegen Lyra-Lierse vanavond om 23u afsluiten*" (police-mandated advance sales only), and
  "*Mis de derby niet in OVK: nog een paar uur en de…*".
- **Match report voice is institutional third-person and unsigned**, and it is good at it:
  "*Lyra-Lierse won de vierde wedstrijd in de groepsfase van de beker van Vlaanderen met 0-3 op
  Racing. Racing had het in het begin van de partij moeilijk, maar kwam nadien beter in de
  wedstrijd. De bezoekers konden hun kansen echter optimaal benutten. Het was een te zwaar verdict
  voor groen-wit, dat de kansen ditmaal niet kon afwerken en het deksel op de neus kreeg.*"
  Note "*groen-wit*" as a self-reference — the same colours we have and do not use this way.
- Jeugd menu is a compliance shelf done properly: Wie is wie?, Huishoudelijk reglement, **API**,
  Missie & Visie, Voetballen bij Racing, Medische begeleiding, Sportongeval, ProSoccerData,
  **Vacatures Jeugd**.
- **Publishes per-article view counts** (259–1,753 views). A small, cheap credibility signal.
- Weakness: `/jeugd/voetballen-bij-racing` — the page a prospective parent is sent to — is empty
  apart from sponsor logos. `/club/tickets-oscar-vankesbeeckstadion` 404s.

#### K. Rupel Boom FC — [rupelboomfc.be](https://rupelboomfc.be/) — Tweede Afdeling VV B

- **A club podcast in the main navigation.** The only one found in the entire tier.
- Homepage is a well-ordered matchday sheet: last report → recent results → transfers → next match
  A → standings → next match B → contact → partners.
- **Publishes a named safety coordinator with a dedicated address and mobile**
  (veiligheid@krupelboomfc.be, 0486/96.07.48) — a national-tier obligation handled visibly.

#### KVK Ninove — [kvkninove.be](https://www.kvkninove.be/) — Tweede Afdeling VV A

- **Socio Business Club** as a top-level item, sold on hospitality rather than exposure:
  "*Voor elke thuismatch kan u genieten van een gastronomisch menu geserveerd door 'Chef Dave
  Lampole'.*" Naming the chef is exactly the kind of specific that makes an amateur club sound real.
- "Wie zijn wij" contains **Het Boek** (a club history book) and **Supportersclub**.
- Headline slogan "*SAMEN STERK*". Both A-team and B-team standings on the homepage.
- Weakness: the whole site still says **season 2025-2026** on 13 August 2026.

### 2.3 One more tier up (Eerste Afdeling VV) and Derde Afdeling VV B

- **Sporting Hasselt** ([sportinghasselt.be](https://www.sportinghasselt.be/)) — the most
  "professional-looking" site in the report and the emptiest where it counts. `/info` gives the
  address (Oude Kuringerbaan 123, 3500 Hasselt), three parkings (P+R Alverberg, Parking Excelsior,
  Parking Hast (matchdag)) and department mailboxes — **but no entry prices, no kantine, no
  directions**, on a page titled Info. Its `/faq` is *entirely* about the Roboticket account flow
  ("*Hoe maak ik een account aan?*", "*Moet ik mijn ticket afprinten of kan dit ook digitaal?*",
  "*Enkel tickets gekocht op naam van een gevalideerd account geven toegang tot het stadion*") —
  a support desk for their own ticketing vendor, not a club FAQ. One good detail: free tickets for
  **referees and scouts** on request, minimum two days ahead. Voice leans hard on the tier cliché:
  "*Het eerste elftal van Sporting Hasselt is méér dan een ploeg, het is pure passie in blauw, wit
  en groen*"; better is "*Sporting, dat ben je van jongs af aan!*"
- **KVV Thes Sport** ([thes-sport.be](https://www.thes-sport.be/)) — clean homepage stack (match
  slider → news → next fixture → standings → Instagram → sponsors). **Its league table renders all
  zeroes** in mid-August because the season has not started; nobody designed the pre-season state.
  We should check ours does better.
- **KFC Turnhout** ([kfcturnhout.be](https://www.kfcturnhout.be/)) — Derde Afdeling VV B. The most
  *practical* navigation in the tier: **Afgelastingen and Planning as top-level items**, plus a
  **FAQ** that is a genuine club FAQ, unlike Hasselt's. All nine questions are things a parent
  actually types: "*Wat te doen bij een sportongeval?*", "*Ik zoek gegevens van een
  jeugdcoördinator?*", "*Ik wil graag kledij bijbestellen*", "*Ik vind de planning niet*",
  "*Zijn er afgelaste wedstrijden?*", "*Stel een vraag online aan de jeugdverantwoordelijke*",
  "*Ik moet mijn lidgeld/contributie nog betalen maar ik weet niet hoe?*",
  "*Ik heb vragen over kledij?*", "*Vacature of interesse voor jeugdtrainer?*"
  Their **Fan** section is the best supporter-facing IA anywhere here: **KFCT GIN** (a club gin),
  **De Daaiherten** (supporters' club), and **Lidgeld en busreizen** with real numbers —
  membership **€5** (welcome gift, voting rights for the awards, bus discounts, event priority);
  away bus from *Hof ter Duinen, Steenweg op Antwerpen 2*; **season bus pass €100**, per match
  **€10 members / €12 non-members**; booked via daaiherten@outlook.com.
  Their `/afgelastingen` is honest and lazy in the right way: "*Lees alles over afgelastingen op de
  website van de Koninklijke Belgische Voetbalbond via deze LINK VAN DE KBVB*" plus a local weather
  link, "*Wat zijn de weersvoorspellingen voor de komende dagen in Turnhout, lees het HIER*".
  Weakness: the notifications block reads "*Geen meldingen*" with a timestamp of **10 October 2022**.
  A stale "no news" is worse than no page.
- **FC Wezel Sport** ([wezelsport.be](https://www.wezelsport.be/)) — Derde Afdeling VV B. Publishes
  a report on essentially every fixture, in a plain, workmanlike register:
  "*De wedstrijden volgen elkaar snel op en ook vandaag stond er voor Wezel Sport een nieuwe
  wedstrijd op het programma.*" Also carries a **Provinciaal nieuws** feed — news about the league,
  not just about themselves.
- **FC Esperanza Pelt** ([esperanzapelt.be](https://www.esperanzapelt.be/)) — Derde Afdeling VV B.
  The most complete youth-governance shelf found: Scouting, **Reva Training** (rehab),
  **Spelersraad**, **Ouderraad**, **Studiebegeleiding**, gedragscodes, Panathlonverklaring, Fair
  Play charter, **Club-API**, sportpremies. Plus a **Referee Youth Academy** recruitment drive and a
  "Gladiator Challenge". Match-report voice: "*Na twee veelbelovende oefenwedstrijden tegen Hades en
  Termien, telkens geëindigd op 2-2, begon Pelt aan zijn eerste opdracht in de beker van Belgie…*"
- **K. Achel VV** ([achelvv.be](https://www.achelvv.be/)) — Derde Afdeling VV B. Two lovely ideas:
  a **Matchcenter** as a single nav destination, and **"Verslag van vruger"** — an archive of old
  match reports whose *title is written in dialect*. Also **Vacatures**, **Beleidsplan**,
  **Jeugdplan**, **100 jaar Achel VV**. Tagline: "*K. Achel V.V. één grote familie!*"

### 2.4 French-speaking clubs (FFA, ex-ACFF)

The Walloon and Brussels side of this tier is **markedly weaker on the web** than the Flemish side.
I probed twenty candidate domains across Nationale 2 and 3 FFA; only three resolved
(`rfcmalmundaria.be`, `sportingbruxelles.be`, `stade-everois.be`), plus separately confirmed
`raubelfc.be`, `fcpacbuzet.be`, `rcslibramont.be`, `unionnamur.be`, `rusbinche.be`,
`rrcstockay-warfusee.be` (which does not resolve despite being cited as official). Several clubs
run on hosted platforms (**footeo**, e.g. Union Namur's `urn-m156.footeo.com`, which returned 403).

- **R. Aubel FC** ([raubelfc.be](https://raubelfc.be/)) — Nationale 3 FFA B. The best *voice* in
  French: "*Club de cœur, club de village. Le Royal Aubel FC, c'est le sport, la passion et l'esprit
  d'équipe au quotidien.*" And a news item that models exactly how a volunteer club should talk
  about its volunteers: "*Hier soir, le club organisait un petit souper pour mettre à l'honneur ceux
  qui font vivre le club au quotidien.*" Also: "*le football est bien plus qu'un sport. C'est un lien
  intergénérationnel, un ancrage local fort et une passion partagée.*" No match reports, no ticket
  prices, no volunteer call, no youth recruitment.
- **FC PAC Buzet** ([fcpacbuzet.be](https://www.fcpacbuzet.be/)) — Nationale 3 FFA A. Contains the
  single best transferable *idea* in the French-speaking sample: **"Voulez-vous alléger le prix de
  votre cotisation ? Venez avec un sponsor"** — recruit a sponsor, reduce your own membership fee.
  Also notable for a very blunt operational register:
  "*RAPPEL IMPORTANT ! LES PACKS EQUIPEMENTS NE SONT COMMANDES QU'APRES VERSEMENT DES 100 €*", and
  for publishing **secretariat office hours** for transfers and affiliations as a homepage section.
  Nav includes **HORAIRES D'ENTRAINEMENTS 2026-2027** and **TERRAINS** as named items, and the
  homepage carries a weather widget and the 2025 smoking ban notice.
- **RCS Libramontois** ([rcslibramont.be](https://www.rcslibramont.be/)) — Nationale 3 FFA B. The
  best single sentence about volunteers found in either language:
  **"Les bénévoles ne demandent rien mais ils donnent tout. Offrez-leur ce qu'ils méritent :
  respect, gratitude et reconnaissance."** Placed as homepage section 2, above the transfer news.
  Weakness: the match/standings widget renders "*momentanément indisponibles*" — the club's live
  data is simply broken on the homepage.
- **RUS Binche** ([rusbinche.be](https://www.rusbinche.be/)) — Nationale 2 FFA. Rallying cry
  "*Forts comme un lion, Allez l'Union!*" An **Infos** menu carrying cotisations, **repas VIP**,
  documents, règlement intérieur; 30+ teams; a **pre-registration form on the homepage**; a
  **live stream** link under Le club; and a *Presse* category separating outside coverage from club
  news. Quoted from a player interview: "*Il faut que le public suive.*"
- **Sporting Bruxelles** ([sportingbruxelles.be](https://sportingbruxelles.be/)) — Nationale 3 FFA A.
  The most aggressive youth recruitment in the sample, and it works because it is mechanical:
  "*Tu es né en 2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020 2021 et 2022 ? Rejoins
  le Sporting Bruxelles et participe aux tests !*" — birth years spelled out so a parent can scan
  for their child's. **S'inscrire au club** is a nav item; **Objectifs 2029** is a published
  ambition; **E-Sport** and **Educa-foot (Ecole des Devoirs)** — a homework school — are nav
  concepts. Note they run a newsletter signup; we do not and should not.
- **Stade Everois RC** ([stade-everois.be](https://www.stade-everois.be/)) — Nationale 3 FFA A.
  **"Le mot du Président…"** is the first item under Le club — a personal address from the chairman
  as a permanent, top-of-nav page. Tagline "*Ensemble pour être meilleurs…*". Camp copy signed by
  the staff collectively: "*Vous trouverez, en annexe, toutes les informations par rapport à nos
  stages d'été. Si vous souhaitez passer un chouette moment, n'hésitez pas à vous inscrire. Le
  Staff*". Also carries **Younited Belgium** (football for people in social exclusion) as a team.
- **Union Namur** ([unionnamur.be](https://www.unionnamur.be/)) — Nationale 2 FFA. Entire homepage
  given over to the **Blackbirds Academy** youth intake and summer camp:
  "*Rejoins l'Ecole des Jeunes de l'UR Namur pour la saison prochaine!*",
  "*Offrez à vos enfants (4 à 16 ans) une semaine sportive ultra complète*". Nav has an explicit
  **SE PROPOSER → Test U23/Réserve Nationale** — a channel for players to offer *themselves*, which
  no Flemish club in this sample provides. Also **Bénévole** as a named page under Le club. But: no
  results, no standings, no sponsors, no reports on the homepage in mid-August.
- **RFC Malmundaria 1904** ([rfcmalmundaria.be](https://rfcmalmundaria.be/)) — Nationale 3 FFA B.
  Four nav items total. "*le RFC Malmundara est bien plus qu'un simple club de football*" — with the
  club's own name misspelled in its own about text. Contact is a **personal Gmail address**.

---

## 3. Who is beating us, and at what

An honest scoreboard. "Ahead" means they ship something we do not; "behind" means we ship it better.

| Area | Who is ahead of us | What they have that we don't |
| --- | --- | --- |
| **Cancellations / afgelastingen** | Zwevegem Sport, KFC Turnhout, Tempo Overijse | A destination for "is it on this weekend?" We have nothing. |
| **Volunteer recruitment** | City Pirates, KSV Rumbeke, K. Achel VV | Named open roles with a named human. We have a form dropdown. |
| **Sponsor commercials** | KSV Oudenaarde, KRC Mechelen, KM Torhout | Published prices and package contents. We publish a logo wall. |
| **Ticket / entry prices** | KM Torhout | A full price table per category with a named checkout. |
| **Complaints & integrity** | KM Torhout, Blankenberge, Esperanza Pelt, Racing Mechelen | A findable ombudsdienst/API page with faces and mobile numbers. |
| **Match previews** | KSV Oudenaarde | A bylined, argued preview per fixture — we have the *content type* but need the habit. |
| **Interviews** | Tempo Overijse | A running player-interview series with the player's own words as the headline. |
| **Club paper** | KM Torhout | A per-matchday digital krantje with an archive. |
| **Supporter economics** | KFC Turnhout | Away-bus prices, supporters' club fee, booking contact — all published. |
| **Health & injury content** | KSV Rumbeke | Parent-facing injury-prevention and growth-pain material. |
| **Capital fundraising** | KSV Rumbeke | A €160,000 bond issue with a public ledger. |
| **Passive fundraising** | Wambeek-Ternat, Tempo Overijse | Trooper affiliate funding as a nav item. |
| **Fee reduction lever** | FC PAC Buzet | "Bring a sponsor, pay less membership." |
| **Player self-nomination** | Union Namur | "SE PROPOSER" — a channel for players to offer themselves. |
| **URL legibility** | KM Torhout | Fixture names in the path instead of an opaque numeric id. |

| Area | We are ahead | Why |
| --- | --- | --- |
| **Match detail** | Nobody in this tier is close | Lineups, goal events, cards, a matchday standings snapshot and a linked preview/recap. Torhout's match page is a scoreline and a table; Rumbeke's route is still called `wedstrijd-detail-test.asp`. |
| **Youth as first-class data** | Only Oudenaarde attempts it | Full PSD sync with squads, fixtures, tables and per-player statistics for **every** team U6–U21. |
| **Player and staff profiles** | Comprehensively | No club in this sample ships a real player profile page with season statistics. |
| **Practical matchday info** | Ahead of Sporting Hasselt, Rumbeke, and most others | Parking, an entry-price table, kantine hours and accessibility all on `/club/contact`. Hasselt's page titled "Info" has none of it. |
| **Search** | Nobody has it | Not one club in this research shipped site search. Ninove has a search box; no results surface reachable. |
| **Calendar export** | Nobody has it | Our `.ics` feed has no equivalent anywhere in the tier. |
| **Opponent history** | Nobody has it | `/tegenstander/[clubId]` is unique. |
| **Freshness** | Ahead of Ninove, Turnhout, Torhout's sponsor page | Ninove still shows 2025-2026; Turnhout's cancellation notice is timestamped 2022; Torhout's sponsoring page says 2023-2024. |
| **Basic web hygiene** | Ahead of Berchem Sport and Gullegem | Two clubs in our own series serve invalid TLS certificates. |
| **Design** | Ahead of everyone in the tier | Not assessed here — separate agent — but nothing in this sample is authored rather than themed. |

---

## 4. Tier patterns

### What almost everyone does

- **Homepage = last result → next fixture → news → standings → sponsor wall.** Near-universal, in
  that order, with the sponsor wall always last (Thes Sport, Rupel Boom, Torhout, Oudenaarde,
  Zwevegem, Ninove).
- **Bovenbouw / Middenbouw / Onderbouw** youth grouping (Rumbeke, Blankenberge, Achel).
- **ProSoccerData as the parent-facing system of record**, linked from the nav as "Uw ProSoccerData"
  / "PSD Login" / a club subdomain (Racing Mechelen, Tempo, Wambeek-Ternat, Torhout, Oudenaarde,
  Esperanza Pelt, Blankenberge). Clubs routinely say "*volg de communicatie via PSD*" instead of
  publishing on their own site — which is precisely why their sites feel thin.
- **A webshop**, almost always third-party (JOMA, Misterfoot, a `webshop.` subdomain).
- **A compliance shelf**: Sportongeval, Huishoudelijk reglement, Panathlonverklaring, Fair Play
  charter, Club-API, Missie & Visie. Present at maybe half the clubs, always as PDF links.
- **G-voetbal and Wandelvoetbal 55+** as named teams (Ieper, Turnhout, Thes, Avanti Stekene,
  Torhout, Rumbeke, Blankenberge).
- **The "méér dan" cliché.** Sporting Hasselt: "*méér dan een ploeg*". Olsa Brakel: "*méér dan
  voetbal alleen*". Malmundaria: "*bien plus qu'un simple club de football*". Aubel: "*bien plus
  qu'un sport*". **Our brand rule forbidding "meer dan een club" is correct and is a genuine
  differentiator** — it is the single most-used sentence shape in the tier.

### What nobody does — our opportunity

1. **Site search.** Zero clubs. Ours already exists; almost nobody in Belgian amateur football can
   answer "where is the U13 schedule" without menu archaeology.
2. **A calendar subscription.** Zero clubs offer `.ics`. Every parent in this tier is retyping
   fixture dates into a phone.
3. **A real player profile.** Zero clubs. Squad lists are photo grids with names.
4. **Anything about the away ground.** Every club explains how to reach *their* pitch (some barely).
   **Not one explains how to reach the opponent's.** The person who most needs directions on a
   Sunday morning is the parent driving to Sint-Denijs, and no club in Belgium serves them.
   We already have `/tegenstander/[clubId]` and PSD fixture data — this is a short step.
5. **Man van de match / player ratings.** Turnhout's supporters' club votes for "awards", but no
   club runs a per-match man of the match on its site. A named, free, weekly ritual nobody owns.
6. **Kantine opening hours.** Sponsor packages *sell* the kantine; nobody publishes when it is open.
   Tempo's Club98 page literally says the calendar is coming soon. (We already publish hours.)
7. **A pre-season empty state.** Thes Sport and Torhout both render league tables of all-zeroes in
   August because nobody designed for "the season hasn't started". Worth checking ours.
8. **Structured event sign-up.** Every club lists an eetfestijn or a tornooi; none lets you register
   or shows a price on the index. Rumbeke's five events have neither.
9. **Referee recruitment.** Only Esperanza Pelt runs anything (a Referee Youth Academy). Clubs are
   fined for referee shortfalls and none of them recruits on their own site. We already carry
   "scheidsrechter" in the membership form — we could own this outright.
10. **Match reports for youth teams.** Only Oudenaarde does it, once. Our PRODUCT principle that
    youth is first-class has no competitor in the tier.

---

## 5. Dutch vs French-speaking tone of voice

Both languages share the same trap — the "more than a club" formula — but they fail and succeed
differently.

**Dutch (VV) is operational, plural, and unsigned.** The subject is usually the club or its
colours, not a person. Racing Mechelen: "*Het was een te zwaar verdict voor **groen-wit**, dat de
kansen ditmaal niet kon afwerken en het deksel op de neus kreeg*" — an idiom, a colour-name
self-reference, and no byline. Wezel Sport's reports are flatly procedural:
"*De wedstrijden volgen elkaar snel op en ook vandaag stond er voor Wezel Sport een nieuwe wedstrijd
op het programma.*" The Dutch clubs are better at *logistics* copy — Turnhout's FAQ questions are
written in the first person of the confused parent ("*Ik vind de planning niet*",
"*Ik moet mijn lidgeld/contributie nog betalen maar ik weet niet hoe?*"), which is the single
warmest UX-writing move in the whole sample. Slogans are compound and communal: "*SAMEN STERK*"
(Ninove), "*Samen Sterker, Samen Winnen!*" (Zwevegem), "*één grote familie!*" (Achel),
"*Voetbal voor iedereen, elk op zijn of haar niveau!*" (Wambeek-Ternat).

**French (FFA) is affectionate, second-person, and signed.** It addresses *you*, and often *tu*.
Sporting Bruxelles speaks straight to the child: "*Tu es né en 2009 … ? **Rejoins** le Sporting
Bruxelles et participe aux tests !*" Union Namur: "*Rejoins l'Ecole des Jeunes de l'UR Namur pour la
saison prochaine!*" and "*Offrez à vos enfants (4 à 16 ans) une semaine sportive ultra complète*".
Stade Everois signs off collectively and casually: "*Si vous souhaitez passer un chouette moment,
n'hésitez pas à vous inscrire. **Le Staff***" — and gives the chairman a permanent
"*Le mot du Président…*" page, a personal-address convention with no Flemish equivalent in this
sample.

The French side is also far better at **honouring people**, which is the emotional core of a
volunteer club:

- RCS Libramontois: "*Les bénévoles ne demandent rien mais ils donnent tout. Offrez-leur ce qu'ils
  méritent : respect, gratitude et reconnaissance.*"
- R. Aubel FC: "*Hier soir, le club organisait un petit souper pour mettre à l'honneur ceux qui font
  vivre le club au quotidien.*"
- R. Aubel FC: "*Club de cœur, club de village.*"

And it is blunter about money and admin, in a way that reads as trust rather than rudeness:
FC PAC Buzet's "*RAPPEL IMPORTANT ! LES PACKS EQUIPEMENTS NE SONT COMMANDES QU'APRES VERSEMENT DES
100 €*" and "*Voulez-vous alléger le prix de votre cotisation ? Venez avec un sponsor*".

**For KCVV:** our Dutch register should keep the tier's operational plainness — it suits "plezante
compagnie" better than corporate warmth — but borrow two French moves. First, **address the reader
directly** in recruitment and practical copy, the way Turnhout's FAQ already does in Dutch.
Second, **thank people by name and in public**; nothing in the Flemish sample matches Libramont's
sentence, and it costs nothing to write.

---

## 6. Recommendations

### Adopt

| # | What | Why it fits KCVV | Effort | Source |
| --- | --- | --- | --- | --- |
| A1 | **`/afgelastingen`** — a cancellations page: current status per group (jeugd / senioren), a link to the federation's official list, a local weather link, and a timestamp on every entry. Show "geen afgelastingen" with *today's* date, never a stale one. | Youth parents are a co-equal primary audience; this is the highest-frequency winter question and we answer it nowhere. | **S** | [zwevegemsport.be](https://zwevegemsport.be/), [kfcturnhout.be/afgelastingen](https://www.kfcturnhout.be/afgelastingen), [tempo-overijse.be/afgelastingen](https://www.tempo-overijse.be/afgelastingen/) |
| A2 | **Named volunteer vacancies** on `/club/vrijwilliger` — each role with a one-line description, a rough time commitment, and a named person with an email. Keep the existing form as the fallback. | "Recruit players and volunteers" is success criterion #1 and we currently offer a dropdown value where City Pirates offers ten jobs and a phone number. | **S** | [citypirates.be](https://citypirates.be/vrijwilligers/aanmelden-als-vrijwilliger/), [ksvrumbeke.be/vacatures](https://www.ksvrumbeke.be/vacatures) |
| A3 | **Sponsor packages with prices** on `/sponsors` — matchbal, boarding per metre, wedstrijdsponsor, with what each includes. | "Deliver sponsor value" is success criterion #2, and PRODUCT.md already commits sponsors to real estate rather than decoration. A rate card converts; a logo wall does not. | **S–M** | [ksvoudenaarde.be](https://ksvoudenaarde.be/business/sponsoringsmogelijkheden-en-tarieven), [racingmechelen.be](https://www.racingmechelen.be/) |
| A4 | **An `/hulp` FAQ layer in the parent's own words** — reuse the existing `qaBlock` schema and the HulpFinder, adding Turnhout's nine questions verbatim in shape: "Ik vind de kalender niet", "Ik moet nog lidgeld betalen", "Zijn er afgelastingen?", "Ik wil kledij bijbestellen". | We have the CMS block and the who-is-who; we are missing the *question-shaped* entry point. Aligns with the "less-digital visitors" accessibility commitment. | **S** | [kfcturnhout.be/faq](https://www.kfcturnhout.be/faq) |
| A5 | **A findable ombudsdienst / API page** with two named vertrouwenspersonen, e-mail *and* mobile, the escalation order (coach → coördinator → ombudsdienst) and a confidentiality promise. | We already model "API (Aanspreekpunt Integriteit)" in the organigram and `/hulp`; what is missing is the page that tells an unhappy parent the procedure. It is also a Voetbal Vlaanderen expectation. | **S** | [kmtorhout.be/ombudsdienst](https://www.kmtorhout.be/ombudsdienst) |
| A6 | **Per-mutualiteit reimbursement page** naming CM, Solidaris, Helan, Liberale Mutualiteit and Vlaams Neutraal Ziekenfonds, each with its form, plus where to hand it in and when to collect it. | `/hulp` already has a path summarised "*Voor de mutualiteit of de belastingen*"; this turns a signpost into an answer. | **S** | [kmtorhout.be/terugbetalingen-ziekenfonds](https://www.kmtorhout.be/terugbetalingen-ziekenfonds) |
| A7 | **Trooper.** One page, one link, recurring passive income. | Two clubs at our exact level already fund themselves this way. No newsletter, no signup, no ongoing work. | **S** | [trooper.be/tempo](http://www.trooper.be/tempo), [kfcwambeekternat.be](https://kfcwambeekternat.be/) |
| A8 | **Human-readable match URLs** — `/wedstrijd/2026-2027/kcvv-elewijt-ksv-rumbeke~<id>`, with permanent redirects from the numeric form. | Match URLs are the most-shared links we have (WhatsApp groups, Facebook). An opaque number tells the recipient nothing before they tap. | **M** | [kmtorhout.be](https://www.kmtorhout.be/ploegen/kmt-a/wedstrijden/2026-2027/KM-Torhout-RC-Gent~69a12f7f-bd75-40b6-a2ba-7e91ef9437e8) |

### Adapt

| # | What | How to adapt it | Effort | Source |
| --- | --- | --- | --- | --- |
| B1 | **The bylined match preview.** Oudenaarde's is a real argument with the opponent's form table. | We already have the `matchPreview` article type wired to `matchId` and surfaced by `<MatchArticleLinkCard>` — the gap is editorial habit, not code. Add a lightweight authoring template in Sanity (stakes / vorm / de tegenstander / hoe laat en waar) so a volunteer can fill it in twenty minutes, and auto-fill the opponent's record from PSD rather than making the author type it. | **M** | [ksvoudenaarde.be](https://ksvoudenaarde.be/teams/a-kern/voorbeschouwing/wedstrijd-7615) |
| B2 | **"Hoe geraak je er?" for away games.** Nobody in the tier does this. | Extend `/tegenstander/[clubId]` (or the match page) with the away ground's address, a maps link and parking notes, sourced once per opponent and reused every season. Fifteen opponents per season is a finite, one-off data-entry job. | **M** | Gap — no source; nearest is [zwevegemsport.be](https://zwevegemsport.be/) "Ligging terreinen" for their *own* ground |
| B3 | **Tournaments and stages as a content shape**, with a live public bracket. | Oudenaarde and Tempo both embed Tournify. Rather than build a bracket, treat *tornooi* as an event subtype on `/evenementen` that can carry an external live-bracket link, a schedule PDF and a price. | **M** | [tournifyapp.com/live/ksvo-patrick-cup-2026](https://tournifyapp.com/live/ksvo-patrick-cup-2026), [ksvrumbeke.be/events](https://www.ksvrumbeke.be/events) |
| B4 | **A club krantje.** Torhout publishes one per matchday via Microsoft Sway. | We should not add a publishing pipeline. Adapt it as a *recurring article format* — "Het Elewijtse Blaadje", one per matchday, mixing the preview, a squad note, the kantine menu and a volunteer thank-you — using the article types we already have. Archive is just the news filter. | **M** | [kmtorhout.be/km-krantjes](https://www.kmtorhout.be/km-krantjes) |
| B5 | **A player interview series.** Tempo runs three a month with the player's own quote as the headline. | We already have an `interview` article type with portraits and Q&A. Adapt the *cadence and headline convention*: "Maak kennis met X: '<quote>'". This is the cheapest way to make an amateur squad feel like people. | **S** | [tempo-overijse.be](https://www.tempo-overijse.be/2026/07/14/maak-kennis-met-ali-srihi-ik-ben-een-echte-teamspeler-die-het-verschil-wil-maken/) |
| B6 | **"Breng een sponsor mee en betaal minder lidgeld."** | Buzet's version is a one-line offer. Adapt into a proper page under `/club`: what counts, how much comes off, who to tell. This turns 400 youth parents into a sales force, which is the only realistic way an amateur club grows sponsor income. Needs a board decision on the discount, not code. | **S** (page) | [fcpacbuzet.be](https://www.fcpacbuzet.be/) |
| B7 | **Public thanks, by name.** Libramont's volunteer sentence; Aubel's souper write-up. | Adapt as a standing editorial commitment rather than a feature: after every home game, name the people who did the kantine, the lines and the gate. Fits "plezante compagnie" precisely and needs no imagery, which matters given we have no current photography. | **S** | [rcslibramont.be](https://www.rcslibramont.be/), [raubelfc.be](https://raubelfc.be/) |
| B8 | **Man van de match.** Nobody in the tier runs one. | Adapt cautiously: a *manually chosen* man of the match named in the recap article and on the match page, not a voting widget. Avoid anything requiring accounts, which PRODUCT.md rules out. **Do not extend it to youth matches** — the youth privacy constraints make singling out a nine-year-old a poor idea. | **M** | Gap — nearest is [kfcturnhout.be/fan/de-daaiherten](https://www.kfcturnhout.be/fan/lidgeld-en-busreizen) supporter awards |
| B9 | **A parent-facing health shelf.** Rumbeke's blessurepreventie and groeipijnen content. | Do not write medical content ourselves. Adapt as a short curated links page under `/club` pointing at Sport Vlaanderen / Gezond Sporten, plus our own sportongeval procedure. Credibility without liability. | **S** | [ksvrumbeke.be/blessurepreventie](https://www.ksvrumbeke.be/blessurepreventie) |
| B10 | **A pre-season empty state for standings.** Thes Sport and Torhout both ship all-zero tables in August. | Not a feature to copy — a bug to avoid. Verify `<TeamStandings>` renders a deliberate "de competitie start op 22 augustus" state rather than a table of zeroes. | **S** | [thes-sport.be](https://www.thes-sport.be/), [kmtorhout.be](https://www.kmtorhout.be/) |
| B11 | **Referee recruitment as its own pitch.** Only Esperanza Pelt attempts it. | We already accept "scheidsrechter" in the membership form. Adapt into a short page explaining what an internal ref actually does, the time cost, and that the club pays for the course. An unclaimed position in the entire tier. | **S** | [esperanzapelt.be](https://www.esperanzapelt.be/) |

### Reject

| # | What | Why we should not |
| --- | --- | --- |
| R1 | **"Méér dan een club / méér dan voetbal alleen."** Ubiquitous — Sporting Hasselt, Olsa Brakel, Malmundaria, Aubel. | Already forbidden by our brand commitments, and this research confirms the ban is a competitive advantage rather than a constraint. "Er is maar één plezante compagnie" is the only tagline. |
| R2 | **Newsletter signup.** Sporting Hasselt, Racing Mechelen, Sporting Bruxelles all run one. | Explicitly out of scope in PRODUCT.md. Do not propose it in any form. |
| R3 | **A ticketing account system.** Sporting Hasselt's entire FAQ is Roboticket support. | We have no ticket sales and no accounts. Adopting this would import six support questions and answer none of our own. |
| R4 | **Instagram / Facebook embeds on the homepage.** Sporting Hasselt embeds 15 posts; Thes Sport, Buzet and Binche embed feeds. | Heavy, slow, third-party, and it fails the "phone in daylight on a weak connection" requirement. PRODUCT.md also rules out designing as if displacing social media were a goal. Link out; do not embed. |
| R5 | **A club podcast** (Rupel Boom). | Interesting, but a sustained audio production commitment for a volunteer club with no current photographer. If anything, do B5 (written interviews) first and revisit. |
| R6 | **Publishing per-article view counts** (Racing Mechelen). | Tempting as a credibility signal, but our numbers are small and PRODUCT.md forbids engagement figures we cannot stand behind. A low number is worse than no number. |
| R7 | **Iframe-embedded recruitment pages** (Tempo Overijse's "Wil je voetballen bij TEMPO Overijse?"). | Renders nothing to crawlers, breaks on phones, and buries the single most important conversion page on the site. A cautionary example, not a pattern. |
| R8 | **A `/vacatures` page that dead-ends in PDFs** (City Pirates) or in the secretary's mobile (Rumbeke). | Adopt the *named roles* (A2), reject the delivery. We already have a routed membership/volunteer form; keep it as the terminating action. |
| R9 | **G-voetbal and Wandelvoetbal pages.** Common in the tier (Ieper, Turnhout, Torhout, Thes, Rumbeke). | Only if the club actually runs these teams. PRODUCT.md's rule to render only what the data provides applies to club structure too — do not build a section for a team that does not exist. |
| R10 | **A "Het Boek" / merchandise shelf** (Ninove's club history book, Turnhout's KFCT GIN). | Charming, but we have no shop and PRODUCT.md rules one out. If the club produces such things, they belong in `/evenementen` or a news item, not as a commerce surface. |

---

## 7. Open questions for Kevin

1. **Afgelastingen — who decides and how fast?** The feature is only worth building if someone will
   actually update it on a frosty Saturday at 8am. Is that a board role, or should the page simply
   frame the federation's list plus a "volg PSD" instruction, as Turnhout and Tempo do?
2. **Are we willing to publish sponsor prices?** Oudenaarde's rate card is the strongest single
   commercial artefact in the tier, but publishing prices removes negotiating room. Board call.
3. **"Breng een sponsor, betaal minder lidgeld" — is there an appetite?** This needs a number
   (percentage or fixed) and a board decision before a page can exist.
4. **Do we have named vertrouwenspersonen / API today?** The organigram has an API node; is there a
   real person with a mobile number who has agreed to be published, and is there a second so a
   parent has a choice of who to approach?
5. **Man van de match — seniors only?** I would not run this for youth given our privacy
   constraints, but confirm the club agrees before it gets built for A and then requested for U15.
6. **Away-ground directions: who owns the data?** Fifteen opponents per season, addresses and
   parking notes. Is that a one-off volunteer job someone will actually do, and where should it
   live — Sanity per opponent, or a static table keyed on PSD club id?
7. **Is a matchday krantje realistic?** Torhout ships one per home game. Ours would need one
   volunteer writing ~500 words a fortnight. Does that person exist, or should we settle for B1
   (preview) and B5 (interviews) as the sustainable version?
8. **Referee recruitment — does the club pay for the course?** The page only works if we can state
   the offer concretely.
9. **Should `/hulp` absorb an FAQ, or should the FAQ be its own route?** `/hulp` today is who-is-who;
   Turnhout's model is question-first. These may want to be two entry points into the same content.
10. **Do we care about `llms.txt` drift here?** Nothing in this research changes our routes, but if
    A1/A2/A5 ship, `apps/web/public/llms.txt` will need the new paths added — per CLAUDE.md that is
    a required deliverable, not cleanup.

---

## Appendix — sites that could not be read

Stated explicitly rather than guessed at:

- **hoogstratenvv.be** and **kacbetekom.be** — both served a Cloudflare block page for
  `footballassist.com`, the white-label platform behind them. Not readable.
- **kfcnijlen.be** — behind a Vercel Security Checkpoint; returned HTTP 403 to WebFetch and a JS
  challenge to curl. Not readable. (Notable in passing: an Astro-on-Vercel build at this level.)
- **lyra-lierse.be** — `ECONNRESET` on two attempts. Not readable.
- **ksvtemse.be** — 301-redirects off-host to `sporting.be`. Not followed.
- **kfcduffel.be** — TLS chain error (`unable to get local issuer certificate`). Not readable.
- **berchem-sport.be**, **fcgullegem.be** — self-signed certificates; reachable only with
  verification disabled, which is itself the finding.
- **urn-m156.footeo.com** (Union Namur's footeo mirror) — HTTP 403.
- **rrcstockay-warfusee.be**, **ruwciney.be** (HTTP 520) — did not resolve or did not serve.
- **Sixteen further FFA candidate domains** probed and non-resolving: rrcmormont.be, rfcsprimont.be,
  rcsverlaine.be, stadewaremmien.be, rfcmessancy.be, etoile-elsautoise.be, rus-biesme.be,
  rfcmolenbaix.be, soigniessports.be, rleopoldfc.be, rfcsaintmichel.be, nechin.be, rasmonceau.be,
  arquetfc.be, unionrochefortoise.be, rjrochefortoise.be.
