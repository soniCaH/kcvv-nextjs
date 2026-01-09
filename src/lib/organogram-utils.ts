/**
 * Organogram Utility Functions
 *
 * Helper functions for working with organogram data:
 * - Finding members by ID
 * - Building member hierarchies
 * - URL parameter handling
 */

import type { OrgChartNode } from "@/types/organogram";

/**
 * Find a member in the organogram by their ID
 *
 * @param members - Array of all members
 * @param memberId - The unique member ID to search for
 * @returns The member if found, undefined otherwise
 *
 * @example
 * ```ts
 * const president = findMemberById(clubStructure, 'president');
 * if (president) {
 *   console.log(president.name); // "[Naam Voorzitter]"
 * }
 * ```
 */
export function findMemberById(
  members: OrgChartNode[],
  memberId: string | undefined | null,
): OrgChartNode | undefined {
  if (!memberId) return undefined;
  return members.find((member) => member.id === memberId);
}

/**
 * Find all direct children of a member
 *
 * @param members - Array of all members
 * @param parentId - The parent member ID
 * @returns Array of direct children
 *
 * @example
 * ```ts
 * const directReports = findDirectChildren(clubStructure, 'president');
 * console.log(directReports.length); // Number of people reporting to president
 * ```
 */
export function findDirectChildren(
  members: OrgChartNode[],
  parentId: string | undefined | null,
): OrgChartNode[] {
  if (!parentId) return [];
  return members.filter((member) => member.parentId === parentId);
}

/**
 * Find the parent/supervisor of a member
 *
 * @param members - Array of all members
 * @param memberId - The member ID whose parent to find
 * @returns The parent member if found, undefined otherwise
 *
 * @example
 * ```ts
 * const member = findMemberById(clubStructure, 'secretary');
 * const supervisor = findParent(clubStructure, member?.id);
 * console.log(supervisor?.id); // 'president'
 * ```
 */
export function findParent(
  members: OrgChartNode[],
  memberId: string | undefined | null,
): OrgChartNode | undefined {
  if (!memberId) return undefined;

  const member = findMemberById(members, memberId);
  if (!member?.parentId) return undefined;

  return findMemberById(members, member.parentId);
}

/**
 * Get all ancestors (parent chain) of a member
 *
 * @param members - Array of all members
 * @param memberId - The member ID to start from
 * @returns Array of ancestors from immediate parent to root
 *
 * @example
 * ```ts
 * const ancestors = getAncestors(clubStructure, 'jeugdcoordinator');
 * // Returns [president, club] or similar chain
 * ```
 */
export function getAncestors(
  members: OrgChartNode[],
  memberId: string | undefined | null,
): OrgChartNode[] {
  if (!memberId) return [];

  const ancestors: OrgChartNode[] = [];
  let current = findMemberById(members, memberId);

  while (current?.parentId) {
    const parent = findMemberById(members, current.parentId);
    if (!parent) break;
    ancestors.push(parent);
    current = parent;
  }

  return ancestors;
}

/**
 * Build URL with member and view parameters
 *
 * @param basePath - Base path (e.g., '/club/organogram')
 * @param options - URL parameters
 * @returns Complete URL with query parameters
 *
 * @example
 * ```ts
 * const url = buildOrganogramUrl('/club/organogram', {
 *   memberId: 'president',
 *   view: 'chart'
 * });
 * // Returns: '/club/organogram?member=president&view=chart'
 * ```
 */
export function buildOrganogramUrl(
  basePath: string,
  options: {
    memberId?: string | null;
    view?: string | null;
  } = {},
): string {
  const params = new URLSearchParams();

  if (options.memberId) {
    params.set("member", options.memberId);
  }

  if (options.view) {
    params.set("view", options.view);
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Parse URL parameters for organogram
 *
 * @param searchParams - URLSearchParams or search string
 * @returns Parsed parameters
 *
 * @example
 * ```ts
 * const params = parseOrganogramParams('?member=president&view=chart');
 * console.log(params.memberId); // 'president'
 * console.log(params.view); // 'chart'
 * ```
 */
export function parseOrganogramParams(
  searchParams: URLSearchParams | string,
): {
  memberId: string | null;
  view: string | null;
} {
  const params =
    typeof searchParams === "string"
      ? new URLSearchParams(searchParams)
      : searchParams;

  return {
    memberId: params.get("member"),
    view: params.get("view"),
  };
}
