# Club website platforms and templates — what the default gives you for free

> **Provenance.** Produced by a sub-agent of the synthesis research pass on 2026-08-13. Its parent
> agent was killed by an API session limit before it could fold these findings into
> [`belgian-club-websites.md`](./belgian-club-websites.md), so this file preserves the report as
> delivered. Every claim was fetched first-hand; fetch failures are stated rather than guessed around.
>
> **Why this matters.** This is the line between *genuinely differentiating* and *merely present*.
> Anything listed here as shipping in a default template is not a competitive advantage for
> kcvvelewijt.be — and anything listed as missing from every platform is an open goal.

## Fetch status — what could and could not be read

Could **not** be read, stated plainly:

- `https://www.wix.com/website/templates/html/sports/soccer` — **HTTP 404** via both WebFetch and
  curl, as does `/website/templates/html/sports` and
  `/website/templates/html/sports-fitness/sports-teams`. **Wix has retired the soccer template
  subcategory.** The live category is `https://www.wix.com/website/templates/html/sports-fitness`.
- **Wix EUR prices.** `nl.wix.com/premium-purchase-plan/dynamo` (the "Prijs" link on Wix's Dutch
  site) is a 7 KB JS shell; its `WIX_SERVER_DATA` blob decodes to
  `{"basename":"/premium-purchase-plan/dynamo","locale":"nl","geo":"BE",...}` — Wix correctly
  geo-detected Belgium but renders prices client-side. `nl/de/fr.wix.com/plans` all 404. Chrome MCP
  timed out. **Wix's own USD figures only are reported below.**
- Gridiron Squarespace template pages: squareforge.net **403**, pixelhaze.academy **404**. Only
  search-snippet level detail available.
- Squarespace `Plus` tier appears in the pricing JSON-LD **in USD only** — no EUR offer object was
  emitted for it.

## 1. Wix

### Templates actually on offer

`https://www.wix.com/website/templates/html/sports-fitness` (fetched, NL locale) ships **13
templates**: Zwemtrainer LP (Energetisch), Personal Trainer (Dynamisch), Online Yogalessen
(Illustratief), Sport Merchandise Store (Solid), Fitness Blog (Energetic), **Football Blog (Green)**,
Martial Arts Courses (Dynamic), Chiropractor (Soft), Sports Blog (Dynamic), Zwemblog (Blauw), Martial
Arts Classes (Bold), Pilates Studio (Refined).

The only football item is a *blog* — "Good for: Football Blog, Sports News, Athletic Community, Fan
Forum". **There is no football-club template in Wix's sports category.**

Surviving club-ish templates (fetched individually), with Wix's own "Good For" text:

| ID | Name | Good For (verbatim) |
|---|---|---|
| [2218](https://www.wix.com/website-template/view/html/2218) | Sports Team | "Kids sports teams, youth athletic leagues, camps, and programs." |
| [4376](https://www.wix.com/website-template/view/html/4376) | Soccer School (Energetic) | "Soccer Schools, Sports Academies, Youth Sports Programs, Coaching Services" |
| [4068](https://www.wix.com/website-template/view/html/4068) | Sports Club (Luxurious) | "Sports Clubs, Fitness Centers, Athletic Teams, Recreational Facilities" |
| [1444](https://www.wix.com/website-template/view/html/1444) | Soccer Fanclub | "Sports teams, athletes, and fans" |
| 635 / 1411 | Soccer Club / Football Fansite | **404 — retired** |

### Exact section list, from the live demos

**Sports Team** — [wix.com/demone2/youth-baseball](https://www.wix.com/demone2/youth-baseball).
Pages: `home, team, schedule, schedule-1, coaches, contact, event-details, members-area,
fullscreen-page`. Nav: `HOME TEAM SCHEDULE COACHES CONTACT More... Log In`. Homepage sections:
hero → "ABOUT US" → "MEET THE TEAM" → Instagram feed → "UPCOMING GAMES" (three cards, each with a
**BUY TICKETS** button) → "COACH'S CORNER" → "HIGHLIGHT REEL" video channel → newsletter signup →
contact.

**Soccer Fanclub** — [wix.com/demone2/soccer-fanclub](https://www.wix.com/demone2/soccer-fanclub).
Pages: `home, news-blog, single-post, team, fan-gallery, contact`. Nav: `HOME NEWS BLOG TEAM FAN
GALLERY CONTACT`. Sections: "NEWS & UPDATES", "Picture of the week", a hand-typed "Next Game"
scoreboard (`Arenal FC v Ramblas FC / 24.08.2023`), goal video, 1/3 gallery.

Note what the page maps *do not* contain: no standings, no results archive, no player profile type,
no season.

### Relevant Wix apps

- [Wix Events & Tickets](https://www.wix.com/app-market/web-solution/events) — "Free to install",
  3.4★ / 1,241 reviews. Tickets & RSVPs, recurring events, seating-map builder, branded PDF tickets,
  Wix Payments/PayPal/Stripe, mobile check-in. This powers the "UPCOMING GAMES" block.
- [Wix Bookings](https://www.wix.com/app-market/bookings) — appointments, classes, memberships,
  packages.
- [Wix Members Area](https://www.wix.com/app-market/web-solution/members-area) — profiles, order
  history, gated content.

### Pricing

From [wix.com/plans](https://www.wix.com/plans), verbatim: Free **$0**; Light **$17/mo**; Core
**$29/mo**; Business **$39/mo**; Business Elite **$159/mo**. Footnote: *"Prices and currency vary by
location. USD prices displayed for reference only. Displayed prices are for yearly subscriptions,
paid in full at the time of purchase."*
[Tooltester](https://www.tooltester.com/en/reviews/wix-review/prices/) (updated 11 May 2026)
reproduces the same four USD figures and notes SEPA direct debit is available in Europe. **EUR
figures for BE remain unverified** — a search snippet from websiteplanet.com claimed
€14/€25/€34/€149 but no Wix-owned page would load to confirm it, so treat it as hearsay.

## 2. Squarespace

**There is no football/soccer/club template in Squarespace's own store.** On
[squarespace.com/templates](https://www.squarespace.com/templates) every occurrence of the string
"Sports" sits in the global *Solutions* nav and footer, never in the template list itself.

[squarespace.com/solutions/sports](https://www.squarespace.com/solutions/sports) names its six
sub-audiences: **Personal Trainers, Yoga Studios, Sports Coaches, Sporting Goods, Fitness Centers,
Sports Camps** — all commercial fitness businesses. Its feature list is scheduling/recurring
sessions/packages, email campaigns, SEO, checkout/pay links/invoices, memberships, product sales. It
**mentions no leagues, fixtures, standings, or club membership administration**. Sub-pages confirm
the taxonomy: `/solutions/sports/fitness-centers`, `/personal-trainers`, `/sporting-goods`,
`/sports-camps`.

Football clubs therefore buy **third-party** templates — e.g. Gridiron
([squareforge.net](https://www.squareforge.net/squarespace-templates/p/gridiron-squarespace-template),
403; per search snippet: widescreen hero, game report, fixtures, headlines, team profiles, partner
logos, photo gallery, signup CTA, plus "Sports Navbar" and "Sports Theme Summary Blocks" plugins) and
the Fás X Fís
[Sports Team template](https://creativemarket.com/F%C3%A1sXF%C3%ADs/7102181-Sports-Team-Template-for-Squarespace)
(homepage, contact, news, store, video, link-in-bio, 404, cookie/GDPR).

### Pricing — real EUR, from Squarespace's JSON-LD

Extracted from the `Offer` objects on [de.squarespace.com/pricing](https://de.squarespace.com/pricing):

| Plan | Monthly | Annual |
|---|---|---|
| Basic | **€14** | **€108** |
| Core | **€20** | **€168** |
| Advanced | **€30** | **€252** |
| Plus | $65 (USD only in markup) | $588 |

Page also advertises "Take 20% off any new website plan" and one free year of domain registration on
annual plans.

## 3. WordPress — the only stack that actually models football

### SportsPress (ThemeBoy) — free core

[themeboy.com/sportspress](https://themeboy.com/sportspress/) ·
[wordpress.org/plugins/sportspress](https://wordpress.org/plugins/sportspress/) · **10,000+ active
installs** (wp.org); ThemeBoy claims "Downloaded over 60,000 times and proudly powering 7,000+
websites."

**Post types:** Teams/Clubs, Players, Staff, Events, Venues, Seasons.

**Core features** (wp.org list, verbatim items): Equation Builder · Club Profiles with Player List ·
Automated League Standings with Club Logos · Events (Fixtures & Results) with Player Performance ·
Events Calendar · Player Profiles & Statistics · Player Lists · Staff Profiles · Select Current Club
and Previous Clubs · Season Archives · Venue Information & Maps · Statistics & League Table Columns
Configuration · Sport Presets · Club-vs-Club / Player-vs-Player mode · CSV import of Events, Clubs,
Players, Staff · shortcodes menu in editor · iCal · WPML certified.

**Pro-only modules:** Tournaments, Timelines, Scoreboard, **Sponsors**, Staff Directories, Team
Access, Team Colors, League Menu, Twitter, Branding, Duplicator, Multisite.

**Pro pricing** ([themeboy.com/sportspress-pro/pricing](https://www.themeboy.com/sportspress-pro/pricing/),
USD): Club **$99** (1 site, 1 yr updates) · League **$199** (unlimited sites, 1 yr) · Agency **$499**
(unlimited, "free updates *forever*"). Renewal at 50%; 30-day refund.

### Themes

- **ThemeBoy Football Club** ([themeboy.com/themes/football-club](https://www.themeboy.com/themes/football-club/))
  — player profiles, standings, fixtures & results, automated league tables, roster list/gallery,
  per-player stats, event calendar, Google Maps venues. Standard **$59** / Developer **$119** /
  Lifetime **$299**.
- **Top Club** ([themeforest.net/item/…/19668343](https://themeforest.net/item/top-club-soccer-and-football-sport-theme-for-wordpress/19668343))
  — SportsPress-based. Events, Teams, League Tables, Player Profiles, Staff Profiles, Player Lists,
  Event Details & Statistics, **Sponsors and Partners Section**, WooCommerce shop, Max Mega Menu,
  custom login page, media archive, one-click demo import. Regular **$45** / Extended **$1,600**.
- **Splash** (StylemixThemes) — $59, **5.5K sales**, four demos (basketball/baseball/football/soccer),
  SportsPress + WPBakery + WooCommerce
  ([themeforest](https://themeforest.net/item/splash-basketball-sports-wordpress-theme/16751749),
  [stylemixthemes](https://stylemixthemes.com/wp/wordpress-sports-theme/)).
- **Rockon / Clubsport**: no authoritative product pages found; searches returned only listicles.
  Not verified.

Market shape from
[themeforest.net/category/wordpress?term=football+club](https://themeforest.net/category/wordpress?term=football+club):
Trophy $79 (431 sales), GoalKick $89, Atleticos $89 (321), Footclub $59, Football Club Soccer $59,
Soccer Acumen $59, KicknGoal $59, Splash $59 (5.5K), Sports Club $59 (874), Conquerors $69 (617),
Khelo $49 (863), Gridiron $69 (292), TopScorer $85 (699), Ornaldo $59 (395), EagleElite $90 (184),
Calcio $69, Soccerclub $49, SpoClub $69, FC United $79 (2.4K), Escobars $99. **Range $39–$109,
clustering $49–$89.**

## 4. Real Belgian & Dutch club sites — platform verified from markup

### VV Dirkshorn (NL) — WordPress wrapping Sportlink

[vvdirkshorn.nl](https://www.vvdirkshorn.nl/) · `<meta name="generator" content="WordPress 5.5.3">`
and `<meta name="generator" content="Nexus Themes | Redesign Sportlinkclubsites">` — a WordPress
theme purpose-built to wrap **Sportlink**, the KNVB's member-administration system. That is the
giveaway: the Dutch market solved fixtures/standings by integrating the federation's system, *not*
with SportsPress.

Real nav, verbatim: `Club` → `Algemeen · Clubinfo · Accommodatie · Geschiedenis · Archief ·
Jeugdlotto · Sportkleding`; `Nieuws`; `Organisatie` → `Bestuur · Commissies · Waarderingswand ·
Vertrouwenspersoon · Jaarverslagen`; `Regels en afspraken` → `Nix 18 · Huishoudelijk reglement ·
Privacy policy`; `Vrijwilligers`; `Herinneringsbank`; `Evenementen`; **`Wedstrijdzaken`** →
`Programma · Uitslagen · Afgelastingen · KNVB Speeldagenkalender · Verslagen · Vervoer ·
Kantinediensten · Zaterdagcoördinatie · Scheidsrechters`; `Teams` → `Senioren veld (1 - Zondag,
2 - Zondag, VR1 - Zondag)`, `Jeugd veld (JO19-1, MO15-1, O14-1, O12-1, O9-1, O7-1, Kabouters)`,
`Senioren zaalvoetbal`; `Sponsoring` → `Sponsoren · Word sponsor`; **`Lidmaatschap`** → `Lid worden ·
Afmelden of Aanpassen · Contributie · Volwassenen/kind fonds`; `Achterban`; `Contact` →
`Aanspreekpunten`.

Rendered quality: functional but dated — news cards carry a raw view counter (`134 keer gezien`, `0`)
and `[Lees meer]` in literal brackets.

### KFC Merelbeke (BE) — WordPress + Elementor

[kfcmerelbeke.be](https://www.kfcmerelbeke.be/) · `<meta name="generator" content="Elementor 4.2.2">`.
**94 menu items in one nav** — the classic Elementor club-site failure mode, where photo albums get
promoted to top-level navigation.

Verbatim: `Home · Ticketing · 1e Elftal (VIP Spelersvoorstelling, Voorbereiding 2026-2027, Kalender,
Abonnementen, Shirts – equipment, Mooiste thuisshirt, Medische staff, A-Kern, Foto-albums, Foto Album
Stage A-Kern 2026-2027, Foto Album KFCM – KAA GENT 27 06 2026, Foto Album KVK Ninove – KFCM
26 04 2026, Verslagen) · Teams (Reserven A, Dames) · Jeugd (KFCM SFEERVAK, Contacten Jeugdbestuur,
Onderbouw, Middenbouw, Bovenbouw, Missie en visie, KFCM Beleidsplan 2022, Panathlonverklaring,
Protocolakkoord, Organigram Jeugddepartement, Medewerkers) · Clubinfo (Bestuur, Organigram,
Clubcontacten, Vertrouwenspersoon API, AANGIFTE ONGEVAL, Stadions, Clubarts, Clublokaal De
Vriendenkring, GDPR PRIVACYVERKLARING, Cookiebeleid (EU)) · Sponsors (KFCM Businessclub) · Lees
Nieuwsbrief`. Homepage sections: `UPCOMING MATCHDAY - Croky Cup` / `KOOP TICKETS` / `CLUBNEWS &
EVENTS`.

### FC Assenede VZW (BE) — WordPress + WooCommerce

[fcassenede.be](https://www.fcassenede.be/) · `WordPress 7.0.4` + `WooCommerce 11.0.1`. Nav: `Home ·
Nieuws · Activiteiten (Kunstgras Actie) · Evenementen (Evenementen kalender, Tornooien, Stages,
Inschrijvingsformulier Zomerstage 2026) · Fanion (Eerste Elftal Heren en Reserven, Eerste Elftal
Dames) · Jeugd (U6, U8B, U8A, U9A, U11, U12, U13, U15, U21) · Info (Bestuur, Intern Reglement,
Trainers) · Sponsors · Formulieren (Inschrijving (nieuwe) leden, Formulier verplaatsen wedstrijd,
Ongevallenformulier) · Contact`. A live WooCommerce cart sits in the header (`Bekijk winkelmand ·
Afrekenen · Subtotaal: € 0,00`) — the club bolted on a shop because nothing native handles money.

### KFC Witgoor Sport (BE) — WordPress + Twizzit

[witgoorsport.be/club](https://witgoorsport.be/club/) · `WordPress 7.0.4` + `WooCommerce`, and
critically it loads **`app.twizzit.com`** — the Belgian club-administration SaaS. Its nav proves the
per-team duplication problem: `EERSTE ELFTAL → Eerste elftal / Kalender Eerste Elftal / Klassement
Eerste Elftal`, then `BELOFTEN A → Beloften / Kalender Beloften A / Klassement Beloften A`, then
`RESERVE B → Kalender Reserve B / Klassement Reserve B`. **Three hand-made menu entries per team.**

### KV Diksmuide-Oostende (BE) — WordPress + Elementor

[kv-do.be](https://kv-do.be/) · Elementor 4.2.2. Nav: `Club (Ploegen: KVDO A, KVDO B (Talenten),
Beloften, Famkes A/B/C · Bestuur · Verhaal · Stadion · Merchandising · Sociale projecten ·
Supporters · Presskit · Contact) · Kalender (per ploeg) · Business (Partners, Partner worden,
Wedstrijd Lunch) · Organiseren (Bedrijfsevent, Privé-event, Zaalverhuur, Kleedkamer, Pressroom, New
Club 31, Boardroom, Kama Business Center, Spektakelzaal) · Nieuws · Webshop`. Homepage: `VOLGENDE
MATCH` / `KALENDER 26-27` / `NIEUWS` / `ONZE SPONSORS` / `KOOP NU JE ABONNEMENT!`. Best-looking of
the WordPress set.

### BBC Assenede (BE) — Wix, and it is damning

[bbcassenede.wixsite.com/bbcassenede/ploegen](https://bbcassenede.wixsite.com/bbcassenede/ploegen) ·
`<meta name="generator" content="Wix.com Website Builder"/>`. This is a basketball club — **despite
many searches, no Belgian or Dutch amateur *football* club on Wix could be found**, which is itself a
finding. Three artifacts visible in the fetched markup:

1. **Page slugs**: `home, nieuws-en-activiteiten, ploegen, u8, u10r, u10t, u12, u14, u18,
   kleuterbasket, heren-senioren, sponsors, formulieren, bestuur-en-contact` — plus
   **`kopie-van-heren-senioren`, `kopie-van-j16a`, `kopie-van-u10a`, `kopie-van-u14a`,
   `kopie-van-u14b`, `kopie-van-u8a`**. Literally "copy-of-" pages. Wix has no team content type, so
   every team is a hand-duplicated static page.
2. **Footer**: `© 2023 by Name of Site. Proudly created with Wix.com` — the placeholder was never
   replaced, and the copyright is three years stale.
3. **A Wix ad banner on the club's own site**: `Deze website is gebouwd op Wix. Maak de jouwe vandaag
   nog. Aan de slag`.

Body copy admits the gap outright: *"Om het programma van je ploeg te zien klik je op kalender en zo
door naar programma"* — go elsewhere for the schedule.

### Others checked

KFC Houtvenne [kfchoutvenne.be](https://www.kfchoutvenne.be/) — custom build, no WP/Wix markers;
cleanest nav of the lot: `Home · Wedstrijden · Ploegen (1e Nationale, 3e Provinciale, Beloften,
Houtvenne jeugd) · Nieuws · Club · Vacatures · Contact`. KFC Damme = One.com Web Editor. KFC Muizen =
webhero.be. KFC Lint / KFC Wambeek Ternat = bespoke (Wambeek links out to **ProSoccerData** and
**Trooper**).

### The incumbent that beats all three

[VoetbalAssist](https://www.voetbalassist.be/clubwebsite/) — "De nummer 1 clubwebsite voor elke
amateur voetbalvereniging", **~1,202 clubs across NL + BE**, website + app + narrowcasting, **37
modules** including match reports, live scores, player statistics, team rosters, lineups, player
career tracking, **volunteer task scheduling**, tournament management, locker-room scheduling,
cancellation notices, webshop, crowdfunding, digital forms, member profiles, contribution/lidgeld
handling. Nav: `Mogelijkheden · Voor wie? · Diensten · Tarieven · Over ons · Demo · Contact`. No
price on the page — gated behind a demo request.

## What these templates conspicuously LACK

**Wix and Squarespace lack the domain entirely.** Neither has a fixture, result, standings, season,
or player entity. Concretely:

- No **league standings** at all — not synced, not even manual. The Wix "Sports Team" demo's
  `UPCOMING GAMES` is three Wix Events records typed by hand, each ending in *BUY TICKETS*; the
  Soccer Fanclub demo's "Next Game" is static text reading `24.08.2023`.
- No **results archive** and no **season** concept — nothing rolls over in July.
- No **team content type**. Wix's answer is `kopie-van-u14a`: duplicate the page. Squarespace's is
  the same. Every new youth team is manual labour, forever.
- No **player profiles or squad numbers**, no per-player stats, no staff type.
- No **federation integration** — no Voetbal Vlaanderen / KBVB / KNVB feed, so fixtures and standings
  are retyped weekly or the club links away (BBC Assenede: *"klik je op kalender en zo door naar
  programma"*; KFC Witgoor: a separate `Klassement <team>` page per team).
- No **member administration or lidgeld**. Squarespace's sports page offers "membership billing" for
  gym subscriptions, not seasonal club dues with family discounts and federation registration. Wix
  Members Area is profiles and gated content only. This is why the real sites bolt on WooCommerce
  (FC Assenede), Twizzit (Witgoor), ProSoccerData (Wambeek Ternat) or Sportlink (Dirkshorn).
- No **volunteer scheduling** on any of the three platforms — no kantinediensten, no scheidsrechter
  roster, no zaterdagcoördinatie. VoetbalAssist ships this; VV Dirkshorn has hand-built pages for all
  three.
- No **sponsor tiering** — sponsors are an image grid. Even SportsPress puts Sponsors behind the $99
  Pro paywall.
- No **afgelastingen / cancellation broadcast**, no per-team ICS.

**WordPress + SportsPress closes most of the sporting gap** — fixtures, results, automated standings,
players, staff, venues, seasons, iCal, CSV import — but still lacks: federation sync (standings are
*auto-calculated from events you enter yourself*, not pulled from Voetbal Vlaanderen), member
administration, lidgeld collection, volunteer scheduling, and sponsor management below the $99 Pro
tier. The real-world evidence backs this: **not one of the five Belgian/Dutch WordPress club sites
fetched runs SportsPress.** They run Elementor plus an external admin SaaS, and pay the
per-team-page tax by hand.

**Total realistic cost of the WordPress route:** theme $45–$99 + SportsPress Pro $99/yr + hosting + an
admin SaaS (Twizzit/ProSoccerData/Sportlink) — versus Squarespace at €108–€252/yr or Wix at
$17–$39/mo, both of which cannot represent a fixture list at all.
