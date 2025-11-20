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
      {/* Inline styles for article body - using dangerouslySetInnerHTML for Storybook compatibility */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Links - green underline animation */
            .article-body a:not(.btn) {
              position: relative;
              background-image: linear-gradient(180deg, transparent 75%, #4acf52 0);
              background-size: 0 100%;
              background-repeat: no-repeat;
              text-decoration: none;
              transition: background-size 0.4s ease;
              color: #4acf52;
            }
            .article-body a:not(.btn):hover {
              background-size: 100% 100%;
              cursor: pointer;
            }
            /* External links - Font Awesome external icon */
            .article-body a[target="_blank"]:after {
              content: '\\f08e';
              font-family: FontAwesome, 'Font Awesome 5 Free';
              font-weight: 900;
              display: inline-block;
              margin-left: 0.5em;
            }

            /* Blockquote - large green opening quote */
            .article-body blockquote {
              font-size: 1.5rem;
              font-weight: 500;
              line-height: 1;
              border: 0;
              margin: 2rem 0;
              padding: 0;
              overflow: hidden;
              color: var(--color-kcvv-gray-dark, #292c31);
            }
            .article-body blockquote::before {
              color: #4acf52;
              font-size: 15rem;
              line-height: 0.8;
              content: '\\201C';
              float: left;
              margin-bottom: -6rem;
              margin-left: -0.5rem;
              overflow: hidden;
            }
            .article-body blockquote p {
              padding-left: 6rem;
              line-height: 1.25;
              color: var(--color-kcvv-gray-dark, #292c31);
            }

            /* Headings */
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

            /* Paragraphs */
            .article-body p {
              margin-bottom: 1rem;
            }

            /* Lists */
            .article-body ul,
            .article-body ol {
              margin-bottom: 1rem;
              padding-left: 2rem;
            }

            /* Images */
            .article-body img {
              max-width: 100%;
              height: auto;
              margin: 1rem 0;
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
