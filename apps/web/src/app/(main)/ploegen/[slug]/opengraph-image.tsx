/**
 * Dynamic Open Graph Image for Team Pages
 *
 * Youth team names *are* their age group ("U15", "U13A"), so the age group is
 * already the headline — printing it in the stamp too would say it twice. Every
 * team therefore gets the crest, and a U15 card is structurally identical to an
 * A-ploeg card. Layout, palette and typography live in `@/lib/og/share-card`.
 */

import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import { TeamRepository } from "@/lib/repositories/team.repository";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderShareCard,
  type ShareCardProps,
} from "@/lib/og/share-card";

export const runtime = "nodejs";

export const size = OG_SIZE;

export const contentType = OG_CONTENT_TYPE;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

/** Club-branded card for an unknown or unfetchable team. */
const FALLBACK: ShareCardProps = { nameTop: "KCVV", nameBottom: "Elewijt" };

/**
 * Generate an Open Graph PNG for a team identified by the provided slug.
 *
 * @param params - A promise resolving to the team's slug
 * @returns A 1200×630 PNG with the club crest, team name and division
 */
export default async function Image({ params }: ImageProps) {
  const { slug } = await params;

  // An OG route has no error boundary to bubble into — a throw here serves a
  // broken image to every social crawler, so it degrades to the club card.
  const card = await runPromise(
    Effect.gen(function* () {
      const repo = yield* TeamRepository;
      const team = yield* repo.findBySlug(slug);
      if (!team?.name) return FALLBACK;
      return {
        nameTop: "KCVV Elewijt",
        nameBottom: team.name,
        ...(team.tagline ? { meta: team.tagline } : {}),
      } satisfies ShareCardProps;
    }).pipe(Effect.catchAll(() => Effect.succeed(FALLBACK))),
  );

  return renderShareCard(card);
}
