/**
 * Nav → index-page reachability guard (#2414).
 *
 * #2409 deletes every nav dropdown on the grounds that each destination page
 * already indexes its own children. That is only safe while the index pages
 * are supersets of the panels they replace. These tests are that guard: if a
 * dropdown link has no counterpart on its index page, deleting the dropdown
 * makes the route unreachable, and this file fails first.
 *
 * Scope: the `De club` panel → `<ClubEditorialHub>`, and `buildJeugdItem`'s
 * children → the `<YouthDirectory>` groups rendered on `/jeugd` + `/ploegen`.
 * The senior panels are anchors into a page that already renders those
 * sections, so they need no index counterpart.
 *
 * KNOWN GAP — `ROSTER` mirrors the teams production actually shows. The nav
 * admits any age code (`isAgeCode`), but only U6–U21 land in a bouw band, so an
 * out-of-band age like `U5` would enter the dropdown and reach no group. The
 * one such document (`KCVVE U5`) carries `showInNavigation: false`, so it is
 * latent rather than live; closing it means changing which teams a group
 * claims, which #2414 deliberately left alone. Tracked as follow-up — add the
 * boundary team to `ROSTER` when that lands and this guard will hold it.
 */

import { describe, it, expect } from "vitest";
import { CLUB_HUB_CARDS } from "@/components/club/ClubEditorialHub/ClubEditorialHub";
import { youthTeam } from "@/components/team/YouthDirectory/youth-directory.fixtures";
import type { TeamNavVM } from "@/lib/repositories/team.repository";
import {
  groupTeamsForLanding,
  RESERVEN_PSD_ID,
  type TeamLandingItem,
} from "@/lib/utils/group-teams";
import {
  buildJeugdItem,
  flattenChildren,
  isUnderJeugd,
  staticMenuItems,
} from "./menuItems";

const clubMenuItem = staticMenuItems.find((i) => i.href === "/club");

/**
 * The production team roster, in both view-model shapes. Mirrors the real
 * Sanity data: youth teams carry a `U<n>` age, Reserven (psdId 34) carries
 * age "A" — it is a senior-level reserve side, not an age group, so nothing
 * that parses ages can place it.
 */
const ROSTER = [
  {
    psdId: "1",
    slug: "eerste-elftallen-a",
    name: "Eerste Elftallen A",
    age: "A",
  },
  {
    psdId: "2",
    slug: "eerste-elftallen-b",
    name: "Eerste Elftallen B",
    age: "A",
  },
  { psdId: RESERVEN_PSD_ID, slug: "reserven", name: "Reserven", age: "A" },
  { psdId: "10", slug: "kcvve-u21", name: "KCVVE U21", age: "U21" },
  { psdId: "11", slug: "kcvve-u15", name: "KCVVE U15", age: "U15" },
  { psdId: "12", slug: "kcvve-u8", name: "KCVVE U8", age: "U8" },
];

const navTeams = ROSTER.map(
  (t) => ({ id: t.psdId, ...t, teamImageUrl: null }) as TeamNavVM,
);

const landingTeams: TeamLandingItem[] = ROSTER.map((t) =>
  youthTeam(t.age, null, { _id: `team-psd-${t.psdId}`, ...t }),
);

/** Every `/ploegen/<slug>` link `<YouthDirectory>` renders for these teams. */
const youthDirectoryHrefs = (teams: TeamLandingItem[]): string[] =>
  groupTeamsForLanding(teams)
    .youthByDivision.flatMap((d) => d.teams)
    .map((t) => `/ploegen/${t.slug}`);

describe("`De club` dropdown → /club index parity", () => {
  it("finds the `De club` menu item", () => {
    expect(clubMenuItem).toBeDefined();
  });

  it("indexes every `De club` dropdown link on the /club hub", () => {
    const hubHrefs = CLUB_HUB_CARDS.map((c) => c.href);
    const dropdownHrefs = flattenChildren(clubMenuItem!).map((c) => c.href);

    expect(dropdownHrefs.length).toBeGreaterThan(0);
    const missing = dropdownHrefs.filter((h) => !hubHrefs.includes(h));
    expect(missing).toEqual([]);
  });
});

describe("`Jeugd` dropdown → /jeugd + /ploegen index parity", () => {
  it("indexes every `Jeugd` dropdown link in a youth-directory group", () => {
    const dropdownHrefs = flattenChildren(
      buildJeugdItem(navTeams.filter(isUnderJeugd)),
    ).map((c) => c.href);
    const indexHrefs = youthDirectoryHrefs(landingTeams);

    expect(dropdownHrefs.length).toBeGreaterThan(0);
    const missing = dropdownHrefs.filter((h) => !indexHrefs.includes(h));
    expect(missing).toEqual([]);
  });

  it("places Reserven in a group of its own rather than dropping it", () => {
    const { youthByDivision } = groupTeamsForLanding(landingTeams);
    const reservenGroup = youthByDivision.find((d) => d.label === "Reserven");

    expect(reservenGroup?.teams.map((t) => t.slug)).toEqual(["reserven"]);
    // Not an age band — the directory heading must not render a range for it.
    expect(reservenGroup?.range).toBeUndefined();
  });

  it("keeps the A and B sides out of the youth directory", () => {
    expect(youthDirectoryHrefs(landingTeams)).not.toContain(
      "/ploegen/eerste-elftallen-a",
    );
    expect(youthDirectoryHrefs(landingTeams)).not.toContain(
      "/ploegen/eerste-elftallen-b",
    );
  });
});
