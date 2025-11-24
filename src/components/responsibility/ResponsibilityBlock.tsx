'use client'

/**
 * Responsibility Block for Homepage
 *
 * Compact version of the responsibility finder for the homepage
 */

import Link from 'next/link'
import { ResponsibilityFinder } from './ResponsibilityFinder'

/**
 * Renders the responsibility block containing a compact finder, a link to the full help page, and three quick-link cards.
 *
 * @returns The responsibility block UI element.
 */
export function ResponsibilityBlock() {
  return (
    <section className="bg-gradient-to-br from-green-main/5 to-green-hover/5 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-blue mb-4"
            style={{ fontFamily: 'quasimoda, acumin-pro, Montserrat, sans-serif' }}
          >
            Hoe kunnen we je helpen?
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-2xl mx-auto">
            Vind snel de juiste contactpersoon voor jouw vraag
          </p>
        </div>

        {/* Compact Finder */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <ResponsibilityFinder compact />

          {/* Link to full page */}
          <div className="mt-8 text-center">
            <Link
              href="/hulp"
              className="inline-flex items-center gap-2 text-green-main hover:text-green-hover font-semibold transition-colors"
            >
              Bekijk alle veelgestelde vragen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/club/organogram"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-main/10 rounded-full flex items-center justify-center text-green-main group-hover:bg-green-main group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-blue group-hover:text-green-main">Organogram</div>
                <div className="text-xs text-gray-medium">Alle bestuursleden</div>
              </div>
            </div>
          </Link>

          <Link
            href="/club/contact"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-main/10 rounded-full flex items-center justify-center text-green-main group-hover:bg-green-main group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-blue group-hover:text-green-main">Contact</div>
                <div className="text-xs text-gray-medium">Algemene info</div>
              </div>
            </div>
          </Link>

          <Link
            href="/club/register"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-main/10 rounded-full flex items-center justify-center text-green-main group-hover:bg-green-main group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-blue group-hover:text-green-main">Inschrijven</div>
                <div className="text-xs text-gray-medium">Word lid</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}