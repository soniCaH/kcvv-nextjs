import { describe, it, expect } from "vitest";
import {
  buildMenuItems,
  buildSeniorMenuItem,
  isMenuItemActive,
} from "./menuItems";
import type { MenuItem } from "./menuItems";
import type { TeamNavVM } from "@/lib/repositories/team.repository";

describe("buildMenuItems", () => {
  it("contains neither Zoeken nor Home — both live outside the nav list", () => {
    const nav = buildMenuItems([]);
    expect(nav.map((i) => i.label)).not.toContain("Zoeken");
    expect(nav.map((i) => i.href)).not.toContain("/");
  });

  it("labels the calendar route Wedstrijden", () => {
    const kalender = buildMenuItems([]).find((i) => i.href === "/kalender");
    expect(kalender?.label).toBe("Wedstrijden");
  });

  const seniorItems: MenuItem[] = [
    { label: "A-ploeg", href: "/ploegen/a-ploeg" },
    { label: "B-ploeg", href: "/ploegen/b-ploeg" },
  ];

  it("renders the decided 9-item order", () => {
    expect(buildMenuItems(seniorItems).map((i) => i.label)).toEqual([
      "Nieuws",
      "Wedstrijden",
      "Evenementen",
      "A-ploeg",
      "B-ploeg",
      "Jeugd",
      "Sponsors",
      "Hulp",
      "De club",
    ]);
  });

  it("works with no senior items", () => {
    expect(buildMenuItems([]).map((i) => i.label)).toEqual([
      "Nieuws",
      "Wedstrijden",
      "Evenementen",
      "Jeugd",
      "Sponsors",
      "Hulp",
      "De club",
    ]);
  });

  it("filters out null entries from seniorItems", () => {
    const withNull: (MenuItem | null)[] = [
      { label: "A", href: "/a" },
      null,
      { label: "B", href: "/b" },
    ];
    const labels = buildMenuItems(withNull).map((i) => i.label);

    expect(labels).toContain("A");
    expect(labels).toContain("B");
  });

  it("emits leaf items only — nothing carries children", () => {
    for (const item of buildMenuItems(seniorItems)) {
      expect(Object.keys(item).sort()).toEqual(["href", "label"]);
    }
  });
});

describe("buildSeniorMenuItem", () => {
  const team = { slug: "a-ploeg", name: "KCVV Elewijt A" } as TeamNavVM;

  it("returns null when the team has no slug", () => {
    expect(buildSeniorMenuItem(undefined, "A-ploeg")).toBeNull();
    expect(
      buildSeniorMenuItem({ slug: "", name: "x" } as TeamNavVM, "A-ploeg"),
    ).toBeNull();
  });

  it("returns a plain link to the team page", () => {
    expect(buildSeniorMenuItem(team, "A-ploeg")).toEqual({
      label: "A-ploeg",
      href: "/ploegen/a-ploeg",
    });
  });
});

// The label the nav renders is no longer derived here: `<SiteHeader>` reads the
// team's resolved `displayName` (#2630), so the letter → `X-ploeg` rule lives in
// exactly one place — `src/lib/utils/team-display-name.ts`, tested there.

describe("isMenuItemActive", () => {
  it("marks an item active on its own page", () => {
    expect(isMenuItemActive("/ploegen/a-ploeg", "/ploegen/a-ploeg")).toBe(true);
  });

  it("marks home active only on exact /", () => {
    expect(isMenuItemActive("/", "/")).toBe(true);
    expect(isMenuItemActive("/", "/nieuws")).toBe(false);
  });

  it("marks child paths active", () => {
    expect(isMenuItemActive("/club", "/club/geschiedenis")).toBe(true);
  });

  it("does not match a sibling route sharing a prefix", () => {
    expect(isMenuItemActive("/club", "/clubhuis")).toBe(false);
  });
});
