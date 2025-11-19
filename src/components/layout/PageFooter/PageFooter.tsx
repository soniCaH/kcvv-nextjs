/**
 * PageFooter Component
 * Site footer with contact info, social links, and sponsors
 */

import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@/components/ui'
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import { cn } from '@/lib/utils/cn'

export interface PageFooterProps {
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Site footer component
 *
 * Features:
 * - Contact information
 * - Social media links
 * - Sponsor logos
 * - Club motto
 */
export const PageFooter = ({ className }: PageFooterProps) => {
  return (
    <footer className={cn('bg-white border-t border-[#edeff4]', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Section */}
          <div className="lg:col-span-5">
            {/* Logo and Social */}
            <div className="mb-8">
              <Link href="/" className="inline-block mb-6">
                <Image
                  src="/images/logo-flat.png"
                  alt="KCVV ELEWIJT"
                  width={150}
                  height={60}
                  className="h-auto w-auto"
                />
              </Link>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/KCVVElewijt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-kcvv-gray-light hover:bg-kcvv-green-bright text-kcvv-gray-dark hover:text-white transition-colors"
                >
                  <Icon icon={<FaFacebookF />} size="sm" />
                </a>
                <a
                  href="https://twitter.com/kcvve"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-kcvv-gray-light hover:bg-kcvv-green-bright text-kcvv-gray-dark hover:text-white transition-colors"
                >
                  <Icon icon={<FaTwitter />} size="sm" />
                </a>
                <a
                  href="https://www.instagram.com/kcvve"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-kcvv-gray-light hover:bg-kcvv-green-bright text-kcvv-gray-dark hover:text-white transition-colors"
                >
                  <Icon icon={<FaInstagram />} size="sm" />
                </a>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-bold text-kcvv-gray-blue">KCVV Elewijt</span>
                <span className="text-kcvv-gray-dark">Driesstraat 30, 1982 Elewijt</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-bold text-kcvv-gray-blue">Voorzitter</span>
                <span className="text-kcvv-gray-dark">Rudy Bautmans</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-bold text-kcvv-gray-blue">GC</span>
                <a
                  href="mailto:gc@kcvvelewijt.be"
                  className="text-kcvv-green-bright hover:underline"
                >
                  John De Ron
                </a>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-bold text-kcvv-gray-blue">Algemeen contact</span>
                <a
                  href="mailto:info@kcvvelewijt.be"
                  className="text-kcvv-green-bright hover:underline"
                >
                  info@kcvvelewijt.be
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="w-px h-full bg-[#edeff4] mx-auto" />
          </div>

          {/* Sponsors Section */}
          <div className="lg:col-span-6">
            <h3 className="text-xl font-bold text-kcvv-gray-blue mb-6">Onze sponsors</h3>
            <p className="text-sm text-kcvv-gray-dark mb-4">
              KCVV Elewijt wordt mede mogelijk gemaakt door onze trouwe sponsors.
            </p>
            {/* Sponsors will be loaded dynamically from CMS */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {/* Placeholder for sponsor logos */}
              <div className="aspect-[3/2] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                Sponsor
              </div>
              <div className="aspect-[3/2] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                Sponsor
              </div>
              <div className="aspect-[3/2] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                Sponsor
              </div>
              <div className="aspect-[3/2] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                Sponsor
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Motto */}
      <div className="hidden lg:block bg-kcvv-gray-dark py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-white/60 text-sm italic">
            Er is maar één plezante compagnie
          </p>
        </div>
      </div>
    </footer>
  )
}
