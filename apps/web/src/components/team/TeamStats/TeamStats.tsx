/**
 * TeamStats Component
 *
 * Displays a team's season performance: wins, draws, losses, and goal record.
 * Two variants: full (with labels) and compact (numbers only).
 */

import { cn } from "@/lib/utils/cn";

export interface TeamStatsProps {
  /** Matches played */
  played: number;
  /** Matches won */
  won: number;
  /** Matches drawn */
  drawn: number;
  /** Matches lost */
  lost: number;
  /** Goals scored */
  goalsFor: number;
  /** Goals conceded */
  goalsAgainst: number;
  /** Display variant */
  variant?: "full" | "compact";
  /** Additional CSS classes */
  className?: string;
}

interface StatPillProps {
  label: string;
  value: number;
  color: string;
  compact?: boolean;
}

const StatPill = ({ label, value, color, compact }: StatPillProps) => (
  <div className="flex flex-col items-center">
    <span
      className={cn(
        "font-bold text-white rounded-sm",
        compact ? "text-sm px-2 py-0.5" : "text-xl px-3 py-1",
        color,
      )}
    >
      {value}
    </span>
    {!compact && (
      <span className="text-xs text-gray-500 mt-1 uppercase font-medium">
        {label}
      </span>
    )}
  </div>
);

export const TeamStats = ({
  played,
  won,
  drawn,
  lost,
  goalsFor,
  goalsAgainst,
  variant = "full",
  className,
}: TeamStatsProps) => {
  const compact = variant === "compact";
  const goalDifference = goalsFor - goalsAgainst;

  return (
    <div className={className}>
      {/* W / D / L pills */}
      <div className={cn("flex items-center", compact ? "gap-1" : "gap-3")}>
        <StatPill
          label="W"
          value={won}
          color="bg-green-600"
          compact={compact}
        />
        <StatPill
          label="G"
          value={drawn}
          color="bg-gray-400"
          compact={compact}
        />
        <StatPill label="V" value={lost} color="bg-red-500" compact={compact} />

        {!compact && (
          <>
            <div className="w-px h-8 bg-gray-200 mx-1" />
            {/* Goals row */}
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-kcvv-gray-blue">
                {goalsFor}–{goalsAgainst}
              </span>
              <span className="text-xs text-gray-500 mt-1 uppercase font-medium">
                Doelpunten
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-xl font-bold",
                  goalDifference > 0
                    ? "text-green-600"
                    : goalDifference < 0
                      ? "text-red-500"
                      : "text-gray-500",
                )}
              >
                {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
              </span>
              <span className="text-xs text-gray-500 mt-1 uppercase font-medium">
                Verschil
              </span>
            </div>
          </>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-gray-400 mt-2">{played} gespeeld</p>
      )}
    </div>
  );
};
