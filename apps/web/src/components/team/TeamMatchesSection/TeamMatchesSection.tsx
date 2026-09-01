"use client";

// "use client": this section imports a Phosphor icon (ArrowRight), and
// @phosphor-icons/react is ESM-only (calls React.createContext at module init).
// A server component importing it breaks Next.js's build-time config collection
// (same root cause as <TeamAgendaRow>). The section has no server-only logic.
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { MonoLabel } from "@/components/design-system/MonoLabel";
import { ArrowRight } from "@/lib/icons.redesign";
import { TeamAgendaRow } from "./TeamAgendaRow";
import {
  findNextMatch,
  hasVisibleMatches,
  recentResults,
} from "./match-visibility";
import type { ScheduleRow } from "@/components/match/types";

export interface TeamMatchesSectionProps {
  matches: readonly ScheduleRow[];
  /** Slug used to build the /ploegen/[slug]/wedstrijden href. */
  teamSlug: string;
  /** PSD team ID of the KCVV team (passed to agenda rows for home/away context). */
  kcvvTeamId?: number;
  className?: string;
}

export function TeamMatchesSection({
  matches,
  teamSlug,
  kcvvTeamId,
  className,
}: TeamMatchesSectionProps) {
  const now = new Date();

  // Same predicate `page.tsx` reads to decide the seam, the `<section>` and
  // the sticky-nav entry (`match-visibility.ts`) — one owner, so this guard
  // and that decision can never drift apart (#2636 finding 2).
  if (!hasVisibleMatches(matches, now)) return null;

  const next = findNextMatch(matches, now);
  const recent = recentResults(matches, next?.id, now);

  const calendarHref = `/ploegen/${teamSlug}/wedstrijden`;

  return (
    <section
      data-testid="team-matches-section"
      aria-label="Wedstrijden"
      className={cn("flex flex-col gap-3", className)}
    >
      {next ? (
        <div className="flex flex-col gap-1">
          <MonoLabel variant="plain" size="sm">
            Eerstvolgende
          </MonoLabel>
          <TeamAgendaRow match={next} kcvvTeamId={kcvvTeamId} featured />
        </div>
      ) : null}

      {recent.length > 0 ? (
        <div className="flex flex-col gap-2">
          {recent.map((m) => (
            <TeamAgendaRow key={m.id} match={m} kcvvTeamId={kcvvTeamId} />
          ))}
        </div>
      ) : null}

      <Link
        href={calendarHref}
        data-testid="team-matches-calendar-link"
        className="text-ink hover:text-jersey-deep inline-flex items-center gap-1 font-mono text-[11px] tracking-widest uppercase transition-colors"
      >
        Volledige kalender
        <ArrowRight size={12} aria-hidden="true" />
      </Link>
    </section>
  );
}
