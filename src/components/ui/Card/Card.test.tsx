/**
 * Card Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardImage,
} from './Card'

describe('Card', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should render as a div element', () => {
      const { container } = render(<Card>Content</Card>)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Card>Default</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('border', 'border-[#edeff4]')
    })

    it('should render teaser variant', () => {
      const { container } = render(<Card variant="teaser">Teaser</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('overflow-hidden')
    })

    it('should render bordered variant', () => {
      const { container } = render(<Card variant="bordered">Bordered</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('border-2')
    })

    it('should render elevated variant', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('shadow-md')
    })
  })

  describe('Padding', () => {
    it('should not have padding by default', () => {
      const { container } = render(<Card>No padding</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('p-4')
    })

    it('should add padding when padded prop is true', () => {
      const { container } = render(<Card padded>Padded</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-4')
    })
  })

  describe('Hoverable', () => {
    it('should not be hoverable by default', () => {
      const { container } = render(<Card>Not hoverable</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('hover:shadow-lg')
    })

    it('should add hover effects when hoverable is true', () => {
      const { container } = render(<Card hoverable>Hoverable</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-lg')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-class">Custom</Card>)
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-class')
    })

    it('should forward ref', () => {
      const ref = { current: null }
      render(<Card ref={ref}>Ref Card</Card>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })
})

describe('CardHeader', () => {
  it('should render with children', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('should have header styles', () => {
    const { container } = render(<CardHeader>Header</CardHeader>)
    const header = container.firstChild as HTMLElement
    expect(header).toHaveClass('px-4', 'py-3', 'border-b')
  })

  it('should accept custom className', () => {
    const { container } = render(<CardHeader className="custom">Header</CardHeader>)
    const header = container.firstChild as HTMLElement
    expect(header).toHaveClass('custom')
  })
})

describe('CardContent', () => {
  it('should render with children', () => {
    render(<CardContent>Content text</CardContent>)
    expect(screen.getByText('Content text')).toBeInTheDocument()
  })

  it('should have content padding', () => {
    const { container } = render(<CardContent>Content</CardContent>)
    const content = container.firstChild as HTMLElement
    expect(content).toHaveClass('p-4')
  })

  it('should accept custom className', () => {
    const { container } = render(<CardContent className="custom">Content</CardContent>)
    const content = container.firstChild as HTMLElement
    expect(content).toHaveClass('custom')
  })
})

describe('CardFooter', () => {
  it('should render with children', () => {
    render(<CardFooter>Footer content</CardFooter>)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('should have footer styles', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>)
    const footer = container.firstChild as HTMLElement
    expect(footer).toHaveClass('px-4', 'py-3', 'border-t')
  })

  it('should accept custom className', () => {
    const { container } = render(<CardFooter className="custom">Footer</CardFooter>)
    const footer = container.firstChild as HTMLElement
    expect(footer).toHaveClass('custom')
  })
})

describe('CardImage', () => {
  it('should render image with src and alt', () => {
    render(<CardImage src="/test.jpg" alt="Test image" />)
    const img = screen.getByRole('img', { name: /test image/i })
    expect(img).toBeInTheDocument()
    // Next.js Image transforms the src, so we just check it exists
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('should use 3:2 aspect ratio by default', () => {
    const { container } = render(<CardImage src="/test.jpg" alt="Test" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('aspect-[3/2]')
  })

  it('should support 1:1 aspect ratio', () => {
    const { container } = render(
      <CardImage src="/test.jpg" alt="Test" aspectRatio="1:1" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('aspect-square')
  })

  it('should support 16:9 aspect ratio', () => {
    const { container } = render(
      <CardImage src="/test.jpg" alt="Test" aspectRatio="16:9" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('aspect-video')
  })

  it('should support 4:3 aspect ratio', () => {
    const { container } = render(
      <CardImage src="/test.jpg" alt="Test" aspectRatio="4:3" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('aspect-[4/3]')
  })



  it('should have object-cover on image', () => {
    render(<CardImage src="/test.jpg" alt="Test" />)
    const img = screen.getByRole('img')
    expect(img).toHaveClass('object-cover')
  })
})

describe('Composed Card', () => {
  it('should render all components together', () => {
    render(
      <Card variant="teaser" hoverable>
        <CardImage src="/test.jpg" alt="Article" />
        <CardHeader>
          <h3>Article Title</h3>
        </CardHeader>
        <CardContent>
          <p>Article description</p>
        </CardContent>
        <CardFooter>
          <span>Read more</span>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Article Title')).toBeInTheDocument()
    expect(screen.getByText('Article description')).toBeInTheDocument()
    expect(screen.getByText('Read more')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /article/i })).toBeInTheDocument()
  })

  it('should work with minimal composition', () => {
    render(
      <Card padded>
        <h3>Simple Card</h3>
        <p>Just some content</p>
      </Card>
    )

    expect(screen.getByText('Simple Card')).toBeInTheDocument()
    expect(screen.getByText('Just some content')).toBeInTheDocument()
  })
})
