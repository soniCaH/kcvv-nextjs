/**
 * Sponsors Page
 * Displays all sponsors grouped by tier (gold/silver/bronze)
 */

import { Effect } from 'effect'
import type { Metadata } from 'next'
import { runPromise } from '@/lib/effect/runtime'
import { DrupalService } from '@/lib/effect/services/DrupalService'
import { mapSponsorsToComponentSponsors } from '@/lib/mappers'
import { PageTitle } from '@/components/layout'
import {
  SponsorsStats,
  SponsorsSpotlight,
  SponsorsCallToAction,
  SponsorsTier,
  TierDivider,
  SponsorsEmptyState,
} from '@/components/domain/sponsors'

export const metadata: Metadata = {
  title: 'Sponsors | KCVV Elewijt',
  description: 'Overzicht van de sponsors die KCVV Elewijt steunen.',
}

/**
 * Sponsors page with three tiers:
 * - Gold (crossing): Premium sponsors
 * - Silver (green, white): Mid-tier sponsors
 * - Bronze (training, panel, other): Supporting sponsors
 */
export default async function SponsorsPage() {
  // Fetch all three tiers in parallel
  const [goldSponsors, silverSponsors, bronzeSponsors] = await runPromise(
    Effect.all(
      [
        Effect.gen(function* () {
          const drupal = yield* DrupalService
          const sponsors = yield* drupal.getSponsors({
            promoted: true,
            type: ['crossing'],
            sort: 'title',
          })
          return mapSponsorsToComponentSponsors(sponsors)
        }),
        Effect.gen(function* () {
          const drupal = yield* DrupalService
          const sponsors = yield* drupal.getSponsors({
            promoted: true,
            type: ['green', 'white'],
            sort: 'title',
          })
          return mapSponsorsToComponentSponsors(sponsors)
        }),
        Effect.gen(function* () {
          const drupal = yield* DrupalService
          const sponsors = yield* drupal.getSponsors({
            promoted: true,
            type: ['training', 'panel', 'other'],
            sort: 'title',
          })
          return mapSponsorsToComponentSponsors(sponsors)
        }),
      ],
      { concurrency: 3 }
    ).pipe(
      Effect.catchAll((error) => {
        console.error('[SponsorsPage] Failed to fetch sponsors:', error)
        return Effect.succeed([[], [], []])
      })
    )
  )

  const totalSponsors = goldSponsors.length + silverSponsors.length + bronzeSponsors.length

  // Select top 3 gold sponsors for spotlight (with descriptions)
  const featuredSponsors = goldSponsors.slice(0, 3).map((sponsor) => ({
    ...sponsor,
    description: 'Trotse partner van KCVV Elewijt',
  }))

  return (
    <div className="relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 pointer-events-none" />

      {/* Content */}
      <div className="relative">
        <PageTitle title="Sponsors KCVV Elewijt" />

        {/* Stats section with subtle background */}
        <div className="bg-gradient-to-r from-green-50/30 via-white to-green-50/30">
          <SponsorsStats totalSponsors={totalSponsors} />
        </div>

        {/* Spotlight section */}
        {featuredSponsors.length > 0 && (
          <div className="bg-gradient-to-b from-gray-50 to-white">
            <SponsorsSpotlight sponsors={featuredSponsors} />
          </div>
        )}

        {/* Main content section */}
        <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
          <SponsorsTier tier="gold" title="Gouden Sponsors" sponsors={goldSponsors} />
          {goldSponsors.length > 0 && silverSponsors.length > 0 && <TierDivider />}
          <SponsorsTier tier="silver" title="Zilveren Sponsors" sponsors={silverSponsors} />
          {silverSponsors.length > 0 && bronzeSponsors.length > 0 && <TierDivider />}
          <SponsorsTier tier="bronze" title="Bronzen Sponsors" sponsors={bronzeSponsors} />

          {goldSponsors.length === 0 && silverSponsors.length === 0 && bronzeSponsors.length === 0 && (
            <SponsorsEmptyState />
          )}

          <SponsorsCallToAction />
        </div>
      </div>
    </div>
  )
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600
