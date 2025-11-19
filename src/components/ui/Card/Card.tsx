/**
 * Card Component
 * Flexible card container with KCVV design system styling
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export type CardVariant = 'default' | 'teaser' | 'bordered' | 'elevated'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the card
   * @default 'default'
   */
  variant?: CardVariant
  /**
   * Add hover effect (scale + shadow)
   * @default false
   */
  hoverable?: boolean
  /**
   * Add padding to the card
   * @default false
   */
  padded?: boolean
  /**
   * Card content
   */
  children: ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Card component for content containers
 *
 * @example
 * ```tsx
 * <Card variant="teaser" hoverable>
 *   <CardImage src="/image.jpg" alt="..." />
 *   <CardContent>
 *     <h3>Title</h3>
 *     <p>Description</p>
 *   </CardContent>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      padded = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles matching KCVV design
          'bg-white rounded-[4px] mb-4',

          // Variant styles
          {
            // Default: Simple border
            'border border-[#edeff4]': variant === 'default',

            // Teaser: For news/article cards
            'border border-[#edeff4] overflow-hidden': variant === 'teaser',

            // Bordered: Thicker border
            'border-2 border-kcvv-gray-light': variant === 'bordered',

            // Elevated: With shadow
            'border border-[#edeff4] shadow-md': variant === 'elevated',
          },

          // Padding
          {
            'p-4 md:p-6': padded,
          },

          // Hover effects
          {
            'transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02]':
              hoverable,
          },

          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/**
 * Card Header component
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-4 py-3 border-b border-[#edeff4]', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

/**
 * Card Content component
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)} {...props}>
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

/**
 * Card Footer component
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-4 py-3 border-t border-[#edeff4]', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

/**
 * Card Image component (maintains aspect ratio)
 */
export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Image source URL
   */
  src: string
  /**
   * Alt text for accessibility
   */
  alt: string
  /**
   * Aspect ratio (width:height)
   * @default '3:2' (1.5:1 for teasers)
   */
  aspectRatio?: '1:1' | '3:2' | '16:9' | '4:3'
  className?: string
}

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ src, alt, aspectRatio = '3:2', className, ...props }, ref) => {
    const ratioClasses = {
      '1:1': 'aspect-square',
      '3:2': 'aspect-[3/2]',
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
    }

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', ratioClasses[aspectRatio], className)}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }
)

CardImage.displayName = 'CardImage'
