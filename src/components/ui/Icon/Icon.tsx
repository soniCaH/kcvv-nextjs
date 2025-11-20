'use client'

/**
 * Icon Component
 * Wrapper for react-icons with consistent sizing and styling
 */

import { forwardRef, type HTMLAttributes, type ReactElement } from 'react'
import { IconContext } from 'react-icons'
import { cn } from '@/lib/utils/cn'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type IconColor =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted'

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * React Icon component from react-icons
   */
  icon: ReactElement
  /**
   * Size of the icon
   * @default 'md'
   */
  size?: IconSize
  /**
   * Color of the icon
   * @default 'current'
   */
  color?: IconColor
  /**
   * Additional CSS classes
   */
  className?: string
}

const sizeMap: Record<IconSize, string> = {
  xs: '1rem', // 16px
  sm: '1.25rem', // 20px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '2.5rem', // 40px
  '2xl': '3rem', // 48px
}

const colorMap: Record<IconColor, string> = {
  current: 'currentColor',
  primary: '#4acf52', // KCVV green bright
  secondary: '#62656A', // Gray medium
  success: '#4acf52', // Same as primary
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  muted: '#9ca3af', // Gray 400
}

/**
 * Icon component with consistent sizing and KCVV color palette
 *
 * @example
 * ```tsx
 * import { FaFutbol } from 'react-icons/fa'
 *
 * <Icon icon={<FaFutbol />} size="lg" color="primary" />
 * ```
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ icon, size = 'md', color = 'current', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <IconContext.Provider
          value={{
            size: sizeMap[size],
            color: colorMap[color],
            className: 'flex-shrink-0',
          }}
        >
          {icon}
        </IconContext.Provider>
      </span>
    )
  }
)

Icon.displayName = 'Icon'
