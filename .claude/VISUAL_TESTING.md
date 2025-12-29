# Visual Testing Standards for KCVV Next.js

**Established:** 2025-12-29
**Status:** MANDATORY

## Core Principle

**Storybook is THE visual source of truth for all component testing.**

This means:

- All component visual regression tests MUST use Storybook
- Components are developed and tested in Storybook FIRST
- Visual parity is verified against Storybook stories, not the Next.js app
- Storybook represents the canonical visual implementation of every component

## Two-Tier Visual Testing Strategy

### Tier 1: Component Visual Testing (Storybook) 🎨

**Purpose:** Test isolated components in controlled environments
**Source of Truth:** Storybook stories
**Test Location:** `tests/visual/components.spec.ts`
**Command:** `npm run test:visual:components`

**Why Storybook?**

- Isolated component testing without page context
- Full control over component states and props
- Easy to test edge cases and variations
- Fast test execution
- No external API dependencies
- Consistent rendering across environments

**What to Test:**

- ✅ All UI components (buttons, cards, icons)
- ✅ All domain components (articles, matches, sponsors)
- ✅ All layout components (headers, footers)
- ✅ Component states (loading, error, empty)
- ✅ Responsive behavior at different viewports
- ✅ All story variations

**Example Test Structure:**

```typescript
test.describe("Component Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:6006", { waitUntil: "networkidle" });
  });

  test.describe("Button Component", () => {
    test("primary button", async ({ page }) => {
      await page.goto("http://localhost:6006/?path=/story/ui-button--primary");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("button-primary.png");
    });

    test("secondary button", async ({ page }) => {
      await page.goto(
        "http://localhost:6006/?path=/story/ui-button--secondary",
      );
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("button-secondary.png");
    });
  });
});
```

### Tier 2: Page Visual Testing (Next.js App) 🌐

**Purpose:** Test complete pages with real data integration
**Source:** Running Next.js application
**Test Location:** `tests/e2e/pages.spec.ts`
**Command:** `npm run test:visual:pages`

**What to Test:**

- ✅ Full page renders
- ✅ Page layouts and composition
- ✅ Navigation flows
- ✅ Data integration from API
- ✅ Route-specific behavior
- ✅ Mobile responsiveness at page level

**Example Test Structure:**

```typescript
test.describe("Page Visual Regression Tests", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("homepage-full.png", {
      fullPage: true,
      timeout: 30000,
    });
  });
});
```

## Development Workflow

### When Creating a New Component

1. **Create the component** in `src/components/`
2. **Create Storybook story** IMMEDIATELY:

   ```typescript
   // Component.stories.tsx
   import type { Meta, StoryObj } from "@storybook/nextjs-vite";
   import { Component } from "./Component";

   const meta: Meta<typeof Component> = {
     title: "Domain/Component",
     component: Component,
   };

   export default meta;
   type Story = StoryObj<typeof Component>;

   export const Default: Story = {
     args: {
       // props
     },
   };
   ```

3. **Add visual regression test** in `tests/visual/components.spec.ts`
4. **Generate baseline screenshot:**

   ```bash
   npm run test:visual:components -- --update-snapshots
   ```

5. **Verify in Storybook:**
   ```bash
   npm run storybook
   ```

### When Modifying a Component

1. **Update component** code
2. **Update Storybook story** if needed
3. **Review visual changes** in Storybook:
   ```bash
   npm run storybook
   ```
4. **Run visual regression tests:**
   ```bash
   npm run test:visual:components
   ```
5. **If changes are intentional**, update baselines:
   ```bash
   npm run test:visual:components -- --update-snapshots
   ```

## Testing Scripts Reference

| Command                          | Purpose                       | When to Use                              |
| -------------------------------- | ----------------------------- | ---------------------------------------- |
| `npm run storybook`              | Start Storybook dev server    | Developing components, reviewing visuals |
| `npm run test:visual`            | Run all visual tests          | Before committing, in CI/CD              |
| `npm run test:visual:components` | Test components via Storybook | After component changes                  |
| `npm run test:visual:pages`      | Test Next.js pages            | After page/layout changes                |
| `npm run test:visual:ui`         | Interactive test UI           | Reviewing test failures                  |
| `npm run test:visual:update`     | Update all baselines          | After intentional visual changes         |

## Screenshot Management

### Baseline Locations

- **Component screenshots:** `tests/visual/components.spec.ts-snapshots/`
- **Page screenshots:** `tests/e2e/pages.spec.ts-snapshots/`

### When to Update Baselines

✅ **DO update baselines when:**

- Intentionally changing component styling
- Updating typography or colors
- Modifying layouts
- Changing component structure

❌ **DON'T update baselines when:**

- Tests are failing unexpectedly
- Changes weren't intentional
- You haven't reviewed the visual diff

### Reviewing Visual Diffs

Use Playwright UI mode to see pixel-by-pixel differences:

```bash
npm run test:visual:ui
```

This shows:

- Expected (baseline) screenshot
- Actual (current) screenshot
- Highlighted diff showing what changed

## Playwright Configuration

The project uses different configurations for component vs page testing:

### Component Testing (Storybook)

```typescript
// Triggered by TEST_STORYBOOK=1 environment variable
webServer: {
  command: "npm run storybook",
  url: "http://localhost:6006",
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
}
```

### Page Testing (Next.js)

```typescript
// Default configuration
webServer: {
  command: "npm run dev",
  url: "http://localhost:3000",
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
}
```

## Coverage Requirements

### Component Coverage

- **Target:** 100% of components have Storybook stories
- **Current:** Check with `npm run migration:status`
- **Track:** Stories are auto-detected by migration status script

### Story Variations

For each component, create stories for:

- ✅ Default state
- ✅ Loading state (if applicable)
- ✅ Error state (if applicable)
- ✅ Empty state (if applicable)
- ✅ Different prop variations
- ✅ Different screen sizes (if responsive behavior differs)

## CI/CD Integration

Visual regression tests should run in CI:

```yaml
# .github/workflows/ci.yml
- name: Run visual regression tests
  run: |
    npm run test:visual:components
    npm run test:visual:pages
```

**Important:** Baselines should be committed to the repository so CI can compare against them.

## Migration Standard

When migrating a page from Gatsby to Next.js:

1. ✅ **Extract components** from the page
2. ✅ **Create Storybook stories** for each component
3. ✅ **Generate visual baselines** from Storybook
4. ✅ **Implement components** using stories as reference
5. ✅ **Compose page** from components
6. ✅ **Run page visual tests** to verify integration
7. ✅ **Compare with Gatsby version** (if needed)

## Common Issues and Solutions

### Issue: Visual tests fail on different machines

**Problem:** Font rendering, image loading, or browser differences
**Solution:**

- Use consistent test environments (Docker or CI)
- Configure Playwright to use same browser versions
- Ensure fonts are properly loaded before screenshots

### Issue: Tests are flaky

**Problem:** Animations, loading states, network timing
**Solution:**

- Use `waitForLoadState("networkidle")` before screenshots
- Disable animations in test environment
- Mock external API calls in Storybook

### Issue: Too many baselines to update

**Problem:** Design system changes affect many components
**Solution:**

- Update baselines in batches
- Review in Playwright UI mode
- Consider if changes were intentional across all components

## Best Practices

### Storybook Story Organization

```
src/components/
  ui/
    Button/
      Button.tsx
      Button.stories.tsx  ← Story location
      Button.test.tsx
  domain/
    ArticleCard/
      ArticleCard.tsx
      ArticleCard.stories.tsx  ← Story location
      ArticleCard.test.tsx
```

### Story Naming Convention

Use descriptive story names that indicate the variation:

```typescript
export const Default: Story = { ... };
export const Loading: Story = { ... };
export const WithLongTitle: Story = { ... };
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' }
  }
};
```

### Test Naming Convention

Match test names to story paths:

```typescript
// For story at: /story/ui-button--primary
test("button primary variant", async ({ page }) => {
  await page.goto("http://localhost:6006/?path=/story/ui-button--primary");
  // ...
});
```

## Enforcement

This standard is enforced through:

1. **Pre-commit hooks** - Check that new components have stories
2. **CI/CD pipeline** - Visual tests must pass before merge
3. **Code review** - PRs should include Storybook screenshots
4. **Migration checklist** - Stories are required for component completion

## Questions?

Ask Claude Code:

- "How do I create a Storybook story for this component?"
- "How do I run visual regression tests?"
- "How do I update visual baselines?"

Claude Code has access to this documentation and can guide you through the process.
