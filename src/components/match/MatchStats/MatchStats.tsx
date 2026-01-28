/**
 * MatchStats Component
 *
 * Match statistics comparison between two teams.
 *
 * Features:
 * - Visual stat bars showing comparison
 * - Color highlighting for higher values
 * - Support for all common match stats
 * - Minimal variant for key stats only
 * - Empty state when no stats available
 */

import { cn } from "@/lib/utils/cn";

export interface StatPair {
  home: number;
  away: number;
}

export interface MatchStatsData {
  /** Ball possession % */
  possession?: StatPair;
  /** Total shots */
  shots?: StatPair;
  /** Shots on target */
  shotsOnTarget?: StatPair;
  /** Corner kicks */
  corners?: StatPair;
  /** Fouls committed */
  fouls?: StatPair;
  /** Yellow cards */
  yellowCards?: StatPair;
  /** Red cards */
  redCards?: StatPair;
  /** Offsides */
  offsides?: StatPair;
  /** Total passes */
  passes?: StatPair;
  /** Pass accuracy % */
  passAccuracy?: StatPair;
}

export interface MatchStatsProps {
  /** Home team name */
  homeTeamName: string;
  /** Away team name */
  awayTeamName: string;
  /** Statistics data */
  stats: MatchStatsData;
  /** Display variant */
  variant?: "default" | "minimal";
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Stat labels in Dutch */
const statLabels: Record<keyof MatchStatsData, string> = {
  possession: "Balbezit",
  shots: "Schoten",
  shotsOnTarget: "Schoten op doel",
  corners: "Hoekschoppen",
  fouls: "Overtredingen",
  yellowCards: "Gele kaarten",
  redCards: "Rode kaarten",
  offsides: "Buitenspel",
  passes: "Passes",
  passAccuracy: "Passnauwkeurigheid",
};

/** Stats to show in minimal variant */
const minimalStats: (keyof MatchStatsData)[] = [
  "possession",
  "shots",
  "shotsOnTarget",
];

/** Stats where lower is better (for coloring) */
const lowerIsBetter: (keyof MatchStatsData)[] = [
  "fouls",
  "yellowCards",
  "redCards",
];

/** Stats that are percentages */
const percentageStats: (keyof MatchStatsData)[] = [
  "possession",
  "passAccuracy",
];

/**
 * Render match statistics comparing home and away teams.
 *
 * @param homeTeamName - Home team name for header
 * @param awayTeamName - Away team name for header
 * @param stats - Statistics data object
 * @param variant - Display variant (default shows all, minimal shows key stats)
 * @param isLoading - Show loading skeleton
 * @param className - Additional CSS classes
 * @returns The rendered statistics element
 */
export function MatchStats({
  homeTeamName,
  awayTeamName,
  stats,
  variant = "default",
  isLoading = false,
  className,
}: MatchStatsProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex justify-between">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Predefined stat order for consistent UI rendering
  const allStatsOrder: (keyof MatchStatsData)[] = [
    "possession",
    "shots",
    "shotsOnTarget",
    "corners",
    "fouls",
    "yellowCards",
    "redCards",
    "offsides",
    "passes",
    "passAccuracy",
  ];

  // Get stats to display based on variant, using deterministic order
  const statsToShow =
    variant === "minimal"
      ? minimalStats.filter((key) => stats[key] !== undefined)
      : allStatsOrder.filter((key) => stats[key] !== undefined);

  // Empty state
  if (statsToShow.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-gray-500">
          Geen statistieken beschikbaar voor deze wedstrijd.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with team names */}
      <div className="flex justify-between text-sm font-semibold text-gray-900">
        <span>{homeTeamName}</span>
        <span>{awayTeamName}</span>
      </div>

      {/* Stats rows */}
      <div className="space-y-4">
        {statsToShow.map((statKey) => {
          const stat = stats[statKey];
          if (!stat) return null;

          return (
            <StatRow
              key={statKey}
              label={statLabels[statKey]}
              homeValue={stat.home}
              awayValue={stat.away}
              isPercentage={percentageStats.includes(statKey)}
              inversed={lowerIsBetter.includes(statKey)}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Individual stat row with comparison bar
 */
function StatRow({
  label,
  homeValue,
  awayValue,
  isPercentage,
  inversed,
}: {
  label: string;
  homeValue: number;
  awayValue: number;
  isPercentage?: boolean;
  inversed?: boolean;
}) {
  const total = homeValue + awayValue;
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPercent = 100 - homePercent;

  // Determine which side is "winning" (considering inversed stats)
  const homeWins = inversed ? homeValue < awayValue : homeValue > awayValue;
  const awayWins = inversed ? awayValue < homeValue : awayValue > homeValue;
  const isEven = homeValue === awayValue;

  // Format value with % if percentage stat
  const formatValue = (value: number) =>
    isPercentage ? `${value}%` : value.toString();

  return (
    <div className="space-y-1">
      {/* Values and label row */}
      <div className="flex items-center justify-between text-sm">
        <span
          className={cn(
            "font-mono w-12",
            homeWins && "font-bold text-kcvv-green-bright",
            isEven && "text-gray-700",
          )}
        >
          {formatValue(homeValue)}
        </span>
        <span className="text-gray-600 text-center flex-1">{label}</span>
        <span
          className={cn(
            "font-mono w-12 text-right",
            awayWins && "font-bold text-gray-900",
            isEven && "text-gray-700",
          )}
        >
          {formatValue(awayValue)}
        </span>
      </div>

      {/* Comparison bar */}
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
        <div
          className={cn(
            "transition-all duration-300",
            homeWins
              ? "bg-kcvv-green-bright"
              : isEven
                ? "bg-gray-400"
                : "bg-gray-300",
          )}
          style={{ width: `${homePercent}%` }}
        />
        <div
          className={cn(
            "transition-all duration-300",
            awayWins ? "bg-gray-700" : isEven ? "bg-gray-400" : "bg-gray-300",
          )}
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
}
