/**
 * ArticleMetadata Component
 * Sidebar with author, date, tags, and social share buttons
 * Matches Gatsby visual: gradient border, small font, desktop sidebar layout
 */

import Link from 'next/link'
import { Icon } from '@/components/ui'
import { FaClock, FaTags, FaFacebookF, FaTwitter } from 'react-icons/fa'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import { cn } from '@/lib/utils/cn'

export interface ArticleMetadataProps {
  /**
   * Article author name
   */
  author: string
  /**
   * Publication date (formatted string)
   */
  date: string
  /**
   * Article tags with links
   */
  tags?: Array<{
    name: string
    href: string
  }>
  /**
   * Share configuration
   */
  shareConfig?: {
    url: string
    title: string
    twitterHandle?: string
  }
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Article metadata sidebar component
 *
 * Visual specifications (matching Gatsby):
 * - Font-size: 0.75rem (12px)
 * - Border: Gradient border-image from green to white
 * - Mobile: Bottom border only, full width
 * - Desktop: Left + bottom border, max-width 20rem, flex column
 * - Padding: 0.75rem (12px)
 * - Margin-top: 1rem
 * - Tags: Clickable with # prefix
 * - Social share: Facebook (blue) and Twitter (light blue)
 */
export const ArticleMetadata = ({
  author,
  date,
  tags = [],
  shareConfig,
  className,
}: ArticleMetadataProps) => {
  return (
    <>
      {/* Inline styles for border-image gradient - cannot be done with Tailwind */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .article-metadata-border {
              border-width: 1px;
              border-image-slice: 0 0 1 0;
              border-image-source: linear-gradient(to right, rgba(74, 207, 82, 0.5), #FFF);
            }
            @media (min-width: 960px) {
              .article-metadata-border {
                border-image-slice: 0 0 1 1;
              }
            }
          `,
        }}
      />

      <section
        className={cn(
          'article-metadata-border',
          'relative w-full mt-4 mb-3 p-3 text-xs',
          // Mobile: bottom border only
          'border-b',
          // Desktop: left + bottom border, max-width, flex column
          'lg:border-l lg:max-w-[20rem] lg:flex lg:flex-col',
          className
        )}
      >
      {/* Author */}
      <div className="mb-2">
        Geschreven door <strong>{author}</strong>.
      </div>

      {/* Date and Tags */}
      <div className="flex justify-between flex-wrap lg:flex-col">
        {/* Date */}
        <span className="flex items-center gap-1 mb-2">
          <Icon icon={<FaClock />} size="xs" />
          {date}
        </span>

        {/* Tags */}
        {tags.length > 0 && (
          <span className="flex items-center gap-1 flex-wrap mb-2">
            <Icon icon={<FaTags />} size="xs" />
            {tags.map((tag, i) => (
              <Link
                key={i}
                href={tag.href}
                className="text-kcvv-green-bright hover:underline no-underline"
              >
                #{tag.name}
              </Link>
            ))}
          </span>
        )}
      </div>

      {/* Social Share */}
      {shareConfig && (
        <div className="mt-4 lg:mt-2">
          <span className="block mb-2">Delen op:</span>
          <div className="flex flex-col gap-2">
            <FacebookShareButton
              url={shareConfig.url}
              className="flex items-center gap-2 px-3 py-2 border border-[#3b5998] rounded text-[#3b5998] hover:bg-[#3b5998] hover:text-white transition-colors text-xs font-bold uppercase"
            >
              <Icon icon={<FaFacebookF />} size="xs" />
              Facebook
            </FacebookShareButton>
            <TwitterShareButton
              url={shareConfig.url}
              title={shareConfig.title}
              via={shareConfig.twitterHandle?.replace('@', '')}
              hashtags={tags.map((tag) => tag.name)}
              className="flex items-center gap-2 px-3 py-2 border border-[#1da1f2] rounded text-[#1da1f2] hover:bg-[#1da1f2] hover:text-white transition-colors text-xs font-bold uppercase"
            >
              <Icon icon={<FaTwitter />} size="xs" />
              Twitter
            </TwitterShareButton>
          </div>
        </div>
      )}
      </section>
    </>
  )
}
