/**
 * MatchesOverview Component
 *
 * Shows two sections side-by-side (or stacked on mobile):
 * upcoming matches and recent results.
 */

import { cn } from "@/lib/utils/cn";
import { MatchList } from "../MatchList/MatchList";
import type { UpcomingMatch } from "@/components/home/UpcomingMatches/UpcomingMatches";

export interface MatchesOverviewProps {
  /** Upcoming / scheduled matches */
  upcomingMatches: UpcomingMatch[];
  /** Recently finished matches */
  recentResults: UpcomingMatch[];
  /** Team ID to highlight */
  highlightTeamId?: number;
  /** Additional CSS classes */
  className?: string;
}

export const MatchesOverview = ({
  upcomingMatches,
  recentResults,
  highlightTeamId,
  className,
}: MatchesOverviewProps) => {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8", className)}>
      <section>
        <h3 className="text-lg font-bold text-[#31404b] mb-4 pb-2 border-b border-gray-200">
          Volgende wedstrijden
        </h3>
        <MatchList
          matches={upcomingMatches}
          highlightTeamId={highlightTeamId}
          emptyMessage="Geen aankomende wedstrijden."
        />
      </section>

      <section>
        <h3 className="text-lg font-bold text-[#31404b] mb-4 pb-2 border-b border-gray-200">
          Recente resultaten
        </h3>
        <MatchList
          matches={recentResults}
          highlightTeamId={highlightTeamId}
          emptyMessage="Geen recente resultaten."
        />
      </section>
    </div>
  );
};
