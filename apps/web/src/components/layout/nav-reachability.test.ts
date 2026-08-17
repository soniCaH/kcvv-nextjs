/**
 * Nav → index-page reachability guard (#2414, repointed by #2415).
 *
 * #2409 deleted every nav dropdown on the grounds that each destination page
 * already indexes its own children. That is only safe while the index pages
 * stay supersets of the panels they replaced — and now that the panels are
 * gone, nothing in the source states what they used to hold. So the former
 * panel contents live here, frozen, and these tests assert the index pages
 * still cover them.
 *
 * Read the frozen list as "routes that had a nav link before #2415". If a
 * route drops off its index page, it becomes unreachable from the chrome
 * entirely, and this file fails first.
 *
 * Scope: the `De club` panel → `<ClubEditorialHub>`, and the `Jeugd` panel →
 * the `<YouthDirectory>` groups rendered on `/jeugd` + `/ploegen`. The senior
 * panels were anchors into a page that already renders those sections, so they
 * need no index counterpart.
 *
 * KNOWN GAP — `ROSTER` mirrors the teams production actually shows. The nav
 * admits any age code (`isAgeCode`), but only U6–U21 land in a bouw band, so an
 * out-of-band age like `U5` would have entered the dropdown and reached no
 * group. The one such document (`KCVVE U5`) carries `showInNavigation: false`,
 * so it is latent rather than live; closing it means changing which teams a
 * group claims, which #2414 deliberately left alone. Tracked as follow-up —
 * add the boundary team to `ROSTER` when that lands and this guard will hold
 * it.
 *
 * #2641 raised the stakes on that gap without changing it: `/ploegen` now
 * heads the directory `Alle andere ploegen`, so an un-hidden out-of-band team
 * (`KCVVE U5`, or a senior side whose name ends in neither A nor B — production
 * holds `FC WEITSE GANS`) would be omitted from a section claiming to hold
 * every team the flagships leave out. Both carry `showInNavigation: false`
 * today, so the claim holds; it is the un-hiding that would break it.
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
import { buildMenuItems, isUnderJeugd } from "./menuItems";

/**
 * The `De club` dropdown as it stood at `main@00570d8f`, the commit before
 * #2415 deleted it. Frozen deliberately: this is a historical record of what
 * the chrome used to reach, not a live structure to be kept in sync with
 * anything. Only ever shrink it if a route is genuinely retired.
 */
const FORMER_DE_CLUB_PANEL = [
  "/club/geschiedenis",
  "/hulp#structuur",
  "/club/bestuur",
  "/club/jeugdbestuur",
  "/club/angels",
  "/club/ultras",
  "/club/praktische-informatie",
  "/club/vrijwilliger",
  "/club/cashless",
  "/club/contact",
  "/club/downloads",
] as const;

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

describe("former `De club` panel → /club index parity", () => {
  it("still has a top-level `De club` entry pointing at the hub", () => {
    const clubMenuItem = buildMenuItems([]).find((i) => i.href === "/club");
    expect(clubMenuItem?.label).toBe("De club");
  });

  it("indexes every former `De club` panel link on the /club hub", () => {
    const hubHrefs = CLUB_HUB_CARDS.map((c) => c.href);

    const missing = FORMER_DE_CLUB_PANEL.filter((h) => !hubHrefs.includes(h));
    expect(missing).toEqual([]);
  });
});

describe("former `Jeugd` panel → /jeugd + /ploegen index parity", () => {
  it("indexes every team that had a `Jeugd` panel link in a directory group", () => {
    // The panel listed exactly the teams `isUnderJeugd` selects, so the guard
    // stays data-driven: it grows with the roster rather than with a literal.
    const formerPanelHrefs = navTeams
      .filter(isUnderJeugd)
      .map((t) => `/ploegen/${t.slug}`);
    const indexHrefs = youthDirectoryHrefs(landingTeams);

    expect(formerPanelHrefs.length).toBeGreaterThan(0);
    const missing = formerPanelHrefs.filter((h) => !indexHrefs.includes(h));
    expect(missing).toEqual([]);
  });

  it("places Reserven in a group of its own rather than dropping it", () => {
    const { youthByDivision } = groupTeamsForLanding(landingTeams);
    const reservenGroup = youthByDivision.find((d) => d.label === "Reserven");

    expect(reservenGroup?.teams.map((t) => t.slug)).toEqual(["reserven"]);
    // Its own group is only half the answer: leading a list of youth groups
    // with a bare label read as the first of them. The range says where the
    // side actually sits — a boundary, not an age band (#2641).
    expect(reservenGroup?.range).toBe("Voorbij U21");
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
