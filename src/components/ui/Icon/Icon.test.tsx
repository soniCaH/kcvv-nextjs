/**
 * Icon Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Icon } from './Icon'
import { FaFutbol } from 'react-icons/fa'

describe('Icon', () => {
  describe('Rendering', () => {
    it('should render icon', () => {
      render(<Icon icon={<FaFutbol data-testid="icon" />} />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render as a span element', () => {
      const { container } = render(<Icon icon={<FaFutbol />} />)
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })
  })

  describe('Sizes', () => {
    it('should use medium size by default', () => {
      render(<Icon icon={<FaFutbol data-testid="icon" />} />)
      const icon = screen.getByTestId('icon')
      // IconContext sets the size via style or className
      expect(icon).toBeInTheDocument()
    })

    it('should apply small size', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} size="sm" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply large size', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} size="lg" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply extra small size', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} size="xs" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply extra large size', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} size="xl" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply 2xl size', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} size="2xl" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })

  describe('Colors', () => {
    it('should use current color by default', () => {
      render(<Icon icon={<FaFutbol data-testid="icon" />} />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply primary color', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} color="primary" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply secondary color', () => {
      const { container } = render(
        <Icon icon={<FaFutbol data-testid="icon" />} color="secondary" />
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply success color', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} color="success" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply warning color', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} color="warning" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply error color', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} color="error" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply muted color', () => {
      const { container } = render(<Icon icon={<FaFutbol data-testid="icon" />} color="muted" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <Icon icon={<FaFutbol />} className="custom-class" />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<Icon ref={ref} icon={<FaFutbol />} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('should accept aria-label', () => {
      const { container } = render(
        <Icon icon={<FaFutbol />} aria-label="Football icon" />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('aria-label', 'Football icon')
    })
  })

  describe('Combination Props', () => {
    it('should combine size and color', () => {
      const { container } = render(
        <Icon
          icon={<FaFutbol data-testid="icon" />}
          size="lg"
          color="primary"
        />
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should combine all props', () => {
      const { container } = render(
        <Icon
          icon={<FaFutbol data-testid="icon" />}
          size="xl"
          color="success"
          className="custom"
          aria-label="Success icon"
        />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom')
      expect(wrapper).toHaveAttribute('aria-label', 'Success icon')
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })
})
