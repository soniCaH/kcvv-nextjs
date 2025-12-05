/**
 * TierDivider Component
 * Decorative separator between sponsor tiers
 */

import { cn } from '@/lib/utils/cn'

export interface TierDividerProps {
  /**
   * Additional CSS classes
   */
  className?: string
}

export const TierDivider = ({ className }: TierDividerProps) => {
  return (
    <div className={cn('flex items-center justify-center my-12', className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      <div className="mx-4 text-2xl text-kcvv-green-bright">⚽</div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  )
}
