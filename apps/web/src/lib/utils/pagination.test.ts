import { describe, it, expect } from "vitest";
import {
  clampListingWindow,
  deduplicateById,
  paginateResults,
} from "./pagination";

const row = (id: string) => ({ id, title: `Row ${id}` });

describe("clampListingWindow", () => {
  it("passes a sane window through untouched", () => {
    expect(clampListingWindow({ offset: 24, limit: 12 })).toEqual({
      offset: 24,
      limit: 12,
    });
  });

  it("floors a negative offset at 0 — GROQ reads it as end-relative", () => {
    expect(clampListingWindow({ offset: -5, limit: 12 }).offset).toBe(0);
  });

  it("caps the limit at the first-paint total", () => {
    expect(clampListingWindow({ offset: 0, limit: 1_000_000 }).limit).toBe(24);
  });

  it("keeps the limit at least 1 and truncates fractions", () => {
    expect(clampListingWindow({ offset: 0, limit: 0 }).limit).toBe(1);
    expect(clampListingWindow({ offset: 2.7, limit: 5.9 })).toEqual({
      offset: 2,
      limit: 5,
    });
  });

  // `Math.trunc(NaN)` is NaN and every comparison against NaN is false, so a
  // bare Math.max/Math.min clamp hands it straight to GROQ.
  it.each([NaN, Infinity, -Infinity])(
    "falls back to a bounded window for a non-finite offset (%p)",
    (offset) => {
      const result = clampListingWindow({ offset, limit: 12 });
      expect(Number.isInteger(result.offset)).toBe(true);
      expect(result.offset).toBe(0);
      expect(result.limit).toBe(12);
    },
  );

  it.each([NaN, Infinity, -Infinity])(
    "falls back to a bounded window for a non-finite limit (%p)",
    (limit) => {
      const result = clampListingWindow({ offset: 24, limit });
      expect(Number.isInteger(result.limit)).toBe(true);
      expect(result.limit).toBeGreaterThanOrEqual(1);
      expect(result.limit).toBeLessThanOrEqual(24);
      expect(result.offset).toBe(24);
    },
  );
});

describe("paginateResults", () => {
  it("reports more when the over-fetched row came back, and drops it", () => {
    const result = paginateResults([row("1"), row("2"), row("3")], 2);
    expect(result.hasMore).toBe(true);
    expect(result.items.map((r) => r.id)).toEqual(["1", "2"]);
  });

  it("reports no more on a short batch and keeps every row", () => {
    const result = paginateResults([row("1"), row("2")], 2);
    expect(result.hasMore).toBe(false);
    expect(result.items).toHaveLength(2);
  });

  it("handles an empty batch", () => {
    expect(paginateResults([], 12)).toEqual({ items: [], hasMore: false });
  });
});

describe("deduplicateById", () => {
  it("returns all rows when there are no duplicates", () => {
    const result = deduplicateById([row("1"), row("2"), row("3")], new Set());
    expect(result.map((r) => r.id)).toEqual(["1", "2", "3"]);
  });

  it("removes rows whose IDs are in existingIds", () => {
    const result = deduplicateById(
      [row("1"), row("2"), row("3")],
      new Set(["1", "3"]),
    );
    expect(result.map((r) => r.id)).toEqual(["2"]);
  });

  it("removes within-batch duplicates", () => {
    const result = deduplicateById(
      [row("1"), row("2"), row("1"), row("2")],
      new Set(),
    );
    expect(result.map((r) => r.id)).toEqual(["1", "2"]);
  });

  it("returns empty array for empty input", () => {
    expect(deduplicateById([], new Set())).toEqual([]);
    expect(deduplicateById([], new Set(["1", "2"]))).toEqual([]);
  });

  it("returns empty array when all rows are duplicates", () => {
    expect(deduplicateById([row("1"), row("2")], new Set(["1", "2"]))).toEqual(
      [],
    );
  });

  it("does not mutate the existingIds set", () => {
    const existingIds = new Set(["1"]);
    deduplicateById([row("2"), row("3")], existingIds);
    expect(existingIds.size).toBe(1);
  });
});
