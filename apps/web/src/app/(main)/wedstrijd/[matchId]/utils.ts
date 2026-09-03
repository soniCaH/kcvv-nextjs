/**
 * Utility functions for match detail pages
 */

import type {
  MatchDetail,
  MatchLineupPlayer,
} from "@/lib/effect/schemas/match.schema";
import type { MatchHeroTeam } from "@/components/match/MatchHero";
import type { LineupPlayer } from "@/components/match/MatchLineup";
import { toMatchDisplayZone } from "@/lib/utils/dates";
import {
  isReducedMatchRow,
  otherClubSide,
  reservationTitle,
  reservationView,
} from "@/lib/utils/match-display";

/**
 * Convert a match's home team into props suitable for the MatchHero component.
 *
 * @param match - The match detail containing the home team data
 * @returns The home team's `MatchHeroTeam` with `id`, `name`, `logo`, and `score`
 */
export function transformHomeTeam(match: MatchDetail): MatchHeroTeam {
  return {
    id: match.home_team.id,
    name: match.home_team.name,
    logo: match.home_team.logo,
    score: match.home_team.score,
  };
}

/**
 * Converts the match's away team data into props for the MatchHero component.
 *
 * @returns An object containing the away team's id, name, logo, and score.
 */
export function transformAwayTeam(match: MatchDetail): MatchHeroTeam {
  return {
    id: match.away_team.id,
    name: match.away_team.name,
    logo: match.away_team.logo,
    score: match.away_team.score,
  };
}

/**
 * Converts a MatchLineupPlayer into a LineupPlayer used by the MatchLineup component.
 *
 * @param player - The source player data to convert
 * @returns A LineupPlayer containing `id`, `name`, `number`, `minutesPlayed`, `isCaptain`, `status`, and `card` from `player`
 */
export function transformLineupPlayer(player: MatchLineupPlayer): LineupPlayer {
  return {
    id: player.id,
    name: player.name,
    number: player.number,
    minutesPlayed: player.minutesPlayed,
    isCaptain: player.isCaptain,
    status: player.status,
    card: player.card,
  };
}

/**
 * Enrich a transformed `LineupPlayer` with `isKeeper`. The source depends on
 * which side of the match the player belongs to:
 *
 *   - **KCVV side**: look the player's PSD id up in the `keeperPsdIds` set
 *     sourced from Sanity `player.keeper` (PSD-synced, always reliable).
 *   - **Opponent side**: use the jersey #1 heuristic. PSD does not surface
 *     position data for opponent players in a match's lineup, and we don't
 *     mirror opponents in Sanity — so we fall back to the universal football
 *     convention that #1 is the keeper. Imperfect (~95% accurate) but
 *     consistent with how the rest of the BeNeLux football web reads
 *     opponent rosters.
 *
 * Two `undefined` cases force the jersey-#1 heuristic on **both** sides:
 *   1. `kcvvSide === undefined` — match data doesn't tell us which roster
 *      is KCVV (rare; legacy rows). Mis-applying Sanity flags to the wrong
 *      roster is worse than the heuristic.
 *   2. `keeperPsdIds === undefined` — the Sanity lookup failed. An empty
 *      Set would be indistinguishable from "Sanity said KCVV has no
 *      keepers" and would silently strip the KCVV keeper badge; an
 *      explicit `undefined` lets us route both sides through the
 *      heuristic on outage.
 */
export function enrichLineupWithKeeperFlag(
  player: LineupPlayer,
  side: "home" | "away",
  kcvvSide: "home" | "away" | undefined,
  keeperPsdIds: ReadonlySet<string> | undefined,
): LineupPlayer {
  const isKcvvSide = kcvvSide === side;
  const useSanityLookup = isKcvvSide && keeperPsdIds !== undefined;
  const isKeeper = useSanityLookup
    ? player.id !== undefined && keeperPsdIds.has(String(player.id))
    : player.number === 1;
  return { ...player, isKeeper };
}

// `extractMatchTime` now lives in `@/lib/utils/match-time` so the
// matchPreview/matchRecap article hero can derive kickoff identically
// (#1470). Re-exported here so existing `./utils` consumers + tests keep
// their import path.
export { extractMatchTime } from "@/lib/utils/match-time";

/**
 * Builds an SEO-friendly match title.
 *
 * A pitch-reservation placeholder (#2606) gets its own title rather than
 * "KCVV Elewijt vs KCVV Elewijt" — via the shared `reservationTitle()`
 * (`lib/utils/match-display.ts`), the same helper `buildSummary()`
 * (`lib/utils/ical.ts`, the ICS feed) calls, so the wording can't drift
 * between the two surfaces (#2688/#2698).
 *
 * Widened to a tournament fixture with no result yet (#2696/#2802 review):
 * it is no more a confirmed "X vs Y" than a reservation is, so it gets the
 * same subject-plus-club title ("Tornooi · FC Zemst Sportief — KCVV
 * Elewijt") instead of asserting a head-to-head PSD hasn't confirmed. Once
 * a scoreline lands, `isReducedMatchRow` flips and the ordinary score title
 * below applies — the same reduced-to-full transition every other renderer
 * of this predicate makes.
 *
 * @returns `HomeTeam X - Y AwayTeam` if the match status is finished and both scores are present, otherwise `HomeTeam vs AwayTeam`
 */
export function formatMatchTitle(match: MatchDetail): string {
  const homeTeam = match.home_team.name;
  const awayTeam = match.away_team.name;

  if (match.is_placeholder) {
    return reservationTitle(match);
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
    const other = otherClubSide(match.home_team, match.away_team);
    const kcvvTeam =
      other === match.home_team ? match.away_team : match.home_team;
    return `${reservationView(match, other).subject} — ${kcvvTeam.name}`;
  }

  // Only show score if match is finished AND both scores are defined
  if (
    (match.status === "finished" || match.status === "forfeited") &&
    match.home_team.score !== undefined &&
    match.away_team.score !== undefined
  ) {
    return `${homeTeam} ${match.home_team.score} - ${match.away_team.score} ${awayTeam}`;
  }

  return `${homeTeam} vs ${awayTeam}`;
}

/**
 * Build an SEO-friendly description for a match by combining its title,
 * competition, and date.
 *
 * `zaterdag 12 september 2026` has one consumer — this page's metadata — so the
 * shape stays local (#2430 rule 2). The parse does not: a BFF match date is
 * Belgian wall-clock in its UTC fields, so it reads through `toMatchDisplayZone`.
 *
 * @param match - The match details used to generate the description
 * @returns A string in the form "<title> - <competition> op <date>"
 */
export function formatMatchDescription(match: MatchDetail): string {
  const title = formatMatchTitle(match);
  const competition = match.competition || "Wedstrijd";
  const dateStr = toMatchDisplayZone(match.date).toFormat("cccc d MMMM yyyy");

  return `${title} - ${competition} op ${dateStr}`;
}
