/**
 * Shared utilities for team detail pages
 */

import type { Player, Team } from "@/lib/effect/schemas";
import type { RosterPlayer, StaffMember } from "@/components/team/TeamRoster";

/**
 * Position mapping from Drupal codes to Dutch display names
 * Maps the short position codes (k, d, m, a, j) to full names
 */
const POSITION_MAP: Record<string, string> = {
  k: "Keeper",
  d: "Verdediger",
  m: "Middenvelder",
  a: "Aanvaller",
  j: "Speler", // Generic player (youth teams)
};

/**
 * Parse age group from team title or path
 *
 * Extracts age group identifier (e.g., U15, U21) from team name.
 *
 * @param team - Team entity
 * @returns Age group string if found (e.g., "U15", "U21"), undefined otherwise
 */
export function parseAgeGroup(team: Team): string | undefined {
  const title = team.attributes.title;

  // Match patterns like "U15", "U21", "U6", "U15A", etc.
  // \b at start for word boundary, then U followed by 1-2 digits
  // No trailing \b to allow "U15A" style patterns
  const match = title.match(/\bU(\d{1,2})/i);
  if (match) {
    return `U${match[1]}`;
  }

  // Also check path alias
  const alias = team.attributes.path?.alias || "";
  const pathMatch = alias.match(/\/u(\d{1,2})/i);
  if (pathMatch) {
    return `U${pathMatch[1]}`;
  }

  return undefined;
}

/**
 * Extract player image URL from resolved relationships
 *
 * @param player - Player entity with resolved image relationship
 * @returns Absolute image URL if available, undefined otherwise
 */
function getPlayerImageUrl(player: Player): string | undefined {
  const imageData = player.relationships.field_image?.data;
  if (imageData && "uri" in imageData) {
    return imageData.uri.url;
  }
  return undefined;
}

/**
 * Normalize position code to display name
 *
 * @param position - Drupal position code (k, d, m, a, j) or full name
 * @returns Normalized Dutch position name
 */
function normalizePosition(position: string | null | undefined): string {
  if (!position) return "Speler";

  // If it's already a full name, return as-is
  const knownPositions = Object.values(POSITION_MAP);
  if (knownPositions.includes(position)) {
    return position;
  }

  // Map short code to full name
  const normalized = POSITION_MAP[position.toLowerCase()];
  return normalized || position;
}

/**
 * Transform Drupal Player entity to RosterPlayer for TeamRoster component
 *
 * @param player - Player entity from Drupal
 * @returns RosterPlayer object for display
 */
export function transformPlayerToRoster(player: Player): RosterPlayer {
  const firstName = player.attributes.field_firstname || "";
  const lastName = player.attributes.field_lastname || "";
  const position = normalizePosition(player.attributes.field_position);
  const number = player.attributes.field_shirtnumber ?? undefined;
  const imageUrl = getPlayerImageUrl(player);
  const slug = player.attributes.path?.alias?.replace("/player/", "") || "";

  return {
    id: player.id,
    firstName,
    lastName,
    position,
    number,
    imageUrl,
    // href is required - use player ID as fallback if no slug
    href: slug ? `/players/${slug}` : `/players/${player.id}`,
  };
}

/**
 * Transform Drupal Player entity (with staff role) to StaffMember for TeamRoster component
 *
 * Staff members are stored as Player entities in Drupal but with field_position_short
 * containing their role code (T1, T2, TK, etc.)
 *
 * @param player - Player entity acting as staff member
 * @returns StaffMember object for display
 */
export function transformStaffToMember(player: Player): StaffMember {
  const firstName = player.attributes.field_firstname || "";
  const lastName = player.attributes.field_lastname || "";
  const roleCode = player.attributes.field_position_short || undefined;
  const imageUrl = getPlayerImageUrl(player);

  // Map role codes to full role names
  const roleMap: Record<string, string> = {
    T1: "Hoofdtrainer",
    T2: "Assistent-trainer",
    TK: "Keeperstrainer",
    TVJO: "Technisch Verantwoordelijke Jeugdopleiding",
    PDG: "Ploegdelegatie",
    AF: "Afgevaardigde",
    CO: "Coach",
  };

  const role = roleCode ? roleMap[roleCode] || roleCode : "Staff";

  return {
    id: player.id,
    firstName,
    lastName,
    role,
    roleCode,
    imageUrl,
  };
}

/**
 * Determine team type from team data
 *
 * @param team - Team entity
 * @returns "youth" for youth teams (with age group), "senior" otherwise
 */
export function getTeamType(team: Team): "youth" | "senior" {
  const ageGroup = parseAgeGroup(team);
  if (ageGroup) return "youth";

  // Check title for common senior team patterns
  const title = team.attributes.title.toLowerCase();
  if (
    title.includes("eerste ploeg") ||
    title.includes("1e ploeg") ||
    title.includes("a-ploeg")
  ) {
    return "senior";
  }

  return "senior";
}

/**
 * Get team tagline, falling back to division info
 *
 * @param team - Team entity
 * @returns Tagline or division name if available
 */
export function getTeamTagline(team: Team): string | undefined {
  if (team.attributes.field_tagline) {
    return team.attributes.field_tagline;
  }
  if (team.attributes.field_division_full) {
    return team.attributes.field_division_full;
  }
  if (team.attributes.field_division) {
    return team.attributes.field_division;
  }
  return undefined;
}
