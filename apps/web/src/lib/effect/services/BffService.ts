import { Context, Effect, Layer, type Cause } from "effect";
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
  | HttpApiError.HttpApiDecodeError
  | Cause.TimeoutException;

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

export const BffServiceLive = Layer.effect(
  BffService,
  Effect.gen(function* () {
    const bffUrl = process.env.KCVV_API_URL;
    if (!bffUrl)
      throw new Error(
        "KCVV_API_URL is not set — add it to .env.local before starting the app",
      );
    const client = yield* HttpApiClient.make(PsdApi, { baseUrl: bffUrl });
    return {
      getMatches: (teamId: number) =>
        client.matches
          .getMatchesByTeam({ path: { teamId } })
          .pipe(Effect.timeout("30 seconds")),
      getNextMatches: () =>
        client.matches.getNextMatches({}).pipe(Effect.timeout("30 seconds")),
      getMatchById: (matchId: number) =>
        client.matches
          .getMatchById({ path: { matchId } })
          .pipe(Effect.timeout("30 seconds")),
      getMatchDetail: (matchId: number) =>
        client.matches
          .getMatchDetail({ path: { matchId } })
          .pipe(Effect.timeout("30 seconds")),
      getRanking: (teamId: number) =>
        client.ranking
          .getRanking({ path: { teamId } })
          .pipe(Effect.timeout("30 seconds")),
      getTeamStats: (teamId: number) =>
        client.stats
          .getTeamStats({ path: { teamId } })
          .pipe(Effect.timeout("30 seconds")),
    };
  }),
).pipe(Layer.provide(FetchHttpClient.layer));
