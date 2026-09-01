import { describe, it, expect } from "vitest";
import { Effect } from "effect";
import { degradeIfPermanent } from "./degrade-if-permanent";
import type { BffError } from "@/lib/effect/services/BffService";

// Same rationale as `classify-bff-failure.test.ts`: typed against the real
// `BffError["_tag"]` union, not a bare `string`, so a tag renamed or removed
// on `BffError` fails this file to compile instead of silently narrowing
// which tags this helper degrades.
function failingEffect(tag: BffError["_tag"]): Effect.Effect<never, BffError> {
  class Tagged {
    readonly _tag = tag;
    readonly message = "boom";
  }
  return Effect.fail(new Tagged()) as unknown as Effect.Effect<never, BffError>;
}

describe("degradeIfPermanent", () => {
  it.each<BffError["_tag"]>([
    "HttpNotFound",
    "ParseError",
    "HttpApiDecodeError",
  ])(
    "resolves %s to the permanent fallback instead of rejecting",
    async (tag) => {
      const result = await Effect.runPromise(
        degradeIfPermanent(failingEffect(tag), "fallback" as const),
      );
      expect(result).toBe("fallback");
    },
  );

  it.each<BffError["_tag"]>([
    "HttpServiceUnavailable",
    "HttpBadGateway",
    "TimeoutException",
    "RequestError",
    "ResponseError",
  ])("leaves %s rejecting unchanged (transient)", async (tag) => {
    await expect(
      Effect.runPromise(
        degradeIfPermanent(failingEffect(tag), "fallback" as const),
      ),
    ).rejects.toBeTruthy();
  });

  it("passes a successful value through untouched", async () => {
    const result = await Effect.runPromise(
      degradeIfPermanent(Effect.succeed(42), "fallback" as const),
    );
    expect(result).toBe(42);
  });
});
