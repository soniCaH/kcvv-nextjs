import { Runtime, Cause } from "effect";

/**
 * Tags that mean "this will not resolve itself on the next retry" — a
 * mistyped or stale `psdId` in Sanity (`HttpNotFound`), or a response PSD
 * sent that no longer matches this deploy's decoded shape (`ParseError`,
 * `HttpApiDecodeError`). Every other `BffError` tag — a timeout, a 502/503,
 * a generic client/network error — is a transient blip: retried by the next
 * ISR regeneration, which is exactly what letting it throw is for.
 */
const PERMANENT_TAGS = new Set([
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
  return typeof tag === "string" && PERMANENT_TAGS.has(tag);
}
