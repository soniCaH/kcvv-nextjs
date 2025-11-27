import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LatestNews, type LatestNewsArticle } from './LatestNews'

describe('LatestNews', () => {
  const mockArticles: LatestNewsArticle[] = [
    {
      href: '/news/article-1',
      title: 'First News Article',
      imageUrl: '/images/article-1.jpg',
      imageAlt: 'Article 1 image',
      date: '20 januari 2025',
      tags: [{ name: 'Ploeg' }],
    },
    {
      href: '/news/article-2',
      title: 'Second News Article',
      imageUrl: '/images/article-2.jpg',
      imageAlt: 'Article 2 image',
      date: '19 januari 2025',
      tags: [{ name: 'Jeugd' }],
    },
    {
      href: '/news/article-3',
      title: 'Third News Article',
      imageUrl: '/images/article-3.jpg',
      imageAlt: 'Article 3 image',
      date: '18 januari 2025',
    },
  ]

  it('renders section with default title', () => {
    render(<LatestNews articles={mockArticles} />)

    expect(screen.getByText('Laatste nieuws')).toBeInTheDocument()
  })

  it('renders custom title when provided', () => {
    render(<LatestNews articles={mockArticles} title="Nieuwsoverzicht" />)

    expect(screen.getByText('Nieuwsoverzicht')).toBeInTheDocument()
  })

  it('renders all provided articles', () => {
    render(<LatestNews articles={mockArticles} />)

    expect(screen.getByText('First News Article')).toBeInTheDocument()
    expect(screen.getByText('Second News Article')).toBeInTheDocument()
    expect(screen.getByText('Third News Article')).toBeInTheDocument()
  })

  it('renders "View All" link by default', () => {
    render(<LatestNews articles={mockArticles} />)

    const viewAllLink = screen.getByRole('link', { name: /Bekijk alles/i })
    expect(viewAllLink).toBeInTheDocument()
    expect(viewAllLink).toHaveAttribute('href', '/news')
  })

  it('does not render "View All" link when showViewAll is false', () => {
    render(<LatestNews articles={mockArticles} showViewAll={false} />)

    expect(screen.queryByRole('link', { name: /Bekijk alles/i })).not.toBeInTheDocument()
  })

  it('uses custom viewAllHref when provided', () => {
    render(<LatestNews articles={mockArticles} viewAllHref="/custom-news" />)

    const viewAllLink = screen.getByRole('link', { name: /Bekijk alles/i })
    expect(viewAllLink).toHaveAttribute('href', '/custom-news')
  })

  it('renders empty when no articles provided', () => {
    const { container } = render(<LatestNews articles={[]} />)

    expect(container.firstChild).toBeNull()
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <LatestNews articles={mockArticles} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders articles in grid layout', () => {
    const { container } = render(<LatestNews articles={mockArticles} />)

    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-3')
  })

  it('renders correct number of articles', () => {
    render(<LatestNews articles={mockArticles} />)

    const articleLinks = screen.getAllByRole('link').filter((link) =>
      link.getAttribute('href')?.startsWith('/news/')
    )
    expect(articleLinks.length).toBeGreaterThanOrEqual(3)
  })

  it('handles single article', () => {
    render(<LatestNews articles={[mockArticles[0]]} />)

    expect(screen.getByText('First News Article')).toBeInTheDocument()
    expect(screen.queryByText('Second News Article')).not.toBeInTheDocument()
  })

  it('handles large number of articles', () => {
    const manyArticles = Array.from({ length: 12 }, (_, i) => ({
      href: `/news/article-${i}`,
      title: `Article ${i}`,
      imageUrl: `/images/article-${i}.jpg`,
      imageAlt: `Article ${i} image`,
      date: `${i} januari 2025`,
    }))

    render(<LatestNews articles={manyArticles} />)

    expect(screen.getByText('Article 0')).toBeInTheDocument()
    expect(screen.getByText('Article 11')).toBeInTheDocument()
  })

  it('applies correct section classes', () => {
    const { container } = render(<LatestNews articles={mockArticles} />)

    const section = container.firstChild
    expect(section).toHaveClass('frontpage__main_content')
    expect(section).toHaveClass('page__section')
  })

  it('renders article dates', () => {
    render(<LatestNews articles={mockArticles} />)

    expect(screen.getByText('20 januari 2025')).toBeInTheDocument()
    expect(screen.getByText('19 januari 2025')).toBeInTheDocument()
    expect(screen.getByText('18 januari 2025')).toBeInTheDocument()
  })

  it('renders article tags', () => {
    render(<LatestNews articles={mockArticles} />)

    // Tags are rendered within ArticleCard components
    // Check if tags exist in the document (they may be split across elements)
    expect(screen.getByText(/Ploeg/i)).toBeInTheDocument()
    expect(screen.getByText(/Jeugd/i)).toBeInTheDocument()
  })
})
