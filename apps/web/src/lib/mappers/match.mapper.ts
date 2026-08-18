/**
 * Match Mappers
 * Transform match data between different formats
 */

import type { Match } from "@/lib/effect/schemas/match.schema";
import type { UpcomingRow } from "@/components/match/types";

/**
 * Map Match (domain model) to the homepage other-teams agenda's row shape.
 *
 * Branches on `match.is_placeholder` (#2606) into the two `UpcomingRow`
 * members (#2688) — a pitch reservation has no opponent to map onto
 * `homeTeam`/`awayTeam`, so building one unconditionally rendered
 * "KCVV Elewijt — KCVV Elewijt" on `<UpcomingMatchesClient>`, the surface
 * most likely to carry one (it renders exactly the non-senior/youth
 * matches, and youth tournaments are where reservations come from).
 *
 * @param match - Match data from domain layer
 * @returns UpcomingRow object for UI consumption
 */
export function mapMatchToUpcomingMatch(match: Match): UpcomingRow {
  if (match.is_placeholder) {
    return {
      isPlaceholder: true,
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

  return {
    isPlaceholder: false,
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
