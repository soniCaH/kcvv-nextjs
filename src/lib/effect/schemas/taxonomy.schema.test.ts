/**
 * Taxonomy Schema Tests
 * Validates TaxonomyTerm entity parsing and type safety
 */

import { describe, it, expect } from 'vitest'
import { Schema as S } from 'effect'
import { TaxonomyTerm, TaxonomyTermAttributes, TaxonomyTermRelationships } from './taxonomy.schema'

describe('Taxonomy Schema', () => {
  describe('TaxonomyTermAttributes', () => {
    it('should parse valid taxonomy term attributes', () => {
      const validAttributes = {
        drupal_internal__tid: 15,
        name: 'Eerste Elftal',
        description: {
          value: 'Articles about the first team',
          format: 'basic_html',
          processed: '<p>Articles about the first team</p>',
        },
        weight: 0,
        status: true,
        created: '2024-01-15T10:30:00Z',
        changed: '2024-01-20T14:45:00Z',
      }

      const result = S.decodeUnknownSync(TaxonomyTermAttributes)(validAttributes)

      expect(result.drupal_internal__tid).toBe(15)
      expect(result.name).toBe('Eerste Elftal')
      expect(result.description?.value).toBe('Articles about the first team')
      expect(result.weight).toBe(0)
      expect(result.created).toBeInstanceOf(Date)
    })

    it('should parse minimal taxonomy term attributes', () => {
      const minimalAttributes = {
        name: 'Minimal Term',
      }

      const result = S.decodeUnknownSync(TaxonomyTermAttributes)(minimalAttributes)

      expect(result.name).toBe('Minimal Term')
      expect(result.description).toBeUndefined()
      expect(result.weight).toBeUndefined()
    })

    it('should reject missing name field', () => {
      const invalidAttributes = {
        drupal_internal__tid: 5,
      }

      expect(() => S.decodeUnknownSync(TaxonomyTermAttributes)(invalidAttributes)).toThrow()
    })

    it('should convert date strings to Date objects', () => {
      const attributes = {
        name: 'Test Term',
        created: '2024-01-15T10:30:00Z',
        changed: '2024-01-20T08:15:00Z',
      }

      const result = S.decodeUnknownSync(TaxonomyTermAttributes)(attributes)

      expect(result.created).toBeInstanceOf(Date)
      expect(result.changed).toBeInstanceOf(Date)
      expect(result.created?.toISOString()).toBe('2024-01-15T10:30:00.000Z')
    })
  })

  describe('TaxonomyTermRelationships', () => {
    it('should parse term with no parents (top-level)', () => {
      const topLevelRelationships = {
        parent: {
          data: [],
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTermRelationships)(topLevelRelationships)

      expect(result.parent?.data).toEqual([])
    })

    it('should parse term with single parent', () => {
      const childRelationships = {
        parent: {
          data: [
            {
              id: 'parent-term-123',
              type: 'taxonomy_term--tags',
            },
          ],
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTermRelationships)(childRelationships)

      expect(result.parent?.data).toHaveLength(1)
      expect(result.parent?.data[0].id).toBe('parent-term-123')
      expect(result.parent?.data[0].type).toBe('taxonomy_term--tags')
    })

    it('should parse term with multiple parents', () => {
      const multiParentRelationships = {
        parent: {
          data: [
            { id: 'parent-1', type: 'taxonomy_term--tags' },
            { id: 'parent-2', type: 'taxonomy_term--tags' },
          ],
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTermRelationships)(multiParentRelationships)

      expect(result.parent?.data).toHaveLength(2)
    })

    it('should parse relationships without parent field', () => {
      const emptyRelationships = {}

      const result = S.decodeUnknownSync(TaxonomyTermRelationships)(emptyRelationships)

      expect(result.parent).toBeUndefined()
    })
  })

  describe('TaxonomyTerm', () => {
    it('should parse complete taxonomy term entity', () => {
      const validTerm = {
        id: 'term-abc-123',
        type: 'taxonomy_term--tags',
        attributes: {
          drupal_internal__tid: 25,
          name: 'Jeugdwerking',
          weight: 5,
          status: true,
        },
        relationships: {
          parent: {
            data: [],
          },
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTerm)(validTerm)

      expect(result.id).toBe('term-abc-123')
      expect(result.type).toBe('taxonomy_term--tags')
      expect(result.attributes.drupal_internal__tid).toBe(25)
      expect(result.attributes.name).toBe('Jeugdwerking')
      expect(result.relationships?.parent?.data).toEqual([])
    })

    it('should parse minimal taxonomy term', () => {
      const minimalTerm = {
        id: 'term-123',
        type: 'taxonomy_term--categories',
        attributes: {
          name: 'Category',
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTerm)(minimalTerm)

      expect(result.id).toBe('term-123')
      expect(result.type).toBe('taxonomy_term--categories')
      expect(result.attributes.name).toBe('Category')
      expect(result.relationships).toBeUndefined()
    })

    it('should accept any taxonomy vocabulary type', () => {
      const customVocabularyTerm = {
        id: 'term-custom',
        type: 'taxonomy_term--custom_vocab',
        attributes: {
          name: 'Custom Term',
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTerm)(customVocabularyTerm)

      expect(result.type).toBe('taxonomy_term--custom_vocab')
    })

    it('should reject missing required fields', () => {
      const missingType = {
        id: 'term-123',
        attributes: {
          name: 'Test',
        },
      }

      expect(() => S.decodeUnknownSync(TaxonomyTerm)(missingType)).toThrow()
    })

    it('should reject missing name in attributes', () => {
      const missingName = {
        id: 'term-123',
        type: 'taxonomy_term--tags',
        attributes: {},
      }

      expect(() => S.decodeUnknownSync(TaxonomyTerm)(missingName)).toThrow()
    })
  })

  describe('Real-world JSON:API examples', () => {
    it('should parse tag term from Drupal JSON:API response', () => {
      // Actual structure from Drupal JSON:API included section
      const drupalTag = {
        type: 'taxonomy_term--tags',
        id: '3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
        attributes: {
          drupal_internal__tid: 8,
          drupal_internal__revision_id: 8,
          langcode: 'nl',
          name: 'Eerste Elftal',
          description: {
            value: null,
            format: null,
            processed: '',
          },
          weight: 0,
          status: true,
          created: '2023-05-10T09:15:00+02:00',
          changed: '2023-05-10T09:15:00+02:00',
          default_langcode: true,
          path: {
            alias: '/tags/eerste-elftal',
            pid: 42,
            langcode: 'nl',
          },
        },
        relationships: {
          parent: {
            data: [],
          },
          vid: {
            data: {
              type: 'taxonomy_vocabulary--taxonomy_vocabulary',
              id: 'tags',
            },
          },
        },
        links: {
          self: {
            href: 'https://api.kcvvelewijt.be/jsonapi/taxonomy_term/tags/3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
          },
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTerm)(drupalTag)

      expect(result.id).toBe('3f2a1b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c')
      expect(result.type).toBe('taxonomy_term--tags')
      expect(result.attributes.drupal_internal__tid).toBe(8)
      expect(result.attributes.name).toBe('Eerste Elftal')
      expect(result.attributes.path?.alias).toBe('/tags/eerste-elftal')
      expect(result.attributes.created).toBeInstanceOf(Date)
      expect(result.relationships?.parent?.data).toEqual([])
    })

    it('should parse category term with parent', () => {
      const categoryWithParent = {
        type: 'taxonomy_term--categories',
        id: 'cat-123',
        attributes: {
          drupal_internal__tid: 15,
          name: 'U12 Nieuws',
          weight: 2,
          status: true,
        },
        relationships: {
          parent: {
            data: [
              {
                type: 'taxonomy_term--categories',
                id: 'parent-cat-456',
              },
            ],
          },
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTerm)(categoryWithParent)

      expect(result.attributes.name).toBe('U12 Nieuws')
      expect(result.relationships?.parent?.data).toHaveLength(1)
      expect(result.relationships?.parent?.data[0].id).toBe('parent-cat-456')
    })

    it('should handle terms with rich text descriptions', () => {
      const termWithDescription = {
        type: 'taxonomy_term--tags',
        id: 'term-rich',
        attributes: {
          name: 'Transfernieuws',
          description: {
            value: '<p>Alle nieuws over <strong>transfers</strong> en contractverlengingen.</p>',
            format: 'full_html',
            processed:
              '<p>Alle nieuws over <strong>transfers</strong> en contractverlengingen.</p>',
          },
          weight: 10,
        },
      }

      const result = S.decodeUnknownSync(TaxonomyTerm)(termWithDescription)

      expect(result.attributes.name).toBe('Transfernieuws')
      expect(result.attributes.description?.processed).toContain('<strong>transfers</strong>')
    })
  })
})
