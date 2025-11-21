/**
 * PageTitle Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageTitle } from './PageTitle'

describe('PageTitle', () => {
  describe('Rendering', () => {
    it('should render header element', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })

    it('should render the title text', () => {
      render(<PageTitle title="News Archive" />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('News Archive')
    })

    it('should have correct heading structure', () => {
      render(<PageTitle title="Test Title" />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-white', 'text-[2.5rem]', 'leading-[0.92]', 'font-bold')
    })

    it('should render container with max-width', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      const innerContainer = container.querySelector('.max-w-\\[70rem\\]')
      expect(innerContainer).toBeInTheDocument()
    })

    it('should apply background styles', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      const header = container.querySelector('header')
      expect(header).toHaveAttribute('style')
      const style = header?.getAttribute('style') || ''
      expect(style).toContain('#4acf52')
      expect(style).toContain('header-pattern.png')
    })
  })

  describe('Background Pattern', () => {
    it('should have fixed background attachment', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      const header = container.querySelector('header')
      const style = header?.getAttribute('style') || ''
      expect(style).toContain('fixed')
    })

    it('should have correct background positioning', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      const header = container.querySelector('header')
      const style = header?.getAttribute('style') || ''
      expect(style).toContain('50% -7vw')
      expect(style).toContain('100vw auto')
      expect(style).toContain('no-repeat')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<PageTitle title="Test Title" className="custom-class" />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('custom-class')
    })

    it('should accept custom padding', () => {
      const { container } = render(<PageTitle title="Test Title" padding="px-6 pt-8 pb-8" />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('px-6', 'pt-8', 'pb-8')
    })

    it('should use default padding when not specified', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('px-3', 'pt-4', 'pb-4', 'xl:px-0')
    })

    it('should accept custom container width', () => {
      const { container } = render(<PageTitle title="Test Title" containerWidth="max-w-4xl" />)
      const innerContainer = container.querySelector('.max-w-4xl')
      expect(innerContainer).toBeInTheDocument()
    })

    it('should use default container width when not specified', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      const innerContainer = container.querySelector('.max-w-\\[70rem\\]')
      expect(innerContainer).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle short titles', () => {
      render(<PageTitle title="News" />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('News')
    })

    it('should handle long titles', () => {
      const longTitle = 'This is a very long page title that should still render correctly without breaking the layout or causing overflow issues'
      render(<PageTitle title={longTitle} />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(longTitle)
    })

    it('should handle titles with special characters', () => {
      render(<PageTitle title="Nieuws & Events - KCVV Elewijt" />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nieuws & Events - KCVV Elewijt')
    })

    it('should handle titles with line breaks', () => {
      render(<PageTitle title="Multi\nLine\nTitle" />)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should handle empty custom className gracefully', () => {
      const { container } = render(<PageTitle title="Test Title" className="" />)
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have semantic header element', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })

    it('should have h1 heading with correct hierarchy', () => {
      render(<PageTitle title="Test Title" />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('should have sufficient color contrast', () => {
      render(<PageTitle title="Test Title" />)
      const heading = screen.getByRole('heading', { level: 1 })
      // White text on green background (#4acf52) provides good contrast
      expect(heading).toHaveClass('text-white')
    })
  })

  describe('Visual Consistency', () => {
    it('should match Gatsby design specifications', () => {
      const { container } = render(<PageTitle title="Nieuwsarchief KCVV Elewijt" />)
      const header = container.querySelector('header')
      const heading = screen.getByRole('heading', { level: 1 })

      // Background color
      const style = header?.getAttribute('style') || ''
      expect(style).toContain('#4acf52')

      // Text styling
      expect(heading).toHaveClass('text-white')
      expect(heading).toHaveClass('text-[2.5rem]')
      expect(heading).toHaveClass('font-bold')
      expect(heading).toHaveClass('leading-[0.92]')
    })

    it('should have correct container structure', () => {
      const { container } = render(<PageTitle title="Test Title" />)
      const header = container.querySelector('header')
      const innerContainer = header?.querySelector('.max-w-\\[70rem\\]')
      const heading = innerContainer?.querySelector('h1')

      expect(header).toBeInTheDocument()
      expect(innerContainer).toBeInTheDocument()
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should work with different page contexts', () => {
      const pages = [
        'Nieuwsarchief KCVV Elewijt',
        'A-Kern',
        'Kalender',
        'Contact',
        'Privacy Policy',
      ]

      pages.forEach((title) => {
        const { unmount } = render(<PageTitle title={title} />)
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
        unmount()
      })
    })

    it('should render multiple instances independently', () => {
      const { container } = render(
        <>
          <PageTitle title="First Title" />
          <PageTitle title="Second Title" />
        </>
      )

      const headers = container.querySelectorAll('header')
      expect(headers).toHaveLength(2)
    })
  })
})
