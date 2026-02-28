/**
 * Factory for club board pages (bestuur, jeugdbestuur, angels).
 *
 * Encapsulates the Drupal fetch, metadata generation, and BestuurPage render.
 * Each page only provides its slug and fallback strings.
 */

import type { Metadata } from "next";
import { Effect } from "effect";
import { notFound } from "next/navigation";
import { runPromise } from "@/lib/effect/runtime";
import {
  DrupalService,
  NotFoundError,
} from "@/lib/effect/services/DrupalService";
import { BestuurPage } from "@/components/club/BestuurPage/BestuurPage";
import {
  transformPlayerToRoster,
  transformStaffToMember,
  getTeamTagline,
} from "@/app/(main)/team/[slug]/utils";

interface BoardPageConfig {
  /** Drupal team slug (last segment of the path alias, e.g. "bestuur") */
  slug: string;
  /** Fallback description used when the team has no tagline */
  fallbackDescription: string;
  /** Fallback page title used when Drupal is unreachable */
  fallbackTitle: string;
}

async function fetchBoardTeamOrNotFound(slug: string) {
  try {
    return await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster(slug);
      }),
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}

/**
 * Returns `generateMetadata` and `Page` ready to be exported from a Next.js
 * App Router page file.
 *
 * @example
 * ```ts
 * const { generateMetadata, Page } = createBoardPage({
 *   slug: "bestuur",
 *   fallbackDescription: "Het bestuur van KCVV Elewijt",
 *   fallbackTitle: "Bestuur",
 * });
 * export { generateMetadata };
 * export default Page;
 * export const revalidate = 3600;
 * ```
 */
export function createBoardPage({
  slug,
  fallbackDescription,
  fallbackTitle,
}: BoardPageConfig) {
  async function generateMetadata(): Promise<Metadata> {
    try {
      const { team, teamImageUrl } = await fetchBoardTeamOrNotFound(slug);
      const title = team.attributes.title;
      const tagline = getTeamTagline(team);
      const description = tagline
        ? `${title} — ${tagline}`
        : fallbackDescription;

      return {
        title: `${title} | KCVV Elewijt`,
        description,
        openGraph: {
          title,
          description,
          type: "website",
          images: teamImageUrl
            ? [{ url: teamImageUrl, alt: `${title} foto` }]
            : undefined,
        },
      };
    } catch (error) {
      console.warn(
        `[createBoardPage] Failed to generate metadata for slug "${slug}":`,
        error,
      );
      return {
        title: `${fallbackTitle} | KCVV Elewijt`,
        description: fallbackDescription,
      };
    }
  }

  async function Page() {
    const { team, staff, players, teamImageUrl } =
      await fetchBoardTeamOrNotFound(slug);

    return (
      <BestuurPage
        header={{
          name: team.attributes.title,
          imageUrl: teamImageUrl,
          tagline: getTeamTagline(team),
          teamType: "club",
        }}
        description={team.attributes.body?.processed ?? undefined}
        players={players.map(transformPlayerToRoster)}
        staff={staff.map(transformStaffToMember)}
      />
    );
  }

  return { generateMetadata, Page };
}
