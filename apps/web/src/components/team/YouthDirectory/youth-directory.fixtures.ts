import {
  RESERVEN_LABEL,
  RESERVEN_PSD_ID,
  type TeamLandingItem,
} from "@/lib/utils/group-teams";

/**
 * Build a youth `TeamLandingItem` from an age code (e.g. "U13"). Pass a
 * `teamImageUrl` to exercise the squad-photo polaroid; omit it for the
 * `<JerseyShirt>` no-photo fallback. Shared by `<YouthDirectory>`'s stories
 * and unit tests so the fixture shape stays in one place.
 */
export function youthTeam(
  age: string,
  teamImageUrl: string | null = null,
  overrides: Partial<TeamLandingItem> = {},
): TeamLandingItem {
  return {
    _id: `t-${age}`,
    name: `KCVV Elewijt ${age}`,
    slug: `kcvv-elewijt-${age.toLowerCase()}`,
    age,
    psdId: null,
    division: null,
    divisionFull: null,
    season: "25/26",
    tagline: null,
    teamImageUrl,
    staff: null,
    ...overrides,
  };
}

/**
 * The reserves — age "A" rather than an age code, so the card captions by name
 * over an initialled jersey and its group heading carries no range (#2414).
 */
export const reservenTeam = (): TeamLandingItem =>
  youthTeam("A", null, {
    _id: "t-reserven",
    name: RESERVEN_LABEL,
    slug: "reserven",
    psdId: RESERVEN_PSD_ID,
  });
