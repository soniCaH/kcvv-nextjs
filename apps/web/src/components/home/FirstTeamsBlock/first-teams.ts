/**
 * Pure view-model derivation for the homepage "Eerste ploegen" block (#2211).
 *
 * From a senior team's full season feed (`BffService.getMatches(psdId)`),
 * derive its last result + next fixture, mirroring the split used on the
 * team-detail agenda (`TeamMatchesSection`): next = earliest `scheduled` with
 * `date >= now`; result = most recent played match (`isPlayedMatch`, so
 * forfeits and abandoned matches count) that is either past its kickoff or
 * already carries a scoreline. See `matchSlot` for how every `MatchStatus`
 * maps onto the two slots. Both sides are emitted as `ScheduleMatch` via the shared
 * `transformMatchToSchedule`, so the block renders them with the same unified
 * `<TeamAgendaRow>` used on team pages + `/kalender` (#2301, Direction A) —
 * no bespoke card shapes to drift. Kept free of React so it can be unit-tested
 * in isolation.
 */
import type { Match } from "@/lib/effect/schemas";
import type { ScheduleMatch } from "@/components/match/types";
import { transformMatchToSchedule } from "@/components/match/transform";
import { hasScore, isPlayedMatch } from "@/lib/utils/match-display";
import type { FirstTeamsCardKind } from "./first-teams-analytics";

export interface FirstTeamInput {
  /** Display label, e.g. "A-ploeg". */
  label: string;
  /** Team slug, e.g. "a-ploeg" (drives the team-matches deep link). */
  slug: string;
  /** Division label, e.g. "3de Nationale". */
  division?: string;
}

export interface FirstTeamVM extends FirstTeamInput {
  /** Most recent played match — rendered as a cream `<TeamAgendaRow>`. */
  result?: ScheduleMatch;
  /** Next scheduled fixture — rendered as the featured jersey-deep `<TeamAgendaRow>`. */
  fixture?: ScheduleMatch;
}

/**
 * Short row label for a first team. The A/B sides carry a trailing single-letter
 * segment in their slug (`eerste-elftallen-a` → "A-ploeg"); anything else falls
 * back to the CMS `name`. Avoids title-casing the whole slug, which produced
 * "Eerste-elftallen-a".
 */
export function firstTeamLabel(slug: string, name: string): string {
  const tail = slug.split("-").pop() ?? "";
  return /^[a-z]$/i.test(tail) ? `${tail.toUpperCase()}-ploeg` : name;
}

/** The fields senior-team selection reads — structural, so both call sites fit. */
export interface SeniorTeamCandidate {
  psdId: string | null;
  age: string | null;
  slug: string;
}

/**
 * Senior (non-youth) teams that carry a `psdId`, sorted by slug so
 * `eerste-elftallen-a` precedes `-b`. Shared by the homepage's
 * `<FirstTeamsBlock>` wiring and the landing strip's first-team lookup — the
 * two used to hold identical copies of this filter and could drift apart.
 */
export function selectSeniorTeams<T extends SeniorTeamCandidate>(
  teams: readonly T[],
): T[] {
  return teams
    .filter((t) => t.psdId && !(t.age ?? "").toUpperCase().startsWith("U"))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Which of the block's two slots (`FirstTeamsCardKind`) a status may occupy —
 * `null` for a status that belongs in neither.
 *
 * Exhaustive over `MatchStatus`: a new member is a compile error here rather
 * than a match that silently disappears from both slots, which is exactly how
 * `forfeited` / `postponed` / `cancelled` went missing (#2423). The played set
 * is not re-listed — it comes from the shared `isPlayedMatch`, the same
 * predicate `<TeamAgendaRow>` uses to decide whether to render a scoreline, so
 * the picker and the row can't disagree about what a result is.
 *
 * `postponed` / `cancelled` are deliberately in neither slot. Both slots answer
 * "what happened" and "where do I go next"; a match that will not be played
 * answers neither, and a rescheduled one returns to the feed as `scheduled` at
 * its new date. The team agenda (`/ploegen/<slug>/wedstrijden`) remains the
 * place that lists every match including these.
 */
function matchSlot(status: Match["status"]): FirstTeamsCardKind | null {
  if (isPlayedMatch(status)) return "result";
  switch (status) {
    case "scheduled":
      return "fixture";
    case "postponed":
    case "cancelled":
      return null;
    default: {
      const _exhaustive: never = status;
      throw new Error(`Unhandled MatchStatus: ${String(_exhaustive)}`);
    }
  }
}

/**
 * Most recent result. A played match qualifies once its kickoff has passed, or
 * as soon as it carries a scoreline — a forfeit is awarded in advance, so
 * `date < now` alone would hide it right up to a kickoff that never happens
 * (#2423). Without a scoreline a future-dated match stays out: there is nothing
 * settled to headline yet.
 */
export function pickLastResult(
  matches: readonly Match[],
  now: Date,
): Match | undefined {
  return matches
    .filter(
      (m) =>
        matchSlot(m.status) === "result" &&
        (m.date.getTime() < now.getTime() || hasScore(m)),
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
}

export function pickNextFixture(
  matches: readonly Match[],
  now: Date,
): Match | undefined {
  return matches
    .filter(
      (m) =>
        matchSlot(m.status) === "fixture" && m.date.getTime() >= now.getTime(),
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
}

/**
 * Build the view-model for one senior team. Always returns the team identity;
 * `result` / `fixture` are present only when a match exists for that side.
 */
export function deriveFirstTeamVM(
  team: FirstTeamInput,
  matches: readonly Match[],
  now: Date,
): FirstTeamVM {
  const result = pickLastResult(matches, now);
  const fixture = pickNextFixture(matches, now);
  return {
    ...team,
    ...(result ? { result: transformMatchToSchedule(result) } : {}),
    ...(fixture ? { fixture: transformMatchToSchedule(fixture) } : {}),
  };
}
