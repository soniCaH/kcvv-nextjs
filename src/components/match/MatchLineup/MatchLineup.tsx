/**
 * MatchLineup Component
 *
 * Displays starting XI and substitutes for both teams.
 *
 * Features:
 * - Two-column layout (home vs away) on desktop
 * - Stacked layout on mobile
 * - Groups players by status (starters, substitutes)
 * - Captain indicator
 * - Jersey number display
 */

import { cn } from "@/lib/utils/cn";

export interface LineupPlayer {
  /** Player ID (optional) */
  id?: number;
  /** Player name */
  name: string;
  /** Jersey number */
  number?: number;
  /** Minutes played in match */
  minutesPlayed?: number;
  /** Is team captain */
  isCaptain: boolean;
  /** Player status in match */
  status: "starter" | "substitute" | "substituted" | "unknown";
}

export interface MatchLineupProps {
  /** Home team name */
  homeTeamName: string;
  /** Away team name */
  awayTeamName: string;
  /** Home team lineup */
  homeLineup: LineupPlayer[];
  /** Away team lineup */
  awayLineup: LineupPlayer[];
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Display match lineups for both teams
 */
export function MatchLineup({
  homeTeamName,
  awayTeamName,
  homeLineup,
  awayLineup,
  isLoading = false,
  className,
}: MatchLineupProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LineupSkeleton />
          <LineupSkeleton />
        </div>
      </div>
    );
  }

  // No lineups available
  if (homeLineup.length === 0 && awayLineup.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-gray-500">
          Geen opstellingen beschikbaar voor deze wedstrijd.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold text-gray-900 font-title">
        Opstellingen
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Home Team */}
        <TeamLineup teamName={homeTeamName} players={homeLineup} side="home" />

        {/* Away Team */}
        <TeamLineup teamName={awayTeamName} players={awayLineup} side="away" />
      </div>
    </div>
  );
}

/**
 * Single team lineup display
 */
function TeamLineup({
  teamName,
  players,
  side,
}: {
  teamName: string;
  players: LineupPlayer[];
  side: "home" | "away";
}) {
  // Group players by status
  const starters = players.filter(
    (p) => p.status === "starter" || p.status === "substituted",
  );
  const substitutes = players.filter((p) => p.status === "substitute");

  const bgColor = side === "home" ? "bg-kcvv-green-bright/5" : "bg-gray-50";
  const borderColor =
    side === "home" ? "border-kcvv-green-bright/20" : "border-gray-200";

  return (
    <div className={cn("rounded-lg border p-4", bgColor, borderColor)}>
      {/* Team name header */}
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-title">
        {teamName}
      </h3>

      {players.length === 0 ? (
        <p className="text-gray-500 text-sm">Geen opstelling beschikbaar</p>
      ) : (
        <div className="space-y-4">
          {/* Starters */}
          {starters.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Basiself ({starters.length})
              </h4>
              <div className="space-y-1">
                {starters.map((player, index) => (
                  <PlayerRow
                    key={player.id ?? `starter-${index}`}
                    player={player}
                    side={side}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Substitutes */}
          {substitutes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Invallers ({substitutes.length})
              </h4>
              <div className="space-y-1">
                {substitutes.map((player, index) => (
                  <PlayerRow
                    key={player.id ?? `sub-${index}`}
                    player={player}
                    side={side}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Single player row
 */
function PlayerRow({
  player,
  side,
}: {
  player: LineupPlayer;
  side: "home" | "away";
}) {
  const numberBg =
    side === "home"
      ? "bg-kcvv-green-bright text-white"
      : "bg-gray-700 text-white";

  return (
    <div className="flex items-center gap-3 py-1.5">
      {/* Jersey number */}
      {player.number !== undefined && (
        <span
          className={cn(
            "w-7 h-7 flex items-center justify-center text-xs font-bold rounded",
            numberBg,
          )}
        >
          {player.number}
        </span>
      )}

      {/* Player name */}
      <span className="flex-1 text-sm text-gray-900">
        {player.name}
        {player.isCaptain && (
          <span className="ml-1.5 text-xs font-semibold text-kcvv-green-bright">
            (C)
          </span>
        )}
      </span>

      {/* Status indicator for substituted players */}
      {player.status === "substituted" &&
        player.minutesPlayed !== undefined && (
          <span className="text-xs text-gray-500">
            {player.minutesPlayed}&apos;
          </span>
        )}
    </div>
  );
}

/**
 * Loading skeleton for lineup
 */
function LineupSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
