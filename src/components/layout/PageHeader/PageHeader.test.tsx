/**
 * PageHeader Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PageHeader } from './PageHeader'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

vi.mock('next/image', () => ({
  default: ({ alt, ...props }: ImageProps) => (
    <img alt={alt} {...props} />
  ),
}))

describe('PageHeader', () => {
  describe('Rendering', () => {
    it('should render header', () => {
      const { container } = render(<PageHeader />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })

    it('should render logo', () => {
      render(<PageHeader />)
      const logos = screen.getAllByAltText('KCVV ELEWIJT')
      expect(logos.length).toBeGreaterThan(0)
    })

    it('should have fixed navigation', () => {
      const { container } = render(<PageHeader />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('fixed', 'top-0')
    })
  })

  describe('Mobile View', () => {
    it('should render mobile hamburger button', () => {
      render(<PageHeader />)
      const menuButton = screen.getByLabelText(/toggle navigation menu/i)
      expect(menuButton).toBeInTheDocument()
    })

    it('should render mobile search link', () => {
      render(<PageHeader />)
      const searchLinks = screen.getAllByLabelText(/search/i)
      expect(searchLinks.length).toBeGreaterThan(0)
    })

    it('should open mobile menu when hamburger clicked', async () => {
      const user = userEvent.setup()
      render(<PageHeader />)

      const menuButton = screen.getByLabelText(/toggle navigation menu/i)
      await user.click(menuButton)

      // Menu should be visible (check for close button)
      const closeButton = screen.getByLabelText(/close menu/i)
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Desktop View', () => {
    it('should render navigation', () => {
      const { container } = render(<PageHeader />)
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PageHeader />)
      expect(screen.getByLabelText(/toggle navigation menu/i)).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<PageHeader />)

      // Tab to hamburger button
      await user.tab()
      expect(screen.getByLabelText(/toggle navigation menu/i)).toHaveFocus()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<PageHeader className="custom-class" />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('custom-class')
    })
  })
})
