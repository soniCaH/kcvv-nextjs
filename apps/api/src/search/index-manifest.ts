import { Effect } from "effect";
import { HARD_TTL_LONG } from "../cache/kv-cache";

/**
 * The manifest of ids the search index is believed to hold. Shared by the
 * nightly sweep's reconciliation step (`sanity-index-sync.ts`) and the
 * webhook's upsert path (`webhooks/index-handler.ts`) — a sweep alone only
 * ever records "what matched a query during a sweep window," which misses a
 * document whose entire visible life fits between two sweeps (an article
 * published and unpublished the same day; `unpublishAt` passing fires no
 * webhook of its own, so nothing else would ever record it left). Every
 * successful upsert — sweep or webhook — adds its id here, so the manifest
 * tracks what the index is believed to hold, not just what a sweep happened
 * to observe.
 *
 * Reads `PSD_CACHE` directly rather than through `KvCacheService`:
 * `KvCacheLive.get` swallows every KV error into the same `null` a genuinely
 * absent key returns, which is indistinguishable from "no manifest yet" —
 * and the caller treats that as license to write a fresh manifest, silently
 * forgetting everything the old one tracked on a transient KV blip (#2831).
 * `readManifest` below fails instead, so the caller can skip reconciliation
 * rather than mistake "unreadable" for "empty."
 *
 * Keyed per SANITY_DATASET: the local-dev KV preview namespace is
 * byte-identical to staging's `PSD_CACHE` namespace (`wrangler.toml`'s
 * `preview_id` vs `[[env.staging.kv_namespaces]].id`), so an unscoped key
 * would have a local `wrangler dev` sweep and staging read and write the
 * exact same manifest.
 */
const manifestKey = (dataset: string) => `search-index:manifest:${dataset}`;

export class ManifestError extends Error {
  readonly _tag = "ManifestError" as const;
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
  }
}

// Reuses PSD_CACHE rather than provisioning a dedicated KV namespace for a
// ~200-id list: no new wrangler.toml binding, nothing for a human to create
// before merge.
// ponytail: revisit only if PSD_CACHE's own eviction policy (built for PSD
// response caching) ever conflicts with a value this manifest expects to
// persist indefinitely — HARD_TTL_LONG (365 days) is refreshed on every
// write (sweep or webhook), so in practice it never lapses.

/**
 * Reads the manifest. An absent key is a genuine first run and resolves to
 * `[]`; a KV error, a non-JSON value, or valid JSON that isn't an array all
 * FAIL rather than resolve to `[]` — those three are "unreadable," not
 * "empty," and the caller must not treat them the same way (#2831).
 */
export const readManifest = (
  kv: KVNamespace,
  dataset: string,
): Effect.Effect<string[], ManifestError> =>
  Effect.tryPromise({
    try: () => kv.get(manifestKey(dataset)),
    catch: (cause) =>
      new ManifestError(`KV get failed: ${String(cause)}`, cause),
  }).pipe(
    Effect.flatMap((raw) => {
      if (raw === null) return Effect.succeed([] as string[]);
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (cause) {
        return Effect.fail(
          new ManifestError(
            `manifest value is not valid JSON: ${String(cause)}`,
            cause,
          ),
        );
      }
      if (!Array.isArray(parsed)) {
        return Effect.fail(
          new ManifestError("manifest value is not a JSON array"),
        );
      }
      return Effect.succeed(
        parsed.filter((id): id is string => typeof id === "string"),
      );
    }),
  );

export const writeManifest = (
  kv: KVNamespace,
  dataset: string,
  ids: readonly string[],
): Effect.Effect<void, ManifestError> =>
  Effect.tryPromise({
    try: () =>
      kv.put(manifestKey(dataset), JSON.stringify(ids), {
        expirationTtl: HARD_TTL_LONG,
      }),
    catch: (cause) =>
      new ManifestError(`KV put failed: ${String(cause)}`, cause),
  });

/**
 * Adds a single id to the manifest — the webhook's upsert path calls this
 * after a successful upsert so a document whose entire visible life fits
 * between two sweeps still gets tracked, and can therefore still be pruned
 * once it drops out.
 *
 * Skips the write entirely when the id is already present — every edit of
 * an already-indexed document would otherwise re-write the whole manifest
 * to change nothing.
 *
 * Never fails the caller: a read or write error is logged and swallowed —
 * this is best-effort bookkeeping riding along on a successful index write,
 * not something a KV blip should turn into a failed webhook response.
 * Read-modify-write, not atomic: a race with a concurrent sweep write can
 * drop one side's addition. Bounded and self-healing rather than silent —
 * the dropped id reappears the next time anything re-upserts it (another
 * edit, or a sweep that still matches it), it does not stay lost the way a
 * sweep-only observation would.
 */
export const addToManifest = (
  kv: KVNamespace,
  dataset: string,
  id: string,
): Effect.Effect<void> =>
  readManifest(kv, dataset).pipe(
    Effect.flatMap((existing) =>
      existing.includes(id)
        ? Effect.void
        : writeManifest(kv, dataset, [...existing, id]),
    ),
    Effect.catchAll((e) =>
      Effect.logWarning(
        `[index-manifest] skipping manifest update for ${id}: ${String(e)}`,
      ),
    ),
  );
