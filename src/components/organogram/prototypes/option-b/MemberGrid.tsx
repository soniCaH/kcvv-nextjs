"use client";

/**
 * MemberGrid Component (Option B: Tabbed Grid)
 *
 * Responsive grid container for displaying members.
 * Adapts columns based on viewport size.
 *
 * Responsive Grid:
 * - Mobile (< 640px): 1 column
 * - Tablet (640-1024px): 2 columns
 * - Desktop (1024px+): 3-4 columns
 *
 * Features:
 * - Auto-fit responsive columns
 * - Loading state with skeleton cards
 * - Empty state messaging
 * - Smooth transitions
 */

import { MemberCard } from "./MemberCard";
import type { OrgChartNode } from "@/types/organogram";

export interface MemberGridProps {
  members: OrgChartNode[];
  onMemberClick?: (member: OrgChartNode) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * MemberGrid - Responsive grid layout for member cards
 *
 * @param members - Array of members to display
 * @param onMemberClick - Click handler for member selection
 * @param isLoading - Show loading skeleton
 * @param emptyMessage - Message when no members
 * @param className - Additional CSS classes
 */
export function MemberGrid({
  members,
  onMemberClick,
  isLoading = false,
  emptyMessage = "Geen leden gevonden",
  className = "",
}: MemberGridProps) {
  // Loading State
  if (isLoading) {
    return (
      <div
        className={`
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-4 md:gap-6
          ${className}
        `}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="h-64 bg-gray-100 rounded-lg animate-pulse"
            aria-label="Laden..."
          />
        ))}
      </div>
    );
  }

  // Empty State
  if (members.length === 0) {
    return (
      <div
        className={`
          flex flex-col items-center justify-center
          py-16 px-4
          text-center
          ${className}
        `}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl text-gray-medium">🔍</span>
        </div>
        <p className="text-lg font-semibold text-gray-blue mb-2">
          {emptyMessage}
        </p>
        <p className="text-sm text-gray-medium max-w-md">
          Probeer een andere zoekopdracht of filter
        </p>
      </div>
    );
  }

  // Grid Display
  return (
    <div
      className={`
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        gap-4 md:gap-6
        ${className}
      `}
      role="list"
      aria-label="Ledenlijst"
    >
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          onClick={onMemberClick}
          showQuickActions={true}
        />
      ))}
    </div>
  );
}
