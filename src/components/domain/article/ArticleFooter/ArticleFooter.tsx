/**
 * ArticleFooter Component
 * Related content section with green background
 * Matches Gatsby visual: bright green bg, white text, grid layout, content type icons
 */

import Link from 'next/link'
import { Icon } from '@/components/ui'
import { FaNewspaper, FaUser, FaUsers, FaFutbol } from 'react-icons/fa'
import { cn } from '@/lib/utils/cn'

export interface RelatedContent {
  /**
   * Content title
   */
  title: string
  /**
   * URL path
   */
  href: string
  /**
   * Content type
   */
  type: 'article' | 'player' | 'staff' | 'team'
}

export interface ArticleFooterProps {
  /**
   * Related content items
   */
  relatedContent: RelatedContent[]
  /**
   * Additional CSS classes
   */
  className?: string
}

const contentTypeIcons = {
  article: <FaNewspaper />,
  player: <FaUser />,
  staff: <FaUsers />,
  team: <FaFutbol />,
}

/**
 * Article footer with related content
 *
 * Visual specifications (matching Gatsby):
 * - Background: Bright green (#4acf52)
 * - Padding: 1rem 0.75rem 50px (mobile) / 1rem 0 50px (desktop)
 * - Margin-top: 1rem
 * - Margin-bottom: -125px (overlaps next section)
 * - Max-width: 70rem
 * - Heading: Uppercase, white text
 * - Grid: 3 columns on desktop (60rem+), masonry if supported
 * - Links: White with underline on hover
 * - Icons: Dark green circle background, white icons
 */
export const ArticleFooter = ({ relatedContent, className }: ArticleFooterProps) => {
  if (!relatedContent || relatedContent.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'bg-kcvv-green-bright mt-4',
        'py-6',
        className
      )}
    >
      <section className="w-full max-w-inner-lg mx-auto px-3 lg:px-0">
        <h3 className="uppercase text-white mb-4">Gerelateerde inhoud</h3>

        <div
          className={cn(
            'grid gap-4',
            relatedContent.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'
          )}
        >
          {relatedContent.map((item, index) => (
            <article
              key={index}
              className={cn(
                'flex items-start gap-2',
                relatedContent.length === 1 && 'lg:col-span-3'
              )}
            >
              {/* Content type icon */}
              <div className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-kcvv-green-dark text-white text-sm">
                <Icon icon={contentTypeIcons[item.type]} size="xs" />
              </div>

              {/* Link */}
              <Link
                href={item.href}
                className="text-white flex-1 break-words relative no-underline transition-all duration-400"
                style={{
                  color: '#FFF',
                  backgroundImage: 'linear-gradient(180deg, transparent 75%, #FFF 0)',
                  backgroundSize: '0 100%',
                  backgroundRepeat: 'no-repeat',
                  transition: 'background-size 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundSize = '100% 100%'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundSize = '0 100%'
                }}
              >
                {item.title}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
