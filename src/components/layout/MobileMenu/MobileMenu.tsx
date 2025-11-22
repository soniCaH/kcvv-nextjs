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
import { Icon, SocialLinks } from '@/components/ui'
import { FaTimes, FaChevronDown, FaSearch } from 'react-icons/fa'

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
  { label: 'Hulp', href: '/hulp' },
  {
    label: 'De club',
    href: '/club',
    children: [
      { label: 'Geschiedenis', href: '/club/history' },
      { label: 'Organogram', href: '/club/organogram' },
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
 * Visual specifications (matching Gatsby):
 * - Width: 280px
 * - Background: #1E2024 (black)
 * - Links: 4px green left border on hover/active
 * - Font: 0.6875rem (11px), uppercase, bold
 * - Border-bottom: 1px solid #292c31
 * - Padding: 1rem 2rem (16px 32px)
 * - Submenu: darker background with inset shadows
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
      {/* Styles for mobile menu left border effect - using dangerouslySetInnerHTML for Storybook compatibility */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .mobile-nav-link {
              position: relative;
            }
            .mobile-nav-link::before {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 4px;
              background-color: transparent;
              transition: background-color 0.3s ease;
              z-index: 1;
            }
            .mobile-nav-link:hover::before,
            .mobile-nav-link.active::before {
              background-color: #4acf52;
            }
          `,
        }}
      />

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
        <ul className="list-none m-0 p-0">
          {menuItems.map((item) => {
            const active = isActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            const isSubmenuOpen = openSubmenu === item.href

            return (
              <li key={item.href} className="relative">
                {hasChildren ? (
                  <>
                    {/* Parent with submenu */}
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className={cn(
                        'mobile-nav-link w-full flex items-center justify-between px-8 py-4 text-left border-b border-[#292c31] text-white text-[0.6875rem] uppercase font-bold transition-colors',
                        active && 'active'
                      )}
                    >
                      <span>{item.label}</span>
                      <Icon
                        icon={<FaChevronDown />}
                        size="xs"
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
                      <ul
                        className="list-none m-0 p-0 bg-[#292c31]"
                        style={{
                          boxShadow:
                            'inset 0 7px 9px -7px #1E2024, inset 0 -7px 9px -7px #1E2024',
                        }}
                      >
                        {item.children?.map((child) => {
                          const childActive = isActive(child.href)

                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  'mobile-nav-link block px-8 py-4 text-[0.6875rem] uppercase font-bold border-b border-[#62656A] no-underline transition-colors',
                                  childActive
                                    ? 'text-kcvv-green-bright active'
                                    : 'text-white hover:text-kcvv-green-bright'
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
                      'mobile-nav-link block px-8 py-4 text-[0.6875rem] uppercase font-bold border-b border-[#292c31] text-white no-underline transition-colors',
                      active && 'active'
                    )}
                  >
                    {item.label}
                    {item.href === '/search' && (
                      <Icon icon={<FaSearch />} size="xs" className="ml-2 inline" />
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>

        {/* Social Links */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center justify-center">
            <SocialLinks variant="inline" size="lg" />
          </div>
        </div>
      </nav>
    </>
  )
}
