# A design scorecard for football club websites — harvested, merged, and turned on ourselves

Research file, 13 August 2026. Complete.

> **Headline:** the site scored here is **`kcvv-nextjs.vercel.app`**, not `www.kcvvelewijt.be` — the
> apex still serves the old Gatsby build and 404s every Next.js route. See §3.0.

**The question.** Every "best designed football club website" listicle on the internet is web-agency
content marketing about Real Madrid and Juventus, and is useless as a target for an amateur club in
the Belgian third amateur division. But several of them publish their *evaluation criteria*, and
those are harvestable. This file harvests them, merges them with rubrics from sources that are
actually rigorous (Awwwards' published weightings, Nielsen Norman Group, Baymard, WebAIM, Core Web
Vitals), throws out what does not apply to us, and then scores `kcvvelewijt.be` against what is
left — as a hostile judge, not a friendly one.

**Sibling files.** `docs/research/clubs-*.md`, `platform-vendors-and-templates.md` and
`retro-fanzine-design-inspiration.md` cover *competitor clubs* and *aesthetic references*. This file
does not repeat their recommendations. It is about the measuring stick, not the neighbours.

---

## 1. The merged scorecard

### 1a. What the football listicles actually say

Harvested verbatim where possible. The rigour column is the honest one.

| Source | Criteria stated? | Rigour |
| --- | --- | --- |
| [aventique.paris](https://aventique.paris/en/top-12-most-beautiful-soccer-club-websites/) | **Yes — 7, explicit** | Low. Self-declares subjectivity. |
| [designrush.com](https://www.designrush.com/best-designs/websites/trends/best-sports-websites) | **No** | Very low. Sponsored agency directory. |
| [muffingroup.com](https://muffingroup.com/blog/soccer-website-design/) | Feature checklist, not criteria | Very low. Betheme WordPress theme marketing. |
| [wearetec.com](https://wearetec.com/top-10-football-club-websites/) | Partial ("usability and design perspective") | Low. April 2021, no rubric. |

#### Aventique's seven (the only football listicle with a stated rubric)

Published 12/02/2026. Scope: Big-Five-league clubs, 2020/21 season. Verbatim:

1. "Design freshness (a design that aligns with current trends)"
2. "A design that elegantly integrates the club's colors and personality"
3. "A design that showcases a sufficient number of elements on its homepage"
4. "Overall design consistency (how harmoniously all design elements fit together)"
5. "Content must be easily readable and accessible"
6. "The site must display correctly on mobile devices"
7. "And finally, the opinion of the Aventique team"

The article then undercuts itself: *"The only criterion for this ranking: subjectivity."* Criterion 7
is an admission that 1–6 are decoration. Criteria 2, 4, 5, 6 are keepable. Criterion 1 is a trend
tax. Criterion 3 is unusable as stated (no number given) but becomes usable if you fix a number —
see §3.

#### DesignRush — no criteria at all

Confirmed finding: the article states **no evaluation criteria**. It showcases 19 sites with a
"standout feature" each, is labelled *"Sponsored — Agencies shown here include sponsored
placements"*, and exists to sell agency leads. Implied principles only: visual hierarchy, clear
navigation, high-quality media (full-screen video, hi-res photography), bold colour contrast,
responsive functionality, distinctive typography.

#### Muffin Group — a feature checklist dressed as design advice

Betheme marketing. No judging criteria; a *must-have features* list instead: match centre with
fixtures and results, player roster pages, news section, ticket booking, merchandise store,
membership portal, social integration, stadium information. Plus three claims worth keeping because
they are testable: **"Sites with good UX put these actions within two clicks of the homepage"**,
*"Over 70% of match day traffic comes from phones"* (unsourced), and touch-friendly buttons /
readable text without zooming.

#### WeAreTec — usability language, no rubric

April 2021. Says it analysed sites "from a usability and design perspective" but publishes no
criteria. Its per-club reasons are the closest thing to a rubric and they are worth reading as one:
navigability, emotional visuals, personalisation, accessible colour design, clean general style,
logical structure, community focus, tailored user paths, equal exposure to men's and women's teams,
storytelling, and — for Newcastle — explicit accessibility tooling (Recite, high contrast, Dyslexie
font).

### 1b. Rigorous sources

| Source | What it gives | Rigour |
| --- | --- | --- |
| [Awwwards evaluation](https://www.awwwards.com/about-evaluation/) | Four weighted criteria: **Design 40%, Usability 30%, Creativity 20%, Content 10%.** HM at ≥6.5 jury score; SOTD = highest scored; Developer Award if >7 on developer guidelines. | Medium. Real weightings, jury-subjective scores. |
| [WebAIM Million 2026](https://webaim.org/projects/million/) | 1,000,000 home pages, WAVE engine on the rendered DOM. **56.1 detectable WCAG failures per home page** (up 10.1% YoY); **95.9%** of home pages have detected failures. Top failure types: low contrast text **83.9%**, missing alt text **53.1%**, missing form labels **51.0%**, empty links **46.3%**, empty buttons **30.6%**, missing document language **13.5%** — together 96% of all errors. | High. Largest published methodology of its kind; gives a real baseline to beat. |
| [Core Web Vitals](https://web.dev/articles/vitals) | **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**, measured at the **75th percentile** segmented by mobile/desktop. FID retired 2024. Supplementary: TTFB, FCP, TBT. | High. Numeric, non-negotiable, measurable. |

#### Nielsen Norman Group — the 10 usability heuristics

[nngroup.com](https://www.nngroup.com/articles/ten-usability-heuristics/). Published 24 April 1994,
last updated 30 January 2024. The most durable rubric in the field, and the only one here that is
genuinely 30 years old and still correct. Verbatim:

1. **Visibility of system status** — "The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time."
2. **Match between the system and the real world** — "The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon."
3. **User control and freedom** — "Users often perform actions by mistake. They need a clearly marked 'emergency exit' to leave the unwanted action without having to go through an extended process."
4. **Consistency and standards** — "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions."
5. **Error prevention** — "Good error messages are important, but the best designs carefully prevent problems from occurring in the first place."
6. **Recognition rather than recall** — "Minimize the user's memory load by making elements, actions, and options visible."
7. **Flexibility and efficiency of use** — "Shortcuts — hidden from novice users — may speed up the interaction for the expert user."
8. **Aesthetic and minimalist design** — "Interfaces should not contain information that is irrelevant or rarely needed."
9. **Help users recognize, diagnose, and recover from errors** — "Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution."
10. **Help and documentation** — "It's best if the system doesn't need any additional explanation. However, it may be necessary to provide documentation."

Note heuristic 4 ("follow platform and industry conventions") is the one that will be used against our
locked design direction. See §2.

#### Baymard Institute — the method, not the guidelines

[baymard.com/ux-benchmark](https://baymard.com/ux-benchmark). **1,254 guidelines** total (442 desktop
web, 429 mobile web, 383 mobile app), derived from "200,000+ hours of UX research", applied to 344
major e-commerce sites and 100,000+ manual performance ratings. Five-tier scale: **Poor, Mediocre,
Decent, Good, Perfect.** Relevant sub-sets: Homepage, Category Taxonomy & Main Navigation (34),
On-Site Search (28), Product Lists & Filtering (70), Site-Wide Design & Interaction (64), Accounts &
Self-Service (64).

**Honest caveat:** Baymard is *e-commerce* UX. We sell nothing. What transfers is the method (a
named guideline, a manual rating, a five-tier scale instead of a pass/fail) and three sub-sets —
main navigation, on-site search, and site-wide design & interaction. The cart/checkout/product
guidelines are inapplicable and are not imported. Baymard is the highest-rigour source in this file
and the least directly usable; that tension is the point.

### 1c. The merged scorecard — 30 criteria worth keeping

*(Scoring in §3 adds two more that emerged during measurement — D7 hover-only affordances and E4
Awwwards-grade polish — for a scored total of 32.)*

`REAL` = a genuine usability/quality criterion with a defensible basis. `TASTE` = an aesthetic
preference dressed as a criterion. `CONTENT` = an editorial completeness criterion (the thing the
only real amateur award actually rewards).

| # | Criterion | Type | Source | Source rigour |
| --- | --- | --- | --- | --- |
| **A. Accessibility floor** — the WebAIM Million baseline; failing these puts us in the 95.9% | | | | |
| A1 | Text contrast meets 4.5:1 (normal) / 3:1 (large) | REAL | [WebAIM](https://webaim.org/projects/million/) — 83.9% of sites fail | High |
| A2 | Every meaningful image has alt text; decorative images have `alt=""` | REAL | WebAIM — 53.1% fail | High |
| A3 | Every form input has a programmatic label | REAL | WebAIM — 51.0% fail | High |
| A4 | No empty links | REAL | WebAIM — 46.3% fail | High |
| A5 | No empty buttons | REAL | WebAIM — 30.6% fail | High |
| A6 | `lang` set on `<html>` | REAL | WebAIM — 13.5% fail | High |
| A7 | Skip link, one `<main>`, correct landmarks | REAL | WCAG 2.1-A / NN/g #6 | High |
| A8 | One `<h1>` per page, no heading-level skips | REAL | WCAG 1.3.1 | High |
| A9 | Tap targets ≥44×44 CSS px | REAL | WCAG 2.5.5 (AAA) / Apple HIG; muffingroup "touch-friendly buttons" | Medium |
| A10 | Body text legible without zoom; no text below ~11px | REAL | muffingroup "readable text without zooming" | Medium |
| **B. Performance** | | | | |
| B1 | LCP ≤ 2.5s at p75 | REAL | [web.dev](https://web.dev/articles/vitals) | High |
| B2 | INP ≤ 200ms at p75 | REAL | web.dev | High |
| B3 | CLS ≤ 0.1 at p75 | REAL | web.dev | High |
| B4 | LCP element is eagerly loaded and prioritised | REAL | web.dev LCP guidance | High |
| **C. Responsive** | | | | |
| C1 | Works at 320px with zero horizontal overflow | REAL | WCAG 1.4.10 Reflow | High |
| C2 | Displays correctly on mobile generally | REAL | aventique #6; muffingroup | Low source, real criterion |
| **D. Usability (NN/g)** | | | | |
| D1 | Visibility of system status — loading, live, stale, cancelled states | REAL | [NN/g #1](https://www.nngroup.com/articles/ten-usability-heuristics/) | High |
| D2 | Match the user's language, not internal jargon | REAL | NN/g #2 | High |
| D3 | Consistency within the system | REAL | NN/g #4 | High |
| D4 | Recognition rather than recall | REAL | NN/g #6 | High |
| D5 | Help and documentation exists and is findable | REAL | NN/g #10 | High |
| D6 | Key actions within two clicks of the homepage | REAL | muffingroup, verbatim | Low source, testable claim |
| **E. Design/identity** | | | | |
| E1 | Club colours and personality integrated, not bolted on | TASTE (but ours) | aventique #2 | Low |
| E2 | Overall design consistency — elements fit together harmoniously | TASTE→REAL | aventique #4; Awwwards Design 40% | Low/Medium |
| E3 | Homepage carries a sufficient number of elements | TASTE | aventique #3 | Low — no number given |
| **F. Content completeness** — the rubric the only real amateur award actually uses | | | | |
| F1 | Automatic fixture/result feeds from the federation | CONTENT | [Berkshire Best Website nomination](https://footballinberkshire.co.uk/news/football-news/92634/mortimer-fc-nominated-for-berkshire-football-award) | Medium |
| F2 | Real news section, updated | CONTENT | Berkshire; Binfield | Medium |
| F3 | Photo galleries | CONTENT | Berkshire | Medium |
| F4 | "How to get to the club" for travelling supporters | CONTENT | Berkshire, verbatim | Medium |
| F5 | Every team/age band gets its own visible stream | CONTENT | [binfieldfc.com](https://binfieldfc.com/) homepage structure | Medium |

Awwwards' weighting (**Design 40 / Usability 30 / Creativity 20 / Content 10**) is the closest thing
to a defensible weighting anyone publishes. Applied to the groups above, it says: identity and
consistency matter most, usability second, and — notably — **content is only 10%**. That is a jury's
weighting for a portfolio piece, not a club's. For an amateur club whose users arrive to answer
"when do we play and where", the honest weighting is closer to the inverse. Both are recorded here;
neither is treated as authoritative.

---

## 2. Criteria we reject

| Rejected criterion | Source | Why it does not apply |
| --- | --- | --- |
| **"Design freshness — a design that aligns with current trends"** | [aventique #1](https://aventique.paris/en/top-12-most-beautiful-soccer-club-websites/) | This is a trend tax, and it is the exact opposite of a locked position. "Retro-terrace fanzine" is a deliberate anachronism — cream paper, halftone, print motifs. A criterion that rewards looking like this year cannot judge a design whose whole thesis is *not* looking like this year. **Inapplicable, by design.** |
| **"Rounded corners feel modern / soften the UI"** | Implicit across every listicle; DesignRush's showcase set | Sharp corners everywhere is a locked rule in this project. A rubric that scores radius is scoring a house style, not a quality. **Rejected.** |
| **"Use a full-screen hero video"** | [DesignRush](https://www.designrush.com/best-designs/websites/trends/best-sports-websites) "full-screen videos, hi-res photography, dynamic visuals" | We have no professional photographer and no video budget. A hero video would be phone footage upscaled — worse than a well-set headline. This criterion encodes a production budget, not a design principle. **Rejected on budget grounds, and it would break the print register anyway.** |
| **"Hi-res glossy photography throughout"** | DesignRush; aventique's implicit standard | Same reason. Our newsprint treatment (warm-tint + grain) is partly an *answer* to amateur photography, not a workaround for it. Any criterion assuming a photo library of pro-shot imagery scores our constraint as a failure. **Noted as inapplicable; the treatment is the mitigation.** |
| **"Ticket booking system"**, **"merchandise store"**, **"membership portal"** | [muffingroup](https://muffingroup.com/blog/soccer-website-design/) must-have list | We do not sell tickets (free entry / at the gate), and there is no e-shop. Scoring us on absent commerce is scoring us for not being a business we are not. **Inapplicable.** One exception: we *do* have a membership form, so the "membership portal" line partly lands. |
| **Baymard's cart / checkout / product-page guideline sets** (110 + 106 + 70 guidelines) | [Baymard](https://baymard.com/ux-benchmark) | E-commerce only. Nothing to import. The *method* is kept; the guidelines are not. |
| **"Newsletter signup"** | Binfield's site; standard on every template | Locked project rule: no newsletter, ever. Binfield has one; we will not. **Rejected on standing policy.** |
| **NN/g #4, narrowly read as "follow platform and industry conventions"** | [NN/g #4](https://www.nngroup.com/articles/ten-usability-heuristics/) | Kept as *internal* consistency (D3), rejected as *industry* conformity. Read strictly, this heuristic says look like other football sites — which is the failure mode the whole design direction exists to escape. Nielsen's own framing is about not making users *wonder whether different words mean the same thing*, which is an internal-consistency claim. **We keep the real half and reject the conformist reading.** |
| **"The opinion of the Aventique team"** | aventique #7 | Not a criterion. |
| **Any criterion sourced from a sponsored agency directory** | DesignRush | The page is labelled "Agencies shown here include sponsored placements". Its selections are commercial. **Cannot be used as evidence of anything.** |
| **Public-vote awards as a quality signal** | [Website van het Jaar](https://www.websitevhjaar.nl/), Football Content Awards | Popular votes measure fanbase size. PSV won Best Website of the Year 2024 in the Netherlands; an amateur club cannot out-vote a professional one, and losing such a vote says nothing about the site. **Rejected as a scoreboard.** |

## 3. kcvvelewijt.be scored

### 3.0 Read this first — which site was scored

**`https://www.kcvvelewijt.be` is not the Next.js app.** Measured 2026-08-13: the apex serves a
**Gatsby 5.16.0** site (`<html class="no-js" lang="nl-BE">`, `name="generator" content="Gatsby
5.16.0"`). Every Next.js route 404s on that host:

```text
200  /                              747,962B   Gatsby
404  /nieuws                        680,716B
404  /kalender                      680,716B
404  /ploegen/eerste-elftallen-a    680,716B
404  /club/geschiedenis             680,716B
```

Everything below is therefore scored against **`https://kcvv-nextjs.vercel.app`**, which is where the
Next.js app actually lives pre-go-live, consistent with `docs/pre-go-live-remarks.md` and the
existing wayfinder maps. All six pages return 200 there.

**Method.** Two passes, both on 2026-08-13.

*Pass 1 (static).* Live HTML fetched by `curl` for `/`, `/nieuws`, `/kalender`,
`/ploegen/eerste-elftallen-a`, `/club/geschiedenis`, `/hulp`; shipping CSS chunks fetched and parsed;
contrast ratios computed from the actual shipped token values. Chrome was unavailable for this pass
and PageSpeed Insights returned HTTP 429, so live-rendered numbers were provisionally cited from this
repo's own browser-measured artefacts of 2026-08-06 and 2026-08-12.

*Pass 2 (live browser).* Chrome became available and **every borrowed number was re-measured
directly** against the same host: element geometry via `getBoundingClientRect` on all interactive
elements, horizontal overflow at 390px **and 320px** via the documented same-origin `<iframe>` method,
`navigation.responseStart` for warm TTFB, and `layout-shift` entries for CLS.

> **Pass 2 refuted four of the numbers Pass 1 had borrowed** — a 3.24s TTFB, a 31px overflow, an
> 11px-tall CTA, and a site-wide lazy-LCP claim. All four are retracted in place below, with the
> correction shown rather than silently deleted. **The lesson is about method, not about these four
> facts: repo critique artefacts age, and a stale measurement reads exactly like a live one.**
> LCP and INP remain unmeasured for a specific, proven environmental reason — see §3.2 B1 and §7.

### 3.1 Accessibility floor — measured

| # | Criterion | Measurement | Verdict |
| --- | --- | --- | --- |
| A1 | Contrast ≥4.5:1 | **Computed from shipping CSS.** `--color-jersey-deep:#007c46` on `--color-cream:#f5f1e6` = **4.69:1 PASS**. `--color-ink:#0a0a0a` on cream = **17.54:1**. `--color-ink-soft:#1f1f1f` = 14.60:1. `--color-ink-muted:#6b6b6b` = 4.72:1. `--color-alert:#b84a3a` = 4.56:1. **`#008755` appears 0 times in the shipping CSS.** | **PASS — and this is a fixed bug, not a live one.** The 2026-08-06 critique's five "low-contrast 4.0:1" findings were against the *old* `#008755` green. It has since been darkened to `#007c46`. Every text-carrying pair now clears AA. Do not re-open. |
| A2 | Alt text | 0 images missing an `alt` attribute across all six pages (homepage 44 images, `/ploegen` 39, `/nieuws` 29). Empty `alt=""` audited by hand: they are opponent club crests rendered beside the club name in text, the header crest beside the wordmark, and a `blur-[2px]` background image. | **PASS, and correctly reasoned.** This is textbook decorative-vs-informative handling. 53.1% of the web fails this; we do not. |
| A3 | Form labels | 1 non-hidden input found (`/hulp` search); no unlabelled inputs detected. Membership form not in the sampled set. | **PASS on the sample.** Membership form untested — see §7. |
| A4 | Empty links | **0** across all six pages (73 / 88 / 61 / 38 / 34 / 34 links). | **PASS.** |
| A5 | Empty buttons | **0** across all six pages, including `/kalender` with 56 buttons and `/hulp` with 35. | **PASS.** |
| A6 | `lang` | `lang="nl"` on every page. | **PASS.** (Minor: the old Gatsby site uses the more precise `lang="nl-BE"`. `nl` is correct but less specific — a regression in precision, not in compliance.) |
| A7 | Landmarks | Skip link to `#main-content` present as the first focusable element on all six pages. Exactly **one `<main id="main-content" tabIndex={-1}>`** per page (`apps/web/src/app/layout.tsx:125`). One `<footer>`. | **PASS.** |
| A8 | Heading structure | **Two `<h1>` on `/kalender`** ("Wedstrijdkalender." twice) and **two on `/club/geschiedenis`** ("De plezantste compagnie." + "Meer dan een eeuw."). **Heading-level skip h1→h3 on `/kalender`** ("Donderdag 13 augustus") and **on `/ploegen/eerste-elftallen-a`** ("Doelmannen"). Separately, on 5 of 6 pages a nav block emits `h2:KCVV Elewijt → h3:Ontdek → h3:Aansluiten → h3:Bij de club` **before the page `<h1>` in document order**. | **FAIL — three distinct defects.** Duplicate h1, skipped levels, and an outline that opens at h2 before it reaches h1. None is fatal; all are cheap. |
| A9 | Tap targets ≥44×44 | **RE-MEASURED live in Chrome, 2026-08-13** (`getBoundingClientRect` on every visible `a, button, [role=button], input, select, summary`). **Article page `/nieuws/[slug]` @1512px: 32 of 34 under 44×44 = 94%.** Share controls **16×16** — both of them (`Delen`, `Delen op Facebook`). **Homepage @1512px: 41 of 76 = 54%.** Named CTAs: `AL HET NIEUWS →` **143×32**, `VOLLEDIGE KALENDER →` **151×32**, `ALLE SPONSORS & SYMPATHISANTEN →` **281×36**, `Ontdek onze jeugd →` **211×52 (passes)**. **@390px and @320px: 19 of 23 = 83%**, dominated by footer nav at **27px** tall (`Galerij` 35×27, `Nieuws` 40×27, `Contact` 44×27, `PRIVACY` 44×24). | **FAIL — real, but less severe than the first draft claimed.** **CORRECTION:** the draft reported `AL HET NIEUWS →` at **113×11px** and `VOLLEDIGE KALENDER →` at 151×16 from the 2026-08-06 critique. Live they are **143×32** and **151×32** — the CTA heights have roughly **doubled** since that measurement; someone already improved them. They still miss 44px, but by 12px, not by 33px. The **16×16 share controls are confirmed exactly**, and the **94% figure is confirmed on the article page** — the draft's error was generalising that one page's ratio to the whole site (homepage is 54%). Tracked as [#2529](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2529). |
| A10 | No text below ~11px | Shipping CSS floor on homepage chunks is `font-size:10px`. Repo-wide the typeset map counts **63 uses below the documented 11px floor — 45×10px, 14×9px, 4×9.5px, and one 7px** — ~48% of all flagged type drift, across 20+ component families. 18 such sites ship on the article page alone, rendering as low as **9.5px live**. | **FAIL.** Contrast at those sizes is fine (4.72:1); size is the defect. PRODUCT.md's own accessibility text — "a phone held in daylight on the sideline" and "older supporters and volunteers are a real part of the audience" — makes 9px indefensible on our own stated terms. |

**Accessibility floor: 7 pass, 3 fail.** Against the WebAIM Million baseline that is an excellent
result — we clear the five failure types that account for the bulk of the web's errors (contrast, alt,
labels, empty links, empty buttons) and fail only on structure and size, which no automated scanner
in that study measures. **A hostile reading:** we pass the things scanners catch and fail the things
a human on a phone catches. That is exactly backwards from what matters.

### 3.2 Performance — re-measured in Chrome 2026-08-13 (corrects an earlier draft)

> **Two claims in the first draft of this file were wrong and are retracted below.** Both came from
> `curl` timings and a stale repo artefact; both were refuted by live browser measurement.

| # | Criterion | Measurement | Verdict |
| --- | --- | --- | --- |
| B1 | LCP ≤2.5s p75 | **Still not obtainable — with proof this time.** PSI returned HTTP 429 (quota), no CrUX field data exists for a `.vercel.app` host, and the Chrome window was occluded for the whole session: `document.visibilityState === "hidden"` throughout, and `performance.getEntriesByType('paint')` returned **`[]`** on every load — in the top document *and* inside same-origin iframes. Chrome does not record paint timing for a page that has never been visible, so LCP cannot be sampled from this environment at all. (One reading of `first-contentful-paint: 11120ms` was an artefact of a screenshot forcing a paint 11s after load — discarded, not a real FCP.) | **UNSCORED.** Needs a foregrounded window or a Lighthouse/Playwright run. |
| B1a | TTFB (proxy) | **Warm, in-browser `navigation.responseStart`:** `/` **135ms**, `/ploegen/eerste-elftallen-a` **28ms**, `/ploegen/…/wedstrijden` **22ms**, `/kalender` **121ms**, article **26ms**. Full `loadEventEnd`: 418–1161ms. Transfer 19–30KB compressed (198–366KB decoded), ~50 subresources. | **PASS, comfortably.** **RETRACTION:** the first draft reported a **3.24s TTFB** on `/ploegen/eerste-elftallen-a` from `curl` and called it a red flag. Warm, that page returns first byte in **28ms** and finishes loading in 594ms. The 3.24s was a **cold ISR cache-miss on the first request**, not a page defect. Cold starts are real but they hit one visitor after an idle period, not the p75. **Item removed from §4.** |
| B2 | INP ≤200ms | Not measurable — `event` timing entries require the same paint pipeline that the occluded window suppresses. | **UNSCORED.** |
| B3 | CLS ≤0.1 | **Measured: 0.0007** on the homepage (1 layout shift, `hadRecentInput === false`). `layout-shift` entries record independently of paint timing, so this figure is trustworthy. | **PASS — outstandingly.** 0.0007 against a 0.1 budget is two orders of magnitude of headroom. This is the best single metric in the file. |
| B4 | LCP element prioritised | **Corrected — see §3.2a.** Five eager call sites exist, not one. The confirmed defect is narrower: **the `/nieuws/[slug]` hero is `loading="lazy"` with `fetchPriority="auto"`**, verified live in the browser, and the screenshot shows the article opening on an **empty taped frame**. | **PARTIAL FAIL, scoped to the article page** — not site-wide as first claimed. |

#### 3.2a Retraction and correction: the `priority` picture

The first draft claimed *"`priority` is set at exactly one call site in the app"*. **That is false.**
A full source audit (`grep -rn 'priority' --include='*.tsx'`, excluding `sitemap.ts`'s unrelated SEO
priorities and test files) gives the real inventory:

| Call site | Behaviour | Which routes it covers |
| --- | --- | --- |
| `components/article/EditorialHero/to-editorial-hero-props.ts:52` | `priority: true` | Homepage hero only (comment at `EditorialHero.tsx:98` states this explicitly) |
| `components/layout/PageHero/PageHero.tsx:205` | `priority` **unconditional** — but the `<Image>` only renders in the branch taken when an `image` prop is passed | **`/kalender`** (`image="/images/youth-trainers.jpg"`) and **`/club/[slug]`** (`image={page.heroImageUrl}`) |
| `app/(main)/club/ultras/UltrasHero.tsx:33` | `priority` | `/club/ultras` |
| `app/(main)/evenementen/[slug]/page.tsx:154` | `priority` | Event detail |
| `components/gallery/GalleryLightbox/GalleryLightbox.tsx:83` | `priority={i < FIRST_ROW}` | First row of `/galerij/[slug]` |
| `components/home/BannerSlot/BannerSlot.tsx:50` | `priority={false}` | Deliberate |
| `components/match/MatchArticleLinkCard/MatchArticleLinkCard.tsx:117` | `priority={false}` | Deliberate |

**A second correction, in the other direction.** It was put to me that `/ploegen/page.tsx` uses
`PageHero`, so the `/ploegen` LCP candidate is already eager. **That is also not right** — the grep
hit is the substring `PageHero` inside `InteriorPageHero` in a *comment* on line 6. `/ploegen/page.tsx`
imports no `PageHero`; its components are `EditorialHeading`, `MonoLabel`, `PageContainer`,
`TeamFlagship`, `YouthDirectory`, `JsonLd`, `PageViewTracker`. And `/ploegen/[slug]` uses `TeamHero`,
which sets no `priority` either.

**What actually survives as a defect:**

1. **`/nieuws/[slug]` — confirmed, live.** `document.querySelector('main img')` reports
   `loading="lazy"`, `fetchPriority="auto"`, and the rendered screenshot shows an empty hero frame.
   This is the highest-traffic content type on the site. **Real, and worth fixing.**
2. **The `/ploegen` surface has no eager image** — but it also has no large hero image, so its LCP
   element is probably *text*, which needs no preloading. **Not a defect; withdrawn as one.**
   Confirming this needs the LCP element identity, which this environment cannot supply.

**Net effect:** what was written as a site-wide "guaranteed Core Web Vitals failure" is one page's
hero. Anyone who had started adding `priority` across `/ploegen` on the strength of the first draft
was chasing nothing.

### 3.3 Responsive

| # | Criterion | Measurement | Verdict |
| --- | --- | --- | --- |
| C1 | 320px, zero overflow | **NOW TESTED — 2026-08-13, via the documented same-origin `<iframe>` method** (`resize_window` below ~1440 does not take on this machine). Measured `documentElement.scrollWidth - innerWidth` at **both 390px and 320px**: homepage **0px**, article detail **0px**, `/ploegen/eerste-elftallen-a/wedstrijden` **0px**. The `/wedstrijden` probe rendered 75 interactive elements, so the page was fully laid out, not a blank frame. Homepage rendered all 11 `<section>`s at 390px. | **PASS — and this closes a stated blind spot.** **RETRACTION:** the first draft carried forward a **31px overflow at 390px on `/ploegen/[slug]/wedstrijden`** from the 2026-08-12 wayfinder map. It is **no longer reproducible** at 390px or 320px. Either it was fixed or the measurement condition differed. The `min-w-[360px]` / `w-[380px]` utilities exist in the CSS but are demonstrably not on any path that reaches a 320px viewport on these routes. |
| C2 | Mobile display | Viewport meta is correct and generous: `width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover` — zoom explicitly permitted to 5×, which many sites suppress. | **PASS.** |

### 3.4 Usability (NN/g)

| # | Criterion | Assessment | Verdict |
| --- | --- | --- | --- |
| D1 | Visibility of system status | `loading.tsx` skeletons exist and the article one is called "exemplary" by the repo's own critique. But: the LCP hero is lazy so the page opens empty; a segment `loading.tsx` leaks into every descendant's HTML (6 leak into 15 routes); and **there is no afgelasting / postponement state at all** — the highest-frequency real-world status question in amateur football. | **PARTIAL.** Good at the component level, missing the one status users actually need. |
| D2 | User's language, not jargon | Strong. "Er is maar één plezante compagnie", "Waarmee kunnen we je helpen?", "De toekomst van Elewijt", "Met dank aan onze sponsors". Nav is plain Dutch: Nieuws / Wedstrijden / Evenementen / A-ploeg / B-ploeg / Jeugd / Sponsors / Hulp / De club. | **PASS — and this is a genuine strength.** Most club sites read like a federation database. This reads like a club. |
| D3 | Internal consistency | One match-row vocabulary (`TeamAgendaRow`) shared across homepage, `/ploegen/[slug]` and `/kalender` — real system thinking. Against that: **four parallel type ramps** on both size and line-height axes ([#2490](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2490)), a stray `#6b7280` neutral grey shipping at `DownloadButton.tsx:49` against the No-Grey-UI rule plus seven undocumented file-type colours, the same date rendered three times in two casings on an article, and **"A-PLOEG" appearing twice in the `/nieuws` filter row** (the Sanity title-case / GROQ case-sensitivity trap). | **PARTIAL.** Excellent at the primitive level, drifting at the token level. |
| D4 | Recognition over recall | Nav exposes 9 items; footer exposes 17 including the roles-based paths ("Als speler", "Als vrijwilliger", "Als sponsor"). Search exists at `/zoeken`. | **PASS.** |
| D5 | Help and documentation | `/hulp` is a real answer to this heuristic — FAQ + a full organigram (Hoofdbestuur 5 functies, Jeugdbestuur 7, Algemeen 20) + a "Niemand gevonden?" fallback. 6 JSON-LD blocks on that page. | **PASS — above the tier.** Very few clubs at any level ship a help page. |
| D6 | Key actions ≤2 clicks | Fixtures: 1 click (`Wedstrijden`). Team squad: 2 (`A-ploeg`). Youth: 1. Membership: 2 (footer `Als speler` / `De club → word-lid`). News: 1. **How to get to the ground: 2 clicks** (`De club → Contact`), **corrected 2026-08-14** — `/club/contact`'s "Kom naar ons." section carries the maps route, parking, prices, kantine hours and accessibility. What is not reachable at any depth is the *travel* half: train, bus, bike, minutes-on-foot. | **PASS.** The original read "not reachable at all — there is no such page", which was wrong; the arrival information is two clicks deep. The travel gap is real but is a content gap on an existing page, not a routing one. |
| D7 | Hover-only affordances | Every read-more affordance on the homepage is hover-only, on a touch-first product where hover does not exist. | **FAIL.** PRODUCT.md explicitly names this failure mode: "no interaction that must be discovered (hover-only affordances, hidden gestures, unlabelled icons)". We violate our own stated rule. |

### 3.5 Design / identity

| # | Criterion | Assessment | Verdict |
| --- | --- | --- | --- |
| E1 | Club colours and personality | Jersey green and cream are the entire system, not an accent on a white template. The motto is the `<title>`. The register is authored, not chosen from a dropdown. | **PASS, emphatically.** This is the criterion we win hardest, and it is the one aventique claims to care most about. |
| E2 | Design consistency | The repo's own dual-agent critique calls it "a genuinely authored design world executed with real conviction". Counter-evidence in D3 (four type ramps, stray greys). | **PASS with drift.** |
| E3 | "Sufficient number of homepage elements" | **Measured:** 11 `<section>`, 13 `<article>`, 22 headings, 44 images, 73 links, 7 buttons. Nine content bands: hero → Dit weekend → Uitgelicht → Mosselfestijn → Laatste nieuws → Komende wedstrijden → De toekomst van Elewijt → Sponsors → Onze clubkledij. | **PASS — and the criterion is junk.** Aventique never states a number, so "sufficient" is unfalsifiable. Nine bands is comparable to Binfield's eight. Recorded for completeness only. |
| E4 | Awwwards-grade polish | Not submitted, not judged. Our aesthetic is distinctive enough to be jury-legible, which is rare for a club site; the tap-target and type-drift issues would be visible to a usability-weighted (30%) jury. | **UNSCORED — realistic HM candidate, not SOTD.** |

### 3.6 Content completeness — the rubric that actually wins amateur awards

| # | Criterion | Assessment | Verdict |
| --- | --- | --- | --- |
| F1 | Automatic federation fixture/result feeds | PSD sync feeds fixtures, results, standings, squads, opponent crests (`dfaozfi7c7f3s.cloudfront.net/logos/...`). This is the exact thing Mortimer FC was nominated for ("direct feeds from the FA website and API and GotFootball"), and we do it more completely. | **PASS — we beat the nominee.** |
| F2 | Real news section | 24 `<article>` on `/nieuws`, spanning 2023 to 2026, with genuine long-form (a 1,279-word interview with 11 Q&A pairs). Bylined previews wired to `matchId`. | **PASS.** |
| F3 | Photo galleries | `/galerij` + `/galerij/[slug]` exist. | **PASS.** |
| F4 | How to get to the club | **Partly exists — corrected 2026-08-14 against `ContactPage.tsx`.** `/club/contact` carries a "Kom naar ons." section: a `Routebeschrijving` maps link to Driesstraat 32, parking guidance (at the pitch and around the Van Innis sportpark), an Inkom price table (Jeugd €3 · B-ploeg €5 · A-ploeg €10), kantine opening days and hours, and accessibility — wheelchair-accessible with 2 reserved spaces. **What is genuinely absent: public transport (no bus, no station), minutes-on-foot from any option, and the gate.** The detailed parking plan is a pointer to the gemeente Zemst site, whose URL is still a `TODO` in the component. | **PARTIAL, not FAIL.** The original verdict said "does not exist" and was wrong — it was read off the route file rather than the component that renders the page. **The travel half of the gap is real** and remains the most-corroborated single recommendation in the corpus; the arrival half is already built, so any `/club/bereikbaarheid` proposal must extend `/club/contact` rather than duplicate it. |
| F5 | Every team/age band visible on the homepage | Binfield runs four separate news streams on its homepage (First Team / U23 / Youth and Junior / Women and Girls). Ours runs one undifferentiated "Laatste nieuws" plus A- and B-team fixture blocks. Youth gets one band ("De toekomst van Elewijt"). | **FAIL, softly.** We out-design Binfield everywhere and lose to it here. A youth parent does not see their child's age band on the homepage; a Binfield parent does. This is editorial architecture, not styling. |

### 3.7 Scorecard summary

Revised after the live browser pass.

| Group | Pass | Fail | Unscored |
| --- | --- | --- | --- |
| A. Accessibility floor (10) | 7 | 3 | — |
| B. Performance (5) | 2 (TTFB, CLS) | 1 (article hero) | 2 (LCP, INP) |
| C. Responsive (2) | 2 | 0 | — |
| D. Usability (7) | 5 | 0 | 2 partial |
| E. Design/identity (4) | 3 | 0 | 1 |
| F. Content completeness (5) | 3 | 1 | 1 partial (F4) |
| **Total (33)** | **22** | **5** | **6** |

**Blunt overall verdict.** This is a site that would win the only real amateur club-website award on
record without much trouble, and still has a usability gap on a phone — though a materially smaller
one than the first draft of this file claimed. The identity work is genuinely first-rate; the
accessibility scanner floor beats 95.9% of the web; **CLS of 0.0007 and warm TTFB of 22–135ms are
excellent**; and 320px reflow passes cleanly. What remains is real but bounded: **16×16 share
controls and a 27px footer nav**, 63 type sites below the legibility floor, one lazy article hero,
and nothing telling a visiting supporter how to *travel* to the ground — no train, bus, bike or minutes-on-foot. **Corrected 2026-08-14:** the arrival half is built. `/club/contact` already carries the route link, parking, entry prices, kantine hours and accessibility, so this is a content gap on an existing page rather than a missing one.

The honest summary is that **we are winning the 40% (Design) and the engineering fundamentals, and
losing on target size, type floor and one missing page.** The first draft framed this as
"beautiful but broken on a phone"; the measurements do not support "broken". They support
"beautiful, fast, stable, and fiddly to tap."

## 4. Where we lose points and it matters

Ranked by (harm × certainty) ÷ effort. Effort is S/M/L.

| # | Loss | Why it matters | Effort |
| --- | --- | --- | --- |
| 1 | **Tap targets — worst on the article page: 32 of 34 interactive elements under 44×44 (94%), share controls 16×16. Footer nav 27px site-wide (83% under 44 at mobile). Homepage CTAs 32–36px.** | Re-verified live 2026-08-13, so this is the most solid item here. Two distinct fixes: (a) the **16×16 share controls** are the only genuinely tiny targets left and are trivially fixable; (b) the **27px footer nav** is the site-wide volume driver. Both are `py-2 -my-2`-shaped changes with no visual shift. Note the homepage CTAs already improved from 11px to 32px since 2026-08-06 — this is being worked on. [#2529](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2529). | **S** |
| 2 | **No "hoe geraak ik er" page** | Six independent evidence lines: the Berkshire award nomination names it verbatim, and three sibling research files rank it #1 or #2. PRODUCT.md names "opposition supporters travelling to a national-league fixture" as an audience and we serve them an address. Highest external validation of anything in this document. | **S** |
| 3 | **63 type sites below the 11px floor (down to 7px; 9.5px rendering live)** | Contrast is fine; size is not. Our own PRODUCT.md sets the test — "a phone held in daylight on the sideline", "older supporters and volunteers are a real part of the audience". ~48% of all flagged type drift. | **M** |
| 4 | **`/nieuws/[slug]` hero is `loading="lazy"` / `fetchPriority="auto"`** | Verified live: the article opens on an empty taped frame. One `priority` prop on the detail call site. **Scope corrected** — this is the article page only, not the site-wide failure the first draft described (see §3.2a). | **S** |
| 5 | **Heading structure: duplicate `<h1>` on `/kalender` and `/club/geschiedenis`; h1→h3 skips on `/kalender` and `/ploegen`; nav emits h2/h3 before the page h1** | Cheap, mechanical, and it is the structural half of accessibility that scanners in the WebAIM study do not even count — so passing their five checks is not evidence we are fine. | **S** |
| 6 | **Every read-more affordance is hover-only, on a touch-first product** | Directly violates PRODUCT.md's "no interaction that must be discovered". On a phone the affordance simply does not exist. | **S** |
| 7 | **No afgelasting / postponement state** | The highest-frequency real-world question in Belgian amateur football, and the cheapest template on the market ships it. NN/g #1 (visibility of system status) fails on the one status that matters. | **M** |
| 8 | **No per-age-band editorial stream on the homepage** | The one axis where the Berkshire award winner beats us. A youth parent does not see their child's team above the fold. Editorial architecture, not design. | **M** |
| 9 | **LCP and INP have never actually been measured** | Not a defect — a measurement gap. Every performance claim about this site is currently inferred from TTFB, CLS and code reading. CLS (0.0007) and TTFB (22–135ms) are excellent, which makes it *likely* LCP is fine, but nobody has seen the number. Needs one Lighthouse or Playwright run. | **S** |

**Removed from this list after live re-measurement (do not act on these):**

- ~~3.24s TTFB on `/ploegen/eerste-elftallen-a`~~ — **refuted.** Warm TTFB is **28ms**; the curl figure was a cold ISR cache-miss.
- ~~31px horizontal overflow at 390px on `/ploegen/[slug]/wedstrijden`~~ — **not reproducible** at 390px or 320px.
- ~~"Zero eager images across `/ploegen`" as a defect~~ — that surface has no hero image; its LCP is likely text. **Withdrawn.**
- ~~`AL HET NIEUWS →` at 113×11px~~ — it is **143×32** live. Already improved.
| 11 | **Token drift: four parallel type ramps, a stray `#6b7280` against the No-Grey-UI rule, seven undocumented file-type colours, "A-PLOEG" twice in the `/nieuws` filter** | Each is small; together they are the gap between "authored" and "systematic", which is what Awwwards' 40% Design weighting actually scores. | **M** ([#2490](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2490)) |
| 12 | **`lang="nl"` where the old site had `lang="nl-BE"`** | Trivially correct either way; `nl-BE` is more precise for screen-reader pronunciation of Flemish. Nearly free. | **S** |

**Not on this list, deliberately:** the 4.05:1 contrast findings from 2026-08-06. They are **fixed** —
`#008755` no longer ships and `#007c46` measures 4.69:1. Anyone re-reading that critique should not
re-open them.

## 5. Where we lose points on purpose

**Do not "fix" any of these.** Each is a scored loss against a published rubric and a deliberate,
locked decision. They are recorded here so a future audit does not mistake a position for a defect.

| Criterion we fail | Whose rubric | Why we fail it on purpose |
| --- | --- | --- |
| **"Design freshness — aligns with current trends"** | [aventique #1](https://aventique.paris/en/top-12-most-beautiful-soccer-club-websites/) | The direction is a deliberate anachronism. Scoring "does it look like 2026" against a design whose thesis is *print, not screen* is a category error. **Permanently inapplicable.** |
| **Sharp corners everywhere (no border radius)** | Implicit in every listicle's "modern" framing | Locked rule. Radius is a house style, not a quality measure. |
| **No hero video, no full-screen motion** | [DesignRush](https://www.designrush.com/best-designs/websites/trends/best-sports-websites) | No budget, no photographer, and it would break the print register. A bad hero video scores worse than a well-set headline on every criterion that matters. |
| **Amateur photography, newsprint-treated rather than glossy** | DesignRush, aventique implicit | The warm-tint + grain treatment is the *answer* to amateur photography, not an apology for it. A rubric assuming a pro photo library is scoring our budget. |
| **No newsletter signup** | Binfield's award-winning site has one; every template ships one | Standing project rule: never propose one. We accept the lost point. |
| **No ticket booking, no merchandise store** | [muffingroup](https://muffingroup.com/blog/soccer-website-design/) must-have list | We do not sell tickets or run a shop. Absent commerce is not a design failure. |
| **Reading measure of 680px producing 101–110 CPL at desktop** | Typographic convention (45–75 CPL) | The 680px measure is **locked** by [#2436](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2436) and deliberately expressed in px, never `ch`. The honest read: the *container* is locked and correct; the drift is pairing it with 16px body text. Promoting article prose to the existing `body-lg` token lands ~97 CPL without touching the locked container. **The 680px number is not the bug — do not change it.** |
| **Not looking like other football club websites** | [NN/g #4](https://www.nngroup.com/articles/ten-usability-heuristics/) read as "follow industry conventions" | We keep internal consistency and reject industry conformity. Looking like every other club site is the failure mode the whole direction exists to escape. |
| **Jersey-deep `#007c46` at 4.69:1 rather than a darker, safer green** | AAA (7:1) | It clears AA at 4.69:1 and it is the club's colour. The project's standing position is that readable is the test and ratios only break ties. Pushing to AAA would mean the green is no longer the green. |
| **Won't chase a public-vote award** | [Website van het Jaar](https://www.websitevhjaar.nl/), Football Content Awards | Public votes measure fanbase size. Losing one to PSV means nothing. |

## 6. Awards that actually judge club websites

### 6a. Confirmed: Berkshire Football Awards — "Best Website"

**This is the real thing, and it is the only one found at amateur level.** Run by
[footballinberkshire.co.uk](https://footballinberkshire.co.uk/berkshire-football-awards-home/berkshire-football-awards-honours-board/),
a regional football news site, since **2017** (as the Bracknell Football Awards; Berkshire-wide from
2022, sponsored by TradeMark then Grundon). Ceremony hosted *at Binfield FC* 2018–2021, then Double-
Barrelled Brewery, Reading.

**Best Website honours board:**

| Year | Winner |
| --- | --- |
| 2022 | Ascot United |
| 2023 | **Binfield** |
| 2024 | Slough Town |
| 2025 | **Binfield** (second win) |
| 2026 | Windsor & Eton |

Binfield's own report of the 2025 win:
[binfieldfc.com](https://binfieldfc.com/club-news/17819/football-in-berkshire-awards-2/) — shortlisted
in four categories (Best Website, Best Photography, Best Physio, Best Young Player – Male), won Best
Website, "the second year that we have won it."

**How it is judged** ([FAQ](https://footballinberkshire.co.uk/news/football-news/87903/trademark-berkshire-football-awards-frequently-asked-questions/)):
public nomination by open form → long list → **a panel of over 20 judges** votes a top three per
category, scores summed → top four shortlist → winner announced at the ceremony. *"You can nominate
as many people as you like for each award — the quantity of nominations counts for the judging
panel."* Nomination quality matters too: *"Tell us exactly why … the more detail you can include, the
better."*

**Be honest about what this is.** It is a popularity-weighted community award judged by local
football journalists, not a design jury. There is no published rubric, no scoring dimensions, no
accessibility or performance testing. The signal it carries is *"the local football community
noticed and valued this website"* — which is arguably a better proxy for our actual goal than an
Awwwards score, but it is not a design evaluation.

**What the nominations actually praise.** The most useful artefact is the 2026 Mortimer FC
nomination ([footballinberkshire.co.uk](https://footballinberkshire.co.uk/news/football-news/92634/mortimer-fc-nominated-for-berkshire-football-award),
category sponsored by With Flair Agency). The cited features, verbatim:

- "direct feeds from the FA website and API and GotFootball, for fixtures and results"
- "good news section, and excellent photos section"
- "information on how to get to the club" — for travelling fans
- a mobile app "Match Centre" letting managers update the site live during matches with "goals, subs and cards"
- and the framing: "a whole club mission with almost everyone involved", "one of the most
  forward-looking websites in the county", designed and coded by club volunteers

**That is the real rubric at this level, and it is a content/data rubric, not an aesthetic one.**
Automatic fixture/result feeds, photos, news, *how to get here*, live match updates, and visible
volunteer authorship. Three of those five we already do. One ("how to get to the club") is the
single most-repeated gap across all six sibling research files. Note also that a *sponsored* award
category means the sponsor's judgement of "website" is partly commercial.

### 6b. What Binfield's winning site actually is

[binfieldfc.com](https://binfieldfc.com/) — Isthmian League South Central, step 4 (8th tier), 36
teams from age 4 to first team, 450+ players.

Homepage order: **Next Fixture → Latest Result → First Team News → U23 Development News → Youth and
Junior Moles News → Women and Girls News → Club Information → Sponsors.** Nav: Home, News, Teams,
About, Commercial, Shop, Contact. Teams splits eight ways (Soccer School, Girls, Junior, U18 Allied,
U23 Development, First Team, Walking Football). Built on **WordPress + Elementor**. Shop is external
(DirectSoccer). Has a newsletter signup.

**The blunt read: it is a competent WordPress site and we out-build it on every technical axis.** It
is not a design benchmark. What it beats us on is *editorial breadth per team* — it runs a separate
news stream per age band (first team / U23 / youth / women and girls) surfaced on the homepage,
which makes every constituency see itself above the fold. That is an editorial commitment, not a
design feature, and it is the one thing worth stealing. Its award-winning quality is volume and
completeness of coverage, produced by volunteers, at 20k page views a month.

### 6c. Awards that do NOT exist — confirmed absences

A confirmed absence is a finding. Each of these was searched and nothing was found:

| Body / scheme | Website or digital category? | Evidence |
| --- | --- | --- |
| **Voetbal Vlaanderen** | **No.** No website, digital or communications award for clubs found. | Search returned nothing; no such category on their awards surfaces. |
| **KNVB (Netherlands)** | **No** club-website award. The KNVB's club-facing awards are the *Meer dan Voetbal Awards* (social projects: "Amateurproject van het jaar", "Profclub van het jaar") and the *Amateurwinnaar* in the KNVB Beker (a sporting title). Neither judges digital. | [knvb.nl](https://www.knvb.nl/nieuws/organisatie/maatschappelijke-projecten/2112/meer-dan-voetbal-awards-amateurproject-van-het), [eurojackpotknvbbeker.nl](https://www.eurojackpotknvbbeker.nl/info/1541/de-amateurwinnaar) |
| **The FA / England Football Grassroots Football Awards** | **No website category.** Categories are people- and club-shaped (Club of the Year, League of the Year, Match Official, coach and volunteer awards). | [englandfootball.com](https://www.englandfootball.com/participate/grassroots-football-awards), [grassroots.englandfootballawards.co.uk](https://grassroots.englandfootballawards.co.uk/) |
| **DFB (Germany), FIGC (Italy)** | **No** evidence of a club-website or Vereinshomepage competition. | Searches for "Vereinshomepage", "beste Homepage", "Homepage-Award" returned nothing from either federation. |
| **Best of Non-League Awards** | **No website category** — community impact, matchdays, local difference, Steps 1–6, fan-nominated. | [nonleagueday.co.uk](https://nonleagueday.co.uk/the-best-of-non-league/) |
| **Football Content Awards** | Content/media awards with 32 categories and "Best Football Club – Non-League", but **not a website-design award** — it judges content output (podcasts, creators, media). Publicly voted. | [footballcontentawards.com](https://footballcontentawards.com/2025/11/25/all-the-winners-of-the-football-content-awards-2025/) |
| **Football Business Awards** | Business/commercial initiatives, not website design. | [footballbusinessawards.com/categories](http://footballbusinessawards.com/categories/) |

### 6d. Adjacent awards that would take us, but are not football

- **Website van het Jaar (NL)** — [websitevhjaar.nl](https://www.websitevhjaar.nl/). Publicly voted
  Dutch award. **A football club won overall Best Website of the Year 2024: PSV**, with a site built
  by GX Software ([dutchcowboys.nl](https://www.dutchcowboys.nl/online/de-beste-website-van-het-jaar-2024-is-van-een-voetbalclub)).
  Proof that a football site can win a general web award in our language region. It is a public vote,
  so a professional club's fanbase size decides it — an amateur club cannot win a popular vote against
  PSV. Not a realistic target.
- **Awwwards** — Design 40 / Usability 30 / Creativity 20 / Content 10; HM at ≥6.5. Our aesthetic is
  distinctive enough to be jury-legible, which is rare for a club site. This is the only award in
  this file whose rubric rewards what we deliberately do. Worth a submission purely as a forcing
  function on the last 10% of polish.
- **County-level regional media awards generally.** Berkshire's model — a regional football news
  outlet running its own awards with a website category — is *replicable*, and Flanders has regional
  football media (Voetbalkrant, Het Nieuwsblad's regional football pages, Sportbeat). None currently
  runs a website category. This is a gap, not an opportunity we control.

**Bottom line for Part 2:** there is exactly **one** genuine amateur-level club-website award on
record anywhere we could find — Berkshire's — it is regional to one English county, it is
nomination-driven rather than rubric-driven, and we are not eligible for it. **There is no award in
Belgium, the Netherlands, Germany or Italy that judges amateur club websites.** If the ambition is
"best amateur club site in the world", there is no scoreboard to win. The scorecard in §1 has to be
the scoreboard.

## 7. Open questions for Kevin

1. **Is there a tap-target floor, and is it 44px?** [#2529](https://github.com/soniCaH/www.kcvvelewijt.be/issues/2529)
   owns the article page, but the measurement is site-wide (footer, header, every `EditorialLink`).
   A 44px floor is achievable with `py-2 -my-2` and no visual change — but on a design where a
   32px-tall mono label is a deliberate register, "44px everywhere" would flatten it. **Is the rule
   "44px hit area, any visual size", or is it "44px visual", or is it per-surface?** This is the one
   decision that unblocks the biggest failure in this file, and it is a design decision, not a
   compliance one.

2. ~~**Does 320px matter to us?**~~ **Answered 2026-08-13: we already pass it.** Zero horizontal
   overflow at 320px on the homepage, the article detail page and `/ploegen/[slug]/wedstrijden`.
   No action needed; worth adding a regression check so it stays true.

3. **The homepage `<h1>` is the lead news headline** ("KCVV Elewijt B stelt de kern voor van seizoen
   2026-2027!"), not the club or the page. It changes every time an article is published. Is that
   deliberate editorial framing (the fanzine's front-page splash, which is defensible and rather
   good) or an accident of the hero component? It affects search snippets and screen-reader page
   identification either way.

4. **Do we submit to Awwwards?** It is the only award in this document whose published rubric
   (Design 40 / Usability 30 / Creativity 20 / Content 10) rewards what we deliberately do, and HM at
   ≥6.5 is realistic. It is also the only external forcing function available, since **no award
   anywhere in Belgium, the Netherlands, Germany or Italy judges amateur club websites.** The
   counter-argument: fixing the usability 30% first would raise the score, and submitting now spends
   the shot early.

5. **Should the homepage carry a per-age-band editorial stream?** It is the single axis where
   Binfield — an English step-4 club on WordPress — beats us, and it is the axis the award rewarded.
   It is an editorial commitment (someone must write youth news weekly), not a build task. Worth
   asking whether the club can sustain it before building the surface.

6. **What is the go-live plan for the apex?** `www.kcvvelewijt.be` still serves Gatsby. Every
   measurement in this file, and in all five sibling files, describes a site the public cannot reach.
   Nothing in §4 has any real-world effect until that flips.

7. **How do we get a real LCP/INP number?** Browser measurement is now done for geometry, overflow,
   TTFB and CLS (§3.2, §3.3) — but **LCP and INP remain unobtainable through the Chrome extension**,
   and this is a hard limit, not a flake. Evidence: `document.visibilityState` stayed `"hidden"` for
   the entire session because the Chrome window was occluded, and Chrome suppresses paint timing for
   a never-visible page — `performance.getEntriesByType('paint')` returned `[]` on every load, in the
   top document *and* inside same-origin iframes. Geometry (`getBoundingClientRect`) and
   `layout-shift` work fine in that state; paint timing never will. **The fix is a Playwright +
   Chromium run in the repo** (the same fallback Assessment B used on 2026-08-06), or a Lighthouse
   run, or restoring the PSI quota. Worth wiring as a standing check rather than a manual errand.

8. **Should this file's measurements become a regression test?** Six of the numbers here — 320px
   overflow, CLS, TTFB, tap-target percentages, heading structure, alt coverage — are cheap to assert
   and all six drifted or were mis-stated at least once during this research. A scripted probe would
   have caught every correction in §3.2/§3.3 automatically.

---

## Appendix — reproducing the measurements

```bash
# 1. Confirm which site the apex serves (currently Gatsby, not Next.js)
curl -s https://www.kcvvelewijt.be/ | grep -oE 'name="generator" content="[^"]*"'
for u in / /nieuws /kalender /ploegen/eerste-elftallen-a; do
  curl -so /dev/null -w "%{http_code} $u\n" "https://www.kcvvelewijt.be$u"
done

# 2. Fetch the real target with timing
for u in / /nieuws /kalender /ploegen/eerste-elftallen-a /club/geschiedenis /hulp; do
  curl -s -o "p$(echo "$u" | tr / _).html" \
    -w "%{http_code} ttfb=%{time_starttransfer}s total=%{time_total}s size=%{size_download}B $u\n" \
    "https://kcvv-nextjs.vercel.app$u"
done

# 3. Pull the shipping CSS — note the path is /_next/static/immutable/chunks/, NOT /_next/static/css/
for c in $(grep -oE '/_next/static/immutable/chunks/[a-zA-Z0-9._-]+\.css' p_.html | sort -u); do
  curl -s "https://kcvv-nextjs.vercel.app$c"
done > live.css
grep -oE '\-\-color-[a-z0-9-]+: *[^;}]{1,30}' live.css | sort -u
grep -oE 'font-size: *(0?\.[0-9]+rem|[0-9]{1,2}px)' live.css | sort -u
```

Contrast ratios were computed with the WCAG 2.x relative-luminance formula against the token values
actually present in `live.css`, not against DESIGN.md — that distinction is what caught the stale
`#008755` finding.

### Browser pass (the part that corrected four numbers)

Run in the page context. **The tab must be foregrounded for LCP/INP**; geometry and `layout-shift`
work even when it is not.

```javascript
// Tap targets — every visible interactive element
const sel = 'a,button,[role=button],input,select,summary';
const vis = [...document.querySelectorAll(sel)]
  .filter(e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; });
const meas = vis.map(e => {
  const r = e.getBoundingClientRect();
  return { t: (e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 40),
           w: Math.round(r.width), h: Math.round(r.height) };
});
const under = meas.filter(m => m.w < 44 || m.h < 44);
console.log(under.length + '/' + vis.length, Math.round(under.length / vis.length * 100) + '%');

// Warm TTFB + CLS (both survive a backgrounded tab)
const nav = performance.getEntriesByType('navigation')[0];
const cls = performance.getEntriesByType('layout-shift')
  .filter(e => !e.hadRecentInput).reduce((s, e) => s + e.value, 0);
console.log({ ttfb: Math.round(nav.responseStart), load: Math.round(nav.loadEventEnd), cls });
```

Narrow-viewport testing uses a same-origin iframe, because `resize_window` below ~1440 does not take
on this machine:

```javascript
const f = document.createElement('iframe');
f.style.cssText = 'position:fixed;left:0;top:0;width:320px;height:900px;z-index:99999;border:0';
f.src = '/';                                  // same origin, so contentDocument is readable
document.body.appendChild(f);
await new Promise(r => { f.onload = r; setTimeout(r, 9000); });
await new Promise(r => setTimeout(r, 2500));  // let lazy sections settle
const d = f.contentDocument, w = f.contentWindow;
console.log('overflow', d.documentElement.scrollWidth - w.innerWidth,
            'sections', d.querySelectorAll('section').length);   // sections > 0 ⇒ it really rendered
```

**Always check that the probe actually rendered** (`sections`/`interactive` counts non-zero) before
trusting a `0px overflow` result — a blank iframe also reports zero.

**Cold vs warm.** `curl` hits an idle ISR route cold; a browser navigating a warmed route does not.
The retracted 3.24s TTFB was the difference between those two. Measure both, and label which is which.

