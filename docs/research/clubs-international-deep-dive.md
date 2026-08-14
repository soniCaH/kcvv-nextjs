# Non-Belgian small clubs — deep dive (England, Iceland, Faroes, Japan, Germany, Spain, USA, Ireland)

> **Provenance.** Produced by a sub-agent of the international-benchmark research pass on 2026-08-13.
> Its parent agent was killed by an API session limit before it could fold these findings into
> [`clubs-international-benchmark.md`](./clubs-international-benchmark.md), so this file preserves the
> report as delivered. 31 clubs read first-hand; fetch failures are stated rather than guessed around.
> `grep` confirms none of the Japanese, German, Icelandic or Faroese material below appears in the
> parent file — this is additive, not duplicate.

**Method.** Every claim comes from a page actually fetched (WebFetch, plus `curl` for markup/CSS-level
evidence). Nothing is written from memory of a site.

## Part A — England

### 1. Dulwich Hamlet FC — Isthmian Premier (tier 7)

Read: `dulwichhamletfc.co.uk/` · `/site-map` · `/club-info/club/club-history` ·
`/club-info/matchday/matchday-faq` · `/club-info/community/community` · `/club-info/community/get-involved` ·
`/club-info/club/for-programme-editors` · `/commercial/fan-sponsorship` · `/teams/mens-squad` ·
`/latest-news/live` · `/latest-news/management-notes` · `/latest-news/2025-hall-of-fame-entries` ·
`/features/edgar-claude-harry-the-gang` · `/club-news/introducing-the-dulwich-hamlet-history-group` ·
`/fixtures/ticket-prices`

- **The 24-question Matchday FAQ is the best "first visit" page found in Europe.** It answers things
  no club writes down: *"Are trolleys/buggies/pushchairs allowed?"*, *"Are there nappy changing
  facilities available?"* — *"Yes. This is located in the main bar"*, *"Are dogs allowed into the
  stadium?"* — *"We do welcome dogs but with last season's sell out Saturday crowds, some dogs may
  find it too busy and noisy, they may prefer to visit on our Tuesday evening games or our Sunday
  matches."* It ends with *"I fancy a real day out, not just the match. What else is there in the
  area?"* and lists the Horniman Museum and Borough Market.
- **A supporter-run History Group with official club backing, and a Hall of Fame with published
  rules.** Founder members named; remit is *"articles for match-day programmes"*, ensuring *"important
  anniversaries are suitably recognised and celebrated"*, and running the Hall of Fame. Criteria:
  recognition is *"for service to Dulwich Hamlet. Achievements elsewhere are not taken into
  consideration"*, candidates considered *"five years after they have left the club"*, max five per
  year, decided by a History sub-committee. 2025 inductees include *"LORRAINE 'PA' WILSON"* and
  *"THE LLOYD BROTHERS"*.
- **A hundred-year anniversary feature by the club historian, in a real voice.** *"Corinthian player
  Claude Ashton – who could play goalkeeper or centre forward but preferred wing-half – scored the
  other four England goals! Claude was one of four brothers who all played first class cricket. When
  three of the Ashton Bros. represented Cambridge University at football in 1920, the team were
  widely referred to as 'Ashton Villa'."*
- **A twinning section with a German club as a standing nav item** — 100 years since the first meeting
  with Altona 93 in 1925, with a fundraising quiz night, a lawn-bowls competition, a travel guide and
  an interview with Altona's Jan Stöver.
- **A page written for other clubs' programme editors** — pre-packaged kit descriptions, squad lists
  and history in **2000-word and 500-word versions** plus a separate women's 500-word version, all
  downloadable.
- **Fan sponsorship as a real product ladder, priced publicly**: *"£150 'Lucky Dip' player"* or
  *"£200 choose your own player"*, *"£350 men's + women's double pack"*; ball sponsorship *"£250
  weekend fixtures"* including *"the chance to Present the match ball"*. Every squad entry carries
  *"Sponsored by"* or *"Available to Sponsor"* — including one reading *"Luke Stanley and Will
  Phillips (AKA The Detectorists)"*.
- **Manager and chairman columns republished from the printed programme** as a nav category: `VIEW
  FROM THE DUGOUT`, `CHAIRMAN NOTES`.
- **Match Centre Live** = countdown timer + team sheet + *"LIVE RADIO — DulwichHamletRadio is on
  Mixlr"* + embedded league table.
- **Graphics (from raw markup):** navy `#1d355f`/`#1e3760`, club pink `#f3a6c9`, red `#ec0000`;
  display face **Oswald** (condensed) over **Basier Circle** body. 89 `<img>`, only 2 `<svg>` —
  photography-led, no illustration system. **No skip link; 14 of 89 images have no `alt`.**
- Weakness: squad cards have **no photo, no number, no bio, no stats** — just name, position, sponsor.

### 2. Clapton Community FC — Essex Senior League (tier 9 men / tier 6 women)

Read: `claptoncfc.co.uk/` · `/about/` · `/transparency/` · `/accountability/` · `/committees/` ·
`/membership/` · `/volunteer/` · `/equalities-policy/` · `/ground-regulations/` · `/donate/` ·
`/programmes/` · `/youth-training/` · `/clapton-cfc-player-appearances-the-hall-of-fame/` ·
`/clapton-cfc-honours-and-records/` · `/tag/in-memoriam/` ·
`/the-international-brigades-memorial-at-the-old-spotted-dog-ground/`

**The most content-complete amateur club site found anywhere.** The About page is a manifesto in nine
capitalised sections:

> **OPEN** — *"Anyone can become a member. Prices are £1/year youth, £6 concession, £12 regular, with
> £24, £36 and £48 'solidarity' options… We have over 1500 members in 30+ countries."*
> **FLAT STRUCTURE** — *"There is no hierarchy at Clapton Community FC… We replaced the traditional
> Board with a General Organising Committee."*
> **EQUITY** — *"There is no hierarchy between our women's and men's first teams either. In everything
> we do, from budget and resources to our comms, we give each the same amount of love."*
> **TRANSPARENT** — *"We publish our monthly finances on our website. This includes everything from
> large purchases like the warehouse next to our ground, right down to stationery!"*
> **PAY-WHAT-YOU-CAN** — *"Clapton Community FC will never price anyone out of football. We will always
> try to give an option to pay-what-you-want (down to zero)."*
> **LEARNING** — *"We don't get it right all of the time. But we do have the Accountability and Welfare
> committees to help."*

- **Transparency is monthly, not annual** — monthly income-and-expenditure statements back to 2018,
  full accounts for FY2024 and FY2023, special reports on the 2020 ground purchase and 2023 warehouse
  purchase, and a note that *"nearly £8000 from trans solidarity keeper shirt sales"* was donated.
- **Nineteen committees, each with a described remit and its own public email address** — including
  `Accountability`, `Welfare`, `EDI`, `International` (*"Builds relationships with overseas clubs"*),
  `Club Development`. The homepage contact form's first field is **a dropdown to pick which committee
  you want.**
- **An Accountability Agreement, passed unanimously in 2018, that every member signs**: *"Accountability
  means that each of us is ready, when challenged about how we act and how we speak, to take on board
  other's points of view, take responsibility for our actions and make amends."*
- **Volunteer recruitment that names its own demographic problem**: *"As women, people of colour, young
  and working-class people are currently underrepresented across our structures, we particularly
  encourage underrepresented members of our community to join and volunteer for CCFC."* Roles are
  concrete and low-commitment — packing merch orders on Wednesdays, wearing a hi-vis and answering
  questions (*non-enforcement*), editing highlights remotely.
- **A Hall of Fame based purely on appearances** — *"players receive a bronze, silver and gold medal
  after they hit 50, 100 and 150 competitive appearances"*, counted **across women's and men's teams
  together**, friendlies excluded. Two columns: Player, Apps. A hall of fame a club founded in 2018
  can actually have.
- **An In Memoriam tag with eleven entries since 2019**, headline format `RIP <name>`. Plus a
  **physical memorial** at the ground — a red granite monument to 16 local International Brigades
  volunteers, unveiled 26 April 2025, with a page giving each name a biography (*"Charles Cormack
  (1912-1938): Killed at the Battle of the Ebro on his 26th birthday"*).
- **Donation copy in slang**: *"A quid (£1) a month"*, *"A fiver (£5)"*, *"A tenner (£10)"*, *"A score
  (£20)"*.
- **Eight teams handled by one mega-menu** where each team gets identical children: News / Fixtures and
  results / Playing squad / Coaching staff / Table / **Play for the team** / Admission prices / Match
  programmes. Squad tables carry Age, Apps, **POTM**, Goals, Assists, Reds, Yellows.
- **Graphics (raw markup):** self-hosted `galano_grotesque_full_bold`; **0 `<svg>`, 47 `<img>`**. But:
  **the only site in the whole study with a working skip link**, `lang="en-GB"`, `<main>`, 41
  lazy-loaded images, 1 missing alt out of 47. Best accessibility hygiene of the cohort.

### 3. FC United of Manchester — Northern Premier (tier 7), co-operative

Read: `fc-utd.co.uk/` · `/manifesto` · `/ownership` · `/community-shares` · `/every-voice-matters` ·
`/volunteering/our-vision` · `/travel/hub` · `/development-fund-barrels` · `/fund-the-foundations` ·
`/disabled-supporters`

- **The Manifesto is seven numbered rules, published as a page, not a PDF.** Verbatim: *"The Board will
  be democratically elected by its members." / "Decisions taken by the membership will be decided on a
  one member, one vote basis." / "The club will develop strong links with the local community and
  strive to be accessible to all, discriminating against none." / "The club will endeavour to make
  admission prices as affordable as possible, to as wide a constituency as possible." / "The club will
  encourage young, local participation - playing and supporting - whenever possible." / "The Board will
  strive wherever possible to avoid outright commercialism." / "The club will remain a non-profit
  organisation."*
- **Homepage copy is a single grammatical device applied to every section** — *Stronger United* /
  *Shirts, united* / *Supporters, united* / *Co-owners, united* / *Community, united* / *Our partners,
  united* / *Fans, united*. And: *"100% fan-owned from day dot… Because the more of us united, the
  stronger we are."*
- **Micro-fundraising as a catalogue of eleven named schemes**: Donate, Development Fund, Fund the
  Foundations, Fund the Team, **Barrels**, Easy Fundraising, **Foreign Currency**, Holiday Draw,
  **Pound for the Ground**, FCUM Lottery. *Barrels* is the charmer: *"At various places around
  Broadhurst Park you will find our Development Fund red barrels, the perfect place for that jar of
  loose change sat in the back of a cupboard at home"* — located at three named spots, *"counted after
  every home fixture and updated on the FC United website"*, running total **£32,710**.
- **Community shares raised over £2 million** to build the ground, and *"shareholders have donated
  several hundred thousand pounds worth of shares to the club."*
- **A "Travel Hub" that argues a position rather than giving a postcode**: six modes
  (bus/tram/train/bicycle/foot/car), with stated goals *"Be a model neighbour… Reduce car travel…
  Reduce carbon emissions."* Away travel runs on **supporter-run coaches** from three pickup points.
- **"Every Voice Matters" is a suggestion box** — online plus *"A physical box will also be available
  at the Membership Stall next season."*
- Campaign nav items `Unite for Access`, `Period Poverty`, `Women's Safety Charter`, `White Ribbon`,
  plus `/the-pink` (the fanzine) and `/fc-radio`, **could not be fetched** — URL guesses 404'd. No
  claims made about their content.

### 4. Lewes FC — Isthmian Premier (men, tier 7) / FA WNL South (women, tier 4)

Read: `lewesfc.com/` · `/our-ethos/equality-fc/` · `/equal-fa-cup/` ·
`/our-ethos/anti-gamblification-of-football-campaign/` · `/club-information/finances/` ·
`/ownership/become-an-owner/` · `/fan-behaviour-policy/` · `/teams/women/` · `lewesfcprog.com/`

- **The women's team is listed above the men's team in the primary nav.** That single ordering decision
  does more work than any statement on the site.
- **Equality FC, verbatim**: *"the first, and still the only, football club in the world to commit to
  paying its men's and women's first teams equally."* … *"Equal playing budgets. Equal everything.
  It's not impossible."* … *"Equality FC was never about spending money in exactly the same way. It was
  always about valuing people equally."* … *"It wasn't a publicity stunt. It was a statement about the
  kind of club we wanted to be."*
- **Equal FA Cup — a campaign built on two published numbers.** *"The men's FA Cup prize fund is more
  than £23.5 million, while the Women's FA Cup receives just over £6.1 million."* A Lewes win in the
  women's third round earns *"£35,000"* against *"£121,500"* for a men's club at the same stage. The
  proposed fix is specific — *"a modest levy on the larger transfer fees in English football"* — and
  the sign-off is the whole campaign in one line: **"An Equal FA Cup isn't just fairer for women. It's
  fairer for football."**
- **Anti-gambling campaign built on one before/after sentence**: *"In 2004 a young person watching
  football saw little advertising for gambling. Today, a young person watching football sees
  advertising for gambling all the time."* … *"In the UK, 450,000 11-16 yr olds gamble. At least 55,000
  are already addicted."* Their sponsor wall carries **Gambling with Lives** and **Coalition to End
  Gambling Ads** as partners.
- **Finances page opens by naming the problem it solves**: *"the inner financial workings of a football
  club tend to be a bit of a black box."* Then **fourteen years of audited accounts as PDFs for both
  entities** (2011–2024).
- **Ownership as a tiered product with a physical artefact**: Owner £50/yr digital; **OwnerPlus £100**
  with a gift box (*"owners' badge, certificate, physical card, and exclusive green beanie"*);
  **Lifetime £1,000**; **Junior £20** including *"Panini sticker album, meet-the-players events,
  player-of-the-month voting"* — honestly flagged: *"(No voting rights per club rules.)"*
- **Fan behaviour policy that explicitly protects banter before it prohibits abuse**: *"Jokes and high
  spirited teasing of opposition or officials is part of creating a home atmosphere that favours our
  own team."* Then zero tolerance on discrimination.
- **A free digital matchday programme on its own domain, `lewesfcprog.com`**, one post per fixture,
  split Men's/Women's, **authored by supporters** (bylines `rookranger`, `shreylfc`) — with a
  **"Programme Editor Downloads"** page for opposition editors.
- **Graphics (the best evidence in the study):** Lewes runs a real **OKLCH design-token system**:
  `--clr-red: oklch(53.496% 0.20164 17.98)` with a full `red-50 … red-950` ramp plus `neutral-800/950`,
  semantic aliases (`--clr-surface`, `--clr-borders`, `--clr-text-accent`, `--button-clr-surface`), and
  typography tokens `--font-display: 'Rakesly'` / `--font-body: neue-haas-unica` served from
  **Typekit**. **25 `<svg>` vs 21 `<img>`, 20 `srcset`, 0 missing alts.** A tier-7 club running a
  modern token system.
- Weakness: **no `<main>` element, no skip link**; squad cards carry only name / position / number /
  *"This player is available to sponsor"*.

### 5. Forest Green Rovers — National League (tier 5)

Read: `fgr.co.uk/` · `/club-charter` · `/eco-park/` · `/news/`

- **The famous eco positioning barely exists as site content.** The homepage sells it through the
  **partner wall** (Ecotricity, Vegan Society, Quorn, Reflo) and one line — *"Join the official forum
  of the world's greenest football club"*. There is **no sustainability section, no vegan-menu page, no
  eco news category**. The identity is carried by logos.
- **The Eco Park page is the exception and it is well written**: *"Plans for the stadium itself have
  been designed by the world-renowned architectural practice Zaha Hadid. Although it has a modern
  aesthetic, Eco Park will be made almost entirely from wood – nature's renewable building material."*
  … *"Around 500 trees and 1.8km of hedgerows will be planted at the site to promote biodiversity."*
  And an unusually human closing note: *"Our home for so many years, we will be sorry to leave The New
  Lawn, but we hope to leave a positive legacy on the site for our local community."* Illustrated with
  **architectural renderings** rather than photography.
- **The Club Charter is a genuinely useful genre** — one page combining football conduct, community,
  environment, equality, safeguarding, ticketing, disability provision, refunds, crowd safety,
  merchandise, complaints (*"Investigations conclude within 28 days"*, escalation to the Independent
  Football Ombudsman) and a charity-request policy with its own inbox. It names a **Supporter Liaison
  Officer** and a **Disability Liaison Officer** by name.
- **Graphics:** a full condensed display family — `Zuume Regular / Medium / Bold / Extra Bold / Light /
  Extra Light` **plus `Zuume Cut Bold` and `Zuume Cut Extra Bold`** — over Open Sans, with `#9bcf2c`
  green. The most committed *typographic* system of the English clubs.
- **Worst accessibility in the study:** homepage has **no `lang` attribute at all**, no `<main>`, no
  `<nav>`, **zero `aria-label`s**.

### 6. Hashtag United — Isthmian (tier 8)

Read: `hashtagunited.co.uk/` · `/our-story/` · `/community/`. Note: the site **403s to `curl`**
(Cloudflare) but serves WebFetch.

- **Tagline is a joke and a thesis at once: "MAKe FOOTBALL FUN AGAIN"** — rendered with deliberately
  irregular capitalisation across the site (`gET yOURS nOW`, `26/27 kit drop`). Typographic mischief as
  brand.
- **Origin story in short declarative punches**: *"This club didn't start in a boardroom. It started on
  YouTube."* … *"The matches went online. The views started climbing. Hundreds of thousands. Now
  millions."* Sign-off: **"Built for fans. Powered by content. Driven by community."**
- **They sell the ground by its commute**: *"You can literally see the pitch from the station bridge."*
- **Volunteer recruitment uses audience size as the incentive**: *"With over 5.3 million followers
  watching our journey, you'll be at the heart of one of the most exciting projects in football…"*
- **The site itself is thin.** Five nav items; everything else exiled to the footer. **Over 50 youth
  teams exist but the site gives them almost nothing.** For a club whose whole thesis is content, the
  *website* is the least content-rich part of the operation — a cautionary finding.

## Part B — Sweden

### 7. Östersunds FK — Superettan (tier 2)

Read: `ostersundsfk.se/` · `/csr/kulturakademi/` · `/category/kultur/` · `/jag-fattar/` ·
`/bli-medlem/` · `/standut/` · `/historia/` · `/uppdrag-vision/`

- **The Culture Academy is a nav section, a news category, and a stated theory of football.** *"2012
  startade ÖFK Östersunds Kulturakademi. Syftet med kulturakademin är att vi med genom att få verka på
  andra arenor än fotbollsarenan ska utvecklas som människor och därigenom kunna vinna fler matcher
  både på och vid sidan av fotbollsplanen."* [In 2012 ÖFK started Östersund's Culture Academy. The
  purpose is that by working on arenas other than the football arena we develop as people, and thereby
  can win more matches both on and beside the pitch.] And: *"Kultur är en viktig del i
  samhällsbyggandet och är en grund för demokratisk ordning."*
- **Twelve years of projects listed as a public record**: 2013 a theatre production plus a book, *"My
  Path to ÖFK"*, with 45 participants; 2014 an art exhibition on *"Strength Through Diversity"*; 2015 a
  modern-ballet Swan Lake; 2016 a gala for refugees (1,500 attendees); 2017 a Sámi culture project
  (1,700 spectators); 2018 a musical with Glada Hudik Theatre; 2019 a revue on Jämtland's history; 2024
  a dance film, *Flockflykt*. **All surpluses donated.**
- **The players' own words are the content.** Headline: *"Årets kulturprojekt: 'Vi kommer ut ur vår
  fotbollsgarderob'"* [We're coming out of our football wardrobe]. Player Henrik Norrby: *"Det här är
  bra för oss som grupp. Vi kommer närmare varandra och så är det skönt att tänka på något annat än
  fotboll ibland."* Another headline: *"Från svettiga benskydd till graciös koreografi"* [From sweaty
  shinpads to graceful choreography].
- **"Jag Fattar!" — an anti-bullying schools programme run by the club, for ages 11-16**, delivered as
  school workshops **with ÖFK players present**, anonymous surveys, group discussion; participants get
  a diploma and a match invitation.
- **Membership pitched as an emotional question**: *"Är ditt hjärta röd-svart och du följer laget i
  både med- och motgång? Då ska du teckna medlemskap i ÖFK!"* Individual 200 kr, **family (3-7 people
  in the same household) 300 kr**. Plus **"Ständut"** — lifetime membership at 5,000 kr, payable in
  instalments. The word *Ständut* is itself the product name — untranslatable club slang as a nav item.
- **History structured as ten named eras**, including the post-2018 decline years listed one by one — a
  club that publishes its fall as well as its rise.
- **Weaknesses:** `/uppdrag-vision/` is one sentence and a PDF link. `/kultur/` renders **empty**.
  Markup: **15 of 76 images have no alt, zero `srcset`, zero lazy-loading**, no `<main>`, no `<nav>`.

## Part C — Iceland & Faroe Islands

Fetch notes: **`breidablik.is` 403s to WebFetch** (read via `curl`). **`hb.fo` returns HTTP 454 to
`curl`** (read via WebFetch). **`vikingurgota.fo` does not exist** — no DNS record; the live site is
`vikingur.fo`. `hb.fo/felagid/sogan`, `ki.fo/bumerkid`, `nsi.fo/bumerkid-og-litir`,
`vikingur.fo/felagid/sogan` and `/felagid/vidtokur` all 404.

### 8. Stjarnan (Garðabær, IS — tier 1, multi-sport)

- Nine top-level nav items, **seven of them sports** — and the eighth is `ÆFINGATÖFLUR` [training
  timetables], ranked equal with the sports. **Built for parents on a Tuesday, not for matchday.**
- Every sport folder gets the **identical child template**: `FRÉTTIR · BARNA- OG UNGLINGASTARF ·
  MEISTARAFLOKKUR KARLA · MEISTARAFLOKKUR KVENNA · ÞJÁLFARAR · STARFSMENN OG STJÓRN`. Men's and
  women's senior teams are **always adjacent siblings**.
- Youth page leads with scale and coach credentials: *"eitt það fjölmennasta á landinu með u.þ.b. 1.000
  iðkendur"* [approx. 1,000 participants], all coaches *"hafa ýmist lokið UEFA-A eða UEFA-B gráðu"*.
  Mission: *"skapa faglega, jákvæða og uppbyggilega umgjörð fyrir iðkendur okkar til að þroskast, dafna
  og ná árangri – hver og einn á sínum eigin forsendum."* [each one on their own terms.]
- **The club's big tournament is openly framed as the youth section's fundraiser, credited to parents.**
- **A published sustainability/inclusion policy mapped to UEFA's 2030 strategy**, with a concrete
  equality clause: *"æfingatími, búnaður, þjálfun og æfingaaðstaða er sú sama hjá hverjum aldursflokki
  óháð kyni"* [training time, equipment, coaching and facilities are the same in every age group
  regardless of gender].
- **Volunteer recruitment written as a signed personal essay**, including an admission: *"Mér hefur
  þótt minna um sjálfboðaliða og vanta frekara handbragð kvenna í starfinu."*

### 9. Breiðablik (Kópavogur, IS — tier 1, 13 divisions)

- **Best multi-sport IA found anywhere: 13 divisions grouped into five buckets** — `Bardaga` [Combat] ·
  `Fjölþættar` [Multi-discipline] · `Hugar` [Mind] · `Liðs` [Team] · `Þrek` [Endurance]. Turns an
  unscannable list into five reasonable groups.
- **A sourced, footnoted year-by-year history 1950-1998 that leaves its own uncertainty on the live
  page**: *"Heimildum ber ekki saman"* [The sources do not agree], and literal `???????` markers. It
  records mundane detail: *"Félagið gaf út eitt tölublað af fjölrituðu blaði sem nefndist Geisli og var
  því dreift um bæinn"* [The club published one issue of a mimeographed paper called Geisli,
  distributed around the town].
- **Nine named honours classes with published regulations**, including a **`Prúðmennskubikar`** — a cup
  for good conduct, not performance.
- Registration page **teaches the third-party app** rather than linking it (with video), and says out
  loud which divisions haven't updated their fees yet.

### 10. KR Reykjavík (IS — tier 1, 14 divisions, founded 1899)

- **Hall of fame with a one-line biography per person going back to 1924.** Sample: *"Kristján L.
  Gestsson · 1929/1959 · Formaður 1923-1932, Íslandsmeistari 1919, 1926 og 1927. Tvívegis gerður að
  heiðursfélaga !"* — the exclamation mark is on the live page.
- **A donations page that does the tax arithmetic for the donor**, with a worked example, then
  **thirteen bank account numbers — one per division** — so a donor chooses which sport receives it.
- **A parent-facing safeguarding page that is a routing table with a named person's email**, not a
  policy PDF, and separate public mailboxes `abending@kr.is` [report] and `hugmynd@kr.is` [idea].
- Design warning: Duda-built, loading a **large speculative Google Fonts payload** (Cabin, Amiko,
  Fahkwang, Playball, Rozha One, Homemade Apple, Space Grotesk) plus a self-hosted `Larken`.

### 11. Valur (Reykjavík, IS — tier 1, three sports)

- **`Börn & unglingar` [Children & youth] is a top-level nav peer of the three sports**, not a child of
  any of them.
- **One match-centre component filtered by sport *and* gender** — anchors are `#football-men`,
  `#football-women`, `#handball-men`, `#handball-women`, `#basketball-men`, `#basketball-women`. Equal-
  rank filters, not a default plus an opt-in.
- **A low-commitment on-ramp in the registration copy**: *"Nýjum iðkendum er heimilt að koma og prófa í
  nokkur skipti áður en gengið er frá skráningu"* [New participants may come and try a few times before
  registration is completed].
- **A subsidised club bus as a first-class content type** — *Frístundakstur – Valsrúta*, moving
  6-9-year-olds from after-school care to the facility, with its own address `bus@valur.is`.
- Under `Fótbolti` sit **`Ársreikningar` [annual accounts] and `Söngvar` [songs]**; under `Um Val` sits
  a standing **`Minjanefnd`** — a club heritage/relics committee.
- Weakness: **no squad rosters at all.**

### 12. Fram (Reykjavík, IS — women's tier 1 / men's tier 2, seven sports, founded 1908)

- **The honorary-members table publishes induction years back to 1918 and marks the dead with `(L)`
  [látinn]** — one table doing hall-of-fame and memorial duty at once.
- **The youth council is a directory of real people**: `STAÐA · NAFN · SÍMANR. · TÖLVUPÓSTUR`, seven
  names, all with personal email addresses. Seven of seven are women.
- **The document layer is the substance**: a youth handbook PDF, a coaching-policy PDF, a
  **criminal-record-check policy**, and the handball division's own magazine *Gríptu* archived by
  issue. `/arsreikningur/` publishes **the football division's own annual accounts.**
- Fixtures run on a real events system with **venue pages and an iCal export** (`/events/?ical=1`),
  mixing women's and men's fixtures in one chronological stream.
- **`/sagan/` [History] and `/styrkir/` [Grants] render a heading and nothing else** — a club founded in
  1908 with an empty history page.

### 13. Víkingur Reykjavík (IS — tier 1, eight divisions, founded 1908)

- **The strictest URL grammar in the study**: every one of eight divisions gets
  `/<division>/aefingagjold/`, `/aefingatafla/`, `/stjorn/`, `/thjalfarar/` [fees · timetable · board ·
  coaches]. Learn it once, find anything.
- **The best "what will this cost me" page found.** Four columns (`Flokkur · Janúar–Ágúst · Afsláttur
  vegna systkina · Athugasemd`), exact figures per age group, a 10% sibling discount, and a comment
  column stating what's included: *"Innifalin er allur ferðakostnaður vegna keppnisferða á vegum KSÍ"*
  [All travel costs for KSÍ competition trips are included]. It names the municipal grant against the
  price: *"frístundastyrkinn frá Reykjavíkurborg en hann er kr. 75.000- fyrir árið 2026."*
- **It publishes the awkward parts too** — payment deadline, removal from the system, and *"Iðkendur
  með ógreidd æfingagjöld fá ekki að keppa fyrir hönd Víkings"* — and then this, the single best
  sentence found in the entire study:
  > *"Mikilvægt er að hafa samband við Knattspyrnufélagið Víking ef um fjárhagserfiðleika er að ræða og
  > finna úrlausn sem leiðir til áframhaldandi þátttöku iðkandans."*
  > [It is important to contact Víkingur if there are financial difficulties, so we can find a solution
  > that lets the participant continue.]
- **Safeguarding as a full essay with three separately defined terms** and two unusually specific
  equality commitments: *"Að veita báðum kynjum tækifæri á að æfa jafn mikið og jafn oft"* and *"Sömu
  laun eru greidd fyrir sambærilega vinnu karla og kvennaflokka"* [The same wages are paid for
  comparable work with men's and women's groups]. Plus a line addressed to migrant families and **two
  named reporters with job titles**.
- **A seven-language switcher — `IS · English · Polski · Español · Yкраїнський · عربي · Tiếng Việt`** —
  powered by Google Translate. Fake localisation, but the language *list* is a direct read of who
  actually plays there.
- **One season ticket covering both the men's and the women's top-division home games**, stated in the
  same sentence.
- **`/knattspyrna/saga-deildar/` is Icelandic lorem ipsum, live in production**, under real year
  headings (1908, 1934, 1940-1956). They built the timeline and never wrote the history.

### 14. HB Tórshavn (FO — tier 1, ~50 teams, 500-600 players)

- **The honest solution to 50 teams**: `Felagið · Dystir · **MeistaraDeildin menn** · **MeistaraDeildin
  kvinnur** · **Hini liðini** · Tíðindi · Shop · English`. The two senior teams get equal top-level
  billing; the other ~48 go in one bucket called *"The other teams"* — with a maintenance disclaimer
  instead of stale data.
- **`Felagið` is governance, not an "about us"**: `Starvsnevndin · Ungdómsnevndin · Álitisfólk ·
  Limaviðurskifti · HB-stuðlar (with their own regulations and bylaws) · Heiðurslimir · HB-húsið ·
  Søgan`. A separately constituted supporters' body **with published statutes**.
- **A staff job advert published as a front-page news article** — *"Vilt tú vera hjartað í umsitingini
  hjá HB?"* [Do you want to be the heart of HB's administration?] — with a deadline, an application
  address, and **a named contact plus mobile number**, sitting between match reports.
- News mixes first-team business with supporter logistics: *"HB bussurin koyrir til Klaksvíkar"* [The HB
  bus is driving to Klaksvík], *"Stroyming HB-Motherwell"* [Streaming].

### 15. KÍ Klaksvík (FO — tier 1, town pop. ~5,000, founded 1904)

- **The only media-first nav in the cohort**: `Tíðindi · **KÍ Varpið** [KÍ Broadcast] · Lið · Video ·
  Dystir · Akademi · Søgan · Felagið · Fjepparar · Nethandil`. Governance is eighth.
- **Player cards carry `Leiktíð` [minutes played]** alongside apps, goals and assists — *"KLETTSKARÐ
  Páll Andrasson · 36 ÁR · 24 · Leiktíð 2106 · Mál 12 · Uppl. 11"*. Minutes played is the stat that
  tells a squad player they matter, and almost nobody publishes it.
- **Membership separates *playing* from *voting*, prices by age with a sibling discount, and states
  where the discount stops**: *"Syskinaavsláttur á 300 kr. pr. systkin eftir fyrsta barn, er galdandi
  fyri spælarar í U5-U17"*, then *"Tvs. at avslátturin telur ikke við um systkin leika við í U21 ella
  vaksnamannadeildunum."* Dormant/supporter membership at 500 kr. buys **an AGM vote without playing.**
- **The supporters' section is a nine-year match photo archive indexed by European tie** — *"KÍ 3 - 1
  Bodø Glimt // Champions League Q1.2 2022"* — plus `Leikvøllir` [Grounds] and Football Manager entries.
- **The history quotes the 50th-anniversary book, to the minute**: *"Klaksvíkar Ítróttarfelag varð sett
  á stovn 24. august 1904 kl. 17.30…"*
- **Two live failures:** `/limaskapur` leaks raw CMS errors to visitors (*"Ease Template Warning:
  template variable "0" not found…"*) where the contact block should be; `/english` is **one orphan
  Wikipedia paragraph under a Faroese nav**.

### 16. B36 Tórshavn (FO — tier 1, 20 teams, founded 1936)

- **Twenty teams, boys' and girls' ladders structurally symmetrical**, plus two ends nobody builds: a
  pre-competitive *Fótbóltur og spæl* [football and play] for those *"fødd 2020 og seinni"*, and **three
  veterans' teams including an Old Girls side**.
- **Every team page is the same six-tab template**, with welcome copy that states eligibility and offers
  a trial in one breath: *"Um tú hevur hug at spæla við U9-gentum hjá B36, ert tú vælkomin at møta upp
  til okkara venjingar. Tú ert eisini vælkomin at royndarvenja í 2 vikur áðrenn tú meldar teg til."*
- **A per-team price list with a visible last-updated stamp** (*"Dagført 8. november 2025"*), two
  staggered deadlines by age, **men's and women's first divisions at the same price on adjacent lines**,
  and the two inclusive groups priced at **`Einki` [Nothing]**.
- **The disability team `Fótbóltur fyri øll` [Football for everyone] has a page as ordinary as any
  other**, with two named coaches and a head youth coach's mobile number.
- Governance fully named and free: youth committee of nine (five women), chairman with direct mobile,
  **statutes published as HTML**. The `<title>` is literally **`B36 – #VitEruB36`** — the hashtag is the
  tagline.

### 17. NSÍ Runavík (FO — tier 1, >600 members, town pop. ~4,000)

- **A five-item nav: `Forsíða · Menn · Kvinnur · Ungdómur · Dystaryvirlit`.** Men, Women and Youth as
  three top-level peers — the cleanest expression of equal billing found anywhere, and free to copy.
- **A public brand kit.** `/media` offers *"NSÍ búmerkið · Tak niður í vektor"* [download in vector] as
  RGB and PANTONE files, and specifies the club colour four ways: *"Pantone: Yellow C · HEX: FEDD00 ·
  CMYK: 0, 12, 100, 0 · RGB: 254, 224, 0 · **RAL: 1026**"*. A 600-member club publishing a RAL paint
  code.
- **Full statutes §1-§14 as readable HTML**, including colours as a constitutional fact (*"Litir
  felagsins eru gulir og svartir"*), a voting age, honorary members' free entry, and a dissolution
  clause directing surplus to youth work in the municipality.
- **The history names the volunteers, including the drivers**: *"Umframt øll tey mongu, sum íðka ítrótt
  í NSÍ, er eisini eitt ótal av sjálvbodnum hjálparfólkum… eitt nú við at koyra børnini til dystir, sum
  eru á útivølli."* [among them parents who make a great effort, for instance by driving the children to
  away matches.] It also tells the shrinking story honestly — rowing and handball spun off in 1998.
- **Signup is an inline form with three role checkboxes — `Leikaralimur · Fjeppari · Fjeppara familja`**
  [Playing member · Supporter · **Supporter family**] — and error copy in the club's own voice: *"Hov!
  Okkurt riggaði ikki - vinarliga royn aftur."* The `<title>` is the motto: **`NSÍ – Saman standa vit
  sterk!`** [Together we stand strong!]

### 18. Víkingur Gøta (FO — tier 1, merged 2008, ~600 members) — site is `vikingur.fo`

- **The smallest nav in the study — three items** — and inside `Meistaradeildin`, **`Kvinnur` is listed
  before `Menn`.**
- **The one thing they refused to cut is the songbook**: seven club songs, each a download, including
  *"Tjúgu null átta"* [Twenty-oh-eight] — the merger year, commemorated as a song. No youth pages, no
  fees, no board list. **Seven songs.**
- **The merger told as process, not myth**: a four-person working group (*"tvey úr Gøtu og tvey úr
  Leirvík"*), a members' vote, a founding AGM where *"Umleið 180 limir møttu til fundin"*, then three
  separate reveal events — **the name chosen on 4 February from 18 submitted proposals**, the kit
  colours in February, the badge on 27 February in the Leirvík village hall. Plus the honest reason for
  merging: *"tað… at gerast truplari og tyngri at reka eitt lítið felag við høgum málsetningum."* [it is
  becoming harder and heavier to run a small club with high ambitions.]
- **Visibly two-speed:** the fixtures widget and league table are current for 2026; the newest article is
  dated **06.04.2025**. The most recent human-written post is youth training times — which is the
  correct thing to keep pinned if you can only maintain one.
- **Every sponsor logo rendered in flat black** (`TAVAN Svart`, `Estra Svart`, `Hiddenfjord Svart`) —
  accidentally solving the "30 logos in 30 styles" problem.

## Part D — Japan

**Unreachable, stated explicitly:** **Y.S.C.C. Yokohama** — six URL variants, every one **socket hang
up**; no first-hand data, no claims made. `criacao-shinjuku.jp`, `okinawa-sv.com`, `verspah.com` — **DNS
ENOTFOUND** (real domains are `criacao.co.jp` and `okinawasv.com`). `suzuka-pg.com` — ECONNRESET. **FC
Osaka** — returned a J.League login stub only. Tegevajaro's `/sustainability/` and `/team/player/` both
404; `naraclub.jp/team/` returned nav chrome only.

### 19. Iwaki FC — J2 (risen regional → JFL → J3 → J2)

- **The single most stealable pattern found anywhere: one match URL that is a matchday *guide* before
  kickoff and a match *report* after.** Before: 「当日のスケジュール」 (`14:30` booths open, `15:40` queue
  forms, `16:00` general admission, `18:04 前半キックオフ`), 「会場マップ」 zones A-O, 「会場のグルメ情報」
  20+ stalls priced ¥200 ice cream to ¥1,300 curry (`常磐サバ干しフライ ¥550`, `なみえ焼そば ¥700`),
  「会場のブース紹介」 including 「はじめての熱狂体験ブース」 [first-time fever experience booth], parking
  counts (1,035+ spaces), shuttle intervals `15:20〜17:40` at `10分~15分間隔`. After: lineups, stats,
  interviews, gallery. **One canonical page per fixture, changing state.**
- **Match reports carry environment data as standard fields**: `入場者数 5,575人` · `天候 曇 ／ 弱風` ·
  `気温 26℃` · `湿度 86%` · **`ピッチ状態 全面良芝`** · `主審 小林 拓矢` · `副審 宇治原 拓也、清水 拓`.
- **監督コメント as structured page furniture, and the manager opens on attendance rather than tactics**:
  「過去最多となる入場者数を更新したということで、たくさんの方にスタジアムにきていただきました。このスタジアムに来ていただいて本当に感謝しています。」
- **A public sponsorship rate card**: `TOP PARTNER ¥20,000,000∼` · `OFFICIAL PARTNER ¥13,000,000∼` ·
  `BUSINESS PARTNER ¥2,000,000∼` · `ASSIST ¥1,000,000∼` · `SUPPORT ¥200,000∼`. No "contact us for a
  pack".
- **Philosophy is top-level nav and Fukushima-specific**: 「スポーツを通じて、社会価値を創造する。」 and
  「浜通りの光となるために」 [To become a light for the Hamadōri region], with five pillars including
  **Reputation & Recovery (風評)** — a commitment no other club would have.
- **Best-in-class accessibility page**: Japan's first named 「Disability Liaison Team (DLT)」, wheelchair
  spaces in two named blocks, free wheelchair loan, a refund-style discount 「大人500円、小中学生300円の返金」,
  and — the detail that gives it away as real — **accessible facilities listed at the motorway service
  areas on the way** (湯ノ岳PA, 四倉SA, 関本PA), including ostomate facilities.
- **The president writes long-form essays under his own byline** — 「ROOM 〜社長の論説〜」, 22 articles,
  e.g. 「変わらないために、変わっていく〜10周年を迎えて」 [Changing in order to stay the same].
- Player fields include `血液型 B型`, `利き足 右`, **`足のサイズ 29`** (shoe size), and a career rendered as
  an **arrow chain starting at the primary-school club**: 「伊奈小針SSS → 大宮アルディージャJr.ユース → …
  → いわきFC」.

### 20. Criacao Shinjuku — JFL (tier 4)

- **Player profiles are personality interviews, not data sheets — the cheapest high-value idea in the
  entire study.** GK 阿部雄太's fields: `ニックネーム あべちゃん` · `血液型 AB` · `兄弟構成 姉/私` [sibling
  composition] · `好きな食べ物 カレー` · `好きな言葉 人事を尽くし天命を待つ` · `サッカーを始めたきっかけ
  1998年のW杯を観ていて川口能活選手がかっこよかったから` [Watching the 1998 World Cup — Kawaguchi looked so
  cool] · three *separate* fields for `影響を受けた選手` / `衝撃を受けた選手` / `影響を受けた指導者` [who
  influenced you / who *shocked* you / which coach shaped you] · `特技 ピアノが弾けるんです。高3まで先生に
  習っていました。` [I can play piano — I had a teacher until my final year of school] · `ファンへの
  メッセージ`. **No photographer required. A squad can fill this in on a phone in ten minutes.**
- **Absurd ambition stated in the fourth tier, which is the point**: 「目の前にある当たり前のことを真摯に
  積み上げ、新しい価値を創造する集団を目指し、世界一のFootball Clubへ。」 [toward the world's number-one
  football club.] Tagline: **"Enrich the World."**
- **Hometown work segmented by *human group*, each justified with a demographic fact**: 子ども / 学生 /
  高齢者 (Shinjuku has the third-highest count of elderly people living alone in Japan; players run
  exercise programmes in care homes) / 外国人住民 (~10% of residents hold foreign citizenship).
- **An eight-tier membership ladder including a ¥2,000 「Remote」 tier for supporters who can't attend and
  a free 「Academic」 tier for students.**
- **Nav is verb-phrased, not noun-phrased**: 「クラブを知る」 [Get to know the club] and 「応援する」 [Support
  us] instead of "About" and "Sponsors". Invitations, not filing cabinets.

### 21. Kamatamare Sanuki — J3

- **A hometown programme with a countable annual target**: 「まいにちカマタマ」 [Kamatama every day] —
  「年間で365回のホームタウン活動の実施」 [365 hometown activities per year]. Includes morning greeting
  campaigns at school gates and autism-awareness days. **And it publishes the inbound booking form** —
  any school or festival can email six specified fields to book players in.
- **A published *playing* philosophy** alongside the club philosophy, plus 12の価値 grouped
  inward/outward/service.
- **The stadium is a top-level nav section with five children** — access, **stadium food**, **first-time
  guide**, watching guide, and **the training ground gets its own page**.
- **The first-time guide answers questions before they're asked**: 「百年構想リーグとは･･･」 [what even *is*
  this league] → maps → timetable. **Seats are sold as experiences with a sentence each**:
  「チームを勝利に導くカマタマーレサポーターのための応援席 B席」 [the singing end]. It even advises learning a
  few player names first.
- **The mascot has a profile page with joke stats**: `身長 うどん職人の腕次第` [Height: depends on the udon
  chef's skill] · `体重 うどんの玉数によって増減` [Weight: rises and falls with the number of udon portions].
- Five-tier fan club, ¥1,000 junior floor to ¥150,000 **capped at 40 members**, plus a **支援持株会**
  (supporters' shareholding association) as a normal nav item, and 「夢パス」 [Dream Pass] free entry for
  kids.

### 22. Nara Club — J3

- **The volunteer corps is a *team* in the TEAM menu, alongside the first team.** 「volundeer」 — a pun on
  volunteer + deer — and **the name was chosen from suggestions submitted by the volunteers themselves**.
  Entry criteria (16+, guardian consent for minors, at least one home game), a specific duty list, **a
  flat ¥1,000 travel stipend**, 10% merch discount, a membership card and a name badge, sign-up by Google
  Form. A complete, copyable volunteer programme.
- **A slogan the players coined**: 理念 「サッカーを通じて、奈良の未来を共に創る」 and slogan 「共創」
  [co-creation], invented by players in 2016.
- **A seven-tier sponsor wall with the long tail deliberately visible** — roughly **185+ named
  companies**, plus a separate 「サポートショップ」 scheme for local shops that display a sticker and give
  members discounts.
- **The organisation page is a governance page**: dual entity (株式会社 + NPO法人) with both founding
  dates, **board lists for both including external directors and auditors**, and a 1991-2025 timeline.
  **Explicitly absent: no financials.**
- **Sustainability on a separate subdomain** (`sx.naraclub.jp`), three pillars with SDG numbers,
  including **blood drives**, 子ども食堂 [children's canteens] and **produce donated to food banks**.
- Fan community tiered **by role, not price**: ファンクラブ → アンバサダー → **エヴァンジェリスト**.

### 23. Tochigi City FC — J2

- **Bilingual nav lock-ups fused into single words**: 「最新情報NEWS」「試合情報MATCH」「観戦案内WATCHING」 — a
  two-tier typographic rhythm on every nav item.
- **The hometown page defines its own term before using it**: 「地域に根ざした社会貢献活動を「ホームタウン活動」
  と呼んでいます」, then **names the four municipalities and the month each joined** (Tochigi City original;
  Mibu June 2022; Ashikaga February 2025; Sano September 2025). Activities include a **grand-golf
  tournament** (an old people's sport) and players handing out flyers at Tochigi Station.
- **Emblem meaning documented** — three lines for the three rivers 「巴波川、思川、渡良瀬川」 forming a "T". And
  **a club that publishes its relegation in the same timeline as its promotions**.
- Player grid: number prominent, kanji name with an ideographic space, romaji surname capitalised
  (`HARADA Yoshinobu`), fixed **210×200px headshot on neutral ground**, position sections written as
  「GK−ゴールキーパー」 — **abbreviation plus katakana expansion, so a newcomer learns what GK means for
  free.** Staff sit in the same grid.
- **No philosophy page at all** — the weakest of the Japanese set on that axis.

### 24. Okinawa SV — JFL (tier 4)

- **A fourth-tier club monetising its geography**: a separate agriculture company 「沖縄SVアグリ株式会社」 with
  the strapline 「スポーティな農業で沖縄を元気に」, a `/coffee/` line, and a separate domain
  `soccer-camp.okinawa` selling Okinawa's winter climate as a training destination.
- **The name is the philosophy**: 「沖縄 Sport-Verein」 — a Japanese club deliberately wearing a German
  club-name convention, founded 2015 by ex-Hamburg/Frankfurt striker Naohiro Takahara.
- **Honest negative:** `/about/` has **no philosophy or vision statement in any language** — company
  registration and executive titles only. `/player/` was **"Coming Soon"**.
- Sponsor banners sit **above** the primary nav in the header — a Japanese habit European clubs would
  find brash.

### 25. Tegevajaro Miyazaki — J3 (partial; two pages 404)

- **サステナビリティ sits at top level next to sponsors**, and **photos are paired with goods**
  (「グッズ・フォト」) — a matchday photo archive treated as a product.
- **Persistent floating action buttons (Schedule / Tickets / Goods) that follow the scroll**, plus a
  「Beginner's spectating guide」 module on the homepage itself.

## Part E — Discovery: remarkable clubs found by search

Fetch notes: `detroitcityfc.com` returns an **empty shell** (use `detcityfc.com`). **`bohemianfc.com`
has an expired TLS certificate**; the readable site is `bohemians.ie`. `rslpz.de` **does not exist**
(real domain `rotersternleipzig.de`). `tebe.de` intermittently returns **HTTP 429**.
`unionistascf.com/transparencia/` publishes the budget **as an image** with no downloadable audit.
`detcityfc.com/matchday/digital-program/` has **no programme content**.

### 26. Bohemian FC — Dublin, Ireland (LOI Premier; member-owned since 1890)

- **A costed social-impact report, with the number on the website**: an *"estimated social value of at
  least €51 million, representing a significant return on investment of €8.5m per year"*, volunteer
  effort valued at *"just under €2.3 million"*, based on surveying 1,400+ people and organisations.
  Membership grew *"from 929 in 2018 to 3,102 in 2023"*.
- **The community page opens with a hard stat, not a platitude**: *"In 2025, Bohs in the Community
  worked with 6,865 people across 15 programmes with 751 hours of direct engagement."* Fifteen named
  programmes in six categories, including **Pride On The Pitch**, **Walking Football**, **Down Syndrome
  Futsal**, **VI Football**.
- **Ownership in plain sentences with prices on the same page**: *"Members own 100% of the club and elect
  a Board of Directors from within the Membership at each year's AGM."* Adult €400 / Family €640 /
  Student €250 / Senior €100 / Associate €100, with instalments, and *"an exclusive member's pin badge
  each year."*
- **Mission stated as a verb**: *"to use football as a force for good"*, organising principle **"Football
  for All"**, running *"without private investor backing, relying on the active citizenship of our
  supporters."* They also print Dalymount Park's older nickname — *"Pisser Dignam's Field"* — on an
  official page.
- **Biggest cautionary finding in the study:** `/our-history/` promises *"An ever-growing library of
  articles written by Club Historian Gerry Farrell"* — and **every article reads "Coming soon…"**. Their
  famous kit-design storytelling (Fontaines D.C./Focus Ireland, Bob Marley, Palestine) is **not on the
  club site at all**.

### 27. Detroit City FC — USA (USL Championship + USL W + UPSL; ~2,700 supporter-shareholders)

- **A memorial page for dead supporters, with a family submission form.** *"A bittersweet aspect of our
  growth as a club is that over the years, we have lost members of our community-in-soccer."* ~15
  people, each with a photo and a 1-3 sentence tribute — one *"a proud season ticket holder for over 7
  years"*, another *"was buried in Rouge and Gold"*. Families submit *"their name and photo to the
  club"* via a form. Found nowhere else.
- **The A-to-Z Matchday Guide — 42 alphabetised entries** covering Accessible Seating, **Breast Feeding**
  (*"a breast-feeding tent… located behind the Box Office and adjacent to Gate 2"*), Bag Policy, Bar
  Directory, Cameras, Children Tickets, Drinking Fountain, Firearms, First Aid, Food, Gate Times,
  Giveaways, Lost & Found, March to the Match, Mobile App, Parking, **Pets & Service Animals**,
  **Post-Match Autographs**, Prohibited Items, Re-Entry, Restrooms, **Strollers**, Ticketing, VIP Food
  Vouchers, **Water Bottles** (*"Empty water bottles are allowed inside the stadium for use at the water
  fountain"*), Will Call. **An alphabetised FAQ beats a wall of ground regulations.**
- **They publish a directory of other people's bars**, including non-alcoholic options — paired with
  **March to the Match**: *"supporters meet at Motor City Sports Bar to march together through the
  streets of Hamtramck, while drumming, chanting, and singing all the way to Keyworth Stadium"*, with
  start point, address and time. Sign-off: **"LE ROUGE GOES MARCHING!"**
- **"Le Rouge Legacy Numbers" — a permanent, algorithmic archive of every player who ever played.**
  *"Numbers 1-11 were assigned alphabetically to the players who made up the first competitive Detroit
  City FC Starting XI, which played against AFC Cleveland on May 12, 2012."* Then the tie-break rules
  are published: substitutes *"listed in order of the minute they enter the match"*, and if
  simultaneous, *"in the order they enter the pitch."* Currently at **#237**, presented year by year,
  2012-2026. **Costs almost nothing and grows forever.**
- **Five named pillars in the first person**, incl. *"Creativity In Our Expression"* and *"Detroit City
  Above All"*, an explicit commercial commitment to *"amplifying and supporting"* Black-owned businesses.
- **The mascot has a backstory, an email address and a booking form**: Friendly the Bear was *"once
  discarded in a dumpster, was rescued"*; contact `Friendly@detcityfc.com`. Their asset names reveal a
  design vocabulary: a named **"Legacy Crest"**, colours called **"Rouge and Gold"**.
- **Weakness:** overwhelmingly photographic, essentially **zero illustration**; the bar directory's
  business names are **baked into images**, so unsearchable and invisible to screen readers.

### 28. BSG Chemie Leipzig — Germany, Regionalliga Nordost (tier 4), 2,816 members

- **A six-point Leitbild headlined with alliterative pairs.** Title: **"Wir sind Chemie. Wir gehen
  unseren eigenen Weg!"** Intro: *"In Leipzig-Leutzsch bieten wir allen ein Zuhause, die einen anderen
  Fußball wollen – über 90 Minuten hinaus."* Principle 1, *Charme & Charakter*:
  > *"Chemie Leipzig ist einzigartig. Nie auf dem allerhöchsten Level, meist der Underdog."*
  > [Chemie Leipzig is unique. Never at the very highest level, mostly the underdog.]

  The rest: *Heimat, Haltung & Hingabe*, *Erfolg, Einsatz & Entwicklung*, *Miteinander* (*"Als BSG
  Chemie Leipzig sind wir eine Familie."*), *Ideenreichtum & Integrität*, *Engagement, Entfaltung &
  Ehrenamt* (*"Das Ehrenamt ist die Basis unseres Vereins."*).
- **The family block described object by object, and it is genuinely charming**: *"einen Unterstand bei
  Regen, Sitzgelegenheiten, eine große Maltafel, einen Sandkasten, einen Maltisch, eine Spielecke mit
  Autos und Holzeisenbahn, Bobbycars"* — plus pram parking, changing tables and **warm tea on cold
  days**. Honest limits stated: *"Es findet grundsätzlich keine professionelle Kinderbetreuung statt,
  die Aufsichtspflicht verbleibt jederzeit bei den Eltern."* Away supporters with children explicitly
  welcome. Sign-off rhyme: **"Vom Säugling bis zum alten Greis – am schönsten ist es bei Grün-Weiß!"**
- **An awareness page that is an operational service**: *"Wir wollen ein Stadionerlebnis für alle und
  einen Sportpark ohne Sexismus!"* — a team **in white vests** stationed at a named spot every home
  game, a matchday phone number, two addresses (`sos@` for support, `awareness@` for general),
  **reachable at away games too**.
- **A real away-fan travel guide, not a map embed**: tram, bus, S-Bahn, the local app, then car and bike
  approaches **from all four cardinal directions**, parking located, **two maps**, and a dated
  construction-closure notice inline.
- **A club museum run as an open archive appeal.** No premises yet, so it lives online as **"Fundstücke
  des Monats"** [Find of the Month], each object photographed and credited to its donor. Wanted:
  scarves, pennants, jerseys, minutes, certificates, **handmade GDR-era fan items**. Recent finds
  include a **1930s pinball machine**. **Jens Fuge is titled "Museumsdirektor."** The cheapest possible
  heritage feature — the members supply the content.
- **Membership with a proper reduced tier and a gift option**: 120 € active with vote, **84 € reduced**
  for *"Studenten, Schüler, Azubis, Rentner, Menschen mit Behinderung, ALG II-Empfänger,
  Leipzig-Pass-Inhaber"*, 1000 € supporting; benefits include **"Deine Stimme für Chemie"**, a logged-in
  channel for members to voice opinions.
- **Mascot-children as a community programme, not a sponsor perk** — open to *"Kinder- und Jugendteams
  anderer Vereine"* [youth teams **from other clubs**], schools, kindergartens: *"Alle können
  mitmachen."*
- **Youth in three named bands** (*Leistungs-* / *Aufbau-* / *Grundlagenbereich*, U23 down to U5) with a
  **Verhaltenskodex** addressed to *"Werte Anhänger, TrainerInnen, Eltern und Kinder"*, carrying
  separate obligations for **the club**, the coaches and the players.
- Public fact-sheet: refounded *"am 16. Juli 1997"*, **2,730 members as of 19 March 2026** with a live
  footer counter at 2,816, *"3 Abteilungen: Fußball, Handball, Kegeln"*, *"15 Fußballmannschaften, davon
  11 Juniorenteams"*.

### 29. Roter Stern Leipzig '99 — Germany, amateur multi-sport

- **The most explicitly political club constitution found, published as numbered theses.** *"Der Rote
  Stern Leipzig '99 ist ein antifaschistisches Sportprojekt. Der Verein organisiert sich selbstbestimmt,
  hierarchiefrei und basisdemokratisch."* Thesis 3: *"Die Maxime ist, dass jedes Kind und jeder
  Jugendliche, der beim RSL spielen möchte, dies kann."* Strapline: **"Das Original – aus dem Kiez"**.
- **A fundraising campaign named with a pun**: **"Moos für Klos"** [roughly "Dosh for Bogs"] — funding
  changing rooms and showers, specified as **gender-neutral toilets**, separate facilities for both
  teams, accessible bathrooms, **solar panels and heat pumps**. A toilet appeal is the least glamorous
  ask there is; the pun and the values list carry it.
- **An incident-reporting channel that deliberately routes away from the club**: antisemitic incidents
  reportable *"unkompliziert, sicher und auf Wunsch anonym"*, and *"Die Meldungen gehen beim
  Bundesverband der Recherche- und Informationsstellen Antisemitismus (RIAS) ein"* — **not** to the club.
  The design lesson: for reports about your own community, route them where the reporter can trust them.
- **Volunteering framed as necessity, not glamour**: recruiting referees with the blunt justification
  *"Ohne diese Leute, gibt es keine Spiele/Wettkämpfe."*
- **The club hosts its own ultras' pages**, including their fanzine **"Todesstern"**, sold at stadium
  stands.
- Scale note: football plus **darts, roller derby, handball, cycling, basketball, volleyball, tennis,
  table tennis, boxing, badminton, running, croquet, children's sport, Kali stick-fighting and boule** —
  all under one nav label, *"more than soccer"*.

### 30. Unionistas de Salamanca CF — Spain, socio-owned phoenix club

- **"Transparencia" is a top-level nav item**, publishing the *ESTATUTOS*, the *"PRESUPUESTO DE LA
  TEMPORADA 24/25"* and an *"AUDITORÍA DE CUENTAS ANUALES 24/25"*. **Execute it better than they do:**
  the budget is posted as an **image**, the audit has **no downloadable link**, and there is **no
  sentence anywhere explaining why they publish it**.
- **Financial discipline as identity, not a footnote**: *"deuda cero"* [zero debt] and *"ha finalizado
  todas las temporadas con superávit"* — positioned deliberately against the mismanagement that killed
  the original UD Salamanca.
- **Membership sold on rights first.** The card page is headed **"LAS VENTAJAS DE SER DEL CLUB"** — *of*
  the club, not *a customer of* it — and the first listed benefit is **"Derecho a decidir"**. Socios have
  voted on **the crest design, the kits and the anthem**. Governance is a 10-person board plus a
  **53-person "Grupo de Trabajo" open to any socio**. Season slogan: **"De Aquí Somos Todos"**.
- **Supporter groups get official standing**: the *Federación de Peñas* operates **under its own
  bylaws**, with eight peñas shown as logo tiles.
- **~20 youth teams presented as a grid of squad-photo tiles**, split Fútbol 11 / Fútbol 7 — scannable,
  and it makes 20 teams feel like a club rather than a dropdown.
- **Graphics warning:** the league table is published as **`ClasificacionJ38.jpg`** — a picture of a
  table. **Do the graphic *and* the real table.**

### 31. Tennis Borussia Berlin — Germany, founded 1902

- **Motto is three English words: "Come As You Are"** — extended on the join page to **"Come as you are.
  And stay!"** They also quote *taz*'s verdict on themselves — *"Erstklassig im sozialen Engagement"*
  [first-class in social commitment] — a good joke for a club that isn't first-class on the pitch.
- **The best pricing idea found: a voluntary solidarity tier baked into the price list, priced in the
  founding year.** Passive *"regulärer Beitrag von 10 EUR"*, reduced *"7,50 EUR"*, and *"regulärer
  Beitrag von 10 EUR + **Soli-Beitrag**"* at a minimum of **19,02 EUR**. Joining and leaving fees are
  also **19,02 EUR**. Active footballers pay *"einheitlich 45 EUR für alle Altersgruppen"* — **one price
  for every age group.** Every number is 1902.
- **They host a national campaign they started**: *"Die Initiative 'Fußballfans gegen Homophobie' geht auf
  die Abteilung Aktive Fans von Tennis Borussia Berlin… zurück."* Launched June 2011; by 2012 the
  **purple banner** had travelled to **30+ clubs** across Germany, Luxembourg, Switzerland and Austria.
- **A proper ground page with history and both fanbases located**: capacity, transport, **away fans in
  Block F**, and home fans placed historically — *"Die TeBe-Fans versammeln sich seit 1999 im Block E auf
  der Gegengeraden."* It also lists **the other users of the ground**.
- Nav ideas worth lifting: an **Auktionen** page (match-worn shirt auctions), **"Lila-weiße Netzwelt"** (a
  curated directory of the club's *own fans'* sites and blogs — linking outward to your community's
  media), and the **Hans-Rosenthal-Elf**, a named legends XI honouring a Jewish entertainer with club
  ties.

### Award schemes — a finding in itself

**There is no credible football-club *website* award.** Searched and checked: the **Football Content
Awards** "Best Football Club (Non-League)" judges **social video, YouTube, TikTok, graphics and
documentaries — websites are explicitly not a criterion**. **Best of Non League**, the **FA Grassroots
Football Awards** and the **UEFA Grassroots Awards** all have **no digital or website category**.
**Pitchero** markets a 15-year non-league partnership, which is precisely why so many non-league sites
look identical. Dutch search surfaced only template vendors (see
[`platform-vendors-and-templates.md`](./platform-vendors-and-templates.md)) — including Impression, whose
own sales pitch is that club sites *"look outdated with the same layout, boring and old-fashioned"*.
**The category is unowned. A genuinely great amateur club site would have no competition to be measured
against.**

## Part F — Cross-cutting patterns

1. **Values are a *page*, not a paragraph — and the good ones are numbered, quotable and signed.** FC
   United's seven manifesto rules; Chemie's six alliterative Leitbild pairs; RSL's six theses; Clapton's
   nine capitalised sections; Detroit's five first-person pillars; the Japanese 理念. **A tiny club can
   say what a big club never would.** Chemie: *"Nie auf dem allerhöchsten Level, meist der Underdog."*
   Criacao: 「世界一のFootball Clubへ」 in the fourth tier. Both work *because* of the tier.

2. **Transparency has three distinct grades, and monthly beats annual.** Clapton publishes **monthly**
   income and expenditure *"right down to stationery!"*; Lewes publishes 14 years of audited PDFs and
   names the problem (*"a bit of a black box"*); Bohemians goes furthest by **costing its social value at
   €51m**; Unionistas has the nav item but publishes a JPG. Japan is the inverse: disclosure is
   **mandatory but league-run**, so clubs publish *governance* and no numbers. Fram and Valur publish
   **per-division accounts**.

3. **Men's and women's teams are siblings, never parent-and-child — and it shows up in structure, not
   statements.** Lewes lists women above men; NSÍ's whole nav is `Menn · Kvinnur · Ungdómur`; Víkingur
   Gøta lists `Kvinnur` first; Valur's match centre exposes equal anchors; HB gives each senior team a
   top-level item; B36 prices both first divisions identically on adjacent lines; Víkingur Reykjavík
   sells **one season ticket covering both**. **Not one of the 31 sites nests women under men.**

4. **The best content is the cheapest to make: text a volunteer can write.** Criacao's player
   questionnaires; Iwaki's manager comment blocks; Detroit's Legacy Numbers; Chemie's Find of the Month;
   Breiðablik's footnoted timeline; KR's one-line biographies; Clapton's appearance-medal hall of fame;
   Dulwich's TEAM TALK Q&As. **None of it needs a photographer.**

5. **The matchday guide is the most under-built page in European amateur football, and Japan and the US
   have solved it.** Iwaki merges guide and report into **one URL that changes state**; Detroit's
   **42-entry A-to-Z**; Dulwich's **24-question FAQ**; Kamatamare's guide that explains what the league
   even is; Chemie's four-cardinal-direction travel page and object-by-object family block.

6. **Money is discussed honestly, with the awkward parts included.** Víkingur Reykjavík publishes fees,
   deadlines, the consequence of non-payment **and a hardship clause**; B36 prints a `Dagført` [updated]
   date and prices two inclusive teams at *Einki* [Nothing]; KÍ states where the sibling discount
   **stops**; Clapton's pay-what-you-can *"down to zero"*; TeBe's **19,02 €** solidarity tier; Iwaki's
   public sponsorship rate card; KR's worked tax example with 13 division-specific bank accounts.

7. **Fan media is real but almost always exiled off-site.** Lewes' progcast on its own domain; Clapton's
   four-page programmes as free PDFs; Dulwich's Mixlr radio; FC United's *The Pink*; Chemie's
   *Fünfeck.FM*; RSL's paper-only *Todesstern*; TeBe's curated directory of its own fans' blogs.
   **Nobody hosts a readable fanzine archive on the club site.**

8. **Memory is the most-promised, least-delivered content.** Bohemians' history library is *"Coming
   soon…"*; Víkingur Reykjavík ships **lorem ipsum** under real year headings; Fram's history page is an
   empty `<h1>`. The exceptions — Breiðablik's footnoted timeline admitting *"Heimildum ber ekki saman"*,
   KR's 1924-onward biographies, KÍ quoting the founding minute, Víkingur Gøta's merger narrative, Fram's
   `(L)`-marked honorary list — are all **text-only and permanent**.

9. **Illustration over photography is essentially untried.** Raw-markup evidence: Clapton **0 SVG / 47
   img**; Dulwich **2 SVG / 89 img**; Detroit *"essentially zero illustration"*; Östersunds **0 srcset, 0
   lazy-load**. The clubs with strong graphic identity get there through **type and colour**, not
   drawing: FGR's `Zuume` family incl. `Zuume Cut`; Dulwich's Oswald + navy/pink; Lewes' OKLCH token ramp;
   NSÍ's published Pantone/RAL; Víkingur Gøta's all-black sponsor wall. **No club in this study has an
   illustration system. The field is empty, not crowded.**

10. **Technical quality is far worse than the reputations suggest.** FGR's homepage has **no `lang`
    attribute, no `<main>`, no `<nav>`, zero aria-labels**; only **Clapton** has a skip link; Lewes and
    Östersunds have no `<main>`; Östersunds ships 15 alt-less images with no lazy-loading; **KÍ leaks raw
    CMS template errors to visitors**; Unionistas ships the league table as a JPG; Detroit's bar directory
    bakes text into images; Víkingur Gøta's newest article is 16 months old. **The bar for "best amateur
    club website in the world" is much lower than it looks.**

## Part G — Top 8 ideas most worth stealing for KCVV Elewijt

1. **One URL per fixture that changes state — matchday guide before, match report after.** (Iwaki,
   `iwakifc.com/matches/…`) Before kickoff: kick-off time, how to get there, where to park, what the
   canteen is serving and what it costs, where the kids can play, which pitch. After: line-ups, score,
   goalscorers, manager quote, gallery. **Effort:** medium build, low per-match cost — the pre-match half
   is a template a secretary fills in; most fields already exist in the fixture record. The
   highest-leverage structural idea in the whole study.

2. **A first-visit page written as an alphabetised or question-led FAQ, in the club's own voice.**
   (Detroit's 42-entry A-to-Z; Dulwich's 24-question FAQ; Kamatamare's beginner guide.) Answer the
   questions nobody writes down — buggies on the terrace, nappy changing, dogs, cash or card, what time
   the canteen opens, where to eat afterwards, can you bring your own food. **Nobody in Europe has one
   page that does all of this.** **Effort:** one long writing session, then near-zero upkeep.

3. **The player questionnaire — the single best content idea for a club with no photographer.** (Criacao;
   Dulwich's TEAM TALK.) Nickname, position, boyhood club, why you started, favourite food, best goal
   you've seen, message to the supporters, career as an arrow chain **starting at the youth club they
   joined at six**. Run it for every team, U6 to the A-kern. **Effort:** trivial — a form, filled in on a
   phone in ten minutes per player — and it converts an unphotographed squad into a hundred pages of real
   personality. Pair it with KÍ's **minutes-played** stat, which tells a squad player they matter.

4. **A fee page that publishes the awkward parts, ending in a hardship clause.** (Víkingur Reykjavík; B36;
   KÍ.) Exact price per age group → what's included (tournament travel, kit) → sibling discount **and
   where it stops** → deadline → what happens if you miss it → **then** the hardship sentence. Add B36's
   visible "last updated" date stamp. **Effort:** one page. Biggest trust return per word on the site.

5. **A memory layer that grows by itself and needs no historian.** Three components, all text-only:
   **Detroit's Legacy Numbers** (every player who ever played, numbered by debut, with published tie-break
   rules); **Clapton's appearance-medal Hall of Fame** (bronze/silver/gold at 50/100/150 apps, counted
   across men's, women's and youth together); and **Chemie's museum-as-appeal** — a monthly "find of the
   month" where members send in pennants, photos and shirts and the club publishes them with the donor's
   name. Add **Fram's `(L)` marker** so one honours table also does memorial duty. **Effort:** low per
   item, compounding forever. Explicitly the thing every other club promised and failed to deliver.

6. **A structural equality decision instead of an equality statement, plus a values page only a small club
   could write.** Order the nav so women's and youth sections are **peers**, not children (NSÍ's `Menn ·
   Kvinnur · Ungdómur`; Valur putting `Börn & unglingar` above the sports). Then write the values page in
   the register these clubs use — Chemie's *"Nie auf dem allerhöchsten Level, meist der Underdog"*,
   Clapton's *"We don't get it right all of the time"*, Lewes' *"It wasn't a publicity stunt"* — which is
   exactly the same register as *"Er is maar één plezante compagnie"*. **Effort:** near zero for the nav;
   one writing session for the page.

7. **Volunteering as a named corps with real roles, not a mailto.** (Nara's **「volundeer」**, where the
   volunteers **named it themselves**, with entry criteria, a duty list, a flat travel stipend, a merch
   discount and a name badge; plus Clapton's 19 committees each with its own inbox and a contact-form
   dropdown.) The gap everyone leaves open: **advertise the time commitment.** "Two hours, once a month,
   no experience needed" beats an email address every time. **Effort:** low. Highest operational payoff of
   anything here.

8. **A design system that is typographic and token-driven, not photographic — and a published brand kit.**
   Lewes proves a tier-7 club can run **OKLCH tokens** with **25 SVG to 21 img**. FGR proves a **single
   condensed display family with a `Cut` variant** carries an identity alone. NSÍ proves a 600-member club
   can publish **HEX, CMYK, RGB, Pantone *and* RAL** with a vector download. Víkingur Gøta solves the
   sponsor wall for free by rendering **every logo in flat black**. Counter-example to avoid: Unionistas
   shipping the league table as a JPG. **Effort:** token system a day; brand page an hour; flat-black
   sponsor wall is a CSS filter.

**Two lines worth putting on the wall.** Víkingur Reykjavík's hardship clause — *"contact us if there are
financial difficulties, and we'll find a solution that lets the participant keep playing"* — and NSÍ
naming, in its official written history, **the parents who drive the children to away matches**.
