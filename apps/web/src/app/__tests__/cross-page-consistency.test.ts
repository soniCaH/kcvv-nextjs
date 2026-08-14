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

// ---------------------------------------------------------------------------
// Rule 3 (#2601) — no date is parsed in whatever zone the code happens to run in
// ---------------------------------------------------------------------------

/**
 * This is the rule that makes rule 2 load-bearing. Pinning the zone to one
 * constant achieves nothing while half the site's parses never name a zone at
 * all: those take the *runtime's*, which is UTC on Vercel, the visitor's in the
 * browser, and the machine's in CI. On a client component that is a hydration
 * mismatch rather than merely a wrong time, and it shipped as one — a fixture
 * without a kickoff time printed 15:00 on the server and 17:00 in a Belgian
 * browser (#2601).
 *
 * The two banned shapes:
 *
 * - **A parse with no options object.** A `DateTime.from…(value)` call whose
 *   only argument is the value has no `{ zone }`, so it lands in the runtime
 *   zone. The site's two parses — `toDisplayZone` for a stored instant,
 *   `toMatchDisplayZone` for a BFF match date's wall clock — both live in
 *   `dates.ts`, and a caller reaching past them is the drift this catches.
 * - **`DateTime.now()` / `DateTime.local(…)`** unless immediately re-zoned.
 *
 * **A later `.setZone` rescues some of these and not others**, which is why the
 * constructors are split into two lists rather than one.
 *
 * - `fromJSDate` / `fromMillis` / `fromSeconds` take an **instant**. The
 *   parse-time zone cannot change which moment they denote, so
 *   `fromJSDate(d).setZone(z)` really is zone-correct — it is `toDisplayZone`'s
 *   own body. Flagging it would make the rule fail a correct helper, and the
 *   cheap fix for that is deleting the rule.
 * - `fromISO` / `fromSQL` / `fromHTTP` / `fromRFC2822` / `fromFormat` /
 *   `fromObject` take **text or parts**. An offset-less input has already been
 *   read in the runtime zone by the time `setZone` runs, so no later call can
 *   recover it and there is no escape hatch.
 * - `now()` / `local(…)` have no input to misread, so `.setZone` settles them.
 *
 * Deliberately conservative in one known way, stated because a rule whose reach
 * is unstated reads as broader coverage than it has: a single argument
 * containing a **nested call** (`fromISO(build())`) is not matched. A regex that
 * reached through the inner `)` would flag `fromISO(iso.trim(), { zone })` — a
 * false positive on a correctly zoned call, the failure mode that gets a guard
 * deleted.
 *
 * `fromObject` and `fromFormat` get their own arms rather than riding the
 * one-argument pattern, which cannot reach them: a comma inside `{ year, month
 * }` ends the match, and `fromFormat`'s format argument is mandatory — so on
 * the shared pattern the `fromObject` arm fired only for a single-key object
 * and the `fromFormat` arm could never fire at all. `fromObject({…})` is
 * exactly the shape this ticket deleted from `ical.ts`.
 *
 * Zoning is checked by shape, not by which zone is named: `{ zone: "utc" }` is
 * a legitimate answer for stored data, and rule 2 already holds the club zone
 * to one home.
 *
 * **What it cannot see:** a parse that names a zone and names the wrong one.
 * The worst defect #2601 fixed was of that kind — the ICS feed converted a
 * match date it should have read, so it was zoned, pinned, and two hours late.
 * Nor can it see a date read without Luxon at all (`date.getHours()`, which is
 * how `lib/utils/match-time.ts` drifted). Choosing between the two parses stays
 * a reading decision, held by `toMatchDisplayZone`'s docblock and by tests.
 */

/** Instant input — a later `.setZone` is a genuine fix, so it is accepted. */
const UNZONED_INSTANT_PARSE =
  /\bDateTime\.(?:fromJSDate|fromMillis|fromSeconds)\s*\([^,()]*\)(?!\s*\.setZone\s*\()/;

/** Text input — the zone must be named at read time; no escape hatch. */
const UNZONED_TEXT_PARSE =
  /\bDateTime\.(?:fromISO|fromHTTP|fromRFC2822|fromSQL)\s*\([^,()]*\)/;

/** Parts/format input, whose own commas put them out of the patterns above. */
const UNZONED_FROM_OBJECT = /\bDateTime\.fromObject\s*\(\s*\{[^{}]*\}\s*\)/;
const UNZONED_FROM_FORMAT = /\bDateTime\.fromFormat\s*\([^,()]*,[^,()]*\)/;

const UNPINNED_NOW =
  /\bDateTime\.(?:now|local)\s*\([^()]*\)(?!\s*\.setZone\s*\()/;

const RUNTIME_ZONE_PARSES = [
  UNZONED_INSTANT_PARSE,
  UNZONED_TEXT_PARSE,
  UNZONED_FROM_OBJECT,
  UNZONED_FROM_FORMAT,
  UNPINNED_NOW,
];

/** The two parses' home, and the only file allowed to reach for either shape. */
const DATE_PARSE_HOME = "lib/utils/dates.ts";

describe("no date is parsed in the runtime zone (#2601)", () => {
  it.each(productionSources.filter((f) => f !== DATE_PARSE_HOME))(
    "%s — every Luxon parse names a zone",
    (relPath) => {
      const source = code.get(relPath)!;
      for (const pattern of RUNTIME_ZONE_PARSES) {
        expect(pattern.exec(source)?.[0]).toBeUndefined();
      }
    },
  );
});

/**
 * The rule's own coverage, asserted against the shapes it exists to catch and
 * the near-misses it must leave alone. Without this, the regexes above are five
 * claims nothing checks — and two of them silently matched nothing when first
 * written, which reads like coverage while providing none.
 */
describe("rule 3 catches what it claims to (#2601)", () => {
  it.each([
    ["DateTime.fromJSDate(date)", true],
    ["DateTime.fromISO(iso)", true],
    ["DateTime.fromISO(cursor).plus({ months: 1 })", true],
    ["DateTime.now()", true],
    ["DateTime.local(2026, 8, 3)", true],
    ["DateTime.fromObject({ year, month, day: 1 })", true],
    ["DateTime.fromObject({ year: 2026 })", true],
    ['DateTime.fromFormat(psd, "yyyy-MM-dd HH:mm")', true],
    ["DateTime.fromSQL(row.kickoff)", true],
    ["DateTime.fromMillis(ms)", true],
  ])("flags %s", (snippet) => {
    expect(RUNTIME_ZONE_PARSES.some((p) => p.test(snippet))).toBe(true);
  });

  it.each([
    ['DateTime.fromISO(iso, { zone: "utc" })', false],
    ['DateTime.fromISO(iso.trim(), { zone: "utc" })', false],
    ["DateTime.fromJSDate(d, { zone: CLUB_TIMEZONE })", false],
    // Instant input: a later re-zone is a real fix, so it must not be flagged.
    ["DateTime.fromJSDate(d).setZone(CLUB_TIMEZONE)", false],
    ["DateTime.fromMillis(ms).setZone(CLUB_TIMEZONE)", false],
    ["DateTime.now().setZone(CLUB_TIMEZONE)", false],
    ["DateTime.fromObject({ year, month }, { zone: CLUB_TIMEZONE })", false],
    ['DateTime.fromFormat(psd, "yyyy-MM-dd", { zone: CLUB_TIMEZONE })', false],
  ])("leaves %s alone", (snippet) => {
    expect(RUNTIME_ZONE_PARSES.some((p) => p.test(snippet))).toBe(false);
  });
});
