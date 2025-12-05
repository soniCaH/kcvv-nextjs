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
 * Tier-specific grid column configuration
 * Gold (crossing): Larger logos, fewer columns
 * Silver (green/white): Medium logos
 * Bronze (training/panel/other): Smaller logos, more columns
 */
const tierConfig: Record<SponsorTier, { columns: string; imageSize: number }> = {
  gold: { columns: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', imageSize: 280 },
  silver: { columns: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5', imageSize: 200 },
  bronze: { columns: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6', imageSize: 160 },
}

export const SponsorsTier = ({ tier, title, sponsors, className }: SponsorsTierProps) => {
  const config = tierConfig[tier]

  if (sponsors.length === 0) {
    return null
  }

  return (
    <section className={cn('mb-12', className)}>
      <h2 className="text-2xl font-bold mb-6 text-kcvv-gray-blue">{title}</h2>
      <div className={cn('grid gap-6', config.columns)}>
        {sponsors.map((sponsor) => {
          const content = (
            <div
              className={cn(
                'relative bg-white rounded border border-gray-200 p-4 transition-shadow hover:shadow-lg',
                'flex items-center justify-center aspect-[3/2]'
              )}
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
