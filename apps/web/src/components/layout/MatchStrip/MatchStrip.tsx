import { getFirstTeamStripData } from "@/lib/server/match-data";
import { MatchStripView } from "./MatchStripView";

/**
 * Server component. Fetches the first team's last result and next fixture via
 * the cached `getFirstTeamStripData()` helper. Returns `null` when neither is
 * available, producing zero DOM (the strip slot reserves no space).
 *
 * The strip is rendered by the `(landing)` route group only — detail-page
 * route groups omit the slot entirely. See spec
 * `docs/design/mockups/phase-3-c-header-and-matchstrip/matchstrip-locked.md`.
 */
export async function MatchStrip() {
  const data = await getFirstTeamStripData();
  if (!data) return null;
  return <MatchStripView data={data} />;
}
