/**
 * Footbalisto API Match Schema
 * Match data from external API
 */

import { Schema as S } from "effect";
import { DateFromStringOrDate } from "./common.schema";

/**
 * Club information in Footbalisto API response
 */
export class FootbalistoClub extends S.Class<FootbalistoClub>(
  "FootbalistoClub",
)({
  id: S.Number,
  name: S.String,
  logo: S.optional(S.NullOr(S.String)),
  abbreviation: S.optional(S.NullOr(S.String)),
  logoSmall: S.optional(S.NullOr(S.String)),
  version: S.optional(S.NullOr(S.Number)),
}) {}

/**
 * Raw match data from Footbalisto API /matches/next endpoint
 */
export class FootbalistoMatch extends S.Class<FootbalistoMatch>(
  "FootbalistoMatch",
)({
  id: S.Number,
  teamId: S.Number,
  teamName: S.String,
  timestamp: S.Number,
  age: S.String,
  date: S.String, // Format: "2025-12-06 09:00"
  time: S.String, // Format: "1970-01-01 01:00" (legacy field)
  homeClub: FootbalistoClub,
  awayClub: FootbalistoClub,
  goalsHomeTeam: S.NullOr(S.Number),
  goalsAwayTeam: S.NullOr(S.Number),
  homeTeamId: S.NullOr(S.Number),
  awayTeamId: S.NullOr(S.Number),
  status: S.Number, // 0 = scheduled, 1 = finished, etc.
  competitionType: S.String,
  viewGameReport: S.Boolean,
}) {}

/**
 * Team information in normalized match format
 */
export class MatchTeam extends S.Class<MatchTeam>("MatchTeam")({
  id: S.Number,
  name: S.String,
  logo: S.optional(S.String),
  score: S.optional(S.Number),
}) {}

/**
 * Match status (normalized)
 */
export const MatchStatus = S.Literal(
  "scheduled",
  "live",
  "finished",
  "postponed",
  "cancelled",
);

/**
 * Normalized match data for UI consumption
 */
export class Match extends S.Class<Match>("Match")({
  id: S.Number,
  date: DateFromStringOrDate,
  time: S.optional(S.String),
  venue: S.optional(S.String),
  home_team: MatchTeam,
  away_team: MatchTeam,
  status: MatchStatus,
  round: S.optional(S.String),
  competition: S.optional(S.String),
}) {}

/**
 * Array of Footbalisto matches (raw API format)
 */
export const FootbalistoMatchesArray = S.Array(FootbalistoMatch);

/**
 * Array of matches (normalized format)
 */
export const MatchesArray = S.Array(Match);

/**
 * Matches response from Footbalisto (normalized)
 */
export class MatchesResponse extends S.Class<MatchesResponse>(
  "MatchesResponse",
)({
  matches: MatchesArray,
  total: S.optional(S.Number),
}) {}

/**
 * Ranking entry in league table
 */
export class RankingEntry extends S.Class<RankingEntry>("RankingEntry")({
  position: S.Number,
  team_id: S.Number,
  team_name: S.String,
  team_logo: S.optional(S.String),
  played: S.Number,
  won: S.Number,
  drawn: S.Number,
  lost: S.Number,
  goals_for: S.Number,
  goals_against: S.Number,
  goal_difference: S.Number,
  points: S.Number,
  form: S.optional(S.String), // Recent results like "WWDL"
}) {}

/**
 * Array of ranking entries
 */
export const RankingArray = S.Array(RankingEntry);

/**
 * Ranking response from Footbalisto
 */
export class RankingResponse extends S.Class<RankingResponse>(
  "RankingResponse",
)({
  ranking: RankingArray,
  season: S.optional(S.String),
  competition: S.optional(S.String),
  last_updated: S.optional(DateFromStringOrDate),
}) {}

/**
 * Player statistics
 */
export class PlayerStats extends S.Class<PlayerStats>("PlayerStats")({
  player_id: S.Number,
  player_name: S.String,
  team_id: S.Number,
  matches_played: S.Number,
  goals: S.Number,
  assists: S.optional(S.Number),
  yellow_cards: S.optional(S.Number),
  red_cards: S.optional(S.Number),
  minutes_played: S.optional(S.Number),
}) {}

/**
 * Team statistics
 */
export class TeamStats extends S.Class<TeamStats>("TeamStats")({
  team_id: S.Number,
  team_name: S.String,
  total_matches: S.Number,
  wins: S.Number,
  draws: S.Number,
  losses: S.Number,
  goals_scored: S.Number,
  goals_conceded: S.Number,
  clean_sheets: S.optional(S.Number),
  top_scorers: S.optional(S.Array(PlayerStats)),
}) {}

// ============================================================================
// Match Detail Schemas (for /match/{id} endpoint)
// ============================================================================

/**
 * Player in match lineup from Footbalisto API
 */
export class FootbalistoLineupPlayer extends S.Class<FootbalistoLineupPlayer>(
  "FootbalistoLineupPlayer",
)({
  number: S.optional(S.NullOr(S.Number)),
  playerName: S.String,
  minutesPlayed: S.optional(S.NullOr(S.Number)),
  captain: S.optional(S.Boolean),
  playerId: S.optional(S.NullOr(S.Number)),
  status: S.optional(S.String), // 'basis', 'invaller', 'wissel'
  changed: S.optional(S.Boolean),
}) {}

/**
 * Match lineup structure from Footbalisto API
 */
export class FootbalistoLineup extends S.Class<FootbalistoLineup>(
  "FootbalistoLineup",
)({
  home: S.Array(FootbalistoLineupPlayer),
  away: S.Array(FootbalistoLineupPlayer),
}) {}

/**
 * Match detail general info from Footbalisto API /match/{id} endpoint
 */
export class FootbalistoMatchDetailGeneral extends S.Class<FootbalistoMatchDetailGeneral>(
  "FootbalistoMatchDetailGeneral",
)({
  id: S.Number,
  date: S.String, // Format: "2025-07-30 19:45"
  time: S.optional(S.String), // Legacy field
  homeClub: FootbalistoClub,
  awayClub: FootbalistoClub,
  goalsHomeTeam: S.NullOr(S.Number),
  goalsAwayTeam: S.NullOr(S.Number),
  homeTeamId: S.optional(S.NullOr(S.Number)),
  awayTeamId: S.optional(S.NullOr(S.Number)),
  competitionType: S.String,
  viewGameReport: S.Boolean,
  status: S.Number, // 0 = scheduled, 1 = finished, 2 = live, 3 = postponed, 4 = cancelled
}) {}

/**
 * Full match detail response from Footbalisto API /match/{id}
 */
export class FootbalistoMatchDetailResponse extends S.Class<FootbalistoMatchDetailResponse>(
  "FootbalistoMatchDetailResponse",
)({
  general: FootbalistoMatchDetailGeneral,
  lineup: S.optional(FootbalistoLineup),
  events: S.optional(S.Array(S.Unknown)), // Future: model match events if needed
}) {}

/**
 * Normalized lineup player for UI consumption
 */
export class MatchLineupPlayer extends S.Class<MatchLineupPlayer>(
  "MatchLineupPlayer",
)({
  id: S.optional(S.Number),
  name: S.String,
  number: S.optional(S.Number),
  minutesPlayed: S.optional(S.Number),
  isCaptain: S.Boolean,
  /** Player status: starter, substitute (unused), substituted (out), subbed_in (came on) */
  status: S.Literal(
    "starter",
    "substitute",
    "substituted",
    "subbed_in",
    "unknown",
  ),
}) {}

/**
 * Normalized match lineup for UI consumption
 */
export class MatchLineup extends S.Class<MatchLineup>("MatchLineup")({
  home: S.Array(MatchLineupPlayer),
  away: S.Array(MatchLineupPlayer),
}) {}

/**
 * Normalized match detail for UI consumption
 * Extended version of Match with lineup data
 */
export class MatchDetail extends S.Class<MatchDetail>("MatchDetail")({
  id: S.Number,
  date: DateFromStringOrDate,
  time: S.optional(S.String),
  venue: S.optional(S.String),
  home_team: MatchTeam,
  away_team: MatchTeam,
  status: MatchStatus,
  round: S.optional(S.String),
  competition: S.optional(S.String),
  lineup: S.optional(MatchLineup),
  hasReport: S.Boolean,
}) {}
