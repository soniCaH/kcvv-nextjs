import { Context, Effect, Layer, Schema as S } from "effect";
import { TeamStats } from "@kcvv/api-contract";
import { WorkerEnvTag } from "../env";
import { KvCacheService } from "../cache/kv-cache";
import {
  FootbalistoMatchesArray,
  FootbalistoMatchDetailResponse,
  FootbalistoRankingArray,
  PsdSeasonsSchema,
  PsdMatchListSchema,
  type FootbalistoMatch,
  type FootbalistoMatchDetailResponse as RawDetailResponse,
  type FootbalistoRankingCompetition,
} from "./schemas";

export class FootbalistoError extends Error {
  readonly _tag = "FootbalistoError" as const;
  constructor(
    message: string,
    readonly status?: number,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "FootbalistoError";
  }
}

export class FootbalistoValidationError extends Error {
  readonly _tag = "FootbalistoValidationError" as const;
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "FootbalistoValidationError";
  }
}

export type FootbalistoClientError =
  | FootbalistoError
  | FootbalistoValidationError;

export interface FootbalistoClientInterface {
  readonly getRawMatches: (
    teamId: number,
  ) => Effect.Effect<readonly FootbalistoMatch[], FootbalistoClientError>;
  readonly getRawNextMatches: () => Effect.Effect<
    readonly FootbalistoMatch[],
    FootbalistoClientError
  >;
  readonly getRawMatchDetail: (
    matchId: number,
  ) => Effect.Effect<RawDetailResponse, FootbalistoClientError>;
  readonly getRawRanking: (
    teamId: number,
  ) => Effect.Effect<
    readonly FootbalistoRankingCompetition[],
    FootbalistoClientError
  >;
  readonly getRawTeamStats: (
    teamId: number,
  ) => Effect.Effect<typeof TeamStats.Type, FootbalistoClientError>;
}

export class FootbalistoClient extends Context.Tag("FootbalistoClient")<
  FootbalistoClient,
  FootbalistoClientInterface
>() {}

function fetchJson<A, I>(
  url: string,
  schema: S.Schema<A, I>,
  headers: Record<string, string>,
) {
  return Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(url, { headers }),
      catch: (cause) =>
        new FootbalistoError(`Failed to fetch ${url}`, undefined, cause),
    });

    if (!response.ok) {
      return yield* Effect.fail(
        new FootbalistoError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        ),
      );
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: (cause) =>
        new FootbalistoError("Failed to parse JSON", undefined, cause),
    });

    return yield* S.decodeUnknown(schema)(json).pipe(
      Effect.mapError(
        (cause) =>
          new FootbalistoValidationError("Schema validation failed", cause),
      ),
    );
  });
}

export const FootbalistoClientLive = Layer.effect(
  FootbalistoClient,
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;
    const cache = yield* KvCacheService;
    const base = env.PSD_API_BASE_URL;

    const psdHeaders = {
      "x-api-key": env.PSD_API_KEY,
      "x-api-club": env.PSD_API_CLUB,
      Authorization: env.PSD_API_AUTH,
      "Accept-Language": "nl-BE",
      "Content-Type": "application/json",
    };

    /** Get current season ID (cached 24h in KV) */
    const getCurrentSeasonId = (): Effect.Effect<
      number,
      FootbalistoClientError
    > =>
      Effect.gen(function* () {
        const cacheKey = "psd:current-season-id";
        const cached = yield* cache.get(cacheKey);
        if (cached) return parseInt(cached, 10);

        const seasons = yield* fetchJson(
          `${base}/seasons`,
          PsdSeasonsSchema,
          psdHeaders,
        );
        const now = Date.now();
        const current = seasons.find(
          (s) =>
            new Date(s.start).getTime() <= now &&
            new Date(s.end).getTime() >= now,
        );
        if (!current)
          return yield* Effect.fail(
            new FootbalistoError("No active season found"),
          );
        yield* cache.set(cacheKey, String(current.id), 60 * 60 * 24);
        return current.id;
      });

    return {
      getRawMatches: (teamId: number) =>
        Effect.gen(function* () {
          const seasonId = yield* getCurrentSeasonId();
          const data = yield* fetchJson(
            `${base}/games/team/${teamId}/seasons/${seasonId}`,
            PsdMatchListSchema,
            psdHeaders,
          );
          // PsdMatchListSchema wraps content array — cast to FootbalistoMatch[]
          // The actual PSD response shape may differ; validate against real API in Task 10
          return data.content as unknown as readonly FootbalistoMatch[];
        }),
      getRawNextMatches: () =>
        // Handled in matches handler using cached per-team data — placeholder
        Effect.succeed([] as readonly FootbalistoMatch[]),
      getRawMatchDetail: (matchId: number) =>
        fetchJson(
          `${base}/games/${matchId}/info`,
          FootbalistoMatchDetailResponse,
          psdHeaders,
        ),
      getRawRanking: (teamId: number) =>
        fetchJson(
          `${base}/teams/${teamId}/ranking`,
          FootbalistoRankingArray,
          psdHeaders,
        ),
      getRawTeamStats: (teamId: number) =>
        Effect.gen(function* () {
          const seasonId = yield* getCurrentSeasonId();
          // TODO: use season date range once season service stores start/end
          // For now use placeholder dates — update after Task 10 smoke test
          void seasonId;
          return yield* fetchJson(
            `${base}/statistics/team/${teamId}/from/01082024/to/31072025`,
            TeamStats,
            psdHeaders,
          );
        }),
    };
  }),
);
