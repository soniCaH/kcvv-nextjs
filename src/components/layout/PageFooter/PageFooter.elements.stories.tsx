/**
 * PageFooter Element Stories
 * Granular stories showing individual footer elements for visual verification
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { SocialLinks } from '@/components/ui'

const meta = {
  title: 'Layout/PageFooter/Elements',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Individual elements from the PageFooter component for visual verification',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * 01. Footer Background with SVG Wave
 * Black background (#1E2024) with wavy SVG top edge
 */
export const FooterBackground: Story = {
  render: () => (
    <div className="w-[600px]">
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Page content above</p>
      </div>
      <div
        className="h-64 relative z-10 mt-[50px] text-white"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 50px, #1E2024 50px 100%), url(/images/footer-top.svg) top center no-repeat',
          backgroundSize: '100%',
          padding: '75px 2rem 2rem',
        }}
      >
        <p className="text-center">Footer Content Area</p>
        <p className="text-center text-sm text-white/60 mt-4">
          Note the SVG wavy edge transition
        </p>
      </div>
    </div>
  ),
}

/**
 * 02. Logo and Social Links Row
 * Horizontal layout with logo on left, social circles on right
 */
export const LogoAndSocial: Story = {
  render: () => (
    <div className="bg-[#1E2024] p-8">
      <div className="flex flex-row items-center">
        <div className="mr-6">
          <Link href="/">
            <Image
              src="/images/logo-flat.png"
              alt="KCVV ELEWIJT"
              width={150}
              height={60}
              className="h-auto w-auto"
            />
          </Link>
        </div>
        <SocialLinks variant="circle" />
      </div>
    </div>
  ),
}

/**
 * 03. Contact Details Table
 * All 8 contact rows with green links
 */
export const ContactTable: Story = {
  render: () => (
    <div className="bg-[#1E2024] p-8 w-[500px]">
      <table className="w-full text-[0.875rem] text-white">
        <tbody>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              KCVV Elewijt
            </th>
            <td className="p-0 lg:pb-1">Driesstraat 30, 1982 Elewijt</td>
          </tr>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              Voorzitter
            </th>
            <td className="p-0 lg:pb-1">Rudy Bautmans</td>
          </tr>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              GC
            </th>
            <td className="p-0 lg:pb-1">
              <a href="mailto:gc@kcvvelewijt.be" className="text-[#4acf52] hover:underline">
                John De Ron
              </a>
            </td>
          </tr>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              Algemeen contact
            </th>
            <td className="p-0 lg:pb-1">
              <a href="mailto:info@kcvvelewijt.be" className="text-[#4acf52] hover:underline">
                info@kcvvelewijt.be
              </a>
            </td>
          </tr>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              Jeugdwerking
            </th>
            <td className="p-0 lg:pb-1">
              <a href="mailto:jeugd@kcvvelewijt.be" className="text-[#4acf52] hover:underline">
                jeugd@kcvvelewijt.be
              </a>
            </td>
          </tr>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              Verhuur kantine
            </th>
            <td className="p-0 lg:pb-1">
              <a href="mailto:verhuur@kcvvelewijt.be" className="text-[#4acf52] hover:underline">
                Ann Walgraef
              </a>
            </td>
          </tr>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              Website
            </th>
            <td className="p-0 lg:pb-1">
              <a href="mailto:kevin@kcvvelewijt.be" className="text-[#4acf52] hover:underline">
                Kevin Van Ransbeeck
              </a>
            </td>
          </tr>
          <tr className="flex flex-col lg:flex-row mb-2">
            <th className="text-left font-normal uppercase p-0 lg:pr-4 lg:pb-1 underline lg:no-underline lg:w-[180px]">
              Privacy & cookies
            </th>
            <td className="p-0 lg:pb-1">
              <a href="/privacy" className="text-[#4acf52] hover:underline">
                Privacyverklaring
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
}

/**
 * 04. Vertical Divider
 * Gradient line separator between sections
 */
export const VerticalDivider: Story = {
  render: () => (
    <div className="bg-[#1E2024] p-8 h-64">
      <div className="relative h-full w-16 mx-auto">
        <div
          className="absolute h-[calc(100%-17px)] w-px bottom-0 left-1/2"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 100%)',
          }}
        />
      </div>
    </div>
  ),
}

/**
 * 05. Sponsors Grid
 * 4-column grid with opacity hover effect
 */
export const SponsorsGrid: Story = {
  render: () => (
    <div className="bg-[#1E2024] p-8 w-[600px]">
      <h3 className="text-xl font-bold mb-4 text-white">Onze sponsors</h3>
      <p className="text-sm mb-6 text-white/80">
        KCVV Elewijt wordt mede mogelijk gemaakt door onze trouwe sponsors.
      </p>

      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/2] bg-white/10 rounded flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
          >
            <span className="text-xs text-white/40">Logo</span>
          </div>
        ))}
      </div>

      <Link
        href="/sponsors"
        className="inline-block mt-6 text-[#4acf52] hover:underline text-sm"
      >
        Alle sponsors &raquo;
      </Link>
    </div>
  ),
}

/**
 * 06. Bottom Motto with Gradient Line
 * Full-width motto section with gradient top border
 */
export const BottomMotto: Story = {
  render: () => (
    <div className="bg-[#1E2024] w-[800px]">
      <div
        className="relative pt-12 pb-4"
        style={{
          width: '100%',
        }}
      >
        {/* Gradient top border */}
        <div
          className="absolute top-4 left-0 w-full h-px"
          style={{
            background:
              'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 33%, rgba(255, 255, 255, 0.2) 66%, rgba(255, 255, 255, 0) 100%)',
          }}
        />

        {/* Motto Text */}
        <p className="text-center text-white/60 text-sm italic py-4">
          Er is maar één plezante compagnie
        </p>
      </div>
    </div>
  ),
}

/**
 * 07. Contact Table - Mobile View
 * Shows responsive behavior with labels underlined
 */
export const ContactTableMobile: Story = {
  render: () => (
    <div className="bg-[#1E2024] p-4 w-[375px]">
      <table className="w-full text-[0.875rem] text-white">
        <tbody>
          <tr className="flex flex-col mb-2">
            <th className="text-left font-normal uppercase p-0 underline">KCVV Elewijt</th>
            <td className="p-0">Driesstraat 30, 1982 Elewijt</td>
          </tr>
          <tr className="flex flex-col mb-2">
            <th className="text-left font-normal uppercase p-0 underline">Algemeen contact</th>
            <td className="p-0">
              <a href="mailto:info@kcvvelewijt.be" className="text-[#4acf52] hover:underline">
                info@kcvvelewijt.be
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
}
