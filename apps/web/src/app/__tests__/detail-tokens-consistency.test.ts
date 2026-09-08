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
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const srcDir = resolve(__dirname, "../..");
const globalsCss = readFileSync(resolve(srcDir, "app/globals.css"), "utf8");

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
