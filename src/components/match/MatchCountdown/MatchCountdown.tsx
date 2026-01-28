/**
 * MatchCountdown Component
 *
 * Countdown timer to the next match.
 *
 * Features:
 * - Days/Hours/Minutes countdown
 * - Live indicator when match is in progress
 * - Finished state for past matches
 * - Team names and competition
 * - Compact variant for sidebars
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface MatchCountdownProps {
  /** Match date and time */
  matchDate: Date;
  /** Home team name */
  homeTeam: string;
  /** Away team name */
  awayTeam: string;
  /** Competition name */
  competition?: string;
  /** Match is currently live */
  isLive?: boolean;
  /** Display variant */
  variant?: "default" | "compact";
  /** Link to match detail page */
  href?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

/**
 * Calculate time remaining until the match
 */
function calculateTimeLeft(matchDate: Date): TimeLeft {
  const now = new Date();
  const difference = matchDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: difference };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

/**
 * Format the match date for display
 */
function formatMatchDate(date: Date): string {
  return date.toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Render a countdown timer to the next match with team info.
 *
 * @param matchDate - Date and time of the match
 * @param homeTeam - Home team name
 * @param awayTeam - Away team name
 * @param competition - Optional competition name
 * @param isLive - Whether the match is currently live
 * @param variant - Display variant (default or compact)
 * @param href - Optional link to match detail page
 * @param isLoading - Show loading skeleton
 * @param className - Additional CSS classes
 * @returns The rendered countdown element
 */
export function MatchCountdown({
  matchDate,
  homeTeam,
  awayTeam,
  competition,
  isLive = false,
  variant = "default",
  href,
  isLoading = false,
  className,
}: MatchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(matchDate),
  );

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(matchDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [matchDate]);

  const isCompact = variant === "compact";
  const isPast = timeLeft.total < 0 && !isLive;
  const isStartingSoon = timeLeft.total > 0 && timeLeft.total < 60 * 60 * 1000; // Within 1 hour
  const isSameDay = timeLeft.days === 0 && timeLeft.total > 0;

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-kcvv-green-dark to-kcvv-green-bright rounded-lg text-white",
          isCompact ? "p-4" : "p-6",
          className,
        )}
      >
        <div className="space-y-3">
          <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
          <div className="h-6 w-full bg-white/20 rounded animate-pulse" />
          <div className="flex justify-center gap-4">
            <div className="h-16 w-16 bg-white/20 rounded animate-pulse" />
            <div className="h-16 w-16 bg-white/20 rounded animate-pulse" />
            <div className="h-16 w-16 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <>
      {/* Competition badge */}
      {competition && !isCompact && (
        <div className="text-center mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-medium">
            {competition}
          </span>
        </div>
      )}

      {/* Teams */}
      <div
        className={cn(
          "text-center font-semibold text-white",
          isCompact ? "text-sm mb-3" : "text-lg mb-4",
        )}
      >
        <span className="truncate">{homeTeam}</span>
        <span className="mx-2 text-white/70">vs</span>
        <span className="truncate">{awayTeam}</span>
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-red-100 font-bold uppercase text-sm tracking-wide">
            Nu bezig
          </span>
        </div>
      )}

      {/* Countdown or finished state */}
      {!isLive && (
        <>
          {isPast ? (
            <div className="text-center py-4">
              <span className="text-white/80 text-sm">Wedstrijd afgelopen</span>
            </div>
          ) : (
            <>
              {/* Countdown boxes */}
              <div
                className={cn(
                  "flex items-center justify-center",
                  isCompact ? "gap-2" : "gap-3",
                )}
              >
                {/* Days - only show if > 0 and not same day */}
                {!isSameDay && (
                  <CountdownBox
                    value={timeLeft.days}
                    label="dagen"
                    compact={isCompact}
                  />
                )}

                {/* Hours */}
                <CountdownBox
                  value={timeLeft.hours}
                  label="uur"
                  compact={isCompact}
                  highlight={isStartingSoon}
                />

                {/* Minutes */}
                <CountdownBox
                  value={timeLeft.minutes}
                  label="min"
                  compact={isCompact}
                  highlight={isStartingSoon}
                />

                {/* Seconds - only in compact or when starting soon */}
                {(isCompact || isStartingSoon) && (
                  <CountdownBox
                    value={timeLeft.seconds}
                    label="sec"
                    compact={isCompact}
                    highlight={isStartingSoon}
                  />
                )}
              </div>

              {/* Match date */}
              {!isCompact && (
                <div className="text-center mt-4 text-white/70 text-sm">
                  {formatMatchDate(matchDate)}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );

  const containerClasses = cn(
    "bg-gradient-to-br from-kcvv-green-dark to-kcvv-green-bright rounded-lg text-white",
    isCompact ? "p-4" : "p-6",
    href && "transition-transform hover:scale-[1.02] cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(containerClasses, "block")}>
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}

/**
 * Individual countdown box
 */
function CountdownBox({
  value,
  label,
  compact,
  highlight,
}: {
  value: number;
  label: string;
  compact?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg",
        compact ? "px-3 py-2" : "px-4 py-3",
        highlight && "bg-red-500/30 border border-red-400/50",
      )}
    >
      <span
        className={cn("font-mono font-bold", compact ? "text-xl" : "text-3xl")}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className={cn("text-white/70", compact ? "text-xs" : "text-sm")}>
        {label}
      </span>
    </div>
  );
}
