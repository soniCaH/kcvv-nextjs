/**
 * Shared utilities for player pages
 */

import type { Player, Team } from "@/lib/effect/schemas";

/**
 * Extract team name from player's resolved team relationship.
 * Returns "KCVV Elewijt" as fallback if team data is not available or not resolved.
 *
 * @param player - The player entity with relationships
 * @returns The team name string
 */
export function getTeamName(player: Player): string {
  const teamData = player.relationships.field_team?.data;
  if (teamData && "attributes" in teamData) {
    return (teamData as Team).attributes.title;
  }
  return "KCVV Elewijt";
}
