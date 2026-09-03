/**
 * Match Mappers
 * Transform match data between different formats
 */

import type { Match } from "@/lib/effect/schemas/match.schema";
import { KCVV_CLUB_ID } from "@/lib/constants";
import { isReducedMatchRow } from "@/lib/utils/match-display";
import type { UpcomingRow } from "@/components/match/types";

/**
 * Map Match (domain model) to the homepage other-teams agenda's row shape.
 *
 * Branches on `match.is_placeholder` and `isReducedMatchRow()` (#2606/#2696)
 * into the three `UpcomingRow` members (#2688/#2802) — a pitch reservation
 * has no opponent to map onto `homeTeam`/`awayTeam`, so building one
 * unconditionally rendered "KCVV Elewijt — KCVV Elewijt" on
 * `<UpcomingMatchesClient>`, the surface most likely to carry one (it
 * renders exactly the non-senior/youth matches, and youth tournaments are
 * where reservations come from). A tournament fixture with no result yet
 * gets the same reduced treatment for the same reason every other renderer
 * of this predicate does — `<UpcomingMatchesClient>` had no such branch
 * before this ticket.
 *
 * @param match - Match data from domain layer
 * @returns UpcomingRow object for UI consumption
 */
export function mapMatchToUpcomingMatch(match: Match): UpcomingRow {
  if (match.is_placeholder) {
    return {
      isPlaceholder: true,
      kind: "reservation",
      id: match.id,
      date: match.date,
      time: match.time,
      venue: match.venue,
      team: {
        id: match.home_team.id,
        name: match.home_team.name,
        logo: match.home_team.logo,
      },
      status: match.status,
      competition: match.competition,
      squadLabel: match.squadLabel,
      kcvvTeamLabel: match.kcvv_team_label,
    };
  }

  if (
    isReducedMatchRow({
      isPlaceholder: false,
      competitionType: match.competitionType,
      status: match.status,
      homeScore: match.home_team.score,
      awayScore: match.away_team.score,
    })
  ) {
    const other = otherClub(match);
    return {
      isPlaceholder: false,
      kind: "reduced",
      id: match.id,
      date: match.date,
      time: match.time,
      venue: match.venue,
      team: { id: other.id, name: other.name, logo: other.logo },
      status: match.status,
      competition: match.competition,
      competitionType: match.competitionType,
      squadLabel: match.squadLabel,
      kcvvTeamLabel: match.kcvv_team_label,
    };
  }

  return {
    isPlaceholder: false,
    kind: "match",
    id: match.id,
    date: match.date,
    time: match.time,
    venue: match.venue,
    homeTeam: {
      id: match.home_team.id,
      name: match.home_team.name,
      logo: match.home_team.logo,
      score: match.home_team.score,
    },
    awayTeam: {
      id: match.away_team.id,
      name: match.away_team.name,
      logo: match.away_team.logo,
      score: match.away_team.score,
    },
    status: match.status,
    squadLabel: match.squadLabel,
    competition: match.competition,
    kcvvTeamId: match.kcvv_team_id,
    kcvvTeamLabel: match.kcvv_team_label,
  };
}

/** See `otherClub` in `@/components/match/transform` — same one-liner, same
 * reason it isn't the shared `otherClubSide()` (that helper is generic over
 * already-transformed camelCase view-models, not the raw snake_case `Match`). */
function otherClub(match: Match): Match["home_team"] {
  return match.home_team.id === KCVV_CLUB_ID
    ? match.away_team
    : match.home_team;
}

/**
 * Map array of Matches to UpcomingRows
 *
 * @param matches - Array of Match objects from domain layer
 * @returns Array of UpcomingRow objects for UI consumption
 */
export function mapMatchesToUpcomingMatches(
  matches: readonly Match[],
): UpcomingRow[] {
  return matches.map(mapMatchToUpcomingMatch);
}
