import type { Match } from "@/lib/effect/schemas";
import type { ScheduleRow, ScheduleTeam } from "./types";

/**
 * Transform a BFF `Match` into the `ScheduleRow` shape consumed by the
 * match-agenda components (`<TeamMatchesSection>` / `<TeamAgendaRow>`). Shared
 * by the team-detail pages, the opponent-history (`/tegenstander`) page, the
 * homepage `<FirstTeamsBlock>`, and the landing `<MatchStripView>`.
 *
 * Branches on `match.is_placeholder` into the two `ScheduleRow` members
 * (#2688) — the contract itself stays sparse (`is_placeholder` is `undefined`
 * for an ordinary fixture, per #2606/#2632's review), but the web view-model
 * normalises that into a definite `isPlaceholder` discriminant, because the
 * union needs a real discriminant to narrow on, not a tri-state optional.
 *
 * @param match - Match from PSD API via the BFF
 * @returns ScheduleRow object for display
 */
export function transformMatchToSchedule(match: Match): ScheduleRow {
  if (match.is_placeholder) {
    return {
      isPlaceholder: true,
      id: match.id,
      date: match.date,
      time: match.time,
      team: transformTeam(match.home_team),
      status: match.status,
      competition: match.competition,
    };
  }

  return {
    isPlaceholder: false,
    id: match.id,
    date: match.date,
    time: match.time,
    homeTeam: transformTeam(match.home_team),
    awayTeam: transformTeam(match.away_team),
    homeScore: match.home_team.score,
    awayScore: match.away_team.score,
    status: match.status,
    competition: match.competition,
    competitionType: match.competitionType,
    isHome: match.is_home,
  };
}

function transformTeam(team: Match["home_team"]): ScheduleTeam {
  return {
    id: team.id,
    name: team.name,
    logo: team.logo,
    teamLabel: team.team_label,
  };
}
