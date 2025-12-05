/**
 * ArticleCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ImageProps } from 'next/image'
import { ArticleCard } from './ArticleCard'

vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: ImageProps) => {
    // Using img in tests is acceptable as we're mocking Next.js Image
    const imgProps = { alt, src: typeof src === 'string' ? src : '', ...props }
    return <img {...imgProps} />
  },
}))

describe('ArticleCard', () => {
  const defaultProps = {
    title: 'Test Article Title',
    href: '/news/test-article',
  }

  describe('Rendering', () => {
    it('should render article element', () => {
      const { container } = render(<ArticleCard {...defaultProps} />)
      expect(container.querySelector('article')).toBeInTheDocument()
    })

    it('should render the title', () => {
      render(<ArticleCard {...defaultProps} />)
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Test Article Title')
    })

    it('should render as a link', () => {
      render(<ArticleCard {...defaultProps} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/news/test-article')
    })

    it('should have correct heading structure', () => {
      render(<ArticleCard {...defaultProps} />)
      const heading = screen.getByRole('heading', { level: 4 })
      expect(heading).toHaveClass('text-base')
      expect(heading).toHaveClass('leading-[1.4]')
      expect(heading).toHaveClass('lg:text-xl')
      expect(heading).toHaveClass('line-clamp-2')
    })
  })

  describe('Image Rendering', () => {
    it('should render image when imageUrl is provided', () => {
      render(<ArticleCard {...defaultProps} imageUrl="/images/test.jpg" imageAlt="Test image" />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Test image')
    })

    it('should use title as alt text when imageAlt is not provided', () => {
      render(<ArticleCard {...defaultProps} imageUrl="/images/test.jpg" />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Test Article Title')
    })

    it('should not render image when imageUrl is not provided', () => {
      render(<ArticleCard {...defaultProps} />)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('should have correct image container classes', () => {
      const { container } = render(<ArticleCard {...defaultProps} imageUrl="/images/test.jpg" />)
      const imageContainer = container.querySelector('.aspect-\\[16\\/10\\]')
      expect(imageContainer).toBeInTheDocument()
    })
  })

  describe('Metadata Rendering', () => {
    it('should render date when provided', () => {
      render(<ArticleCard {...defaultProps} date="15 januari 2025" />)
      expect(screen.getByText('15 januari 2025')).toBeInTheDocument()
    })

    it('should render tags when provided', () => {
      const tags = [{ name: 'Nieuws' }, { name: 'Competitie' }]
      render(<ArticleCard {...defaultProps} tags={tags} />)
      expect(screen.getByText('#Nieuws')).toBeInTheDocument()
      expect(screen.getByText('#Competitie')).toBeInTheDocument()
    })

    it('should render both date and tags', () => {
      const tags = [{ name: 'Nieuws' }]
      render(<ArticleCard {...defaultProps} date="15 januari 2025" tags={tags} />)
      expect(screen.getByText('15 januari 2025')).toBeInTheDocument()
      expect(screen.getByText('#Nieuws')).toBeInTheDocument()
    })

    it('should not render meta section when no date or tags', () => {
      render(<ArticleCard {...defaultProps} />)
      expect(screen.queryByTestId('article-meta')).not.toBeInTheDocument()
    })

    it('should render clock icon with date', () => {
      const { container } = render(<ArticleCard {...defaultProps} date="15 januari 2025" />)
      // FaClock renders as svg
      const clockIcon = container.querySelector('svg')
      expect(clockIcon).toBeInTheDocument()
    })

    it('should render tags icon with tags', () => {
      const tags = [{ name: 'Nieuws' }]
      const { container } = render(<ArticleCard {...defaultProps} tags={tags} />)
      // FaTags renders as svg
      const tagsIcon = container.querySelector('svg')
      expect(tagsIcon).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<ArticleCard {...defaultProps} className="custom-card" />)
      const article = container.querySelector('article')
      expect(article).toHaveClass('custom-card')
    })

    it('should handle empty tags array', () => {
      render(<ArticleCard {...defaultProps} tags={[]} />)
      expect(screen.queryByText(/#/)).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle long titles with line clamping', () => {
      const longTitle = 'This is a very long article title that should be clamped to two lines and show ellipsis when it exceeds the available space'
      render(<ArticleCard {...defaultProps} title={longTitle} />)
      const heading = screen.getByRole('heading', { level: 4 })
      expect(heading).toHaveClass('line-clamp-2')
      expect(heading).toHaveTextContent(longTitle)
    })

    it('should handle short titles', () => {
      render(<ArticleCard {...defaultProps} title="Win!" />)
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Win!')
    })

    it('should handle multiple tags', () => {
      const tags = [
        { name: 'Nieuws' },
        { name: 'Competitie' },
        { name: 'A-Kern' },
        { name: 'Thuis' },
      ]
      render(<ArticleCard {...defaultProps} tags={tags} />)
      tags.forEach((tag) => {
        expect(screen.getByText(`#${tag.name}`)).toBeInTheDocument()
      })
    })

    it('should handle special characters in title', () => {
      render(<ArticleCard {...defaultProps} title="KCVV wint derby: 3-1!" />)
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('KCVV wint derby: 3-1!')
    })

    it('should handle special characters in tags', () => {
      const tags = [{ name: 'U-21' }, { name: '1e Ploeg' }]
      render(<ArticleCard {...defaultProps} tags={tags} />)
      expect(screen.getByText('#U-21')).toBeInTheDocument()
      expect(screen.getByText('#1e Ploeg')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have mobile layout classes', () => {
      render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" />)
      const link = screen.getByRole('link')
      // flex on mobile
      expect(link).toHaveClass('flex')
    })

    it('should have desktop layout classes', () => {
      render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" />)
      const link = screen.getByRole('link')
      // block on desktop (lg:block)
      expect(link).toHaveClass('lg:block')
    })

    it('should have border on mobile', () => {
      const { container } = render(<ArticleCard {...defaultProps} />)
      const article = container.querySelector('article')
      expect(article).toHaveClass('border-b', 'border-[#e6e6e6]')
    })

    it('should remove border on desktop', () => {
      const { container } = render(<ArticleCard {...defaultProps} />)
      const article = container.querySelector('article')
      expect(article).toHaveClass('lg:border-b-0')
    })
  })

  describe('Hover Effects', () => {
    it('should have group class for hover coordination', () => {
      const { container } = render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" />)
      const article = container.querySelector('article')
      expect(article).toHaveClass('group')
    })

    it('should have image zoom classes', () => {
      render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" />)
      const image = screen.getByRole('img')
      expect(image).toHaveClass('lg:group-hover:scale-110')
    })

    it('should have card lift classes', () => {
      const { container } = render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" />)
      const contentCard = container.querySelector('.lg\\:group-hover\\:translate-y-\\[-5px\\]')
      expect(contentCard).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have semantic article element', () => {
      const { container } = render(<ArticleCard {...defaultProps} />)
      expect(container.querySelector('article')).toBeInTheDocument()
    })

    it('should have accessible link', () => {
      render(<ArticleCard {...defaultProps} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/news/test-article')
    })

    it('should have descriptive link text', () => {
      render(<ArticleCard {...defaultProps} />)
      const link = screen.getByRole('link')
      // Link contains the title which is descriptive
      expect(link).toContainElement(screen.getByText('Test Article Title'))
    })

    it('should have proper heading hierarchy', () => {
      render(<ArticleCard {...defaultProps} />)
      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument()
    })

    it('should have image alt text', () => {
      render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" imageAlt="Match photo" />)
      expect(screen.getByAltText('Match photo')).toBeInTheDocument()
    })
  })

  describe('Visual Consistency', () => {
    it('should match Gatsby CardTeaser design', () => {
      const { container } = render(
        <ArticleCard
          {...defaultProps}
          imageUrl="/test.jpg"
          date="15 januari 2025"
          tags={[{ name: 'Nieuws' }]}
        />
      )

      const article = container.querySelector('article')
      const heading = screen.getByRole('heading', { level: 4 })
      const image = screen.getByRole('img')

      // Card structure
      expect(article).toHaveClass('relative', 'group')

      // Title styling
      expect(heading).toHaveClass('text-base', 'lg:text-xl', 'line-clamp-2')

      // Image styling
      expect(image).toHaveClass('object-cover', 'transition-transform')
    })

    it('should have content card with shadow on desktop', () => {
      const { container } = render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" />)
      const contentCard = container.querySelector('.lg\\:shadow-\\[0_2px_20px_0_rgba\\(9\\,52\\,102\\,0\\.14\\)\\]')
      expect(contentCard).toBeInTheDocument()
    })

    it('should have negative margin overlap on desktop', () => {
      const { container } = render(<ArticleCard {...defaultProps} imageUrl="/test.jpg" />)
      const contentCard = container.querySelector('.lg\\:mt-\\[-40px\\]')
      expect(contentCard).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should render in a grid layout', () => {
      const { container } = render(
        <div className="grid grid-cols-3 gap-10">
          <ArticleCard {...defaultProps} />
          <ArticleCard {...defaultProps} title="Article 2" href="/news/article-2" />
          <ArticleCard {...defaultProps} title="Article 3" href="/news/article-3" />
        </div>
      )

      const articles = container.querySelectorAll('article')
      expect(articles).toHaveLength(3)
    })

    it('should work with full props', () => {
      render(
        <ArticleCard
          title="KCVV Elewijt behaalt belangrijke overwinning"
          href="/news/belangrijke-overwinning"
          imageUrl="https://picsum.photos/400/300"
          imageAlt="Match photo"
          date="15 januari 2025"
          tags={[{ name: 'Nieuws' }, { name: 'Competitie' }]}
        />
      )

      expect(screen.getByText('KCVV Elewijt behaalt belangrijke overwinning')).toBeInTheDocument()
      expect(screen.getByAltText('Match photo')).toBeInTheDocument()
      expect(screen.getByText('15 januari 2025')).toBeInTheDocument()
      expect(screen.getByText('#Nieuws')).toBeInTheDocument()
      expect(screen.getByText('#Competitie')).toBeInTheDocument()
    })
  })
})
