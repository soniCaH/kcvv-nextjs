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

export function getResultColor(
  homeScore: number,
  awayScore: number,
  isHome: boolean,
): "win" | "draw" | "loss" {
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
export const OUTCOME_UNDERLINE: Record<
  "win" | "draw" | "loss",
  string | undefined
> = {
  win: "inset 0 -9px 0 color-mix(in srgb, var(--color-jersey-deep) 34%, var(--color-cream))",
  draw: undefined,
  loss: "inset 0 -9px 0 color-mix(in srgb, var(--color-alert) 38%, var(--color-cream))",
};

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
 * Colour is deliberately NOT unified here: `/kalender` fills home with
 * `card-red` while the homepage badge uses `jersey-deep`. That reconcile is
 * #2404's, not this one's.
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
