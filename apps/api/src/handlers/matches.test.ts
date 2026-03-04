import { describe, it, expect } from "vitest";
import { Effect, Layer } from "effect";
import {
  getMatchesByTeamHandler,
  getNextMatchesHandler,
  getMatchByIdHandler,
  getMatchDetailHandler,
} from "./matches";
import {
  FootbalistoClient,
  type FootbalistoClientInterface,
} from "../footbalisto/client";
import { KvCacheService, type KvCacheInterface } from "../cache/kv-cache";

const rawMatch = {
  id: 1,
  teamId: 1,
  date: "2025-01-15 00:00",
  time: "15:00",
  homeClub: { id: 123, name: "KCVV Elewijt" },
  awayClub: { id: 456, name: "Opponent FC" },
  goalsHomeTeam: 3,
  goalsAwayTeam: 1,
  status: 1,
  competitionType: { id: 1, name: "3de Nationale", type: "LEAGUE" },
  reportGeneral: true,
} as const;

const rawDetail = {
  general: {
    id: 99,
    date: "2025-01-15 15:00",
    homeClub: { id: 123, name: "KCVV Elewijt" },
    awayClub: { id: 456, name: "Opponent FC" },
    goalsHomeTeam: 2,
    goalsAwayTeam: 0,
    competitionType: "3de Nationale",
    viewGameReport: true,
    status: 1,
  },
} as const;

function makeClientMock(): FootbalistoClientInterface {
  return {
    getRawMatches: (_teamId) => Effect.succeed([rawMatch]),
    getRawNextMatches: () =>
      Effect.succeed([rawMatch, { ...rawMatch, id: 2, teamId: 23 }]), // teamId 23 = Weitse Gans (should be filtered)
    getRawMatchDetail: (_matchId) => Effect.succeed(rawDetail),
    getRawRanking: () => Effect.succeed([]),
    getRawTeamStats: () => Effect.fail(new Error("not needed") as never),
  };
}

function makeCacheMock(): KvCacheInterface {
  return {
    get: () => Effect.succeed(null),
    set: () => Effect.succeed(undefined),
  };
}

function provide<A, E>(
  effect: Effect.Effect<A, E, FootbalistoClient | KvCacheService>,
) {
  return effect.pipe(
    Effect.provide(Layer.succeed(FootbalistoClient, makeClientMock())),
    Effect.provide(Layer.succeed(KvCacheService, makeCacheMock())),
  );
}

describe("getMatchesByTeamHandler", () => {
  it("transforms raw matches", async () => {
    const result = await Effect.runPromise(provide(getMatchesByTeamHandler(1)));
    expect(result[0]?.id).toBe(1);
    expect(result[0]?.status).toBe("finished");
    expect(result[0]?.home_team.name).toBe("KCVV Elewijt");
  });
});

describe("getNextMatchesHandler", () => {
  it("filters out teamId 23 (Weitse Gans)", async () => {
    const result = await Effect.runPromise(provide(getNextMatchesHandler()));
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(1);
  });
});

describe("getMatchDetailHandler", () => {
  it("returns MatchDetail with hasReport", async () => {
    const result = await Effect.runPromise(provide(getMatchDetailHandler(99)));
    expect(result.id).toBe(99);
    expect(result.hasReport).toBe(true);
  });
});

describe("getMatchByIdHandler", () => {
  it("returns a basic Match (no lineup)", async () => {
    const result = await Effect.runPromise(provide(getMatchByIdHandler(99)));
    expect(result.id).toBe(99);
    expect("lineup" in result).toBe(false);
  });
});
