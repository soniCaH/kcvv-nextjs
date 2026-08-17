import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// `fetchRecentMatchIds` resolves the Effect runtime unconditionally, so this
// keeps ~800 ms of module loading out of the timed test body. See CLAUDE.md
// "Import the module under test at module scope".
import "@/lib/effect/runtime";

import sitemap from "./sitemap";

const mockFetch = vi.fn();

// Mocked at the SDK boundary rather than at `@/lib/sanity/client`, because
// `sitemap()` reaches the wrapper through six concurrent `await import()`s and
// only the first resolved through a module-level mock — the other five escaped
// to `api.sanity.io` on every test (#2362). Intercepting `createClient` means no
// real SanityClient is ever constructed, so the escape is impossible however the
// wrapper is imported.
vi.mock("@sanity/client", () => ({
  createClient: () => ({
    fetch: (...args: unknown[]) => mockFetch(...args),
  }),
}));

/** `sitemap()` issues exactly one Sanity query per `fetchFromSanity` call. */
const SANITY_QUERY_COUNT = 6;

describe("sitemap.ts", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // The zero-outbound-request guard: a short count means a query escaped the
  // mock, which is a real network round-trip. A `fetch` spy cannot do this job —
  // `@sanity/client` uses the Node http(s) transport via `get-it`, so it reads 0
  // either way.
  afterEach(() => {
    expect(mockFetch, "a Sanity query escaped the mock").toHaveBeenCalledTimes(
      SANITY_QUERY_COUNT,
    );
  });

  it("returns all static routes with correct metadata", async () => {
    mockFetch.mockResolvedValue([]);

    const result = await sitemap();

    // Should contain all 20 static routes
    const staticEntries = result.filter(
      (e) =>
        !e.url.includes("/nieuws/") ||
        e.url === "https://www.kcvvelewijt.be/nieuws",
    );
    expect(staticEntries).toHaveLength(20);

    // Verify homepage entry
    const homepage = result.find(
      (e) => e.url === "https://www.kcvvelewijt.be/",
    );
    expect(homepage).toBeDefined();
    expect(homepage!.priority).toBe(1.0);
    expect(homepage!.changeFrequency).toBe("weekly");

    // Verify nieuws (highest changeFreq)
    const nieuws = result.find(
      (e) => e.url === "https://www.kcvvelewijt.be/nieuws",
    );
    expect(nieuws).toBeDefined();
    expect(nieuws!.priority).toBe(0.9);
    expect(nieuws!.changeFrequency).toBe("daily");

    // Verify privacy (lowest priority)
    const privacy = result.find(
      (e) => e.url === "https://www.kcvvelewijt.be/privacy",
    );
    expect(privacy).toBeDefined();
    expect(privacy!.priority).toBe(0.3);
    expect(privacy!.changeFrequency).toBe("yearly");

    // Verify galerij list (#1471)
    const galerij = result.find(
      (e) => e.url === "https://www.kcvvelewijt.be/galerij",
    );
    expect(galerij).toBeDefined();
    expect(galerij!.priority).toBe(0.6);
    expect(galerij!.changeFrequency).toBe("monthly");

    // Verify the contents page (#2622) — it re-derives daily from the CMS,
    // and the footer is its only link, so the sitemap is how a crawler finds it.
    const inhoud = result.find(
      (e) => e.url === "https://www.kcvvelewijt.be/inhoud",
    );
    expect(inhoud).toBeDefined();
    expect(inhoud!.priority).toBe(0.4);
    expect(inhoud!.changeFrequency).toBe("daily");

    // All entries should have lastModified as a Date
    for (const entry of result) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }

    // All URLs should be absolute
    for (const entry of result) {
      expect(entry.url).toMatch(/^https:\/\/www\.kcvvelewijt\.be\//);
    }
  });

  it("includes dynamic article slugs from Sanity", async () => {
    mockFetch.mockResolvedValue([
      { slug: "test-article", updatedAt: "2026-03-15T10:00:00Z" },
      { slug: "another-article", updatedAt: "2026-03-20T12:00:00Z" },
    ]);

    const result = await sitemap();

    const articleEntries = result.filter(
      (e) =>
        e.url.startsWith("https://www.kcvvelewijt.be/nieuws/") &&
        e.url !== "https://www.kcvvelewijt.be/nieuws",
    );

    expect(articleEntries).toHaveLength(2);
    expect(articleEntries[0].url).toBe(
      "https://www.kcvvelewijt.be/nieuws/test-article",
    );
    expect(articleEntries[0].lastModified).toEqual(
      new Date("2026-03-15T10:00:00Z"),
    );
    expect(articleEntries[0].changeFrequency).toBe("monthly");
    expect(articleEntries[0].priority).toBe(0.7);
  });

  it("gracefully handles Sanity fetch failure", async () => {
    mockFetch.mockRejectedValue(new Error("Sanity is down"));

    const result = await sitemap();

    // Should still return static routes
    expect(result).toHaveLength(20);
  });
});
