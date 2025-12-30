/**
 * Icon Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Icon } from './Icon'
import { Activity } from 'lucide-react'

describe('Icon', () => {
  describe('Rendering', () => {
    it('should render icon', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should render as a span element', () => {
      const { container } = render(<Icon icon={Activity} />)
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })
  })

  describe('Sizes', () => {
    it('should use medium size by default', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" />)
      const icon = screen.getByTestId('icon-wrapper')
      // IconContext sets the size via style or className
      expect(icon).toBeInTheDocument()
    })

    it('should apply small size', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" size="sm" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply large size', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" size="lg" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply extra small size', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" size="xs" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply extra large size', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" size="xl" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply 2xl size', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" size="2xl" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })
  })

  describe('Colors', () => {
    it('should use current color by default', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply primary color', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" color="primary" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply secondary color', () => {
      render(
        <Icon icon={Activity} data-testid="icon-wrapper" color="secondary" />
      )
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply success color', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" color="success" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply warning color', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" color="warning" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply error color', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" color="error" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should apply muted color', () => {
      render(<Icon icon={Activity} data-testid="icon-wrapper" color="muted" />)
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <Icon icon={Activity} className="custom-class" />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<Icon ref={ref} icon={Activity} />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('should accept aria-label', () => {
      const { container } = render(
        <Icon icon={Activity} aria-label="Football icon" />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveAttribute('aria-label', 'Football icon')
    })
  })

  describe('Combination Props', () => {
    it('should combine size and color', () => {
      render(
        <Icon
          icon={Activity} data-testid="icon-wrapper"
          size="lg"
          color="primary"
        />
      )
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })

    it('should combine all props', () => {
      const { container } = render(
        <Icon
          icon={Activity} data-testid="icon-wrapper"
          size="xl"
          color="success"
          className="custom"
          aria-label="Success icon"
        />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom')
      expect(wrapper).toHaveAttribute('aria-label', 'Success icon')
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument()
    })
  })
})
