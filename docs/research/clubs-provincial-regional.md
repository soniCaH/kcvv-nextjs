# Competitor research — provincial & regional clubs

**Tier owned by this document:** (a) KCVV Elewijt's literal neighbours and local rivals in Zemst and the
Mechelen–Vilvoorde–Kampenhout–Grimbergen belt, and (b) provincial clubs anywhere in Belgium whose sites
are notably good or notably characterful.

**Sibling documents** cover the other tiers (national/pro clubs, non-football references, own-site inventory).
Do not read this file as a complete competitive picture.

**Method.** 24 clubs opened; homepage plus 2–4 interior pages wherever the site allowed it. Where a site was
unreadable (TLS misconfiguration, bot block, dead domain) that is recorded as-is and no content is inferred.
All Dutch/French copy is quoted verbatim from the page it is attributed to.

**Gap discipline.** Every recommendation below was checked against our current route tree
(`apps/web/src/app/`), `apps/web/PRODUCT.md` and `apps/web/public/llms.txt`. We already ship: news, calendar
+ ICS, match detail with lineups/events/standings, team and youth pages, player and staff profiles, opponent
pages, events, galleries, sponsor overview, club pages (history, board, youth board, Angels, Ultras, contact,
membership form, practical info), help/who-is-who, search, share cards. Nothing on that list is proposed as new.

---

## 1. Executive summary — top 8, ranked by impact ÷ effort

| # | Recommendation | Why it wins | Effort |
|---|---|---|---|
| 1 | **Ship a real `/club/kantine` + terrein/parking page** — opening rule, payment methods, which pitch, where to park, what it costs to get in | Every neighbour has fragments of this; nobody has it in one place. It is the single most-asked matchday question and we ship none of it. ([KSCW Hofstade](https://www.kscwhofstade.be/over-ons/kantine), [KFC Nijlen](https://nijlen.voetbalassist.be/206/locatie-en-accomodatie/), [Sporting Kampenhout](https://www.sportingkampenhout.be/club/ticketing/)) | S |
| 2 | **Publish the sponsor rate card** — board positions with prices, shirt sponsoring per team format, match-ball sponsor, named zones | KV Bonheiden publishes exact euro amounts per board position. We have a sponsor *gallery*; they have a sponsor *offer*. Directly serves the "deliver sponsor value" success criterion. ([KV Bonheiden](https://www.kvbonheiden.be/business/)) | S–M |
| 3 | **Write the FAQ we don't have** — and answer it honestly, including the awkward ones | KSCW Hofstade's FAQ answers "can my son join?" with "only where there is room", and answers "do you do UiTPAS/kansentarief?" with a flat "Nee." That honesty is more persuasive than any brochure copy. ([KSCW Hofstade FAQ](https://www.kscwhofstade.be/contact/faq)) | S |
| 4 | **Adopt the village register in section headings** — our own Elewijt/Zemst idiom, not generic Dutch | KV Bonheiden heads its homepage news block *"Niefs, veu baa de kaffe"* and its events block *"Braa veul te doen baa ons"*, and welcomes you with *"Welkom bij Bênaa."* This is the one thing a pro club can never do and we currently don't do either. ([KV Bonheiden](https://www.kvbonheiden.be/)) | S |
| 5 | **A volunteer surface: open roles + a helpers list** | Kontich has a live `helperslijst`; Muizen posts *"Penningmeester gezocht"* as news; Nijlen has a `vacature` page and an `event-team`. Recruiting volunteers is success criterion #1 and we have no route for it. ([Kontich](https://www.kkontichfc.be/), [Muizen](https://www.kfcmuizen.be/sitemap), [Nijlen](https://nijlen.voetbalassist.be/)) | S–M |
| 6 | **An "afgelastingen" state that the site can actually show** | Eizeringen dedicates a season-level nav item to it (though it is an empty iframe); nobody in this tier does it well. Our PSD sync means we could show a per-match cancelled/postponed state where every neighbour shows a Facebook post. ([Sporting Eizeringen](https://www.sporting-eizeringen.be/seizoen/afgelastingen/)) | M |
| 7 | **A parents' charter on the youth pages** | Nijlen: *"GEEN COACHING - WEL AANMOEDIGEN - BLIJF POSITIEF!"*; Kampenhout splits conduct rules into spelers / ouders / veiligheid. Youth parents are a co-equal primary audience and we publish nothing addressed to them as parents. ([Nijlen](https://nijlen.voetbalassist.be/238/rol-van-de-ouders/), [Kampenhout](https://www.sportingkampenhout.be/club/intern-reglement/gedragsregels-ouders/)) | S |
| 8 | **Honour the club's people: oud-spelers, jubilarissen, in memoriam** | KFC Katelijne keeps a "Verdienstelijke Speler" archive with photos and milestone stories, and publishes obituaries in a club voice: *"Alain was meer dan een trainer, hij was een (h)echte clubman."* We have player profiles for the *current* squad only. ([KFC Katelijne](https://www.kfckatelijne.be/historiek/verdienstelijke-spelers-en-oud-spelers-kfck.html), [nieuws](https://www.kfckatelijne.be/nieuws/)) | M |

---

## 2. The neighbourhood — club by club

Verdict key: **real site** = purpose-built, maintained, more than a shell · **template** = recognisable
platform with stock IA · **Facebook-only / unreadable** · **dead**.

### Zemst (our own municipality)

**KFC Eppegem** — <https://www.kfceppegem.be/> — **real site**
Clean, custom, static-feeling site (`kalender.html`, `ploeg.html?team=a`, `feestzaal.html`). Header reads
*"KFC EPPEGEM - sinds 1947"*. Homepage bands: nieuws, ploegen (A / B / Reserven with division labels),
kalender, **feestzaal**, sponsors. The feestzaal band is the most developed thing on the site —
*"Op zoek naar de perfecte locatie voor je volgende evenement?"* and *"Professionele keuken - onze
faciliteiten zorgen ervoor dat elk gerecht perfect wordt bereid, of je nu kiest voor een buffet of een
sit-down diner."* ([feestzaal](https://www.kfceppegem.be/feestzaal.html)) — but with no prices, no capacity
and no booking flow, only `info@kfceppegem.be`.
**The finding that matters:** the news page is empty. Verbatim: *"Er staan momenteel geen berichten op de
site."* followed by *"Kom later nog eens terug, of volg ons op Facebook voor het laatste nieuws."*
([nieuws](https://www.kfceppegem.be/nieuws.html)). Our closest genuine rival has a good-looking site with
zero editorial in it and an explicit hand-off to Facebook.

**FC Zemst Sportief** — <https://www.fczemst.be/> — **real site**
Custom PHP build (credited to DMS Design). Nav: Club (Contact / Organisatie / Missie en visie / Historiek),
Ploegen (Senioren / Bovenbouw / Middenbouw / Onderbouw / Dames), Activiteiten, Formulieren (Contactformulier,
Spelersfiche, Ongevalformulier, Documenten), Inschrijven, Webshop. Same Bovenbouw/Middenbouw/Onderbouw
vocabulary we use.
**Voice:** tagline *"Da's tof sjotten!"* and the recruitment line *"Interesse om te komen sjotten bij FC
Zemst. Schrijf je dan snel in via het inschrijvingsformulier."* — dialect verb ("sjotten") used as the
club's whole positioning. Kaas & Wijn listed under Activiteiten.
Deep links are not stable to fetch (`/club`, `/activiteiten` both 404 from outside), so interior depth is
unverified.

**FC Verbroedering Hofstade** — <https://www.fchofstade.be/> — **real site (stale)**
WordPress, built by Luyten.Website. Nav: Club (Bestuur, Historiek, Lidgeld), Senioren (A-Kern, B-Kern),
Jeugd (U17→U5/Voetbalspeeltuin, **G Ploeg**, Veteranen), Partners, Events & Media (Evenementen, Foto's,
Video's), Contact. Homepage is a blog index with a WordPress sidebar (Recente berichten / Archieven /
Categorieën) — the default theme furniture is still visible.
**Voice, and it's good:** *"Dus als het water je in de mond komt bij de gedachte aan een lekkere portie
mosselen, een lekker visje, een vol-au-vent of je gewoon geen zin hebt om af te wassen: één adres:
Gasthuishofweg 30!"* and *"We hebben er lang op gewacht maar eindelijk is het zover, onze eigen webshop waar
je de clubkledij kan bestellen."*
Events archive: Visfestijn (*"Je kan op beide dagen van 18 tot 22 uur terecht in onze kantine aan de
Ossebeemden"*), Steakfestijn, Paastornooi (48 ploegen), Paasstage (€160), Jeugdinitiatiedag, and a signed
KV Mechelen shirt auction. ([evenementen](https://www.fchofstade.be/evenementen/)) Most recent event entry
is April 2025 — the site is a year stale.
Also notable: the club is temporarily playing at **Galgenberg z/n, 1982 Weerde** during pitch works, and says
so on the homepage. Displacement is a real thing village clubs must communicate.

**VK Weerde** — `vkweerde.be` — **dead**
Club dissolved after the 2023/24 season; the municipality is now consulting residents on what to do with the
15 ha site. The domain no longer resolves (`ENOTFOUND`), so the site is gone entirely — not even a stale
shell. ([Ring TV](https://www.ringtv.be/samenleving/zemst-zoekt-naar-invulling-van-terreinen-vk-weerde-ideeen-van-inwoners-zijn-welkom),
[VRT NWS](https://www.vrt.be/vrtnws/nl/2025/09/02/vk-weerde-zemst-sporttereinen/), [Wikipedia](https://nl.wikipedia.org/wiki/VK_Weerde))
Worth holding onto: when a village club dies, its record dies with it. That is an argument for our history and
archive pages being *durable*, and for KCVV being the place where Zemst football memory lives.

### The Mechelen belt

**KFC Muizen** — <https://www.kfcmuizen.be/> — **template** (Webhero)
Stock builder, cookie + newsletter popups. Nav: Home, Nieuws, Over KFC, Club info, Ploegen, Kalender,
Accommodatie, Activiteiten, Documenten, Contact (with Verhuur accommodatie + Contactformulier), Partners.
**Voice:** *"Onze voetbalclub bestaat reeds sinds 1924. Nu, bijna een eeuw later, staan wij ons mannetje in
de Antwerpse provinciale reeksen."* — "staan wij ons mannetje" is exactly the modest-proud register.
**Best individual finding in the whole tier:** the Old Stars walking-football item —
*"KFC Muizen ondersteunt nu ook een wandelvoetbalclub: de Old Stars. Krasse 60-plussers die nog steeds voor
elke bal gaan."* ([artikel](https://www.kfcmuizen.be/nieuws/wandelvoetbalclub-old-stars))
Accommodatie page is unusually concrete: *"De kantine op de eerste verdieping biedt met het grote terras een
fantastisch uitzicht op de speelvelden."* / *"Er is een A-veld in natuurlijk gras en een B-veld en twee
jeugdvelden in kunstgras."* / *"Het kantinegebouw bevat modulair opgebouwde kleedkamers, voor een totaal van
12: 2 grote kleedkamers, 8 kleine kleedkamers en 2 scheidsrechterkleedkamers."* / *"een grote parking die
samen met de tennisclub gebruikt wordt."* ([accommodatie](https://www.kfcmuizen.be/accommodatie))
Documenten is a mutualiteit-attest rack: CM, Liberale, Onafhankelijk, Vlaams & Neutraal, De Voorzorg — plus
*"Aangiftes van ongevallen tijdens training of wedstrijd moeten ten laatste de 21 kalenderdagen na het
ongeval bij de Voetbalbond worden ingediend."* and the disarming *"Wij zijn genoodzaakt om lidgelden te
vragen van alle voetballende leden. Maar daar krijgen zij ook heel wat voor terug!"*
([documenten](https://www.kfcmuizen.be/documenten))
Activiteiten reads like a village year: Mosselsouper, Bingo, Sinterklaasfeest, Spaghettidag, Brunch,
Jeugdtornooi, Sportkamp, Steakdag. Also news items *"Penningmeester gezocht"* and *"KFC Muizen zoekt meisjes
die willen voetballen"*.

**KFC Katelijne** (Sint-Katelijne-Waver) — <https://www.kfckatelijne.be/> — **real site** (MODx + VSOCCER)
Dated visually, deep in content. Nav includes Club-info → **Terreinen**, **Club 99**, **Supportersraad**,
**Historiek bestuur**; Historiek → **1ste ploeg** and **Verdienstelijke Speler / oud-spelers**.
**Club 99** is a business club: *"KFC Katelijne bezit ook een business club, hier komen sponsors en vips
tesamen voor een gezellige babbel voor, tijdens en na de wedstrijd."* — and doubles as rentable space:
*"we onze kantine en club99 verhuren voor feesten, fuiven, vergaderingen enz..."*
([Club 99](https://www.kfckatelijne.be/club-info/club-99.html))
**Verdienstelijke spelers** is a photo-and-story archive of milestone celebrations, e.g. *"Op 12 december
2010 werd onze 'captain' Bjorn Goyvaerts gevierd voor zijn 250ste kompetitiewedstrijd"*.
([pagina](https://www.kfckatelijne.be/historiek/verdienstelijke-spelers-en-oud-spelers-kfck.html))
News mixes obituaries, recruitment and food: death notices for Ali Fehri (*"Wij zullen Ali blijven herinneren
als een joviaal man die steeds bereikbaar was"*) and Alain Van Releghem (*"Alain was meer dan een trainer,
hij was een (h)echte clubman"*), alongside Jeugdtrainers gezocht, Doelman gezocht, Eindeseizoens-BBQ, Darts
Cup, Match Dinner, Nieuwjaarsdrink, Milka-verkoop, Paasstage. Slogan on event material: **"ONE TEAM - ONE
FAMILY"**. ([nieuws](https://www.kfckatelijne.be/nieuws/))

**KV Bonheiden** — <https://www.kvbonheiden.be/> — **real site** — *the voice benchmark of this tier*
WordPress, modern, and the only club in the neighbourhood writing in its own dialect as a design decision.
Homepage headings, verbatim:

- **"Welkom bij Bênaa."** (the local pronunciation of Bonheiden, used as the welcome)
- **"Niefs, veu baa de kaffe"** (news block — "news, for with your coffee")
- **"Braa veul te doen baa ons"** (events block — "plenty going on at ours")
- **"Blij met onze partners"**
- **"Hoe jij mee kan bouwen aan de toekomst van KVB"**
- **"Stap per stap"** (a 1-2-3-4 how-to-join walkthrough)
- **"Nieuwe speler?"** → *"Zin om te voetballen bij KV Bonheiden?"* / *"Van eerste trap tot competitieve
  speler: iedereen is welkom."*
- A live club-scale strip: **Leden 430 · Ploegen 23 · Terreinen 3**

Sponsor model is the sharpest in the tier and is fully priced in public
([business](https://www.kvbonheiden.be/business/)):

```text
Reclamepanelen (4m x 1m, 3-jarig contract, jaarlijkse facturatie mogelijk)
  A-terrein tribunezijde      € 400 / jaar
  A-terrein achter de doelen  € 350 / jaar
  A-terrein aan de kantine    € 250 / jaar
  B-terrein                   € 300 / jaar
  Eenmalige productiekost     € 225

Shirtsponsoring jeugd (inclusief wedstrijdshirts)
  5 vs 5    € 1.150
  8 vs 8    € 1.400
  11 vs 11  € 1.600

Wedstrijdbal sponsor          € 100 per thuiswedstrijd
  — "Een toegankelijke formule voor ondernemers"

Premium: stadionnaamgeving, terreinnaamgeving, eventsponsoring,
         digitale zichtbaarheid, infrastructuurprojecten
```

Named-asset sponsorships are announced as club news: *"KV Bonheiden verwelkomt Tuinen Joos als Official
Training Zone Partner"* and *"KV Bonheiden verwelkomt People's Driving als Official Driving Partner"*
([nieuws](https://www.kvbonheiden.be/nieuws/)). Also: a **Kunstgrasdossier** page documenting the pitch
project, a Familiedag, Steakdag, Algemene kwis, Voetbalkwis, Eetdag, Paastornooi, 1 mei-tornooi, a
Jules Destrooper koekjesverkoop and sinaasappelverkoop, plus **Trooper** cashback for the youth academy.
Framing line: *"Samen bouwen we aan voetbal in Bonheiden."*

**VC Rijmenam** — <https://www.vcr.be/> — **real site**
WordPress. Nav: Home, Over ons, Schrijf je in, Evenementen, Ploegen, Club info, Jeugd-tornooi, Vragen.
Homepage: *"Welkom bij VC Rijmenam"*, a Duiveltjesdag promo, a smoke-free announcement (*"Vanaf 1 januari
2025 is heel het domein van VCR rookvrij!"*), first-team results, 30+ sponsor logos, a **VCR-Trooper**
fundraising block, and a sponsor solicitation written as a shrug: *"Wil jij ook sponsor worden? Stuur ons
een mailtje."* Carries a newsletter signup (we do not and will not).

**VC Leest** (Leest & Heffen) — <https://www.vcleest.be/> — **real site**
WordPress, 2022 club. Tagline *"Voetbal brengt samen"*; purpose statement *"VC Leest wil eraan bijdragen dat
onze leden met plezier kunnen voetballen en zich verder kunnen ontwikkelen"*; a values block on *"Normen en
waarden bij het spelen van voetbal"* aimed at players, trainers **and** parents. Trial trainings before
committing. Notably, the 2022 merger that created the club is **not** told anywhere on the homepage — a
missed-origin-story failure worth contrasting with our own `/club/geschiedenis` discipline.

**SK Heffen / KFC Walem / Battel** — no maintained standalone sites surfaced; presence is limited to
directory listings (<https://www.voetbalinbelgie.be/en/clubs/mechelen/>) and Facebook. Recorded as
**Facebook-only** without further claims.

### The Vilvoorde–Kampenhout–Grimbergen belt

**Sporting Kampenhout** — <https://www.sportingkampenhout.be/> — **template, but the most practically
complete site in the tier** (Umbraco)
Nav is exhaustive: Eerste Elftal (Ploeg / Rangschikking / Wedstrijden / **Statistieken**), Eerste Elftal B,
Reserven, Dames, Jeugd in Bovenbouw/Middenbouw/Onderbouw with every team's competitive level in the label
(*"U13A (Interprovinciaal)"*, *"U8 Geel (Provinciaal)"*, *"U7 Wit (Gewestelijk)"*), **Voetbalspeeltuin**,
Test training, **G-ploeg**, Club (Intern Reglement → Algemene gedragsregels / Spelers / **Ouders** /
Algemene veiligheidsregels; Downloads; Accomodatie + **Accomodatie huren?**; **Ticketing**; Volgende
wedstrijden), Onze partners + Samenwerkingen, plus **Afspraak kine** and **Sandwiches**.
**Ticketing**, verbatim and complete: first team *"€10 (inclusief drankjeton)"*, youth *"€3,5"*.
([ticketing](https://www.sportingkampenhout.be/club/ticketing/))
**Sandwiches** is a matchday micro-service run with the local Spar in Berg:
*"De sandwiches wegen 45g en kosten slechts €0.80/stuk. Houd er rekening mee dat er een minimale bestelling
is van 15 stuks."* / *"Plaats je bestelling uiterlijk dinsdag, en wij zorgen dat je verse sandwiches
klaarstaan op de daaropvolgende zaterdag."* — pickup from 09:30 Saturday, cash at the Spar till.
([sandwiches](https://www.sportingkampenhout.be/sandwiches/))
**Gedragsregels ouders** ([pagina](https://www.sportingkampenhout.be/club/intern-reglement/gedragsregels-ouders/)):
*"Een ouder heeft een voorbeeldfunctie voor het eigen kind en gedraagt zich naar behoren."* ·
*"Ouders en supporters blijven te allen tijde achter de omheining."* ·
*"Het speelveld is enkel toegankelijk voor spelers, trainers en medewerkers van de club."* ·
*"Als het kind geen interesse heeft in voetbal, raden wij aan ook niet voor deze hobby te kiezen."* ·
*"Instructies geven aan de jeugdspelers gebeurt enkel door de trainer."*
Match-report voice: *"Geel-blauw sloot het seizoen mooi af met een 2-1 thuiszege tegen de vrienden van
Out-Hoegaarden."* — "de vrienden van [X]" is a lovely provincial idiom for the opposition.

**PSV 1820** (Perk–Steenokkerzeel Verenigd) — <https://www.psv1820.be/> — **real site, but unreadable**
The domain's TLS chain does not validate (`unable to get local issuer certificate`) and plain HTTP refuses
connections, so the site could not be read directly — a real availability defect, not a fetching quirk.
From indexable fragments and the municipal listing: family-oriented club across **two campuses**
(Stadion Graaf de Ribaucourt, Kerkdreef; Campus Den Dam, Damlaan), 24 youth teams U6–U21, a
`/club-info` and `/club-info/clubreglement`, and a matchday convention where players receive a
**drinkbon** redeemable in the kantine, with match information posted on a board in the kantine.
([Gemeente Steenokkerzeel](https://www.steenokkerzeel.be/verenigingen/detail/88/psv-1820))

**KSC Grimbergen** — `kscg.be` → <https://kscjeugd.weebly.com/> — **template** (Weebly)
The senior domain redirects into a Weebly youth site. Practical pages are thin: Algemene Info gives only the
address (*"Brusselsesteenweg 152, 1850 Grimbergen"* for terreinen, kantine and trainingen) and a named
contact with a mobile number. Terreinen page exists but carries no playability or parking detail.
([algemene info](https://kscjeugd.weebly.com/algemene-info.html))

**KCS Machelen** — <https://kcs-machelen.be/> — **real site**
Tagline *"Voetbal in de Noordrand"*. Onderbouw / Middenbouw / Bovenbouw plus **Futbalista** futsal, Fanion
2e and 4e provinciaal, dames, veteranen. Recent news: new shirt sponsors, an updated clubreglement framed
around *"duidelijkheid, eenheid en respect"*, active trainer/volunteer recruitment across coaching,
refereeing and admin — and, most usefully for us, a **UiTPAS Noordrand** partnership giving members
community-discount access. Club info lives partly in the *Expo Sport Media* app and ProSoccerData.

**KFC Meise** — <https://www.kfcmeise.be/> — **template**
Presents itself under the nickname **"FC Maazz"** on the homepage — a club using its dialect nickname as
its front-door identity, same instinct as Bonheiden's "Bênaa". Clubinfo (lidgeld, missie/visie, structuur,
historiek), Ploegen (including **afgelastingen**), Nuttige links (Pro Soccer Data, E-Kickoff, verzekering).
Kantine phone number published: **02 269 70 15**. Seasonal practicality: winter care instructions for the
artificial pitch. Merch via Jakoshop.

**Sporting Erps-Kwerps** — <https://sportingerpskwerps.be/> — **real site, bot-blocked**
Returns HTTP 403 to automated fetches, so content could not be verified. Directory summary describes a club
that grew *"van een bescheiden dorpsvereniging tot een competitieve speler in derde provinciale"* and plays
in 3e provinciale. ([VoetbalInBelgië](https://www.voetbalinbelgie.be/en/clubs/s/sporting-erps-kwerps/))

**K. Haacht United** — `haachtunited.be` — **unreadable / effectively Facebook**
Formed in 2025 by the merger of KVC Haacht (stamnr. 490) and KFC Sparta Haacht Tildonk (2564). The domain
fails TLS validation; the club's live presence is the municipal listing and Facebook pages.
([Gemeente Haacht](https://www.haacht.be/vereniging-koninklijke-haacht-united))

**KSC Keerbergen** — <https://www.ksckeerbergen.be/> — **template** (Google Sites)
Google Sites with an embedded Google Calendar and Google Forms registration. Clubinfo submenu is decent on
paper (Wie zijn wij?, Lidgeld, Activiteitenkalender, Sportongeval?, Visie, Gedragsregels, Geschiedenis).
Homepage leads with recruitment and a training grid by birth year, plus an Easter camp in Rosas, Spain.
Sponsor strip includes **Trooper**.
**Voice:** *"Ben je gebeten door de voetbalmicrobe of wil je gewoon eens komen proberen?"*

**Peutie FC · VK Berg-Op · Nederokkerzeel** — no maintained standalone sites found; fixtures appear only via
aggregators (<https://www.foot24.be/en/clubs/peutie-fc>). Recorded as **Facebook-only / nothing**.

### Neighbourhood scorecard

| Club | URL | Verdict | Standout |
|---|---|---|---|
| KFC Eppegem | kfceppegem.be | real site | Feestzaal offer; **news section empty, defers to Facebook** |
| FC Zemst Sportief | fczemst.be | real site | *"Da's tof sjotten!"*; webshop; Bovenbouw/Midden/Onder |
| FC Verbr. Hofstade | fchofstade.be | real site (stale) | Mosselen copy; G-ploeg; temporary ground |
| VK Weerde | — | dead | Club dissolved; domain gone |
| KFC Muizen | kfcmuizen.be | template | Old Stars wandelvoetbal; accommodatie detail; mutualiteit rack |
| KFC Katelijne | kfckatelijne.be | real site | Club 99; verdienstelijke spelers; in-memoriam voice |
| KV Bonheiden | kvbonheiden.be | real site | **Dialect headings; published sponsor rate card; named partner zones** |
| VC Rijmenam | vcr.be | real site | Trooper; rookvrij domein |
| VC Leest | vcleest.be | real site | *"Voetbal brengt samen"*; merger story missing |
| Sporting Kampenhout | sportingkampenhout.be | template | **Ticketing prices; sandwich pre-order; gedragsregels per rol** |
| PSV 1820 | psv1820.be | real site, TLS broken | Two campuses; drinkbon |
| KSC Grimbergen | kscg.be → weebly | template | Thin |
| KCS Machelen | kcs-machelen.be | real site | **UiTPAS Noordrand**; "Voetbal in de Noordrand" |
| KFC Meise | kfcmeise.be | template | "FC Maazz" nickname; kantine phone; pitch care |
| Sp. Erps-Kwerps | sportingerpskwerps.be | real site, 403 | Unverified |
| K. Haacht United | haachtunited.be | unreadable | 2025 merger; Facebook |
| KSC Keerbergen | ksckeerbergen.be | template | *"gebeten door de voetbalmicrobe"* |
| SK Heffen / Walem / Battel / Peutie / Berg | — | Facebook-only | — |

**Honest read on the bar we're clearing.** Of 18 neighbourhood clubs, roughly six have a maintained
purpose-built site, six run a recognisable template, and six have effectively no site at all. Two live
domains fail TLS outright. One club's news section is literally empty and points at Facebook. Not one of
them shows a per-match lineup, a goal timeline, or per-player season statistics for a youth team. Our
members' families are used to: a Facebook feed for news, a PDF or an iframe for the league table, and a
phone number for everything practical. That is the incumbent experience — and it means the *practical*
things we don't ship (kantine, parking, entry price, cancellations, volunteering) are felt as gaps far more
than the sophisticated things we do ship are felt as wins.

---

## 3. Provincial clubs worth learning from

### KFC Nijlen — <https://nijlen.voetbalassist.be/> — VoetbalAssist platform, 3e amateur, 450 leden / 26 ploegen

The deepest **information architecture** in this study. Findings:

1. **A club-info tree that answers administrative life, not just sporting life.** Onze club splits into
   clubinformatie / visie en doelstellingen / locatie en accommodatie / clubgeschiedenis / organisatie /
   organigram / bestuur / **lidmaatschap** (lidgelden, wijziging van uw gegevens) / **vrijwilligers**
   (event-team, **vacature**). Sportief splits into trainingsuren / coördinatie jeugd / beleidsplan
   jeugdwerking / **EHBSO** / testen bij KFC Nijlen / gezondheidstips / aangifte ongeval / charters
   (intern reglement, **rol van de ouders**) / mutualiteit / **kine jeugd** / **vertrouwenspersoon** /
   abonnementen.
2. **A `vertrouwenspersoon` (confidential counsellor / API) as a first-class nav item.** Safeguarding is
   surfaced, not buried in a PDF. This is now a Voetbal Vlaanderen expectation and both Kontich and KSCW
   Hofstade also expose it (as "Club-API" / "API").
3. **Parking rules written like a neighbour who has had enough**, on the accommodation page:
   *"Ons jeugdcenter + stadion eerste ploeg zijn met de wagen enkel bereikbaar via de nieuwe toegangsweg =
   GRAANWEG!"* and *"is het is VERBODEN te parkeren op de Graanweg of in de bermen van omliggende straten"*,
   plus an explicit overflow-parking rule and a note that the old A-terrein is no longer in use.
   ([locatie en accommodatie](https://nijlen.voetbalassist.be/206/locatie-en-accomodatie/))
4. **A parents' charter with a slogan.** *"GEEN COACHING - WEL AANMOEDIGEN - BLIJF POSITIEF!"*
   ([rol van de ouders](https://nijlen.voetbalassist.be/238/rol-van-de-ouders/))
5. **A `Verjaardagen` page listing members' names and birth dates publicly**, filterable "voor de komende
   maand / per maand", each name linking to a member profile. ([verjaardagen](https://nijlen.voetbalassist.be/165/verjaardagen/))
   Charming intent, and a **hard reject for us** — we run youth profiles U6–U21 under explicit privacy
   constraints, and a public rolling birthday list of minors is exactly the thing we must not build.
6. **Template rot is visible even on the good sites.** The FAQ page renders *"In deze categorie bevinden
   zich geen vragen"* — a platform feature nobody ever filled in.
   ([FAQ](https://nijlen.voetbalassist.be/164/faq/)) Note also `kfcnijlen.be` itself returns 403; the
   VoetbalAssist subdomain is the live site, so the club's "own" domain is a dead end for visitors.

### RAS Saintoise — <https://rassaintoise.be/> — P1 Brabant Wallon, the most polished site in the study

1. **A positioning line that earns its ambition:** *"Un club de cœur, une ambition de haut niveau"* — and
   it is paired with concrete proof on the homepage (vice-champions P1 2025–2026, new synthetic pitch at
   Stade René Kiermeer), not with adjectives.
2. **Conversion is the homepage's job.** *"Inscrire mon enfant"* is a primary action, and the Infos page
   opens with *"Rejoins la grande famille de la R.A.S. Saintoise !"* before listing enrolment routes for
   men's seniors, boys U6–U18, girls U6–seniors and women's seniors.
   ([infos](https://www.rassaintoise.be/infos.html))
3. **One "Infos" page as the practical hub**, tabbed into News / Inscriptions / Horaires d'entraînement /
   Calendrier des événements / Documents officiels (including Fair Play charters and per-category game
   rules). A single URL a parent can be pointed to.
4. **A season events calendar with dates that are not matches** — tournoi d'été, reprise des entraînements,
   season opener, gala des partenaires, fête de Noël des jeunes. Club life is on the calendar next to
   football.
5. **Commerce is normalised at this level:** Boutique and Billetterie sit in the primary nav. Free parking
   is stated on the venue block with Maps integration. (Both are out of scope for us — see Rejects.)
6. **Weak spot to learn from:** the Infos page names no phone number, no buvette information and no entry
   price — the polish is front-of-house, the operational detail is still missing. Even the best site in this
   tier does not solve the kantine/parking problem.

### K. Kontich FC — <https://www.kkontichfc.be/> — Kicksite platform

1. **Motto with teeth:** *"Al ben ik klein, ik wijk voor niets"* — a club that names its own smallness and
   turns it into defiance. Structurally the same move as *"Er is maar één plezante compagnie"*.
2. **A `Helperslijst`** in the primary nav next to Events — the volunteer rota is a public club surface,
   not a WhatsApp group.
3. **Member self-service without accounts**: footer links for *Spelersprofiel opvragen*, *Kortingcodes
   opvragen* and *Attesten mutualiteit opvragen*, all via a `lidkaartOpzoeken` lookup. Useful pattern for
   an anonymous-only site: identify by membership card number, not by login.
4. **A `Clublied` page** in Club info. A village club with its anthem written down.
5. **Health content as club content**: Blessurepreventie and Blessurebehandeling are separate nav items,
   alongside Ongevallen and a Club-API (safeguarding) page.
6. **`Wedstrijdbegeleiders` under Planning** — match-day officials/stewards are rostered publicly.

### Sporting Eizeringen — <https://www.sporting-eizeringen.be/> — P4, WordPress

1. **A season-scoped nav group** — "Seizoen 2025-2026" containing *Komende wedstrijden*, **Schorsingen**
   and **Afgelastingen**. Modelling suspensions and cancellations as first-class season state is right, even
   though the execution is an empty "powered by Advanced iFrame" shell.
   ([afgelastingen](https://www.sporting-eizeringen.be/seizoen/afgelastingen/))
2. **A "Mijn SPE" self-service group** — Aangifte ongeval (blessure), Mutualiteit, Medische afwijking. The
   personal-admin cluster gets its own named section rather than being scattered.
3. **Events written with warmth and a reason to come**: the Breughel BBQ is *"een gezellige traditie waarbij
   lekker eten, een warme sfeer en samen genieten centraal staan"* and invites *spelers, ouders,
   supporters, sponsors en buren* — neighbours explicitly included. *"Geniet samen met ons van een gezellige
   Breughel BBQ!"*
4. **Events are pinned to fixtures**: "Foodlunch 22.02.2026 – Sporting Eizeringen–SK Beersel", doors 11:00,
   with the menu published (bubbels, stoofvlees, dessert). Match + meal as one unit.
5. **Accommodatie names each pitch by role**: *"Terrein 1 (A- en B-ploeg)"*, *"Terrein 2 met LED-verlichting"*,
   *"Terrein 3"*, *"Terrein 4 (jeugd)"*. ([accommodatie](https://www.sporting-eizeringen.be/club/accommodatie/))

### KSCW Hofstade (Aalst — *not* our Hofstade) — <https://www.kscwhofstade.be/> — 4e provinciaal, JouwWeb

Included because a 4e-provinciaal club on a €10/month page builder is doing two things better than anyone
else in this study.

1. **The "Potcast" — a club podcast.** Hosted by Thomas, guests are the voorzitter (on club objectives), the
   new coach Glenn Guns (described as *"zoon van het huis"*), and Franky and Anaïs launching a new women's
   team. Season-opener line, verbatim: *"Met opgeladen batterijen, de stimulerende geur van vers gemaaid
   gras en een rugzak vol goede moed geven we hierbij de aftrap van een nieuw seizoen."*
   ([potcast](https://www.kscwhofstade.be/potcast))
2. **The best FAQ in the study** ([faq](https://www.kscwhofstade.be/contact/faq)) — eight questions, answered
   without spin: new players are only accepted in categories with room, to protect training quality; a
   candidate must complete **three test trainings** before joining; you can only leave in April via Voetbal
   Vlaanderen; lidgeld 2026–2027 is **€350 including kit and a €50 voucher**, with €25 extra for new members'
   federation affiliation; they train off-site at Sportcomplex Osbroek and Beukenhof *"door gebrek aan
   kunstgras"*; and — bluntly — *"Werken jullie met de uitpas/kansentarief?"* → *"Nee."*
3. **An event archive per edition**: Evenementen → Archief → Footlunchen → *Footlunch 23/11/2025*,
   *Footlunch 14/09/25*; Voetbalkampen → *Voetbalkamp 2025*; Sint Maartenfeest → *2025*, *2024*. Each
   edition keeps a permanent URL instead of being overwritten.
4. **`Archief ploegfoto's`** under Jeugd — historic team photos as a standing section.
5. **A kantine page that answers the actual question** in one line:
   *"Geopend tijdens alle activiteiten van de club (trainingen, wedstrijden, ...)"*, plus accepted payment
   methods. ([kantine](https://www.kscwhofstade.be/over-ons/kantine))
6. **`Klantenkaart Sportkot`** under Documenten — a members' discount card at a local sports shop. A member
   benefit that costs the club nothing.
7. **`Panathlon verklaring`** published under Documenten — the ethics-in-youth-sport declaration, signed and
   visible.
8. **`Aanvraag testtraining`** as a form under Contact, with a homepage CTA banner
   (*"AANVRAAG TESTTRAINING - seizoen 2026-2027"*).

### KSVK Maldegem — <https://www.ksvkmaldegem.be/> — Kicksite

1. **Title-winning news headlined on emotion, not the table:** *"Clubliefde maakte het verschil"* — quoted
   from the chairman.
2. **A memorial tournament as a recurring fixture**: *"3e Memorial Miguel Van Damme"* (August 2026). The
   club calendar carries remembrance as an annual event, not a one-off post.
3. **A homepage "Matchcenter"** that lists Fanion *and* Reserven A side by side — the reserve team is not
   demoted out of the shop window.

### Sportief Rotselaar — <https://www.sportiefrotselaar.be/> — Kicksite

Mainly useful as a Kicksite comparison point. Notable: a legal-compliance announcement written plainly and
kept on the site — *"Vanaf 31 december 2024 geldt er een wettelijk volledig rookverbod op het volledige
sportcomplex!"* Three clubs in this study (Rotselaar, Rijmenam, Bonheiden) all published the stadium smoking
ban as club news. Ground-rule changes are news at this level.

### The platform landscape (context, not a club)

Understanding what our neighbours' sites *are* explains the ceiling they hit:

- **VoetbalAssist** (Nijlen) — deepest stock IA of any platform seen: teams, photos per team, member portal,
  events, shop, widget dashboard, a birthdays module, an FAQ module.
- **Kicksite** (Kontich, Maldegem, Rotselaar) — Belgian, sells modules verbatim as *"Sportieve module"*,
  *"Een moderne nieuwe website"*, *"Centraal ledenbeheer"*, **"Kantine kassa"**, *"Koppeling met de
  federatie"*, *"Online bestellingen"*, *"Sponsorwerving"*. ([kicksite.be](https://www.kicksite.be/))
  The canteen POS being part of the *website* vendor's offer tells you where the club's real operational
  pain sits.
- **Twizzit** — 5,500+ member organisations; websites are a side-effect of the admin platform.
  ([twizzit.com](https://www.twizzit.com/nl-be/))
- **Webhero** (Muizen), **Umbraco** (Kampenhout), **JouwWeb** (KSCW Hofstade), **Weebly** (Grimbergen),
  **Google Sites** (Keerbergen), **WordPress** (Hofstade, Rijmenam, Leest, Eizeringen, Bonheiden),
  **MODx + VSOCCER** (Katelijne).

The consequence: on every one of these platforms, the *club-specific* content is the club's own writing, and
the *sporting* data is an embed. Nobody in this tier owns their match data as first-class pages. That is the
moat `apps/web/PRODUCT.md` already claims, and this research confirms it holds across 24 clubs.

---

## 4. The village voice — lines worth stealing the register of

Collected verbatim. The unifying quality is that a person wrote them, in their own accent, about people they
know. None of them could appear on a professional club's site.

**Dialect used as identity, not decoration**

- *"Welkom bij Bênaa."* — KV Bonheiden homepage ([kvbonheiden.be](https://www.kvbonheiden.be/))
- *"Niefs, veu baa de kaffe"* — Bonheiden's word for its news section
- *"Braa veul te doen baa ons"* — Bonheiden's word for its events section
- *"Da's tof sjotten!"* — FC Zemst Sportief tagline ([fczemst.be](https://www.fczemst.be/))
- *"Interesse om te komen sjotten bij FC Zemst."* — FC Zemst
- **"FC Maazz"** — KFC Meise fronting its dialect nickname ([kfcmeise.be](https://www.kfcmeise.be/))
- *"Voetbal in de Noordrand"* — KCS Machelen ([kcs-machelen.be](https://kcs-machelen.be/))

**Smallness owned, not apologised for**

- *"Al ben ik klein, ik wijk voor niets"* — K. Kontich FC motto ([kkontichfc.be](https://www.kkontichfc.be/))
- *"Onze voetbalclub bestaat reeds sinds 1924. Nu, bijna een eeuw later, staan wij ons mannetje in de
  Antwerpse provinciale reeksen."* — KFC Muizen ([kfcmuizen.be](https://www.kfcmuizen.be/))
- *"van een bescheiden dorpsvereniging tot een competitieve speler in derde provinciale"* — Sporting
  Erps-Kwerps, via [VoetbalInBelgië](https://www.voetbalinbelgie.be/en/clubs/s/sporting-erps-kwerps/)
- *"Un club de cœur, une ambition de haut niveau"* — RAS Saintoise ([rassaintoise.be](https://rassaintoise.be/))

**Food as the club's actual love language**

- *"Dus als het water je in de mond komt bij de gedachte aan een lekkere portie mosselen, een lekker visje,
  een vol-au-vent of je gewoon geen zin hebt om af te wassen: één adres: Gasthuishofweg 30!"*
  — FC Verbroedering Hofstade ([fchofstade.be](https://www.fchofstade.be/))
- *"een gezellige traditie waarbij lekker eten, een warme sfeer en samen genieten centraal staan"*
  — Sporting Eizeringen, Breughel BBQ, inviting *spelers, ouders, supporters, sponsors en buren*
- *"Groot assortiment broodjes, beleg, eieren, fruit, warme gerechten, warme dranken,..."*
  — KFC Muizen, 22ste Lente Brunch ([activiteiten](https://www.kfcmuizen.be/activiteiten))
- *"Je kan op beide dagen van 18 tot 22 uur terecht in onze kantine aan de Ossebeemden"*
  — FC Hofstade, Visfestijn
- *"hier komen sponsors en vips tesamen voor een gezellige babbel voor, tijdens en na de wedstrijd"*
  — KFC Katelijne, Club 99

**Recruitment that sounds like an invitation, not a funnel**

- *"Ben je gebeten door de voetbalmicrobe of wil je gewoon eens komen proberen?"* — KSC Keerbergen
  ([ksckeerbergen.be](https://www.ksckeerbergen.be/))
- *"Zin om te voetballen bij KV Bonheiden?"* / *"Van eerste trap tot competitieve speler: iedereen is
  welkom."* — KV Bonheiden
- *"Leuk dat je interesse hebt om aan te sluiten bij KV Bonheiden"* — Bonheiden signup page
- *"Rejoins la grande famille de la R.A.S. Saintoise !"* — RAS Saintoise
- *"Voetbal brengt samen"* — VC Leest ([vcleest.be](https://www.vcleest.be/))
- *"Wil jij ook sponsor worden? Stuur ons een mailtje."* — VC Rijmenam ([vcr.be](https://www.vcr.be/))

**People, remembered**

- *"Alain was meer dan een trainer, hij was een (h)echte clubman"* — KFC Katelijne
  ([nieuws](https://www.kfckatelijne.be/nieuws/))
- *"Wij zullen Ali blijven herinneren als een joviaal man die steeds bereikbaar was"* — KFC Katelijne
- *"Via deze weg willen wij de familie en vrienden van Ali onze steun betuigen"* — KFC Katelijne
- *"Op 12 december 2010 werd onze 'captain' Bjorn Goyvaerts gevierd voor zijn 250ste kompetitiewedstrijd"*
  — KFC Katelijne ([verdienstelijke spelers](https://www.kfckatelijne.be/historiek/verdienstelijke-spelers-en-oud-spelers-kfck.html))
- *"Krasse 60-plussers die nog steeds voor elke bal gaan."* — KFC Muizen on the Old Stars walking-football
  team ([artikel](https://www.kfcmuizen.be/nieuws/wandelvoetbalclub-old-stars))
- *"Clubliefde maakte het verschil"* — KSVK Maldegem's chairman after the title
  ([ksvkmaldegem.be](https://www.ksvkmaldegem.be/))
- *"zoon van het huis"* — KSCW Hofstade on its new coach ([potcast](https://www.kscwhofstade.be/potcast))
- *"3e Memorial Miguel Van Damme"* — KSVK Maldegem's annual memorial tournament

**Seasons and weather, written like a human**

- *"Met opgeladen batterijen, de stimulerende geur van vers gemaaid gras en een rugzak vol goede moed geven
  we hierbij de aftrap van een nieuw seizoen."* — KSCW Hofstade
- *"Geel-blauw sloot het seizoen mooi af met een 2-1 thuiszege tegen de vrienden van Out-Hoegaarden."*
  — Sporting Kampenhout match report ([sportingkampenhout.be](https://www.sportingkampenhout.be/))
- *"Een beter voetballend Sporting leed op het veld van Kester-Gooik een jammerlijke 2-1 nederlaag."*
  — Sporting Kampenhout

**Firmness, kindly delivered**

- *"GEEN COACHING - WEL AANMOEDIGEN - BLIJF POSITIEF!"* — KFC Nijlen
- *"Gun uw kind het kind zijn, want het moet nog zoveel leren."* — KFC Nijlen
- *"Blijf altijd positief, juist bij balverlies of een tegendoelpunt."* — KFC Nijlen
- *"Laat het coachen over aan de trainer."* — KFC Nijlen
- *"Ouders en supporters blijven te allen tijde achter de omheining."* — Sporting Kampenhout
- *"Als het kind geen interesse heeft in voetbal, raden wij aan ook niet voor deze hobby te kiezen."*
  — Sporting Kampenhout
- *"is het is VERBODEN te parkeren op de Graanweg of in de bermen van omliggende straten"* — KFC Nijlen
- *"Wij zijn genoodzaakt om lidgelden te vragen van alle voetballende leden. Maar daar krijgen zij ook heel
  wat voor terug!"* — KFC Muizen
- *"Vanaf 1 januari 2025 is heel het domein van VCR rookvrij!"* — VC Rijmenam

**Note on tone-matching for KCVV.** "Er is maar één plezante compagnie" already sits in the same register as
Bonheiden's dialect headings and Kontich's motto — it is a *claim about atmosphere*, not about size or
achievement. The gap is that the motto currently stands alone; nothing else on our site speaks in that
voice. The finding here is not "adopt someone's phrases" — it is that section labels, empty states, event
descriptions and 404s are the places where village clubs let the accent through, and ours are neutral.

---

## 5. Practical-info patterns — what village clubs get right out of necessity

These recur across the tier because members ask about them every week. Grouped by whether we currently ship
anything comparable.

### Kantine and ground

| Pattern | Best example seen | Ours today |
|---|---|---|
| Kantine opening rule in one sentence | *"Geopend tijdens alle activiteiten van de club (trainingen, wedstrijden, ...)"* — [KSCW Hofstade](https://www.kscwhofstade.be/over-ons/kantine) | none |
| Accepted payment methods in the kantine | KSCW Hofstade kantine page (payment logos) | none |
| Kantine phone number published | *"02 269 70 15"* — [KFC Meise](https://www.kfcmeise.be/) | none |
| Pitch inventory named by role | *"Terrein 1 (A- en B-ploeg)"* … *"Terrein 4 (jeugd)"* — [Eizeringen](https://www.sporting-eizeringen.be/club/accommodatie/) | none |
| Surface and changing-room counts | *"Er is een A-veld in natuurlijk gras en een B-veld en twee jeugdvelden in kunstgras."* / 12 kleedkamers incl. 2 for referees — [KFC Muizen](https://www.kfcmuizen.be/accommodatie) | none |
| Parking: the approved route **and** the forbidden one | Graanweg-only access, overflow lot, ban on verge parking — [KFC Nijlen](https://nijlen.voetbalassist.be/206/locatie-en-accomodatie/) | none |
| Shared parking disclosure | *"een grote parking die samen met de tennisclub gebruikt wordt"* — KFC Muizen | none |
| Which campus / which ground today | PSV 1820's two campuses; FC Hofstade's temporary Weerde ground | none |
| Kantine / hall rental as an offer | Eppegem's Feestzaal Het Assebroek; Katelijne's Club 99; Muizen's *Verhuur accommodatie*; Kampenhout's *Accomodatie huren?* | none |
| Winter pitch-care instructions | [KFC Meise](https://www.kfcmeise.be/) | none |
| Smoke-free ground announcement | Rijmenam, Bonheiden, Rotselaar | none |

### Matchday

- **Entry price, stated plainly.** Sporting Kampenhout: first team *"€10 (inclusief drankjeton)"*, youth
  *"€3,5"*. ([ticketing](https://www.sportingkampenhout.be/club/ticketing/)) Publishing the price is
  information, not ticketing.
- **The drinkbon convention.** PSV 1820 players get a drink voucher after matches, redeemable in the kantine.
  Small, universal, never written down anywhere findable.
- **Match-day food pre-order.** Kampenhout's Spar-run sandwich service: €0.80/stuk, 45g, minimum 15, order by
  Tuesday, collect Saturday from 09:30, pay cash at the till.
- **Kantine noticeboard as the canonical match info surface** (PSV 1820) — i.e. the website is *not* where
  people currently look.
- **Afgelastingen as a named season surface.** Eizeringen (`/seizoen/afgelastingen/`) and KFC Meise (under
  Ploegen) both give it a URL. Neither actually renders anything useful.
- **Schorsingen** (suspensions) as a season surface — Eizeringen.

### Money in and money out

- **Published sponsor rate card** with per-position board prices, shirt sponsoring by team format, and a
  €100 match-ball tier explicitly framed as the accessible entry point — KV Bonheiden.
- **Named zone/asset sponsorships announced as news** — "Official Training Zone Partner", "Official Driving
  Partner" — KV Bonheiden.
- **Business club / VIP room** as a sponsor product — Club 99, KFC Katelijne.
- **Trooper.be passive fundraising** — supporters shop at ~600 partner shops, the club receives ~5% at no
  cost to the shopper. Seen at VC Rijmenam, KV Bonheiden, KSC Keerbergen.
  ([trooper.be](https://www.trooper.be/nl/word-troopervereniging))
- **Product-sale fundraisers** — Jules Destrooper koekjes and sinaasappelen (Bonheiden), Milka (Katelijne),
  ontbijtmand (Nijlen, Kontich), kalender- and steunkaart-style sales across the tier.
- **The fundraising calendar itself as content** — Muizen lists its year as Mosselsouper, Bingo,
  Sinterklaasfeest, Spaghettidag, Brunch, Jeugdtornooi, Sportkamp, Steakdag, with a stated purpose: to
  support operations *and* bring players, board, youth and parents together.
- **Events pinned to a specific fixture** — Eizeringen's *"Foodlunch 22.02.2026 – Sporting Eizeringen–SK
  Beersel"* with doors at 11:00 and the menu published.
- **Per-edition event archives** with permanent URLs — KSCW Hofstade's Footlunchen / Voetbalkampen /
  Sint Maartenfeest archives.

### Membership admin

- **Mutualiteit attest rack** — one link per health fund (CM, Solidaris, Helan, Liberale, Neutraal, De
  Voorzorg, Onafhankelijk). Muizen and KSCW Hofstade both do this. *(We ship
  `/club/praktische-informatie` covering lidgeld, terugbetalingen and ProSoccerData per `llms.txt` — verify
  whether the per-fund attest links are on it before treating this as a gap.)*
- **Ongevalsaangifte with the deadline stated** — *"ten laatste de 21 kalenderdagen na het ongeval"* (Muizen).
- **Blank medisch getuigschrift** as a homepage-level download (Kampenhout).
- **Lidgeld stated with what it includes** — KSCW Hofstade: €350 incl. kledij + €50 voucher, +€25 for new
  members' federation affiliation.
- **Test-training request as a form** — KSCW Hofstade (*Aanvraag testtraining*), Kampenhout (*Test training*),
  Nijlen (*testen bij KFC Nijlen?*), FC Zemst (*Spelersfiche*).
- **Kansentarief / UiTPAS position, stated either way** — KCS Machelen partners with UiTPAS Noordrand;
  KSCW Hofstade answers *"Nee."* Both are useful; silence is the only bad answer.
  ([publiq](https://www.publiq.be/nl/projecten/uitpas/uitpas-in-jouw-stad-of-gemeente/uitpaspartner/verenigingen-en-uitpas))
- **Member self-service by card number, no account** — Kontich's *Spelersprofiel opvragen* /
  *Kortingcodes opvragen* / *Attesten mutualiteit opvragen*.

### People and safeguarding

- **Vertrouwenspersoon / Club-API** as a named nav item — Nijlen, Kontich, KSCW Hofstade.
- **Gedragsregels split by audience** — algemeen / spelers / **ouders** / veiligheid (Kampenhout);
  *rol van de ouders* + *charter* (Nijlen).
- **Panathlon-verklaring** published (KSCW Hofstade).
- **EHBSO, gezondheidstips, kine jeugd, blessurepreventie, blessurebehandeling** as club content
  (Nijlen, Kontich).
- **Volunteer roles named and open** — Nijlen's *vacature* and *event-team*; Kontich's *Helperslijst*;
  Muizen's *"Penningmeester gezocht"*; Katelijne's *Jeugdtrainers gezocht* and *Doelman gezocht*; Machelen's
  open call for coaches, referees and admin help.
- **Members' discount card at a local shop** — *Klantenkaart Sportkot* (KSCW Hofstade).

---

## 6. Recommendations

Effort is coarse: **S** ≈ a content page or a copy pass · **M** ≈ a new route plus editorial schema ·
**L** ≈ new data or a sustained editorial commitment.

### Adopt

**A1. `/club/kantine` (or a section of `/club/praktische-informatie`): the ground, in one page. — S**
Opening rule in one sentence, payment methods, the kantine phone number, pitch inventory named by role
(*welk terrein speelt wie*), changing-room facts, parking route **and** where not to park, and entry price.
Nothing here needs new data — it needs someone to write it once.
*Why it fits:* PRODUCT.md's realistic scene is "a phone held in daylight on the sideline"; this is the
content that scene actually needs, and no neighbour has assembled it.
Sources: [KSCW Hofstade kantine](https://www.kscwhofstade.be/over-ons/kantine) ·
[KFC Muizen accommodatie](https://www.kfcmuizen.be/accommodatie) ·
[KFC Nijlen locatie](https://nijlen.voetbalassist.be/206/locatie-en-accomodatie/) ·
[Eizeringen accommodatie](https://www.sporting-eizeringen.be/club/accommodatie/)

**A2. Publish the sponsor offer, with prices. — S–M**
Extend `/sponsors` (or add `/sponsors/word-sponsor`) with the three tiers we already model, per-position
board pricing, shirt sponsoring by team format, and an entry-level match-ball tier. Name the accessible tier
out loud, the way Bonheiden does: *"Een toegankelijke formule voor ondernemers."*
*Why it fits:* "Sponsors get real estate, not decoration" is Product Principle 4, and "deliver sponsor value"
is a success criterion. We currently show sponsors to visitors but say nothing to prospects.
Source: [KV Bonheiden business](https://www.kvbonheiden.be/business/)

**A3. A real FAQ, answered honestly — including the uncomfortable questions. — S**
Can my child join mid-season? Is there room in this age group? How many test trainings? What does lidgeld
include? When can I transfer? Where do you train when the pitch is unplayable? Do you do UiTPAS/kansentarief?
*Why it fits:* Prospective members convert here, and PRODUCT.md's "less-digital visitors" constraint is
exactly a plain-language-answers constraint. The persuasive quality is candour, not completeness.
Source: [KSCW Hofstade FAQ](https://www.kscwhofstade.be/contact/faq)

**A4. A volunteer surface: open roles + a helpers list. — S–M**
Named open roles with a human contact (not a generic inbox), and a visible helpers/credits list for the
people who already do it. `/hulp` today is who-is-who; this is the *we need you* counterpart.
*Why it fits:* "Recruit players and volunteers" is success criterion #1 and has no route.
Sources: [Kontich Helperslijst](https://www.kkontichfc.be/) · [KFC Muizen](https://www.kfcmuizen.be/sitemap) ·
[KFC Nijlen](https://nijlen.voetbalassist.be/)

**A5. A parents' charter on the youth surfaces. — S**
Short, warm, unambiguous — encouragement yes, coaching no, stay behind the fence, talk to the right person
in private. Written in our voice, not copied.
*Why it fits:* Youth parents are a co-equal primary audience (PRODUCT.md) and Principle 2 says youth is
first-class. We publish plenty *about* youth teams and nothing *to* the parents.
Sources: [KFC Nijlen rol van de ouders](https://nijlen.voetbalassist.be/238/rol-van-de-ouders/) ·
[Kampenhout gedragsregels ouders](https://www.sportingkampenhout.be/club/intern-reglement/gedragsregels-ouders/)

**A6. Safeguarding contact (vertrouwenspersoon / club-API) as a named, findable page. — S**
Three of the better clubs in this study give it top-level nav. We give it nothing.
Sources: [KFC Nijlen](https://nijlen.voetbalassist.be/) · [Kontich](https://www.kkontichfc.be/) ·
[KSCW Hofstade](https://www.kscwhofstade.be/)

**A7. Let the accent into the chrome. — S**
Section labels, empty states, the 404, event intros and the calendar's "nothing this week" copy are where
village clubs sound like themselves. Bonheiden's *"Niefs, veu baa de kaffe"* is a section heading, not a
tagline — that is the lesson. One or two well-chosen local phrases, used consistently, beat a paragraph of
warm-sounding boilerplate.
*Why it fits:* "club-insider warmth without corporate polish" is already the stated Voice commitment; this
is where it gets spent.
Sources: [KV Bonheiden](https://www.kvbonheiden.be/) · [FC Zemst](https://www.fczemst.be/) ·
[Kontich](https://www.kkontichfc.be/)

**A8. Say the club's position on kansentarief / UiTPAS out loud. — S**
Whichever the answer is. Zemst's arrangement needs checking, but the *page* is the deliverable — a family
that cannot afford lidgeld will not phone to ask.
Sources: [KCS Machelen](https://kcs-machelen.be/) · [KSCW Hofstade FAQ](https://www.kscwhofstade.be/contact/faq) ·
[publiq UiTPAS](https://www.publiq.be/nl/projecten/uitpas/uitpas-in-jouw-stad-of-gemeente/uitpaspartner/verenigingen-en-uitpas)

### Adapt

**B1. Afgelastingen as a *state*, not a page. — M**
Every neighbour treats cancellation as a page (empty) or a Facebook post. We have synced match data: model
cancelled / postponed / moved as a match state that surfaces on `/kalender`, the team page and the match
detail — with a club-wide banner only when the whole programme is off. That turns their weakest surface into
our strongest.
*Caveat:* PRODUCT.md is explicit that "fields the upstream does not reliably provide must never be designed
into a layout as guaranteed" — audit what PSD actually gives for cancellations before designing this.
Source: [Eizeringen afgelastingen](https://www.sporting-eizeringen.be/seizoen/afgelastingen/)

**B2. Honour surfaces: oud-spelers, jubilarissen, kampioenenviering, in memoriam. — M**
Katelijne's milestone archive and obituary posts are the two things in this tier that read as a club with a
memory. Adapt as **editorial**, not as a data feature: an article type or tag that collects them, rendered on
`/nieuws` and linked from `/club/geschiedenis`. Do not build a "hall of fame" data model — PRODUCT.md forbids
fabricating honours, and this must be sourced from real club records only.
*Extra weight:* VK Weerde's disappearance is the argument. When a village club folds, the record goes with
the domain.
Sources: [Katelijne verdienstelijke spelers](https://www.kfckatelijne.be/historiek/verdienstelijke-spelers-en-oud-spelers-kfck.html) ·
[Katelijne nieuws](https://www.kfckatelijne.be/nieuws/) · [KSVK Maldegem](https://www.ksvkmaldegem.be/)

**B3. Pin events to fixtures. — M**
Eizeringen's *"Foodlunch 22.02.2026 – Sporting Eizeringen–SK Beersel"* is one object: a match and a meal.
We have `/evenementen/[slug]` and `/wedstrijd/[matchId]` as separate worlds. An optional match reference on
an event — surfaced on the match page as "er is die dag ook…" — is a small schema addition with a real
matchday payoff.
Source: [Sporting Eizeringen](https://www.sporting-eizeringen.be/)

**B4. Per-edition event archives with permanent URLs. — S–M**
KSCW Hofstade keeps *Footlunch 23/11/2025* and *Footlunch 14/09/25* as separate durable pages. Our
`/evenementen/[slug]` should not overwrite last year's mosselsouper — an annual event wants a *series* with
per-edition entries, and past editions are the best possible advertisement for the next one (photos,
attendance, what was served).
Source: [KSCW Hofstade evenementen archief](https://www.kscwhofstade.be/)

**B5. Passive fundraising (Trooper) as a standing support surface. — S**
Three neighbourhood clubs already run it. It costs the supporter nothing, needs no checkout on our side, and
gives us a "steun de club" surface that is not a shop and not a signup — both of which PRODUCT.md excludes.
Needs a club decision, not engineering.
Sources: [VC Rijmenam](https://www.vcr.be/) · [KV Bonheiden](https://www.kvbonheiden.be/) ·
[trooper.be](https://www.trooper.be/nl/word-troopervereniging)

**B6. Publish entry prices without selling tickets. — S**
*"€10 (inclusief drankjeton)"* is information an away supporter needs and the single most useful line on
Kampenhout's entire site. Put it on the ground/practical page and on the match page for home fixtures. This
is explicitly **not** ticketing.
Source: [Kampenhout ticketing](https://www.sportingkampenhout.be/club/ticketing/)

**B7. A club podcast, if and only if there is a volunteer who will actually make it. — L**
KSCW Hofstade proves a 4e-provinciaal club can run one on a page builder: voorzitter on objectives, new coach
introduced as *"zoon van het huis"*, the women's-team founders explaining themselves. It is also the single
easiest thing on this list to abandon after three episodes. Treat the *hosting* as trivial and the
*commitment* as the whole cost.
Source: [KSCW Hofstade Potcast](https://www.kscwhofstade.be/potcast)

**B8. Member self-service by membership number, not by account. — M**
Kontich's *Attesten mutualiteit opvragen* / *Kortingcodes opvragen* pattern is the right shape for a site
with no login: a lookup, not an account. Only worth it if the underlying documents are genuinely per-member;
otherwise A-tier static links are sufficient.
Source: [Kontich](https://www.kkontichfc.be/)

**B9. Named zone/asset sponsorships announced as club news. — S**
"Official Training Zone Partner" is a real product invented out of a hedge and a sign. It gives a mid-tier
sponsor something to be *called*, and gives us a recurring, genuine news beat. Fits our three-tier model as
an add-on, not a fourth tier.
Source: [KV Bonheiden nieuws](https://www.kvbonheiden.be/nieuws/)

### Reject

**C1. A public birthday list of members.** Nijlen publishes names and dates, with profile links, for
everyone including minors. Our youth profiles already operate under explicit privacy constraints; a rolling
public birthday roster of children is a straightforward no.
Source: [KFC Nijlen verjaardagen](https://nijlen.voetbalassist.be/165/verjaardagen/)

**C2. Ticketing, webshop-as-a-route, and newsletter signup.** RAS Saintoise (Billetterie, Boutique,
*"Restez dans la course!"*), FC Zemst, FC Hofstade, VC Rijmenam and KFC Nijlen all do at least one of these.
All three are on PRODUCT.md's explicit does-not-have list. Publishing a *price* (B6) and linking an existing
clubshop are not the same thing as building commerce.

**C3. Feestzaal/hall rental as a headline product.** Eppegem's most developed page is its event-hall pitch,
and Katelijne and Muizen both rent out the kantine. It is real revenue — but it is a *venue* business, and
letting it near the homepage would push a site whose two primary audiences are supporters and youth parents
towards a third. If we ever do it, it is one deep page reachable from contact, never a nav item.
Source: [KFC Eppegem feestzaal](https://www.kfceppegem.be/feestzaal.html)

**C4. Sitemap / FAQ / gallery pages left empty because the platform offers them.** Nijlen ships
*"In deze categorie bevinden zich geen vragen"*; Eppegem ships *"Er staan momenteel geen berichten op de
site."*; Eizeringen ships an afgelastingen page that is an empty iframe. The lesson is a rule, not a feature:
**do not ship a route we are not committed to filling.** Every recommendation above should be read with that
attached.

**C5. Copying anyone's dialect.** "Bênaa" belongs to Bonheiden and "sjotten" belongs to Zemst-Sportief as
much as to anyone. The transferable thing is the *decision to write in the local register at all* — the
words have to be ours, sourced from actual Elewijt usage, or it reads as costume.

---

## 7. Open questions for Kevin

1. **Kantine facts.** What are the actual opening hours (or is "open tijdens clubactiviteiten" the honest
   rule)? Payment methods — Payconiq, card, cash-only? Is there a phone number we can publish? Who runs it,
   and is that person nameable on the site?
2. **Entry prices.** What does a home first-team match cost at the gate, and does it include a drinkbon? What
   do youth matches cost? Are there abonnementen? Is publishing these a decision the board needs to make?
3. **Parking and access.** Is there a preferred route to Driesstraat 32 on a busy matchday, and a place
   people should *not* park? Anything shared with a neighbouring club or facility?
4. **Which pitch.** Post-renovation, how many pitches are there, what are they called locally, and can we
   state which team plays where? (Relevant to the Ring TV report that Zemst co-invested in artificial turf
   for KCVV Elewijt and FC Zemst Sportief.)
5. **Afgelastingen.** When a match is called off, who currently decides and how is it communicated today?
   And crucially: **does ProSoccerData actually expose a cancelled/postponed status** we can render, or would
   this need manual entry in Sanity?
6. **Sponsor rate card.** Are board/shirt/match-ball prices something the club is willing to publish? Bonheiden
   publishes exact euros; some boards would rather not. If not public, is a "vraag onze tarieven" page with
   the *tiers* named still worth it?
7. **UiTPAS / kansentarief.** Does Zemst run UiTPAS, and is KCVV a partner? If not, what *is* the club's
   answer to a family that cannot afford lidgeld — is there a discretionary arrangement we can describe?
8. **Volunteers.** What roles are genuinely open right now, and is there a named person willing to be the
   contact on the page? (A volunteer page with a generic inbox converts nobody.)
9. **Vertrouwenspersoon.** Does the club have a designated API/vertrouwenspersoon, and can they be named
   with a direct contact route?
10. **Honour content.** Are there club records for jubilarissen, 100/250-match milestones, or past
    kampioenenvieringen that an editor could work from — or would this require research the club has not
    done? (PRODUCT.md forbids fabricating honours, so "we don't have the records" is a valid answer that
    kills B2.)
11. **Old Stars / wandelvoetbal / G-voetbal.** Muizen runs walking football; Hofstade and Kampenhout run a
    G-ploeg. Does KCVV have anything comparable — veterans, walking football, G-team — that our `/ploegen`
    tree does not currently surface?
12. **Elewijt idiom.** Is there a local pronunciation, nickname or phrase for Elewijt or the club that
    members actually use, in the way Bonheiden uses "Bênaa" and Meise uses "Maazz"? That is the raw material
    for A7 and it cannot be researched from outside.
13. **Podcast.** Is there anyone who would actually record and edit one every month? If the honest answer is
    no, B7 should be closed rather than parked.
