/**
 * Navigation Component
 * Desktop horizontal navigation menu with dropdowns
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui'
import { FaSearch, FaChevronDown } from 'react-icons/fa'

export interface NavigationProps {
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
]

/**
 * Desktop horizontal navigation with dropdown menus
 */
export const Navigation = ({ className }: NavigationProps) => {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  const hasActiveChild = (item: MenuItem) => {
    return item.children?.some((child) => isActive(child.href)) || false
  }

  return (
    <nav className={cn('flex items-center', className)}>
      <ul className="flex items-center gap-1">
        {menuItems.map((item) => {
          const active = isActive(item.href) || hasActiveChild(item)
          const hasDropdown = item.children && item.children.length > 0

          return (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => hasDropdown && setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded',
                  active
                    ? 'text-kcvv-green-bright bg-kcvv-green-bright/10'
                    : 'text-kcvv-gray-dark hover:text-kcvv-green-bright hover:bg-gray-50'
                )}
              >
                {item.label}
                {hasDropdown && (
                  <Icon
                    icon={<FaChevronDown />}
                    size="xs"
                    className={cn(
                      'transition-transform',
                      openDropdown === item.href && 'rotate-180'
                    )}
                  />
                )}
              </Link>

              {/* Dropdown Menu */}
              {hasDropdown && (
                <div
                  className={cn(
                    'absolute top-full left-0 mt-1 w-56 bg-white border border-[#edeff4] rounded shadow-lg',
                    'transition-opacity duration-200',
                    openDropdown === item.href
                      ? 'opacity-100 visible'
                      : 'opacity-0 invisible pointer-events-none'
                  )}
                >
                  <ul className="py-2">
                    {item.children?.map((child) => {
                      const childActive = isActive(child.href)

                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 text-sm transition-colors',
                              childActive
                                ? 'text-kcvv-green-bright bg-kcvv-green-bright/10 font-medium'
                                : 'text-kcvv-gray-dark hover:text-kcvv-green-bright hover:bg-gray-50'
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          )
        })}

        {/* Search Link */}
        <li>
          <Link
            href="/search"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-kcvv-gray-dark hover:text-kcvv-green-bright transition-colors rounded hover:bg-gray-50"
            aria-label="Search"
          >
            <Icon icon={<FaSearch />} size="sm" />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
