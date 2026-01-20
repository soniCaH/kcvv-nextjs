/**
 * Shared utilities for player pages
 */

import type { Player, Team } from "@/lib/effect/schemas";

/**
 * Get the player's team title from the resolved team relationship.
 *
 * @param player - Player entity containing relationships
 * @returns The team's title if available, otherwise "KCVV Elewijt"
 */
export function getTeamName(player: Player): string {
  const teamData = player.relationships.field_team?.data;
  if (teamData && "attributes" in teamData) {
    return (teamData as Team).attributes.title;
  }
  return "KCVV Elewijt";
}