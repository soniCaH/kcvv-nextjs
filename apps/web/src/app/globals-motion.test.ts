import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Pins the `@theme` motion-namespace reset and the Motion Vocabulary's
 * duration/curve scale in place (#2658, mirroring `apps/web/DESIGN.md` →
 * Motion). `eslint.config.mjs`'s Motion Vocabulary bans catch a bad class
 * string in `src/**\/*.tsx`; this file catches the other half — a deleted
 * reset line or a stray raw-CSS duration/curve, which `@theme` does nothing
 * to guard because they are hand-written rules, not utility classes.
 *
 * CSS comments are stripped before every count-based assertion below. The
 * file documents its own history in prose next to the block it replaced
 * (see the `--motion-fast`/`--motion-base`/`--motion-tape` removal note and
 * the Namespace Rule comment above the reset) and that prose legitimately
 * quotes the old `240ms cubic-bezier(0.2, 0.8, 0.2, 1)` values it replaced —
 * counting comment text would make this test fail for a documentation
 * convention the codebase otherwise encourages.
 */
const globalsCssRaw = readFileSync(join(__dirname, "globals.css"), "utf8");
const globalsCss = globalsCssRaw.replace(/\/\*[\s\S]*?\*\//g, "");

describe("globals.css — the Motion Vocabulary reset (DESIGN.md → Motion)", () => {
  it.each([
    ["--ease-*", "--ease-*: initial;"],
    ["--animate-*", "--animate-*: initial;"],
    ["--default-transition-duration", "--default-transition-duration: 150ms;"],
    [
      "--default-transition-timing-function",
      "--default-transition-timing-function: var(--ease-out);",
    ],
  ])("resets %s", (_label, declaration) => {
    expect(globalsCss).toContain(declaration);
  });

  it("declares exactly one cubic-bezier(...), the One Curve Rule's curve", () => {
    const matches = [...globalsCss.matchAll(/cubic-bezier\([^)]*\)/g)].map(
      (m) => m[0],
    );
    expect(matches).toEqual(["cubic-bezier(0, 0, 0.58, 1)"]);
  });

  it("uses only the three sanctioned travel durations (150ms/300ms/500ms)", () => {
    // Every `ms`-suffixed duration in the file is a travel/on-demand
    // duration — the three loops below all use bare-`s` periods, so this
    // pattern never needs to special-case them.
    const msValues = [...globalsCss.matchAll(/\b(\d+(?:\.\d+)?)ms\b/g)].map(
      (m) => m[1],
    );
    expect(msValues.length).toBeGreaterThan(0);
    for (const value of msValues) {
      expect(["150", "300", "500"]).toContain(value);
    }
  });

  // Loops are exempt, by name. Their periods are the Loop Rule's own
  // per-loop choice (DESIGN.md → Motion → The Loop Rule), never the Three
  // Speeds scale — an allow-list without this comment naming exactly which
  // three loops it covers will read as a leftover and get "simplified"
  // away by the next reader.
  it.each([
    ["the scarf — kcvv-scarf-scroll", "kcvv-scarf-scroll 1.5s"],
    ["the dots — kcvv-spinner-dot-pulse", "kcvv-spinner-dot-pulse 1.2s"],
    ["the dots' stagger delays", "animation-delay: 0.15s;"],
    ["the dots' stagger delays", "animation-delay: 0.3s;"],
    ["the skeleton pulse — kcvv-pulse", "kcvv-pulse 2s"],
  ])("keeps the loop period for %s", (_label, snippet) => {
    expect(globalsCss).toContain(snippet);
  });

  it("has no bare-`s` duration outside the three loops' own periods", () => {
    // A travel duration always carries an explicit `ms` suffix in this file
    // (asserted above); a bare-`s` value is therefore always a loop period.
    // Pinning the full set closes the gap the `ms`-only check above can't
    // see on its own — a new loop, or a travel rule mistakenly written in
    // seconds, would otherwise slip through unnoticed.
    const sValues = [...globalsCss.matchAll(/\b(\d+(?:\.\d+)?)s\b/g)].map(
      (m) => m[1],
    );
    expect(sValues.sort()).toEqual(["0.15", "0.3", "1.2", "1.5", "2"]);
  });
});
