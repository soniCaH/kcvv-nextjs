/**
 * Sponsors Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ImageProps } from 'next/image'
import { Sponsors, type Sponsor } from './Sponsors'

vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: ImageProps) => {
    // Using img in tests is acceptable as we're mocking Next.js Image
    const imgProps = { alt, src: typeof src === 'string' ? src : '', ...props }
    return <img {...imgProps} />
  },
}))

describe('Sponsors', () => {
  const mockSponsors: Sponsor[] = [
    {
      id: '1',
      name: 'Sponsor One',
      logo: '/logos/sponsor1.png',
      url: 'https://sponsor1.com',
    },
    {
      id: '2',
      name: 'Sponsor Two',
      logo: '/logos/sponsor2.png',
      url: 'https://sponsor2.com',
    },
    {
      id: '3',
      name: 'Sponsor Three',
      logo: '/logos/sponsor3.png',
    },
    {
      id: '4',
      name: 'Sponsor Four',
      logo: '/logos/sponsor4.png',
    },
  ]

  describe('Rendering', () => {
    it('renders section with default title', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      expect(screen.getByText('Onze sponsors')).toBeInTheDocument()
    })

    it('renders custom title when provided', () => {
      render(<Sponsors sponsors={mockSponsors} title="Our Partners" />)

      expect(screen.getByText('Our Partners')).toBeInTheDocument()
    })

    it('renders default description', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      expect(
        screen.getByText('KCVV Elewijt wordt mede mogelijk gemaakt door onze trouwe sponsors.')
      ).toBeInTheDocument()
    })

    it('renders custom description when provided', () => {
      render(<Sponsors sponsors={mockSponsors} description="Thank you to our sponsors" />)

      expect(screen.getByText('Thank you to our sponsors')).toBeInTheDocument()
    })

    it('renders all sponsor logos', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      const logos = screen.getAllByRole('img')
      expect(logos).toHaveLength(4)
      expect(logos[0]).toHaveAttribute('alt', 'Sponsor One')
      expect(logos[1]).toHaveAttribute('alt', 'Sponsor Two')
      expect(logos[2]).toHaveAttribute('alt', 'Sponsor Three')
      expect(logos[3]).toHaveAttribute('alt', 'Sponsor Four')
    })

    it('renders "View All" link by default', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      const link = screen.getByRole('link', { name: /Alle sponsors/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/sponsors')
    })

    it('does not render "View All" link when showViewAll is false', () => {
      render(<Sponsors sponsors={mockSponsors} showViewAll={false} />)

      expect(screen.queryByRole('link', { name: /Alle sponsors/i })).not.toBeInTheDocument()
    })

    it('uses custom viewAllHref when provided', () => {
      render(<Sponsors sponsors={mockSponsors} viewAllHref="/partners" />)

      const link = screen.getByRole('link', { name: /Alle sponsors/i })
      expect(link).toHaveAttribute('href', '/partners')
    })

    it('returns null when no sponsors provided', () => {
      const { container } = render(<Sponsors sponsors={[]} />)

      expect(container.firstChild).toBeNull()
    })

    it('applies custom className when provided', () => {
      const { container } = render(<Sponsors sponsors={mockSponsors} className="custom-class" />)

      const section = container.querySelector('section')
      expect(section).toHaveClass('custom-class')
    })
  })

  describe('Grid Layout', () => {
    it('renders 4-column grid by default', () => {
      const { container } = render(<Sponsors sponsors={mockSponsors} />)

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-4')
    })

    it('renders 2-column grid when columns=2', () => {
      const { container } = render(<Sponsors sponsors={mockSponsors} columns={2} />)

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-2')
    })

    it('renders 3-column grid when columns=3', () => {
      const { container } = render(<Sponsors sponsors={mockSponsors} columns={3} />)

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-3')
    })

    it('renders 5-column grid when columns=5', () => {
      const { container } = render(<Sponsors sponsors={mockSponsors} columns={5} />)

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-5')
    })

    it('renders 6-column grid when columns=6', () => {
      const { container} = render(<Sponsors sponsors={mockSponsors} columns={6} />)

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-6')
    })
  })

  describe('Sponsor Links', () => {
    it('renders sponsors with URLs as clickable links', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      const link1 = screen.getByLabelText('Visit Sponsor One website')
      expect(link1).toHaveAttribute('href', 'https://sponsor1.com')
      expect(link1).toHaveAttribute('target', '_blank')
      expect(link1).toHaveAttribute('rel', 'noopener noreferrer')

      const link2 = screen.getByLabelText('Visit Sponsor Two website')
      expect(link2).toHaveAttribute('href', 'https://sponsor2.com')
    })

    it('renders sponsors without URLs as non-clickable divs', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      // Sponsors 3 and 4 don't have URLs, so they shouldn't have aria-labels
      expect(screen.queryByLabelText('Visit Sponsor Three website')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Visit Sponsor Four website')).not.toBeInTheDocument()
    })
  })

  describe('Theme Variants', () => {
    it('applies light theme classes by default', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      const title = screen.getByText('Onze sponsors')
      expect(title).toHaveClass('text-gray-900')

      const description = screen.getByText(/KCVV Elewijt wordt mede mogelijk gemaakt/)
      expect(description).toHaveClass('text-gray-600')
    })

    it('applies dark theme classes when variant="dark"', () => {
      render(<Sponsors sponsors={mockSponsors} variant="dark" />)

      const title = screen.getByText('Onze sponsors')
      expect(title).toHaveClass('text-white')

      const description = screen.getByText(/KCVV Elewijt wordt mede mogelijk gemaakt/)
      expect(description).toHaveClass('text-white/80')
    })

    it('inverts logos in dark theme', () => {
      render(<Sponsors sponsors={mockSponsors} variant="dark" />)

      const logos = screen.getAllByRole('img')
      logos.forEach((logo) => {
        expect(logo).toHaveClass('filter', 'invert')
      })
    })

    it('does not invert logos in light theme', () => {
      render(<Sponsors sponsors={mockSponsors} variant="light" />)

      const logos = screen.getAllByRole('img')
      logos.forEach((logo) => {
        expect(logo).not.toHaveClass('invert')
      })
    })
  })

  describe('Accessibility', () => {
    it('renders semantic section element', () => {
      const { container } = render(<Sponsors sponsors={mockSponsors} />)

      expect(container.querySelector('section')).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Onze sponsors')
    })

    it('has descriptive alt text for all logos', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      expect(screen.getByAltText('Sponsor One')).toBeInTheDocument()
      expect(screen.getByAltText('Sponsor Two')).toBeInTheDocument()
      expect(screen.getByAltText('Sponsor Three')).toBeInTheDocument()
      expect(screen.getByAltText('Sponsor Four')).toBeInTheDocument()
    })

    it('has descriptive aria-labels for external links', () => {
      render(<Sponsors sponsors={mockSponsors} />)

      expect(screen.getByLabelText('Visit Sponsor One website')).toBeInTheDocument()
      expect(screen.getByLabelText('Visit Sponsor Two website')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles single sponsor', () => {
      render(<Sponsors sponsors={[mockSponsors[0]]} />)

      expect(screen.getAllByRole('img')).toHaveLength(1)
    })

    it('handles many sponsors', () => {
      const manySponsors = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Sponsor ${i + 1}`,
        logo: `/logos/sponsor${i + 1}.png`,
      }))

      render(<Sponsors sponsors={manySponsors} />)

      expect(screen.getAllByRole('img')).toHaveLength(20)
    })

    it('handles sponsors with special characters in names', () => {
      const specialSponsors: Sponsor[] = [
        {
          id: '1',
          name: 'Café & Bar',
          logo: '/logos/cafe.png',
        },
      ]

      render(<Sponsors sponsors={specialSponsors} />)

      expect(screen.getByAltText('Café & Bar')).toBeInTheDocument()
    })
  })
})
