import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with proper Tailwind CSS merging
 * Usage: cn('text-red-500', 'bg-blue-500', conditionalClass && 'mt-4')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
