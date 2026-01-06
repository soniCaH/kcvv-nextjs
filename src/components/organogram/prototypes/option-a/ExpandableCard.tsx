"use client";

/**
 * ExpandableCard Component (Option A: Card Hierarchy)
 *
 * Single expandable/collapsible card showing a member with their direct reports.
 * Uses ContactCard for display with expand/collapse controls.
 *
 * Features:
 * - Expand/collapse animation (smooth height transition)
 * - Visual hierarchy indicators (indentation, connectors)
 * - Nested children rendering
 * - Click to open details modal
 * - Keyboard accessible (Enter/Space to toggle)
 * - Touch-friendly controls
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "@/lib/icons";
import { ContactCard } from "../shared/ContactCard";
import type { OrgChartNode } from "@/types/organogram";

export interface ExpandableCardProps {
  member: OrgChartNode;
  directReports?: OrgChartNode[];
  depth?: number;
  isExpanded?: boolean;
  onToggle?: (memberId: string, isExpanded: boolean) => void;
  onMemberClick?: (member: OrgChartNode) => void;
  renderChildren?: (
    directReports: OrgChartNode[],
    depth: number,
  ) => React.ReactNode;
  className?: string;
}

/**
 * ExpandableCard - Single card with expand/collapse for hierarchy
 *
 * @param member - The member to display
 * @param directReports - Direct reports of this member
 * @param depth - Nesting depth (0 = root)
 * @param isExpanded - Controlled expanded state
 * @param onToggle - Toggle handler (memberId, newState)
 * @param onMemberClick - Click handler for member card
 * @param renderChildren - Function to render nested direct reports
 * @param className - Additional CSS classes
 */
export function ExpandableCard({
  member,
  directReports = [],
  depth = 0,
  isExpanded = false,
  onToggle,
  onMemberClick,
  renderChildren,
  className = "",
}: ExpandableCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Use controlled or uncontrolled state
  const expanded = onToggle !== undefined ? isExpanded : internalExpanded;
  const hasChildren = directReports.length > 0;

  // Handle toggle
  const handleToggle = () => {
    const newState = !expanded;
    if (onToggle) {
      onToggle(member.id, newState);
    } else {
      setInternalExpanded(newState);
    }
  };

  // Calculate indentation based on depth
  const indentClass =
    {
      0: "ml-0",
      1: "ml-6",
      2: "ml-12",
      3: "ml-18",
      4: "ml-24",
    }[Math.min(depth, 4)] || "ml-24";

  // Background color for depth levels - subtle gradient
  const depthBackground =
    {
      0: "bg-white",
      1: "bg-gray-50/30",
      2: "bg-gray-50/50",
      3: "bg-gray-50/70",
      4: "bg-gray-100/50",
    }[Math.min(depth, 4)] || "bg-gray-100/50";

  return (
    <div className={`${className}`}>
      {/* Card with expand button */}
      <div className={`relative ${indentClass}`}>
        {/* Card container with depth-based background */}
        <div
          className={`flex items-start gap-2 rounded-xl ${depthBackground} p-1`}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={handleToggle}
              className="
                flex-shrink-0 mt-4
                w-8 h-8
                flex items-center justify-center
                bg-white border-2 border-gray-200 rounded-full
                text-kcvv-gray-dark
                hover:bg-kcvv-green hover:border-kcvv-green hover:text-white
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-kcvv-green focus:ring-offset-2
              "
              aria-label={
                expanded
                  ? `Inklappen: ${member.name}`
                  : `Uitklappen: ${member.name}`
              }
              aria-expanded={expanded}
            >
              {expanded ? (
                <ChevronUp size={16} strokeWidth={2.5} />
              ) : (
                <ChevronDown size={16} strokeWidth={2.5} />
              )}
            </button>
          )}

          {/* Spacer if no children */}
          {!hasChildren && <div className="w-8" aria-hidden="true" />}

          {/* Member Card */}
          <div className="flex-1 min-w-0">
            <ContactCard
              member={member}
              variant="detailed"
              showQuickActions={true}
              showDepartment={false}
              showExpandIndicator={hasChildren}
              isExpanded={expanded}
              onClick={onMemberClick}
              testId={`expandable-card-${member.id}`}
            />
          </div>
        </div>
      </div>

      {/* Nested Children (with animation) */}
      {hasChildren && (
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${expanded ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="mt-3 space-y-3">
            {renderChildren
              ? renderChildren(directReports, depth + 1)
              : directReports.map((child) => (
                  <div key={child.id} className="text-sm text-kcvv-gray">
                    {child.name}
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
