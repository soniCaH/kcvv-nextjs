/**
 * ArticleBody Component
 * Main article content with HTML rendering
 * Matches Gatsby visual: styled links with underline animation, external link icons
 */

import { cn } from '@/lib/utils/cn'
import { convertDrupalImagesToAbsolute } from '@/lib/utils/drupal-content'

export interface ArticleBodyProps {
  /**
   * HTML content to display
   */
  content: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Article body component with Gatsby-matched styling
 *
 * Visual specifications:
 * - Font-size: 0.875rem (14px) mobile, 1rem (16px) desktop
 * - Padding: 0.75rem mobile, 0.75rem 0 1.25rem desktop
 * - Margin-right: 2rem desktop (to sidebar)
 * - Links: Green underline animation (background-image gradient)
 * - External links: FontAwesome external icon appended
 * - Images: Zoom on hover (scale 1.1), 0.3s ease, cursor zoom-in
 * - Transition: background-size 0.4s ease
 */
export const ArticleBody = ({ content, className }: ArticleBodyProps) => {
  // Convert relative Drupal image URLs to absolute URLs
  const processedContent = convertDrupalImagesToAbsolute(content)

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
            /* External links - FontAwesome icon */
            .article-body a[target="_blank"]:after {
              font-family: FontAwesome;
              display: inline-block;
              content: '\\f08e';
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
            .article-body h1,
            .article-body h2,
            .article-body h3,
            .article-body h4,
            .article-body h5,
            .article-body h6 {
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              font-size: 1.25rem;
              font-weight: bold;
            }

            /* Paragraphs */
            .article-body p {
              margin-bottom: 0.875rem;
              line-height: 1.6;
            }

            /* Lists - Foundation-style defaults */
            .article-body ul,
            .article-body ol {
              margin-bottom: 1rem;
              margin-left: 1.25rem;
              line-height: 1.6;
            }

            .article-body ul {
              list-style-type: disc;
              list-style-position: outside;
            }

            .article-body ol {
              list-style-type: decimal;
              list-style-position: outside;
            }

            .article-body li {
              margin-bottom: 0.5rem;
            }

            .article-body ul ul,
            .article-body ol ul {
              list-style-type: circle;
              margin-left: 1.25rem;
              margin-top: 0.5rem;
            }

            .article-body ul ol,
            .article-body ol ol {
              margin-left: 1.25rem;
              margin-top: 0.5rem;
            }

            /* Tables - Foundation-style defaults with zebra striping */
            .article-body table {
              width: 100%;
              margin-bottom: 1rem;
              border-collapse: collapse;
              border-spacing: 0;
              border: 1px solid #e6e6e6;
              border-radius: 0;
            }

            .article-body table thead,
            .article-body table tbody,
            .article-body table tfoot {
              background-color: transparent;
              border: 1px solid #f1f1f1;
            }

            .article-body table thead {
              background-color: #f8f8f8;
            }

            .article-body table th,
            .article-body table td {
              padding: 0.5rem 0.625rem 0.625rem;
              text-align: left;
              vertical-align: top;
              border: 1px solid #f1f1f1;
            }

            .article-body table thead th,
            .article-body table thead td {
              font-weight: bold;
              line-height: 1.6;
            }

            /* Zebra striping */
            .article-body table tbody tr:nth-child(even) {
              background-color: #f8f8f8;
              border-bottom: 0;
            }

            .article-body table tbody tr:nth-child(odd) {
              background-color: #ffffff;
            }

            /* Images - default styles for images without zoom effect */
            .article-body img {
              max-width: 100%;
              height: auto;
            }

            /* Image zoom effect on hover - container has margin, image has no margin */
            .article-body p:has(img) {
              overflow: hidden;
              border-radius: 4px;
              margin: 1.5rem 0;
            }

            .article-body p img {
              display: block;
              width: 100%;
              margin: 0;
              transition: transform 0.3s ease;
              will-change: transform;
              cursor: zoom-in;
            }

            .article-body p img:hover {
              transform: scale(1.1);
            }

            /* Drupal embedded media (with data-entity-type="media") */
            .article-body div[data-entity-type="media"] {
              overflow: hidden;
              border-radius: 4px;
              margin: 1.5rem 0;
            }

            /* Container breakout effect on desktop */
            @media (min-width: 960px) {
              .article-body div[data-entity-type="media"] {
                margin: 2rem -50rem 2rem 0;
                max-width: 70rem;
              }
            }

            .article-body div[data-entity-type="media"] img {
              display: block;
              width: 100%;
              margin: 0;
              transition: transform 0.3s ease;
              will-change: transform;
              cursor: zoom-in;
            }

            .article-body div[data-entity-type="media"] img:hover {
              transform: scale(1.1);
            }
          `,
        }}
      />

      <div
        className={cn(
          'article-body',
          'p-3 text-sm mt-4',
          '[70rem]:mr-8 [70rem]:pt-3 [70rem]:px-0 [70rem]:pb-5 [70rem]:text-base',
          'lg:flex-grow lg:min-w-0',
          className
        )}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </>
  )
}
