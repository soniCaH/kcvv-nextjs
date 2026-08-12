# "Eerste ploegen" homepage block — locked design (#2211)

Visual record: [`04-b3-ia.html`](./04-b3-ia.html) (orientation B is the locked render).
Exploration of alternatives: [`01-directions.html`](./01-directions.html), [`03-matchday-desk-variants.html`](./03-matchday-desk-variants.html).

## Placement

Homepage spine (`app/(landing)/page.tsx`), in a new section **immediately after the
`uitgelicht` featured row** and before `featuredEventSection`.

## Voice — B3 "matchday desk", full-width rows

- Full-bleed `bg-jersey-deep-dark` band, **`StripedSeam colorPair="cream-jersey-deep"` top + bottom**
  (the band below — `FeaturedEventBand` — is a flat `bg-jersey-deep` with no seam, so the bottom
  seam is needed to break cleanly between the two greens).
- Header on the dark field: warm mono kicker **"Eerste ploegen"** + `EditorialHeading` **"Dit weekend."**
  - **"Volledige kalender →"** (warm) → `/kalender`.

## Per team — one full-width row

`[ team label ] · [ result card ] · [ fixture card ]`

- **Team label** (non-interactive): "A-ploeg" / "B-ploeg" + division (`divisionFull ?? division`).
- **Result card** → `/wedstrijd/{resultId}` (own press-down target). Dark, cream border,
  `--shadow-paper-sm-soft`. Outcome word + **official home–away scoreline** (KCVV bold, crests L↔R) +
  outcome underline (`getResultColor` → win = jersey-deep mix, loss = alert mix, draw = none) + `thuis/uit · date`.
- **Fixture card** → `/wedstrijd/{fixtureId}` (own press-down target). Cream stub: date tear-off +
  opponent crest/name + home/away + kickoff time.
- **Two independent press targets per row** (not one row group) — links split per the owner decision.

## Outcome word — amended by #2404

The lock called for an **outcome word** on the result card. The #2301 unification onto the
shared `<TeamAgendaRow>` dropped it, leaving the two cards told apart only by cream-vs-green
and by which column they sat in, and the win/loss tint carried by hue alone.

It is back, in the row's mono caption rather than beside the scoreline — the caption already
renders there, so it costs no height, and the centre column stays free for the score (#2397).
`<TeamAgendaRow kind="result" | "fixture">` resolves it most-informative-first:

| state                               | caption opens with                                         |
| ----------------------------------- | ---------------------------------------------------------- |
| settled (`finished` / `forfeited`)  | `Winst` / `Gelijkspel` / `Verlies`                         |
| a status the layout can't speak for | nothing — the `PP` / `AFG` / `STOP` marker already says it |
| otherwise                           | the slot's own word: `Uitslag` / `Volgende`                |

The words live in `OUTCOME_WORD` / `MATCH_KIND_WORD` (`lib/utils/match-display.ts`), beside the
`OUTCOME_UNDERLINE` they de-colour. The prop is opt-in: `<TeamMatchesSection>` heads its featured
row "Eerstvolgende" and `/kalender` groups rows under a date, so both would say it twice.

**The slot is the caller's answer, never derived from `match.status`.** `pickLastResult` puts a
match whose kickoff has passed into the result column even while PSD still calls it `scheduled` —
the `AwaitingResult` state this lock's "graceful skip" section already anticipates. A status-derived
word labelled that column "Volgende", the same word as the fixture card beside it.

## Scoreline orientation

Official **home–away** (matches `TeamAgendaRow` site convention), KCVV bolded wherever it sits.

## Graceful skip

- Missing result → result card replaced by "Nog geen uitslag" placeholder (non-interactive).
- Missing fixture → fixture card replaced by "Geen geplande wedstrijd".
- A team's whole row is dropped only if it has **neither** result nor fixture.
- **Amended by #2399:** when that leaves _no_ rows, the band no longer disappears. Chrome
  (seams, kicker, heading, "Volledige kalender →") stays and the rows region holds its shape
  open with a dashed notice — #2427's tier-2 register. A vanished band made a PSD outage
  indistinguishable from a club that never posted the result, so the notice names which it is:
  - feed genuinely empty → "Nog geen wedstrijden ingepland."
  - BFF read failed → "Uitslagen en wedstrijden zijn even niet beschikbaar. Probeer het later opnieuw."

## Plumbing

- `BffService.getMatches(psdId)` per senior team (A/B from `TeamRepository`, `age` not `U*`); split
  client-side into last result (latest played) + next fixture (earliest upcoming). No new BFF call.
- Filter A/B (senior `psdId`s) **out of** the "Komende wedstrijden" `UpcomingMatches` agenda.
- `MatchStrip` (A-team band) untouched.
- Analytics: `match_card_click` `{ team_slug, match_id, source: "first_teams_result" | "first_teams_fixture" }`
  (all params already in `scripts/analytics-taxonomy.mjs`; `match_` prefix already covered).
- Story (`Features/Home/*`, `tags: ["autodocs","vr"]`, local imagery) + VR baseline in the same PR.
