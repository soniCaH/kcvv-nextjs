/**
 * ArticleBody Component
 * Main article content with HTML rendering
 * Matches Gatsby visual: styled links with underline animation, external link icons
 */

import { cn } from '@/lib/utils/cn'

export interface ArticleBodyProps {
  /**
   * HTML content to render
   */
  content: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Article body content container
 *
 * Visual specifications (matching Gatsby):
 * - Font-size: 0.875rem (mobile) / 1rem (desktop at 70rem+)
 * - Padding: 0.75rem (mobile) / 0.75rem 0 1.25rem (desktop)
 * - Margin-top: 1rem
 * - Desktop: margin-right 2rem
 * - Links: Green underline animation (gradient background 0→100% on hover)
 * - External links: Font Awesome icon after link
 * - Transition: background-size 0.4s ease
 */
export const ArticleBody = ({ content, className }: ArticleBodyProps) => {
  return (
    <>
      {/* Inline styles for article body link effects - using dangerouslySetInnerHTML for Storybook compatibility */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .article-body a:not(.btn) {
              position: relative;
              background-image: linear-gradient(180deg, transparent 75%, #4acf52 0);
              background-size: 0 100%;
              background-repeat: no-repeat;
              text-decoration: none;
              transition: background-size 0.4s ease;
              color: inherit;
            }
            .article-body a:not(.btn):hover {
              background-size: 100% 100%;
              cursor: pointer;
            }
            .article-body a[target="_blank"]:after {
              content: '\\f08e';
              font-family: 'Font Awesome 5 Free';
              font-weight: 900;
              display: inline-block;
              margin-left: 0.5em;
              font-size: 0.875em;
            }
            .article-body h2 {
              margin-top: 1.5rem;
              margin-bottom: 1rem;
              font-size: 1.5rem;
              font-weight: bold;
            }
            .article-body h3 {
              margin-top: 1.25rem;
              margin-bottom: 0.75rem;
              font-size: 1.25rem;
              font-weight: bold;
            }
            .article-body p {
              margin-bottom: 1rem;
            }
            .article-body ul,
            .article-body ol {
              margin-bottom: 1rem;
              padding-left: 2rem;
            }
            .article-body img {
              max-width: 100%;
              height: auto;
              margin: 1rem 0;
            }
            .article-body blockquote {
              border-left: 4px solid #4acf52;
              padding-left: 1rem;
              margin: 1rem 0;
              font-style: italic;
              color: #6b7280;
            }
          `,
        }}
      />

      <div
        className={cn(
          'article-body',
          'p-3 text-sm mt-4',
          'xl:mr-8 xl:p-0 xl:pb-5 xl:text-base',
          className
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  )
}
