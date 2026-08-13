import type { MatchStatus } from "@/lib/effect/schemas/match.schema";

interface HasScoreMatch {
  home_team: { score?: number };
  away_team: { score?: number };
  status: MatchStatus;
}

interface HasScoreNarrowed {
  home_team: { score: number };
  away_team: { score: number };
  status: MatchStatus;
}

/**
 * Statuses whose outcome is final: the match either ran to full time or was
 * awarded. Mirrors the BFF's own `isSettledMatchStatus`
 * (`apps/api/src/psd/transforms.ts`). Deliberately excludes `stopped` — a match
 * abandoned early may be replayed, so its partial scoreline is not a result.
 *
 * The list lives here once and everything else derives from it: the type below,
 * the predicate, `hasScore`, the homepage result slot (`first-teams.ts`), and
 * `<TeamAgendaRow>`'s outcome tint. Keeping the literal union and the runtime
 * check on one source is the point — TypeScript does not verify a hand-written
 * `x is T` body against its declared type, so two hand-maintained copies drift
 * silently.
 */
const SETTLED_STATUSES = ["finished", "forfeited"] as const;

export type SettledMatchStatus = (typeof SETTLED_STATUSES)[number];

/** Whether a match's outcome is final — see `SETTLED_STATUSES`. */
export function isSettledMatch(
  status: MatchStatus,
): status is SettledMatchStatus {
  return SETTLED_STATUSES.some((settled) => settled === status);
}

export function hasScore(
  match: HasScoreMatch,
): match is HasScoreMatch & HasScoreNarrowed {
  return (
    isSettledMatch(match.status) &&
    typeof match.home_team.score === "number" &&
    typeof match.away_team.score === "number"
  );
}

export type ScoreDisplay =
  | { type: "score"; home: number; away: number }
  | { type: "vs" };

export function getScoreDisplay(match: HasScoreMatch): ScoreDisplay {
  if (hasScore(match)) {
    return {
      type: "score",
      home: match.home_team.score,
      away: match.away_team.score,
    };
  }
  return { type: "vs" };
}

/**
 * A settled match's result from KCVV's side. Named once here so the tint
 * (`OUTCOME_UNDERLINE`) and the word (`OUTCOME_WORD`) that decodes it are keyed
 * off the same union rather than two hand-spelled copies.
 */
export type MatchOutcome = "win" | "draw" | "loss";

export function getResultColor(
  homeScore: number,
  awayScore: number,
  isHome: boolean,
): MatchOutcome {
  if (homeScore === awayScore) return "draw";
  const homeWins = homeScore > awayScore;
  return homeWins === isHome ? "win" : "loss";
}

/**
 * Whether a match has been played (a score is meaningful). Shared by every row
 * that switches between a kickoff time and a scoreline + outcome underline
 * (`<TeamAgendaRow>`, the kalender agenda row) so the status set can't drift
 * between them.
 *
 * Wider than `isSettledMatch`: it includes `stopped`, because an abandoned
 * match's partial scoreline is still what the row should show. Which result
 * *headlines* a surface is the stricter question — use `isSettledMatch` there.
 */
export function isPlayedMatch(status: MatchStatus): boolean {
  return isSettledMatch(status) || status === "stopped";
}

/**
 * Whether a status changes what a row means and so has to be named on it.
 * `scheduled` and `finished` are the unremarkable cases the layout already
 * communicates on its own (a kickoff time / a scoreline); every other status
 * makes the row lie unless it is marked — a forfeit rendering a bare `5 – 0`,
 * an `afgelast` match rendering a kickoff nobody should turn up for (#2423).
 */
export function isExceptionalMatchStatus(status: MatchStatus): boolean {
  return status !== "scheduled" && status !== "finished";
}

/**
 * Inset underline that tints a finished match's scoreline by KCVV-perspective
 * outcome (win = jersey-deep, loss = alert, draw = none — the cream mix keeps it
 * legible on both cream and jersey-deep cards). Owned by `<TeamAgendaRow>` —
 * the shared match row used on team pages, `/kalender`, and the homepage
 * `<FirstTeamsBlock>` (#2301) — so the outcome colour can't drift between them.
 */
export const OUTCOME_UNDERLINE: Record<MatchOutcome, string | undefined> = {
  win: "inset 0 -9px 0 color-mix(in srgb, var(--color-jersey-deep) 34%, var(--color-cream))",
  draw: undefined,
  loss: "inset 0 -9px 0 color-mix(in srgb, var(--color-alert) 38%, var(--color-cream))",
};

/**
 * The word for a settled match's outcome, KCVV-perspective — the label register
 * that names what `OUTCOME_UNDERLINE` above tints. The tint alone is meaning by
 * colour: a win and a loss differ only in hue, and a draw is the absence of one
 * (#2404). Every surface that renders the underline should be able to reach for
 * the word from here rather than inventing its own.
 *
 * Nouns, not the share card's verbs. `resolveResultMood`
 * (`components/share/shared/theme.ts`) says "Gewonnen" / "Verloren" because
 * there the word is a display headline standing on its own; here it prefixes a
 * 9px mono caption and has to read as a label. "Gelijkspel" is deliberately
 * spelled the same on both.
 *
 * Known gap, named rather than papered over: `<CalendarAgenda>` renders the
 * tint from its own local `OUTCOME_UNDERLINE` copy — which has already drifted
 * from the one above (`-4px` solid vs `-9px` `color-mix`) — and carries no word
 * at all. Pointing it here would change `/kalender`'s pixels, so #2404 left it;
 * the underline's "so the outcome colour can't drift between them" claim above
 * is aspirational until it lands.
 */
export const OUTCOME_WORD: Record<MatchOutcome, string> = {
  win: "Winst",
  draw: "Gelijkspel",
  loss: "Verlies",
};

/**
 * The word for the slot a match row is filling, used when no outcome word
 * applies — see `MatchRowKind` below for why the slot is given, not derived.
 *
 * `result` is the fallback rather than the norm: a settled match uses
 * `OUTCOME_WORD` above, which says strictly more. See `<TeamAgendaRow>`'s
 * `kind` prop for the full resolution order.
 */
export const MATCH_KIND_WORD = {
  result: "Uitslag",
  fixture: "Volgende",
} as const;

/**
 * Which slot a match row is filling — the *surface's* answer, not the match's.
 *
 * These cannot be derived from `status`, and a row that tries gets it wrong:
 * `pickLastResult` (`first-teams.ts`) deliberately hands the result slot a match
 * whose kickoff has passed while PSD still says `scheduled`, so status-derivation
 * labels the homepage's result column "Volgende" — the same word as the fixture
 * card beside it (#2404). The column knows; the row has to be told.
 */
export type MatchRowKind = keyof typeof MATCH_KIND_WORD;

/**
 * The one home/away vocabulary (#2398 AC4). Four surfaces state this same fact
 * and had four hand-maintained copies of the wording: `<UpcomingMatchesClient>`'s
 * badge, `<TeamAgendaRow>`'s glyph, `<MatchStripView>`'s `<VenueGlyph>` (whose
 * comment already claimed to reuse the row's vocabulary while copying it), and
 * `<MatchVenueTag>` on `/kalender`.
 *
 * Only the *words* live here — `House`/`Bus` cannot, because `@/lib/icons.redesign`
 * is a `"use client"` module and this file is imported by server code
 * (`first-teams.ts`). Each surface keeps its own chrome and picks the register it
 * has room for; the short form is for surfaces that also show the glyph, the
 * long form for glyph-only surfaces where it is the accessible name.
 *
 * Colour is deliberately NOT unified here, and #2404 confirmed it should not be:
 * `/kalender`'s `card-red` is the locked colour of the *Wedstrijden* category
 * (6d1/#1992), not of "thuis", so moving it would break a different system than
 * the one it appears to belong to. What #2404 did unify is the grammar — filled
 * = thuis, outlined = uit on both surfaces. See `<HomeAwayBadge>` in
 * `<UpcomingMatchesClient>`.
 */
export const HOME_AWAY_WORD = {
  home: "Thuis",
  away: "Uit",
} as const;

/** Accessible name for a glyph-only home/away marker — see `HOME_AWAY_WORD`. */
export const HOME_AWAY_A11Y_NAME = {
  home: "Thuiswedstrijd",
  away: "Uitwedstrijd",
} as const;
