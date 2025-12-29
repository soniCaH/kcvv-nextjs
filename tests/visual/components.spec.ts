import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests for KCVV Components via Storybook
 *
 * These tests capture screenshots of isolated components in Storybook.
 *
 * Prerequisites:
 * - npm run storybook (started automatically by Playwright config with TEST_STORYBOOK=1)
 *
 * Run tests:
 * - npm run test:visual:components
 * - npm run test:visual:ui (interactive mode)
 *
 * Update baselines:
 * - npm run test:visual:components -- --update-snapshots
 *
 * NOTE: This file contains example tests. Update the story paths to match
 * your actual Storybook stories. Run `npm run storybook` to see available stories.
 */

test.describe("Component Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Wait for Storybook to load
    await page.goto("http://localhost:6006", { waitUntil: "networkidle" });
  });

  /**
   * Example: Sponsor Components Tests
   * Update these paths to match your actual Storybook stories
   */
  test.describe("Sponsor Components", () => {
    test("sponsors grid", async ({ page }) => {
      // Navigate to the Sponsors story in Storybook
      // Update this path to match your actual story ID
      await page.goto(
        "http://localhost:6006/?path=/story/domain-sponsors--default",
      );
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("sponsors-grid.png", {
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 800 },
      });
    });
  });

  /**
   * Add more component tests here as you create Storybook stories
   * Example paths:
   * - /story/ui-button--primary
   * - /story/domain-articlecard--default
   * - /story/domain-upcomingmatches--default
   */
});
