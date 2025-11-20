/**
 * Common Schema Tests
 * Validates JSON:API common types and shared Drupal structures
 */

import { describe, it, expect } from 'vitest'
import { Schema as S } from 'effect'
import {
  JsonApiVersion,
  JsonApiLink,
  JsonApiLinks,
  DrupalResource,
  DrupalImage,
  DrupalPath,
  DrupalBody,
} from './common.schema'

describe('Common Schema - JSON:API Types', () => {
  describe('JsonApiVersion', () => {
    it('should parse valid JSON:API version object', () => {
      const validVersion = {
        version: '1.0',
      }

      const result = S.decodeUnknownSync(JsonApiVersion)(validVersion)

      expect(result.version).toBe('1.0')
      expect(result.meta).toBeUndefined()
    })

    it('should parse version with meta', () => {
      const versionWithMeta = {
        version: '1.0',
        meta: {
          'custom-field': 'custom-value',
        },
      }

      const result = S.decodeUnknownSync(JsonApiVersion)(versionWithMeta)

      expect(result.version).toBe('1.0')
      expect(result.meta).toBeDefined()
    })

    it('should reject missing version field', () => {
      const invalidVersion = {}

      expect(() => S.decodeUnknownSync(JsonApiVersion)(invalidVersion)).toThrow()
    })
  })

  describe('JsonApiLink', () => {
    it('should parse valid JSON:API link', () => {
      const validLink = {
        href: 'https://api.kcvvelewijt.be/jsonapi/node/article',
      }

      const result = S.decodeUnknownSync(JsonApiLink)(validLink)

      expect(result.href).toBe('https://api.kcvvelewijt.be/jsonapi/node/article')
      expect(result.meta).toBeUndefined()
    })

    it('should parse link with meta', () => {
      const linkWithMeta = {
        href: '/jsonapi/node/article',
        meta: {
          count: 50,
        },
      }

      const result = S.decodeUnknownSync(JsonApiLink)(linkWithMeta)

      expect(result.href).toBe('/jsonapi/node/article')
      expect(result.meta).toBeDefined()
    })
  })

  describe('JsonApiLinks', () => {
    it('should parse complete pagination links', () => {
      const validLinks = {
        self: { href: 'https://api.kcvvelewijt.be/jsonapi/node/article?page[offset]=20' },
        next: { href: 'https://api.kcvvelewijt.be/jsonapi/node/article?page[offset]=40' },
        prev: { href: 'https://api.kcvvelewijt.be/jsonapi/node/article?page[offset]=0' },
        first: { href: 'https://api.kcvvelewijt.be/jsonapi/node/article?page[offset]=0' },
        last: { href: 'https://api.kcvvelewijt.be/jsonapi/node/article?page[offset]=200' },
      }

      const result = S.decodeUnknownSync(JsonApiLinks)(validLinks)

      expect(result.self?.href).toContain('page[offset]=20')
      expect(result.next?.href).toContain('page[offset]=40')
      expect(result.prev?.href).toContain('page[offset]=0')
      expect(result.first?.href).toContain('page[offset]=0')
      expect(result.last?.href).toContain('page[offset]=200')
    })

    it('should parse partial pagination links', () => {
      const partialLinks = {
        self: { href: '/jsonapi/node/article' },
        next: { href: '/jsonapi/node/article?page[offset]=20' },
      }

      const result = S.decodeUnknownSync(JsonApiLinks)(partialLinks)

      expect(result.self?.href).toBe('/jsonapi/node/article')
      expect(result.next?.href).toBe('/jsonapi/node/article?page[offset]=20')
      expect(result.prev).toBeUndefined()
      expect(result.first).toBeUndefined()
      expect(result.last).toBeUndefined()
    })

    it('should parse empty links object', () => {
      const emptyLinks = {}

      const result = S.decodeUnknownSync(JsonApiLinks)(emptyLinks)

      expect(result.self).toBeUndefined()
      expect(result.next).toBeUndefined()
    })

    it('should parse real Drupal pagination links', () => {
      const drupalLinks = {
        self: {
          href: 'https://api.kcvvelewijt.be/jsonapi/node/article?page%5Blimit%5D=20&page%5Boffset%5D=0',
        },
        next: {
          href: 'https://api.kcvvelewijt.be/jsonapi/node/article?page%5Blimit%5D=20&page%5Boffset%5D=20',
        },
      }

      const result = S.decodeUnknownSync(JsonApiLinks)(drupalLinks)

      expect(result.self?.href).toContain('page%5Blimit%5D=20')
      expect(result.next?.href).toContain('page%5Boffset%5D=20')
    })
  })

  describe('DrupalResource', () => {
    it('should parse generic Drupal resource', () => {
      const validResource = {
        id: 'resource-123',
        type: 'custom--type',
        attributes: {
          custom_field: 'value',
        },
      }

      const result = S.decodeUnknownSync(DrupalResource)(validResource)

      expect(result.id).toBe('resource-123')
      expect(result.type).toBe('custom--type')
      expect(result.attributes).toBeDefined()
    })

    it('should parse minimal resource', () => {
      const minimalResource = {
        id: 'min-123',
        type: 'minimal--type',
      }

      const result = S.decodeUnknownSync(DrupalResource)(minimalResource)

      expect(result.id).toBe('min-123')
      expect(result.type).toBe('minimal--type')
      expect(result.attributes).toBeUndefined()
    })

    it('should act as fallback for unknown entity types', () => {
      // This is useful for discriminated unions
      const unknownEntity = {
        id: 'unknown-456',
        type: 'some_new_entity--bundle',
        attributes: {
          something: 'we do not have a schema for yet',
        },
      }

      const result = S.decodeUnknownSync(DrupalResource)(unknownEntity)

      expect(result.id).toBe('unknown-456')
      expect(result.type).toBe('some_new_entity--bundle')
    })
  })
})

describe('Common Schema - Drupal Structures', () => {
  describe('DrupalImage', () => {
    it('should parse complete image data', () => {
      const validImage = {
        uri: { url: 'https://api.kcvvelewijt.be/sites/default/files/image.jpg' },
        alt: 'Test Image',
        title: 'Test Title',
        width: 1920,
        height: 1080,
      }

      const result = S.decodeUnknownSync(DrupalImage)(validImage)

      expect(result.uri.url).toBe('https://api.kcvvelewijt.be/sites/default/files/image.jpg')
      expect(result.alt).toBe('Test Image')
      expect(result.width).toBe(1920)
      expect(result.height).toBe(1080)
    })

    it('should parse minimal image data', () => {
      const minimalImage = {
        uri: { url: '/sites/default/files/minimal.jpg' },
      }

      const result = S.decodeUnknownSync(DrupalImage)(minimalImage)

      expect(result.uri.url).toBe('/sites/default/files/minimal.jpg')
      expect(result.alt).toBeUndefined()
    })
  })

  describe('DrupalPath', () => {
    it('should parse complete path data', () => {
      const validPath = {
        alias: '/news/eerste-elftal-wint',
        pid: 123,
        langcode: 'nl',
      }

      const result = S.decodeUnknownSync(DrupalPath)(validPath)

      expect(result.alias).toBe('/news/eerste-elftal-wint')
      expect(result.pid).toBe(123)
      expect(result.langcode).toBe('nl')
    })

    it('should parse minimal path data', () => {
      const minimalPath = {
        alias: '/news/article',
      }

      const result = S.decodeUnknownSync(DrupalPath)(minimalPath)

      expect(result.alias).toBe('/news/article')
      expect(result.pid).toBeUndefined()
    })
  })

  describe('DrupalBody', () => {
    it('should parse complete body field', () => {
      const validBody = {
        value: '<p>Raw HTML content</p>',
        format: 'full_html',
        processed: '<p>Processed HTML content</p>',
        summary: 'Short summary',
      }

      const result = S.decodeUnknownSync(DrupalBody)(validBody)

      expect(result.value).toBe('<p>Raw HTML content</p>')
      expect(result.format).toBe('full_html')
      expect(result.processed).toBe('<p>Processed HTML content</p>')
      expect(result.summary).toBe('Short summary')
    })

    it('should parse body without summary', () => {
      const bodyWithoutSummary = {
        value: '<p>Content</p>',
        processed: '<p>Content</p>',
      }

      const result = S.decodeUnknownSync(DrupalBody)(bodyWithoutSummary)

      expect(result.value).toBe('<p>Content</p>')
      expect(result.processed).toBe('<p>Content</p>')
      expect(result.summary).toBeUndefined()
    })
  })
})
