/**
 * Background refresh runner — the stale-while-revalidate execution seam.
 *
 * When a soft-lapsed key is read, the cache serves stale INSTANTLY and schedules
 * the refresh here. The refresh must survive the response returning: the
 * per-request Effect runtime is `dispose()`d in a `finally`, so a fiber forked on
 * it would be interrupted. The live runner (see background-live.ts) therefore
 * runs the refresh on a fresh layer built from `env` and extends the isolate's
 * life with `ctx.waitUntil` — both independent of the request runtime.
 *
 * This module is a leaf (type-only imports) so `cache/kv-cache.ts` can depend on
 * the tag without a `kv-cache → background → service → kv-cache` runtime cycle.
 */
import { Context, Effect } from "effect";
import type { WorkerEnvTag } from "../env";
import type { KvCacheService } from "../cache/kv-cache";
import type { PsdService } from "./service";
import type { PsdGateService } from "./gate";

/** Everything a PSD background refresh needs; the live runner's layer provides it. */
export type PsdRefreshEnv =
  | PsdService
  | KvCacheService
  | PsdGateService
  | WorkerEnvTag;

export interface BackgroundRunner {
  /** Fire-and-forget a refresh on an env-built layer via `ctx.waitUntil`. */
  readonly fork: (
    label: string,
    effect: Effect.Effect<void, unknown, PsdRefreshEnv>,
  ) => Effect.Effect<void>;
}

export class BackgroundRunnerService extends Context.Tag(
  "BackgroundRunnerService",
)<BackgroundRunnerService, BackgroundRunner>() {}
