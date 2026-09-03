import type { Match } from "@/lib/effect/schemas";
import { KCVV_CLUB_ID } from "@/lib/constants";
import { isReducedMatchRow } from "@/lib/utils/match-display";
import type { ScheduleRow, ScheduleTeam } from "./types";

/**
 * Transform a BFF `Match` into the `ScheduleRow` shape consumed by the
 * match-agenda components (`<TeamMatchesSection>` / `<TeamAgendaRow>`). Shared
 * by the team-detail pages, the opponent-history (`/tegenstander`) page, the
 * homepage `<FirstTeamsBlock>`, and the landing `<MatchStripView>`.
 *
 * Branches on `match.is_placeholder` and `isReducedMatchRow()` into the three
 * `ScheduleRow` members (#2688/#2802) — the contract itself stays sparse
 * (`is_placeholder` is `undefined` for an ordinary fixture, per #2606/#2632's
 * review), but the web view-model normalises that into a definite
 * `isPlaceholder`/`kind` discriminant, because the union needs a real
 * discriminant to narrow on, not a tri-state optional.
 *
 * @param match - Match from PSD API via the BFF
 * @returns ScheduleRow object for display
 */
export function transformMatchToSchedule(match: Match): ScheduleRow {
  if (match.is_placeholder) {
    return {
      isPlaceholder: true,
      kind: "reservation",
      id: match.id,
      date: match.date,
      time: match.time,
      team: transformTeam(match.home_team),
      status: match.status,
      competition: match.competition,
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
    return {
      isPlaceholder: false,
      kind: "reduced",
      id: match.id,
      date: match.date,
      time: match.time,
      team: transformTeam(otherClub(match)),
      status: match.status,
      competition: match.competition,
      competitionType: match.competitionType,
    };
  }

  return {
    isPlaceholder: false,
    kind: "match",
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

/**
 * The non-KCVV side of a tournament fixture, derived from the club id —
 * never home/away, since PSD does not say whether the named club hosts the
 * tournament or merely shares its bracket (#2696). `Match`'s fields are
 * snake_case, unlike `otherClubSide()` in `@/lib/utils/match-display` (which
 * is generic over camelCase `homeTeam`/`awayTeam` for already-transformed
 * view-models), so this stays a local one-liner rather than reshaping the
 * raw match to fit that helper's generic.
 */
function otherClub(match: Match): Match["home_team"] {
  return match.home_team.id === KCVV_CLUB_ID
    ? match.away_team
    : match.home_team;
}

function transformTeam(team: Match["home_team"]): ScheduleTeam {
  return {
    id: team.id,
    name: team.name,
    logo: team.logo,
    teamLabel: team.team_label,
  };
}
