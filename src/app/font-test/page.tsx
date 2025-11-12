/**
 * Font Test Page
 * Validates that Adobe Typekit fonts are loading correctly
 */

import { FontLoadingCheck } from './FontLoadingCheck'

export default function FontTestPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="mb-8">KCVV Elewijt - Font Loading Test</h1>

      {/* Heading Fonts (quasimoda, acumin-pro) */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">Heading Fonts (Title Family)</h2>
        <p className="mb-4 text-sm text-kcvv-gray">
          Font stack: quasimoda, acumin-pro, Montserrat, Verdana, sans-serif
        </p>

        <div className="space-y-4">
          <div>
            <h1 style={{ fontFamily: 'var(--font-family-title)' }}>
              H1: The Quick Brown Fox Jumps Over
            </h1>
            <p className="text-xs text-kcvv-gray">
              Desktop: 48px / Mobile: 28px - Weight: 700
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-family-title)' }}>
              H2: The Quick Brown Fox Jumps Over
            </h2>
            <p className="text-xs text-kcvv-gray">
              Desktop: 32px / Mobile: 22px - Weight: 700
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-family-title)' }}>
              H3: The Quick Brown Fox Jumps Over
            </h3>
            <p className="text-xs text-kcvv-gray">
              Desktop: 24px / Mobile: 20px - Weight: 700
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-family-title)' }}>
              H4: The Quick Brown Fox Jumps Over
            </h4>
            <p className="text-xs text-kcvv-gray">
              Desktop: 22px / Mobile: 18px - Weight: 700
            </p>
          </div>

          <div>
            <h5 style={{ fontFamily: 'var(--font-family-title)' }}>
              H5: The Quick Brown Fox Jumps Over
            </h5>
            <p className="text-xs text-kcvv-gray">16px - Weight: 700</p>
          </div>

          <div>
            <h6 style={{ fontFamily: 'var(--font-family-title)' }}>
              H6: The Quick Brown Fox Jumps Over
            </h6>
            <p className="text-xs text-kcvv-gray">14px - Weight: 700</p>
          </div>
        </div>
      </section>

      {/* Body Font (montserrat) */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">Body Font (Montserrat)</h2>
        <p className="mb-4 text-sm text-kcvv-gray">
          Font stack: montserrat, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto,
          Helvetica Neue, Arial, sans-serif
        </p>

        <div className="space-y-4">
          <p style={{ fontFamily: 'var(--font-family-body)', fontWeight: 400 }}>
            Normal (400): The quick brown fox jumps over the lazy dog. KCVV Elewijt is een
            voetbalclub met stamnummer 55. Er is maar één plezante compagnie! 0123456789
          </p>

          <p style={{ fontFamily: 'var(--font-family-body)', fontWeight: 500 }}>
            Medium (500): The quick brown fox jumps over the lazy dog. KCVV Elewijt is een
            voetbalclub met stamnummer 55. Er is maar één plezante compagnie! 0123456789
          </p>

          <p style={{ fontFamily: 'var(--font-family-body)', fontWeight: 700 }}>
            Bold (700): The quick brown fox jumps over the lazy dog. KCVV Elewijt is een
            voetbalclub met stamnummer 55. Er is maar één plezante compagnie! 0123456789
          </p>
        </div>
      </section>

      {/* Alternative Font (stenciletta) */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">Alternative Font (Stenciletta)</h2>
        <p className="mb-4 text-sm text-kcvv-gray">
          Font stack: stenciletta, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto,
          Helvetica Neue, Arial, sans-serif
        </p>

        <div className="space-y-4">
          <p
            className="text-4xl"
            style={{ fontFamily: 'var(--font-family-alt)', fontWeight: 400 }}
          >
            KCVV ELEWIJT
          </p>
          <p className="text-sm text-kcvv-gray">Used for decorative/display text</p>
        </div>
      </section>

      {/* Monospace Font (ibm-plex-mono) */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">Monospace Font (IBM Plex Mono)</h2>
        <p className="mb-4 text-sm text-kcvv-gray">
          Font stack: ibm-plex-mono, Consolas, Liberation Mono, Courier, monospace
        </p>

        <div className="space-y-4">
          <div className="text-6xl" style={{ fontFamily: 'var(--font-family-mono)' }}>
            3 - 1
          </div>
          <p className="text-sm text-kcvv-gray">Used for match scores and statistics</p>

          <div className="flex gap-8" style={{ fontFamily: 'var(--font-family-mono)' }}>
            <div>
              <div className="text-3xl">12</div>
              <div className="text-sm text-kcvv-gray">Goals</div>
            </div>
            <div>
              <div className="text-3xl">8</div>
              <div className="text-sm text-kcvv-gray">Assists</div>
            </div>
            <div>
              <div className="text-3xl">25</div>
              <div className="text-sm text-kcvv-gray">Matches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Test */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">KCVV Brand Colors</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="h-20 bg-kcvv-green rounded mb-2"></div>
            <p className="text-sm font-medium">KCVV Green</p>
            <p className="text-xs text-kcvv-gray">#4acf52</p>
          </div>

          <div>
            <div className="h-20 bg-kcvv-green-dark rounded mb-2"></div>
            <p className="text-sm font-medium">KCVV Green Dark</p>
            <p className="text-xs text-kcvv-gray">#4B9B48</p>
          </div>

          <div>
            <div className="h-20 bg-kcvv-black rounded mb-2"></div>
            <p className="text-sm font-medium">KCVV Black</p>
            <p className="text-xs text-kcvv-gray">#1E2024</p>
          </div>

          <div>
            <div className="h-20 bg-kcvv-gray-blue rounded mb-2"></div>
            <p className="text-sm font-medium">Gray Blue</p>
            <p className="text-xs text-kcvv-gray">#31404b</p>
          </div>

          <div>
            <div className="h-20 bg-kcvv-gray rounded mb-2"></div>
            <p className="text-sm font-medium">KCVV Gray</p>
            <p className="text-xs text-kcvv-gray">#62656A</p>
          </div>

          <div>
            <div className="h-20 bg-foundation-gray-light rounded mb-2 border"></div>
            <p className="text-sm font-medium">Foundation Gray Light</p>
            <p className="text-xs text-kcvv-gray">#edeff4</p>
          </div>
        </div>
      </section>

      {/* Blockquote Test */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">Blockquote Style</h2>

        <blockquote>
          <p>Er is maar één plezante compagnie</p>
        </blockquote>
      </section>

      {/* Utility Classes Test */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">Utility Classes</h2>

        <div className="space-y-6">
          <div className="featured-border">
            <p className="font-medium">Featured Border</p>
            <p className="text-sm text-kcvv-gray">Green line above text</p>
          </div>

          <div className="after-border">
            <p className="font-medium">After Border</p>
            <p className="text-sm text-kcvv-gray">Green line below text</p>
          </div>
        </div>
      </section>

      {/* Button Test */}
      <section className="mb-12">
        <h2 className="mb-4 text-kcvv-green">Button Styles</h2>

        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center justify-center rounded font-medium transition-colors bg-kcvv-green text-white hover:bg-kcvv-green-hover h-10 px-4 text-base uppercase font-bold">
            Primary Button
          </button>

          <button className="inline-flex items-center justify-center rounded font-medium transition-colors bg-kcvv-gray text-white hover:bg-kcvv-gray-dark h-10 px-4 text-base uppercase font-bold">
            Secondary Button
          </button>

          <button className="inline-flex items-center justify-center rounded font-medium transition-colors bg-kcvv-green text-white hover:bg-kcvv-green-hover h-9 px-3 text-sm uppercase font-medium">
            Small Button
          </button>
        </div>
      </section>

      {/* Font Loading Check */}
      <section className="mb-12 p-6 bg-foundation-gray-light rounded">
        <h2 className="mb-4 text-kcvv-green">Font Loading Status</h2>
        <FontLoadingCheck />
      </section>
    </div>
  )
}
