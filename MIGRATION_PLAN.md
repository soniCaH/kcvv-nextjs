# KCVV Elewijt Website Migration: Gatsby → Next.js 15
## Complete Migration Planning Document

**Version:** 1.0
**Date:** 2025-01-12
**Current Stack:** Gatsby 5 + Drupal + Foundation Sites + SCSS
**Target Stack:** Next.js 15 + Drupal + Effect + TypeScript + Tailwind CSS

---

## Executive Summary

### Migration Goals
- ✅ Migrate from Gatsby 5 to Next.js 15 (App Router)
- ✅ **100% Visual Parity**: Pixel-perfect recreation (zero regressions)
- ✅ Implement ISR (Incremental Static Regeneration) for automatic content updates
- ✅ Replace Foundation Sites with Tailwind CSS (remove jQuery)
- ✅ Full type-safety with TypeScript + Effect Schema
- ✅ Use Effect for robust data fetching and error handling
- ✅ Component-driven architecture with reusability and testing
- ✅ Reduce hosting costs from $15/month to $0/month (Vercel/Cloudflare free tier)
- ✅ Maintain all existing features and functionality

### Key Metrics
- **Pages to Migrate:** ~120-150 routes
- **Components:** 49 components
- **Content Types:** 8 Drupal content types
- **External APIs:** 2 (Drupal JSON:API, Footbalisto)
- **Estimated Timeline:** 10 weeks (single developer)
- **Test Coverage Target:** >80%

### Core Principles
1. **100% Visual Parity**: Pixel-perfect recreation of existing design
2. **Component-Driven**: Reusable, typed components with Storybook documentation
3. **Full Type Safety**: TypeScript strict mode + Effect Schema validation
4. **Tested Components**: Vitest + React Testing Library for all components
5. **Design System**: Tailwind config with exact colors, spacing, typography
6. **Progressive Enhancement**: Maintain all features, improve performance

---

## Technical Architecture

### Stack Overview

#### Frontend
- **Framework:** Next.js 15.3.3 (App Router)
- **Runtime:** React 19
- **Language:** TypeScript 5.8+ (strict mode)
- **Effect:** Effect v3.x for FP patterns
- **Styling:** Tailwind CSS 4.1.10
- **UI Components:** Radix UI (headless components)
- **Icons:** react-icons
- **Animation:** Framer Motion (`motion` package)

#### Data Layer
- **CMS:** Drupal JSON:API (https://api.kcvvelewijt.be)
- **External API:** Footbalisto (match data, rankings)
- **Schema Validation:** Effect Schema (`import { Schema as S } from 'effect'`)
- **Data Fetching:** Effect HTTP Client
- **Caching Strategy:** ISR with Next.js revalidation

#### Hosting & Deployment
- **Platform:** Vercel (free tier) or Cloudflare Pages
- **Build Strategy:** ISR with on-demand revalidation
- **Image Optimization:** next/image with Drupal CDN
- **Analytics:** Google Tag Manager (migrated)

---

## Project Structure

```
kcvv-nextjs/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI pipeline (tests, lint)
│       └── visual-regression.yml     # Visual regression tests
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── theme.ts                      # Storybook theme matching site
├── public/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (main)/                   # Main site layout group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── news/
│   │   │   │   ├── page.tsx          # News overview
│   │   │   │   ├── [page]/
│   │   │   │   │   └── page.tsx      # Paginated news
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Article detail
│   │   │   ├── team/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Team page
│   │   │   ├── player/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx      # Player profile
│   │   │   │       └── share/
│   │   │   │           └── page.tsx  # Player share
│   │   │   ├── game/
│   │   │   │   └── [matchId]/
│   │   │   │       └── page.tsx      # Match detail
│   │   │   ├── events/
│   │   │   │   └── page.tsx
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   └── club/
│   │   │       ├── contact/
│   │   │       ├── history/
│   │   │       ├── downloads/
│   │   │       ├── register/
│   │   │       └── ultras/
│   │   ├── (kiosk)/                  # Kiosk layout group
│   │   │   ├── layout.tsx            # Full-screen layout
│   │   │   └── kiosk/
│   │   │       ├── a/page.tsx
│   │   │       ├── b/page.tsx
│   │   │       ├── previous/page.tsx
│   │   │       ├── upcoming/page.tsx
│   │   │       └── ranking/
│   │   │           ├── a/page.tsx
│   │   │           ├── b/page.tsx
│   │   │           └── u21/page.tsx
│   │   ├── api/                      # API routes
│   │   │   ├── revalidate/
│   │   │   │   └── route.ts          # On-demand revalidation
│   │   │   └── footbalisto/
│   │   │       ├── matches/
│   │   │       ├── ranking/
│   │   │       └── stats/
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/                       # Base UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   ├── Icon/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Spinner/
│   │   │   ├── Badge/
│   │   │   ├── Dialog/
│   │   │   ├── Dropdown/
│   │   │   ├── Tabs/
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── PageHeader/
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   ├── PageHeader.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PageFooter/
│   │   │   ├── Navigation/
│   │   │   ├── MobileMenu/
│   │   │   ├── Container/
│   │   │   ├── Grid/
│   │   │   └── Breadcrumbs/
│   │   └── domain/                   # Domain-specific components
│   │       ├── matches/
│   │       │   ├── MatchTeaser/
│   │       │   ├── MatchesOverview/
│   │       │   ├── MatchesSlider/
│   │       │   ├── MatchesTabs/
│   │       │   ├── ScheurkalenderMatches/
│   │       │   ├── ClubcalendarMatches/
│   │       │   └── ...
│   │       ├── team/
│   │       │   ├── TeamStats/
│   │       │   ├── Ranking/
│   │       │   ├── MiniRanking/
│   │       │   ├── Lineup/
│   │       │   └── ...
│   │       ├── player/
│   │       │   ├── PlayerTeaser/
│   │       │   ├── PlayerProfile/
│   │       │   ├── PlayerShare/
│   │       │   └── ...
│   │       └── cards/
│   │           ├── CardTeaser/
│   │           ├── CardTVTeaser/
│   │           ├── EventCard/
│   │           └── ...
│   ├── lib/
│   │   ├── effect/
│   │   │   ├── services/
│   │   │   │   ├── DrupalService.ts
│   │   │   │   ├── DrupalService.test.ts
│   │   │   │   ├── FootbalistoService.ts
│   │   │   │   ├── FootbalistoService.test.ts
│   │   │   │   └── CacheService.ts
│   │   │   ├── schemas/
│   │   │   │   ├── article.schema.ts
│   │   │   │   ├── team.schema.ts
│   │   │   │   ├── player.schema.ts
│   │   │   │   ├── staff.schema.ts
│   │   │   │   ├── event.schema.ts
│   │   │   │   ├── match.schema.ts
│   │   │   │   ├── ranking.schema.ts
│   │   │   │   └── index.ts
│   │   │   ├── runtime.ts            # Effect runtime config
│   │   │   └── errors.ts             # Custom error types
│   │   ├── drupal/
│   │   │   ├── client.ts             # Base Drupal client
│   │   │   ├── queries.ts            # Query builders
│   │   │   └── types.ts              # Drupal-specific types
│   │   ├── footbalisto/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   ├── cn.ts                 # classnames helper
│   │   │   ├── dates.ts              # Luxon date utils
│   │   │   ├── image.ts              # Image URL helpers
│   │   │   └── test-utils.tsx        # Testing utilities
│   │   └── constants.ts
│   └── types/
│       ├── drupal.ts                 # Drupal content types
│       ├── footbalisto.ts
│       └── index.ts
├── tests/
│   ├── e2e/                          # Playwright E2E tests
│   │   ├── navigation.spec.ts
│   │   ├── article-browsing.spec.ts
│   │   ├── team-pages.spec.ts
│   │   └── search.spec.ts
│   └── visual/                       # Visual regression tests
│       ├── pages.spec.ts
│       └── components.spec.ts
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
├── MIGRATION_PLAN.md                 # This document
└── DESIGN_SYSTEM.md                  # Design system documentation
```

---

## Phase 0: Design System Extraction (Week 1) ✅ COMPLETED

### Goals
- ✅ Extract and document current design system from Gatsby site
- ✅ Create comprehensive visual inventory
- ✅ Configure Tailwind with exact brand tokens
- ✅ Set up visual regression testing baseline

### Status: COMPLETED
- DESIGN_SYSTEM.md created with full visual inventory
- Tailwind CSS v4 configured with KCVV brand tokens
- Adobe Typekit fonts loaded (quasimoda, acumin-pro, etc.)
- Testing infrastructure set up (Vitest, happy-dom)
- Git commit: Phase 0 complete

### Tasks

#### 0.1: Audit Current Design System

**Extract from Gatsby site:**
- All SCSS variables from `src/styles/_variables.scss`
- Foundation settings from `src/styles/_settings.scss`
- Color palette (primary green: #4B9B48, etc.)
- Typography scale (font sizes, weights, line-heights)
- Spacing system (margins, paddings)
- Border radius values
- Box shadows
- Breakpoints

**Document:**
- Component inventory (all 49 components)
- Layout patterns
- Animation patterns
- Icon system

#### 0.2: Create DESIGN_SYSTEM.md

**Content:**
```markdown
# KCVV Elewijt Design System

## Colors

### Brand Colors
- Primary Green: #4B9B48
- (extract all other colors)

### Text Colors
- (extract from SCSS)

### Background Colors
- (extract from SCSS)

## Typography

### Font Families
- Primary: (Adobe Typekit font)
- Monospace: (extract)

### Font Sizes
- (map all sizes)

### Line Heights
- (map all line-heights)

### Font Weights
- (map all weights)

## Spacing

### Spacing Scale
- (map Foundation rem values to Tailwind)

## Components

### Button
- Variants: primary, secondary, ghost, link
- Sizes: sm, md, lg
- States: default, hover, active, disabled

(document all components)
```

#### 0.3: Configure Tailwind

**File:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // KCVV Brand Colors (extracted from SCSS)
        'kcvv-green': {
          DEFAULT: '#4B9B48',
          50: '#E8F5E7',
          100: '#D1EBD0',
          200: '#A3D7A1',
          300: '#75C372',
          400: '#4B9B48',
          500: '#3C7C3A',
          600: '#2D5D2B',
          700: '#1E3E1D',
          800: '#0F1F0E',
          900: '#000000',
        },
        // Extract all other colors from _variables.scss
      },
      spacing: {
        // Map Foundation spacing to Tailwind scale
      },
      fontSize: {
        // Extract exact font sizes
      },
      lineHeight: {
        // Preserve line-height values
      },
      borderRadius: {
        // Match current border radius values
      },
      boxShadow: {
        // Replicate card shadows exactly
      },
      screens: {
        // Foundation breakpoints
        'sm': '640px',
        'md': '1024px',   // Foundation medium
        'lg': '1280px',   // Foundation large
        'xl': '1440px',
      },
    },
  },
  plugins: [],
}

export default config
```

#### 0.4: Set Up Testing Infrastructure

**Install dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @playwright/test @storybook/react @storybook/nextjs happy-dom
```

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**File:** `tests/setup.ts`

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**File:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
```

**File:** `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
```

#### 0.5: Create Visual Regression Baseline

**File:** `tests/visual/baseline.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Visual Regression Baseline', () => {
  test('homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveScreenshot('homepage.png')
  })

  test('article page', async ({ page }) => {
    await page.goto('/news/example-article')
    await expect(page).toHaveScreenshot('article-page.png')
  })

  // Add baselines for all key pages
})
```

### Deliverables
- ✅ `DESIGN_SYSTEM.md` with complete visual inventory
- ✅ `tailwind.config.ts` with exact brand tokens
- ✅ Testing infrastructure configured (Vitest, Playwright, Storybook)
- ✅ Component folder structure created
- ✅ Visual regression baseline established

---

## Phase 1: Foundation + Component Library (Weeks 2-3) ✅ COMPLETED

### Goals
- ✅ Build core Effect services for data fetching
- ✅ Create base UI component library with tests
- ✅ Build layout components (Header, Footer, Navigation)
- ✅ Establish component development workflow

### Status: COMPLETED (3 sub-phases)

#### Phase 1A: Effect Services ✅
- Complete Effect schemas for all Drupal content types
- DrupalService with JSON:API integration (articles, teams, players, events)
- FootbalistoService with 5-minute caching
- Effect runtime with runPromise helper
- 25 passing tests with retry logic and error handling
- Git commit: b20ccc1

#### Phase 1B: Base UI Components ✅
- Button component: 4 variants (primary, secondary, ghost, link), 26 tests
- Card component: 4 variants with sub-components, 30 tests
- Icon component: Wrapper for react-icons, 20 tests
- Spinner component: Loading indicators, 26 tests
- Storybook 10.0.8 configured with @storybook/nextjs
- 102 UI component tests passing
- Git commit: 8a65a7f

#### Phase 1C: Layout Components ✅ COMPLETED WITH VISUAL PARITY

**Initial Implementation:**
- PageHeader: Sticky header with logo and navigation, 10 tests
- Navigation: Desktop menu with hover dropdowns
- MobileMenu: Off-canvas slide-in (#1E2024 dark theme)
- PageFooter: Contact info, social links, sponsors
- All 49 menu items from Gatsby site preserved
- Git commit: 4fd02af

**Visual Parity Fixes (Critical):**
After initial implementation, comprehensive visual audit against Gatsby site revealed
styling discrepancies. All components rebuilt to match pixel-perfect:

1. **PageHeader Visual Rebuild** (commit b29e9e9)
   - Changed background from white to bright green (#4acf52)
   - Added header-pattern.png background image (positioned 50% -7vw)
   - Changed text from dark to white throughout
   - Fixed heights: 5rem (mobile) / 7.5rem (desktop at 960px)
   - Logo sizes: 100px (mobile) / 7rem (desktop)
   - Hamburger/search positioning: left 34px / right 34px

2. **Storybook Configuration** (commit 218b59e)
   - Added globals.css import to .storybook/preview.ts (critical!)
   - Fixed breakpoint: lg: 960px (was 1024px - Gatsby uses 60rem)
   - Ensured Tailwind CSS renders in Storybook

3. **Navigation Styling** (commits 9ff350d, 0219af4)
   - Replaced styled-jsx with dangerouslySetInnerHTML (Storybook compatibility)
   - Font: 0.7rem / 0.875rem at 1240px+, uppercase, bold
   - Hover effect: White 2px underline animating from center (width 0→100%, left 50%→0)
   - Dropdown: Black background (#1E2024), white text, green hover
   - SVG chevron icons on dropdown triggers (6px × 4px)
   - Fixed global CSS overriding nav link colors

4. **MobileMenu Styling** (commit d5d942b)
   - 4px green left border on hover/active (::before pseudo-element)
   - Font: 0.6875rem (11px), uppercase, bold
   - Border: 1px solid #292c31 between items
   - Submenu: Background #292c31 (dark charcoal gray, NOT blue-ish gray-800)
   - Submenu borders: #62656A (medium gray) between items
   - Inset shadows for depth

5. **Granular Storybook Stories** (commits 404bdba, e74c587)
   - Created 12 atomic element stories in PageHeader.elements.stories.tsx
   - Each story shows ONE element/state for visual verification:
     1. HeaderContainer (green + pattern)
     2. LogoDesktop (7rem)
     3. LogoMobile (100px)
     4. NavigationItemDefault
     5. NavigationItemHover (underline animation)
     6. NavigationItemActive (permanent underline)
     7. DropdownTrigger (chevron icons)
     8. DropdownSubmenu (black dropdown)
     9. HamburgerButton
     10. SearchButton
     11. MobileMenuItem (4px green border)
     12. MobileMenuSubmenu (accordion with correct colors)

6. **Assets Migrated:**
   - header-pattern.png (20KB)
   - logo-flat.png (13KB)
   - kcvv-logo.png (13KB)

7. **Documentation Cleanup** (commit de662e6)
   - Removed src/stories/ directory (Storybook default examples)
   - Removed 26 files of dummy "acme" content
   - Clean Storybook with only KCVV components

8. **Dropdown Overflow Fix** (commit 7e00696)
   - Fixed "De Club" and last menu items' dropdowns overflowing viewport
   - Added intelligent positioning: last 2 items align dropdown to right instead of left
   - Prevents horizontal scrolling on all screen sizes
   - Implementation: `isNearEnd = index >= menuItems.length - 2`

**Visual Parity Checklist (All ✅):**
- ✅ Green background (#4acf52) with pattern image
- ✅ White text throughout navigation
- ✅ Correct logo sizes (mobile/desktop)
- ✅ Hover underline effects (center-out animation)
- ✅ Dropdown chevron icons
- ✅ Black dropdown menus (#1E2024)
- ✅ Dropdown positioning (right-aligned for last 2 items)
- ✅ Mobile menu 4px green accent border
- ✅ Correct mobile submenu colors (#292c31, not blue-ish)
- ✅ Responsive at 960px (not 1024px)
- ✅ All typography sizes match Gatsby exactly

9. **PageFooter Visual Rebuild** (commit 7464a0c)
   - Black background (#1E2024) with SVG wavy top edge (footer-top.svg)
   - All 8 contact rows (added missing: Jeugdwerking, Verhuur, Website, Privacy)
   - Contact table: 0.875rem, uppercase labels, green links
   - Social links: Circular buttons with 2px border (using reusable SocialLinks component)
   - Sponsors: 4-column grid with opacity 0.5→1 hover
   - Vertical gradient divider between sections
   - Bottom motto with gradient line separator
   - **Created SocialLinks reusable component** (2 variants: circle, inline)
   - Refactored MobileMenu to use SocialLinks component (DRY principle)
   - 17 PageFooter tests + 10 SocialLinks tests
   - 3 component stories + 7 element stories + 5 SocialLinks stories

**Test Coverage Summary:**
```
Total Tests: 164/164 passing ✅

UI Components (112 tests):
├── Button:      26 tests (4 variants, loading, disabled, sizes, interactions)
├── Card:        30 tests (4 variants, sub-components, responsive)
├── Icon:        20 tests (sizes, colors, wrappers)
├── Spinner:     26 tests (sizes, variants, animations)
└── SocialLinks: 10 tests (circle/inline variants, URLs, accessibility) [NEW]

Layout Components (27 tests):
├── PageHeader:  10 tests (rendering, responsive, navigation, mobile menu)
└── PageFooter:  17 tests (all 8 contact rows, logo, social, sponsors, motto) [NEW]

Effect Services (25 tests):
├── DrupalService:     14 tests (articles, teams, players, error handling, retry)
└── FootbalistoService: 11 tests (matches, rankings, caching, timeouts)
```

**Components Created: 10 (5 UI + 5 Layout)**
- UI: Button, Card, Icon, Spinner, SocialLinks
- Layout: PageHeader, Navigation, MobileMenu, PageFooter, (Container)

**Storybook Stories: 46 stories**
- 27 component stories
- 19 element stories (12 PageHeader + 7 PageFooter)

**Visual Parity: 100% with Gatsby site ✅**
**Git commits:** 4fd02af (initial), b29e9e9-7464a0c (visual parity complete)

### Tasks

#### 1.1: Effect Schema Definitions

**File:** `src/lib/effect/schemas/article.schema.ts`

```typescript
import { Schema as S } from 'effect'

// Drupal Image Schema
export const DrupalImageSchema = S.Struct({
  uri: S.Struct({
    url: S.String
  }),
  alt: S.optional(S.String),
  title: S.optional(S.String),
  width: S.optional(S.Number),
  height: S.optional(S.Number)
})

export type DrupalImage = S.Schema.Type<typeof DrupalImageSchema>

// Drupal Article Schema
export const ArticleSchema = S.Struct({
  id: S.String,
  type: S.Literal('node--article'),
  attributes: S.Struct({
    title: S.String,
    created: S.String.pipe(S.DateFromString),
    changed: S.optional(S.String.pipe(S.DateFromString)),
    body: S.optional(S.Struct({
      value: S.String,
      format: S.String,
      processed: S.String
    })),
    path: S.Struct({
      alias: S.String
    })
  }),
  relationships: S.Struct({
    field_image: S.optional(S.Struct({
      data: S.optional(DrupalImageSchema)
    })),
    field_category: S.optional(S.Struct({
      data: S.Array(S.Struct({
        id: S.String,
        type: S.Literal('taxonomy_term--category')
      }))
    }))
  })
})

export type Article = S.Schema.Type<typeof ArticleSchema>
```

**File:** `src/lib/effect/schemas/team.schema.ts`

```typescript
import { Schema as S } from 'effect'

export const TeamSchema = S.Struct({
  id: S.String,
  type: S.Literal('node--team'),
  attributes: S.Struct({
    title: S.String,
    field_team_id: S.Number,
    field_league_id: S.optional(S.Number),
    field_league: S.optional(S.String),
    path: S.Struct({
      alias: S.String
    })
  })
})

export type Team = S.Schema.Type<typeof TeamSchema>
```

**File:** `src/lib/effect/schemas/player.schema.ts`

```typescript
import { Schema as S } from 'effect'
import { DrupalImageSchema } from './article.schema'

export const PlayerSchema = S.Struct({
  id: S.String,
  type: S.Literal('node--player'),
  attributes: S.Struct({
    title: S.String,
    field_position: S.optional(S.String),
    field_number: S.optional(S.Number),
    field_birth_date: S.optional(S.String.pipe(S.DateFromString)),
    body: S.optional(S.Struct({
      value: S.String,
      processed: S.String
    })),
    path: S.Struct({
      alias: S.String
    })
  }),
  relationships: S.Struct({
    field_image: S.optional(S.Struct({
      data: S.optional(DrupalImageSchema)
    })),
    field_team: S.optional(S.Struct({
      data: S.optional(S.Struct({
        id: S.String,
        type: S.Literal('node--team')
      }))
    }))
  })
})

export type Player = S.Schema.Type<typeof PlayerSchema>
```

**File:** `src/lib/effect/schemas/match.schema.ts`

```typescript
import { Schema as S } from 'effect'

// Footbalisto Match Schema
export const MatchSchema = S.Struct({
  id: S.Number,
  date: S.String.pipe(S.DateFromString),
  home_team: S.Struct({
    id: S.Number,
    name: S.String,
    logo: S.optional(S.String)
  }),
  away_team: S.Struct({
    id: S.Number,
    name: S.String,
    logo: S.optional(S.String)
  }),
  score: S.optional(S.Struct({
    home: S.Number,
    away: S.Number
  })),
  status: S.Literal('scheduled', 'live', 'finished'),
  venue: S.optional(S.String)
})

export type Match = S.Schema.Type<typeof MatchSchema>

// Ranking Entry Schema
export const RankingEntrySchema = S.Struct({
  position: S.Number,
  team_id: S.Number,
  team_name: S.String,
  played: S.Number,
  won: S.Number,
  drawn: S.Number,
  lost: S.Number,
  goals_for: S.Number,
  goals_against: S.Number,
  goal_difference: S.Number,
  points: S.Number
})

export type RankingEntry = S.Schema.Type<typeof RankingEntrySchema>
```

**File:** `src/lib/effect/schemas/index.ts`

```typescript
export * from './article.schema'
export * from './team.schema'
export * from './player.schema'
export * from './match.schema'
```

#### 1.2: Drupal Service with Effect

**File:** `src/lib/effect/services/DrupalService.ts`

```typescript
import { Effect, Context, Layer, HttpClient, Schedule } from 'effect'
import { Schema as S } from 'effect'
import { ArticleSchema, type Article } from '../schemas/article.schema'
import { TeamSchema, type Team } from '../schemas/team.schema'
import { PlayerSchema, type Player } from '../schemas/player.schema'

// Custom Error Types
export class DrupalError extends S.TaggedError<DrupalError>()(
  'DrupalError',
  {
    message: S.String,
    cause: S.optional(S.Unknown)
  }
) {}

export class NotFoundError extends S.TaggedError<NotFoundError>()(
  'NotFoundError',
  {
    resource: S.String,
    slug: S.String
  }
) {}

// Service Interface
export class DrupalService extends Context.Tag('DrupalService')<
  DrupalService,
  {
    readonly getArticles: (params?: {
      page?: number
      limit?: number
      category?: string
    }) => Effect.Effect<Array<Article>, DrupalError>

    readonly getArticleBySlug: (slug: string) => Effect.Effect<Article, DrupalError | NotFoundError>

    readonly getTeams: () => Effect.Effect<Array<Team>, DrupalError>

    readonly getTeamBySlug: (slug: string) => Effect.Effect<Team, DrupalError | NotFoundError>

    readonly getPlayers: (teamId?: string) => Effect.Effect<Array<Player>, DrupalError>

    readonly getPlayerBySlug: (slug: string) => Effect.Effect<Player, DrupalError | NotFoundError>
  }
>() {}

// Implementation Layer
export const DrupalServiceLive = Layer.effect(
  DrupalService,
  Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient

    const baseUrl = process.env.DRUPAL_API_URL || 'https://api.kcvvelewijt.be'

    const client = httpClient.pipe(
      HttpClient.filterStatusOk,
      HttpClient.mapRequest(
        HttpClient.setHeader('Accept', 'application/vnd.api+json')
      )
    )

    const getArticles = (params?: {
      page?: number
      limit?: number
      category?: string
    }) =>
      Effect.gen(function* () {
        const url = new URL(`${baseUrl}/jsonapi/node/article`)

        // Add query params
        url.searchParams.set('include', 'field_image,field_category')
        url.searchParams.set('sort', '-created')

        const limit = params?.limit || 18
        url.searchParams.set('page[limit]', limit.toString())

        if (params?.page) {
          url.searchParams.set('page[offset]', ((params.page - 1) * limit).toString())
        }

        if (params?.category) {
          url.searchParams.set('filter[field_category.name]', params.category)
        }

        const response = yield* client.get(url.toString())
        const json = yield* response.json

        // Decode using Effect Schema
        const articles = yield* S.decodeUnknown(S.Array(ArticleSchema))(json.data)

        return articles
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchAll((error) =>
          Effect.fail(new DrupalError({ message: 'Failed to fetch articles', cause: error }))
        )
      )

    const getArticleBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith('/') ? slug : `/news/${slug}`
        const url = `${baseUrl}/jsonapi/node/article?filter[path.alias]=${normalizedSlug}&include=field_image,field_category`

        const response = yield* client.get(url)
        const json = yield* response.json

        if (!json.data || json.data.length === 0) {
          return yield* Effect.fail(new NotFoundError({ resource: 'article', slug }))
        }

        const article = yield* S.decodeUnknown(ArticleSchema)(json.data[0])

        return article
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchTag('NotFoundError', (e) => Effect.fail(e)),
        Effect.catchAll((error) =>
          Effect.fail(new DrupalError({ message: `Failed to fetch article: ${slug}`, cause: error }))
        )
      )

    const getTeams = () =>
      Effect.gen(function* () {
        const url = `${baseUrl}/jsonapi/node/team?sort=title`

        const response = yield* client.get(url)
        const json = yield* response.json

        const teams = yield* S.decodeUnknown(S.Array(TeamSchema))(json.data)

        return teams
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchAll((error) =>
          Effect.fail(new DrupalError({ message: 'Failed to fetch teams', cause: error }))
        )
      )

    const getTeamBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith('/') ? slug : `/team/${slug}`
        const url = `${baseUrl}/jsonapi/node/team?filter[path.alias]=${normalizedSlug}`

        const response = yield* client.get(url)
        const json = yield* response.json

        if (!json.data || json.data.length === 0) {
          return yield* Effect.fail(new NotFoundError({ resource: 'team', slug }))
        }

        const team = yield* S.decodeUnknown(TeamSchema)(json.data[0])

        return team
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchTag('NotFoundError', (e) => Effect.fail(e)),
        Effect.catchAll((error) =>
          Effect.fail(new DrupalError({ message: `Failed to fetch team: ${slug}`, cause: error }))
        )
      )

    const getPlayers = (teamId?: string) =>
      Effect.gen(function* () {
        const url = new URL(`${baseUrl}/jsonapi/node/player`)
        url.searchParams.set('include', 'field_image,field_team')
        url.searchParams.set('sort', 'field_number')

        if (teamId) {
          url.searchParams.set('filter[field_team.id]', teamId)
        }

        const response = yield* client.get(url.toString())
        const json = yield* response.json

        const players = yield* S.decodeUnknown(S.Array(PlayerSchema))(json.data)

        return players
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchAll((error) =>
          Effect.fail(new DrupalError({ message: 'Failed to fetch players', cause: error }))
        )
      )

    const getPlayerBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith('/') ? slug : `/player/${slug}`
        const url = `${baseUrl}/jsonapi/node/player?filter[path.alias]=${normalizedSlug}&include=field_image,field_team`

        const response = yield* client.get(url)
        const json = yield* response.json

        if (!json.data || json.data.length === 0) {
          return yield* Effect.fail(new NotFoundError({ resource: 'player', slug }))
        }

        const player = yield* S.decodeUnknown(PlayerSchema)(json.data[0])

        return player
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchTag('NotFoundError', (e) => Effect.fail(e)),
        Effect.catchAll((error) =>
          Effect.fail(new DrupalError({ message: `Failed to fetch player: ${slug}`, cause: error }))
        )
      )

    return {
      getArticles,
      getArticleBySlug,
      getTeams,
      getTeamBySlug,
      getPlayers,
      getPlayerBySlug
    }
  })
)
```

#### 1.3: Footbalisto Service

**File:** `src/lib/effect/services/FootbalistoService.ts`

```typescript
import { Effect, Context, Layer, HttpClient, Cache, Schedule } from 'effect'
import { Schema as S } from 'effect'
import { MatchSchema, type Match, RankingEntrySchema, type RankingEntry } from '../schemas/match.schema'

// Custom Error Type
export class FootbalistoError extends S.TaggedError<FootbalistoError>()(
  'FootbalistoError',
  {
    message: S.String,
    cause: S.optional(S.Unknown)
  }
) {}

// Service Interface
export class FootbalistoService extends Context.Tag('FootbalistoService')<
  FootbalistoService,
  {
    readonly getMatches: (teamId: number) => Effect.Effect<Array<Match>, FootbalistoError>
    readonly getMatchById: (matchId: number) => Effect.Effect<Match, FootbalistoError>
    readonly getRanking: (leagueId: number) => Effect.Effect<Array<RankingEntry>, FootbalistoError>
    readonly getTeamStats: (teamId: number) => Effect.Effect<unknown, FootbalistoError>
  }
>() {}

// Implementation Layer
export const FootbalistoServiceLive = Layer.effect(
  FootbalistoService,
  Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient
    const baseUrl = process.env.FOOTBALISTO_API_URL || 'https://footbalisto.be'

    const client = httpClient.pipe(
      HttpClient.filterStatusOk
    )

    // Create cache for API responses (5 minute TTL)
    const matchCache = yield* Cache.make({
      capacity: 100,
      timeToLive: '5 minutes',
      lookup: (teamId: number) =>
        Effect.gen(function* () {
          const response = yield* client.get(`${baseUrl}/matches/${teamId}`)
          const json = yield* response.json
          const matches = yield* S.decodeUnknown(S.Array(MatchSchema))(json)
          return matches
        }).pipe(
          Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
          Effect.timeout('30 seconds')
        )
    })

    const rankingCache = yield* Cache.make({
      capacity: 50,
      timeToLive: '5 minutes',
      lookup: (leagueId: number) =>
        Effect.gen(function* () {
          const response = yield* client.get(`${baseUrl}/ranking/${leagueId}`)
          const json = yield* response.json
          const ranking = yield* S.decodeUnknown(S.Array(RankingEntrySchema))(json)
          return ranking
        }).pipe(
          Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
          Effect.timeout('30 seconds')
        )
    })

    const getMatches = (teamId: number) =>
      Cache.get(matchCache, teamId).pipe(
        Effect.catchAll((error) =>
          Effect.fail(new FootbalistoError({ message: 'Failed to fetch matches', cause: error }))
        )
      )

    const getMatchById = (matchId: number) =>
      Effect.gen(function* () {
        const response = yield* client.get(`${baseUrl}/match/${matchId}`)
        const json = yield* response.json
        const match = yield* S.decodeUnknown(MatchSchema)(json)
        return match
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchAll((error) =>
          Effect.fail(new FootbalistoError({ message: `Failed to fetch match: ${matchId}`, cause: error }))
        )
      )

    const getRanking = (leagueId: number) =>
      Cache.get(rankingCache, leagueId).pipe(
        Effect.catchAll((error) =>
          Effect.fail(new FootbalistoError({ message: 'Failed to fetch ranking', cause: error }))
        )
      )

    const getTeamStats = (teamId: number) =>
      Effect.gen(function* () {
        const response = yield* client.get(`${baseUrl}/stats/team/${teamId}`)
        const json = yield* response.json
        return json
      }).pipe(
        Effect.retry(Schedule.exponential('1 second', 2.0).pipe(Schedule.upTo('10 seconds'))),
        Effect.timeout('30 seconds'),
        Effect.catchAll((error) =>
          Effect.fail(new FootbalistoError({ message: 'Failed to fetch team stats', cause: error }))
        )
      )

    return {
      getMatches,
      getMatchById,
      getRanking,
      getTeamStats
    }
  })
)
```

#### 1.4: Effect Runtime Configuration

**File:** `src/lib/effect/runtime.ts`

```typescript
import { Effect, Layer, ManagedRuntime } from 'effect'
import { DrupalService, DrupalServiceLive } from './services/DrupalService'
import { FootbalistoService, FootbalistoServiceLive } from './services/FootbalistoService'

// Combine all service layers
const AppLayer = Layer.mergeAll(
  DrupalServiceLive,
  FootbalistoServiceLive
)

// Create managed runtime
export const runtime = ManagedRuntime.make(AppLayer)

// Helper to run effects in Next.js server components
export const runPromise = <A, E>(effect: Effect.Effect<A, E>) =>
  runtime.runPromise(effect)

// Helper with error handling for Next.js
export const runPromiseOrThrow = <A, E>(effect: Effect.Effect<A, E>) =>
  runtime.runPromise(effect).catch((error) => {
    console.error('Effect runtime error:', error)
    throw error
  })

// Provide services to an effect
export const provideServices = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.provide(effect, AppLayer)
```

#### 1.5: Base UI Components

**Component Structure:**
Each component follows this pattern:
```
src/components/ui/Button/
├── Button.tsx          # Component implementation
├── Button.test.tsx     # Unit tests
├── Button.stories.tsx  # Storybook stories
└── index.ts            # Exports
```

**Example: Button Component**

**File:** `src/components/ui/Button/Button.tsx`

```typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, isLoading, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variantStyles = {
      primary: 'bg-kcvv-green text-white hover:bg-kcvv-green-600 focus-visible:ring-kcvv-green',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400',
      ghost: 'hover:bg-gray-100 focus-visible:ring-gray-400',
      link: 'text-kcvv-green underline-offset-4 hover:underline',
    }

    const sizeStyles = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-11 px-6 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

**File:** `src/components/ui/Button/Button.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-kcvv-green')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-200')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })
})
```

**File:** `src/components/ui/Button/Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading Button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}
```

**File:** `src/components/ui/Button/index.ts`

```typescript
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

#### 1.6: Utility Functions

**File:** `src/lib/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with proper Tailwind CSS merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**File:** `src/lib/utils/dates.ts`

```typescript
import { DateTime } from 'luxon'

/**
 * Format date using Luxon (replacing moment/date-fns)
 */
export const formatDate = (date: Date | string, format: string = 'dd/MM/yyyy'): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)
  return dt.setLocale('nl').toFormat(format)
}

export const formatDateTime = (date: Date | string): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)
  return dt.setLocale('nl').toFormat('dd/MM/yyyy HH:mm')
}

export const formatRelative = (date: Date | string): string => {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)
  return dt.setLocale('nl').toRelative() || ''
}
```

**File:** `src/lib/utils/image.ts`

```typescript
/**
 * Construct Drupal image URL
 */
export const getDrupalImageUrl = (uri: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_API_URL || 'https://api.kcvvelewijt.be'
  return uri.startsWith('http') ? uri : `${baseUrl}${uri}`
}

/**
 * Get image dimensions for next/image
 */
export const getImageDimensions = (width?: number, height?: number) => {
  return {
    width: width || 1200,
    height: height || 800,
  }
}
```

### Deliverables
- ✅ Complete Effect service layer (Drupal, Footbalisto)
- ✅ Effect schemas for all content types
- ✅ Base UI components with tests and stories
- ✅ Utility functions
- ✅ Component development workflow established

---

## Phase 2: Content Pages (Weeks 4-5) ✅ IN PROGRESS

### Goals
- ✅ Build article detail pages with Drupal content
- ✅ Create news overview with pagination and filtering
- ⏳ Implement homepage with latest news
- ⏳ Add search functionality
- ✅ Dynamic content rendering with ISR

### Status: PARTIALLY COMPLETE

**Completed:**
- ✅ Layout components (PageHeader, Navigation, MobileMenu, PageFooter) 100% complete
- ✅ Effect services for Drupal and Footbalisto working
- ✅ Base UI components (Button, Card, Icon, Spinner) tested
- ✅ Article detail pages working with ISR
- ✅ News overview with pagination (9 per page, 3-column grid)
- ✅ Category filtering with slug-based URLs
- ✅ Published articles filter
- ✅ CategoryFilters component with scroll arrows
- ✅ Storybook configured and working
- ✅ All 164 tests passing
- ✅ Visual parity with Gatsby achieved

**Verification Results (2025-11-21):**
- ✅ Main news page (`/news`) loads successfully with 9 articles
- ✅ Category filtering works (`/news?category=jeugd`, `/news?category=evenement`, `/news?category=ploeg`)
- ✅ Article detail pages render correctly (`/news/2025-06-20-definitieve-reeksindeling-3e-nationale-bis`)
- ✅ 16 category filters displayed with scroll arrows on all screen sizes
- ✅ Slug-based filtering using taxonomy term ID lookup
- ✅ 118 total articles in Drupal
- ⚠️ Minor issue: Category page titles don't change (metadata not dynamic)

### Components Created

#### 2.1: Article Components ✅ COMPLETE

**Created Components:**
- `ArticleCard` - Grid card for news listings (with image, title, date, tags)
- `ArticleHeader` - Article hero section
- `ArticleMetadata` - Date, author, category badges
- `ArticleBody` - HTML content renderer
- `ArticleFooter` - Social share + related articles
- `CategoryFilters` - Horizontal scrollable category filters with arrows

**File:** `src/app/(main)/news/[slug]/page.tsx` ✅
- Article detail rendering with full content
- Hero image with Next.js Image optimization
- Category badges and metadata
- Social share buttons (Twitter, Facebook, WhatsApp)
- Related articles section
- ISR with 1-hour revalidation

**Features:**
- ✅ Effect Schema validation for all article data
- ✅ Image optimization with next/image
- ✅ Drupal HTML content rendering
- ✅ Category tag display
- ✅ Social sharing integration
- ✅ Related articles by category
- ✅ 404 handling for missing articles

#### 2.2: News Overview with Pagination ✅ COMPLETE

**File:** `src/app/(main)/news/page.tsx` ✅

**Implementation:**
```typescript
// Query parameter structure:
// /news - all articles
// /news?page=2 - pagination
// /news?category=jeugd - filter by category slug
// /news?category=jeugd&page=2 - combined

// Features:
- 9 articles per page (3 complete rows in 3-column grid)
- Slug-based category filtering (extracts slug from taxonomy term path.alias)
- Published articles only (filter[status]=1)
- Pagination with prev/next links
- CategoryFilters component with scroll arrows (all screen sizes)
- ISR with 1-hour revalidation
- Effect Schema validation
```

**CategoryFilters Component Features:**
- ✅ Horizontal scrollable filter buttons
- ✅ Circular scroll arrows (left/right) on all screen sizes
- ✅ Native CSS smooth scroll behavior
- ✅ Dynamic arrow visibility based on scroll position
- ✅ Slug-based URLs (`/news?category=jeugd`)
- ✅ Active state highlighting
- ✅ MacOS scrollbar hiding handled

**Grid Layout:**
- Desktop: 3-column grid (`lg:grid-cols-3`)
- Mobile: Single column stack
- Cards: Image (16:10 mobile, 4:3 desktop), title, date, tags
- Hover effects: Image zoom, card lift

**Pagination:**
- "Alles" filter shows all categories
- Clean URLs: `/news?category=ploeg&page=2`
- Prev/Next navigation with disabled states

**Data Flow:**
1. Fetch taxonomy terms to get category slugs
2. Match URL slug to taxonomy term ID
3. Filter articles by `field_tags.drupal_internal__tid`
4. Return paginated results with links

#### 2.3: Homepage ⏳ NOT STARTED

**File:** `src/app/(main)/page.tsx`

**Requirements:**
- Latest news section
- Upcoming matches
- Team standings
- Hero section (if present in Gatsby)

#### 2.4: Search Functionality ⏳ NOT STARTED

**Future Implementation:**
- Global search across articles, teams, players
- Search page: `/search?q=goalkeeper`
- Combined filters: `/news?category=jeugd&search=goalkeeper&page=2`
- Query parameter design ready for search integration

### Technical Achievements

**Effect Schema Validation:**
- All Drupal responses validated with Effect Schema
- Type-safe article, taxonomy, and media data
- Automatic error handling and retry logic
- Schema transformations (e.g., DateFromString)

**Performance:**
- ISR with 1-hour revalidation
- Parallel data fetching (articles + tags)
- Next.js Image optimization
- Smooth scroll with native CSS

**UX Improvements:**
- Scroll arrows for category filters (all screen sizes)
- Dynamic padding based on arrow visibility
- Proper vertical alignment of arrows with buttons
- Complete rows in grid (9 items = 3×3)

### Deliverables
- ✅ PageHeader with tests and visual parity
- ✅ Navigation with dropdown support
- ✅ MobileMenu with animations
- ✅ PageFooter with all sections (contact, social, sponsors, motto)
- ✅ Article detail pages with ISR
- ✅ News overview with pagination and category filtering
- ✅ CategoryFilters component with scroll arrows
- ✅ Published articles filter
- ✅ Slug-based category URLs
- ⏳ Homepage
- ⏳ Search functionality

---

## Phases 3-8 (Weeks 4-10)

The detailed implementation continues following the same pattern:
- Extract existing component/page structure
- Recreate pixel-perfect with Tailwind
- Write tests (unit + visual regression)
- Verify all features work identically
- Document any differences

Each phase builds on previous work, maintaining:
- Component reusability
- Full type safety
- Test coverage
- Visual parity
- Performance optimization

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
- Test component rendering
- Test prop variations
- Test user interactions
- Test edge cases
- Target: >80% coverage

### Integration Tests
- Test Effect services
- Test API integrations
- Test data transformations

### E2E Tests (Playwright)
- Critical user flows (browse articles, view team pages)
- Form submissions
- Navigation patterns
- Search functionality

### Visual Regression Tests (Playwright)
- Capture screenshots of all pages
- Compare against baseline
- Test at multiple viewports
- Strict tolerance (<100px difference)

### Accessibility Tests
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast

---

## Deployment Strategy

### Staging Environment
1. Deploy to Vercel staging
2. Run full test suite
3. Visual regression comparison
4. UAT with stakeholders

### Production Deployment
1. Configure environment variables
2. Set up Drupal webhooks
3. Configure redirects (Gatsby → Next.js URLs)
4. Deploy to production
5. Monitor errors and performance
6. Update DNS
7. Decommission Gatsby site

---

## Success Criteria

### Pre-Launch Checklist
- [ ] All pages migrated
- [ ] 100% visual parity confirmed
- [ ] All features working
- [ ] Zero accessibility regressions
- [ ] Performance equal or better
- [ ] All tests passing
- [ ] SEO metadata preserved
- [ ] Analytics working
- [ ] Mobile fully functional
- [ ] Cross-browser tested

### Post-Launch Metrics
- Zero critical bugs
- Hosting cost: $0/month (Vercel free tier)
- Build time: <5 minutes (ISR)
- Content updates: No rebuild required
- Lighthouse score: >90
- Core Web Vitals: All green

---

## Timeline Summary

**Week 1:** Design system extraction
**Weeks 2-3:** Foundation + component library
**Weeks 4-5:** Content pages
**Weeks 6-7:** Team & player features
**Week 8:** Interactive features
**Week 9:** QA & testing
**Week 10:** Deployment

---

## Package Dependencies

```json
{
  "dependencies": {
    "next": "^15.3.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "effect": "^3.x",
    "tailwindcss": "^4.1.10",
    "postcss": "^8.x",
    "@radix-ui/react-dialog": "^1.1.x",
    "@radix-ui/react-dropdown-menu": "^2.1.x",
    "@radix-ui/react-tabs": "^1.1.x",
    "@radix-ui/react-accordion": "^1.2.x",
    "embla-carousel-react": "^8.x",
    "luxon": "^3.7.x",
    "react-icons": "^5.5.x",
    "clsx": "^2.1.x",
    "tailwind-merge": "^2.x",
    "qrcode.react": "^4.2.x",
    "react-share": "^5.2.x",
    "motion": "^12.18.x"
  },
  "devDependencies": {
    "@types/node": "^22.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "@types/luxon": "^3.x",
    "typescript": "^5.8.x",
    "vitest": "^3.x",
    "@vitest/ui": "^3.x",
    "@testing-library/react": "^16.x",
    "@testing-library/user-event": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@playwright/test": "^1.49.x",
    "@storybook/react": "^8.x",
    "@storybook/nextjs": "^8.x",
    "@storybook/addon-essentials": "^8.x",
    "@storybook/addon-a11y": "^8.x",
    "eslint": "^9.x",
    "eslint-config-next": "^15.3.x",
    "@next/bundle-analyzer": "^15.3.x",
    "happy-dom": "^15.x"
  }
}
```

---

## Resources & Documentation

### Official Docs
- **Next.js:** https://nextjs.org/docs
- **Effect:** https://effect.website/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/primitives
- **Drupal JSON:API:** https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module

### Tools
- **Vercel:** https://vercel.com
- **Storybook:** https://storybook.js.org
- **Playwright:** https://playwright.dev
- **Vitest:** https://vitest.dev

---

## Next Steps

1. ✅ Review this planning document
2. ⏳ Begin Phase 0: Design System Extraction
3. Extract SCSS variables and Foundation settings
4. Create DESIGN_SYSTEM.md
5. Configure Tailwind with brand tokens
6. Set up testing infrastructure
7. Create visual regression baseline

---

**End of Migration Plan**

This document will be updated throughout the migration as we complete each phase and discover new requirements.
