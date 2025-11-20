import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleMetadata } from './ArticleMetadata'

describe('ArticleMetadata', () => {
  const defaultProps = {
    author: 'Jan Janssens',
    date: '15/01/2025',
  }

  it('renders the author name', () => {
    render(<ArticleMetadata {...defaultProps} />)
    expect(screen.getByText(/Jan Janssens/)).toBeInTheDocument()
  })

  it('renders "Geschreven door" text', () => {
    render(<ArticleMetadata {...defaultProps} />)
    expect(screen.getByText(/Geschreven door/)).toBeInTheDocument()
  })

  it('renders the date', () => {
    render(<ArticleMetadata {...defaultProps} />)
    expect(screen.getByText('15/01/2025')).toBeInTheDocument()
  })

  it('renders clock icon for date', () => {
    const { container } = render(<ArticleMetadata {...defaultProps} />)
    // Clock icon should be present via Icon component
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders tags when provided', () => {
    render(
      <ArticleMetadata
        {...defaultProps}
        tags={[
          { name: 'voetbal', href: '/tags/voetbal' },
          { name: 'overwinning', href: '/tags/overwinning' },
        ]}
      />
    )
    expect(screen.getByText('#voetbal')).toBeInTheDocument()
    expect(screen.getByText('#overwinning')).toBeInTheDocument()
  })

  it('renders tags as links', () => {
    render(
      <ArticleMetadata
        {...defaultProps}
        tags={[{ name: 'voetbal', href: '/tags/voetbal' }]}
      />
    )
    const link = screen.getByText('#voetbal')
    expect(link.closest('a')).toHaveAttribute('href', '/tags/voetbal')
  })

  it('does not render tags section when empty', () => {
    const { container } = render(<ArticleMetadata {...defaultProps} tags={[]} />)
    expect(screen.queryByText(/#/)).not.toBeInTheDocument()
  })

  it('renders share buttons when shareConfig provided', () => {
    render(
      <ArticleMetadata
        {...defaultProps}
        shareConfig={{
          url: 'https://kcvvelewijt.be/news/test',
          title: 'Test Article',
          twitterHandle: '@kcvve',
        }}
      />
    )
    expect(screen.getByText('Delen op:')).toBeInTheDocument()
    expect(screen.getByText('Facebook')).toBeInTheDocument()
    expect(screen.getByText('Twitter')).toBeInTheDocument()
  })

  it('does not render share buttons without shareConfig', () => {
    render(<ArticleMetadata {...defaultProps} />)
    expect(screen.queryByText('Delen op:')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ArticleMetadata {...defaultProps} className="custom-metadata" />
    )
    expect(container.querySelector('section')).toHaveClass('custom-metadata')
  })

  it('renders section element', () => {
    const { container } = render(<ArticleMetadata {...defaultProps} />)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('handles multiple tags', () => {
    render(
      <ArticleMetadata
        {...defaultProps}
        tags={[
          { name: 'tag1', href: '/tags/tag1' },
          { name: 'tag2', href: '/tags/tag2' },
          { name: 'tag3', href: '/tags/tag3' },
        ]}
      />
    )
    expect(screen.getByText('#tag1')).toBeInTheDocument()
    expect(screen.getByText('#tag2')).toBeInTheDocument()
    expect(screen.getByText('#tag3')).toBeInTheDocument()
  })

  it('formats author display correctly', () => {
    render(<ArticleMetadata {...defaultProps} />)
    // Should be "Geschreven door Jan Janssens."
    const text = screen.getByText(/Geschreven door/)
    expect(text.textContent).toMatch(/Geschreven door.*Jan Janssens\./)
  })
})
