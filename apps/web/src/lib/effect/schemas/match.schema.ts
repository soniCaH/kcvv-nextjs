/**
 * Footbalisto API Match Schema
 * Raw Footbalisto API types (implementation detail of FootbalistoService).
 * Normalized types (Match, MatchDetail, RankingEntry, etc.) live in @kcvv/api-contract.
 */

import { Schema as S } from "effect";
import { DateFromStringOrDate } from "./common.schema";

// Re-export normalized types from api-contract for backward compatibility
export {
  CardType,
  Match,
  MatchDetail,
  MatchesArray,
  MatchesResponse,
  MatchLineup,
  MatchLineupPlayer,
  MatchStatus,
  MatchTeam,
  PlayerStats,
  RankingArray,
  RankingEntry,
  RankingResponse,
  TeamStats,
} from "@kcvv/api-contract";

// ============================================================================
// Raw Footbalisto API Schemas (BFF implementation details)
// ============================================================================

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
 * Array of Footbalisto matches (raw API format)
 */
export const FootbalistoMatchesArray = S.Array(FootbalistoMatch);

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

// ============================================================================
// Match Event Schemas (for /match/{id} endpoint)
// ============================================================================

/**
 * Action object within a Footbalisto match event
 */
export class FootbalistoEventAction extends S.Class<FootbalistoEventAction>(
  "FootbalistoEventAction",
)({
  type: S.String,
  subtype: S.optional(S.NullOr(S.String)),
  sortOrder: S.optional(S.Number),
  icon: S.optional(S.NullOr(S.String)),
  id: S.optional(S.Number),
}) {}

/**
 * Raw match event from Footbalisto API
 */
export class FootbalistoMatchEvent extends S.Class<FootbalistoMatchEvent>(
  "FootbalistoMatchEvent",
)({
  action: FootbalistoEventAction,
  minute: S.optional(S.NullOr(S.Number)),
  playerId: S.optional(S.NullOr(S.Number)),
  playerName: S.optional(S.NullOr(S.String)),
  clubId: S.optional(S.NullOr(S.Number)),
  goalsHome: S.optional(S.NullOr(S.Number)),
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
  status: S.optional(S.String),
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
  date: S.String,
  time: S.optional(S.String),
  homeClub: FootbalistoClub,
  awayClub: FootbalistoClub,
  goalsHomeTeam: S.NullOr(S.Number),
  goalsAwayTeam: S.NullOr(S.Number),
  homeTeamId: S.optional(S.NullOr(S.Number)),
  awayTeamId: S.optional(S.NullOr(S.Number)),
  competitionType: S.String,
  viewGameReport: S.Boolean,
  status: S.Number,
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

// Keep DateFromStringOrDate re-export for any local usages that imported it via match.schema
export { DateFromStringOrDate };
