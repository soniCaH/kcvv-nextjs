import { Runtime, Cause } from "effect";
import type { BffError } from "@/lib/effect/services/BffService";

/**
 * Tags that mean "this will not resolve itself on the next retry" — a
 * mistyped or stale `psdId` in Sanity (`HttpNotFound`), or a response PSD
 * sent that no longer matches this deploy's decoded shape (`ParseError`,
 * `HttpApiDecodeError`). Every other `BffError` tag — a timeout, a 502/503,
 * a generic client/network error — is a transient blip: retried by the next
 * ISR regeneration, which is exactly what letting it throw is for.
 *
 * Typed as `ReadonlySet<BffError["_tag"]>`, not a bare `Set<string>`: renaming
 * or removing a tag on `BffError` (`lib/effect/services/BffService.ts`) then
 * fails to compile here instead of silently narrowing this set to nothing —
 * every permanent failure would reclassify as transient, and `page.tsx`'s
 * competitive block would revert to the exact `error.tsx`-forever bug this
 * module exists to fix, with no red test (#2636 finding 2).
 *
 * This is genuinely the matches read's own tool now — `page.tsx`'s ranking
 * read still has its typed `BffError` channel at the call site, so it
 * classifies a permanent tag with `Effect.catchTags` directly, before it
 * ever becomes a rejected promise. The matches read goes through
 * `getTeamMatches` (`lib/server/match-data.ts`), whose channel is already
 * flattened to a rejecting `Promise` by the #2441 dedupe, so it cannot do
 * the same — this function is what is left to classify it after the fact.
 */
const PERMANENT_TAGS: ReadonlySet<BffError["_tag"]> = new Set([
  "HttpNotFound",
  "ParseError",
  "HttpApiDecodeError",
]);

/**
 * True when a value caught from a rejected `Effect.runPromise` carries one of
 * `PERMANENT_TAGS`.
 *
 * `Effect.runPromise` rejects with a `FiberFailure`, not the tagged error
 * itself — the tag is one `Cause.squash` away, behind the
 * `Runtime.FiberFailureCauseId` symbol. A value that is not a `FiberFailure`
 * at all (defensive: a plain `TypeError`, a value thrown by non-Effect code)
 * reads as **not** permanent, so it still throws and gets the ISR-fallback
 * treatment rather than silently degrading on a shape this function does not
 * recognise.
 *
 * @see https://github.com/soniCaH/www.kcvvelewijt.be/issues/2636 — finding 3
 */
export function isPermanentBffFailure(error: unknown): boolean {
  if (!Runtime.isFiberFailure(error)) return false;
  const squashed = Cause.squash(error[Runtime.FiberFailureCauseId]);
  const tag = (squashed as { _tag?: unknown })?._tag;
  return typeof tag === "string" && PERMANENT_TAGS.has(tag as BffError["_tag"]);
}
