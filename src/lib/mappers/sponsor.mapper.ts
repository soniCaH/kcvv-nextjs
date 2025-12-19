/**
 * Sponsor Mapper
 * Transform Drupal sponsors to component-ready format
 */

import type { Sponsor as DrupalSponsor } from '@/lib/effect/schemas'
import type { Sponsor } from '@/components/domain/sponsors/Sponsors'

/**
 * Map Drupal sponsor to component Sponsor
 */
export function mapSponsorToComponentSponsor(drupalSponsor: DrupalSponsor): Sponsor {
  // Extract logo URL from resolved media relationship
  const logoData = drupalSponsor.relationships.field_media_image?.data
  const logoUrl =
    logoData && 'uri' in logoData && logoData.uri?.url ? logoData.uri.url : '/images/placeholder-sponsor.png'

  return {
    id: drupalSponsor.id,
    name: drupalSponsor.attributes.title,
    logo: logoUrl,
    url: drupalSponsor.attributes.field_website?.uri,
  }
}

/**
 * Map array of Drupal sponsors to component Sponsors
 */
export function mapSponsorsToComponentSponsors(drupalSponsors: readonly DrupalSponsor[]): Sponsor[] {
  return drupalSponsors.map(mapSponsorToComponentSponsor)
}
