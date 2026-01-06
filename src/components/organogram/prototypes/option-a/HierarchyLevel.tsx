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

export interface HierarchyLevelProps {
  members: OrgChartNode[];
  allMembers: OrgChartNode[];
  depth?: number;
  maxDepth?: number;
  expandedIds?: Set<string>;
  onToggle?: (memberId: string, isExpanded: boolean) => void;
  onMemberClick?: (member: OrgChartNode) => void;
  className?: string;
}

/**
 * HierarchyLevel - Recursive hierarchy renderer
 *
 * @param members - Members to render at this level
 * @param allMembers - All members (for finding children)
 * @param depth - Current nesting depth
 * @param maxDepth - Maximum depth to render
 * @param expandedIds - Set of expanded member IDs (controlled)
 * @param onToggle - Toggle handler
 * @param onMemberClick - Member click handler
 * @param className - Additional CSS classes
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
          />
        );
      })}
    </div>
  );
}
