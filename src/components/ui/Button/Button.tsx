'use client'

/**
 * Button Component
 * Reusable button with KCVV design system variants
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { FaArrowRight } from 'react-icons/fa'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant
  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize
  /**
   * Show arrow icon on the right (animates on hover)
   * @default false
   */
  withArrow?: boolean
  /**
   * Make button full width
   * @default false
   */
  fullWidth?: boolean
  /**
   * Button content
   */
  children: ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Button component with KCVV design system variants
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 *
 * <Button variant="secondary" withArrow>
 *   Learn more
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      withArrow = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'group inline-flex items-center justify-center gap-2',
          'font-medium transition-all duration-300',
          'cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kcvv-green focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Variant styles
          {
            // Primary: Bright KCVV green
            'bg-kcvv-green-bright text-white hover:bg-kcvv-green-bright/50':
              variant === 'primary',

            // Secondary: Gray alternative
            'bg-gray-600 text-white hover:bg-gray-800':
              variant === 'secondary',

            // Ghost: Transparent with border
            'border-2 border-kcvv-green-bright text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white':
              variant === 'ghost',

            // Link: Text only with underline on hover (including arrow)
            'text-kcvv-green-bright underline-offset-4 hover:underline':
              variant === 'link',
          },

          // Disabled: prevent hover effects
          {
            'disabled:hover:bg-kcvv-green-bright': variant === 'primary',
            'disabled:hover:bg-gray-600': variant === 'secondary',
            'disabled:hover:bg-transparent disabled:hover:text-kcvv-green-bright':
              variant === 'ghost',
            'disabled:hover:no-underline': variant === 'link',
          },

          // Size styles
          {
            'text-sm px-6 py-2 rounded-[0.25em]': size === 'sm',
            'text-base px-8 py-3 rounded-[0.25em]': size === 'md',
            'text-lg px-10 py-4 rounded-[0.25em]': size === 'lg',
          },

          // Full width
          {
            'w-full': fullWidth,
          },

          className
        )}
        {...props}
      >
        {children}

        {withArrow && (
          <FaArrowRight
            className={cn(
              'transition-transform duration-300',
              'group-hover:translate-x-1'
            )}
            aria-hidden="true"
          />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
