/**
 * SponsorsStats Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SponsorsStats } from './SponsorsStats'

describe('SponsorsStats', () => {
  describe('Rendering', () => {
    it('renders with total sponsors count', () => {
      render(<SponsorsStats totalSponsors={42} />)

      expect(screen.getByText('42 trouwe partners')).toBeInTheDocument()
      expect(screen.getByText('steunen KCVV Elewijt')).toBeInTheDocument()
    })

    it('renders handshake emoji', () => {
      const { container } = render(<SponsorsStats totalSponsors={10} />)

      expect(container.textContent).toContain('🤝')
    })

    it('renders description text', () => {
      render(<SponsorsStats totalSponsors={20} />)

      expect(
        screen.getByText(/Samen maken we voetbal mogelijk/i)
      ).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<SponsorsStats totalSponsors={5} className="custom-class" />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-class')
    })
  })

  describe('Pluralization', () => {
    it('handles singular (1 sponsor)', () => {
      render(<SponsorsStats totalSponsors={1} />)

      expect(screen.getByText('1 trouwe partner')).toBeInTheDocument()
    })

    it('handles zero sponsors', () => {
      render(<SponsorsStats totalSponsors={0} />)

      expect(screen.getByText('0 trouwe partners')).toBeInTheDocument()
    })

    it('handles large numbers', () => {
      render(<SponsorsStats totalSponsors={150} />)

      expect(screen.getByText('150 trouwe partners')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('has proper heading hierarchy', () => {
      render(<SponsorsStats totalSponsors={30} />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('30 trouwe partners')
    })

    it('applies center text alignment', () => {
      const { container } = render(<SponsorsStats totalSponsors={10} />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('text-center')
    })
  })
})
