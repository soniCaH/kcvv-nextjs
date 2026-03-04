/**
 * Raw Footbalisto API schemas — BFF implementation details only.
 * Normalized types (Match, MatchDetail, etc.) come from @kcvv/api-contract.
 */
import { Schema as S } from "effect";

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

export class FootbalistoMatch extends S.Class<FootbalistoMatch>(
  "FootbalistoMatch",
)({
  id: S.Number,
  teamId: S.optional(S.Number), // Only in /matches/next
  teamName: S.optional(S.String), // Only in /matches/next
  timestamp: S.Number,
  age: S.optional(S.String), // Only in /matches/next
  date: S.String, // Format: "YYYY-MM-DD HH:MM"
  time: S.String, // Legacy field
  homeClub: FootbalistoClub,
  awayClub: FootbalistoClub,
  goalsHomeTeam: S.NullOr(S.Number),
  goalsAwayTeam: S.NullOr(S.Number),
  homeTeamId: S.NullOr(S.Number),
  awayTeamId: S.NullOr(S.Number),
  status: S.Number, // 0=scheduled, 1=finished, 2=live, 3=postponed, 4=cancelled
  competitionType: S.String,
  viewGameReport: S.Boolean,
}) {}

export const FootbalistoMatchesArray = S.Array(FootbalistoMatch);

export class FootbalistoRankingClub extends S.Class<FootbalistoRankingClub>(
  "FootbalistoRankingClub",
)({
  id: S.Number,
  localName: S.NullOr(S.String),
  name: S.NullOr(S.String),
}) {}

export class FootbalistoRankingTeam extends S.Class<FootbalistoRankingTeam>(
  "FootbalistoRankingTeam",
)({
  id: S.Number,
  club: FootbalistoRankingClub,
}) {}

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

export class FootbalistoRankingCompetition extends S.Class<FootbalistoRankingCompetition>(
  "FootbalistoRankingCompetition",
)({
  name: S.String,
  type: S.String,
  teams: S.Array(FootbalistoRankingEntry),
}) {}

export const FootbalistoRankingArray = S.Array(FootbalistoRankingCompetition);

export class FootbalistoEventAction extends S.Class<FootbalistoEventAction>(
  "FootbalistoEventAction",
)({
  type: S.String,
  subtype: S.optional(S.NullOr(S.String)),
  sortOrder: S.optional(S.Number),
  icon: S.optional(S.NullOr(S.String)),
  id: S.optional(S.Number),
}) {}

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

export class FootbalistoLineup extends S.Class<FootbalistoLineup>(
  "FootbalistoLineup",
)({
  home: S.Array(FootbalistoLineupPlayer),
  away: S.Array(FootbalistoLineupPlayer),
}) {}

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

export class FootbalistoMatchDetailResponse extends S.Class<FootbalistoMatchDetailResponse>(
  "FootbalistoMatchDetailResponse",
)({
  general: FootbalistoMatchDetailGeneral,
  lineup: S.optional(FootbalistoLineup),
  substitutes: S.optional(FootbalistoLineup),
  events: S.optional(S.Array(FootbalistoMatchEvent)),
}) {}

export class PsdSeason extends S.Class<PsdSeason>("PsdSeason")({
  id: S.Number,
  name: S.String,
  start: S.String, // ISO date string
  end: S.String, // ISO date string
}) {}

export const PsdSeasonsSchema = S.Array(PsdSeason);

export class PsdMatchListItem extends S.Class<PsdMatchListItem>(
  "PsdMatchListItem",
)({
  id: S.Number,
  // Add remaining fields after verifying against actual PSD response
}) {}

export const PsdMatchListSchema = S.Struct({
  content: S.Array(PsdMatchListItem),
});
