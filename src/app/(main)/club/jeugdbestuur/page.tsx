/**
 * Jeugdbestuur Page
 *
 * Fetches the youth board team from Drupal and delegates rendering to BestuurPage.
 */

import type { Metadata } from "next";
import { Effect } from "effect";
import { notFound } from "next/navigation";
import { runPromise } from "@/lib/effect/runtime";
import {
  DrupalService,
  type TeamWithRoster,
  NotFoundError,
} from "@/lib/effect/services/DrupalService";
import { BestuurPage } from "@/components/club/BestuurPage/BestuurPage";
import {
  transformPlayerToRoster,
  transformStaffToMember,
  getTeamTagline,
} from "@/app/(main)/team/[slug]/utils";

const JEUGDBESTUUR_SLUG = "jeugdbestuur";

async function fetchJeugdbestuurOrNotFound(): Promise<TeamWithRoster> {
  try {
    return await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster(JEUGDBESTUUR_SLUG);
      }),
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { team, teamImageUrl } = await fetchJeugdbestuurOrNotFound();
    const title = team.attributes.title;
    const tagline = getTeamTagline(team);
    const description = tagline
      ? `${title} — ${tagline}`
      : `Het jeugdbestuur van KCVV Elewijt`;

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
  } catch {
    return { title: "Jeugdbestuur | KCVV Elewijt" };
  }
}

export default async function JeugdbestuurPageRoute() {
  const { team, staff, players, teamImageUrl } =
    await fetchJeugdbestuurOrNotFound();

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

export const revalidate = 3600;
