/**
 * Footbalisto API Match Schema
 * Match data from external API
 */

import { Schema as S } from 'effect'
import { DateFromStringOrDate } from './common.schema'

/**
 * Club information in Footbalisto API response
 */
export class FootbalistoClub extends S.Class<FootbalistoClub>('FootbalistoClub')({
  id: S.Number,
  name: S.String,
  logo: S.optional(S.String),
  abbreviation: S.optional(S.String),
  logoSmall: S.optional(S.String),
  version: S.optional(S.Number),
}) {}

/**
 * Raw match data from Footbalisto API /matches/next endpoint
 */
export class FootbalistoMatch extends S.Class<FootbalistoMatch>('FootbalistoMatch')({
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
export class MatchTeam extends S.Class<MatchTeam>('MatchTeam')({
  id: S.Number,
  name: S.String,
  logo: S.optional(S.String),
  score: S.optional(S.Number),
}) {}

/**
 * Match status (normalized)
 */
export const MatchStatus = S.Literal('scheduled', 'live', 'finished', 'postponed', 'cancelled')

/**
 * Normalized match data for UI consumption
 */
export class Match extends S.Class<Match>('Match')({
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
export const FootbalistoMatchesArray = S.Array(FootbalistoMatch)

/**
 * Array of matches (normalized format)
 */
export const MatchesArray = S.Array(Match)

/**
 * Matches response from Footbalisto (normalized)
 */
export class MatchesResponse extends S.Class<MatchesResponse>('MatchesResponse')({
  matches: MatchesArray,
  total: S.optional(S.Number),
}) {}

/**
 * Ranking entry in league table
 */
export class RankingEntry extends S.Class<RankingEntry>('RankingEntry')({
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
export const RankingArray = S.Array(RankingEntry)

/**
 * Ranking response from Footbalisto
 */
export class RankingResponse extends S.Class<RankingResponse>('RankingResponse')({
  ranking: RankingArray,
  season: S.optional(S.String),
  competition: S.optional(S.String),
  last_updated: S.optional(DateFromStringOrDate),
}) {}

/**
 * Player statistics
 */
export class PlayerStats extends S.Class<PlayerStats>('PlayerStats')({
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
export class TeamStats extends S.Class<TeamStats>('TeamStats')({
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
