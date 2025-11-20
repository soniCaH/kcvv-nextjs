/**
 * SocialLinks Component
 * Social media links with icon buttons
 * Supports different variants: circle (footer), inline (mobile menu), etc.
 */

import { Icon } from '@/components/ui'
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import { cn } from '@/lib/utils/cn'

export interface SocialLinksProps {
  /**
   * Visual variant
   * - circle: Circular buttons with borders (footer style)
   * - inline: Simple inline links (mobile menu style)
   */
  variant?: 'circle' | 'inline'
  /**
   * Size of icons
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Layout direction
   */
  direction?: 'horizontal' | 'vertical'
}

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/KCVVElewijt/',
    icon: <FaFacebookF />,
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/kcvve',
    icon: <FaTwitter />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/kcvve',
    icon: <FaInstagram />,
  },
]

/**
 * Social media links component with multiple variants
 *
 * Visual specifications (matching Gatsby):
 * - Circle variant: 2rem (32px) circles, 2px gray border, green hover
 * - Icon size: 14px (0.875rem)
 * - Hover: Border color changes to green bright
 */
export const SocialLinks = ({
  variant = 'circle',
  size = 'md',
  className,
  direction = 'horizontal',
}: SocialLinksProps) => {
  if (variant === 'circle') {
    return (
      <ul
        className={cn(
          'flex list-none m-0 p-0',
          direction === 'horizontal' ? 'flex-row gap-3' : 'flex-col gap-2',
          className
        )}
      >
        {socialLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#787C80] text-white transition-all duration-300 hover:border-kcvv-green-bright"
              style={{
                fontSize: '0.875rem',
                lineHeight: 'calc(2rem - 4px)',
              }}
            >
              <Icon icon={link.icon} />
            </a>
          </li>
        ))}
      </ul>
    )
  }

  // Inline variant (for mobile menu)
  return (
    <div
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2',
        className
      )}
    >
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className="p-3 text-white hover:text-kcvv-green-bright transition-colors rounded-full hover:bg-white/5"
        >
          <Icon icon={link.icon} size={size} />
        </a>
      ))}
    </div>
  )
}
