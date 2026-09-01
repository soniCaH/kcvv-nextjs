/**
 * Team Detail Page — Phase 6.C single-scroll composition.
 *
 * SiteHeader → MatchStripSlot → TeamHero → sticky section-nav →
 * [competitive block: status line, or StandingsSection + TeamMatchesSection]
 * → SquadGrid → TeamStaff → TeamEditorial → VerderLezenRow →
 * global SponsorsBlock → footer.
 * <StripedSeam> separates sections; every non-hero section auto-hides on
 * empty data (a U6 page degrades to hero + squad + staff).
 *
 * The competitive block (`#klassement` + `#wedstrijden`) does not auto-hide
 * per section any more — it is gated as ONE unit by
 * `deriveCompetitiveBlockState` (#2636): both sections render together, or
 * neither does and a single status line takes their place. See the comment
 * beside `competitiveState` below.
 */

import { Effect } from "effect";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/react";
import { runPromise } from "@/lib/effect/runtime";
import { degradeSection } from "@/lib/effect/degrade";
import { SITE_CONFIG, DEFAULT_OG_IMAGE } from "@/lib/constants";
import { BffService } from "@/lib/effect/services/BffService";
import { ArticleRepository } from "@/lib/repositories/article.repository";
import type { Match, RankingTable } from "@kcvv/api-contract";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildSportsTeamJsonLd } from "@/lib/seo/jsonld";
import { PageViewTracker, TrackInView } from "@/components/analytics";
import { MatchStripSlot } from "@/components/layout/MatchStrip";
import { getTeamMatches } from "@/lib/server/match-data";
import { isPermanentBffFailure } from "@/lib/effect/classify-bff-failure";
import { StripedSeam } from "@/components/design-system/StripedSeam";
import { PageContainer } from "@/components/design-system/PageContainer";
import { TeamHero } from "@/components/team/TeamHero";
import { StandingsSection } from "@/components/team/StandingsSection";
import { TeamMatchesSection } from "@/components/team/TeamMatchesSection";
// Deep import, not the `TeamMatchesSection` barrel: that barrel also
// re-exports a `"use client"` component, and this is a server-side read of a
// plain predicate — no reason to route it through that boundary (#2636
// finding 11).
import { hasVisibleMatches } from "@/components/team/TeamMatchesSection/match-visibility";
import { CompetitiveStatusLine } from "@/components/team/CompetitiveStatusLine";
import { SquadGrid } from "@/components/team/SquadGrid";
import { TeamEnrolmentCta } from "@/components/team/TeamEnrolmentCta";
import { TeamStaff } from "@/components/team/TeamStaff";
import { TeamEditorial } from "@/components/team/TeamEditorial";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { VerderLezenRow } from "@/components/article/VerderLezenRow";
import { articleVMsToVerderLezenItems } from "@/lib/utils/article-related-items";
import { TeamRepository } from "@/lib/repositories/team.repository";
import { hasRenderableBioContent } from "@/lib/portable-text/findPullquoteText";
import { transformMatchToSchedule } from "@/components/match";
import {
  deriveCompetitiveBlockState,
  competitiveBlockHeadingLabel,
} from "@/lib/utils/competitive-block-state";
import { TeamSectionNav, type TeamSectionNavItem } from "./TeamSectionNav";

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

// No static prerendering — the body fetches PSD data via the rate-limited BFF.
// Pages are built on-demand and ISR-cached (revalidate below).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await runPromise(
    Effect.gen(function* () {
      const repo = yield* TeamRepository;
      return yield* repo.findBySlug(slug);
    }),
  );
  if (!team) return { title: "Team niet gevonden" };

  // Tab, share card and heading all read the one resolved name, so a visitor is
  // never shown three names for one team (#2630).
  const displayName = team.displayName;
  const typeLabel = team.teamType === "youth" ? "Jeugdploeg" : "Ploeg";
  // The division moved here from the tagline. Deleting `computeTagline`'s
  // fallback was about the *hero*, where the mono pill already showed it — a
  // search result has no pill, so dropping it there too would degrade three
  // senior descriptions to a bare page type for no gain (#2630).
  const subtitle = team.tagline ?? team.divisionFull ?? team.division;
  const description = subtitle
    ? `${displayName} - ${subtitle}`
    : `${displayName} - KCVV Elewijt ${typeLabel}`;

  return {
    title: displayName,
    description,
    alternates: { canonical: `${SITE_CONFIG.siteUrl}/ploegen/${slug}` },
    openGraph: {
      title: displayName,
      description,
      type: "website",
      images: team.teamImageUrl
        ? [{ url: team.teamImageUrl, alt: `${displayName} teamfoto` }]
        : [DEFAULT_OG_IMAGE],
    },
  };
}

interface BffData {
  matches: readonly Match[];
  standings: readonly RankingTable[];
  teamId: number;
}

/**
 * Deliberately no plain `catch`/`catchAll` on either read (#2540 state 4 /
 * #2636 AC 4). A caught BFF failure would *succeed* — the empty render it
 * produces gets written into the 15-minute ISR cache like any other, so an
 * upstream blip on a Sunday afternoon would silently delete the league table
 * at peak traffic and keep saying "the season hasn't started" for the whole
 * window. Left to reject, the same failure makes this render throw, so ISR
 * serves the last-good page instead — up to 15 min stale, recovering
 * silently at the next successful regeneration.
 *
 * That is the right shape for a *transient* failure. It is the wrong shape
 * for a *permanent* one (#2636 finding 3): `generateStaticParams` returns
 * `[]`, so a team whose `psdId` is stale/mistyped in Sanity, or whose feed
 * this deploy can no longer decode, never once succeeds — there is no
 * last-good page for ISR to fall back to, ever, so every request throws and
 * the route serves `error.tsx` forever instead of the hero/squad/staff a
 * broken competitive block should still degrade to.
 *
 * The two reads are told apart differently (#2636 finding 2, review round 2):
 * - The **ranking** read still has its typed `BffError` channel here, so a
 *   permanent tag is caught *as an Effect*, exhaustiveness-checked against
 *   the union — the idiom this repo already uses at
 *   `wedstrijden/page.tsx`, `sitemap.ts` and three more call sites. A caught
 *   read resolves to `null` (a value, not a rejection) rather than the empty
 *   array a transient failure would be indistinguishable from.
 * - The **matches** read goes through `getTeamMatches`, whose channel is
 *   already flattened to a rejecting `Promise` by the #2441 dedupe below, so
 *   it cannot be classified before it becomes one. `isPermanentBffFailure`
 *   inspects the rejection's tag after the fact instead.
 *
 * Either way, a transient failure is rethrown unchanged, preserving the
 * throw-for-ISR-fallback behaviour above.
 */
async function fetchBffData(
  psdTeamId: number,
): Promise<BffData | "unavailable"> {
  const [matchesResult, standingsResult] = await Promise.allSettled([
    // Via `getTeamMatches` because this page mounts its own
    // `<MatchStripSlot />` further down, and on `/ploegen/eerste-elftallen-a`
    // the strip resolves to this very psdId — the same double-read the
    // homepage had (#2441).
    getTeamMatches(psdTeamId),
    runPromise(
      Effect.gen(function* () {
        const bff = yield* BffService;
        return yield* bff.getRanking(psdTeamId);
      }).pipe(
        Effect.catchTags({
          HttpNotFound: () => Effect.succeed(null),
          ParseError: () => Effect.succeed(null),
          HttpApiDecodeError: () => Effect.succeed(null),
        }),
      ),
    ),
  ]);

  if (matchesResult.status === "rejected") {
    if (!isPermanentBffFailure(matchesResult.reason)) {
      throw matchesResult.reason;
    }
    return "unavailable";
  }
  if (standingsResult.status === "rejected") {
    // Every permanent ranking tag is caught above; a rejection here is
    // transient by construction.
    throw standingsResult.reason;
  }
  if (standingsResult.value === null) return "unavailable";

  return {
    matches: matchesResult.value,
    standings: standingsResult.value,
    teamId: psdTeamId,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;

  const team = await runPromise(
    Effect.gen(function* () {
      const repo = yield* TeamRepository;
      return yield* repo.findBySlug(slug);
    }),
  );

  if (!team) notFound();

  const displayName = team.displayName;
  const psdTeamId = team.psdId ? parseInt(team.psdId, 10) : NaN;

  // Both depend only on `team`, never on each other, so they share one wave
  // rather than serializing Sanity behind the BFF pair (#2441).
  //
  // #2627 guard: no `<Suspense>` boundary between the content-store (Sanity)
  // read above and this PSD wave, on this route or on
  // `/ploegen/[slug]/wedstrijden`, without re-reading #2627 first. #2627
  // measured that streaming here pays for itself on ~18 requests per deploy
  // and costs a real 404 status code and the throw `fetchBffData` now relies
  // on: once a shell flushes, the response is locked at 200 and a PSD
  // rejection can only resolve *inside* the stream as error UI — which is
  // exactly the "cached lie" #2540/#2636 removed the two catches to avoid.
  const [relatedArticles, bffData] = await Promise.all([
    // Same section, same verdict as `/spelers/[slug]` and `/staf/[slug]`
    // (#2433 rule 3/4): "Verder lezen." is polish, and its absence asserts
    // nothing, so it hides rather than taking the team page down.
    runPromise(
      degradeSection(
        Effect.gen(function* () {
          const repo = yield* ArticleRepository;
          return yield* repo.findRelated(team.id);
        }),
        [],
        "[ploegen/[slug]] related-articles lookup failed; rendering without the Verder lezen row.",
      ),
    ),
    Number.isFinite(psdTeamId) && psdTeamId > 0
      ? fetchBffData(psdTeamId)
      : null,
  ]);

  // `bffData` collapses `null` (no usable psdId) and `"unavailable"`
  // (permanent PSD failure) to the same "nothing to read from" shape here —
  // `competitiveState` below is what still tells the two apart for the
  // status line's copy (#2636 finding 8).
  const bffOutcome = bffData === "unavailable" ? null : bffData;
  const bffTeamId = bffOutcome?.teamId;
  const standings = bffOutcome?.standings ?? [];
  const scheduleMatches = (bffOutcome?.matches ?? []).map(
    transformMatchToSchedule,
  );
  const staff = team.staff.map((s) => ({
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    functionTitle: s.functionTitle,
    role: s.role,
    imageUrl: s.imageUrl,
    href: s.href,
  }));

  const teamBody = team.body as PortableTextBlock[] | null;
  const teamContact = team.contactInfo as PortableTextBlock[] | null;

  // The competitive block — `#klassement` + `#wedstrijden` — is gated as ONE
  // unit, replacing the two independent `showStandings` / `showMatches`
  // flags this used to derive inline (#2636). `bffData` is `null` only when
  // the team carries no usable PSD id (a deliberate skip, not a failure) and
  // `"unavailable"` when `fetchBffData` caught a *permanent* PSD failure
  // (#2636 finding 3) — a *transient* failure never reaches here at all,
  // since `fetchBffData` lets that one reject and take the render down so
  // ISR can serve the last-good page.
  //
  // `competitiveBlockHeadingLabel` switches on every member of
  // `CompetitiveBlockState` and returns `null` for the two that earn no nav
  // entry — so `inCompetition` is read straight off that, rather than a
  // second, hand-written list of "which kinds don't count" that a state
  // added later could silently fall out of sync with (#2636 finding 5).
  const competitiveState = deriveCompetitiveBlockState(bffData);
  const klassementLabel = competitiveBlockHeadingLabel(competitiveState);
  const inCompetition = klassementLabel !== null;

  // Section render flags — keep the sticky nav in sync with each section's
  // own auto-hide so the nav never lists a section that doesn't render.
  //
  // `#wedstrijden` gets its OWN flag rather than reusing `inCompetition`
  // directly: the fixture gate can be open (a league match exists this
  // season) while every individual fixture is postponed/cancelled/forfeited/
  // stopped, or stuck at `"scheduled"` in the past — `<TeamMatchesSection>`
  // would then self-hide beneath an unconditionally-rendered seam and nav
  // chip. `hasVisibleMatches` is the exact predicate that component uses
  // internally, so this can never drift from what it actually renders
  // (#2636 finding 2).
  const showSquad = team.players.length > 0;
  const showStaff = staff.length > 0;
  const showWedstrijden = inCompetition && hasVisibleMatches(scheduleMatches);
  const showEditorial =
    (teamBody !== null && hasRenderableBioContent(teamBody)) ||
    (team.trainingSchedule?.length ?? 0) > 0 ||
    (teamContact !== null && hasRenderableBioContent(teamContact));

  // The status line states (`not-in-competition` / `unavailable`) are the
  // ONE deliberate exception to the nav/render invariant below: neither is a
  // section, so neither earns a nav entry even though one renders in the
  // section-nav's stead (#2540/#2636 decision). Every other item here is
  // kept in exact sync with what actually renders further down.
  const navItems: TeamSectionNavItem[] = [
    klassementLabel !== null && { id: "klassement", label: klassementLabel },
    showWedstrijden && { id: "wedstrijden", label: "Wedstrijden" },
    showSquad && { id: "spelers", label: "Spelers" },
    showStaff && { id: "staf", label: "Staf" },
    showEditorial && { id: "info", label: "Info" },
  ].filter((x): x is TeamSectionNavItem => x !== false);

  const analyticsParams = { team_slug: slug };

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: SITE_CONFIG.siteUrl },
          { name: "Ploegen", url: `${SITE_CONFIG.siteUrl}/ploegen` },
          { name: displayName, url: `${SITE_CONFIG.siteUrl}/ploegen/${slug}` },
        ])}
      />
      <JsonLd
        data={buildSportsTeamJsonLd({
          // Deliberately NOT the display name: `SportsTeam.name` is a
          // machine-readable claim about a federation-registered entity, not a
          // nickname. The breadcrumb above is a human-facing trail, so that one
          // follows the heading (#2630).
          name: team.name,
          url: `${SITE_CONFIG.siteUrl}/ploegen/${slug}`,
        })}
      />
      <PageViewTracker eventName="team_detail_view" params={analyticsParams} />

      <MatchStripSlot />

      <PageContainer>
        <TeamHero
          displayName={displayName}
          teamType={team.teamType}
          ageGroup={team.ageGroup}
          division={team.division}
          divisionFull={team.divisionFull}
          tagline={team.tagline}
          teamImageUrl={team.teamImageUrl}
          className="py-8 sm:py-12"
        />
      </PageContainer>

      <TeamSectionNav items={navItems} />

      {/* The competitive block — #klassement + #wedstrijden — renders as ONE
          gated unit (#2540/#2636): `#klassement` always renders once
          `inCompetition`, or a status line takes both sections' place
          (pre-publication, or a permanently-failed PSD read). `#wedstrijden`
          carries its own `showWedstrijden` flag beneath that gate — see the
          comment beside it above — so an empty section can never sit behind
          a live nav chip. */}
      {!inCompetition ? (
        <>
          <StripedSeam colorPair="ink-cream" height="md" />
          <PageContainer className="py-10">
            <CompetitiveStatusLine
              variant={
                competitiveState.kind === "unavailable"
                  ? "unavailable"
                  : "not-in-competition"
              }
            />
          </PageContainer>
        </>
      ) : (
        <>
          <StripedSeam colorPair="ink-cream" height="md" />
          <TrackInView
            eventName="team_standings_in_view"
            params={analyticsParams}
          >
            <PageContainer
              as="section"
              id="klassement"
              className="scroll-mt-[6.5rem] py-10"
            >
              <StandingsSection
                tables={standings}
                divisionFull={team.divisionFull}
                highlightTeamId={bffTeamId}
              />
            </PageContainer>
          </TrackInView>

          {showWedstrijden ? (
            <>
              <StripedSeam colorPair="ink-cream" height="md" />
              <TrackInView
                eventName="team_matches_in_view"
                params={analyticsParams}
              >
                <PageContainer
                  as="section"
                  id="wedstrijden"
                  className="scroll-mt-[6.5rem] py-10"
                >
                  <TeamMatchesSection
                    matches={scheduleMatches}
                    teamSlug={slug}
                    kcvvTeamId={bffTeamId}
                  />
                </PageContainer>
              </TrackInView>
            </>
          ) : null}
        </>
      )}

      {showSquad ? (
        <>
          <StripedSeam colorPair="ink-cream" height="md" />
          <TrackInView eventName="team_squad_in_view" params={analyticsParams}>
            <PageContainer
              as="section"
              id="spelers"
              className="scroll-mt-[6.5rem] py-10"
            >
              <SquadGrid players={team.players} />
            </PageContainer>
          </TrackInView>
        </>
      ) : null}

      {/* Youth-only "Word lid" enrolment CTA (#1949). Gate the seam + section
          here so senior pages get no empty chrome; <TeamEnrolmentCta> also
          self-gates (returns null for senior). No section-nav anchor — it's a
          CTA, not navigable content. */}
      {team.teamType === "youth" ? (
        <>
          <StripedSeam colorPair="ink-cream" height="md" />
          <PageContainer as="section" className="scroll-mt-[6.5rem] py-10">
            <TeamEnrolmentCta
              teamType={team.teamType}
              teamSlug={slug}
              ageGroup={team.ageGroup}
            />
          </PageContainer>
        </>
      ) : null}

      {showStaff ? (
        <>
          <StripedSeam colorPair="ink-cream" height="md" />
          <PageContainer
            as="section"
            id="staf"
            className="scroll-mt-[6.5rem] py-10"
          >
            <TeamStaff staff={staff} />
          </PageContainer>
        </>
      ) : null}

      {showEditorial ? (
        <>
          <StripedSeam colorPair="ink-cream" height="md" />
          <PageContainer
            as="section"
            id="info"
            className="scroll-mt-[6.5rem] py-10"
          >
            <TeamEditorial
              body={teamBody}
              trainingSchedule={team.trainingSchedule}
              contactInfo={teamContact}
            />
          </PageContainer>
        </>
      ) : null}

      {/* Full-bleed cream "Verder lezen." slider — auto-hides when empty. */}
      <VerderLezenRow
        items={articleVMsToVerderLezenItems(relatedArticles)}
        pageType="team"
        pageSlug={slug}
      />

      <SponsorsSection />
    </>
  );
}

// 15 min ISR — the page renders live PSD match data (fixtures + standings), so
// its cache is aligned to the BFF freshness window. Editor publishes still
// invalidate rosters on demand via /api/revalidate (revalidateTag 'teams').
export const revalidate = 900;
