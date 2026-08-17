import {
  RESERVEN_LABEL,
  RESERVEN_PSD_ID,
  type TeamLandingItem,
} from "@/lib/utils/group-teams";
import { teamDisplayName } from "@/lib/utils/team-display-name";

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
  const team = {
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
  // Resolved *after* the overrides, the way the repository resolves it (#2630),
  // so a fixture cannot caption a card with a string the real mapper would
  // never produce — and an override of `slug`/`name` moves the caption with it.
  return {
    ...team,
    displayName: overrides.displayName ?? teamDisplayName(team),
  };
}

/**
 * The reserves — age "A" rather than an age code, so its slug resolves to the
 * plain name over an initialled jersey and its group heading carries no range
 * (#2414).
 */
export const reservenTeam = (): TeamLandingItem =>
  youthTeam("A", null, {
    _id: "t-reserven",
    name: RESERVEN_LABEL,
    slug: "reserven",
    psdId: RESERVEN_PSD_ID,
  });
