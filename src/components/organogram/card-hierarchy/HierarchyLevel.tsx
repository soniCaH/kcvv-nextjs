"use client";

/**
 * HierarchyLevel Component (Option A: Card Hierarchy)
 *
 * Recursive component for rendering hierarchical levels of organization members.
 * Each level contains ExpandableCards that can reveal their children.
 *
 * Features:
 * - Recursive rendering of organizational hierarchy
 * - Maintains parent-child relationships
 * - Supports controlled or uncontrolled expansion
 * - Depth limiting for performance
 * - Visual hierarchy with indentation
 */

import { ExpandableCard } from "./ExpandableCard";
import type { OrgChartNode } from "@/types/organogram";
import type { ResponsibilityPath } from "@/types/responsibility";

export interface HierarchyLevelProps {
  members: OrgChartNode[];
  allMembers: OrgChartNode[];
  depth?: number;
  maxDepth?: number;
  expandedIds?: Set<string>;
  onToggle?: (memberId: string, isExpanded: boolean) => void;
  onMemberClick?: (member: OrgChartNode) => void;
  className?: string;
  responsibilityPaths?: ResponsibilityPath[];
}

/**
 * Renders a nested hierarchy of organization members as expandable cards.
 *
 * Renders each member at the current level as an ExpandableCard and recursively renders their direct reports until the specified `maxDepth` is reached.
 *
 * @param members - OrgChartNode items to render at this level
 * @param allMembers - Complete list of OrgChartNode used to determine direct reports
 * @param depth - Current nesting depth (defaults to 0)
 * @param maxDepth - Maximum depth to render; recursion stops when `depth` is greater than or equal to this value
 * @param expandedIds - Optional set of member IDs that should be rendered expanded (controlled expansion)
 * @param onToggle - Optional callback invoked with `(memberId, isExpanded)` when a member's expansion state toggles
 * @param onMemberClick - Optional callback invoked with the member when a member card is clicked
 * @param className - Optional additional CSS class names applied to the container
 * @param responsibilityPaths - Optional responsibility path data passed through to child components
 * @returns A React element containing the rendered hierarchy, or `null` when `depth` is at or beyond `maxDepth`
 */
export function HierarchyLevel({
  members,
  allMembers,
  depth = 0,
  maxDepth = 10,
  expandedIds,
  onToggle,
  onMemberClick,
  className = "",
  responsibilityPaths = [],
}: HierarchyLevelProps) {
  // Stop recursion at max depth
  if (depth >= maxDepth) {
    return null;
  }

  // Get children for a specific member
  const getChildren = (parentId: string): OrgChartNode[] => {
    return allMembers.filter((member) => member.parentId === parentId);
  };

  // Render direct reports recursively
  const renderDirectReports = (
    directReports: OrgChartNode[],
    childDepth: number,
  ) => {
    return (
      <HierarchyLevel
        members={directReports}
        allMembers={allMembers}
        depth={childDepth}
        maxDepth={maxDepth}
        expandedIds={expandedIds}
        onToggle={onToggle}
        onMemberClick={onMemberClick}
        responsibilityPaths={responsibilityPaths}
      />
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {members.map((member) => {
        const directReports = getChildren(member.id);
        const isExpanded = expandedIds ? expandedIds.has(member.id) : false;

        return (
          <ExpandableCard
            key={member.id}
            member={member}
            directReports={directReports}
            depth={depth}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onMemberClick={onMemberClick}
            renderChildren={renderDirectReports}
            responsibilityPaths={responsibilityPaths}
          />
        );
      })}
    </div>
  );
}