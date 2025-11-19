/**
 * PageHeader Component
 * Main site header with logo and navigation
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui'
import { FaSearch, FaBars } from 'react-icons/fa'
import { Navigation } from '../Navigation'
import { MobileMenu } from '../MobileMenu'

export interface PageHeaderProps {
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Main site header with sticky navigation
 *
 * Features:
 * - Sticky positioning
 * - Desktop horizontal navigation
 * - Mobile hamburger menu
 * - Logo with link to home
 * - Search icon
 */
export const PageHeader = ({ className }: PageHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full bg-white border-b border-[#edeff4]',
          className
        )}
      >
        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Toggle navigation menu"
              className="p-2 text-kcvv-gray-dark hover:text-kcvv-green-bright transition-colors"
            >
              <Icon icon={<FaBars />} size="lg" />
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-flat.png"
                alt="KCVV ELEWIJT"
                width={100}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>

            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-kcvv-gray-dark hover:text-kcvv-green-bright transition-colors"
            >
              <Icon icon={<FaSearch />} size="md" />
            </Link>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center py-4">
                <Image
                  src="/images/logo-flat.png"
                  alt="KCVV ELEWIJT"
                  width={140}
                  height={112}
                  priority
                  className="h-28 w-auto"
                />
              </Link>

              {/* Navigation */}
              <Navigation />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}
