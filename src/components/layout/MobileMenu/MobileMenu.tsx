/**
 * MobileMenu Component
 * Off-canvas mobile navigation menu
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui'
import {
  FaTimes,
  FaChevronDown,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSearch,
} from 'react-icons/fa'

export interface MobileMenuProps {
  /**
   * Whether the menu is open
   */
  isOpen: boolean
  /**
   * Callback when the menu should close
   */
  onClose: () => void
  /**
   * Additional CSS classes
   */
  className?: string
}

interface MenuItem {
  label: string
  href: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Nieuws', href: '/news' },
  { label: 'Evenementen', href: '/events' },
  {
    label: 'A-Ploeg',
    href: '/team/a-ploeg',
    children: [
      { label: 'Info', href: '/team/a-ploeg#team-info' },
      { label: 'Spelers & Staff', href: '/team/a-ploeg#team-lineup' },
      { label: 'Wedstrijden', href: '/team/a-ploeg#team-matches' },
      { label: 'Stand', href: '/team/a-ploeg#team-ranking' },
    ],
  },
  {
    label: 'B-Ploeg',
    href: '/team/b-ploeg',
    children: [
      { label: 'Info', href: '/team/b-ploeg#team-info' },
      { label: 'Spelers & Staff', href: '/team/b-ploeg#team-lineup' },
      { label: 'Wedstrijden', href: '/team/b-ploeg#team-matches' },
      { label: 'Stand', href: '/team/b-ploeg#team-ranking' },
    ],
  },
  {
    label: 'Jeugd',
    href: '/jeugd',
    children: [
      { label: 'U21', href: '/jeugd/u21' },
      { label: 'U17', href: '/jeugd/u17' },
      { label: 'U16', href: '/jeugd/u16' },
      { label: 'U15', href: '/jeugd/u15' },
      { label: 'U14', href: '/jeugd/u14' },
      { label: 'U13', href: '/jeugd/u13' },
      { label: 'U12', href: '/jeugd/u12' },
      { label: 'U11', href: '/jeugd/u11' },
      { label: 'U10', href: '/jeugd/u10' },
      { label: 'U9', href: '/jeugd/u9' },
      { label: 'U8', href: '/jeugd/u8' },
      { label: 'U7', href: '/jeugd/u7' },
      { label: 'U6 & U5', href: '/jeugd/u6' },
    ],
  },
  { label: 'Sponsors', href: '/sponsors' },
  {
    label: 'De club',
    href: '/club',
    children: [
      { label: 'Geschiedenis', href: '/club/history' },
      { label: 'Bestuur', href: '/club/bestuur' },
      { label: 'Jeugdbestuur', href: '/club/jeugdbestuur' },
      { label: 'KCVV Angels', href: '/club/angels' },
      { label: 'KCVV Ultras', href: '/club/ultras' },
      { label: 'Contact', href: '/club/contact' },
      { label: 'Downloads', href: '/club/downloads' },
      { label: 'Praktische Info', href: '/club/register' },
      { label: 'Cashless clubkaart', href: '/club/cashless' },
    ],
  },
  {
    label: 'Zoeken',
    href: '/search',
  },
]

/**
 * Mobile off-canvas navigation menu
 *
 * Features:
 * - Slides in from left
 * - Backdrop overlay
 * - Accordion-style sub-menus
 * - Social links at bottom
 * - Body scroll lock when open
 */
export const MobileMenu = ({ isOpen, onClose, className }: MobileMenuProps) => {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close menu when pathname changes
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <nav
        className={cn(
          'fixed top-0 left-0 h-full w-[280px] bg-[#1E2024] z-50',
          'transform transition-transform duration-500 ease-in-out',
          'shadow-[0_0_10px_rgba(0,0,0,0.7)]',
          'overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <Link href="/" onClick={onClose}>
            <Image
              src="/images/logo-flat.png"
              alt="KCVV ELEWIJT"
              width={100}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-white hover:text-kcvv-green-bright transition-colors"
          >
            <Icon icon={<FaTimes />} size="lg" />
          </button>
        </div>

        {/* Menu Items */}
        <ul className="py-4">
          {menuItems.map((item) => {
            const active = isActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            const isSubmenuOpen = openSubmenu === item.href

            return (
              <li key={item.href}>
                {hasChildren ? (
                  <>
                    {/* Parent with submenu */}
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className={cn(
                        'w-full flex items-center justify-between px-6 py-3 text-left transition-colors',
                        active
                          ? 'text-kcvv-green-bright bg-white/5'
                          : 'text-white hover:text-kcvv-green-bright hover:bg-white/5'
                      )}
                    >
                      <span className="font-medium">{item.label}</span>
                      <Icon
                        icon={<FaChevronDown />}
                        size="sm"
                        className={cn(
                          'transition-transform',
                          isSubmenuOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Submenu */}
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300',
                        isSubmenuOpen ? 'max-h-[800px]' : 'max-h-0'
                      )}
                    >
                      <ul className="bg-black/20">
                        {item.children?.map((child) => {
                          const childActive = isActive(child.href)

                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  'block px-10 py-2 text-sm transition-colors',
                                  childActive
                                    ? 'text-kcvv-green-bright font-medium'
                                    : 'text-white/80 hover:text-kcvv-green-bright'
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'block px-6 py-3 font-medium transition-colors',
                      active
                        ? 'text-kcvv-green-bright bg-white/5'
                        : 'text-white hover:text-kcvv-green-bright hover:bg-white/5'
                    )}
                  >
                    {item.label}
                    {item.href === '/search' && (
                      <Icon icon={<FaSearch />} size="sm" className="ml-2 inline" />
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>

        {/* Social Links */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.facebook.com/KCVVElewijt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-3 text-white hover:text-kcvv-green-bright transition-colors rounded-full hover:bg-white/5"
            >
              <Icon icon={<FaFacebookF />} size="lg" />
            </a>
            <a
              href="https://twitter.com/kcvve"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-3 text-white hover:text-kcvv-green-bright transition-colors rounded-full hover:bg-white/5"
            >
              <Icon icon={<FaTwitter />} size="lg" />
            </a>
            <a
              href="https://www.instagram.com/kcvve/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-3 text-white hover:text-kcvv-green-bright transition-colors rounded-full hover:bg-white/5"
            >
              <Icon icon={<FaInstagram />} size="lg" />
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
