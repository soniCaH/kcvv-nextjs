import { Effect } from "effect";
import { HARD_TTL_LONG, type KvCacheInterface } from "../cache/kv-cache";

/**
 * The KV-backed manifest of ids the search index is believed to hold. Shared
 * by the nightly sweep's reconciliation step (`sanity-index-sync.ts`) and
 * the webhook's upsert path (`webhooks/index-handler.ts`) — a sweep alone
 * only ever records "what matched a query during a sweep window," which
 * misses a document whose entire visible life fits between two sweeps (an
 * article published and unpublished the same day; `unpublishAt` passing
 * fires no webhook of its own, so nothing else would ever record it left).
 * Every successful upsert — sweep or webhook — adds its id here, so the
 * manifest tracks what the index is believed to hold, not just what a sweep
 * happened to observe (#2831 review finding 3).
 *
 * Scoped per SANITY_DATASET (#2831 review finding 5): the local-dev KV
 * preview namespace is byte-identical to staging's `PSD_CACHE` namespace
 * (`wrangler.toml`'s `preview_id` vs `[[env.staging.kv_namespaces]].id`), so
 * an unscoped key would have a local `wrangler dev` sweep and staging read
 * and write the exact same manifest.
 */
export const manifestKey = (dataset: string) =>
  `search-index:manifest:${dataset}`;

// Reuses PSD_CACHE rather than provisioning a dedicated KV namespace for a
// ~200-id list: no new wrangler.toml binding, nothing for a human to create
// before merge.
// ponytail: revisit only if PSD_CACHE's own eviction/TTL policy (built for
// PSD response caching) ever conflicts with a value this manifest expects to
// persist indefinitely — HARD_TTL_LONG (365 days) is refreshed on every
// write (sweep or webhook), so in practice it never lapses.
export const readManifest = (
  kvCache: KvCacheInterface,
  dataset: string,
): Effect.Effect<string[] | null> =>
  kvCache.get(manifestKey(dataset)).pipe(
    Effect.map((raw) => {
      if (raw === null) return null;
      try {
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : null;
      } catch {
        return null;
      }
    }),
  );

export const writeManifest = (
  kvCache: KvCacheInterface,
  dataset: string,
  ids: readonly string[],
) => kvCache.set(manifestKey(dataset), JSON.stringify(ids), HARD_TTL_LONG);

/**
 * Adds a single id to the manifest. Called by the webhook's upsert path
 * after a successful upsert (#2831 review finding 3) so a document whose
 * entire visible life fits between two sweeps still gets tracked, and can
 * therefore still be pruned once it drops out.
 *
 * Read-modify-write, not atomic: a race with a concurrent sweep write can
 * drop one side's addition. Bounded and self-healing rather than silent —
 * the dropped id reappears the next time anything re-upserts it (another
 * edit, or a sweep that still matches it), it does not stay lost the way a
 * sweep-only observation would.
 */
export const addToManifest = (
  kvCache: KvCacheInterface,
  dataset: string,
  id: string,
) =>
  readManifest(kvCache, dataset).pipe(
    Effect.flatMap((existing) => {
      const ids = new Set(existing ?? []);
      ids.add(id);
      return writeManifest(kvCache, dataset, [...ids]);
    }),
  );
