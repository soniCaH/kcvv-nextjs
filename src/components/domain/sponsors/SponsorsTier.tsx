/**
 * SponsorsTier Component
 * Displays a single tier of sponsors (gold/silver/bronze) with title and grid
 */

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export type SponsorTier = 'gold' | 'silver' | 'bronze'

export interface Sponsor {
  id: string
  name: string
  logo: string
  url?: string
}

export interface SponsorsTierProps {
  /**
   * Tier level for styling
   */
  tier: SponsorTier
  /**
   * Section title
   */
  title: string
  /**
   * Sponsors to display
   */
  sponsors: Sponsor[]
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Tier-specific grid column configuration and styling
 * Gold (crossing): Larger logos, fewer columns, gold accent
 * Silver (green/white): Medium logos, silver accent
 * Bronze (training/panel/other): Smaller logos, more columns, bronze accent
 */
const tierConfig: Record<
  SponsorTier,
  { columns: string; imageSize: number; badgeColor: string; badgeIcon: string }
> = {
  gold: {
    columns: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    imageSize: 280,
    badgeColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    badgeIcon: '⭐',
  },
  silver: {
    columns: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
    imageSize: 200,
    badgeColor: 'bg-gradient-to-r from-gray-300 to-gray-500',
    badgeIcon: '🥈',
  },
  bronze: {
    columns: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
    imageSize: 160,
    badgeColor: 'bg-gradient-to-r from-orange-400 to-orange-600',
    badgeIcon: '🥉',
  },
}

export const SponsorsTier = ({ tier, title, sponsors, className }: SponsorsTierProps) => {
  const config = tierConfig[tier]

  if (sponsors.length === 0) {
    return null
  }

  return (
    <section className={cn('mb-12', className)}>
      <div className="flex items-center gap-3 mb-6">
        <span
          className={cn(
            'inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-xl font-bold shadow-lg',
            config.badgeColor
          )}
        >
          {config.badgeIcon}
        </span>
        <h2 className="text-2xl font-bold text-kcvv-gray-blue">{title}</h2>
      </div>
      <div className={cn('grid gap-6', config.columns)}>
        {sponsors.map((sponsor, index) => {
          const content = (
            <div
              className={cn(
                'relative bg-white rounded border border-gray-200 p-4',
                'flex items-center justify-center aspect-[3/2]',
                'transition-all duration-300 ease-out',
                'hover:shadow-xl hover:scale-105 hover:-translate-y-1',
                'animate-in fade-in slide-in-from-bottom-4'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={config.imageSize}
                height={config.imageSize * (2 / 3)}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          )

          if (sponsor.url) {
            return (
              <Link
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label={`Bezoek website van ${sponsor.name}`}
              >
                {content}
              </Link>
            )
          }

          return (
            <div key={sponsor.id} aria-label={sponsor.name}>
              {content}
            </div>
          )
        })}
      </div>
    </section>
  )
}
