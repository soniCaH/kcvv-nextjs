import { Context, Effect, Layer } from "effect";
import { HttpApiClient, FetchHttpClient } from "@effect/platform";
import type { HttpApiError, HttpClientError } from "@effect/platform";
import type { ParseError } from "effect/ParseResult";
import {
  PsdApi,
  type Match,
  type MatchDetail,
  type RankingEntry,
  type TeamStats,
} from "@kcvv/api-contract";

export type BffError =
  | HttpClientError.HttpClientError
  | ParseError
  | HttpApiError.HttpApiDecodeError;

export class BffService extends Context.Tag("BffService")<
  BffService,
  {
    getMatches: (teamId: number) => Effect.Effect<readonly Match[], BffError>;
    getNextMatches: () => Effect.Effect<readonly Match[], BffError>;
    getMatchById: (matchId: number) => Effect.Effect<Match, BffError>;
    getMatchDetail: (matchId: number) => Effect.Effect<MatchDetail, BffError>;
    getRanking: (
      teamId: number,
    ) => Effect.Effect<readonly RankingEntry[], BffError>;
    getTeamStats: (teamId: number) => Effect.Effect<TeamStats, BffError>;
  }
>() {}

const BFF_URL =
  process.env.KCVV_API_URL ??
  "https://kcvv-api.kevin-van-ransbeeck.workers.dev";

export const BffServiceLive = Layer.effect(
  BffService,
  Effect.gen(function* () {
    const client = yield* HttpApiClient.make(PsdApi, { baseUrl: BFF_URL });
    return {
      getMatches: (teamId: number) =>
        client.matches.getMatchesByTeam({ path: { teamId } }),
      getNextMatches: () => client.matches.getNextMatches({}),
      getMatchById: (matchId: number) =>
        client.matches.getMatchById({ path: { matchId } }),
      getMatchDetail: (matchId: number) =>
        client.matches.getMatchDetail({ path: { matchId } }),
      getRanking: (teamId: number) =>
        client.ranking.getRanking({ path: { teamId } }),
      getTeamStats: (teamId: number) =>
        client.stats.getTeamStats({ path: { teamId } }),
    };
  }),
).pipe(Layer.provide(FetchHttpClient.layer));
