"use client";

import { TeamAgendaRow } from "@/components/team/TeamMatchesSection/TeamAgendaRow";
import type { ScheduleMatch } from "@/components/match/types";
import {
  trackFirstTeamsCardClick,
  type FirstTeamsCardKind,
} from "./first-teams-analytics";

export interface FirstTeamAgendaRowProps {
  /** Result or fixture, already normalised to the shared `ScheduleMatch` shape. */
  match: ScheduleMatch;
  /** Team slug — forwarded to the click analytics. */
  teamSlug: string;
  /** Which card kind drives the `source` analytics param. */
  kind: FirstTeamsCardKind;
  /** Render as the featured jersey-deep card (the next-fixture state). */
  featured?: boolean;
}

/**
 * Client wrapper for one "Eerste ploegen" row. Renders the shared
 * <TeamAgendaRow> and fires `match_card_click` (`source` =
 * first_teams_result | first_teams_fixture) on navigation. Confining the
 * analytics closure here keeps <FirstTeamsBlock> a Server Component (Direction
 * A, #2301). <TeamAgendaRow> owns its own <Link>, so the previous bespoke
 * press-down <Link> wrapper is gone — the row is a single, touch-friendly
 * interactive element with no nested-interactive nesting.
 */
export function FirstTeamAgendaRow({
  match,
  teamSlug,
  kind,
  featured,
}: FirstTeamAgendaRowProps) {
  return (
    <TeamAgendaRow
      match={match}
      featured={featured}
      // The block's two columns are distinguished only by cream-vs-green and by
      // which side they sit on, and it has no per-column heading to carry the
      // words — so the row says them itself (#2404). The slot has to come from
      // here, not from `match.status`: `pickLastResult` hands the result column
      // a kicked-off match PSD still calls `scheduled`, which a status-derived
      // row would label "Volgende" right beside the actual fixture.
      kind={kind}
      onNavigate={() =>
        trackFirstTeamsCardClick({ teamSlug, matchId: match.id, kind })
      }
    />
  );
}
