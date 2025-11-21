/**
 * PageTitle Component
 * Page heading with green background and texture pattern
 * Used for page titles across the site (news archive, team pages, etc.)
 */

import { cn } from '@/lib/utils/cn'

export interface PageTitleProps {
  /**
   * Page title text
   */
  title: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Custom padding (default: px-3 pt-4 pb-4 xl:px-0)
   */
  padding?: string
  /**
   * Container max width (default: max-w-[70rem])
   */
  containerWidth?: string
}

/**
 * Page title section with green background and texture
 *
 * Visual specifications (matching Gatsby):
 * - Background: #4acf52 (bright green)
 * - Pattern: header-pattern.png positioned at 50% -7vw
 * - Text: White, bold, 2.5rem (40px)
 * - Line height: 0.92
 * - Fixed background attachment for parallax effect
 *
 * @example
 * ```tsx
 * <PageTitle title="Nieuwsarchief KCVV Elewijt" />
 * ```
 */
export const PageTitle = ({
  title,
  className,
  padding = 'px-3 pt-4 pb-4 xl:px-0',
  containerWidth = 'max-w-[70rem]',
}: PageTitleProps) => {
  return (
    <header
      className={cn(padding, className)}
      style={{
        background: '#4acf52',
        backgroundImage: 'url(/images/header-pattern.png)',
        backgroundPosition: '50% -7vw',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100vw auto',
      }}
    >
      <div className={cn('w-full mx-auto', containerWidth)}>
        <h1 className="text-white text-[2.5rem] leading-[0.92] font-bold">
          {title}
        </h1>
      </div>
    </header>
  )
}
