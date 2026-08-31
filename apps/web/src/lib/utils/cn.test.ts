import { describe, expect, it } from "vitest";
import { cn, CUSTOM_SIZE_TOKENS } from "./cn";

describe("cn — custom font-size tokens", () => {
  it.each(CUSTOM_SIZE_TOKENS)("keeps text-%s beside a text colour", (token) => {
    expect(cn(`text-${token}`, "text-ink")).toBe(`text-${token} text-ink`);
  });

  it("still collapses two genuine sizes to the last one", () => {
    expect(cn("text-body-sm", "text-body-lg")).toBe("text-body-lg");
    expect(cn("text-label", "text-2xl")).toBe("text-2xl");
    expect(cn("text-2xl", "text-label")).toBe("text-label");
  });

  it("still collapses two colours to the last one", () => {
    expect(cn("text-ink", "text-cream")).toBe("text-cream");
  });
});
