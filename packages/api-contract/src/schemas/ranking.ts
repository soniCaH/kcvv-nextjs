import { Schema as S } from "effect";
import { DateFromStringOrDate } from "./common";

/** Normalized ranking entry for UI consumption */
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
  form: S.optional(S.String),
}) {}

export const RankingArray = S.Array(RankingEntry);

export class RankingResponse extends S.Class<RankingResponse>("RankingResponse")({
  ranking: RankingArray,
  season: S.optional(S.String),
  competition: S.optional(S.String),
  last_updated: S.optional(DateFromStringOrDate),
}) {}
