import type { CalendarMatch } from "@/app/(main)/kalender/utils";
import { fixtureImage } from "@test-fixtures/images";

export const kcvv = {
  id: 1,
  name: "KCVV Elewijt A",
  logo: fixtureImage("sponsor-logo", 0),
};

export const opponent = {
  id: 2,
  name: "Racing Mechelen",
  logo: fixtureImage("sponsor-logo", 1),
};

/**
 * A youth tournament placeholder (#2606) — both sides are KCVV. Renders as
 * the reduced reservation row/card, no opponent, no link (#2688). Shared
 * across CalendarMonth/CalendarWeek/CalendarWidget's stories, which only
 * ever differ on `date` (each needs a date inside the range it renders) —
 * `isHome` is left unset deliberately: a reservation has no side to name.
 */
export function reservationMatch(
  overrides: Partial<CalendarMatch> = {},
): CalendarMatch {
  return {
    id: 90,
    date: "2026-03-15T09:30:00",
    time: "09:30",
    homeTeam: kcvv,
    awayTeam: kcvv,
    scoreDisplay: { type: "vs" },
    status: "scheduled",
    competition: "Tornooi",
    team: "U8",
    isPlaceholder: true,
    ...overrides,
  };
}
