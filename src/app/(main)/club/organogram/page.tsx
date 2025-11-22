/**
 * Organogram Page
 *
 * Interactive organizational chart showing the complete KCVV club structure,
 * including Hoofdbestuur and Jeugdbestuur.
 */

import type { Metadata } from 'next'
import { OrganogramClient } from '@/components/organogram'

export const metadata: Metadata = {
  title: 'Organogram | KCVV Elewijt',
  description: 'Ontdek de organisatiestructuur van KCVV Elewijt met ons interactieve organogram. Bekijk het hoofdbestuur, jeugdbestuur en alle verantwoordelijkheden binnen de club.',
  keywords: ['KCVV Elewijt', 'organogram', 'bestuur', 'jeugdbestuur', 'hoofdbestuur', 'organisatie', 'voetbalclub'],
  openGraph: {
    title: 'Organogram KCVV Elewijt',
    description: 'Interactieve organisatiestructuur van KCVV Elewijt - Hoofdbestuur en Jeugdbestuur',
    type: 'website',
  },
}

export default function OrganogramPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-main via-green-hover to-green-dark-hover text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'quasimoda, acumin-pro, Montserrat, sans-serif' }}>
            Organogram KCVV Elewijt
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            Ontdek de organisatiestructuur van onze club. Klik op een bestuurslid voor meer informatie.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <OrganogramClient />
      </div>
    </div>
  )
}
