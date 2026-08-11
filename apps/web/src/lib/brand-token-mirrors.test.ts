import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { buildStrokeDataUrl } from "@/components/design-system/HighlighterStroke/strokes";
import { TOKENS } from "@/components/share/constants";
import { BRAND } from "@/lib/constants";

/**
 * `--color-jersey-deep` is the source of truth, but CSS custom properties can't
 * be read server-side, by Satori, or from inside a data-URI SVG — so the value
 * is hand-copied into several modules. Nothing else fails when those drift.
 *
 * #2416 is the evidence this is worth guarding: the ticket enumerated "the five
 * hardcoded mirrors" and a grep found eight.
 *
 * Not covered here: `packages/sanity-studio`'s decorator previews, a separate
 * workspace that must not import from `apps/web`. `og/share-card.tsx` needs no
 * assertion — it spreads the /share palette rather than mirroring it.
 */
const globalsCss = readFileSync(
  join(__dirname, "..", "app", "globals.css"),
  "utf8",
);

const jerseyDeep = /--color-jersey-deep:\s*(#[0-9a-f]{6})\s*;/i.exec(
  globalsCss,
)?.[1];

describe("jersey-deep hex mirrors track globals.css", () => {
  it("finds the token in globals.css", () => {
    expect(jerseyDeep).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("matches BRAND.primaryColor (themeColor + manifest theme_color)", () => {
    expect(BRAND.primaryColor).toBe(jerseyDeep);
  });

  it("matches the /share capture palette", () => {
    expect(TOKENS.jerseyDeep).toBe(jerseyDeep);
  });

  it("matches the highlighter stroke's url-encoded fill", () => {
    expect(buildStrokeDataUrl("jersey-deep")).toContain(
      `%23${jerseyDeep?.slice(1)}`,
    );
  });

  it("matches the .prose-link marker baked into its data-URI SVG", () => {
    const proseLinkFill = /fill='%23([0-9a-f]{6})' fill-opacity='0\.4'/i.exec(
      globalsCss,
    )?.[1];
    expect(proseLinkFill).toBe(jerseyDeep?.slice(1));
  });

  // Declaration only — the token block still names `--color-jersey-link` in
  // prose, explaining what it was absorbed into.
  it("no longer declares a separate jersey-link green", () => {
    expect(globalsCss).not.toMatch(/--color-jersey-link:/);
  });

  // The two consumers the deleted token used to own. Both indirect through
  // `var()`, so they cannot drift in value — but they can be repointed at a
  // token that no longer exists, which is silent until something renders.
  it.each([
    ["the cookie-banner link", /--cc-link-color:\s*var\(([^)]+)\)/],
    [".prose-link", /\.prose-link\s*\{\s*color:\s*var\(([^)]+)\)/],
  ])("resolves %s against jersey-deep", (_label, pattern) => {
    expect(pattern.exec(globalsCss)?.[1]).toBe("--color-jersey-deep");
  });
});
