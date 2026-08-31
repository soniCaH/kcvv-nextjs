import type { CompetitionType } from "@kcvv/api-contract";
import type { MatchStatus } from "@/lib/effect/schemas/match.schema";
import { matchStatusWording } from "@/components/match/MatchStatusBadge";
import { KCVV_CLUB_ID } from "@/lib/constants";

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
  { type: "score"; home: number; away: number } | { type: "vs" };

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
 * Fields `isReducedMatchRow` needs — a structural subset both `ScheduleRow`
 * members and `CalendarMatch` satisfy without a branch, mirroring
 * `ReservationSubjectInput` below.
 */
export interface ReducedRowInput {
  isPlaceholder: boolean;
  competitionType?: CompetitionType;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
}

/**
 * Whether a match row renders the reduced reservation register — one crest,
 * one mono subject, no link — instead of the full two-sided scoreboard.
 * True for a placeholder (#2606, both sides are the same club) and for a
 * tournament fixture (#2696, `competitionType === "tournament"` — never a
 * string match on the Dutch `competition` label) that has no result yet.
 *
 * Gated on there being a scoreline, not merely on `isPlayedMatch`: a
 * finished/forfeited/stopped tournament fixture whose scores are missing
 * from the feed must not fall back to the vs-framed, linked scoreboard with
 * a kickoff time and no score (#2696 review) — once a result exists, the
 * club really was the opponent, so the row reverts to the full scoreboard.
 *
 * The one place this question is asked — `<TeamAgendaRow>` and
 * `<CalendarMonth>`'s `captionLabel` gate each spelled it independently
 * once, and the two answers had already drifted apart by review.
 */
export function isReducedMatchRow(match: ReducedRowInput): boolean {
  if (match.isPlaceholder) return true;
  if (match.competitionType !== "tournament") return false;
  const hasScoreline =
    isPlayedMatch(match.status) &&
    typeof match.homeScore === "number" &&
    typeof match.awayScore === "number";
  return !hasScoreline;
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
 * The dark-ground counterpart to `OUTCOME_UNDERLINE` above — `<MatchStripView>`
 * on its match-day ground (#2616). The light mix reads as a pastel highlighter
 * *behind* ink text; on `--color-jersey-deep-dark` the text itself turns cream,
 * so the same cream-mixed tint would wash out under it instead of setting it
 * off. Mixed toward the ground rather than toward cream, at a heavier stop so
 * the patch still reads as a distinct tint against a ground it is this close
 * to in hue. Same keys, same "no tint on a draw" rule.
 */
export const OUTCOME_UNDERLINE_DARK: Record<MatchOutcome, string | undefined> =
  {
    win: "inset 0 -9px 0 color-mix(in srgb, var(--color-jersey-deep) 55%, var(--color-jersey-deep-dark))",
    draw: undefined,
    loss: "inset 0 -9px 0 color-mix(in srgb, var(--color-alert) 55%, var(--color-jersey-deep-dark))",
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

/**
 * `reservationView()`'s subject when a pitch-reservation fixture (#2606)
 * carries no competition label at all — not observed in production (every
 * one of the census's 17 rows carries a `TOURNAMENT`/`FRIENDLY` type), but
 * the row still needs a non-empty subject for the defensive case. Not
 * exported: `reservationView()` is the one reader, so the literal only needs
 * to be named once, here.
 */
const RESERVATION_SUBJECT_FALLBACK = "Gereserveerd";

/** The fields `reservationView()` needs — deliberately narrower than the full
 * `ScheduleReservation`/`MatchDetail` shapes so both can pass through it. */
export interface ReservationSubjectInput {
  status: MatchStatus;
  competition?: string;
}

export interface ReservationView {
  /**
   * The competition label, or the reservation fallback word when absent —
   * with the `otherClub` name appended ("TORNOOI · FC ZEMST SPORTIEF") when
   * one is given (#2696).
   */
  subject: string;
  /**
   * The exceptional-status marker (FF/AFG/CANC/STOP), or `null` for
   * `scheduled`/`finished` — see `isExceptionalMatchStatus`. A reservation can
   * be called off the same way a real fixture can (#2606), so this is not
   * dropped just because the row has no opponent to report a result against.
   */
  statusWording: { abbreviation: string; longForm: string } | null;
  /**
   * The uppercase kicker word `<MatchHero>`'s reduced hero uses in place of
   * `getKicker(status)`'s VOORBESCHOUWING/MATCHVERSLAG — a reservation is
   * never a preview or a report of a match, so it gets its own fixed word,
   * derived from the same fallback the subject falls back to rather than a
   * second hand-spelled literal.
   */
  kicker: string;
}

/**
 * The one place a pitch-reservation placeholder's subject/status derivation
 * lives (#2688) — pairs with `OUTCOME_UNDERLINE`/`MATCH_KIND_WORD` above for
 * the same reason: `<TeamAgendaRow>` (#2606) worked this logic out first and
 * inlined it; every renderer built after it (`<MatchStripView>`,
 * `/wedstrijd/[matchId]`) should call this instead of re-deriving the same
 * two rules a third and fourth time.
 *
 * `otherClub` is the tournament case's addition (#2696): a placeholder's
 * subject is the competition alone, a tournament fixture's is the
 * competition THEN the named club — the club is presented as where the
 * tournament is, never as an opponent, because PSD does not say whether it
 * hosts or merely shares the bracket. `reservationView` stays the one place
 * that composes either subject, rather than the join living a third time in
 * a component.
 */
export function reservationView(
  match: ReservationSubjectInput,
  otherClub?: { name: string },
): ReservationView {
  const competition = match.competition || RESERVATION_SUBJECT_FALLBACK;
  return {
    subject: otherClub
      ? [competition, otherClub.name].filter(Boolean).join(" · ")
      : competition,
    statusWording: isExceptionalMatchStatus(match.status)
      ? matchStatusWording(match.status)
      : null,
    kicker: RESERVATION_SUBJECT_FALLBACK.toUpperCase(),
  };
}

/**
 * The club that is not KCVV — derived from the club id, never home/away
 * (#2696: `isHome` answers "which side did PSD list as home", not "is this
 * club confirmed", which is not a question a tournament fixture can answer).
 * Deliberately not unified with this codebase's other "which side is the
 * opponent" tie-breaks — `MatchStripView`'s `opponentOf` uses
 * `isHome ?? id === KCVV_CLUB_ID`, `nieuws/[slug]/utils.ts` has a third —
 * those answer a different question for their own surface, on purpose.
 */
export function otherClubSide<Team extends { id: number }>(match: {
  homeTeam: Team;
  awayTeam: Team;
}): Team {
  return match.homeTeam.id === KCVV_CLUB_ID ? match.awayTeam : match.homeTeam;
}

/** The fields `reservationTitle()` needs, on top of `reservationView()`'s own. */
export interface ReservationTitleInput extends ReservationSubjectInput {
  home_team: { name: string };
}

/**
 * A pitch-reservation placeholder's title/summary: `reservationView()`'s
 * subject plus the club's own name, the shape both `formatMatchTitle()`
 * (`/wedstrijd/[matchId]/utils.ts`, the match detail page's SEO title) and
 * `buildSummary()` (`lib/utils/ical.ts`, the ICS feed) need. Shared here
 * rather than hand-spelled twice so the separator between the two halves
 * can't diverge silently between the two surfaces (#2698).
 */
export function reservationTitle(match: ReservationTitleInput): string {
  return `${reservationView(match).subject} — ${match.home_team.name}`;
}

/**
 * The accessible-name sentence for a reservation row — the one grammar three
 * renderers (`<MatchStripView>`, `<UpcomingMatchesClient>`, `<TeamAgendaRow>`)
 * each hand-built independently, each with its own copy of the "only
 * announce the time when the match is still `scheduled`" rule. `subject` is
 * whatever the caller composed (e.g. `reservationView(match).subject` alone,
 * or a squad label folded in ahead of it) — this function only owns the
 * sentence shape, not the vocabulary inside it. `kind`'s word is dropped
 * when `statusWording` is present, so the sentence never argues with itself
 * ("Volgende · AFG").
 *
 * The markup rule that pairs with this sentence: every reservation row is an
 * `<article aria-label={label}>`, never a `<div>` — a `<div>`'s implicit
 * `role=generic` does not support an accessible name from `aria-label` at
 * all (it is prohibited and silently ignored), so a `<div>` here renders
 * with no accessible content whatsoever.
 */
export function reservationRowLabel({
  kind,
  subject,
  dateLabel,
  time,
  status,
  statusWording,
}: {
  kind?: MatchRowKind;
  subject: string;
  dateLabel: string;
  time?: string;
  status: MatchStatus;
  statusWording: { abbreviation: string; longForm: string } | null;
}): string {
  // Only the fixture word. A reservation is a booking with no score, so it
  // never carries result vocabulary — "Uitslag: Tornooi" is a contradiction,
  // and this label is the row's sole accessible content (#2688).
  const kindWord =
    !statusWording && kind === "fixture" ? MATCH_KIND_WORD.fixture : null;
  return [
    kindWord ? `${kindWord}: ` : "",
    subject,
    `, ${dateLabel}`,
    status === "scheduled" && time ? ` om ${time}` : "",
    statusWording ? ` — ${statusWording.longForm}` : "",
  ].join("");
}
