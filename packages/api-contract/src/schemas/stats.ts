import { Schema as S } from "effect";

/** Player statistics */
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

/** Team statistics */
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
