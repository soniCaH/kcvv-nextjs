/**
 * PageHeader Component - Granular Element Stories
 * Each story shows individual elements and states for pixel-perfect matching with Gatsby
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import Image from 'next/image'
import { FaBars, FaSearch } from 'react-icons/fa'

const meta = {
  title: 'Layout/PageHeader/Elements',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * 01. Header Container
 * Green background (#4acf52) with pattern image overlay
 * Heights: 5rem (mobile) / 7.5rem (desktop at 960px+)
 * Pattern positioned at 50% -7vw
 */
export const HeaderContainer: Story = {
  render: () => (
    <header className="bg-kcvv-green-bright relative">
      <div
        className="h-20 lg:h-[7.5rem] fixed top-0 left-0 right-0 z-[11]"
        style={{
          backgroundImage: 'url(/images/header-pattern.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100vw auto',
          backgroundPosition: '50% -7vw',
          backgroundColor: '#4acf52',
        }}
      >
        <div className="flex items-center justify-center h-full text-white text-sm">
          Container with green background + pattern
        </div>
      </div>
    </header>
  ),
}

/**
 * 02. Logo - Desktop Size
 * Height: 7rem (112px)
 * Width: auto
 * Margin-right: 0.5rem
 */
export const LogoDesktop: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright p-8">
      <div className="flex items-center">
        <Image
          src="/images/logos/kcvv-logo.png"
          alt="KCVV ELEWIJT"
          width={112}
          height={112}
          className="h-28 w-auto mr-2 transition-all duration-300"
          priority
        />
        <span className="text-white text-xs">Desktop logo (7rem height)</span>
      </div>
    </div>
  ),
}

/**
 * 03. Logo - Mobile Size
 * Width: 100px
 * Height: auto
 * Centered position
 */
export const LogoMobile: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright p-8">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/images/logos/kcvv-logo.png"
          alt="KCVV ELEWIJT"
          width={100}
          height={100}
          className="w-[100px] h-auto"
          priority
        />
        <span className="text-white text-xs">Mobile logo (100px width)</span>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * 04. Navigation Item - Default State
 * Font: 0.7rem (11.2px) / 0.875rem at 1240px+
 * Text-transform: uppercase
 * Font-weight: bold
 * Color: white
 */
export const NavigationItemDefault: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright p-8">
      <nav>
        <ul className="flex gap-6 items-center">
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a href="#" className="text-white no-underline whitespace-nowrap">
              Club
            </a>
          </li>
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a href="#" className="text-white no-underline whitespace-nowrap">
              Nieuws
            </a>
          </li>
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a href="#" className="text-white no-underline whitespace-nowrap">
              Ploegen
            </a>
          </li>
        </ul>
      </nav>
    </div>
  ),
}

/**
 * 05. Navigation Item - Hover State
 * White 2px underline that animates from center
 * Transition: width 0.3s ease, left 0.3s ease
 * Width: 0 -> 100%, left: 50% -> 0
 */
export const NavigationItemHover: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright p-8">
      <style>{`
        .nav-link-hover {
          position: relative;
        }
        .nav-link-hover::after {
          content: "";
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          height: 2px;
          width: 0;
          background: #fff;
          transition: width 0.3s ease 0s, left 0.3s ease 0s;
        }
        .nav-link-hover:hover::after {
          width: 100%;
          left: 0;
        }
      `}</style>
      <nav>
        <ul className="flex gap-6 items-center">
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a
              href="#"
              className="nav-link-hover text-white no-underline whitespace-nowrap inline-block pb-0.5"
            >
              Hover Me
            </a>
          </li>
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a
              href="#"
              className="nav-link-hover text-white no-underline whitespace-nowrap inline-block pb-0.5"
            >
              Another Link
            </a>
          </li>
        </ul>
      </nav>
    </div>
  ),
}

/**
 * 06. Navigation Item - Active State
 * Same as hover: white 2px underline at 100% width
 */
export const NavigationItemActive: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright p-8">
      <style>{`
        .nav-link-active {
          position: relative;
        }
        .nav-link-active::after {
          content: "";
          display: block;
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background: #fff;
        }
      `}</style>
      <nav>
        <ul className="flex gap-6 items-center">
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a
              href="#"
              className="text-white no-underline whitespace-nowrap opacity-50"
            >
              Regular Link
            </a>
          </li>
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a
              href="#"
              className="nav-link-active text-white no-underline whitespace-nowrap inline-block pb-0.5"
            >
              Active Link
            </a>
          </li>
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a
              href="#"
              className="text-white no-underline whitespace-nowrap opacity-50"
            >
              Regular Link
            </a>
          </li>
        </ul>
      </nav>
    </div>
  ),
}

/**
 * 07. Dropdown Menu Trigger
 * Has white chevron-down icon after text
 * Icon: 6px wide, 4px tall
 */
export const DropdownTrigger: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright p-8">
      <style>{`
        .dropdown-trigger::after {
          content: "";
          display: inline-block;
          margin-left: 9px;
          width: 6px;
          height: 4px;
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 4'%3E%3Cpath transform='translate(-586.156 -1047.28)' fill='%23fff' d='M586.171,1048l0.708-.71,2.828,2.83-0.707.71Zm4.95-.71,0.707,0.71L589,1050.83l-0.707-.71Z'/%3E%3C/svg%3E");
          background-size: 6px 4px;
          background-repeat: no-repeat;
          background-position: center center;
          position: relative;
          top: -2px;
        }
      `}</style>
      <nav>
        <ul className="flex gap-6 items-center">
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a
              href="#"
              className="dropdown-trigger text-white no-underline whitespace-nowrap"
            >
              Ploegen
            </a>
          </li>
          <li className="text-[0.7rem] xl:text-[0.875rem] uppercase font-bold">
            <a
              href="#"
              className="dropdown-trigger text-white no-underline whitespace-nowrap"
            >
              Info
            </a>
          </li>
        </ul>
      </nav>
    </div>
  ),
}

/**
 * 08. Dropdown Menu - Submenu
 * Background: black (#1E2024)
 * Border: 1px solid gray-dark
 * Text: white, uppercase, bold
 * Font-size: 0.6875rem (11px)
 * Hover: green text
 */
export const DropdownSubmenu: Story = {
  render: () => (
    <div className="bg-gray-100 p-8">
      <div className="inline-block">
        <div className="bg-[#1E2024] border border-gray-700 min-w-[200px]">
          <ul className="list-none m-0 p-0">
            <li>
              <a
                href="#"
                className="block px-7 py-3 text-white text-[0.6875rem] uppercase font-bold no-underline transition-colors duration-300 hover:text-kcvv-green-bright"
              >
                Eerste Ploeg
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-7 py-3 text-white text-[0.6875rem] uppercase font-bold no-underline transition-colors duration-300 hover:text-kcvv-green-bright"
              >
                Beloften
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-7 py-3 text-white text-[0.6875rem] uppercase font-bold no-underline transition-colors duration-300 hover:text-kcvv-green-bright"
              >
                U21
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-7 py-3 text-white text-[0.6875rem] uppercase font-bold no-underline transition-colors duration-300 hover:text-kcvv-green-bright"
              >
                U19
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
}

/**
 * 09. Mobile Hamburger Button
 * Position: left 34px, top calc((5rem - 16px) / 2)
 * Color: white
 * Size: ~16px icon
 */
export const HamburgerButton: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright h-20 relative">
      <button
        className="absolute left-[34px] top-[calc((5rem-16px)/2)] text-white text-base w-6 h-6 flex items-center justify-center"
        aria-label="Toggle navigation menu"
      >
        <FaBars className="w-4 h-4" />
      </button>
      <div className="flex items-center justify-center h-full text-white text-xs">
        Mobile header with hamburger at left
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * 10. Mobile Search Button
 * Position: right side
 * Color: white
 */
export const SearchButton: Story = {
  render: () => (
    <div className="bg-kcvv-green-bright h-20 relative">
      <button
        className="absolute right-[34px] top-[calc((5rem-16px)/2)] text-white text-base w-6 h-6 flex items-center justify-center"
        aria-label="Search"
      >
        <FaSearch className="w-4 h-4" />
      </button>
      <div className="flex items-center justify-center h-full text-white text-xs">
        Mobile header with search at right
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * 11. Mobile Menu Item with Active Border
 * 4px green left border on hover/active (::before pseudo-element)
 * Border-bottom: 1px solid #292c31
 */
export const MobileMenuItem: Story = {
  render: () => (
    <div className="bg-[#1E2024] p-8">
      <style>{`
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
        }
        .mobile-nav-link:hover::before,
        .mobile-nav-link.active::before {
          background-color: #4acf52;
        }
      `}</style>
      <ul className="list-none m-0 p-0">
        <li>
          <a
            href="#"
            className="mobile-nav-link block px-8 py-4 text-white text-[0.6875rem] uppercase font-bold border-b border-[#292c31] no-underline"
          >
            Regular Link
          </a>
        </li>
        <li>
          <a
            href="#"
            className="mobile-nav-link active block px-8 py-4 text-white text-[0.6875rem] uppercase font-bold border-b border-[#292c31] no-underline"
          >
            Active Link (with green border)
          </a>
        </li>
        <li>
          <a
            href="#"
            className="mobile-nav-link block px-8 py-4 text-white text-[0.6875rem] uppercase font-bold border-b border-[#292c31] no-underline"
          >
            Another Link
          </a>
        </li>
      </ul>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
