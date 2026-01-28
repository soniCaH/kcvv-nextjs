/**
 * Utility functions for match detail pages
 */

import type {
  MatchDetail,
  MatchLineupPlayer,
} from "@/lib/effect/schemas/match.schema";
import type { MatchTeamProps } from "@/components/match/MatchHeader";
import type { LineupPlayer } from "@/components/match/MatchLineup";

/**
 * Transform MatchDetail home team to MatchTeamProps for MatchHeader
 */
export function transformHomeTeam(match: MatchDetail): MatchTeamProps {
  return {
    name: match.home_team.name,
    logo: match.home_team.logo,
    score: match.home_team.score,
  };
}

/**
 * Transform MatchDetail away team to MatchTeamProps for MatchHeader
 */
export function transformAwayTeam(match: MatchDetail): MatchTeamProps {
  return {
    name: match.away_team.name,
    logo: match.away_team.logo,
    score: match.away_team.score,
  };
}

/**
 * Transform MatchLineupPlayer to LineupPlayer for MatchLineup component
 */
export function transformLineupPlayer(player: MatchLineupPlayer): LineupPlayer {
  return {
    id: player.id,
    name: player.name,
    number: player.number,
    minutesPlayed: player.minutesPlayed,
    isCaptain: player.isCaptain,
    status: player.status,
  };
}

/**
 * Extract time from match date if not provided separately
 */
export function extractMatchTime(match: MatchDetail): string | undefined {
  if (match.time) {
    return match.time;
  }

  // Try to extract time from date if it's a full datetime
  const date = match.date;
  if (date instanceof Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours !== 0 || minutes !== 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
  }

  return undefined;
}

/**
 * Format match title for SEO
 */
export function formatMatchTitle(match: MatchDetail): string {
  const homeTeam = match.home_team.name;
  const awayTeam = match.away_team.name;

  // Only show score if match is finished AND both scores are defined
  if (
    match.status === "finished" &&
    match.home_team.score !== undefined &&
    match.away_team.score !== undefined
  ) {
    return `${homeTeam} ${match.home_team.score} - ${match.away_team.score} ${awayTeam}`;
  }

  return `${homeTeam} vs ${awayTeam}`;
}

/**
 * Format match description for SEO
 */
export function formatMatchDescription(match: MatchDetail): string {
  const title = formatMatchTitle(match);
  const competition = match.competition || "Wedstrijd";
  const dateStr = match.date.toLocaleDateString("nl-BE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `${title} - ${competition} op ${dateStr}`;
}
