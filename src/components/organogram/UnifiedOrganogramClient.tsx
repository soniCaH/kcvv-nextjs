"use client";

/**
 * UnifiedOrganogramClient Component
 *
 * Unified interface combining Option A (Card Hierarchy), Option C (D3 Chart),
 * and ResponsibilityFinder into a single user-friendly experience.
 *
 * Features:
 * - View toggle: Cards, Chart, Verantwoordelijkheden (Responsibilities)
 * - Responsive defaults: Mobile → Cards, Desktop → Chart
 * - Shared search and filter state across views
 * - localStorage preference persistence
 * - User-friendly for ages 6-99 on all devices
 * - Two-way integration with responsibility finder
 */

import { useState } from "react";
import { LayoutGrid, Network, CircleHelp } from "@/lib/icons";
import { CardHierarchy } from "./prototypes/option-a/CardHierarchy";
import { EnhancedOrgChart } from "./prototypes/option-c/EnhancedOrgChart";
import { ResponsibilityFinder } from "../responsibility/ResponsibilityFinder";
import { MemberDetailsModal } from "./MemberDetailsModal";
import { FilterTabs } from "../ui/FilterTabs";
import type { OrgChartNode } from "@/types/organogram";
import type { FilterTab } from "../ui/FilterTabs/FilterTabs";

type ViewType = "cards" | "chart" | "responsibilities";

export interface UnifiedOrganogramClientProps {
  members: OrgChartNode[];
  className?: string;
}

const VIEW_PREFERENCE_KEY = "kcvv-organogram-view-preference";

/**
 * Get initial view based on saved preference or responsive default
 */
function getInitialView(): ViewType {
  // Check for saved preference first
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
  // View state with lazy initialization
  const [activeView, setActiveView] = useState<ViewType>(getInitialView);
  const [selectedMember, setSelectedMember] = useState<OrgChartNode | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save preference to localStorage when view changes
  const handleViewChange = (view: string) => {
    const newView = view as ViewType;
    setActiveView(newView);
    localStorage.setItem(VIEW_PREFERENCE_KEY, newView);
  };

  // Handle member click from any view
  const handleMemberClick = (member: OrgChartNode) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
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
              onResultSelect={(result) => {
                // If result has organogram link, we could navigate or show contact
                console.log("Responsibility result selected:", result);
              }}
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
