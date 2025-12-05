/**
 * Sponsor Mapper Tests
 * Validates transformation from Drupal sponsor format to component format
 */

import { describe, it, expect } from 'vitest'
import { mapSponsorToComponentSponsor, mapSponsorsToComponentSponsors } from './sponsor.mapper'
import type { Sponsor as DrupalSponsor } from '@/lib/effect/schemas'

describe('sponsor.mapper', () => {
  describe('mapSponsorToComponentSponsor', () => {
    it('maps sponsor with all fields', () => {
      const drupalSponsor: DrupalSponsor = {
        id: '123',
        type: 'node--sponsor',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__vid: 1,
          langcode: 'nl',
          revision_timestamp: '2024-01-01T00:00:00+00:00',
          status: true,
          title: 'Test Sponsor',
          created: '2024-01-01T00:00:00+00:00',
          changed: '2024-01-01T00:00:00+00:00',
          promote: true,
          sticky: false,
          default_langcode: true,
          revision_translation_affected: true,
          path: { alias: '/sponsors/test-sponsor', pid: 1, langcode: 'nl' },
          field_type: 'crossing',
          field_website: {
            uri: 'https://example.com',
            title: 'Example',
            options: {},
          },
        },
        relationships: {
          field_media_image: {
            data: {
              uri: { url: 'https://api.kcvvelewijt.be/sites/default/files/logo.png' },
              alt: 'Test Sponsor Logo',
              width: 200,
              height: 133,
            },
          },
        },
      }

      const result = mapSponsorToComponentSponsor(drupalSponsor)

      expect(result).toEqual({
        id: '123',
        name: 'Test Sponsor',
        logo: 'https://api.kcvvelewijt.be/sites/default/files/logo.png',
        url: 'https://example.com',
      })
    })

    it('handles sponsor without website', () => {
      const drupalSponsor: DrupalSponsor = {
        id: '123',
        type: 'node--sponsor',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__vid: 1,
          langcode: 'nl',
          revision_timestamp: '2024-01-01T00:00:00+00:00',
          status: true,
          title: 'Test Sponsor',
          created: '2024-01-01T00:00:00+00:00',
          changed: '2024-01-01T00:00:00+00:00',
          promote: true,
          sticky: false,
          default_langcode: true,
          revision_translation_affected: true,
          path: { alias: '/sponsors/test-sponsor', pid: 1, langcode: 'nl' },
        },
        relationships: {
          field_media_image: {
            data: {
              uri: { url: 'https://api.kcvvelewijt.be/sites/default/files/logo.png' },
              alt: 'Test Sponsor Logo',
            },
          },
        },
      }

      const result = mapSponsorToComponentSponsor(drupalSponsor)

      expect(result).toEqual({
        id: '123',
        name: 'Test Sponsor',
        logo: 'https://api.kcvvelewijt.be/sites/default/files/logo.png',
        url: undefined,
      })
    })

    it('uses placeholder when logo is missing', () => {
      const drupalSponsor: DrupalSponsor = {
        id: '123',
        type: 'node--sponsor',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__vid: 1,
          langcode: 'nl',
          revision_timestamp: '2024-01-01T00:00:00+00:00',
          status: true,
          title: 'Test Sponsor',
          created: '2024-01-01T00:00:00+00:00',
          changed: '2024-01-01T00:00:00+00:00',
          promote: true,
          sticky: false,
          default_langcode: true,
          revision_translation_affected: true,
          path: { alias: '/sponsors/test-sponsor', pid: 1, langcode: 'nl' },
        },
        relationships: {
          field_media_image: {
            data: null,
          },
        },
      }

      const result = mapSponsorToComponentSponsor(drupalSponsor)

      expect(result.logo).toBe('/images/placeholder-sponsor.png')
    })

    it('uses placeholder when logo data is undefined', () => {
      const drupalSponsor: DrupalSponsor = {
        id: '123',
        type: 'node--sponsor',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__vid: 1,
          langcode: 'nl',
          revision_timestamp: '2024-01-01T00:00:00+00:00',
          status: true,
          title: 'Test Sponsor',
          created: '2024-01-01T00:00:00+00:00',
          changed: '2024-01-01T00:00:00+00:00',
          promote: true,
          sticky: false,
          default_langcode: true,
          revision_translation_affected: true,
          path: { alias: '/sponsors/test-sponsor', pid: 1, langcode: 'nl' },
        },
        relationships: {},
      }

      const result = mapSponsorToComponentSponsor(drupalSponsor)

      expect(result.logo).toBe('/images/placeholder-sponsor.png')
    })

    it('uses placeholder when logo has no uri', () => {
      const drupalSponsor: DrupalSponsor = {
        id: '123',
        type: 'node--sponsor',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__vid: 1,
          langcode: 'nl',
          revision_timestamp: '2024-01-01T00:00:00+00:00',
          status: true,
          title: 'Test Sponsor',
          created: '2024-01-01T00:00:00+00:00',
          changed: '2024-01-01T00:00:00+00:00',
          promote: true,
          sticky: false,
          default_langcode: true,
          revision_translation_affected: true,
          path: { alias: '/sponsors/test-sponsor', pid: 1, langcode: 'nl' },
        },
        relationships: {
          field_media_image: {
            data: {
              alt: 'Test',
            },
          },
        },
      }

      const result = mapSponsorToComponentSponsor(drupalSponsor)

      expect(result.logo).toBe('/images/placeholder-sponsor.png')
    })

    it('handles special characters in sponsor name', () => {
      const drupalSponsor: DrupalSponsor = {
        id: '123',
        type: 'node--sponsor',
        attributes: {
          drupal_internal__nid: 1,
          drupal_internal__vid: 1,
          langcode: 'nl',
          revision_timestamp: '2024-01-01T00:00:00+00:00',
          status: true,
          title: 'Café & Bar "De Plezante"',
          created: '2024-01-01T00:00:00+00:00',
          changed: '2024-01-01T00:00:00+00:00',
          promote: true,
          sticky: false,
          default_langcode: true,
          revision_translation_affected: true,
          path: { alias: '/sponsors/cafe-bar', pid: 1, langcode: 'nl' },
        },
        relationships: {
          field_media_image: {
            data: {
              uri: { url: 'https://api.kcvvelewijt.be/sites/default/files/logo.png' },
              alt: 'Logo',
            },
          },
        },
      }

      const result = mapSponsorToComponentSponsor(drupalSponsor)

      expect(result.name).toBe('Café & Bar "De Plezante"')
    })
  })

  describe('mapSponsorsToComponentSponsors', () => {
    it('maps array of sponsors', () => {
      const drupalSponsors: readonly DrupalSponsor[] = [
        {
          id: '1',
          type: 'node--sponsor',
          attributes: {
            drupal_internal__nid: 1,
            drupal_internal__vid: 1,
            langcode: 'nl',
            revision_timestamp: '2024-01-01T00:00:00+00:00',
            status: true,
            title: 'Sponsor One',
            created: '2024-01-01T00:00:00+00:00',
            changed: '2024-01-01T00:00:00+00:00',
            promote: true,
            sticky: false,
            default_langcode: true,
            revision_translation_affected: true,
            path: { alias: '/sponsors/one', pid: 1, langcode: 'nl' },
          },
          relationships: {
            field_media_image: {
              data: {
                uri: { url: 'https://api.kcvvelewijt.be/logo1.png' },
                alt: 'Logo 1',
              },
            },
          },
        },
        {
          id: '2',
          type: 'node--sponsor',
          attributes: {
            drupal_internal__nid: 2,
            drupal_internal__vid: 2,
            langcode: 'nl',
            revision_timestamp: '2024-01-01T00:00:00+00:00',
            status: true,
            title: 'Sponsor Two',
            created: '2024-01-01T00:00:00+00:00',
            changed: '2024-01-01T00:00:00+00:00',
            promote: true,
            sticky: false,
            default_langcode: true,
            revision_translation_affected: true,
            path: { alias: '/sponsors/two', pid: 2, langcode: 'nl' },
            field_website: {
              uri: 'https://sponsor2.com',
              title: 'Sponsor Two',
              options: {},
            },
          },
          relationships: {
            field_media_image: {
              data: {
                uri: { url: 'https://api.kcvvelewijt.be/logo2.png' },
                alt: 'Logo 2',
              },
            },
          },
        },
      ]

      const result = mapSponsorsToComponentSponsors(drupalSponsors)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: '1',
        name: 'Sponsor One',
        logo: 'https://api.kcvvelewijt.be/logo1.png',
        url: undefined,
      })
      expect(result[1]).toEqual({
        id: '2',
        name: 'Sponsor Two',
        logo: 'https://api.kcvvelewijt.be/logo2.png',
        url: 'https://sponsor2.com',
      })
    })

    it('handles empty array', () => {
      const result = mapSponsorsToComponentSponsors([])

      expect(result).toEqual([])
    })

    it('preserves order of sponsors', () => {
      const drupalSponsors: readonly DrupalSponsor[] = [
        {
          id: 'a',
          type: 'node--sponsor',
          attributes: {
            drupal_internal__nid: 1,
            drupal_internal__vid: 1,
            langcode: 'nl',
            revision_timestamp: '2024-01-01T00:00:00+00:00',
            status: true,
            title: 'Alpha',
            created: '2024-01-01T00:00:00+00:00',
            changed: '2024-01-01T00:00:00+00:00',
            promote: true,
            sticky: false,
            default_langcode: true,
            revision_translation_affected: true,
            path: { alias: '/sponsors/alpha', pid: 1, langcode: 'nl' },
          },
          relationships: {},
        },
        {
          id: 'b',
          type: 'node--sponsor',
          attributes: {
            drupal_internal__nid: 2,
            drupal_internal__vid: 2,
            langcode: 'nl',
            revision_timestamp: '2024-01-01T00:00:00+00:00',
            status: true,
            title: 'Beta',
            created: '2024-01-01T00:00:00+00:00',
            changed: '2024-01-01T00:00:00+00:00',
            promote: true,
            sticky: false,
            default_langcode: true,
            revision_translation_affected: true,
            path: { alias: '/sponsors/beta', pid: 2, langcode: 'nl' },
          },
          relationships: {},
        },
        {
          id: 'c',
          type: 'node--sponsor',
          attributes: {
            drupal_internal__nid: 3,
            drupal_internal__vid: 3,
            langcode: 'nl',
            revision_timestamp: '2024-01-01T00:00:00+00:00',
            status: true,
            title: 'Gamma',
            created: '2024-01-01T00:00:00+00:00',
            changed: '2024-01-01T00:00:00+00:00',
            promote: true,
            sticky: false,
            default_langcode: true,
            revision_translation_affected: true,
            path: { alias: '/sponsors/gamma', pid: 3, langcode: 'nl' },
          },
          relationships: {},
        },
      ]

      const result = mapSponsorsToComponentSponsors(drupalSponsors)

      expect(result.map((s) => s.id)).toEqual(['a', 'b', 'c'])
      expect(result.map((s) => s.name)).toEqual(['Alpha', 'Beta', 'Gamma'])
    })
  })
})
