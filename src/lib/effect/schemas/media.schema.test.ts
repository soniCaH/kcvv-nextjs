/**
 * Media Schema Tests
 * Validates MediaImage entity parsing and type safety
 */

import { describe, it, expect } from 'vitest'
import { Schema as S } from 'effect'
import { MediaImage, MediaImageAttributes, MediaImageRelationships } from './media.schema'

describe('Media Schema', () => {
  describe('MediaImageAttributes', () => {
    it('should parse valid media image attributes', () => {
      const validAttributes = {
        drupal_internal__mid: 42,
        name: 'Hero Banner Image',
        created: '2024-01-15T10:30:00Z',
        changed: '2024-01-20T14:45:00Z',
        status: true,
        langcode: 'nl',
      }

      const result = S.decodeUnknownSync(MediaImageAttributes)(validAttributes)

      expect(result.drupal_internal__mid).toBe(42)
      expect(result.name).toBe('Hero Banner Image')
      expect(result.created).toBeInstanceOf(Date)
      expect(result.status).toBe(true)
    })

    it('should parse minimal media image attributes', () => {
      const minimalAttributes = {}

      const result = S.decodeUnknownSync(MediaImageAttributes)(minimalAttributes)

      expect(result.drupal_internal__mid).toBeUndefined()
      expect(result.name).toBeUndefined()
    })

    it('should convert date strings to Date objects', () => {
      const attributes = {
        created: '2024-01-15T10:30:00Z',
      }

      const result = S.decodeUnknownSync(MediaImageAttributes)(attributes)

      expect(result.created).toBeInstanceOf(Date)
      expect(result.created?.toISOString()).toBe('2024-01-15T10:30:00.000Z')
    })
  })

  describe('MediaImageRelationships', () => {
    it('should parse media image relationships with file reference', () => {
      const validRelationships = {
        field_media_image: {
          data: {
            id: 'file-123',
            type: 'file--file',
          },
        },
      }

      const result = S.decodeUnknownSync(MediaImageRelationships)(validRelationships)

      expect(result.field_media_image?.data?.id).toBe('file-123')
      expect(result.field_media_image?.data?.type).toBe('file--file')
    })

    it('should parse relationships without file reference', () => {
      const emptyRelationships = {}

      const result = S.decodeUnknownSync(MediaImageRelationships)(emptyRelationships)

      expect(result.field_media_image).toBeUndefined()
    })

    it('should reject invalid file type', () => {
      const invalidRelationships = {
        field_media_image: {
          data: {
            id: 'file-123',
            type: 'wrong--type', // Should be 'file--file'
          },
        },
      }

      expect(() =>
        S.decodeUnknownSync(MediaImageRelationships)(invalidRelationships)
      ).toThrow()
    })
  })

  describe('MediaImage', () => {
    it('should parse complete media image entity', () => {
      const validMediaImage = {
        id: 'media-abc-123',
        type: 'media--image',
        attributes: {
          drupal_internal__mid: 42,
          name: 'Article Hero Image',
          status: true,
        },
        relationships: {
          field_media_image: {
            data: {
              id: 'file-def-456',
              type: 'file--file',
            },
          },
        },
      }

      const result = S.decodeUnknownSync(MediaImage)(validMediaImage)

      expect(result.id).toBe('media-abc-123')
      expect(result.type).toBe('media--image')
      expect(result.attributes.drupal_internal__mid).toBe(42)
      expect(result.relationships?.field_media_image?.data?.id).toBe('file-def-456')
    })

    it('should parse minimal media image entity', () => {
      const minimalMediaImage = {
        id: 'media-123',
        type: 'media--image',
        attributes: {},
      }

      const result = S.decodeUnknownSync(MediaImage)(minimalMediaImage)

      expect(result.id).toBe('media-123')
      expect(result.type).toBe('media--image')
      expect(result.relationships).toBeUndefined()
    })

    it('should reject invalid type literal', () => {
      const invalidMediaImage = {
        id: 'media-123',
        type: 'media--video', // Should be 'media--image'
        attributes: {},
      }

      expect(() => S.decodeUnknownSync(MediaImage)(invalidMediaImage)).toThrow()
    })

    it('should reject missing required fields', () => {
      const missingId = {
        type: 'media--image',
        attributes: {},
      }

      expect(() => S.decodeUnknownSync(MediaImage)(missingId)).toThrow()
    })
  })

  describe('Real-world JSON:API example', () => {
    it('should parse media image from Drupal JSON:API response', () => {
      // Actual structure from Drupal JSON:API included section
      const drupalMediaImage = {
        type: 'media--image',
        id: '8c5e7c3e-4f2a-4b1d-9e3a-7f8c9d1e2f3a',
        attributes: {
          drupal_internal__mid: 156,
          drupal_internal__vid: 245,
          langcode: 'nl',
          name: 'Eerste elftal wedstrijd foto',
          created: '2024-01-15T10:30:00+01:00',
          changed: '2024-01-20T14:45:00+01:00',
          status: true,
        },
        relationships: {
          field_media_image: {
            data: {
              type: 'file--file',
              id: '9d6f8e4f-5a3b-4c2d-8f4b-9a1c2d3e4f5b',
            },
          },
          bundle: {
            data: {
              type: 'media_type--media_type',
              id: 'image',
            },
          },
        },
        links: {
          self: {
            href: 'https://api.kcvvelewijt.be/jsonapi/media/image/8c5e7c3e-4f2a-4b1d-9e3a-7f8c9d1e2f3a',
          },
        },
      }

      const result = S.decodeUnknownSync(MediaImage)(drupalMediaImage)

      expect(result.id).toBe('8c5e7c3e-4f2a-4b1d-9e3a-7f8c9d1e2f3a')
      expect(result.type).toBe('media--image')
      expect(result.attributes.drupal_internal__mid).toBe(156)
      expect(result.attributes.name).toBe('Eerste elftal wedstrijd foto')
      expect(result.attributes.created).toBeInstanceOf(Date)
      expect(result.relationships?.field_media_image?.data?.id).toBe(
        '9d6f8e4f-5a3b-4c2d-8f4b-9a1c2d3e4f5b'
      )
    })
  })
})
