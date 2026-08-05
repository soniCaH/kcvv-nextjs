import { describe, it, expect } from "vitest";

import { metadata } from "./not-found";

/**
 * The global 404 must not be indexed. The 404 status already signals this, but
 * the explicit `metadata.robots` noindex is belt-and-braces (mirrors the
 * `/tegenstander/[clubId]` convention) — guarded here so a refactor can't drop
 * it silently. (The 500 boundary `error.tsx` is a Client Component and cannot
 * export metadata; it relies on the non-indexable 500 status instead.)
 */
describe("not-found metadata", () => {
  it("carries robots noindex", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
