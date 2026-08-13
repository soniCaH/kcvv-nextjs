/**
 * Cross-page consistency guard
 *
 * The spec cut from #2425 decides thirty-four things that repeat across the
 * site's 31 public routes. A decision that lives only in a merged PR is a
 * decision the next route quietly re-invents, so each one that can be checked
 * statically lands here as a rule, and every later ticket sliced from #2556
 * appends to this file rather than starting a guard of its own.
 *
 * Shape, matching the two guards already in this directory: glob the tree,
 * assert one rule per file, and let an empty case list fail the run on its own
 * — vitest rejects an `it.each` with no cases, which is the property that makes
 * a guard trustworthy. A rule that silently matches nothing is worse than no
 * rule, because it reads like coverage.
 *
 * **Boundary:** the glob is `apps/web/src`. The BFF Worker (`apps/api`) is a
 * separate deploy with its own zone literal and its own `toLocale*` call, and
 * nothing here sees them — "site-wide" means this app, not this repo.
 *
 * @see https://github.com/soniCaH/www.kcvvelewijt.be/issues/2561
 */

import { describe, it, expect } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const srcDir = resolve(__dirname, "../..");

/** Every first-party source file, tests and stories included. */
const sourceFiles = globSync(["**/*.ts", "**/*.tsx"], { cwd: srcDir }).sort();

/**
 * Rules match code, not prose. Every banned pattern here is also the natural
 * way to *explain* the ban, so a docblock saying "replaces the raw
 * `toLocaleDateString`" would otherwise fail the file it documents — and the
 * fix a reader would reach for is deleting the explanation.
 *
 * One ordered alternation, not two passes. String literals come first, so a
 * comment-shaped substring inside one — this repo writes Storybook titles
 * ending in a slash-star wildcard — is consumed as a string before it can open
 * a phantom comment that swallows every declaration up to the next closing
 * delimiter. Literals are then re-emitted **verbatim**, because a rule may need
 * to read one: the zone below *is* a string.
 */
const COMMENT_OR_STRING =
  /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\/\/[^\n]*|\/\*[\s\S]*?\*\//g;

/**
 * This file is the one no rule can read. It states every banned pattern twice —
 * once in prose and once as a regex literal — and a regex literal is quote-dense
 * enough (`["']`) that any tokenizer segments it as a string, which throws the
 * rest of the scan out of step. Excluded explicitly rather than left to luck.
 */
const SELF = "app/__tests__/cross-page-consistency.test.ts";

/** Read and strip once per file — every rule below scans the same tree. */
const code = new Map(
  sourceFiles
    .filter((relPath) => relPath !== SELF)
    .map((relPath) => [
      relPath,
      readFileSync(resolve(srcDir, relPath), "utf8").replace(
        COMMENT_OR_STRING,
        (token) => (token.startsWith("/") ? "" : token),
      ),
    ]),
);

/** Every file a rule may scan — the tree minus this file. */
const scannableSources = sourceFiles.filter((relPath) => relPath !== SELF);

// ---------------------------------------------------------------------------
// Rule 1 (#2430) — dates format through Luxon's `toFormat`, never `toLocale*`
// ---------------------------------------------------------------------------

/**
 * `toLocale*` resolves month and weekday names from whatever ICU data the
 * runtime happens to ship, which differs between Node, the browser and CI — so
 * the same date renders differently depending on where it is rendered, and
 * surfaces as visual-regression drift. `@/lib/utils/dates` states the rule; this
 * holds it site-wide. There is no allowlist: the shared date module itself
 * complies, so nothing needs an exemption.
 *
 * `toLocaleDateString` / `toLocaleTimeString` / `Intl.DateTimeFormat` are
 * unambiguously dates. Bare `.toLocaleString(` is not — it is also how a number
 * is formatted — so it counts only in a file that imports Luxon, which is the
 * only way a `DateTime.toLocaleString` call can be reached.
 */
const ALWAYS_BANNED =
  /\.toLocaleDateString\s*\(|\.toLocaleTimeString\s*\(|\bIntl\.DateTimeFormat\b/;
const LUXON_IMPORT = /from\s+["']luxon["']/;
const BARE_TO_LOCALE_STRING = /\.toLocaleString\s*\(/;

describe("dates format through Luxon `toFormat` (#2430)", () => {
  it.each(scannableSources)(
    "%s — no `toLocale*` date formatting",
    (relPath) => {
      const source = code.get(relPath)!;
      expect(ALWAYS_BANNED.test(source)).toBe(false);

      if (LUXON_IMPORT.test(source)) {
        expect(BARE_TO_LOCALE_STRING.test(source)).toBe(false);
      }
    },
  );
});

// ---------------------------------------------------------------------------
// Rule 2 (#2430) — the club timezone has one home
// ---------------------------------------------------------------------------

/**
 * A second zone literal is how the site ended up with four date homes and half
 * of them unpinned: each new one looked local and harmless. The zone is
 * `CLUB_TIMEZONE` in `@/lib/utils/dates`, and it is club-scoped rather than
 * event-scoped precisely because the narrow name is why non-event formatters
 * kept assuming it did not apply to them.
 *
 * Scoped to production source: a test or story may legitimately hold the zone
 * as data — `ical.test.ts` asserts the `TZID:` line of rendered iCal output,
 * which is the literal string, not a pin. The exemption for the home itself is
 * applied at this rule's own `it.each`, not baked into `productionSources` —
 * `dates.ts` is the file later rules will most want to check hardest, and it
 * must not inherit a blanket pass it never asked for.
 */
const CLUB_TIMEZONE_HOME = "lib/utils/dates.ts";
const ZONE_LITERAL = /["']Europe\/Brussels["']/;

/** Everything a rule about shipped behaviour should hold — no tests, no stories. */
const productionSources = scannableSources.filter(
  (relPath) => !/\.(test|stories)\.tsx?$/.test(relPath),
);

describe("the club timezone has one home (#2430)", () => {
  it.each(productionSources.filter((f) => f !== CLUB_TIMEZONE_HOME))(
    "%s — no second zone literal",
    (relPath) => {
      expect(ZONE_LITERAL.test(code.get(relPath)!)).toBe(false);
    },
  );
});
