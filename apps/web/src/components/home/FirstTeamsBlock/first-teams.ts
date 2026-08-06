/**
 * Pure view-model derivation for the homepage "Eerste ploegen" block (#2211).
 *
 * From a senior team's full season feed (`BffService.getMatches(psdId)`),
 * derive its last result + next fixture, mirroring the split used on the
 * team-detail agenda (`TeamMatchesSection`): next = earliest `scheduled` with
 * `date >= now`; result = most recent `finished` match with `date < now`
 * (finished-only — forfeits / abandoned matches aren't surfaced as a headline
 * result). Both sides are emitted as `ScheduleMatch` via the shared
 * `transformMatchToSchedule`, so the block renders them with the same unified
 * `<TeamAgendaRow>` used on team pages + `/kalender` (#2301, Direction A) —
 * no bespoke card shapes to drift. Kept free of React so it can be unit-tested
 * in isolation.
 */
import type { Match } from "@/lib/effect/schemas";
import type { ScheduleMatch } from "@/components/match/types";
import { transformMatchToSchedule } from "@/components/match/transform";

export interface FirstTeamInput {
  /** Display label, e.g. "A-ploeg". */
  label: string;
  /** Team slug, e.g. "a-ploeg" (drives the team-matches deep link). */
  slug: string;
  /** Division label, e.g. "3de Nationale". */
  division?: string;
}

export interface FirstTeamVM extends FirstTeamInput {
  /** Most recent finished match — rendered as a cream `<TeamAgendaRow>`. */
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

export function pickLastResult(
  matches: readonly Match[],
  now: Date,
): Match | undefined {
  return matches
    .filter((m) => m.status === "finished" && m.date.getTime() < now.getTime())
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
}

export function pickNextFixture(
  matches: readonly Match[],
  now: Date,
): Match | undefined {
  return matches
    .filter(
      (m) => m.status === "scheduled" && m.date.getTime() >= now.getTime(),
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
