import { describe, it, expect } from "vitest";
import { formatTimeRange } from "./format-time-range";

describe("formatTimeRange", () => {
  it("joins both ends with a dash when present", () => {
    expect(formatTimeRange("10:00", "17:00")).toBe("10:00 - 17:00");
  });

  it("returns just the start time when end is missing", () => {
    expect(formatTimeRange("10:00", undefined)).toBe("10:00");
  });

  it("returns just the end time when start is missing", () => {
    expect(formatTimeRange(undefined, "17:00")).toBe("17:00");
  });

  it("returns undefined when both are missing — caller skips the slot", () => {
    expect(formatTimeRange(undefined, undefined)).toBeUndefined();
    expect(formatTimeRange("", "")).toBeUndefined();
  });
});
