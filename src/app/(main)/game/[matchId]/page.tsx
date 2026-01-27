/**
 * Match Detail Page
 * Displays individual match details including lineups
 */

import { Effect } from "effect";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { runPromise } from "@/lib/effect/runtime";
import { FootbalistoService } from "@/lib/effect/services/FootbalistoService";
import type { MatchDetail } from "@/lib/effect/schemas/match.schema";
import { MatchDetailView } from "@/components/match/MatchDetailView";
import {
  transformHomeTeam,
  transformAwayTeam,
  transformLineupPlayer,
  extractMatchTime,
  formatMatchTitle,
  formatMatchDescription,
} from "./utils";

interface MatchPageProps {
  params: Promise<{ matchId: string }>;
}

/**
 * Generate SEO metadata for the match page
 */
export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const numericId = parseInt(matchId, 10);

  if (isNaN(numericId)) {
    return {
      title: "Wedstrijd niet gevonden | KCVV Elewijt",
    };
  }

  try {
    const match = await runPromise(
      Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService;
        return yield* footbalisto.getMatchDetail(numericId);
      }),
    );

    const title = formatMatchTitle(match);
    const description = formatMatchDescription(match);

    return {
      title: `${title} | KCVV Elewijt`,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Wedstrijd niet gevonden | KCVV Elewijt",
    };
  }
}

/**
 * Fetch match details or trigger 404
 */
async function fetchMatchOrNotFound(matchId: number): Promise<MatchDetail> {
  try {
    return await runPromise(
      Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService;
        return yield* footbalisto.getMatchDetail(matchId);
      }),
    );
  } catch {
    notFound();
  }
}

/**
 * Render the match detail page
 */
export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;
  const numericId = parseInt(matchId, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  // Fetch match details from Footbalisto
  const match = await fetchMatchOrNotFound(numericId);

  // Transform data for display
  const homeTeam = transformHomeTeam(match);
  const awayTeam = transformAwayTeam(match);
  const time = extractMatchTime(match);

  // Transform lineup data
  const homeLineup = match.lineup?.home.map(transformLineupPlayer) ?? [];
  const awayLineup = match.lineup?.away.map(transformLineupPlayer) ?? [];

  return (
    <MatchDetailView
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      date={match.date}
      time={time}
      status={match.status}
      competition={match.competition}
      homeLineup={homeLineup}
      awayLineup={awayLineup}
      hasReport={match.hasReport}
    />
  );
}

/**
 * Enable ISR with 5 minute revalidation for match data
 * (shorter than team pages since match data changes more frequently)
 */
export const revalidate = 300;
