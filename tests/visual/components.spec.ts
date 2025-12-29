import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests for KCVV Components
 *
 * These tests capture screenshots of components in different states
 * and compare them against baseline images to catch visual regressions.
 *
 * Run tests:
 * - npm run test:visual (headless)
 * - npm run test:visual:ui (interactive)
 *
 * Update baselines:
 * - npm run test:visual -- --update-snapshots
 */

test.describe("Component Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts and images to load
    await page.goto("http://localhost:6006", { waitUntil: "networkidle" });
  });

  /**
   * Button Component Tests
   */
  test.describe("Button Component", () => {
    test("primary button", async ({ page }) => {
      await page.goto("http://localhost:6006/?path=/story/ui-button--primary");
      const button = page.locator('[data-testid="button"]').first();
      await expect(button).toHaveScreenshot("button-primary.png");
    });

    test("secondary button", async ({ page }) => {
      await page.goto(
        "http://localhost:6006/?path=/story/ui-button--secondary",
      );
      const button = page.locator('[data-testid="button"]').first();
      await expect(button).toHaveScreenshot("button-secondary.png");
    });

    test("button hover state", async ({ page }) => {
      await page.goto("http://localhost:6006/?path=/story/ui-button--primary");
      const button = page.locator('[data-testid="button"]').first();
      await button.hover();
      await expect(button).toHaveScreenshot("button-primary-hover.png");
    });
  });

  /**
   * Card Component Tests
   */
  test.describe("Card Component", () => {
    test("default card", async ({ page }) => {
      await page.goto("http://localhost:6006/?path=/story/ui-card--default");
      const card = page.locator('[data-testid="card"]').first();
      await expect(card).toHaveScreenshot("card-default.png");
    });

    test("card hover state", async ({ page }) => {
      await page.goto("http://localhost:6006/?path=/story/ui-card--default");
      const card = page.locator('[data-testid="card"]').first();
      await card.hover();
      await expect(card).toHaveScreenshot("card-hover.png");
    });
  });

  /**
   * Sponsor Components Tests
   */
  test.describe("Sponsor Components", () => {
    test("sponsors grid", async ({ page }) => {
      await page.goto(
        "http://localhost:6006/?path=/story/domain-sponsors--default",
      );
      await expect(page).toHaveScreenshot("sponsors-grid.png", {
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 800 },
      });
    });

    test("sponsors tier - gold", async ({ page }) => {
      await page.goto(
        "http://localhost:6006/?path=/story/domain-sponsorstier--gold-tier",
      );
      await expect(page).toHaveScreenshot("sponsors-tier-gold.png", {
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 800 },
      });
    });
  });

  /**
   * Article Components Tests
   */
  test.describe("Article Components", () => {
    test("article card", async ({ page }) => {
      await page.goto(
        "http://localhost:6006/?path=/story/domain-articlecard--default",
      );
      const card = page.locator('[data-testid="article-card"]').first();
      await expect(card).toHaveScreenshot("article-card.png");
    });

    test("article header", async ({ page }) => {
      await page.goto(
        "http://localhost:6006/?path=/story/domain-articleheader--default",
      );
      await expect(page).toHaveScreenshot("article-header.png", {
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 600 },
      });
    });
  });

  /**
   * Responsive Tests
   */
  test.describe("Responsive Design", () => {
    test("mobile - button", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
      await page.goto("http://localhost:6006/?path=/story/ui-button--primary");
      const button = page.locator('[data-testid="button"]').first();
      await expect(button).toHaveScreenshot("button-mobile.png");
    });

    test("tablet - sponsors grid", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
      await page.goto(
        "http://localhost:6006/?path=/story/domain-sponsors--default",
      );
      await expect(page).toHaveScreenshot("sponsors-tablet.png", {
        fullPage: false,
        clip: { x: 0, y: 0, width: 768, height: 800 },
      });
    });
  });
});
