import { describe, it, expect } from "vitest";
import { Effect, Layer } from "effect";
import { getTeamStatsHandler } from "./stats";
import {
  FootbalistoClient,
  type FootbalistoClientInterface,
} from "../footbalisto/client";
import { KvCacheService, type KvCacheInterface } from "../cache/kv-cache";

const mockStats = {
  team_id: 1,
  team_name: "KCVV Elewijt A",
  total_matches: 25,
  wins: 18,
  draws: 4,
  losses: 3,
  goals_scored: 55,
  goals_conceded: 22,
};

function makeClientMock(): FootbalistoClientInterface {
  return {
    getRawMatches: () => Effect.succeed([]),
    getRawNextMatches: () => Effect.succeed([]),
    getRawMatchDetail: () => Effect.fail(new Error("not needed") as never),
    getRawRanking: () => Effect.succeed([]),
    getRawTeamStats: (_teamId) => Effect.succeed(mockStats),
  };
}

const cacheMock: KvCacheInterface = {
  get: () => Effect.succeed(null),
  set: () => Effect.succeed(undefined),
};

describe("getTeamStatsHandler", () => {
  it("returns team stats", async () => {
    const result = await Effect.runPromise(
      getTeamStatsHandler(1).pipe(
        Effect.provide(Layer.succeed(FootbalistoClient, makeClientMock())),
        Effect.provide(Layer.succeed(KvCacheService, cacheMock)),
      ),
    );
    expect(result.team_id).toBe(1);
    expect(result.team_name).toBe("KCVV Elewijt A");
    expect(result.wins).toBe(18);
  });
});
