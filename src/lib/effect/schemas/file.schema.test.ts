/**
 * File Schema Tests
 * Validates File entity parsing and type safety
 */

import { describe, it, expect } from 'vitest'
import { Schema as S } from 'effect'
import { File, FileAttributes, FileUri } from './file.schema'

describe('File Schema', () => {
  describe('FileUri', () => {
    it('should parse valid file URI', () => {
      const validUri = {
        url: 'https://api.kcvvelewijt.be/sites/default/files/2024-01/hero.jpg',
      }

      const result = S.decodeUnknownSync(FileUri)(validUri)

      expect(result.url).toBe('https://api.kcvvelewijt.be/sites/default/files/2024-01/hero.jpg')
    })

    it('should parse relative URI', () => {
      const relativeUri = {
        url: '/sites/default/files/image.jpg',
      }

      const result = S.decodeUnknownSync(FileUri)(relativeUri)

      expect(result.url).toBe('/sites/default/files/image.jpg')
    })

    it('should reject missing url field', () => {
      const invalidUri = {}

      expect(() => S.decodeUnknownSync(FileUri)(invalidUri)).toThrow()
    })
  })

  describe('FileAttributes', () => {
    it('should parse valid file attributes', () => {
      const validAttributes = {
        drupal_internal__fid: 789,
        filename: 'article-hero.jpg',
        uri: { url: 'https://api.kcvvelewijt.be/sites/default/files/article-hero.jpg' },
        filemime: 'image/jpeg',
        filesize: 245678,
        status: true,
        created: '2024-01-15T10:30:00Z',
        changed: '2024-01-20T14:45:00Z',
      }

      const result = S.decodeUnknownSync(FileAttributes)(validAttributes)

      expect(result.drupal_internal__fid).toBe(789)
      expect(result.filename).toBe('article-hero.jpg')
      expect(result.uri.url).toBe('https://api.kcvvelewijt.be/sites/default/files/article-hero.jpg')
      expect(result.filemime).toBe('image/jpeg')
      expect(result.filesize).toBe(245678)
      expect(result.created).toBeInstanceOf(Date)
    })

    it('should parse minimal file attributes with only uri', () => {
      const minimalAttributes = {
        uri: { url: '/sites/default/files/image.jpg' },
      }

      const result = S.decodeUnknownSync(FileAttributes)(minimalAttributes)

      expect(result.uri.url).toBe('/sites/default/files/image.jpg')
      expect(result.filename).toBeUndefined()
      expect(result.filemime).toBeUndefined()
    })

    it('should reject attributes without uri', () => {
      const invalidAttributes = {
        filename: 'test.jpg',
        filesize: 12345,
      }

      expect(() => S.decodeUnknownSync(FileAttributes)(invalidAttributes)).toThrow()
    })

    it('should convert date strings to Date objects', () => {
      const attributes = {
        uri: { url: '/sites/default/files/test.jpg' },
        created: '2024-01-15T10:30:00Z',
        changed: '2024-01-20T08:15:00Z',
      }

      const result = S.decodeUnknownSync(FileAttributes)(attributes)

      expect(result.created).toBeInstanceOf(Date)
      expect(result.changed).toBeInstanceOf(Date)
      expect(result.created?.toISOString()).toBe('2024-01-15T10:30:00.000Z')
    })
  })

  describe('File', () => {
    it('should parse complete file entity', () => {
      const validFile = {
        id: 'file-abc-123',
        type: 'file--file',
        attributes: {
          drupal_internal__fid: 456,
          filename: 'team-photo.jpg',
          uri: { url: 'https://api.kcvvelewijt.be/sites/default/files/team-photo.jpg' },
          filemime: 'image/jpeg',
          filesize: 156789,
          status: true,
        },
      }

      const result = S.decodeUnknownSync(File)(validFile)

      expect(result.id).toBe('file-abc-123')
      expect(result.type).toBe('file--file')
      expect(result.attributes.drupal_internal__fid).toBe(456)
      expect(result.attributes.filename).toBe('team-photo.jpg')
      expect(result.attributes.filesize).toBe(156789)
    })

    it('should parse minimal file entity', () => {
      const minimalFile = {
        id: 'file-123',
        type: 'file--file',
        attributes: {
          uri: { url: '/sites/default/files/minimal.jpg' },
        },
      }

      const result = S.decodeUnknownSync(File)(minimalFile)

      expect(result.id).toBe('file-123')
      expect(result.type).toBe('file--file')
      expect(result.attributes.uri.url).toBe('/sites/default/files/minimal.jpg')
    })

    it('should reject invalid type literal', () => {
      const invalidFile = {
        id: 'file-123',
        type: 'file--image', // Should be 'file--file'
        attributes: {
          uri: { url: '/test.jpg' },
        },
      }

      expect(() => S.decodeUnknownSync(File)(invalidFile)).toThrow()
    })

    it('should reject missing required fields', () => {
      const missingType = {
        id: 'file-123',
        attributes: {
          uri: { url: '/test.jpg' },
        },
      }

      expect(() => S.decodeUnknownSync(File)(missingType)).toThrow()
    })
  })

  describe('Real-world JSON:API example', () => {
    it('should parse file from Drupal JSON:API response', () => {
      // Actual structure from Drupal JSON:API included section
      const drupalFile = {
        type: 'file--file',
        id: '9d6f8e4f-5a3b-4c2d-8f4b-9a1c2d3e4f5b',
        attributes: {
          drupal_internal__fid: 423,
          langcode: 'nl',
          filename: 'eerste-elftal-2024.jpg',
          uri: {
            url: '/sites/default/files/2024-01/eerste-elftal-2024.jpg',
          },
          filemime: 'image/jpeg',
          filesize: 285647,
          status: true,
          created: '2024-01-15T10:30:00+01:00',
          changed: '2024-01-15T10:30:00+01:00',
        },
        links: {
          self: {
            href: 'https://api.kcvvelewijt.be/jsonapi/file/file/9d6f8e4f-5a3b-4c2d-8f4b-9a1c2d3e4f5b',
          },
        },
      }

      const result = S.decodeUnknownSync(File)(drupalFile)

      expect(result.id).toBe('9d6f8e4f-5a3b-4c2d-8f4b-9a1c2d3e4f5b')
      expect(result.type).toBe('file--file')
      expect(result.attributes.drupal_internal__fid).toBe(423)
      expect(result.attributes.filename).toBe('eerste-elftal-2024.jpg')
      expect(result.attributes.uri.url).toBe('/sites/default/files/2024-01/eerste-elftal-2024.jpg')
      expect(result.attributes.filemime).toBe('image/jpeg')
      expect(result.attributes.filesize).toBe(285647)
      expect(result.attributes.created).toBeInstanceOf(Date)
    })

    it('should handle various image file types', () => {
      const pngFile = {
        id: 'file-png',
        type: 'file--file',
        attributes: {
          filename: 'logo.png',
          uri: { url: '/sites/default/files/logo.png' },
          filemime: 'image/png',
          filesize: 54321,
        },
      }

      const result = S.decodeUnknownSync(File)(pngFile)

      expect(result.attributes.filemime).toBe('image/png')
    })

    it('should reject PDF files (only JPEG/PNG allowed for security)', () => {
      const pdfFile = {
        id: 'file-pdf',
        type: 'file--file',
        attributes: {
          filename: 'rules.pdf',
          uri: { url: '/sites/default/files/documents/rules.pdf' },
          filemime: 'application/pdf',
          filesize: 987654,
        },
      }

      // PDF files should be rejected as per security policy
      expect(() => S.decodeUnknownSync(File)(pdfFile)).toThrow()
    })
  })
})
