import { describe, it, expect } from "vitest";
import { Effect } from "effect";
import { isPermanentBffFailure } from "./classify-bff-failure";

async function runAndCatch(tag: string): Promise<unknown> {
  class Tagged {
    readonly _tag = tag;
    readonly message = "boom";
  }
  try {
    await Effect.runPromise(Effect.fail(new Tagged()));
  } catch (error) {
    return error;
  }
  throw new Error("expected Effect.runPromise to reject");
}

describe("isPermanentBffFailure", () => {
  it.each(["HttpNotFound", "ParseError", "HttpApiDecodeError"])(
    "reads %s as permanent",
    async (tag) => {
      expect(isPermanentBffFailure(await runAndCatch(tag))).toBe(true);
    },
  );

  it.each([
    "HttpServiceUnavailable",
    "HttpBadGateway",
    "TimeoutException",
    "HttpClientError",
  ])("reads %s as transient, not permanent", async (tag) => {
    expect(isPermanentBffFailure(await runAndCatch(tag))).toBe(false);
  });

  it("reads a non-FiberFailure value as not permanent (fails open to throw)", () => {
    expect(isPermanentBffFailure(new TypeError("network down"))).toBe(false);
    expect(isPermanentBffFailure("a plain string throw")).toBe(false);
    expect(isPermanentBffFailure(undefined)).toBe(false);
  });
});
