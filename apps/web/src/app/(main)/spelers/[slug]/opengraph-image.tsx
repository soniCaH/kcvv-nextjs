/**
 * Dynamic Open Graph Image for Player Pages
 *
 * The shirt number fills the stamp; players without one fall back to the crest.
 * Layout, palette and typography live in `@/lib/og/share-card`.
 */

import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import { PlayerRepository } from "@/lib/repositories/player.repository";
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

/** Club-branded card for an unknown or unfetchable player. */
const FALLBACK: ShareCardProps = { nameTop: "KCVV", nameBottom: "Elewijt" };

/**
 * Generate an Open Graph PNG for a player identified by the provided slug.
 *
 * @param params - A promise resolving to the player's PSD id as `slug`
 * @returns A 1200×630 PNG with the player's shirt number, name and position
 */
export default async function Image({ params }: ImageProps) {
  const { slug } = await params;

  // An OG route has no error boundary to bubble into — a throw here serves a
  // broken image to every social crawler, so it degrades to the club card.
  const card = await runPromise(
    Effect.gen(function* () {
      const repo = yield* PlayerRepository;
      const player = yield* repo.findByPsdId(slug);
      if (!player) return FALLBACK;
      return {
        ...(player.number !== undefined
          ? { stampText: String(player.number) }
          : {}),
        nameTop: player.firstName,
        nameBottom: player.lastName,
        ...(player.position ? { meta: player.position } : {}),
      } satisfies ShareCardProps;
    }).pipe(Effect.catchAll(() => Effect.succeed(FALLBACK))),
  );

  return renderShareCard(card);
}
