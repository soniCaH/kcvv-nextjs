import type { CalendarMatch } from "@/app/(main)/kalender/utils";
import { fixtureImage } from "@test-fixtures/images";
import { KCVV_CLUB_ID } from "@/lib/constants";

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

export const tournamentOpponent = {
  id: 1391,
  name: "FC Zemst Sportief",
  logo: fixtureImage("sponsor-logo", 2),
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

/**
 * A tournament fixture (#2696/#2715) — `competitionType === "tournament"`, a
 * real named opponent, not a self-match. Renders the same reduced
 * row/card as `reservationMatch()` above, but the crest and subject name
 * the opponent, not KCVV — see `otherClubSide()`/`isReducedMatchRow()` in
 * `match-display.ts`. `homeTeam.id` is `KCVV_CLUB_ID`, not this file's
 * `kcvv` fixture's id `1` — `otherClubSide()` keys off the real club id,
 * which the local mock team objects elsewhere in this file don't carry.
 */
export function tournamentMatch(
  overrides: Partial<CalendarMatch> = {},
): CalendarMatch {
  return {
    id: 91,
    date: "2026-08-30T09:30:00",
    time: "09:30",
    homeTeam: { id: KCVV_CLUB_ID, name: "KCVV Elewijt", logo: kcvv.logo },
    awayTeam: tournamentOpponent,
    scoreDisplay: { type: "vs" },
    status: "scheduled",
    competition: "Tornooi",
    competitionType: "tournament",
    team: "U9",
    isHome: true,
    isPlaceholder: false,
    ...overrides,
  };
}
