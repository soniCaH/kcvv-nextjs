/**
 * Off-season notice decision rule (#2505) — resolves the Studio-authored
 * `matchesSliderPlaceholder` fields into the state `<FirstTeamsBlock>` reads
 * to pick its no-rows copy.
 *
 * Ported from `git show 8103b710:apps/web/src/components/home/
 * MatchesSliderEmptyState/decisionRule.ts` — the three branches
 * (future / today / past kickoff) and `clubCalendarDaysBetween` survive
 * verbatim. `ResolvedContent`'s four modes and their `eyebrow` values do not
 * come back (#2844): the 201-line `<MatchesSliderEmptyState>` markup stays
 * deleted, and the `unavailable` outage state is decided by
 * `<FirstTeamsBlock>` itself, before this rule is even reached — it wins
 * over every state below and is never modelled here.
 *
 * Kept free of React so it can be unit-tested in isolation, matching
 * `first-teams.ts`'s own convention.
 */
import { DateTime } from "luxon";
import { CLUB_TIMEZONE } from "@/lib/utils/dates";
import type { MatchesSliderPlaceholderVM } from "@/lib/repositories/homepage.repository";

// Calendar-days diff anchored to the club's local zone so a 23:30 UTC "now"
// (00:30 Brussels) reads the same calendar date as 01:30 UTC the next day.
// This is the opposite rule to a PSD kickoff (already an instant) — a Sanity
// `date` field has no time component, so it must be compared as a local
// calendar date, not a UTC one. Do not "fix" this.
export function clubCalendarDaysBetween(from: Date, to: Date): number {
  const fromDay = DateTime.fromJSDate(from, { zone: CLUB_TIMEZONE }).startOf(
    "day",
  );
  const toDay = DateTime.fromJSDate(to, { zone: CLUB_TIMEZONE }).startOf("day");
  return Math.round(toDay.diff(fromDay, "days").days);
}

export type PlaceholderState =
  | { kind: "countdown"; daysUntil: number; mededeling?: string; href?: string }
  | { kind: "today" }
  | { kind: "mededeling"; text: string; href?: string }
  | { kind: "empty" };

export function resolvePlaceholderState(
  placeholder: MatchesSliderPlaceholderVM | null | undefined,
  now: Date = new Date(),
): PlaceholderState {
  const kickoff = placeholder?.nextSeasonKickoff;
  const text = placeholder?.announcementText;
  const href = placeholder?.announcementHref;

  if (kickoff) {
    const daysUntil = clubCalendarDaysBetween(now, kickoff);
    if (daysUntil === 0) {
      return { kind: "today" };
    }
    if (daysUntil > 0) {
      return {
        kind: "countdown",
        daysUntil,
        ...(text ? { mededeling: text, ...(href ? { href } : {}) } : {}),
      };
    }
    // Past kickoff → fall through to the mededeling or empty state.
  }

  if (text) {
    return { kind: "mededeling", text, ...(href ? { href } : {}) };
  }

  return { kind: "empty" };
}

/** "1 dag" / "23 dagen" — the only pluralisation this sentence needs. */
export function formatDaysUntil(daysUntil: number): string {
  return `${daysUntil} ${daysUntil === 1 ? "dag" : "dagen"}`;
}
