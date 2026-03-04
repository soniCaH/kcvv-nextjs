import { describe, it, expect, vi, afterEach } from "vitest";
import { Effect } from "effect";
import { BffService, BffServiceLive } from "./BffService";

// Minimal fixture that satisfies the Match schema from @kcvv/api-contract.
// date/time must be ISO strings because JSON.stringify converts Date objects.
const sampleMatch = {
  id: 1,
  date: "2025-09-01T15:00:00.000Z",
  time: "15:00",
  venue: undefined,
  home_team: {
    id: 10,
    name: "KCVV Elewijt",
    score: undefined,
    logo: undefined,
  },
  away_team: { id: 20, name: "Opponent FC", score: undefined, logo: undefined },
  status: "scheduled",
  competition: "LEAGUE",
  round: undefined,
};

const sampleRankingEntry = {
  position: 1,
  team_id: 10,
  team_name: "KCVV Elewijt",
  team_logo: "https://example.com/logo.png",
  played: 5,
  won: 4,
  drawn: 1,
  lost: 0,
  goals_for: 10,
  goals_against: 3,
  goal_difference: 7,
  points: 13,
  form: undefined,
};

function mockFetchWith(data: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
}

describe("BffService", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("getMatches calls /matches/:teamId and returns decoded matches", async () => {
    mockFetchWith([sampleMatch]);

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getMatches(1);
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.objectContaining({ href: expect.stringContaining("/matches/1") }),
      expect.any(Object),
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(1);
  });

  it("getNextMatches calls /matches/next", async () => {
    mockFetchWith([sampleMatch]);

    await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getNextMatches();
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining("/matches/next"),
      }),
      expect.any(Object),
    );
  });

  it("getMatchDetail calls /match/:matchId/detail", async () => {
    const sampleDetail = {
      ...sampleMatch,
      hasReport: false,
      lineup: undefined,
    };
    mockFetchWith(sampleDetail);

    await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getMatchDetail(42);
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining("/match/42/detail"),
      }),
      expect.any(Object),
    );
  });

  it("getRanking calls /ranking/:teamId and returns decoded entries", async () => {
    mockFetchWith([sampleRankingEntry]);

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getRanking(1);
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.objectContaining({ href: expect.stringContaining("/ranking/1") }),
      expect.any(Object),
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.team_name).toBe("KCVV Elewijt");
  });

  it("propagates errors as Effect failures (not exceptions)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 500 })),
    );

    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff
          .getMatches(1)
          .pipe(
            Effect.catchAll(() =>
              Effect.succeed(
                [] as readonly import("@kcvv/api-contract").Match[],
              ),
            ),
          );
      }).pipe(Effect.provide(BffServiceLive)),
    );

    expect(result).toEqual([]);
  });
});
