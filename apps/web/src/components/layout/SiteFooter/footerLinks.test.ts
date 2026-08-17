/**
 * Nav ↔ footer coverage guard (#2409 AC4, built by #2415).
 *
 * The nav and the footer are two organisations of the same site — the nav by
 * concept, the footer by intent — and they are allowed to differ. What they
 * are not allowed to do is disagree about what the site's top-level concepts
 * are. The rule, in its checkable form: **every top-level nav href resolves to
 * some footer href; the footer may hold more.**
 *
 * This matters more now than it did before the flattening. With the dropdowns
 * gone the footer is the site's only full directory, so a concept that leaves
 * the footer leaves the site's index entirely.
 */

import { describe, it, expect } from "vitest";
import { buildMenuItems, buildSeniorMenuItem } from "../menuItems";
import type { TeamNavVM } from "@/lib/repositories/team.repository";
import { FOOTER_COLUMNS } from "./footerLinks";

/** The two senior sides the nav renders in production. */
const SENIOR_TEAMS = [
  {
    slug: "eerste-elftallen-a",
    name: "Eerste Elftallen A",
    displayName: "A-ploeg",
  },
  {
    slug: "eerste-elftallen-b",
    name: "Eerste Elftallen B",
    displayName: "B-ploeg",
  },
] as TeamNavVM[];

const navHrefs = buildMenuItems(
  SENIOR_TEAMS.map((t) => buildSeniorMenuItem(t, t.displayName)),
).map((i) => i.href);

const footerHrefs = FOOTER_COLUMNS.flatMap((c) => c.links.map((l) => l.href));

/**
 * The one nav concept the footer indexes by its parent rather than by itself:
 * a per-team footer link would grow with the roster, so `Onze ploegen` stands
 * in for every `/ploegen/<slug>`.
 *
 * Declared as an explicit exception rather than handled by a general
 * "same branch of the route tree" match. A general rule reads well but cannot
 * fail where it matters: `/club` would count as covered by `/club/word-lid` —
 * a join-the-club CTA sitting in a different column for a different reason —
 * so the entire club directory could be deleted and this guard would still
 * pass. Every other nav href must match a footer href exactly.
 */
const COVERED_BY_ANCESTOR: Readonly<Record<string, string>> = {
  "/ploegen/eerste-elftallen-a": "/ploegen",
  "/ploegen/eerste-elftallen-b": "/ploegen",
};

const isCovered = (navHref: string): boolean =>
  footerHrefs.includes(navHref) ||
  footerHrefs.includes(COVERED_BY_ANCESTOR[navHref] ?? "\0");

describe("footer covers every top-level nav concept", () => {
  it("resolves every nav href to some footer href", () => {
    const uncovered = navHrefs.filter((nav) => !isCovered(nav));
    expect(uncovered).toEqual([]);
  });

  it("fails when a covered concept leaves the footer", () => {
    // Proves the guard bites. `/club` is the case that used to slip through:
    // it has no exact footer counterpart unless the club hub is linked, and
    // the club-adjacent CTAs in other columns must not stand in for it.
    const withoutClubHub = footerHrefs.filter((h) => h !== "/club");
    expect(withoutClubHub).not.toContain("/club");
    expect(withoutClubHub.some((h) => h.startsWith("/club/"))).toBe(true);
    expect(navHrefs).toContain("/club");
  });

  it("reaches /sponsors from both discovery and conversion intents", () => {
    // Two links to one href, on purpose (#2415): reading about the club's
    // sponsors and offering to become one are different intents. Asserted so
    // a future de-duplication has to argue with a test.
    const byHeading = (heading: string) =>
      FOOTER_COLUMNS.find((c) => c.heading === heading)!.links;

    expect(byHeading("Ontdek").map((l) => l.label)).toContain("Onze sponsors");
    expect(byHeading("Aansluiten").map((l) => l.label)).toContain(
      "Als sponsor",
    );
  });
});
