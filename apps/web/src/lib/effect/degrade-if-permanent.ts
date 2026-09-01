import { Effect } from "effect";
import type { BffError } from "@/lib/effect/services/BffService";

/**
 * Resolve a `BffError`-typed Effect's **permanent** failures to `onPermanent`
 * instead of letting them reject; leave a **transient** failure rejecting
 * unchanged. The tags are the same three `isPermanentBffFailure`
 * (`classify-bff-failure.ts`) treats as permanent — a mistyped/stale `psdId`
 * (`HttpNotFound`) or a response this deploy can no longer decode
 * (`ParseError`, `HttpApiDecodeError`).
 *
 * This is the pre-rejection sibling of `isPermanentBffFailure`: use this when
 * the read's error channel is still typed as `BffError` at the call site (an
 * `Effect.gen`/`bff.<method>()` chain before `runPromise`), so `Effect.catchTags`
 * can classify and exhaustiveness-check against the union directly. Once a
 * channel is already flattened to a rejecting `Promise` (e.g. by a dedupe
 * layer), it's too late for this — classify the rejection after the fact with
 * `isPermanentBffFailure` instead. `/ploegen/[slug]/page.tsx`'s `fetchBffData`
 * docstring explains why its two BFF reads need one classifier each.
 *
 * Left to reject, a transient failure keeps the throw-for-ISR-fallback shape:
 * `runPromise` rejects, the page throws, and ISR serves the last-good page
 * instead of caching whatever a caught failure would resolve to (#2540 state
 * 4 / #2636 / #2778).
 *
 * @see https://github.com/soniCaH/www.kcvvelewijt.be/issues/2778
 */
export function degradeIfPermanent<A, F, R>(
  effect: Effect.Effect<A, BffError, R>,
  onPermanent: F,
): Effect.Effect<A | F, BffError, R> {
  return effect.pipe(
    Effect.catchTags({
      HttpNotFound: () => Effect.succeed(onPermanent),
      ParseError: () => Effect.succeed(onPermanent),
      HttpApiDecodeError: () => Effect.succeed(onPermanent),
    }),
  );
}
