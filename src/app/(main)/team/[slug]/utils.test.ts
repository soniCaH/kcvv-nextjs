/**
 * Tests for team detail utility functions
 */

import { describe, it, expect } from "vitest";
import type { Player, Team } from "@/lib/effect/schemas";
import {
  parseAgeGroup,
  transformPlayerToRoster,
  transformStaffToMember,
  getTeamType,
  getTeamTagline,
} from "./utils";

// Mock team factory
function createMockTeam(
  overrides: {
    title?: string;
    pathAlias?: string;
    field_division_full?: string | null;
    field_tagline?: string | null;
    field_division?: string | null;
  } = {},
): Team {
  return {
    id: "test-team-id",
    type: "node--team",
    attributes: {
      drupal_internal__nid: 1,
      drupal_internal__vid: 1,
      langcode: "nl",
      status: true,
      title: overrides.title ?? "Test Team",
      created: new Date("2024-01-01"),
      changed: new Date("2024-01-01"),
      path: {
        alias: overrides.pathAlias ?? "/team/test-team",
        langcode: "nl",
      },
      field_division_full: overrides.field_division_full,
      field_tagline: overrides.field_tagline,
      field_division: overrides.field_division,
    },
    relationships: {},
  } as Team;
}

// Mock player factory
function createMockPlayer(
  overrides: {
    id?: string;
    field_firstname?: string | null;
    field_lastname?: string | null;
    field_position?: string | null;
    field_position_short?: string | null;
    field_shirtnumber?: number | null;
    pathAlias?: string | null;
    imageUrl?: string;
  } = {},
): Player {
  const hasImage = !!overrides.imageUrl;
  const firstName =
    overrides.field_firstname !== undefined
      ? overrides.field_firstname
      : "Test";
  const lastName =
    overrides.field_lastname !== undefined
      ? overrides.field_lastname
      : "Player";
  const pathAlias =
    overrides.pathAlias !== undefined
      ? overrides.pathAlias
      : "/player/test-player";

  return {
    id: overrides.id ?? "test-player-id",
    type: "node--player",
    attributes: {
      drupal_internal__nid: 1,
      drupal_internal__vid: 1,
      langcode: "nl",
      status: true,
      title: `${firstName || ""} ${lastName || ""}`.trim() || "Unknown Player",
      created: new Date("2024-01-01"),
      changed: new Date("2024-01-01"),
      path: pathAlias
        ? {
            alias: pathAlias,
            langcode: "nl",
          }
        : undefined,
      field_firstname: firstName,
      field_lastname: lastName,
      field_position:
        overrides.field_position !== undefined ? overrides.field_position : "m",
      field_position_short: overrides.field_position_short,
      field_shirtnumber:
        overrides.field_shirtnumber !== undefined
          ? overrides.field_shirtnumber
          : 10,
    },
    relationships: {
      field_image: hasImage
        ? {
            data: {
              uri: { url: overrides.imageUrl! },
              alt: "Player image",
            },
          }
        : undefined,
    },
  } as unknown as Player;
}

describe("parseAgeGroup", () => {
  it("extracts age group from team title", () => {
    const team = createMockTeam({ title: "U15A" });
    expect(parseAgeGroup(team)).toBe("U15");
  });

  it("extracts age group from title with additional text", () => {
    const team = createMockTeam({ title: "KCVV Elewijt U21" });
    expect(parseAgeGroup(team)).toBe("U21");
  });

  it("extracts age group from title with single digit", () => {
    const team = createMockTeam({ title: "U6 Kleuters" });
    expect(parseAgeGroup(team)).toBe("U6");
  });

  it("returns undefined when no age group found", () => {
    const team = createMockTeam({ title: "Eerste Ploeg" });
    expect(parseAgeGroup(team)).toBeUndefined();
  });

  it("extracts age group from path alias as fallback", () => {
    const team = createMockTeam({
      title: "Kadetten A",
      pathAlias: "/team/u14a",
    });
    expect(parseAgeGroup(team)).toBe("U14");
  });

  it("is case-insensitive", () => {
    const team = createMockTeam({ title: "u17 scholieren" });
    expect(parseAgeGroup(team)).toBe("U17");
  });
});

describe("transformPlayerToRoster", () => {
  it("transforms basic player data", () => {
    const player = createMockPlayer({
      field_firstname: "Kevin",
      field_lastname: "De Bruyne",
      field_position: "m",
      field_shirtnumber: 7,
      pathAlias: "/player/kevin-de-bruyne",
    });

    const result = transformPlayerToRoster(player);

    expect(result).toEqual({
      id: "test-player-id",
      firstName: "Kevin",
      lastName: "De Bruyne",
      position: "Middenvelder",
      number: 7,
      imageUrl: undefined,
      href: "/players/kevin-de-bruyne",
    });
  });

  it("normalizes position codes to Dutch names", () => {
    const positions = [
      { code: "k", expected: "Keeper" },
      { code: "d", expected: "Verdediger" },
      { code: "m", expected: "Middenvelder" },
      { code: "a", expected: "Aanvaller" },
      { code: "j", expected: "Speler" },
    ];

    for (const { code, expected } of positions) {
      const player = createMockPlayer({ field_position: code });
      const result = transformPlayerToRoster(player);
      expect(result.position).toBe(expected);
    }
  });

  it("handles missing optional fields", () => {
    const player = createMockPlayer({
      field_firstname: "",
      field_lastname: "",
      field_position: null,
      field_shirtnumber: null,
    });

    const result = transformPlayerToRoster(player);

    expect(result.firstName).toBe("");
    expect(result.lastName).toBe("");
    expect(result.position).toBe("Speler");
    expect(result.number).toBeUndefined();
  });

  it("includes image URL when available", () => {
    const player = createMockPlayer({
      imageUrl: "https://example.com/player.jpg",
    });

    const result = transformPlayerToRoster(player);
    expect(result.imageUrl).toBe("https://example.com/player.jpg");
  });

  it("uses player ID as fallback for href when no slug", () => {
    const player = createMockPlayer({
      id: "abc-123-uuid",
      pathAlias: null, // No path alias set
    });

    const result = transformPlayerToRoster(player);
    expect(result.href).toBe("/players/abc-123-uuid");
  });
});

describe("transformStaffToMember", () => {
  it("transforms staff member data", () => {
    const staff = createMockPlayer({
      field_firstname: "Jan",
      field_lastname: "Janssen",
      field_position_short: "T1",
    });

    const result = transformStaffToMember(staff);

    expect(result).toEqual({
      id: "test-player-id",
      firstName: "Jan",
      lastName: "Janssen",
      role: "Hoofdtrainer",
      roleCode: "T1",
      imageUrl: undefined,
    });
  });

  it("maps role codes to full role names", () => {
    const roleMappings = [
      { code: "T1", expected: "Hoofdtrainer" },
      { code: "T2", expected: "Assistent-trainer" },
      { code: "TK", expected: "Keeperstrainer" },
      { code: "TVJO", expected: "Technisch Verantwoordelijke Jeugdopleiding" },
      { code: "PDG", expected: "Ploegdelegatie" },
      { code: "AF", expected: "Afgevaardigde" },
      { code: "CO", expected: "Coach" },
    ];

    for (const { code, expected } of roleMappings) {
      const staff = createMockPlayer({ field_position_short: code });
      const result = transformStaffToMember(staff);
      expect(result.role).toBe(expected);
    }
  });

  it("uses role code as fallback for unknown codes", () => {
    const staff = createMockPlayer({ field_position_short: "UNKNOWN" });
    const result = transformStaffToMember(staff);
    expect(result.role).toBe("UNKNOWN");
    expect(result.roleCode).toBe("UNKNOWN");
  });

  it("uses 'Staff' as default when no role code", () => {
    const staff = createMockPlayer({ field_position_short: null });
    const result = transformStaffToMember(staff);
    expect(result.role).toBe("Staff");
    expect(result.roleCode).toBeUndefined();
  });
});

describe("getTeamType", () => {
  it("returns 'youth' for teams with age group", () => {
    const team = createMockTeam({ title: "U15A" });
    expect(getTeamType(team)).toBe("youth");
  });

  it("returns 'senior' for teams without age group", () => {
    const team = createMockTeam({ title: "Eerste Ploeg" });
    expect(getTeamType(team)).toBe("senior");
  });

  it("returns 'senior' for teams with 'a-ploeg' in title", () => {
    const team = createMockTeam({ title: "A-Ploeg" });
    expect(getTeamType(team)).toBe("senior");
  });
});

describe("getTeamTagline", () => {
  it("returns field_tagline when available", () => {
    const team = createMockTeam({ field_tagline: "De beste ploeg!" });
    expect(getTeamTagline(team)).toBe("De beste ploeg!");
  });

  it("returns field_division_full as fallback", () => {
    const team = createMockTeam({
      field_tagline: null,
      field_division_full: "GEWESTELIJKE U15 K",
    });
    expect(getTeamTagline(team)).toBe("GEWESTELIJKE U15 K");
  });

  it("returns field_division as last fallback", () => {
    const team = createMockTeam({
      field_tagline: null,
      field_division_full: null,
      field_division: "3de Provinciale",
    });
    expect(getTeamTagline(team)).toBe("3de Provinciale");
  });

  it("returns undefined when no tagline fields are set", () => {
    const team = createMockTeam({
      field_tagline: null,
      field_division_full: null,
      field_division: null,
    });
    expect(getTeamTagline(team)).toBeUndefined();
  });
});
