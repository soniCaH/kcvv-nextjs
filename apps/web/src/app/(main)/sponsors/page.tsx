/**
 * Sponsors Page
 * Displays all sponsors grouped by tier (gold/silver/bronze)
 */

import { Effect } from "effect";
import type { Metadata } from "next";
import { runPromise } from "@/lib/effect/runtime";
import { DrupalService } from "@/lib/effect/services/DrupalService";
import { mapSponsorsToComponentSponsors } from "@/lib/mappers";
import { SponsorsPage } from "@/components/sponsors/SponsorsPage/SponsorsPage";

export const metadata: Metadata = {
  title: "Sponsors | KCVV Elewijt",
  description: "Overzicht van de sponsors die KCVV Elewijt steunen.",
};

export default async function SponsorsPageRoute() {
  const [goldSponsors, silverSponsors, bronzeSponsors] = await runPromise(
    Effect.all(
      [
        Effect.gen(function* () {
          const drupal = yield* DrupalService;
          const sponsors = yield* drupal.getSponsors({
            promoted: true,
            type: ["crossing"],
            sort: "title",
          });
          return mapSponsorsToComponentSponsors(sponsors);
        }),
        Effect.gen(function* () {
          const drupal = yield* DrupalService;
          const sponsors = yield* drupal.getSponsors({
            promoted: true,
            type: ["green", "white"],
            sort: "title",
          });
          return mapSponsorsToComponentSponsors(sponsors);
        }),
        Effect.gen(function* () {
          const drupal = yield* DrupalService;
          const sponsors = yield* drupal.getSponsors({
            promoted: true,
            type: ["training", "panel", "other"],
            sort: "title",
          });
          return mapSponsorsToComponentSponsors(sponsors);
        }),
      ],
      { concurrency: 3 },
    ).pipe(
      Effect.catchAll((error) => {
        console.error("[SponsorsPage] Failed to fetch sponsors:", error);
        return Effect.succeed([[], [], []]);
      }),
    ),
  );

  return (
    <SponsorsPage
      goldSponsors={goldSponsors}
      silverSponsors={silverSponsors}
      bronzeSponsors={bronzeSponsors}
    />
  );
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600;
