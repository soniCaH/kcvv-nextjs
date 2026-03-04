import { Effect, Option, Schema as S } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import {
  PsdApi,
  TeamStats,
  type TeamStats as TeamStatsType,
} from "@kcvv/api-contract";
import {
  FootbalistoClient,
  type FootbalistoClientError,
} from "../footbalisto/client";
import { KvCacheService, TTL } from "../cache/kv-cache";
import { transformPsdTeamStats } from "../footbalisto/transforms";

export const getTeamStatsHandler = (
  teamId: number,
): Effect.Effect<
  TeamStatsType,
  FootbalistoClientError,
  FootbalistoClient | KvCacheService
> =>
  Effect.gen(function* () {
    const client = yield* FootbalistoClient;
    const cache = yield* KvCacheService;
    const cacheKey = `stats:team:${teamId}`;

    const cached = yield* cache.get(cacheKey);
    if (cached) {
      const decoded = yield* Effect.try({
        try: () => JSON.parse(cached),
        catch: () => null,
      }).pipe(Effect.flatMap(S.decodeUnknown(TeamStats)), Effect.option);
      if (Option.isSome(decoded)) return decoded.value;
    }

    const rawStats = yield* client.getRawTeamStats(teamId);
    const stats = transformPsdTeamStats(teamId, rawStats);
    yield* cache.set(cacheKey, JSON.stringify(stats), TTL.STATS);
    return stats;
  });

export const StatsApiLive = HttpApiBuilder.group(PsdApi, "stats", (handlers) =>
  handlers.handle("getTeamStats", ({ path: { teamId } }) =>
    getTeamStatsHandler(teamId).pipe(Effect.orDie),
  ),
);
