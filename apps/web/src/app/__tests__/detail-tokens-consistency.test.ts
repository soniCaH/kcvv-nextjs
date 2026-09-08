/**
 * Detail-tokens consistency guard (#2610)
 *
 * #2610 ships four "free tier" CSS-discipline rules (decision-sheet §8 D0 —
 * C6, S8, M6, Y4): a jersey-deep `::selection` inverted inside ink/jersey
 * bands, a hover that adds a border always reserving the width at rest, a
 * hovered underline thickening rather than jumping, and scores/tables in a
 * working figure set instead of the kit's inert `tabular-nums`. This file
 * grows by one `describe` block per detail as each lands — C6, S8, M6, Y4.
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

/**
 * Every first-party `.ts`/`.tsx` source file, minus this guard and #2637's
 * tree. `.ts` matters as much as `.tsx` here — `fieldChrome.ts`,
 * `button-styles.ts` and `press-down.ts` are dedicated class-string modules
 * (no JSX at all) that a `**\/*.tsx`-only glob would silently never scan,
 * `fieldChrome.ts` being the exact file globals.css's own S8 comment names
 * as an audited site (#2610 review, round 1).
 */
const sourceFiles = globSync(["**/*.tsx", "**/*.ts"], { cwd: srcDir })
  .sort()
  .filter((relPath) => relPath !== SELF && !TEAM_OWNED.test(relPath));

/** Shipped behaviour only — no tests, no stories. */
const productionSources = sourceFiles.filter(
  (relPath) => !/\.(test|stories)\.tsx?$/.test(relPath),
);

/**
 * Strip comments WITHOUT touching string contents — a single alternation
 * that tries a string literal before a comment at every position, so a
 * `"https://…"` string is consumed whole (and re-emitted verbatim) before
 * the bare `//` inside it can ever be read as a line-comment opener. Two
 * separate regexes (comments first, strings second) get this wrong: a
 * naive `COMMENT` pass strips from the first `//` — including one inside a
 * string literal — to end of line, eating the string's own closing quote
 * and leaving every subsequent quote in the file mismatched, so
 * `classTokens` returns near-garbage for the rest of that file (#2610
 * review, round 1 — reproduced on 10 of 322 production files, all silently
 * exempted from both S8 and Y4 by the bug). Same technique as
 * `cross-page-consistency.test.ts`'s own `COMMENT_OR_STRING`.
 */
const COMMENT_OR_STRING =
  /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\/\/[^\n]*|\/\*[\s\S]*?\*\//g;

/**
 * Split a class list across a `cn()` call's several string-literal
 * arguments (ternary branches included) into one bag of tokens rather than
 * reading one string at a time — the real code does exactly this (e.g.
 * `OrganigramExplorer.tsx`'s text-size buttons carry the resting `border`
 * in one branch and `hover:border-cream` in another). File-scoped, matching
 * `cross-page-consistency.test.ts`'s own granularity: a rule this coarse
 * cannot catch a hover-border added in a file with no resting border
 * anywhere else in it, but it never flags a legitimate split, and it holds
 * the line against the pattern this project has none of today.
 */
function classTokens(source: string): Set<string> {
  const tokens = new Set<string>();
  for (const match of source.matchAll(COMMENT_OR_STRING)) {
    const raw = match[0];
    if (raw.startsWith("/")) continue; // a comment — discard, keep scanning
    for (const token of raw.slice(1, -1).split(/\s+/)) {
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

describe("classTokens — comment/string regression fixtures (#2610 review, round 1)", () => {
  it("a `//` inside a string literal does not corrupt the rest of the file", () => {
    const source = [
      '<a href="https://kcvvelewijt.be/x">link</a>',
      'const cls = "border border-ink hover:border-jersey-deep tabular-nums";',
    ].join("\n");

    const tokens = classTokens(source);

    expect(tokens.has("https://kcvvelewijt.be/x")).toBe(true);
    expect(tokens.has("border")).toBe(true);
    expect(tokens.has("hover:border-jersey-deep")).toBe(true);
    expect(tokens.has("tabular-nums")).toBe(true);
  });

  it("still strips a real `//` line comment", () => {
    const source = [
      "// hover:border-should-not-count",
      'const cls = "border-2";',
    ].join("\n");

    const tokens = classTokens(source);

    expect(tokens.has("hover:border-should-not-count")).toBe(false);
    expect(tokens.has("border-2")).toBe(true);
  });

  it("still strips a real block comment", () => {
    const source = [
      "/* hover:border-should-not-count */",
      'const cls = "border-2";',
    ].join("\n");

    const tokens = classTokens(source);

    expect(tokens.has("hover:border-should-not-count")).toBe(false);
    expect(tokens.has("border-2")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// C6 — selection is inverted inside ink / jersey-deep(-dark) bands, and
// re-reverted inside a light surface nested inside one of those bands
// ---------------------------------------------------------------------------

describe("::selection is jersey-deep-on-cream, inverted on dark bands (C6)", () => {
  it("globals.css declares the base mark", () => {
    expect(globalsCss).toMatch(
      /::selection\s*{[^}]*background-color:\s*var\(--color-jersey-deep\)[^}]*color:\s*var\(--color-cream\)/,
    );
  });

  it("globals.css inverts the mark under .bg-ink / .bg-jersey-deep / .bg-jersey-deep-dark, both as the band's own text and as a descendant's", () => {
    for (const band of ["bg-ink", "bg-jersey-deep", "bg-jersey-deep-dark"]) {
      expect(globalsCss).toContain(`.${band}::selection,`);
      // Last selector in the group has no trailing comma (it's followed by
      // `{`), so this checks the substring without one.
      expect(globalsCss).toContain(`.${band} ::selection`);
    }
    expect(globalsCss).toMatch(
      /\.bg-ink::selection,\s*\n\s*\.bg-ink ::selection,[\s\S]*?{[^}]*background-color:\s*var\(--color-cream\)[^}]*color:\s*var\(--color-jersey-deep\)/,
    );
  });

  it("globals.css reverts the mark under a light surface (.bg-cream / .bg-cream-soft / .bg-cream-deep), both as the surface's own text and as a descendant's", () => {
    for (const surface of ["bg-cream", "bg-cream-soft", "bg-cream-deep"]) {
      expect(globalsCss).toContain(`.${surface}::selection,`);
      expect(globalsCss).toContain(`.${surface} ::selection`);
    }
    expect(globalsCss).toMatch(
      /\.bg-cream::selection,\s*\n\s*\.bg-cream ::selection,[\s\S]*?{[^}]*background-color:\s*var\(--color-jersey-deep\)[^}]*color:\s*var\(--color-cream\)/,
    );
  });

  it("the light-surface revert is declared after the dark-band inversion, so it wins the cascade for a light card nested inside a dark band", () => {
    const darkBandIndex = globalsCss.indexOf(".bg-ink::selection,");
    const lightSurfaceIndex = globalsCss.indexOf(".bg-cream::selection,");
    expect(darkBandIndex).toBeGreaterThan(-1);
    expect(lightSurfaceIndex).toBeGreaterThan(darkBandIndex);
  });
});

// ---------------------------------------------------------------------------
// S8 — a hover that adds a border reserves the width, on the SAME side, at
// rest. Side-aware: `border-b` at rest does not reserve an all-sides hover
// border, and the hover trigger includes responsive/has-[:hover] variants,
// matching what the globals.css S8 comment claims is covered.
// ---------------------------------------------------------------------------

type BorderSide = "all" | "t" | "r" | "b" | "l" | "x" | "y";

/** Zero or more generic variant prefixes, then one of the variants the S8
 *  comment in globals.css actually claims: hover, group-hover,
 *  focus-visible, or `has-[:hover]`. Matches `hover:`, `md:hover:`,
 *  `sm:group-hover:`, and `has-[:hover]:` alike. */
const HOVER_VARIANT_PREFIX =
  /^(?:[a-z][a-z0-9-]*:)*(?:hover|group-hover|focus-visible|has-\[:hover\]):/;

/** A bare (unvaried) Tailwind border utility — `border`, `border-2`,
 *  `border-t`, `border-ink/30`, `border-t-jersey-deep`, `border-[1.5px]`. */
const BORDER_UTILITY = /^border(?:-(t|r|b|l|x|y))?(?:-(.+))?$/;

function parseBorderUtility(
  token: string,
): { side: BorderSide; kind: "width" | "color" } | null {
  const m = token.match(BORDER_UTILITY);
  if (!m) return null;
  const side = (m[1] as BorderSide | undefined) ?? "all";
  const value = m[2];
  if (value === undefined) return { side, kind: "width" };
  // A width is a bare number (`border-2`) or an arbitrary value
  // (`border-[1.5px]`); anything else (`border-ink`, `border-jersey-deep`,
  // `border-ink/30`, `border-dashed`) is treated as not-a-width — correct
  // for colours, and harmlessly conservative for the rare style keyword
  // (`border-dashed`), which never by itself reserves a width either.
  const kind = /^(?:\d|\[)/.test(value) ? "width" : "color";
  return { side, kind };
}

describe("parseBorderUtility (#2610 review, round 1 — side-aware fixtures)", () => {
  it.each<[string, BorderSide, "width" | "color"]>([
    ["border", "all", "width"],
    ["border-2", "all", "width"],
    ["border-[1.5px]", "all", "width"],
    ["border-t", "t", "width"],
    ["border-t-2", "t", "width"],
    ["border-ink", "all", "color"],
    ["border-ink/30", "all", "color"],
    ["border-jersey-deep", "all", "color"],
    ["border-t-jersey-deep", "t", "color"],
    ["border-b", "b", "width"],
  ])("%s → side %s, kind %s", (token, side, kind) => {
    expect(parseBorderUtility(token)).toEqual({ side, kind });
  });

  it("rejects a non-border token", () => {
    expect(parseBorderUtility("bg-ink")).toBeNull();
  });
});

describe("a hover-added border reserves its width, on the same side, at rest (S8)", () => {
  it.each(productionSources)(
    "%s — every hover/focus-visible/has-[:hover] border colour has a matching resting border-width token in the same file",
    (relPath) => {
      const tokens = tokensByFile.get(relPath)!;

      const hoverColorSides = new Set<BorderSide>();
      for (const token of tokens) {
        if (!HOVER_VARIANT_PREFIX.test(token)) continue;
        const rest = token.replace(HOVER_VARIANT_PREFIX, "");
        const parsed = parseBorderUtility(rest);
        if (parsed?.kind === "color") hoverColorSides.add(parsed.side);
      }
      if (hoverColorSides.size === 0) return;

      const restingWidthSides = new Set<BorderSide>();
      for (const token of tokens) {
        if (HOVER_VARIANT_PREFIX.test(token)) continue;
        const parsed = parseBorderUtility(token);
        if (parsed?.kind === "width") restingWidthSides.add(parsed.side);
      }

      for (const side of hoverColorSides) {
        const reserved =
          restingWidthSides.has("all") || restingWidthSides.has(side);
        expect(reserved).toBe(true);
      }
    },
  );

  it("fixture: an all-sides hover colour is NOT reserved by a single-side resting width", () => {
    const tokens = new Set(["border-b", "hover:border-ink"]);
    const hoverSide = parseBorderUtility(
      [...tokens]
        .find((t) => HOVER_VARIANT_PREFIX.test(t))!
        .replace(HOVER_VARIANT_PREFIX, ""),
    )!.side;
    const restingSides = new Set(
      [...tokens]
        .filter((t) => !HOVER_VARIANT_PREFIX.test(t))
        .map((t) => parseBorderUtility(t))
        .filter((p): p is NonNullable<typeof p> => p?.kind === "width")
        .map((p) => p.side),
    );
    expect(hoverSide).toBe("all");
    expect(restingSides.has("all") || restingSides.has(hoverSide)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// M6 — a hovered underline thickens, and the gesture is absent under
// prefers-reduced-motion (the transition, not the end state)
// ---------------------------------------------------------------------------

describe("hover-underline-thicken exists, is layered, and respects reduced motion (M6)", () => {
  it("globals.css declares the thickness transition on the Chrome speed, as transition longhands", () => {
    expect(globalsCss).toMatch(
      /\.hover-underline-thicken\s*{[^}]*text-decoration-thickness:\s*1px[^}]*transition-property:\s*text-decoration-thickness;[^}]*transition-duration:\s*150ms;[^}]*transition-timing-function:\s*var\(--ease-out\)/,
    );
  });

  it("globals.css thickens on hover and focus-visible", () => {
    expect(globalsCss).toMatch(
      /\.hover-underline-thicken:hover,\s*\n\s*\.hover-underline-thicken:focus-visible\s*{[^}]*text-decoration-thickness:\s*2px/,
    );
  });

  it("globals.css makes the transition absent (not shortened) under reduced motion", () => {
    const reducedMotionBlocks = globalsCss.match(
      /@media \(prefers-reduced-motion: reduce\) {[\s\S]*?\n {2}}/g,
    );
    const ownsHoverUnderline = reducedMotionBlocks?.some(
      (block) =>
        block.includes(".hover-underline-thicken") &&
        block.includes("transition-property: none"),
    );
    expect(ownsHoverUnderline).toBe(true);
  });

  it("is declared inside @layer components, not unlayered, so a later utility (no-underline, decoration-2, transition-colors) can still win", () => {
    const layerMatch = globalsCss.match(/@layer components\s*{([\s\S]*?)\n}\n/);
    expect(layerMatch).not.toBeNull();
    expect(layerMatch![1]).toContain(".hover-underline-thicken {");
  });
});

// ---------------------------------------------------------------------------
// Y4 — scores and tabulated numbers read in a consistent figure set;
// tabular-nums never ships alone (measured inert on every face this site
// uses — decision-sheet §8, docs/design/mockups/2516-numerals/candidates.html)
// ---------------------------------------------------------------------------

/**
 * `font-mono` anywhere in the file is not evidence the *tabular-nums* span
 * itself is mono — `MatchHero.tsx` carries both (`font-mono` on its
 * unrelated competition meta line, `tabular-nums` on the display-big
 * scoreline), and a file-wide "or font-mono" check missed exactly that
 * combination during #2610's own TDD loop. So this is a named allowlist,
 * not a heuristic: the two call sites where the tabular-nums span is
 * genuinely monospaced by construction (Y4's other sanctioned fix, "the
 * column goes mono") and needs no `lining-nums` alongside it.
 */
const MONO_TABULAR_EXCEPTIONS = new Set([
  "components/layout/MatchStrip/MatchStripView.tsx",
  "components/design-system/TextareaCounter/TextareaCounter.tsx",
]);

describe("tabular-nums never ships without lining-nums or a mono face (Y4)", () => {
  it.each(productionSources)(
    "%s — tabular-nums is not the whole fix",
    (relPath) => {
      const tokens = tokensByFile.get(relPath)!;
      if (!tokens.has("tabular-nums")) return;

      const worksAnotherWay =
        tokens.has("lining-nums") || MONO_TABULAR_EXCEPTIONS.has(relPath);
      expect(worksAnotherWay).toBe(true);
    },
  );
});
