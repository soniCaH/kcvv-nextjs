import { Context, Effect, Either, Layer, Option, Schema as S } from "effect";
import { WorkerEnvTag } from "../env";
import { PsdGateService } from "../psd/gate";
import { BackgroundRunnerService, type PsdRefreshEnv } from "../psd/background";

/**
 * Per-endpoint soft TTLs in seconds.
 *
 * Every PSD-backed (match) TTL is ≥15 min: with stale-while-revalidate the soft
 * TTL only sets the background-refresh cadence — stale is always served
 * instantly — so a tighter window bought nothing but PSD load (#2321). KCVV has
 * no live scores, so the old 60 s "live" tier was already moot.
 */
export const TTL = {
  MATCHES_TEAM: 60 * 60 * 24, // 24 hours — season schedule rarely changes mid-week
  NEXT_MATCHES: 60 * 60 * 4, // 4 hours — no live scores, schedule is stable for hours
  MATCHES_WINDOW: 60 * 60 * 4, // 4 hours — matchday picker; in-window matches stay listed regardless of refresh
  MATCH_DETAIL_PAST: 60 * 60 * 24 * 7, // 7 days — historical, never changes
  MATCH_DETAIL_DEFAULT: 60 * 60 * 24, // 24 hours — distant (kickoff >7d away)
  MATCH_DETAIL_LIVE: 60 * 15, // 15 min — floor: no live scores, SWR serves stale instantly
  MATCH_DETAIL_MATCHDAY: 60 * 15, // 15 min — matchday / result-pending refresh cadence
  MATCH_DETAIL_WEEK: 60 * 60, // 1 hour — this week
  RANKING: 60 * 60 * 24, // 24 hours — updates only after a match day
  RELATED: 60 * 60 * 6, // 6 hours — related content changes infrequently
  OPPONENT_HISTORY: 60 * 60 * 24 * 7, // 7 days — historical match data doesn't change
  PLAYER_STATS: 60 * 60 * 6, // 6 hours — player stats update after match days
} as const;

/** Persisted negative marker TTL (seconds). Suppresses re-storming after a failed
 * refresh: subsequent requests serve stale without re-fanning until it expires.
 * (KV's minimum expirationTtl is 60 s.) */
export const NEG_MARKER_TTL = 120; // 2 min

export interface KvCacheInterface {
  readonly get: (key: string) => Effect.Effect<string | null>;
  readonly set: (
    key: string,
    value: string,
    ttl: number,
  ) => Effect.Effect<void>;
  readonly delete: (key: string) => Effect.Effect<void>;
  /** Increment today's PSD-call counter by n (default 1). Owns the daily key (psd:calls:YYYY-MM-DD). */
  readonly increment: (by?: number) => Effect.Effect<void>;
}

export class KvCacheService extends Context.Tag("KvCacheService")<
  KvCacheService,
  KvCacheInterface
>() {}

/** Default hard TTL: 7 days — safety net for stale-on-error */
export const HARD_TTL_DEFAULT = 60 * 60 * 24 * 7;

/** Long hard TTL: 365 days — used on staging to minimize PSD API quota usage */
export const HARD_TTL_LONG = 60 * 60 * 24 * 365;

const negKey = (key: string): string => `neg:${key}`;

export const TypedKvCache = <A, I>(schema: S.Schema<A, I>) => {
  const WrapperSchema = S.Struct({
    value: schema,
    fetchedAt: S.Number,
  });

  /** Decode a raw KV string into {value, fetchedAt}, tolerating the legacy
   * pre-wrapper format (raw value, fetchedAt: 0). None on any decode failure. */
  const decodeEntry = (
    key: string,
    cached: string,
  ): Effect.Effect<Option.Option<{ value: A; fetchedAt: number }>> =>
    Effect.try({
      try: () => JSON.parse(cached),
      catch: (e) => new Error(String(e)),
    }).pipe(
      Effect.flatMap((parsed) =>
        S.decodeUnknown(WrapperSchema)(parsed).pipe(
          Effect.catchAll(() =>
            S.decodeUnknown(schema)(parsed).pipe(
              Effect.map((value) => ({ value, fetchedAt: 0 })),
              Effect.catchAll((legacyErr) =>
                Effect.zipRight(
                  Effect.logWarning(
                    `TypedKvCache: cache decode failed for key "${key}": ${String(legacyErr)}`,
                  ),
                  Effect.fail(legacyErr),
                ),
              ),
            ),
          ),
        ),
      ),
      Effect.option,
    );

  const wrap = (value: A): string =>
    JSON.stringify({ value, fetchedAt: Date.now() });

  return {
    getOrFetch: <E, R>(
      key: string,
      fetch: Effect.Effect<A, E, R>,
      softTtl: number | ((value: A) => number),
      hardTtl: number = HARD_TTL_DEFAULT,
      options?: {
        shouldServeStale?: (error: E) => boolean;
        /** Correctness guard: when the STALE value fails this predicate (e.g. a
         * "next" list whose kickoff has already passed), refresh blocking rather
         * than serving stale. */
        mustBlockOnStale?: (value: A) => boolean;
      },
    ): Effect.Effect<
      A,
      E,
      R | KvCacheService | WorkerEnvTag | PsdGateService
    > =>
      Effect.gen(function* () {
        const cache = yield* KvCacheService;
        const env = yield* WorkerEnvTag;
        const gate = yield* PsdGateService;
        const runnerOpt = yield* Effect.serviceOption(BackgroundRunnerService);
        const effectiveHardTtl =
          env.CACHE_LONG_TTL === "true" ? HARD_TTL_LONG : hardTtl;
        const shouldServeStale = options?.shouldServeStale ?? (() => true);

        // Persist a fresh value and clear any negative marker.
        const persist = (value: A) =>
          Effect.zipRight(
            cache.set(key, wrap(value), effectiveHardTtl),
            cache.delete(negKey(key)),
          );

        // Keep the stale copy: log why and set the negative marker so subsequent
        // requests serve stale without re-fanning until it expires.
        const keepStale = (reason: string) =>
          Effect.zipRight(
            Effect.logWarning(`TypedKvCache "${key}": ${reason}`),
            cache.set(negKey(key), "1", NEG_MARKER_TTL),
          );

        // Store a fresh value (schema-validated) and clear any negative marker.
        const storeFresh = (value: A) =>
          Effect.zipRight(
            S.decodeUnknown(schema)(value).pipe(Effect.orDie),
            persist(value),
          );

        // Foreground refresh: fetch, store on success, serve stale on a
        // serve-stale error (setting the negative marker so we stop re-fanning),
        // propagate otherwise. Used by the correctness guard and, when no
        // background runner is wired, as the stale fallback.
        const blockingRefresh = (staleValue: A) =>
          Effect.gen(function* () {
            const result = yield* fetch.pipe(Effect.either);
            if (Either.isRight(result)) {
              yield* storeFresh(result.right);
              return result.right;
            }
            if (!shouldServeStale(result.left)) {
              return yield* Effect.fail(result.left);
            }
            yield* keepStale(
              `refresh failed, serving stale (${String(result.left)})`,
            );
            return staleValue;
          });

        // Background (SWR) refresh: single-flight leader fetches and updates KV;
        // any failure (or schema-invalid data) keeps stale + marks. Never throws
        // — it runs detached via the background runner.
        const backgroundRefresh = Effect.gen(function* () {
          const leader = yield* gate.beginFlight(key);
          if (!leader) return; // another isolate/fiber is already refreshing
          yield* Effect.gen(function* () {
            const result = yield* fetch.pipe(Effect.either);
            if (Either.isLeft(result)) {
              return yield* keepStale(
                `background refresh failed (${String(result.left)})`,
              );
            }
            const valid = S.decodeUnknownOption(schema)(result.right);
            yield* Option.isSome(valid)
              ? persist(result.right)
              : keepStale("background refresh returned schema-invalid data");
          }).pipe(Effect.ensuring(gate.endFlight(key)));
        });

        const cached = yield* cache.get(key);

        if (cached !== null) {
          const decoded = yield* decodeEntry(key, cached);

          if (Option.isSome(decoded)) {
            const { value, fetchedAt } = decoded.value;
            const resolvedSoftTtl =
              typeof softTtl === "function" ? softTtl(value) : softTtl;
            const isFresh = (Date.now() - fetchedAt) / 1000 <= resolvedSoftTtl;

            if (isFresh) return value;

            // ── Stale ────────────────────────────────────────────────────────
            // Negative marker present → a recent refresh failed; serve stale
            // instantly and do not re-fan. This wins even over the correctness
            // guard below: during an outage, a bounded ≤2 min of possibly-wrong
            // "next" beats storming PSD ~19 calls/request while it's down (the
            // marker self-heals the moment PSD recovers).
            const marker = yield* cache.get(negKey(key));
            if (marker !== null) return value;

            // Correctness guard: a stale value that is now wrong (past-kickoff
            // "next") must not be served — refresh blocking.
            if (options?.mustBlockOnStale?.(value)) {
              return yield* blockingRefresh(value);
            }

            if (Option.isSome(runnerOpt)) {
              // Stale-while-revalidate: serve stale NOW, refresh in the
              // background (single-flight) via the runner — see background-live.ts.
              // Cast is safe: only PSD handlers provide a runner, and its layer
              // covers this refresh's deps (a non-PSD caller has no runner here).
              const refresh = backgroundRefresh as Effect.Effect<
                void,
                unknown,
                PsdRefreshEnv
              >;
              yield* runnerOpt.value.fork(`refresh:${key}`, refresh);
              return value;
            }

            // No background runner wired → fall back to a blocking refresh.
            return yield* blockingRefresh(value);
          }
        }

        // ── Cache miss (or undecodable) ──────────────────────────────────────
        // Single-flight loop: ONLY the leader ever fetches, so at no instant do
        // two fan-outs run for the same key. Concurrent misses collapse to one
        // fan-out (followers read the leader's cached result). If the leader
        // finishes without populating (it failed), followers re-enter — one
        // becomes the next leader while the rest await it, so failed misses
        // serialize (never a concurrent duplicate fan-out) and each surfaces a
        // real never-cached error (AC7). Leadership rotation guarantees every
        // fiber makes progress; the gate's lease reclaims a dead leader, so this
        // can't spin forever.
        for (;;) {
          const isLeader = yield* gate.beginFlight(key);
          if (isLeader) {
            return yield* Effect.gen(function* () {
              const value = yield* fetch;
              yield* storeFresh(value);
              return value;
            }).pipe(Effect.ensuring(gate.endFlight(key)));
          }

          yield* gate.awaitFlight(key);
          const afterWait = yield* cache.get(key);
          if (afterWait !== null) {
            const reread = yield* decodeEntry(key, afterWait);
            if (Option.isSome(reread)) return reread.value.value;
          }
          // Empty → the leader failed; loop to re-enter the flight.
        }
      }),
  };
};

export const KvCacheLive = Layer.effect(
  KvCacheService,
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;
    return {
      get: (key: string) =>
        Effect.tryPromise({
          try: () => env.PSD_CACHE.get(key),
          catch: () => null,
        }).pipe(Effect.orElseSucceed(() => null)),
      set: (key: string, value: string, ttl: number) =>
        Effect.tryPromise({
          try: () => env.PSD_CACHE.put(key, value, { expirationTtl: ttl }),
          catch: () => undefined,
        }).pipe(Effect.orElseSucceed(() => undefined)),
      delete: (key: string) =>
        Effect.tryPromise({
          try: () => env.PSD_CACHE.delete(key),
          catch: () => undefined,
        }).pipe(Effect.orElseSucceed(() => undefined)),
      increment: (by = 1) =>
        Effect.tryPromise({
          try: async () => {
            const d = new Date();
            const key = `psd:calls:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
            const current = await env.PSD_CACHE.get(key);
            // Guard against a malformed cached value: parseInt on a
            // non-numeric string yields NaN, which would persist as "NaN"
            // and break every future increment until the 48 h TTL expires.
            const parsed = current ? parseInt(current, 10) : 0;
            const next = (Number.isFinite(parsed) ? parsed : 0) + by;
            // Keep counter for 48 h so yesterday's value stays visible
            await env.PSD_CACHE.put(key, String(next), {
              expirationTtl: 60 * 60 * 48,
            });
          },
          catch: () => undefined,
        }).pipe(Effect.orElseSucceed(() => undefined)),
    };
  }),
);
