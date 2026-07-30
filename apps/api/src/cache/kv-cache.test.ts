import { describe, it, expect, vi } from "vitest";
import { Effect, Layer, Schema as S } from "effect";
import {
  KvCacheService,
  KvCacheLive,
  TypedKvCache,
  TTL,
  HARD_TTL_DEFAULT,
  HARD_TTL_LONG,
} from "./kv-cache";
import { WorkerEnvTag } from "../env";
import { PsdGateService, PsdGateTest, makePsdGateLayer } from "../psd/gate";
import { GateLogic } from "../psd/gate-logic";
import { BackgroundRunnerService } from "../psd/background";

function makeMockKv() {
  const store = new Map<string, string>();
  return {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
    store,
  };
}

function makeEnvLayer(
  mockKv: ReturnType<typeof makeMockKv>,
  overrides: { CACHE_LONG_TTL?: string } = {},
) {
  return Layer.succeed(WorkerEnvTag, {
    PSD_API_BASE_URL: "https://clubapi.prosoccerdata.com",
    PSD_IMAGE_BASE_URL: "https://kcvv.prosoccerdata.com",
    FOOTBALISTO_LOGO_CDN_URL: "https://cdn.example.com",
    PSD_API_KEY: "test-key",
    PSD_API_CLUB: "test-club",
    PSD_API_AUTH: "test-auth",
    PSD_CACHE: mockKv as unknown as KVNamespace,
    PSD_GATE: {} as DurableObjectNamespace,
    SANITY_PROJECT_ID: "test-project",
    SANITY_DATASET: "test",
    SANITY_API_TOKEN: "test-token",
    SANITY_WEBHOOK_SECRET: "",
    AI: {} as Ai,
    SEARCH_INDEX: {} as VectorizeIndex,
    ...overrides,
  });
}

const TestSchema = S.Struct({ name: S.String, value: S.Number });

/** Helper to create a cached wrapper entry */
function makeWrapper(value: unknown, ageMs: number) {
  return JSON.stringify({ value, fetchedAt: Date.now() - ageMs });
}

describe("TTL constants", () => {
  it("NEXT_MATCHES is 4 hours", () => {
    expect(TTL.NEXT_MATCHES).toBe(60 * 60 * 4);
  });

  it("MATCHES_TEAM is 24 hours", () => {
    expect(TTL.MATCHES_TEAM).toBe(60 * 60 * 24);
  });

  it("RANKING is 24 hours", () => {
    expect(TTL.RANKING).toBe(60 * 60 * 24);
  });

  it("match-detail proximity tiers: match TTLs floored at 15 min (#2328)", () => {
    // SWR serves stale instantly, so the soft TTL only sets refresh cadence —
    // every PSD-backed tier is ≥15 min. (No live scores → old 60 s tier moot.)
    expect(TTL.MATCH_DETAIL_LIVE).toBe(60 * 15);
    expect(TTL.MATCH_DETAIL_MATCHDAY).toBe(60 * 15);
    expect(TTL.MATCH_DETAIL_WEEK).toBe(60 * 60);
  });

  it("every match soft TTL is ≥15 min (#2328)", () => {
    const MIN = 15 * 60;
    for (const ttl of [
      TTL.MATCHES_TEAM,
      TTL.NEXT_MATCHES,
      TTL.MATCHES_WINDOW,
      TTL.MATCH_DETAIL_LIVE,
      TTL.MATCH_DETAIL_MATCHDAY,
      TTL.MATCH_DETAIL_WEEK,
      TTL.MATCH_DETAIL_DEFAULT,
      TTL.MATCH_DETAIL_PAST,
    ]) {
      expect(ttl).toBeGreaterThanOrEqual(MIN);
    }
  });

  it("MATCH_DETAIL_DEFAULT is 24 hours (distant)", () => {
    expect(TTL.MATCH_DETAIL_DEFAULT).toBe(60 * 60 * 24);
  });

  it("MATCH_DETAIL_PAST is 7 days (unchanged)", () => {
    expect(TTL.MATCH_DETAIL_PAST).toBe(60 * 60 * 24 * 7);
  });

  it("HARD_TTL_DEFAULT is 7 days", () => {
    expect(HARD_TTL_DEFAULT).toBe(60 * 60 * 24 * 7);
  });
});

describe("TypedKvCache", () => {
  it("fresh path: cached value within softTtl returns without fetch", async () => {
    const mockKv = makeMockKv();
    // Cached 10 seconds ago, softTtl is 60 seconds → fresh
    mockKv.store.set(
      "test-key",
      makeWrapper({ name: "cached", value: 99 }, 10_000),
    );

    const fetchEffect = Effect.fail(
      new Error("fetch should not be called") as never,
    );

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result).toEqual({ name: "cached", value: 99 });
  });

  it("cache miss: calls fetch, stores wrapper with hardTtl, returns value", async () => {
    const mockKv = makeMockKv();
    let fetchCalled = false;
    const fetchEffect = Effect.sync(() => {
      fetchCalled = true;
      return { name: "test", value: 42 };
    });

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result).toEqual({ name: "test", value: 42 });
    expect(fetchCalled).toBe(true);
    // Stored with hardTtl (default 7 days), not softTtl
    expect(mockKv.put).toHaveBeenCalledWith(
      "test-key",
      expect.stringContaining('"value":{"name":"test","value":42}'),
      { expirationTtl: HARD_TTL_DEFAULT },
    );
    // Verify wrapper contains fetchedAt
    const stored = JSON.parse(mockKv.put.mock.calls[0]![1]);
    expect(stored).toHaveProperty("fetchedAt");
    expect(stored.value).toEqual({ name: "test", value: 42 });
  });

  it("stale + successful refresh: updates cache with fresh value", async () => {
    const mockKv = makeMockKv();
    // Cached 2 hours ago, softTtl is 60 seconds → stale
    mockKv.store.set(
      "test-key",
      makeWrapper({ name: "old", value: 1 }, 2 * 60 * 60 * 1000),
    );

    const fetchEffect = Effect.succeed({ name: "fresh", value: 42 });

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result).toEqual({ name: "fresh", value: 42 });
    // Cache should be updated with new wrapper
    const stored = JSON.parse(mockKv.put.mock.calls[0]![1]);
    expect(stored.value).toEqual({ name: "fresh", value: 42 });
  });

  it("stale-on-error: fetch fails, returns stale value", async () => {
    const mockKv = makeMockKv();
    // Cached 2 hours ago, softTtl is 60 seconds → stale
    mockKv.store.set(
      "test-key",
      makeWrapper({ name: "stale", value: 99 }, 2 * 60 * 60 * 1000),
    );

    const fetchEffect = Effect.fail(new Error("PSD 429") as never);

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result).toEqual({ name: "stale", value: 99 });
    // The data key must NOT be overwritten on error; only the negative marker
    // is written (suppresses re-storming for NEG_MARKER_TTL).
    expect(mockKv.put).not.toHaveBeenCalledWith(
      "test-key",
      expect.anything(),
      expect.anything(),
    );
    expect(mockKv.put).toHaveBeenCalledWith("neg:test-key", "1", {
      expirationTtl: 120,
    });
  });

  it("cache hit with corrupted JSON: logs warning, falls through to fetch", async () => {
    const mockKv = makeMockKv();
    mockKv.store.set("test-key", "not-valid-json{{{");

    let fetchCalled = false;
    const fetchEffect = Effect.sync(() => {
      fetchCalled = true;
      return { name: "fallback", value: 1 };
    });

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result).toEqual({ name: "fallback", value: 1 });
    expect(fetchCalled).toBe(true);
  });

  it("cache hit with old format (no wrapper): logs warning, falls through to fetch", async () => {
    const mockKv = makeMockKv();
    // Pre-Phase 3 format: raw value without wrapper
    mockKv.store.set(
      "test-key",
      JSON.stringify({ name: "old-format", value: 5 }),
    );

    let fetchCalled = false;
    const fetchEffect = Effect.sync(() => {
      fetchCalled = true;
      return { name: "fresh", value: 42 };
    });

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result).toEqual({ name: "fresh", value: 42 });
    expect(fetchCalled).toBe(true);

    // Verify old-format entry was rewritten to new wrapper shape
    const stored = JSON.parse(mockKv.store.get("test-key")!);
    expect(stored).toHaveProperty("fetchedAt");
    expect(stored.value).toEqual({ name: "fresh", value: 42 });
  });

  it("supports dynamic softTtl function based on the fetched value", async () => {
    const mockKv = makeMockKv();
    const fetchEffect = Effect.succeed({ name: "test", value: 10 });

    const typedCache = TypedKvCache(TestSchema);
    await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, (v) => v.value * 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    // Stored with hardTtl (default 7 days)
    expect(mockKv.put).toHaveBeenCalledWith(
      "test-key",
      expect.stringContaining('"value":{"name":"test","value":10}'),
      { expirationTtl: HARD_TTL_DEFAULT },
    );
  });

  it("uses custom hardTtl when provided", async () => {
    const mockKv = makeMockKv();
    const fetchEffect = Effect.succeed({ name: "test", value: 10 });
    const customHardTtl = 60 * 60 * 24 * 30; // 30 days

    const typedCache = TypedKvCache(TestSchema);
    await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60, customHardTtl)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(mockKv.put).toHaveBeenCalledWith("test-key", expect.any(String), {
      expirationTtl: customHardTtl,
    });
  });

  it("CACHE_LONG_TTL overrides hardTtl to 365 days on cache miss", async () => {
    const mockKv = makeMockKv();
    const fetchEffect = Effect.succeed({ name: "test", value: 42 });

    const typedCache = TypedKvCache(TestSchema);
    await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv, { CACHE_LONG_TTL: "true" })),
        ),
    );

    expect(mockKv.put).toHaveBeenCalledWith("test-key", expect.any(String), {
      expirationTtl: HARD_TTL_LONG,
    });
  });

  it("CACHE_LONG_TTL 'false' does not override hardTtl", async () => {
    const mockKv = makeMockKv();
    const fetchEffect = Effect.succeed({ name: "test", value: 42 });

    const typedCache = TypedKvCache(TestSchema);
    await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv, { CACHE_LONG_TTL: "false" })),
        ),
    );

    expect(mockKv.put).toHaveBeenCalledWith("test-key", expect.any(String), {
      expirationTtl: HARD_TTL_DEFAULT,
    });
  });

  it("stale-on-error: propagates error when shouldServeStale returns false", async () => {
    const mockKv = makeMockKv();
    // Cached 2 hours ago, softTtl is 60 seconds → stale
    mockKv.store.set(
      "test-key",
      makeWrapper({ name: "stale", value: 99 }, 2 * 60 * 60 * 1000),
    );

    const notFoundError = {
      _tag: "ResourceNotFound" as const,
      message: "gone",
    };
    const fetchEffect = Effect.fail(notFoundError);

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromiseExit(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60, undefined, {
          shouldServeStale: (err) =>
            (err as { _tag: string })._tag !== "ResourceNotFound",
        })
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result._tag).toBe("Failure");
  });

  it("stale-on-error: serves stale when shouldServeStale returns true", async () => {
    const mockKv = makeMockKv();
    mockKv.store.set(
      "test-key",
      makeWrapper({ name: "stale", value: 99 }, 2 * 60 * 60 * 1000),
    );

    const unavailableError = {
      _tag: "UpstreamUnavailable" as const,
      message: "PSD 429",
    };
    const fetchEffect = Effect.fail(unavailableError);

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60, undefined, {
          shouldServeStale: (err) =>
            (err as { _tag: string })._tag !== "ResourceNotFound",
        })
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result).toEqual({ name: "stale", value: 99 });
  });

  it("cache miss: dies when fetch returns schema-invalid data", async () => {
    const mockKv = makeMockKv();
    // Fetch returns data that doesn't match TestSchema (value should be number, not string)
    const fetchEffect = Effect.succeed({
      name: "test",
      value: "not-a-number",
    } as never);

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromiseExit(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result._tag).toBe("Failure");
    // Should NOT cache invalid data
    expect(mockKv.put).not.toHaveBeenCalled();
  });

  it("stale + refresh: dies when refresh returns schema-invalid data", async () => {
    const mockKv = makeMockKv();
    // Cached 2 hours ago → stale
    mockKv.store.set(
      "test-key",
      makeWrapper({ name: "old", value: 1 }, 2 * 60 * 60 * 1000),
    );

    // Refresh returns schema-invalid data
    const fetchEffect = Effect.succeed({ name: 123, value: "bad" } as never);

    const typedCache = TypedKvCache(TestSchema);
    const result = await Effect.runPromiseExit(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(KvCacheLive),
          Effect.provide(PsdGateTest),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    expect(result._tag).toBe("Failure");
    // Should NOT cache invalid data
    expect(mockKv.put).not.toHaveBeenCalled();
  });
});

describe("TypedKvCache — stale-while-revalidate + storm gate (#2328)", () => {
  /**
   * A BackgroundRunnerService whose `fork` runs the refresh eagerly on the test
   * layers and records the promise, so a test can `await settle()` to observe
   * the background effect's outcome deterministically.
   */
  function withRunner(
    mockKv: ReturnType<typeof makeMockKv>,
    gateLayer: Layer.Layer<PsdGateService>,
  ) {
    const pending: Promise<void>[] = [];
    const layer = Layer.mergeAll(KvCacheLive, gateLayer).pipe(
      Layer.provideMerge(makeEnvLayer(mockKv)),
    );
    const runnerLayer = Layer.succeed(BackgroundRunnerService, {
      fork: (_label, effect) =>
        Effect.sync(() => {
          // The test fetch is pure, so the refresh never touches PsdService —
          // `layer` satisfies its real deps (KvCache + gate + env).
          pending.push(
            Effect.runPromise(
              Effect.provide(effect, layer) as unknown as Effect.Effect<void>,
            ),
          );
        }),
    });
    return { runnerLayer, settle: () => Promise.all(pending) };
  }

  const staleWrapper = (value: unknown) =>
    makeWrapper(value, 2 * 60 * 60 * 1000);

  it("serves stale INSTANTLY, then background-refreshes the cache", async () => {
    const mockKv = makeMockKv();
    mockKv.store.set("test-key", staleWrapper({ name: "old", value: 1 }));
    const gate = PsdGateTest;
    const { runnerLayer, settle } = withRunner(mockKv, gate);

    const fetchEffect = Effect.succeed({ name: "fresh", value: 42 });
    const typedCache = TypedKvCache(TestSchema);

    const result = await Effect.runPromise(
      typedCache
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(runnerLayer),
          Effect.provide(KvCacheLive),
          Effect.provide(gate),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    // Foreground result is the STALE value (served without waiting).
    expect(result).toEqual({ name: "old", value: 1 });

    // Background refresh then overwrites KV with the fresh value.
    await settle();
    const stored = JSON.parse(mockKv.store.get("test-key")!);
    expect(stored.value).toEqual({ name: "fresh", value: 42 });
  });

  it("negative marker present → serves stale WITHOUT fetching", async () => {
    const mockKv = makeMockKv();
    mockKv.store.set("test-key", staleWrapper({ name: "stale", value: 7 }));
    mockKv.store.set("neg:test-key", "1");
    const gate = PsdGateTest;
    const { runnerLayer, settle } = withRunner(mockKv, gate);

    let fetchCalled = false;
    const fetchEffect = Effect.sync(() => {
      fetchCalled = true;
      return { name: "fresh", value: 99 };
    });

    const result = await Effect.runPromise(
      TypedKvCache(TestSchema)
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(runnerLayer),
          Effect.provide(KvCacheLive),
          Effect.provide(gate),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );
    await settle();

    expect(result).toEqual({ name: "stale", value: 7 });
    expect(fetchCalled).toBe(false);
  });

  it("background refresh failure keeps stale and sets the negative marker", async () => {
    const mockKv = makeMockKv();
    mockKv.store.set("test-key", staleWrapper({ name: "stale", value: 5 }));
    const gate = PsdGateTest;
    const { runnerLayer, settle } = withRunner(mockKv, gate);

    const fetchEffect = Effect.fail(new Error("PSD 429") as never);

    const result = await Effect.runPromise(
      TypedKvCache(TestSchema)
        .getOrFetch("test-key", fetchEffect, 60)
        .pipe(
          Effect.provide(runnerLayer),
          Effect.provide(KvCacheLive),
          Effect.provide(gate),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );
    await settle();

    expect(result).toEqual({ name: "stale", value: 5 });
    // Data key unchanged; negative marker set.
    expect(JSON.parse(mockKv.store.get("test-key")!).value).toEqual({
      name: "stale",
      value: 5,
    });
    expect(mockKv.store.get("neg:test-key")).toBe("1");
  });

  it("correctness guard: past-kickoff stale forces a BLOCKING refresh", async () => {
    const mockKv = makeMockKv();
    mockKv.store.set("test-key", staleWrapper({ name: "old", value: 1 }));
    const gate = PsdGateTest;
    const { runnerLayer } = withRunner(mockKv, gate);

    const fetchEffect = Effect.succeed({ name: "fresh", value: 2 });

    const result = await Effect.runPromise(
      TypedKvCache(TestSchema)
        .getOrFetch("test-key", fetchEffect, 60, undefined, {
          // Treat the stale value as "must not serve" → blocking refresh.
          mustBlockOnStale: (v) => v.value === 1,
        })
        .pipe(
          Effect.provide(runnerLayer),
          Effect.provide(KvCacheLive),
          Effect.provide(gate),
          Effect.provide(makeEnvLayer(mockKv)),
        ),
    );

    // Fresh value returned synchronously (blocking), not the stale one.
    expect(result).toEqual({ name: "fresh", value: 2 });
  });

  it("N concurrent misses collapse to ONE fan-out (single-flight)", async () => {
    const mockKv = makeMockKv();
    // Fresh shared gate so single-flight state is isolated to this test.
    const gate = makePsdGateLayer(new GateLogic({ ratePerSecond: 1e9 }));

    let fanOuts = 0;
    const fetchEffect = Effect.gen(function* () {
      fanOuts++;
      // Yield so all concurrent callers pass the miss check before the leader
      // finishes and writes KV.
      yield* Effect.sleep("5 millis");
      return { name: "fetched", value: 1 };
    });

    const typedCache = TypedKvCache(TestSchema);
    const run = () =>
      Effect.runPromise(
        typedCache
          .getOrFetch("test-key", fetchEffect, 60)
          .pipe(
            Effect.provide(KvCacheLive),
            Effect.provide(gate),
            Effect.provide(makeEnvLayer(mockKv)),
          ),
      );

    const results = await Promise.all(Array.from({ length: 20 }, run));

    // All callers get the value; only the leader fanned out.
    for (const r of results) expect(r).toEqual({ name: "fetched", value: 1 });
    expect(fanOuts).toBe(1);
  });

  it("sustained outage decouples PSD calls from request volume (~4% collapse)", async () => {
    // Under a sustained 429, the negative marker suppresses re-fanning: after the
    // first failed refresh, every subsequent read serves stale WITHOUT fetching
    // until the marker expires. So PSD load tracks the marker cadence, not the
    // request rate — the mechanism behind the prototype's 475%→~4% collapse
    // (#2324). Here: 50 reads during an outage → a single fan-out attempt.
    const mockKv = makeMockKv();
    mockKv.store.set("test-key", staleWrapper({ name: "stale", value: 1 }));
    const gate = PsdGateTest;

    let fetches = 0;
    const fetchEffect = Effect.gen(function* () {
      fetches++;
      return yield* Effect.fail(new Error("PSD 429") as never);
    });
    const typedCache = TypedKvCache(TestSchema);

    for (let i = 0; i < 50; i++) {
      const { runnerLayer, settle } = withRunner(mockKv, gate);
      const result = await Effect.runPromise(
        typedCache
          .getOrFetch("test-key", fetchEffect, 60)
          .pipe(
            Effect.provide(runnerLayer),
            Effect.provide(KvCacheLive),
            Effect.provide(gate),
            Effect.provide(makeEnvLayer(mockKv)),
          ),
      );
      await settle();
      expect(result).toEqual({ name: "stale", value: 1 }); // always served
    }

    // 50 requests, but the marker capped PSD calls at the first attempt.
    expect(fetches).toBe(1);
  });

  it("self-heals: once PSD recovers, the marker clears and fresh data is served", async () => {
    const mockKv = makeMockKv();
    mockKv.store.set("test-key", staleWrapper({ name: "stale", value: 1 }));
    mockKv.store.set("neg:test-key", "1"); // outage marker in place
    const gate = PsdGateTest;

    // Marker present → serve stale, no fetch. Then expire the marker.
    const typedCache = TypedKvCache(TestSchema);
    const runOnce = async (
      fetchEffect: Effect.Effect<{ name: string; value: number }>,
    ) => {
      const { runnerLayer, settle } = withRunner(mockKv, gate);
      const r = await Effect.runPromise(
        typedCache
          .getOrFetch("test-key", fetchEffect, 60)
          .pipe(
            Effect.provide(runnerLayer),
            Effect.provide(KvCacheLive),
            Effect.provide(gate),
            Effect.provide(makeEnvLayer(mockKv)),
          ),
      );
      await settle();
      return r;
    };

    // While marked: stale, no refresh.
    expect(await runOnce(Effect.succeed({ name: "fresh", value: 2 }))).toEqual({
      name: "stale",
      value: 1,
    });

    // Simulate marker expiry.
    mockKv.store.delete("neg:test-key");

    // Recovery: serve stale now, background refresh succeeds → KV fresh + marker clear.
    await runOnce(Effect.succeed({ name: "fresh", value: 2 }));
    expect(JSON.parse(mockKv.store.get("test-key")!).value).toEqual({
      name: "fresh",
      value: 2,
    });
    expect(mockKv.store.get("neg:test-key")).toBeUndefined();
  });
});

describe("KvCacheService", () => {
  it("returns null on a cache miss", async () => {
    const mockKv = makeMockKv();
    const program = Effect.gen(function* () {
      const cache = yield* KvCacheService;
      return yield* cache.get("missing-key");
    });
    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(KvCacheLive),
        Effect.provide(PsdGateTest),
        Effect.provide(makeEnvLayer(mockKv)),
      ),
    );
    expect(result).toBeNull();
  });

  it("stores and retrieves a value with correct TTL", async () => {
    const mockKv = makeMockKv();
    const program = Effect.gen(function* () {
      const cache = yield* KvCacheService;
      yield* cache.set("test-key", "hello", 60);
      return yield* cache.get("test-key");
    });
    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(KvCacheLive),
        Effect.provide(PsdGateTest),
        Effect.provide(makeEnvLayer(mockKv)),
      ),
    );
    expect(result).toBe("hello");
    expect(mockKv.put).toHaveBeenCalledWith("test-key", "hello", {
      expirationTtl: 60,
    });
  });

  const runIncrement = (mockKv: ReturnType<typeof makeMockKv>, by?: number) =>
    Effect.runPromise(
      Effect.gen(function* () {
        const cache = yield* KvCacheService;
        yield* cache.increment(by);
      }).pipe(
        Effect.provide(KvCacheLive),
        Effect.provide(PsdGateTest),
        Effect.provide(makeEnvLayer(mockKv)),
      ),
    );

  const DAILY_KEY = /^psd:calls:\d{4}-\d{2}-\d{2}$/;

  it("starts today's counter at 1 on a cache miss", async () => {
    const mockKv = makeMockKv();
    await runIncrement(mockKv);
    expect(mockKv.put).toHaveBeenCalledWith(
      expect.stringMatching(DAILY_KEY),
      "1",
      { expirationTtl: 60 * 60 * 48 },
    );
  });

  it("adds `by` to an existing numeric counter", async () => {
    const mockKv = makeMockKv();
    mockKv.get = vi.fn(async () => "5");
    await runIncrement(mockKv, 3);
    expect(mockKv.put).toHaveBeenCalledWith(
      expect.stringMatching(DAILY_KEY),
      "8",
      { expirationTtl: 60 * 60 * 48 },
    );
  });

  it("recovers from a malformed counter value instead of persisting NaN", async () => {
    const mockKv = makeMockKv();
    // A non-numeric value would make parseInt return NaN, which must not be
    // written back as the string "NaN" (that would wedge the counter for 48h).
    mockKv.get = vi.fn(async () => "NaN");
    await runIncrement(mockKv);
    expect(mockKv.put).toHaveBeenCalledWith(
      expect.stringMatching(DAILY_KEY),
      "1",
      { expirationTtl: 60 * 60 * 48 },
    );
  });
});
