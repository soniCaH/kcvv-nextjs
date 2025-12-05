/**
 * SponsorsSpotlight Component
 * Featured sponsor carousel showcasing key partners
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export interface SpotlightSponsor {
  id: string
  name: string
  logo: string
  url?: string
  description?: string
}

export interface SponsorsSpotlightProps {
  /**
   * Featured sponsors to display
   */
  sponsors: SpotlightSponsor[]
  /**
   * Auto-rotate interval in milliseconds (0 to disable)
   */
  autoRotateInterval?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

export const SponsorsSpotlight = ({
  sponsors,
  autoRotateInterval = 5000,
  className,
}: SponsorsSpotlightProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (autoRotateInterval === 0 || sponsors.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % sponsors.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, sponsors.length])

  if (sponsors.length === 0) {
    return null
  }

  const activeSponsor = sponsors[activeIndex]

  return (
    <div className={cn('bg-gradient-to-br from-kcvv-green-bright/10 to-kcvv-green/10 py-12 px-6', className)}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-kcvv-gray-blue mb-2">In de kijker</h2>
          <p className="text-gray-600">Onze featured partners</p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0 w-64 h-48 relative">
                <Image
                  src={activeSponsor.logo}
                  alt={activeSponsor.name}
                  fill
                  className="object-contain"
                  sizes="256px"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-kcvv-gray-blue mb-4">{activeSponsor.name}</h3>
                {activeSponsor.description && <p className="text-lg text-gray-600 mb-6">{activeSponsor.description}</p>}
                {activeSponsor.url && (
                  <Link
                    href={activeSponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-kcvv-green-bright text-white rounded-lg font-semibold hover:bg-kcvv-green transition-colors"
                  >
                    Bezoek website
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          {sponsors.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {sponsors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    index === activeIndex
                      ? 'bg-kcvv-green-bright w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Ga naar sponsor ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
