"use client";

/**
 * MemberCard Component (Option B: Tabbed Grid)
 *
 * Grid-optimized member card using ContactCard with grid variant.
 * Simplified wrapper for use in responsive grid layouts.
 *
 * Features:
 * - Always uses 'grid' variant of ContactCard
 * - Click handler to open details modal
 * - Optimized for responsive grid display
 */

import { ContactCard } from "../shared/ContactCard";
import type { OrgChartNode } from "@/types/organogram";

export interface MemberCardProps {
  member: OrgChartNode;
  onClick?: (member: OrgChartNode) => void;
  showQuickActions?: boolean;
  className?: string;
}

/**
 * MemberCard - Grid-optimized member display
 *
 * @param member - The member to display
 * @param onClick - Click handler for opening details
 * @param showQuickActions - Show inline contact actions
 * @param className - Additional CSS classes
 */
export function MemberCard({
  member,
  onClick,
  showQuickActions = true,
  className = "",
}: MemberCardProps) {
  return (
    <ContactCard
      member={member}
      variant="grid"
      showQuickActions={showQuickActions}
      showDepartment={false}
      onClick={onClick}
      className={className}
      testId={`member-card-${member.id}`}
    />
  );
}
