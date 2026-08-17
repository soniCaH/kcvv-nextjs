---
target: news article detail page (/nieuws/[slug])
total_score: 23
max_score: 40
na_heuristics:
p0_count: 3
p1_count: 2
timestamp: 2026-08-12T12-00-55Z
slug: src-app-main-nieuws-slug-page-tsx
---

Method: dual-agent (A: a8acc03ce56c756a1 design review · B: a141e9177e76ff7b9 detector + browser evidence). Surface mode: Read. Live evidence from `kcvv-nextjs.vercel.app` across four real articles (interview, squad reveal, recruitment post, 2023 transfer archive).

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                                                                                                                                                                                          |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | Visibility of System Status     | 2         | `loading.tsx` is an exemplary skeleton, but the hero cover is `loading="lazy"` (no `priority` at this call site) so the LCP element paints as an empty taped frame — and the one promise the page makes, "1 MIN LEZEN", is wrong by ~6× on a 1,279-word interview. |
| 2         | Match System / Real World       | 3         | Dutch is plain and warm, but `ArticleMetadata` hard-defaults the byline to "KCVV ELEWIJT" while the hero and credits on the same page say "Kevin".                                                                                                                 |
| 3         | User Control and Freedom        | 1         | No back link, no breadcrumb, and on 2 of 4 articles no related row. `<main>` contained one link (the Facebook share). `ArticleMetadata.tsx:46` justifies dropping the breadcrumb by citing a back link that was never built.                                       |
| 4         | Consistency and Standards       | 2         | IBM Plex Mono renders nowhere on the site. Article endings differ by accident: interview = EndMark + credits; squad reveal = EndMark + nothing; 2023 archive piece = the full "Verder lezen." row.                                                                 |
| 5         | Error Prevention                | 2         | The reading-time reader walks a `qaBlock` shape that does not exist, and no type catches it. Nothing stops an editor pasting a bare `forms.gle` URL as the sole CTA.                                                                                               |
| 6         | Recognition Rather Than Recall  | 3         | Kicker/credit-chip context is good, but `QASectionDivider` renders `<aside role="separator">`, so the article body contains zero `<h2>`.                                                                                                                           |
| 7         | Flexibility and Efficiency      | 2         | Not n/a — share exists but as two 16×16px icon-only controls; no print treatment, no jump list for an 11-question Q&A, no keyboard route to the next article.                                                                                                      |
| 8         | Aesthetic and Minimalist Design | 3         | Hero is excellent. The same date renders three times in two casings, and the desktop column runs 101–110 characters per line.                                                                                                                                      |
| 9         | Error Recovery                  | 3         | `not-found.tsx` / `error.tsx` are strong and on-voice with correct `noindex`; docked because `[slug]` has no segment-level `not-found`, so a dead article slug offers no route back to the archive.                                                                |
| 10        | Help and Documentation          | 2         | Not n/a — `/hulp` exists and is in the nav. The recruitment article, exactly where a parent needs help, offers a raw Google Forms URL and links to neither `/hulp` nor `/club/word-lid`.                                                                           |
| **Total** |                                 | **23/40** | **Acceptable — significant improvements needed**                                                                                                                                                                                                                   |

Heuristic 1 was moved from Assessment A's 3 to 2 during synthesis: the wrong reading time is a status promise, not just an error-prevention gap.

## Design Specificity Verdict

The hero is unmistakably KCVV. Everything below the metadata bar is a generic publication template wearing cream paint.

**LLM assessment.** The hero earns its keep — `★ INTERVIEW · 27 APRIL 2026 ★` kicker, 72px Freight Big Pro with a single jersey-deep italic accent, subject credit-chip, `TapedFigure` cover with a tape strip at a sub-degree tilt, fanned into six authored variants by `renderArticleHero` (`page.tsx:96-197`). `EndMark` and `ArticleCredits` are real fanzine artefacts. But the 680px reading column — where the reader spends 95% of their time — got a drop cap and nothing else. Between the metadata bar and `EndMark`, the fanzine vocabulary DESIGN.md enumerates (tape, stamps, perforations, striped seams, highlighter strokes) appears zero times on three of four articles. The `/nieuws` index is far more characterful than its own destination: the reader clicks from a loud, specific room into a quiet, generic one. And the club's single uncopyable asset goes unused — the B-squad announcement names ~25 players and links to none of them, despite `resolveInternalLinkHref` already routing `player`/`team`/`staffMember`.

**Deterministic scan.** `detect.mjs` exit 2, 49 findings — 38 in shipped components (30 `design-system-font-size`, 8 `design-system-color`). Off-ramp size histogram: 10px×16, 15px×3, 13px×3, 9px×2, plus singletons at 12/17/20/22/26/30px. Concentrated in `EventDetailBlock`, `EventFactInline`, `HtmlTableBlock`, `TransferFactCard`, `SubjectAvatar`, `_variant-parts.tsx`. The 8 colour findings are all `DownloadButton.tsx:38-49`, including `#6b7280` — a direct hit on The No-Grey-UI Rule.

**False positives.** Exactly one drives the exit code: `broken-image` at `NewsCard.test.tsx:10`, a Vitest `next/image` mock. Nothing fired on DESIGN.md's deliberate deviations — no finding against sharp corners, 0-blur shadows, press-down hover, cream ground or sub-degree rotation.

**Visual overlays.** None — no user-visible overlay exists. Mutation preflight passed (no CSP header, no CSP meta, injected script executed), but Chrome mixed-content blocked `http://localhost:8400/detect.js` on an `https://` page; the script tag never fired `onload` or `onerror`. Live server started on port 8400 and confirmed stopped. All browser evidence is direct DOM measurement instead.

## Overall Impression

A superb front door with no room behind it. The hero, the skeleton and the serializer are genuinely well-made — `blockHasRenderableOutput`, `socialBrandFor`'s dot-prefixed suffix check, `buildComponents` exported so a guard can assert schema coverage. Then the reader crosses the metadata bar into an undifferentiated 109-character-per-line text field, reads for six minutes, and hits a wall with no exit.

The single biggest opportunity is the ending. Peak-end scores this page on how it finishes, and the flagship interview finishes in a void: `💚🤍 #KCVVE`, `★ EINDE GESPREK ★`, 70px of empty cream, credits, more cream, footer. The 2023 archive piece has a better ending than the 2026 flagship.

## What's Working

1. **The hero variant system is design work, not configuration.** Six authored variants off one shell, with a documented graceful-degrade path when PSD returns null (`page.tsx:335-343`). It survives missing data by design — exactly what PRODUCT.md principle 3 demands.
2. **`loading.tsx` is a model of the no-radius-on-skeletons rule.** It mirrors the real composition step-for-step — 1040 hero, `StripedSeam`, 1040 metadata rule, 680 prose, 1040 related row — using `border-2 border-ink`, `bg-paper-edge`, `shadow-paper-md`, `motion-safe:animate-pulse`.
3. **Image alt coverage is clean.** 0 images missing `alt` across all four articles, with descriptive Dutch alts. Empty `alt=""` only where correct — decorative avatar, header logo (also `aria-hidden`).

## Priority Issues

### [P0] IBM Plex Mono renders nowhere on the site

**What.** The shipped CSS carries two `.font-mono` rules: the project's `.font-mono{font-family:var(--font-family-mono)}` in `@layer base` (`globals.css:651`, block 569–678), and Tailwind v4's generated `.font-mono{font-family:var(--font-mono)}` in `@layer utilities`, which wins. `--font-mono` is never defined in the repo, so it resolves to Tailwind's default `ui-monospace, SFMono-Regular, Menlo…`. Confirmed three ways: both rules present in the deployed bundle; `--font-mono:ui-monospace, SFMono-Regular…` shipped verbatim; live DOM showing 0 of 411 elements resolving to any IBM Plex face, all 16 registered FontFace entries `unloaded`, `document.fonts.check('12px "IBM Plex Mono"')` false.

**Why it matters.** DESIGN.md calls the mono register "the system's connective tissue" and "the most-used non-body style in the system". 251 uses across 105 files — every kicker, date, score, timestamp, pill, stamp and nav item on the site — render in SF Mono. `stories/foundation/Typography.mdx:201` documents the register using `var(--font-mono)`, so Storybook shows the wrong font too.

**Fix.** Define `--font-mono` in `@theme` (or rename `--font-family-mono` to it). One line. Then delete the `@layer base` `.font-mono` override, which exists only to fight a namespace it should have occupied.

**Suggested command.** `/impeccable typeset`

### [P0] "1 MIN LEZEN" on a 1,279-word interview — reading time ignores every Q&A answer

**What.** `reading-time.ts:35` reads `extractBodyText(pair.answer)`. `packages/sanity-schemas/src/qaBlock.ts` stores answers at `qaPair.respondents[].answer` — there is no `pair.answer`, so only question strings are counted. Verified in both files.

**Why it matters.** Reading time is the one explicit contract the page makes with a scanning reader, and it under-reports by ~6× on the article type where it matters most. `AnyBlockItem.pairs` is structurally wrong, so no type-check catches it.

**Fix.** Walk respondents — `(pair.respondents ?? []).map(r => extractBodyText(r.answer)).join(" ")` — correct the type, and add a regression test built from the real `qaPair` fixture shape.

**Suggested command.** `/impeccable harden`

### [P0] The article has no exit — two of four end in a void

**What.** `<VerderLezenRow>` returns `null` at 0 items. On the flagship interview and the B-squad reveal, `<main>` contained one link (the Facebook sharer). No back link, no breadcrumb: `ArticleMetadata.tsx:46` trades the breadcrumb away citing a `"< Terug naar nieuws"` back link "on the hero"; `grep -rn "Terug naar"` returns only that comment. It was never built.

**Why it matters.** The two articles with no exit are the club's newest and best content. A reader who finishes them is dumped into the footer.

**Fix.** Build the back link `ArticleMetadata.tsx:46` already assumes, and make `VerderLezenRow` fall back to the 3 most recent articles (already fetched for `generateStaticParams`) rather than rendering nothing.

**Suggested command.** `/impeccable shape`

### [P1] Desktop reading measure runs 101–110 characters per line

**What.** Measured live at 1440px: the column is 680px exactly (correct per the locked rule), but paragraphs at `text-body-md` (16px) yield 109 CPL on the drop-cap paragraph and 101–103 CPL in Q&A answers. At 500px the same paragraph measures 73 CPL and reads fine — a desktop/tablet failure that worsens as the viewport widens toward the cap.

**Why it matters.** 100+ CPL is roughly double the 45–75 range; the eye loses the line-return on every wrap. This is the core Read-mode fundamental and the one the page fails. It also answers ticket 11 of the typeset map, which was scoped to measure exactly this and had not yet run.

**Fix.** Promote article prose to `body-lg` (1.125rem / lh 1.55) at `md:` and up — an existing DESIGN.md token, no new token, no container change. Lands ~97 CPL. Do not narrow the container; 680 is one of the three legal widths.

**Suggested command.** `/impeccable typeset`

### [P1] Section headings are `role="separator"`; the body has no `<h2>` and skips h1 → h3

**What.** `QASectionDivider.tsx` renders `<aside role="separator" aria-label={plain}>`, and `ArticleBody`'s `buildComponents` maps the `h2` block style straight into it. Live audit: the squad article's only headings are `H1` plus the footer's `H2`/`H3`; "Technische staf" is an `<aside>`. The interview's 11 questions are `<h3>` under an `<h1>` with nothing between.

**Why it matters.** Heading navigation is the standard screen-reader primitive for long-form and it is unavailable. A separator's `aria-label` never appears in a heading list. Sighted readers lose the grouping too.

**Fix.** Give `QASectionDivider` a heading-level prop, render the title span as a real `<h2>` inside the existing flex row with the rules and `✦` glyphs `aria-hidden`, and keep `role="separator"` only on the `dotted` variant. Zero visual change — the title is already its own flex child, so the three-centerline alignment contract holds.

**Suggested command.** `/impeccable harden`

## Persona Red Flags

**Casey (distracted mobile, one thumb)** — closest to PRODUCT.md's stated scene. The two share controls measure 16×16 CSS px (`ArticleMetadata.tsx:129,139`, verified at 1440 and 375) and sit at the far right of the metadata bar; sharing to a WhatsApp group is the likeliest mobile action on this page. Lands on an empty taped frame where the photo should be. Reads "1 MIN LEZEN", commits, is interrupted at question 4 of 11, and returns to no progress indicator, no section list and no heading structure. Finishes with nowhere to go.

**Sam (screen reader + keyboard)** — heading navigation is useless; the document's only headings are the `<h1>` and the footer's. Tab order through `<main>` on the interview has two stops, then the footer. Focus is visible everywhere, but it is the UA default (`outline: auto 1px rgb(31,31,31)`), not DESIGN.md's specified 2px jersey-deep ring at 2px offset. The `qaBlock` respondent label renders as a mono-caps `<p>` unassociated with its answer, so each answer arrives without its speaker attached.

**Rita, 68, long-time supporter, low digital confidence** (project-specific, derived from PRODUCT.md's explicit "less-digital visitors") — the only two controls on the entire article are unlabelled 16×16 glyphs; PRODUCT.md names this exact failure ("no unlabelled icons"). The recruitment article's call to action is a raw `https://forms.gle/LXxfaSdz5rvpM14FA` in body text — no button, no "Schrijf je in", no link to `/club/word-lid` sitting in the nav. No back link means her route to the news list is browser chrome, the affordance this audience is least fluent with.

## Cognitive Load

4 of 8 fail — critical band.

- FAIL Visual grouping — sections are separators, not headings.
- FAIL Visual hierarchy — 49–72px H1 → 11px mono → a flat 16px field for 1,279 words, nothing between.
- FAIL Working memory — no breadcrumb, back link, or section index to re-enter by.
- FAIL Minimal choices — inverted: zero onward options at the end of two articles. Zero is as much a decision-point failure as ten.

Passing: single focus, chunking, one-thing-at-a-time, progressive disclosure.

## Emotional Journey

- **Peak** — the hero, ~1.5s in. On mobile especially: kicker stars, 49px serif headline with the accent phrase in jersey-deep italic, subject chip, italic lead, taped photo.
- **Valley 1** — immediately after the metadata bar. The register collapses from a composed hero into an undifferentiated 109-CPL text field, abruptly and unearned.
- **Valley 2** — "1 MIN LEZEN" on a six-minute read.
- **Valley 3** — the recruitment CTA: a naked `forms.gle` URL at the moment of highest intent.
- **End** — a dead stop into the footer. Peak-end scores the page here, and the ending is nothing.

## Minor Observations

- 4px horizontal overflow at 375px on the transferoverzicht article — sole offender is the `VerderLezenRow` scroll-right arrow at `right: 379`. The interview measures 0px.
- 18 shipped sites below the 11px label floor (16 × `text-[10px]`, 2 × `text-[9px]`), rendering as low as 9.5px live. Contrast is fine (4.72:1); size is the risk. This is the article-page slice of the typeset map's 63-use sub-11px cluster.
- 22 `🔄` emoji as table icons at 15px inside `<td>` on the transferoverzicht article, plus `💚🤍` closing the interview body. These arrive as CMS content, so they are not a UI violation as written — but the system gives editors no sign-off primitive and no table-icon vocabulary, so they improvise with what Facebook taught them.
- Press-down hover ungated at `VideoBlock.tsx:331` — `hover:translate-x-1 hover:translate-y-1` with no `motion-safe:`.
- The date renders three times in two casings (hero kicker, metadata bar, credits).
- The article ends three times — `EndMark` → 70px cream → credits → more cream → footer.
- Hero (1040) and body (680) left edges do not align, creating an unarticulated ~75px step at the metadata bar. `loading.tsx` puts a `StripedSeam` at exactly that junction; the real page has none.
- `/nieuws` shows "A-PLOEG" twice in the filter row — the known Sanity title-case / GROQ case-sensitivity trap.
- No segment-level `not-found.tsx` under `nieuws/[slug]/`; a dead article slug falls through to the global 404, whose actions are "Naar de homepage" and "Zoeken" — neither is "back to the news archive".
- Seven undocumented file-type colours in `DownloadButton` (`#c0392b` `#2563b3` `#15803d` `#f97316` `#7c3aed` `#0f766e` `#d97706`), plausibly intentional file-type coding but off-palette and undocumented.

## Questions to Consider

1. If the reading column is where the reader spends 95% of their time, why is it the only part of the page the design system never touches? What would it look like if one fanzine primitive per ~400 words were the standard, and the body were treated as a designed surface rather than the gap between designed surfaces?
2. The club's one genuinely uncopyable asset is a live player/team/match database. Why does an article naming 25 players link to zero of them? Should player-name linking be an authoring affordance, or resolved automatically against the PSD roster at render time?
3. The 2023 archive article has a better ending than the 2026 flagship interview. What is the ending of an article actually for here — and should a recruitment article end somewhere different from a match recap? Match articles are currently the only type with an authored closer.
4. `ArticleMetadata` asserts the author is "KCVV Elewijt" while the credits block says "Kevin". Is a per-article byline something the club wants at all, or is the honest answer that everything is by the club and the `author` field should be removed rather than papered over with a default in a third place?
