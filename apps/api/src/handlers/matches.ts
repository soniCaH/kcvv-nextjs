import { Effect, Schema as S } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import {
  PsdApi,
  MatchesArray,
  MatchDetail,
  type Match,
} from "@kcvv/api-contract";
import {
  FootbalistoClient,
  type FootbalistoClientError,
} from "../footbalisto/client";
import { KvCacheService, TTL } from "../cache/kv-cache";
import {
  transformPsdGame,
  transformFootbalistoMatchDetail,
  matchDetailToMatch,
} from "../footbalisto/transforms";

export const getMatchesByTeamHandler = (
  teamId: number,
): Effect.Effect<
  readonly Match[],
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `matches:team:${teamId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached)
      return yield* S.decodeUnknown(MatchesArray)(JSON.parse(cached)).pipe(
        Effect.orDie,
      );

    const rawMatches = yield* client.getRawMatches(teamId);
    const matches = rawMatches.map(transformPsdGame);
    yield* cache.set(cacheKey, JSON.stringify(matches), TTL.MATCHES_TEAM);
    return matches;
  });

export const getNextMatchesHandler = (): Effect.Effect<
  readonly Match[],
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = "matches:next";

    const cached = yield* cache.get(cacheKey);
    if (cached)
      return yield* S.decodeUnknown(MatchesArray)(JSON.parse(cached)).pipe(
        Effect.orDie,
      );

    const rawMatches = yield* client.getRawNextMatches();
    // Filter out Weitse Gans (teamId 23) — not KCVV but plays on KCVV pitch
    const matches = rawMatches
      .filter((m) => m.teamId !== 23)
      .map(transformPsdGame);
    yield* cache.set(cacheKey, JSON.stringify(matches), TTL.NEXT_MATCHES);
    return matches;
  });

export const getMatchByIdHandler = (
  matchId: number,
): Effect.Effect<
  Match,
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const rawDetail = yield* client.getRawMatchDetail(matchId);
    return matchDetailToMatch(transformFootbalistoMatchDetail(rawDetail));
  });

export const getMatchDetailHandler = (
  matchId: number,
): Effect.Effect<
  MatchDetail,
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `match:detail:${matchId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached)
      return yield* S.decodeUnknown(MatchDetail)(JSON.parse(cached)).pipe(
        Effect.orDie,
      );

    const rawDetail = yield* client.getRawMatchDetail(matchId);
    const detail = transformFootbalistoMatchDetail(rawDetail);
    // Finished matches are immutable — cache 7 days. Live/upcoming — 60 seconds.
    const ttl =
      detail.status === "finished"
        ? TTL.MATCH_DETAIL_PAST
        : TTL.MATCH_DETAIL_LIVE;
    yield* cache.set(cacheKey, JSON.stringify(detail), ttl);
    return detail;
  });

export const MatchesApiLive = HttpApiBuilder.group(
  PsdApi,
  "matches",
  (handlers) =>
    handlers
      .handle("getMatchesByTeam", ({ path: { teamId } }) =>
        getMatchesByTeamHandler(teamId).pipe(Effect.orDie),
      )
      .handle("getNextMatches", () =>
        getNextMatchesHandler().pipe(Effect.orDie),
      )
      .handle("getMatchById", ({ path: { matchId } }) =>
        getMatchByIdHandler(matchId).pipe(Effect.orDie),
      )
      .handle("getMatchDetail", ({ path: { matchId } }) =>
        getMatchDetailHandler(matchId).pipe(Effect.orDie),
      ),
);
