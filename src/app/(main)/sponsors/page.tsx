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
import { SponsorsTier } from '@/components/domain/sponsors/SponsorsTier'

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

  return (
    <>
      <PageTitle title="Sponsors KCVV Elewijt" />

      <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
        <SponsorsTier tier="gold" title="Gouden Sponsors" sponsors={goldSponsors} />
        <SponsorsTier tier="silver" title="Zilveren Sponsors" sponsors={silverSponsors} />
        <SponsorsTier tier="bronze" title="Bronzen Sponsors" sponsors={bronzeSponsors} />

        {goldSponsors.length === 0 && silverSponsors.length === 0 && bronzeSponsors.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Er zijn momenteel geen sponsors beschikbaar.</p>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600
