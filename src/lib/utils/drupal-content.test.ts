import { describe, it, expect } from 'vitest'
import { isDrupalImage, convertDrupalImagesToAbsolute } from './drupal-content'

describe('Drupal Content Utilities', () => {
  describe('isDrupalImage', () => {
    it('should return true for a valid Drupal image object', () => {
      const validImage = {
        uri: { url: 'https://example.com/image.jpg' },
        alt: 'Test Image',
        width: 100,
        height: 100,
      }
      expect(isDrupalImage(validImage)).toBe(true)
    })

    it('should return true for a valid Drupal image object without optional properties', () => {
      const validImage = {
        uri: { url: 'https://example.com/image.jpg' },
      }
      expect(isDrupalImage(validImage)).toBe(true)
    })

    it('should return false for null or undefined', () => {
      expect(isDrupalImage(null)).toBe(false)
      expect(isDrupalImage(undefined)).toBe(false)
    })

    it('should return false for an object missing the uri property', () => {
      const invalidImage = { alt: 'Test Image' }
      expect(isDrupalImage(invalidImage)).toBe(false)
    })

    it('should return false for an object missing the url property inside uri', () => {
      const invalidImage = { uri: {} }
      expect(isDrupalImage(invalidImage)).toBe(false)
    })

    it('should return false for a non-object', () => {
      expect(isDrupalImage('string')).toBe(false)
      expect(isDrupalImage(123)).toBe(false)
    })
  })

  describe('convertDrupalImagesToAbsolute', () => {
    const defaultBaseUrl = 'https://api.kcvvelewijt.be'

    it('should convert relative Drupal image URLs to absolute URLs', () => {
      const html = '<img src="/sites/default/files/image.jpg" alt="Test">'
      const expected = `<img src="${defaultBaseUrl}/sites/default/files/image.jpg" alt="Test">`
      expect(convertDrupalImagesToAbsolute(html)).toBe(expected)
    })

    it('should handle single quotes in src attributes', () => {
      const html = "<img src='/sites/default/files/image.jpg' alt='Test'>"
      const expected = `<img src='${defaultBaseUrl}/sites/default/files/image.jpg' alt='Test'>`
      expect(convertDrupalImagesToAbsolute(html)).toBe(expected)
    })

    it('should convert multiple images in the same HTML string', () => {
      const html = `
        <div>
          <img src="/sites/default/files/image1.jpg">
          <p>Text</p>
          <img src="/sites/default/files/image2.png">
        </div>
      `
      const expected = `
        <div>
          <img src="${defaultBaseUrl}/sites/default/files/image1.jpg">
          <p>Text</p>
          <img src="${defaultBaseUrl}/sites/default/files/image2.png">
        </div>
      `
      expect(convertDrupalImagesToAbsolute(html)).toBe(expected)
    })

    it('should not modify absolute URLs', () => {
      const html = '<img src="https://other-domain.com/image.jpg">'
      expect(convertDrupalImagesToAbsolute(html)).toBe(html)
    })

    it('should not modify relative URLs that do not start with /sites/default/', () => {
      const html = '<img src="/other/path/image.jpg">'
      expect(convertDrupalImagesToAbsolute(html)).toBe(html)
    })

    it('should use a custom base URL if provided', () => {
      const html = '<img src="/sites/default/files/image.jpg">'
      const customBaseUrl = 'https://custom-api.com'
      const expected = `<img src="${customBaseUrl}/sites/default/files/image.jpg">`
      expect(convertDrupalImagesToAbsolute(html, customBaseUrl)).toBe(expected)
    })
  })
})
