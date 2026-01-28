/**
 * MatchDetailView Component
 *
 * Composite component for match detail pages.
 * Combines MatchHeader with match content sections.
 *
 * Features:
 * - Match header with teams, score, and status
 * - Lineup section for both teams
 * - Loading state support
 * - Responsive layout
 */

import { MatchHeader, type MatchTeamProps } from "../MatchHeader";
import { MatchLineup, type LineupPlayer } from "../MatchLineup";
import { cn } from "@/lib/utils/cn";

export interface MatchDetailViewProps {
  /** Home team info */
  homeTeam: MatchTeamProps;
  /** Away team info */
  awayTeam: MatchTeamProps;
  /** Match date */
  date: Date;
  /** Match time (HH:MM format) */
  time?: string;
  /** Match status */
  status: "scheduled" | "live" | "finished" | "postponed" | "cancelled";
  /** Competition name */
  competition?: string;
  /** Home team lineup */
  homeLineup: LineupPlayer[];
  /** Away team lineup */
  awayLineup: LineupPlayer[];
  /** Whether match report is available */
  hasReport?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays a detailed match view including the header and lineup sections.
 *
 * When `isLoading` is true, renders a skeleton placeholder layout. Otherwise renders the MatchHeader and, if lineup data exists, the MatchLineup; if no lineup data is available, shows a centered message indicating no lineup.
 *
 * @returns The React element for the match detail view.
 */
export function MatchDetailView({
  homeTeam,
  awayTeam,
  date,
  time,
  status,
  competition,
  homeLineup,
  awayLineup,
  isLoading = false,
  className,
}: MatchDetailViewProps) {
  const hasLineup = homeLineup.length > 0 || awayLineup.length > 0;

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("min-h-screen", className)}>
        <MatchHeader
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={date}
          time={time}
          status={status}
          competition={competition}
          isLoading
        />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded animate-pulse" />
              <div className="h-96 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Match Header */}
      <MatchHeader
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        date={date}
        time={time}
        status={status}
        competition={competition}
      />

      {/* Match Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Lineup Section */}
        {hasLineup ? (
          <MatchLineup
            homeTeamName={homeTeam.name}
            awayTeamName={awayTeam.name}
            homeLineup={homeLineup}
            awayLineup={awayLineup}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Geen opstelling beschikbaar voor deze wedstrijd.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}