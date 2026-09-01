import type { ScheduleRow } from "@/components/match/types";

/**
 * Pure match-selection logic behind `<TeamMatchesSection>`, split out of that
 * `"use client"` component so `page.tsx` (a server component) can import the
 * SAME predicate that decides what the section renders, rather than
 * re-deriving a second version of it (#2636 finding 2).
 *
 * Before this split, `#wedstrijden`'s seam, `<section>` and sticky-nav entry
 * were driven by the page's own `inCompetition` flag alone, while
 * `<TeamMatchesSection>` could still self-hide beneath them (every league
 * fixture postponed/cancelled/forfeited/stopped, or stuck at `"scheduled"`
 * in the past) — an empty section behind a live nav chip, which is exactly
 * the render/nav drift the AC requires staying in sync.
 */

export const RECENT_COUNT = 3;

export function findNextMatch(
  matches: readonly ScheduleRow[],
  now: Date,
): ScheduleRow | undefined {
  return matches
    .filter((m) => m.status === "scheduled" && m.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
}

export function recentResults(
  matches: readonly ScheduleRow[],
  excludeId: number | undefined,
  now: Date,
): ScheduleRow[] {
  return matches
    .filter(
      (m) => m.status === "finished" && m.date < now && m.id !== excludeId,
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, RECENT_COUNT);
}

/**
 * Whether `<TeamMatchesSection>` would render anything for this match list —
 * a featured next fixture, a recent result, or both. `now` defaults to the
 * current time so a page-level caller and the section's own render need not
 * thread one instant between them; both read PSD data that is day/hour
 * granular, never second-granular, so two independent `new Date()` calls a
 * few milliseconds apart cannot disagree in practice.
 */
export function hasVisibleMatches(
  matches: readonly ScheduleRow[],
  now: Date = new Date(),
): boolean {
  if (matches.length === 0) return false;
  const next = findNextMatch(matches, now);
  const recent = recentResults(matches, next?.id, now);
  return next !== undefined || recent.length > 0;
}
