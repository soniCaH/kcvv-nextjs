'use client'

import { useEffect, useState } from 'react'

/**
 * Displays a small status UI that reports whether the site's title, body, alt, and mono fonts are loaded by reading the relevant CSS custom properties.
 *
 * The component checks font-family CSS variables, shows success messages when expected fonts are present, otherwise shows the detected fallback, and re-checks shortly after mount to catch late-loading fonts.
 *
 * @returns A React element that presents the load status for title, body, alt, and mono fonts and optional Typekit ID information.
 */
export function FontLoadingCheck() {
  const [fontStatus, setFontStatus] = useState<{
    title: string
    body: string
    alt: string
    mono: string
  } | null>(null)

  useEffect(() => {
    // Check which fonts are actually loaded
    const checkFonts = () => {
      const titleFont = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-title')
        .trim()

      const bodyFont = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-body')
        .trim()

      const altFont = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-alt')
        .trim()

      const monoFont = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-mono')
        .trim()

      setFontStatus({
        title: titleFont.includes('quasimoda') || titleFont.includes('acumin-pro')
          ? '✅ Typekit fonts loaded (quasimoda/acumin-pro)'
          : `⚠️ Fallback in use: ${titleFont.split(',')[0]}`,
        body: bodyFont.includes('montserrat')
          ? '✅ Montserrat loaded'
          : `⚠️ Fallback in use: ${bodyFont.split(',')[0]}`,
        alt: altFont.includes('stenciletta')
          ? '✅ Stenciletta loaded'
          : `⚠️ Fallback in use: ${altFont.split(',')[0]}`,
        mono: monoFont.includes('ibm-plex-mono')
          ? '✅ IBM Plex Mono loaded'
          : `⚠️ Fallback in use: ${monoFont.split(',')[0]}`,
      })
    }

    // Check immediately
    checkFonts()

    // Check again after fonts might have loaded
    const timer = setTimeout(checkFonts, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!fontStatus) {
    return <p className="text-sm text-kcvv-gray">⏳ Checking font loading status...</p>
  }

  return (
    <div className="space-y-2 text-sm">
      <p>
        <strong>Title Font (headings):</strong> {fontStatus.title}
      </p>
      <p>
        <strong>Body Font:</strong> {fontStatus.body}
      </p>
      <p>
        <strong>Alt Font (display):</strong> {fontStatus.alt}
      </p>
      <p>
        <strong>Mono Font (numbers):</strong> {fontStatus.mono}
      </p>

      <div className="mt-4 p-3 bg-kcvv-green-100 rounded text-xs">
        <p className="font-bold mb-2">How to verify fonts in DevTools:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Right-click any heading → Inspect</li>
          <li>Go to &ldquo;Computed&rdquo; tab</li>
          <li>Search for &ldquo;font-family&rdquo;</li>
          <li>
            First font should be <code className="bg-white px-1 rounded">quasimoda</code> or{' '}
            <code className="bg-white px-1 rounded">acumin-pro</code>
          </li>
        </ol>
      </div>

      {process.env.NEXT_PUBLIC_TYPEKIT_ID && (
        <p className="text-xs text-kcvv-gray mt-4">
          Typekit ID: <code className="bg-white px-1 rounded">{process.env.NEXT_PUBLIC_TYPEKIT_ID}</code>
        </p>
      )}
    </div>
  )
}