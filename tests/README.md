# Visual Regression Testing Guide

This directory contains visual regression tests for the KCVV Next.js migration.

## Directory Structure

```text
tests/
├── e2e/              # End-to-end page tests (full Next.js app)
├── visual/           # Component visual tests (Storybook)
└── setup.ts          # Test setup configuration
```

## Quick Start

### 1. Run All Visual Tests

```bash
npm run test:visual
```

### 2. Run Specific Test Suites

```bash
# Test components only (via Storybook)
npm run test:visual:components

# Test pages only (via Next.js dev server)
npm run test:visual:pages
```

### 3. Interactive Test Mode (UI)

```bash
npm run test:visual:ui
```

### 4. Update Baselines (After Intentional Changes)

```bash
npm run test:visual:update
```

## How It Works

### Component Tests (`tests/visual/`)

- Tests components in isolation via **Storybook**
- Captures screenshots of different states
- Fast and focused on component behavior

### Page Tests (`tests/e2e/`)

- Tests actual pages in the **running Next.js app**
- Ensures pixel-perfect parity with Gatsby version
- Tests responsive behavior (mobile/tablet/desktop)
- Tests interactive elements (navigation, search, etc.)

## Writing New Tests

### Component Test Example

```typescript
test("new component state", async ({ page }) => {
  await page.goto(
    "http://localhost:6006/?path=/story/ui-newcomponent--default",
  );
  const component = page.locator('[data-testid="new-component"]');
  await expect(component).toHaveScreenshot("new-component-default.png");
});
```

### Page Test Example

```typescript
test("new page", async ({ page }) => {
  await page.goto("/new-page");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("new-page-full.png", {
    fullPage: true,
  });
});
```

## Best Practices

### 1. Wait for Content to Load

```typescript
await page.waitForSelector('[data-testid="content"]');
await page.waitForLoadState("networkidle");
```

### 2. Use Specific Selectors

```typescript
// Good
await page.locator('[data-testid="article-card"]');

// Avoid
await page.locator(".card");
```

### 3. Test Responsive Breakpoints

```typescript
test.use({ viewport: { width: 375, height: 667 } }); // Mobile
test.use({ viewport: { width: 768, height: 1024 } }); // Tablet
test.use({ viewport: { width: 1920, height: 1080 } }); // Desktop
```

### 4. Capture Full Page for Layout Tests

```typescript
await expect(page).toHaveScreenshot("page.png", {
  fullPage: true,
  timeout: 30000,
});
```

### 5. Capture Specific Elements for Component Tests

```typescript
const element = page.locator('[data-testid="component"]');
await expect(element).toHaveScreenshot("component.png");
```

## Troubleshooting

### Tests Failing Due to Fonts/Images Not Loading

Add wait conditions:

```typescript
await page.waitForLoadState("networkidle");
await page.waitForTimeout(500); // For animations
```

### Flaky Tests

Use explicit waits:

```typescript
await page.waitForSelector('[data-testid="element"]', { state: "visible" });
```

### Screenshot Differences

1. Check if changes are intentional
2. If yes: `npm run test:visual:update`
3. If no: Fix the issue and rerun tests

### CI/CD Failures

- Playwright config uses `retries: 2` in CI
- Screenshots may differ between OS (Mac vs Linux)
- Use Playwright's Docker image for consistent screenshots

## Integration with Migration Workflow

1. **During Migration**: Run visual tests to ensure pixel-perfect parity

   ```bash
   npm run test:visual:pages
   ```

2. **After Component Changes**: Run component tests

   ```bash
   npm run test:visual:components
   ```

3. **Before Commit**: Run all quality checks

   ```bash
   npm run check-all
   ```

4. **Check Status**: See test coverage
   ```bash
   npm run migration:status
   ```

## Configuration

- **Playwright Config**: `playwright.config.ts`
- **Test Directories**: Auto-discovered from `tests/e2e/` and `tests/visual/`
- **Screenshots**: Stored in `tests/**/*.spec.ts-snapshots/`
- **Reports**: Generated in `test-results/` and `playwright-report/`

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Visual Testing Guide](https://playwright.dev/docs/test-snapshots)
- [Storybook Testing](https://storybook.js.org/docs/writing-tests)
