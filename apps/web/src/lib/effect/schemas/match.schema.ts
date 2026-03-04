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
 * Raw match data from Footbalisto API
 *
 * Used by both /matches/next and /matches/{teamId} endpoints.
 * Note: /matches/{teamId} doesn't include teamId and age fields,
 * so they are optional.
 */
export class FootbalistoMatch extends S.Class<FootbalistoMatch>(
  "FootbalistoMatch",
)({
  id: S.Number,
  teamId: S.optional(S.Number), // Only in /matches/next
  teamName: S.optional(S.String), // Only in /matches/next
  timestamp: S.Number,
  age: S.optional(S.String), // Only in /matches/next
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
 * Ranking response from Footbalisto (normalized)
 */
export class RankingResponse extends S.Class<RankingResponse>(
  "RankingResponse",
)({
  ranking: RankingArray,
  season: S.optional(S.String),
  competition: S.optional(S.String),
  last_updated: S.optional(DateFromStringOrDate),
}) {}

// ============================================================================
// Raw Footbalisto Ranking API Schemas
// ============================================================================

/**
 * Club info in Footbalisto ranking team
 */
export class FootbalistoRankingClub extends S.Class<FootbalistoRankingClub>(
  "FootbalistoRankingClub",
)({
  id: S.Number,
  localName: S.NullOr(S.String),
  name: S.NullOr(S.String),
}) {}

/**
 * Team info in Footbalisto ranking entry
 */
export class FootbalistoRankingTeam extends S.Class<FootbalistoRankingTeam>(
  "FootbalistoRankingTeam",
)({
  id: S.Number,
  club: FootbalistoRankingClub,
}) {}

/**
 * Raw team entry in Footbalisto ranking response
 */
export class FootbalistoRankingEntry extends S.Class<FootbalistoRankingEntry>(
  "FootbalistoRankingEntry",
)({
  id: S.Number,
  rank: S.Number,
  matchesPlayed: S.Number,
  wins: S.Number,
  draws: S.Number,
  losses: S.Number,
  goalsScored: S.Number,
  goalsConceded: S.Number,
  points: S.Number,
  team: FootbalistoRankingTeam,
}) {}

/**
 * Competition entry in raw Footbalisto ranking response
 */
export class FootbalistoRankingCompetition extends S.Class<FootbalistoRankingCompetition>(
  "FootbalistoRankingCompetition",
)({
  name: S.String,
  type: S.String,
  teams: S.Array(FootbalistoRankingEntry),
}) {}

/**
 * Raw array of competitions from Footbalisto ranking endpoint
 */
export const FootbalistoRankingArray = S.Array(FootbalistoRankingCompetition);

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
// Match Event Schemas (for /match/{id} endpoint)
// ============================================================================

/**
 * Card type for match events
 */
export const CardType = S.Literal("yellow", "red", "double_yellow");
export type CardType = S.Schema.Type<typeof CardType>;

/**
 * Action object within a Footbalisto match event
 */
export class FootbalistoEventAction extends S.Class<FootbalistoEventAction>(
  "FootbalistoEventAction",
)({
  /** Action type (e.g., "CARD", "GOAL") */
  type: S.String,
  /** Action subtype for cards (e.g., "YELLOW", "RED", "DOUBLE_YELLOW") */
  subtype: S.optional(S.NullOr(S.String)),
  /** Sort order for display */
  sortOrder: S.optional(S.Number),
  /** Icon URL */
  icon: S.optional(S.NullOr(S.String)),
  /** Action ID */
  id: S.optional(S.Number),
}) {}

/**
 * Raw match event from Footbalisto API
 *
 * Events contain an action object with type/subtype for structured event data.
 */
export class FootbalistoMatchEvent extends S.Class<FootbalistoMatchEvent>(
  "FootbalistoMatchEvent",
)({
  /** Action details containing type and subtype */
  action: FootbalistoEventAction,
  /** Minute when the event occurred */
  minute: S.optional(S.NullOr(S.Number)),
  /** Player ID associated with the event */
  playerId: S.optional(S.NullOr(S.Number)),
  /** Player name */
  playerName: S.optional(S.NullOr(S.String)),
  /** Club ID (to determine home/away) */
  clubId: S.optional(S.NullOr(S.Number)),
  /** Goals by home team at this point (for goal events) */
  goalsHome: S.optional(S.NullOr(S.Number)),
  /** Goals by away team at this point (for goal events) */
  goalsAway: S.optional(S.NullOr(S.Number)),
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
  substitutes: S.optional(FootbalistoLineup),
  events: S.optional(S.Array(FootbalistoMatchEvent)),
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
  /** Card received by player (if any) */
  card: S.optional(CardType),
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
