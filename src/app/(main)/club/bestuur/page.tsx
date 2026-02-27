/**
 * Bestuur Page
 *
 * Shows the club board (bestuur): a description from Drupal followed by
 * the member roster. No matches or standings — board members are not a
 * playing team. Links to the full organigram for the org-chart view.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Effect } from "effect";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { runPromise } from "@/lib/effect/runtime";
import {
  DrupalService,
  type TeamWithRoster,
  NotFoundError,
} from "@/lib/effect/services/DrupalService";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamRoster } from "@/components/team/TeamRoster";
import {
  transformPlayerToRoster,
  transformStaffToMember,
  getTeamTagline,
} from "@/app/(main)/team/[slug]/utils";
import { Network } from "@/lib/icons";

const BESTUUR_SLUG = "bestuur";

async function fetchBestuurOrNotFound(): Promise<TeamWithRoster> {
  try {
    return await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster(BESTUUR_SLUG);
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
    const { team, teamImageUrl } = await fetchBestuurOrNotFound();
    const title = team.attributes.title;
    const tagline = getTeamTagline(team);
    const description = tagline
      ? `${title} — ${tagline}`
      : `Het bestuur van KCVV Elewijt`;

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
    return { title: "Bestuur | KCVV Elewijt" };
  }
}

export default async function BestuurPage() {
  const { team, staff, players, teamImageUrl } = await fetchBestuurOrNotFound();

  const tagline = getTeamTagline(team);
  const rosterPlayers = players.map(transformPlayerToRoster);
  const staffMembers = staff.map(transformStaffToMember);
  const hasMembers = rosterPlayers.length > 0 || staffMembers.length > 0;
  const description = team.attributes.body?.processed;

  return (
    <>
      <TeamHeader
        name={team.attributes.title}
        imageUrl={teamImageUrl}
        tagline={tagline}
        teamType="club"
      />

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Description — rendered above the roster, visually separated */}
        {description && (
          <section className="max-w-3xl border-l-4 border-kcvv-green-bright pl-6">
            <div
              className="prose prose-gray"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description),
              }}
            />
          </section>
        )}

        {/* Member roster */}
        {hasMembers && (
          <section>
            <TeamRoster
              players={rosterPlayers}
              staff={staffMembers}
              teamName={team.attributes.title}
              groupByPosition={false}
              showStaff={true}
            />
          </section>
        )}

        {/* Organigram CTA */}
        <section className="rounded-xl bg-kcvv-green-dark text-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Network className="w-8 h-8 shrink-0 opacity-80" />
            <div>
              <h2 className="text-xl font-bold">Volledig organigram</h2>
              <p className="text-white/80 text-sm mt-1">
                Bekijk de volledige clubstructuur met alle rollen en
                verantwoordelijkheden.
              </p>
            </div>
          </div>
          <Link
            href="/club/organigram"
            className="shrink-0 rounded-lg bg-white text-kcvv-green-dark font-semibold px-6 py-3 hover:bg-kcvv-green-bright hover:text-white transition-colors"
          >
            Naar organigram
          </Link>
        </section>
      </div>
    </>
  );
}

export const revalidate = 3600;
