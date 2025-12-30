# Storybook Guide - KCVV Next.js

**Purpose:** Component development, testing, and documentation
**Status:** Partially implemented - many components still need stories
**Last Updated:** December 2025

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [When to Use This Guide (Development Workflow)](#when-to-use-this-guide-development-workflow)
3. [Getting Started](#getting-started)
4. [Story Structure](#story-structure)
5. [Best Practices](#best-practices)
6. [Testing in Storybook](#testing-in-storybook)
7. [Current Coverage](#current-coverage)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

### What is Storybook?

Storybook is a development environment for UI components. It allows you to:

- **Develop components in isolation** - Build components without needing the full app
- **Test all states** - Visualize loading, error, empty states
- **Document components** - Auto-generated docs from stories
- **Visual regression testing** - Catch UI bugs automatically

### Why Use Storybook?

**For Developers:**

- Faster development (no need to navigate to component in app)
- Easier debugging (test edge cases in isolation)
- Component catalog (see all available components)
- Reusable patterns (copy stories for new components)

**For Designers:**

- Visual review of components
- Check responsive behavior
- Verify accessibility
- Test different content scenarios

**For the Project:**

- Living documentation (always up to date)
- Quality assurance (visual testing)
- Component library (reusable across pages)
- Onboarding (new developers see how components work)

---

## When to Use This Guide (Development Workflow)

### Stories Before Implementation

**⚠️ CRITICAL REQUIREMENT: Stories must be created BEFORE component implementation.**

This guide represents **Step 2** in the mandatory component development workflow:

1. **Design System FIRST** ([DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)) - Define design decisions
2. **Storybook SECOND** (this document) - Create stories ← **You are here**
3. **Implementation THIRD** - Write component code

**Rationale:** Writing stories before implementation forces you to think through all component states, props, and edge cases before writing code. This "story-driven development" approach serves as executable specifications that prevent over-engineering and ensure components meet their requirements. Stories act as both documentation and visual regression tests, catching bugs before they reach production. By defining the component's API through stories first, you create a contract that guides implementation and makes refactoring safer.

### Workflow Steps

When you reach the Storybook phase (after reviewing the Design System):

1. **Create Story File** (before component exists)
   - Place `ComponentName.stories.tsx` next to where component will live
   - Define all required variants based on design system specs
   - Example artifact: _`src/components/NewsCard.stories.tsx`_

2. **Write Story Specifications** (executable requirements)
   - Default story with typical props
   - Loading state story
   - Error state story
   - Empty/no-data state story
   - All visual variants (with image, without image, featured, etc.)
   - Example artifact: _5-7 exported story objects per component_

3. **Verify in Storybook** (before implementation)
   - Run `npm run storybook`
   - Review all stories visually
   - Confirm they match design system specifications
   - Example artifact: _Visual confirmation screenshots or notes_

4. **Implement Component** → **After stories are approved**
   - Write `ComponentName.tsx` to satisfy story requirements
   - Use design system tokens from [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
   - Component should render correctly in existing stories without changes
   - Example artifact: _`src/components/NewsCard.tsx` with props matching stories_

5. **Validate Implementation** (stories guide correctness)
   - Refresh Storybook - all stories should render correctly
   - No story modifications should be needed if spec was correct
   - Update stories only if requirements changed during implementation
   - Example artifact: _All stories rendering without errors_

### Required Story Coverage

Every component MUST have stories for:

- ✅ **Default state** - Typical use case with real content
- ✅ **Loading state** - Skeleton, spinner, or placeholder
- ✅ **Error state** - Error message handling
- ✅ **Empty state** - No data or null props (if applicable)
- ✅ **All visual variants** - Different configurations from design system

**Cross-reference:** See [DESIGN_SYSTEM.md - Development Workflow](./DESIGN_SYSTEM.md#development-workflow) for Step 1 (design decisions) details.

---

## Getting Started

### Installation

Already installed in this project. If starting fresh:

```bash
npx storybook@latest init
```

### Running Storybook

```bash
npm run storybook
```

Opens at `http://localhost:6006`

### Building Storybook

```bash
npm run build-storybook
```

Outputs static site to `storybook-static/`

---

## Story Structure

### File Naming Convention

```text
ComponentName.stories.tsx
```

Place stories next to component:

```text
src/components/ui/
├── Button.tsx
├── Button.stories.tsx
└── Button.test.tsx
```

### Basic Story Template

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "Category/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered", // or "fullscreen", "padded"
  },
  tags: ["autodocs"],
  argTypes: {
    // Define controls for props
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
      description: "Visual style variant",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// REQUIRED: Default story
export const Default: Story = {
  args: {
    children: "Button Text",
    variant: "primary",
    size: "md",
  },
};

// REQUIRED: All visual variants
export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    ...Default.args,
    variant: "outline",
  },
};

// REQUIRED: States
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

// OPTIONAL: Responsive
export const Mobile: Story = {
  args: Default.args,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
```

---

## Best Practices

### 1. Story Naming

**Categories (title):**

- `Components/UI/Button` - Generic UI components
- `Components/Features/NewsCard` - Feature-specific components
- `Components/Layout/Header` - Layout components
- `Pages/Homepage` - Full page examples

**Story Names:**

- Use descriptive names: `WithImage`, `WithoutImage`, `LongContent`
- Not: `Story1`, `Test`, `Example`

### 2. Required Stories

Every component should have **at minimum**:

1. **Default** - Standard/most common usage
2. **All visual variants** - Different styles/types
3. **Loading state** - If component loads data
4. **Error state** - If component can error
5. **Empty state** - If component can be empty
6. **Disabled state** - If component can be disabled

### 3. Args vs. Hard-coded

**Use args (good):**

```typescript
export const Default: Story = {
  args: {
    title: "News Article",
    date: "2025-01-01",
  },
};
```

**Don't hard-code (bad):**

```typescript
export const Default: Story = {
  render: () => <NewsCard title="News Article" date="2025-01-01" />
}
```

**Why?** Args show up in controls panel, allowing interactive testing.

### 4. Decorators

Use decorators to add context/wrappers:

```typescript
export default {
  decorators: [
    (Story) => (
      <div className="p-4 bg-gray-100">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComponentName>
```

### 5. Parameters

Set component-level or story-level parameters:

```typescript
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    backgrounds: { default: "dark" },
    layout: "fullscreen",
  },
};
```

### 6. Documentation

Add JSDoc comments to component props - they appear in autodocs:

```typescript
interface ButtonProps {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline";

  /** Size of the button */
  size?: "sm" | "md" | "lg";

  /** Disables button interactions */
  disabled?: boolean;
}
```

---

## Testing in Storybook

### 1. Visual Testing

**Manual:**

- View story in browser
- Test on different viewports
- Check accessibility panel (a11y addon)

**Automated (Chromatic):**

```bash
npm run chromatic
```

### 2. Interaction Testing

Test user interactions with play functions:

```typescript
import { userEvent, within } from "@storybook/test";

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click button
    const button = canvas.getByRole("button", { name: /submit/i });
    await userEvent.click(button);

    // Assert result
    await expect(canvas.getByText("Success!")).toBeInTheDocument();
  },
};
```

### 3. Accessibility Testing

Use the a11y addon (already installed):

- View "Accessibility" panel in Storybook
- Fix violations (color contrast, ARIA labels, etc.)
- Aim for WCAG AA compliance minimum

### 4. Component Tests

Run Storybook tests in CI:

```bash
npm run test-storybook
```

Runs all stories with `play` functions as tests.

---

## Current Coverage

### ✅ Components with Stories

**Responsibility Finder** (29 stories):

- ResponsibilityFinder: 18 stories
- ResponsibilityBlock: 11 stories

Coverage: **State-of-the-art** implementation with:

- Visual variants
- Interaction tests
- Accessibility tests
- Mobile/tablet viewports
- Performance tests

### ❌ Components WITHOUT Stories

**See GitHub issues for implementation plan**

Estimated missing coverage:

- UI components: ~30+ components
- Feature components: ~20+ components
- Layout components: ~5+ components
- **Total: ~55+ components need Storybook stories**

---

## Implementation Roadmap

### Phase 1: UI Components (High Priority)

Shadcn/ui base components in `src/components/ui/`:

- Button variants
- Card layouts
- Form inputs
- Typography
- Icons
- Badges
- Tabs
- Modals

**Why first?** Most reused, impact entire app

### Phase 2: Feature Components (Medium Priority)

Feature-specific components:

- News cards
- Match components
- Team displays
- Player cards
- Sponsor grids
- Calendar views
- Ranking tables

**Why second?** Build on UI components, specific to features

### Phase 3: Layout Components (Lower Priority)

App structure components:

- Header/Footer
- Navigation
- Containers
- Grid layouts

**Why last?** Less variation, harder to test in isolation

### Phase 4: Page Examples (Optional)

Full page compositions:

- Homepage
- Team page
- Match detail
- News article

**Why optional?** More useful for design review than development

---

## Story Creation Workflow

### 1. Choose Component

Pick a component that doesn't have stories yet.

### 2. Create Story File

```bash
touch src/components/ui/ComponentName.stories.tsx
```

### 3. Copy Template

Use the basic story template from this guide.

### 4. Define Args

List all component props as args with controls.

### 5. Create Minimum Stories

- Default
- Visual variants
- State variations (loading, error, disabled)

### 6. Test Locally

```bash
npm run storybook
```

Check:

- Stories render correctly
- Controls work
- Responsive behavior
- Accessibility panel (no violations)

### 7. Add Interaction Tests (Optional)

For complex components, add play functions.

### 8. Document

Add JSDoc comments to props if missing.

### 9. Commit

```bash
git add .
git commit -m "feat(storybook): add stories for ComponentName"
```

---

## Configuration

### Storybook Config Location

```text
.storybook/
├── main.ts         # Addons, framework config
├── preview.ts      # Global decorators, parameters
└── manager.ts      # UI customization
```

### Addons Installed

- `@storybook/addon-essentials` - Controls, docs, viewport, backgrounds
- `@storybook/addon-a11y` - Accessibility testing
- `@storybook/addon-interactions` - Interaction testing
- `@storybook/addon-vitest` - Run stories as tests

### Global Styles

Tailwind CSS is already configured in `preview.ts`.

---

## Useful Commands

```bash
# Development
npm run storybook              # Start dev server

# Build
npm run build-storybook        # Build static site

# Testing
npm run test-storybook         # Run interaction tests
npm run chromatic              # Visual regression (if configured)

# Analyze
npx storybook@latest doctor    # Check for issues
```

---

## Tips & Tricks

### 1. Reuse Args Across Stories

```typescript
const baseArgs = {
  title: "Example Title",
  date: "2025-01-01",
};

export const Default: Story = { args: baseArgs };
export const WithImage: Story = { args: { ...baseArgs, image: "..." } };
```

### 2. Mock Data

Keep mock data in separate file:

```typescript
// ComponentName.mocks.ts
export const mockArticle = {
  id: "1",
  title: "Test Article",
  content: "Lorem ipsum...",
};

// ComponentName.stories.tsx
import { mockArticle } from "./ComponentName.mocks";

export const Default: Story = {
  args: {
    article: mockArticle,
  },
};
```

### 3. Control Types

Available controls:

- `boolean` - Checkbox
- `text` - Text input
- `select` - Dropdown
- `radio` - Radio buttons
- `range` - Slider
- `color` - Color picker
- `date` - Date picker
- `object` - JSON editor
- `array` - Array editor

### 4. Viewport Testing

Built-in viewports:

- `mobile1` - 320x568
- `mobile2` - 360x640
- `tablet` - 768x1024
- `desktop` - 1920x1080

Custom viewports in `.storybook/preview.ts`:

```typescript
export const parameters = {
  viewport: {
    viewports: {
      kcvvMobile: {
        name: "KCVV Mobile",
        styles: { width: "375px", height: "667px" },
      },
    },
  },
};
```

### 5. Dark Mode Testing

```typescript
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}
```

---

## Quality Standards

### Checklist for New Stories

Before committing stories:

- [ ] At least 3 stories (default + variants)
- [ ] All visual variants covered
- [ ] State variations (loading, error, empty, disabled)
- [ ] Controls work in Storybook UI
- [ ] Props have JSDoc descriptions
- [ ] No accessibility violations in a11y panel
- [ ] Mobile viewport tested
- [ ] Args use proper control types
- [ ] Stories render without errors

### Coverage Goals

- **UI Components**: 100% (foundational, must have stories)
- **Feature Components**: 80%+ (most should have stories)
- **Layout Components**: 60%+ (harder to isolate)
- **Pages**: 20%+ (optional, mainly for design review)

---

## Troubleshooting

### Stories Not Showing Up

Check:

1. File named `*.stories.tsx`
2. Exported default meta object
3. Exported story objects
4. File in `src/` directory

### TypeScript Errors

```typescript
// Make sure types are correct
type Story = StoryObj<typeof meta>; // Not StoryObj<ComponentName>
```

### Styles Not Loading

Check `.storybook/preview.ts` imports global CSS.

### Component Not Found

Check import path in story file matches component location.

---

## Resources

- [Storybook Docs](https://storybook.js.org/docs)
- [Next.js Integration](https://storybook.js.org/docs/get-started/nextjs)
- [Testing Library](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [Accessibility](https://storybook.js.org/docs/writing-tests/accessibility-testing)

---

## Next Steps

See GitHub issues for:

1. UI components Storybook implementation
2. Feature components Storybook implementation
3. Layout components Storybook implementation

**Goal:** 80%+ component coverage by end of Q1 2026

---

**Last Updated:** December 2025
**Maintainer:** KCVV Development Team
