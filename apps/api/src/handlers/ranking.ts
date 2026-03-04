import { Effect, Option, Schema as S } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { PsdApi, RankingArray, type RankingEntry } from "@kcvv/api-contract";
import {
  FootbalistoClient,
  type FootbalistoClientError,
} from "../footbalisto/client";
import { KvCacheService, TTL } from "../cache/kv-cache";
import { WorkerEnvTag } from "../env";
import { transformFootbalistoRankingEntry } from "../footbalisto/transforms";

export const getRankingHandler = (
  teamId: number,
  logoCdnUrl: string,
): Effect.Effect<
  readonly RankingEntry[],
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `ranking:team:${teamId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached) {
      const decoded = yield* Effect.try({
        try: () => JSON.parse(cached),
        catch: () => null,
      }).pipe(Effect.flatMap(S.decodeUnknown(RankingArray)), Effect.option);
      if (Option.isSome(decoded)) return decoded.value;
    }

    const competitions = yield* client.getRawRanking(teamId);

    const competition =
      competitions.find(
        (c) =>
          c.teams.length > 0 &&
          c.type.toUpperCase() !== "CUP" &&
          c.type.toUpperCase() !== "FRIENDLY",
      ) ?? competitions.find((c) => c.teams.length > 0);

    if (!competition || competition.teams.length === 0) {
      return [] as readonly RankingEntry[];
    }

    const ranking = competition.teams.map((e) =>
      transformFootbalistoRankingEntry(e, logoCdnUrl),
    );
    yield* cache.set(cacheKey, JSON.stringify(ranking), TTL.RANKING);
    return ranking;
  });

export const RankingApiLive = HttpApiBuilder.group(
  PsdApi,
  "ranking",
  (handlers) =>
    handlers.handle("getRanking", ({ path: { teamId } }) =>
      Effect.gen(function* () {
        const env = yield* WorkerEnvTag;
        return yield* getRankingHandler(teamId, env.FOOTBALISTO_LOGO_CDN_URL);
      }).pipe(Effect.orDie),
    ),
);
