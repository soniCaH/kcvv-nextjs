import { Effect } from "effect";
import { sanityClient } from "./client";

/** Next.js Data Cache directives forwarded to `@sanity/client`'s 3rd arg. */
export interface GroqCacheOptions {
  /** Seconds the result is served before the cache revalidates. */
  revalidate?: number;
  /** Cache tags for on-demand `revalidateTag` invalidation (Scope E). */
  tags?: string[];
}

/**
 * Every Sanity read in the app goes through here, and every one of them ends in
 * `Effect.orDie` — so a repository method is typed `Effect<A>` with `E = never`
 * and a failed read arrives at the caller as a **defect**, not a typed error.
 *
 * Consequence worth knowing before writing a handler: `Effect.catchAll` on a
 * repository read type-checks, reads like a guard, and never runs. Degrade a
 * section with `degradeSection` (`lib/effect/degrade.ts`), which catches the
 * cause; leave a subject read bare so it takes the page down (#2433 rule 2/3).
 */
export const fetchGroq = <T>(
  query: string,
  params?: Record<string, unknown>,
  options?: GroqCacheOptions,
) =>
  Effect.tryPromise({
    // Only pass the 3rd arg when caching is requested, so untagged callers keep
    // inheriting the route segment's `revalidate` (current behaviour).
    try: () =>
      options
        ? sanityClient.fetch<T>(query, params ?? {}, {
            next: { revalidate: options.revalidate, tags: options.tags },
          })
        : sanityClient.fetch<T>(query, params ?? {}),
    catch: (cause) => new Error(`Sanity fetch failed: ${String(cause)}`),
  }).pipe(Effect.orDie);
