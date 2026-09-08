/**
 * Detail-tokens consistency guard (#2610)
 *
 * #2610 ships four "free tier" CSS-discipline rules (decision-sheet §8 D0 —
 * C6, S8, M6, Y4): a jersey-deep `::selection` inverted inside ink/jersey
 * bands, a hover that adds a border always reserving the width at rest, a
 * hovered underline thickening rather than jumping, and scores/tables in a
 * working figure set instead of the kit's inert `tabular-nums`. This file
 * grows by one `describe` block per detail as each lands — C6 first.
 *
 * This file is intentionally separate from `cross-page-consistency.test.ts`:
 * #2578 owns that file this wave, and every later ticket that wants a
 * detail-token rule should append here rather than open a third file.
 *
 * @see https://github.com/soniCaH/www.kcvvelewijt.be/issues/2610
 */

import { describe, it, expect } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const srcDir = resolve(__dirname, "../..");
const globalsCss = readFileSync(resolve(srcDir, "app/globals.css"), "utf8");

const SELF = "app/__tests__/detail-tokens-consistency.test.ts";
/** #2637 owns this tree this wave — it still carries bare `tabular-nums`
 *  (`StandingsTable`, `PlayerCard`, `TeamAgendaRow`, `YouthDirectory`) that
 *  #2610 does not touch. Fold it back into scope once #2637 lands. */
const TEAM_OWNED = /^components\/team\//;

/** Every first-party `.tsx` source file, minus this guard and #2637's tree. */
const sourceFiles = globSync(["**/*.tsx"], { cwd: srcDir })
  .sort()
  .filter((relPath) => relPath !== SELF && !TEAM_OWNED.test(relPath));

/** Shipped behaviour only — no tests, no stories. */
const productionSources = sourceFiles.filter(
  (relPath) => !/\.(test|stories)\.tsx?$/.test(relPath),
);

/**
 * Strip comments, then collect every quoted-string token so a class list
 * split across a `cn()` call's several string-literal arguments (ternary
 * branches included) is read as one bag of tokens rather than one string at
 * a time — the real code does exactly this (e.g.
 * `OrganigramExplorer.tsx`'s text-size buttons carry the resting `border` in
 * one branch and `hover:border-cream` in another). File-scoped, matching
 * `cross-page-consistency.test.ts`'s own granularity: a rule this coarse
 * cannot catch a hover-border added in a file with no resting border
 * anywhere else in it, but it never flags a legitimate split, and it holds
 * the line against the pattern this project has none of today.
 */
const COMMENT = /\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
const STRING_LITERAL =
  /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`/g;

function classTokens(source: string): Set<string> {
  const withoutComments = source.replace(COMMENT, "");
  const tokens = new Set<string>();
  for (const match of withoutComments.matchAll(STRING_LITERAL)) {
    for (const token of match[0].slice(1, -1).split(/\s+/)) {
      if (token) tokens.add(token);
    }
  }
  return tokens;
}

const tokensByFile = new Map(
  productionSources.map((relPath) => [
    relPath,
    classTokens(readFileSync(resolve(srcDir, relPath), "utf8")),
  ]),
);

// ---------------------------------------------------------------------------
// C6 — selection is inverted inside ink / jersey-deep(-dark) bands
// ---------------------------------------------------------------------------

describe("::selection is jersey-deep-on-cream, inverted on dark bands (C6)", () => {
  it("globals.css declares the base mark", () => {
    expect(globalsCss).toMatch(
      /::selection\s*{[^}]*background-color:\s*var\(--color-jersey-deep\)[^}]*color:\s*var\(--color-cream\)/,
    );
  });

  it("globals.css inverts the mark under .bg-ink / .bg-jersey-deep / .bg-jersey-deep-dark", () => {
    expect(globalsCss).toMatch(
      /\.bg-ink ::selection,\s*\n\s*\.bg-jersey-deep ::selection,\s*\n\s*\.bg-jersey-deep-dark ::selection\s*{[^}]*background-color:\s*var\(--color-cream\)[^}]*color:\s*var\(--color-jersey-deep\)/,
    );
  });
});

// ---------------------------------------------------------------------------
// S8 — a hover that adds a border reserves the width at rest
// ---------------------------------------------------------------------------

const HOVER_BORDER_TOKEN =
  /^(?:hover|group-hover|focus-visible):border(?:-\S+)?$/;
const BORDER_WIDTH_TOKEN = /^border(?:-(?:0|2|4|8|t|r|b|l|x|y|\[[^\]]+\]))?$/;

describe("a hover-added border reserves its width at rest (S8)", () => {
  it.each(productionSources)(
    "%s — every hover/focus-visible border colour has a resting border-width token in the same file",
    (relPath) => {
      const tokens = tokensByFile.get(relPath)!;
      const addsHoverBorder = [...tokens].some((t) =>
        HOVER_BORDER_TOKEN.test(t),
      );
      if (!addsHoverBorder) return;

      const reservesWidth = [...tokens].some((t) => BORDER_WIDTH_TOKEN.test(t));
      expect(reservesWidth).toBe(true);
    },
  );
});
