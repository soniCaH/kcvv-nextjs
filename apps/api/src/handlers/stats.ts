import { Effect } from "effect";
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
    if (cached) return JSON.parse(cached) as TeamStatsType;

    const stats = yield* client.getRawTeamStats(teamId);
    yield* cache.set(cacheKey, JSON.stringify(stats), TTL.STATS);
    return stats;
  });

export const StatsApiLive = HttpApiBuilder.group(PsdApi, "stats", (handlers) =>
  handlers.handle("getTeamStats", ({ path: { teamId } }) =>
    getTeamStatsHandler(teamId).pipe(Effect.orDie),
  ),
);
