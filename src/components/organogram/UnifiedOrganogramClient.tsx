"use client";

/**
 * UnifiedOrganogramClient Component
 *
 * Unified interface combining three organogram views into a single tabbed experience:
 * - Card Hierarchy: Collapsible card-based hierarchical view
 * - Interactive Chart: D3-based visual organizational diagram
 * - Responsibility Finder: Help system to find the right contact person
 *
 * Features:
 * - View toggle: Cards, Chart, Verantwoordelijkheden (Responsibilities)
 * - Responsive defaults: Mobile → Cards, Desktop → Chart
 * - Shared state across all views
 * - localStorage preference persistence
 * - User-friendly for ages 6-99 on all devices
 * - Seamless integration with responsibility finder
 * - URL state management for shareable links
 * - Deep linking to specific members
 */

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, Network, CircleHelp } from "@/lib/icons";
import { CardHierarchy } from "./card-hierarchy/CardHierarchy";
import { EnhancedOrgChart } from "./chart/EnhancedOrgChart";
import { ResponsibilityFinder } from "../responsibility/ResponsibilityFinder";
import { MemberDetailsModal } from "./MemberDetailsModal";
import { FilterTabs } from "../design-system/FilterTabs";
import {
  findMemberById,
  buildOrganogramUrl,
  parseOrganogramParams,
} from "@/lib/organogram-utils";
import type { OrgChartNode } from "@/types/organogram";
import type { FilterTab } from "../design-system/FilterTabs/FilterTabs";

type ViewType = "cards" | "chart" | "responsibilities";

export interface UnifiedOrganogramClientProps {
  members: OrgChartNode[];
  className?: string;
}

const VIEW_PREFERENCE_KEY = "kcvv-organogram-view-preference";

/**
 * Get initial view based on URL, saved preference, or responsive default
 */
function getInitialView(urlView: string | null): ViewType {
  // URL parameter takes precedence
  if (urlView && ["cards", "chart", "responsibilities"].includes(urlView)) {
    return urlView as ViewType;
  }

  // Check for saved preference
  if (typeof window !== "undefined") {
    const savedPreference = localStorage.getItem(
      VIEW_PREFERENCE_KEY,
    ) as ViewType | null;

    if (
      savedPreference &&
      ["cards", "chart", "responsibilities"].includes(savedPreference)
    ) {
      return savedPreference;
    }

    // Responsive default: mobile → cards, desktop → chart
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    return isMobile ? "cards" : "chart";
  }

  // Server-side default
  return "chart";
}

/**
 * UnifiedOrganogramClient - Unified organogram and responsibility system
 *
 * @param members - All organization members
 * @param className - Additional CSS classes
 */
export function UnifiedOrganogramClient({
  members,
  className = "",
}: UnifiedOrganogramClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse URL parameters
  const urlParams = parseOrganogramParams(searchParams);

  // Initialize member from URL if present
  const urlMember = urlParams.memberId
    ? findMemberById(members, urlParams.memberId)
    : null;

  // Initialize view state from URL or preferences
  const [activeView, setActiveView] = useState<ViewType>(() =>
    getInitialView(urlParams.view),
  );
  const [selectedMember, setSelectedMember] = useState<OrgChartNode | null>(
    () => urlMember,
  );
  const [isModalOpen, setIsModalOpen] = useState(() => !!urlMember);

  // Update URL when view or member changes
  const updateUrl = (options: {
    view?: ViewType;
    memberId?: string | null;
  }) => {
    const newUrl = buildOrganogramUrl("/club/organogram", {
      view: options.view || activeView,
      memberId: options.memberId !== undefined ? options.memberId : null,
    });
    router.push(newUrl, { scroll: false });
  };

  // Handle view change
  const handleViewChange = (view: string) => {
    const newView = view as ViewType;
    setActiveView(newView);
    localStorage.setItem(VIEW_PREFERENCE_KEY, newView);
    updateUrl({ view: newView });
  };

  // Handle member click from any view
  const handleMemberClick = (member: OrgChartNode) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    updateUrl({ memberId: member.id });
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    // Clear member from URL
    updateUrl({ memberId: null });
  };

  // Handle deep linking from Responsibility Finder
  const handleResponsibilityMemberSelect = (memberId: string) => {
    const member = findMemberById(members, memberId);
    if (member) {
      // Switch to cards or chart view (prefer chart for better visualization)
      const bestView: ViewType = "chart";
      setActiveView(bestView);
      setSelectedMember(member);
      setIsModalOpen(true);
      updateUrl({ view: bestView, memberId: member.id });
    }
  };

  // View tabs configuration
  const viewTabs: FilterTab[] = [
    {
      value: "cards",
      label: "Overzicht",
      icon: LayoutGrid,
    },
    {
      value: "chart",
      label: "Diagram",
      icon: Network,
    },
    {
      value: "responsibilities",
      label: "Hulp",
      icon: CircleHelp,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <FilterTabs
          tabs={viewTabs}
          activeTab={activeView}
          onChange={handleViewChange}
          size="lg"
        />

        {/* View Description */}
        <div className="mt-3 text-sm text-kcvv-gray text-center lg:text-left">
          {activeView === "cards" && (
            <p>
              Bekijk de clubstructuur in overzichtelijke kaartjes. Klik op een
              kaartje om meer details te zien.
            </p>
          )}
          {activeView === "chart" && (
            <p>
              Bekijk de clubstructuur in een visueel diagram. Zoom, pan en klik
              voor details.
            </p>
          )}
          {activeView === "responsibilities" && (
            <p>
              Zoek snel de juiste contactpersoon voor jouw vraag of situatie.
            </p>
          )}
        </div>
      </div>

      {/* Active View */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
          activeView === "responsibilities"
            ? "overflow-visible"
            : "overflow-hidden"
        }`}
      >
        {activeView === "cards" && (
          <CardHierarchy
            members={members}
            onMemberClick={handleMemberClick}
            initialExpandedDepth={2}
          />
        )}

        {activeView === "chart" && (
          <EnhancedOrgChart
            members={members}
            onMemberClick={handleMemberClick}
          />
        )}

        {activeView === "responsibilities" && (
          <div className="p-6">
            <ResponsibilityFinder
              onMemberSelect={handleResponsibilityMemberSelect}
            />
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          member={selectedMember}
        />
      )}
    </div>
  );
}
