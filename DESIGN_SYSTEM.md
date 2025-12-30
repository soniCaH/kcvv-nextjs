# KCVV Elewijt Design System

## Visual Identity & Component Library

**Version:** 1.0
**Last Updated:** 2025-01-12
**Source:** Extracted from Gatsby site

---

## ⚠️ AUTHORITATIVE SOURCE

**This is the PRIMARY design reference for KCVV Next.js.**

All components (migrations from Gatsby AND new features) must follow this design system:

- ✅ Use exact color values (#4acf52 for primary green)
- ✅ Follow typography scale and font families
- ✅ Respect spacing and breakpoint conventions
- ✅ Match component patterns (buttons, cards, forms)
- ✅ Maintain brand consistency

**Before creating any new component:** Review relevant sections in this document.

---

## Development Workflow

### When to Use This Guide

**This guide is Step 1 in the component development workflow.** All component development must follow this sequence:

1. **Design System FIRST** (this document) - Define design decisions
2. **Storybook SECOND** ([STORYBOOK.md](./STORYBOOK.md)) - Create stories
3. **Implementation THIRD** - Write component code

**Rationale:** Starting with the design system ensures consistency across components and prevents costly refactoring. By defining design tokens, component patterns, and visual specifications upfront, we create a shared vocabulary between designers and developers. This approach reduces design debt, maintains brand consistency, and makes components more reusable. Creating Storybook stories before implementation serves as executable specifications and catches design issues early when they're cheapest to fix.

### Workflow Steps

When creating a new component or migrating an existing one:

1. **Review Design System** (this document)
   - Check existing patterns in [Components](#components) section
   - Identify required colors from [Colors](#colors)
   - Select typography from [Typography](#typography)
   - Apply spacing from [Spacing](#spacing)
   - Example artifact: _Design token decisions documented in component plan_

2. **Document Component Spec** (if new pattern)
   - Add to [Components](#components) section if creating a new pattern
   - Define states (default, hover, active, disabled, loading, error)
   - Specify responsive behavior at each [Breakpoint](#breakpoints)
   - Example artifact: _`## News Card` section in DESIGN_SYSTEM.md_

3. **Create Storybook Stories** → **Continue to [STORYBOOK.md](./STORYBOOK.md)**
   - Write stories for all component states
   - Example artifact: _`NewsCard.stories.tsx` with Default, Loading, Error states_

4. **Implement Component** → **After Storybook stories exist**
   - Build using Tailwind CSS with design system tokens
   - Example artifact: _`NewsCard.tsx` implementing the specification_

**Cross-reference:** See [STORYBOOK.md - When to Use This Guide](./STORYBOOK.md#when-to-use-this-guide-development-workflow) for Step 2 (story creation) details.

---

---

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Breakpoints](#breakpoints)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Components](#components)
8. [Layout System](#layout-system)
9. [Animation](#animation)

---

## Colors

### Brand Colors

#### Primary Green

- **Bright**: `#4acf52` (`--color-green--bright`)
  - Hover: `#41b147` (`--color-green--bright--dark`)
  - Alpha 50%: `rgba(74, 207, 82, 0.5)`
  - Alpha 75%: `rgba(74, 207, 82, 0.75)`
  - Alpha 25%: `rgba(74, 207, 82, 0.25)`
- **Dark**: `#4B9B48` (`--color-green--dark`)
  - Used in manifest, theme color
  - Hover: `#3f833d`
  - Alpha 10%: `rgba(75, 155, 72, 0.1)`
  - Alpha 25%: `rgba(75, 155, 72, 0.25)`
- **Alternative**: `#BADA55` (`--color-green`)
  - Alpha 10%: `rgba(186, 218, 85, 0.1)`

**Usage:**

- Primary green bright: Headers, CTAs, active states
- Primary green dark: Theme color, backgrounds
- Alternative green: Accents (less common)

### Neutral Colors

#### Blacks & Grays

- **Black**: `#1E2024` (`--color-black`)
- **Gray Blue**: `#31404b` (`--color-gray-blue`) - Used for headings
- **Gray Dark**: `#292c31` (`--color-gray--dark`) - Body font color
- **Gray Medium**: `#62656A` (`--color-gray--medium`)
- **Gray Light**: `#CCC` (`--color-gray--light`)

#### Foundation Palette

- **Light Gray**: `#edeff4`
- **Medium Gray**: `#cacaca`
- **Dark Gray**: `#9a9da2`
- **White**: `#fefefe`

### Semantic Colors

#### Foundation Semantic Palette

- **Primary**: `#4acf52` (matches brand green bright)
- **Secondary**: `#767676`
- **Success**: `#3adb76`
- **Warning**: `#ffae00`
- **Alert**: `#cc4b37`

---

## Typography

### Font Families

#### Primary Font (Headings)

```css
font-family: quasimoda, acumin-pro, "Montserrat", Verdana, sans-serif;
```

- Variable: `--font-title`, `--font-title--quasimoda`
- Source: Adobe Typekit (ID in env variable)
- Weight: 700 (bold) for headings
- Used for: h1-h6, page headers, card titles

#### Body Font

```css
font-family:
  montserrat,
  -apple-system,
  system-ui,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  Arial,
  sans-serif;
```

- Variable: `--font-body`
- Weight: 400 (normal), 700 (bold)
- Used for: Body text, paragraphs, navigation

#### Alternative Font (Display)

```css
font-family:
  stenciletta,
  -apple-system,
  system-ui,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  Arial,
  sans-serif;
```

- Variable: `--font-alt`
- Used for: Special decorative text, badges

#### Monospace Font (Numbers/Data)

```css
font-family: ibm-plex-mono, sans-serif;
```

- Variable: `--font-numbers`
- Used for: Match scores, statistics, rankings

### Font Sizes

#### Headings

**Mobile (< 768px)**

- **h1**: 28px (1.75rem)
- **h2**: 22px (1.375rem)
- **h3**: 20px (1.25rem)
- **h4**: 18px (1.125rem)
- **h5**: 16px (1rem)
- **h6**: 14px (0.875rem)

**Desktop (≥ 768px)**

- **h1**: 48px (3rem)
- **h2**: 32px (2rem)
- **h3**: 24px (1.5rem)
- **h4**: 22px (1.375rem)
- **h5**: 16px (1rem)
- **h6**: 14px (0.875rem)

#### Body Text

- **Base**: 16px (100%, 1rem)
- **Lead**: 20px (1.25rem) - 1.25x base
- **Small**: 13px (0.8125rem)
- **Tiny**: 12px (0.75rem)

#### Specialized

- **Quote**: 24px (1.5rem)
- **Stat**: 40px (2.5rem)

### Line Heights

- **Global**: 1.5
- **Headers**: 1.2
- **Paragraphs**: 1.75
- **Lead Text**: 1.6
- **Subheader**: 1.4
- **Quote**: 1.25

### Font Weights

- **Normal**: 400
- **Medium**: 500 (used in buttons, UI elements)
- **Bold**: 700 (headings, emphasis)

### Text Rendering

- **Headers**: `optimizeLegibility`
- **Paragraphs**: `optimizeLegibility`
- **Body**: Antialiased

---

## Spacing

### Spacing Scale

#### Foundation Base

- **Global Margin**: 1rem (16px)
- **Global Padding**: 1rem (16px)
- **Global Position**: 1rem (16px)

#### Custom Spacing

- **Mobile Padding**: 0.75rem (12px) (`--padding--mobile`)
- **Desktop Padding**: 2.5rem (40px) (`--padding--desktop`)

#### Gutters

- **Small**: 1rem (16px)
- **Medium**: 1rem (16px)

#### Component Spacing

- **Paragraph Margin Bottom**: 1rem
- **Header Margin Bottom**: 1em
- **Section Margin Top (Mobile)**: var(--margin-hero--mobile)
- **Section Margin Top (Desktop)**: var(--margin-hero--desktop)

### Max Widths

- **Outer Container**: 90rem (1440px) (`--max-width--outer`)
- **Inner Container**: 60rem (960px) or 70rem (1120px) (`--max-width--inner`)
- **Limited Wrapper**: 70rem (1120px)

### Container Padding

- **Mobile**: 0.75rem (12px)
- **Desktop**: 0 (content width controlled by max-width)

---

## Breakpoints

### Foundation Breakpoints

- **Small**: `0`
- **Medium**: `768px` (48rem)
- **Large**: `992px` (62rem)
- **XLarge**: `1280px` (80rem)
- **XXLarge**: `1440px` (90rem)

### Common Media Queries Used in Code

- **Mobile/Tablet**: `@media screen and (max-width: 60rem)` (960px)
- **Desktop**: `@media screen and (min-width: 60rem)` (960px)
- **Large Desktop**: `@media screen and (min-width: 70rem)` (1120px)

### Tailwind Mapping Recommendation

```typescript
screens: {
  'sm': '768px',    // Foundation medium
  'md': '992px',    // Foundation large
  'lg': '1280px',   // Foundation xlarge
  'xl': '1440px',   // Foundation xxlarge
}
```

**Note:** Many components use `60rem` (960px) as the desktop breakpoint. Consider adding:

```typescript
'desk': '960px',    // Common desktop breakpoint in codebase
```

---

## Border Radius

### Global Radius

- **Default**: `0.25em` (4px at 16px base)
- **Card**: `4px`

### Component-Specific

- **Button**: `0.25em`
- **Input**: `0.25em`
- **Card**: `4px`

---

## Shadows

### Box Shadows

#### Default

- **None**: Cards have no shadow by default

#### Prototype Shadow

```css
box-shadow:
  0 2px 5px 0 rgba(0, 0, 0, 0.16),
  0 2px 10px 0 rgba(0, 0, 0, 0.12);
```

#### Component-Specific

- **Off-canvas**: `0 0 10px rgba(0, 0, 0, 0.7)`
- **Thumbnail**: `0 0 0 1px rgba(0, 0, 0, 0.2)`
- **Thumbnail Hover**: `0 0 6px 1px rgba(#4acf52, 0.5)`

### Tailwind Mapping Recommendation

```typescript
boxShadow: {
  'none': 'none',
  'sm': '0 2px 5px 0 rgba(0, 0, 0, .16)',
  'DEFAULT': '0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12)',
  'md': '0 2px 10px 0 rgba(0, 0, 0, .12)',
  'lg': '0 0 10px rgba(0, 0, 0, 0.7)',
  'green': '0 0 6px 1px rgba(74, 207, 82, 0.5)',
}
```

---

## Components

### Button

#### Variants

**Primary Button** (`.btn`)

- **Background**: `#4acf52` (`--color-green--bright`)
- **Hover Background**: `rgba(74, 207, 82, 0.5)` (`--color-green--bright--alpha--50`)
- **Text Color**: `#FFF`
- **Padding**: `1rem 3rem`
- **Font Weight**: `700`
- **Text Transform**: `uppercase`
- **Transition**: `all 0.3s`
- **Border Radius**: `0.25em`

**Small Button** (`.btn--small`)

- **Font Size**: `85%`
- **Font Weight**: `500`
- **Padding**: `0.5rem 1.5rem`

**Alternative Button** (`.btn--alt`)

- **Background**: `#62656A` (`--color-gray--medium`)
- **Hover Background**: `#292c31` (`--color-gray--dark`)

**Arrow Button** (`.btn--arrow`)

- **Icon**: Lucide ArrowRight
- **Icon Position**: Right side, animated on hover
- **Mobile**: Full width (`display: block`)

#### Button Spacing

- **Adjacent Buttons**: `margin: 0.25rem` (mobile), `margin-left: 2rem` (desktop)

### Card

**Base Card** (`.card`)

- **Background**: `#fefefe` (white)
- **Border**: `1px solid #edeff4` (light gray)
- **Border Radius**: `4px`
- **Shadow**: `none`
- **Padding**: `0`
- **Margin Bottom**: `1rem`

**Card Teaser** (Component-specific)

- Aspect ratio: 1.5:1 for images
- Hover effects on cards
- Content padding varies by component

### Page Header

**Wrapper** (`.page_header__wrapper`)

- **Background**: `#4acf52` with pattern image
- **Pattern**: `url('../images/header-pattern.png')`
- **Background Position**: `50% -7vw`
- **Background Size**: `100vw auto`
- **Background Attachment**: `fixed`
- **Padding**: `0 0 10px`
- **Display**: `flex` with `flex-direction: column`

**Header Content** (`.page_header`)

- **Max Width**: `70rem` (standard), `90rem` (max variant)
- **Padding**: `1.25rem 1.5rem` (mobile), `0 0 1.25rem` (desktop ≥70rem)
- **h1 Color**: `#fff`
- **h1 Line Height**: `0.92`

**Inset Variants**

- **Inset**: `margin-bottom: -5rem; padding-bottom: 5rem`
- **Inset Large**: `margin-bottom: -8rem; padding-bottom: 8rem`

### Hero Image

**Hero Wrapper** (`.page__header__image__hero`)

- **Max Width**: `70rem`
- **Mobile**: Natural height
- **Desktop**: `35rem` height

**Small Hero** (`.page__header__image__hero--small`)

- **Desktop**: `20rem` height

**Background Blur Effect** (`.page__header__image__bg`)

- **Display**: `none` (mobile), `block` (desktop)
- **Filter**: `blur(0.5rem)`
- **Transform**: `scale(1.1)`
- **Position**: `absolute` (full coverage)

### Tables

**Ranking Table**

- **Background**: White
- **Border**: `1px solid #edeff4`
- **Row Hover**: Darken by 2%
- **Striped Rows**: Even rows with light background
- **Head Background**: Light gray
- **Padding**: `8px 10px`

### Forms

**Input Fields**

- **Background**: `#fefefe` (white)
- **Border**: `1px solid #cacaca`
- **Focus Border**: `1px solid #9a9da2`
- **Padding**: `8px` (0.5rem)
- **Border Radius**: `0.25em`
- **Font Size**: `16px`
- **Shadow**: `inset 0 1px 2px rgba(0, 0, 0, 0.1)`
- **Focus Shadow**: `0 0 5px #cacaca`

**Select Dropdown**

- **Triangle Color**: `#9a9da2`
- **Background**: `#fefefe`

**Labels**

- **Color**: `#1E2024`
- **Font Size**: `14px`
- **Font Weight**: `400`
- **Line Height**: `1.8`

### Off-Canvas Menu

**Background**: `#1E2024` (`--color-black`)
**Width**: `250px` (small breakpoint)
**Shadow**: `0 0 10px rgba(0, 0, 0, 0.7)`
**Transition**: `0.5s ease`
**Overlay Background**: `rgba(0, 0, 0, 0.8)`

### Tabs

**Tab Background**: `#fefefe`
**Tab Color**: `#4acf52`
**Active Background**: `#edeff4`
**Active Color**: `#4acf52`
**Item Padding**: `1.25rem 1.5rem`
**Font Size**: `12px`

---

## Layout System

### Grid System (Foundation)

- **Columns**: 12
- **Gutter**: 1rem (small), 1rem (medium)
- **Max Width**: 1280px
- **Column Align Edge**: true

### Container Pattern

```scss
.page__wrapper {
  padding: 0.75rem; // Mobile

  @media (min-width: 60rem) {
    padding: 0;
    width: 100%;
    max-width: 90rem;
    margin: 0 auto;
  }
}
```

### Layout Modifiers

- **Limited**: `max-width: 70rem`
- **Max**: `max-width: 90rem`

---

## Animation

### Transitions

#### Button

```css
transition: all 0.3s;
```

#### Input

```css
transition:
  box-shadow 0.5s,
  border-color 0.25s ease-in-out;
```

#### Slider

```css
transition: all 0.2s ease-in-out;
```

#### Off-canvas

```css
transition: 0.5s ease;
```

### External Library

- **animate.css**: Imported globally for component animations
- Used with `react-animate-on-scroll` for scroll-triggered animations

---

## Special Elements

### Blockquote

- **Font Size**: `1.5rem`
- **Font Weight**: `500`
- **Line Height**: `1.25`
- **Color**: `#292c31` (`--color-gray--dark`)
- **Quote Mark**: `\201C` (opening quote)
  - **Color**: `#4acf52`
  - **Font Size**: `15rem`
  - **Float**: `left`

### Featured Border (`.featured-border`)

```css
&::before {
  content: "";
  display: block;
  width: 4rem;
  border-top: 2px solid #4acf52;
  margin-bottom: 10px;
}
```

### After Border (`.after-border`)

```css
&::after {
  border-top: 2px solid #4acf52;
  position: absolute;
  width: 4rem;
  bottom: -8px;
  left: 0;
  content: "";
}
```

---

## Icon System

### Font Awesome

- **Version**: 4.x (based on icon codes like `\F178`)
- **Usage**: Imported via custom SCSS (`./vendor_font_fa`)
- **Examples**:
  - Arrow Right: `\F178`

### Simple Line Icons

- **Imported**: `./vendor_font_simple_lines`
- **Usage**: Various UI icons throughout site

---

## Component Inventory

### Layout Components

1. **PageHeader** - Main site header with logo and navigation
2. **PageFooter** - Footer with sponsor logos and links
3. **Navigation** - Desktop horizontal menu
4. **MobileMenu** - Off-canvas mobile navigation

### Content Components

1. **Card** - Generic card component with image and text
2. **CardTeaser** - Article teaser card for news
3. **CardTVTeaser** - Video content teaser
4. **EventCard** - Event listing card

### Match Components

1. **MatchTeaser** - Individual match display
2. **Matches** - Match list container
3. **MatchesOverview** - Tabbed match view
4. **MatchesSlider** - Carousel of matches
5. **MatchesTabs** - Tabbed interface for matches
6. **ScheurkalenderMatches** - Tear-off calendar matches
7. **ClubcalendarMatches** - Club calendar view

### Team Components

1. **TeamStats** - Team statistics display
2. **Ranking** - League table/standings
3. **MiniRanking** - Compact ranking widget
4. **Lineup** - Team lineup visualization

### Player Components

1. **PlayerTeaser** - Player card teaser
2. **PlayerProfile** - Full player profile
3. **PlayerShare** - Social sharing view with QR code

### Utility Components

1. **Spinner** - Loading indicator
2. **Icon** - Icon wrapper component
3. **AltTitle** - Alternative title styling
4. **Hero** - Hero image component
5. **Share** - Social share buttons
6. **SearchContainer** - Search interface
7. **RelatedNews** - Related articles widget

---

## Tailwind Configuration Blueprint

Based on this design system, here's the recommended Tailwind configuration:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Brand Colors
        "kcvv-green": {
          DEFAULT: "#4acf52",
          bright: "#4acf52",
          dark: "#4B9B48",
          hover: "#41b147",
          "hover-dark": "#3f833d",
          50: "rgba(74, 207, 82, 0.1)",
          100: "rgba(74, 207, 82, 0.25)",
          200: "rgba(74, 207, 82, 0.5)",
          300: "rgba(74, 207, 82, 0.75)",
          alt: "#BADA55",
        },
        // Neutral Colors
        "kcvv-black": "#1E2024",
        "kcvv-gray-blue": "#31404b",
        "kcvv-gray": {
          dark: "#292c31",
          DEFAULT: "#62656A",
          light: "#CCC",
        },
        // Foundation Grays
        "foundation-gray": {
          light: "#edeff4",
          DEFAULT: "#cacaca",
          dark: "#9a9da2",
        },
        // Semantic
        "kcvv-white": "#fefefe",
        "kcvv-success": "#3adb76",
        "kcvv-warning": "#ffae00",
        "kcvv-alert": "#cc4b37",
      },
      fontFamily: {
        title: [
          "quasimoda",
          "acumin-pro",
          "Montserrat",
          "Verdana",
          "sans-serif",
        ],
        body: ["montserrat", "-apple-system", "system-ui", "sans-serif"],
        alt: ["stenciletta", "-apple-system", "system-ui", "sans-serif"],
        mono: ["ibm-plex-mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }], // 12px
        sm: ["0.8125rem", { lineHeight: "1.5" }], // 13px
        base: ["1rem", { lineHeight: "1.75" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.5" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.6" }], // 20px
        "2xl": ["1.375rem", { lineHeight: "1.2" }], // 22px
        "3xl": ["1.5rem", { lineHeight: "1.25" }], // 24px
        "4xl": ["1.75rem", { lineHeight: "1.2" }], // 28px
        "5xl": ["2rem", { lineHeight: "1.2" }], // 32px
        "6xl": ["3rem", { lineHeight: "1.2" }], // 48px
        stat: ["2.5rem", { lineHeight: "1" }], // 40px
      },
      spacing: {
        "0.75": "0.75rem", // 12px (mobile padding)
        "2.5": "2.5rem", // 40px (desktop padding)
        "15": "3.75rem", // 60px
        "17.5": "4.375rem", // 70px
        "22.5": "5.625rem", // 90px
        "35": "35rem", // Hero image height
      },
      maxWidth: {
        inner: "60rem", // 960px
        "inner-lg": "70rem", // 1120px
        outer: "90rem", // 1440px
      },
      screens: {
        sm: "768px", // Foundation medium
        desk: "960px", // Common desktop breakpoint
        md: "992px", // Foundation large
        lg: "1280px", // Foundation xlarge
        xl: "1440px", // Foundation xxlarge
      },
      borderRadius: {
        DEFAULT: "0.25em",
        card: "4px",
      },
      boxShadow: {
        none: "none",
        sm: "0 2px 5px 0 rgba(0, 0, 0, .16)",
        DEFAULT:
          "0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12)",
        md: "0 2px 10px 0 rgba(0, 0, 0, .12)",
        lg: "0 0 10px rgba(0, 0, 0, 0.7)",
        green: "0 0 6px 1px rgba(74, 207, 82, 0.5)",
        input: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
        "input-focus": "0 0 5px #cacaca",
      },
      backgroundImage: {
        "header-pattern": "url('../images/header-pattern.png')",
      },
    },
  },
};

export default config;
```

---

## Migration Notes

### Critical Design Elements to Preserve

1. **Green Color Consistency**: The bright green (#4acf52) is the primary brand color used throughout. Ensure exact color match.

2. **Typography Hierarchy**: The desktop/mobile font size differences are significant. Maintain these ratios.

3. **Adobe Typekit Fonts**: Need to load quasimoda, acumin-pro, stenciletta, ibm-plex-mono via Typekit. Don't forget the Typekit ID.

4. **60rem Breakpoint**: Many components use 60rem (960px) as the primary mobile/desktop breakpoint, not the Foundation 768px.

5. **Header Pattern**: The header has a fixed background pattern image that needs to be preserved.

6. **Button Animations**: Buttons have arrow icons that slide in on hover with opacity transitions.

7. **Off-Canvas Menu**: Mobile menu slides in from the side with an overlay backdrop.

8. **Hero Image Blur**: Hero sections have a blurred background version of the image.

### Components Requiring Special Attention

1. **PageHeader**: Complex fixed background pattern with parallax effect
2. **Buttons**: Multiple variants with FontAwesome icons and animations
3. **Ranking Tables**: Striped rows with highlight on current team
4. **Match Components**: Multiple layouts (slider, tabs, calendar)
5. **Search**: Client-side search with highlighting

---

## Adobe Typekit Configuration

The site uses Adobe Typekit for loading custom fonts. The Typekit ID is stored in the environment variable `TYPEKIT_ID`.

**Fonts to load:**

- quasimoda (headings)
- acumin-pro (headings fallback)
- stenciletta (decorative/display)
- ibm-plex-mono (numbers/data)
- montserrat (body text - may be from Typekit or Google Fonts)

**Next.js Implementation:**

```tsx
// In app/layout.tsx or _document.tsx
<Script src={`https://use.typekit.net/${process.env.NEXT_PUBLIC_TYPEKIT_ID}.js`} strategy="beforeInteractive" />
<Script id="typekit-load" strategy="beforeInteractive">
  {`try{Typekit.load({ async: true });}catch(e){}`}
</Script>
```

---

## Accessibility Notes

### Current State

- Foundation Sites provides baseline accessibility
- Semantic HTML structure
- ARIA labels needed for icons and interactive elements
- Color contrast should be verified (especially green on white)

### Areas to Improve in Migration

- Ensure all buttons have accessible names
- Add ARIA labels to icon-only buttons
- Verify focus states on all interactive elements
- Test keyboard navigation in off-canvas menu
- Ensure proper heading hierarchy

---

## Performance Considerations

### Current Site

- Uses gatsby-plugin-image for optimized images
- Multiple responsive image sizes (240px, 480px, 960px, full)
- Lazy loading with react-lazy-load
- Service worker with gatsby-plugin-offline

### Next.js Migration Strategy

- Use next/image for all images
- Configure remote patterns for Drupal images
- Implement blur placeholders
- Use ISR for dynamic content
- Consider using @vercel/analytics for performance monitoring

---

**End of Design System Documentation**

This document should be referenced throughout the migration to ensure 100% visual parity with the current Gatsby site.
