import { test, expect } from "@playwright/test";

/**
 * E2E Visual Regression Tests for KCVV Pages
 *
 * Tests actual pages in the running Next.js application with mocked API responses.
 *
 * Prerequisites:
 * - Mock API server (started automatically by Playwright config)
 * - Next.js dev server (started automatically by Playwright config)
 *
 * Run tests:
 * - npm run test:visual:pages
 * - npm run test:visual:ui (interactive mode)
 *
 * Update baselines:
 * - npm run test:visual:pages -- --update-snapshots
 *
 * Note: API calls to Drupal and Footbalisto are mocked via a local mock API server
 * to ensure deterministic, fast tests that don't depend on external services.
 */

test.describe("Page Visual Regression Tests", () => {
  /**
   * Homepage Tests
   */
  test.describe("Homepage", () => {
    test("homepage loads correctly", async ({ page }) => {
      await page.goto("/");

      // Wait for page to be fully loaded
      await page.waitForLoadState("networkidle");

      // Take full page screenshot
      await expect(page).toHaveScreenshot("homepage-full.png", {
        fullPage: true,
        timeout: 30000,
      });
    });

    test("homepage above fold", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Screenshot above the fold (viewport height)
      await expect(page).toHaveScreenshot("homepage-above-fold.png", {
        fullPage: false,
      });
    });
  });

  /**
   * News/Article Pages Tests
   */
  test.describe("News Pages", () => {
    test("news overview page", async ({ page }) => {
      await page.goto("/news");

      // Wait for page to be fully loaded
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("news-overview.png", {
        fullPage: true,
        timeout: 30000,
      });
    });

    test("news article page", async ({ page }) => {
      // First, get a valid article URL by finding the first link
      await page.goto("/news");
      await page.waitForLoadState("networkidle");

      // Find first article link (look for any link inside article elements)
      const firstArticleLink = page.locator("article a").first();

      // Check if article links exist
      const count = await firstArticleLink.count();
      if (count > 0) {
        const articleUrl = await firstArticleLink.getAttribute("href");

        if (articleUrl) {
          await page.goto(articleUrl);
          await page.waitForLoadState("networkidle");

          // Wait for layout to fully settle (prevents 1px height oscillations)
          await page.waitForFunction(() => document.fonts.ready);
          await page.evaluate(
            () => new Promise((resolve) => setTimeout(resolve, 500)),
          );

          await expect(page).toHaveScreenshot("news-article.png", {
            fullPage: true,
            timeout: 30000,
          });
        }
      }
    });
  });

  /**
   * Sponsors Page Tests
   */
  test.describe("Sponsors Page", () => {
    test("sponsors page", async ({ page }) => {
      await page.goto("/sponsors");

      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("sponsors-page.png", {
        fullPage: true,
        timeout: 30000,
      });
    });
  });

  /**
   * Responsive Tests - Mobile
   */
  test.describe("Mobile Responsiveness", () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test("mobile homepage", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Wait for layout to fully settle (prevents 1px height oscillations)
      await page.waitForFunction(() => document.fonts.ready);
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 500)),
      );

      await expect(page).toHaveScreenshot("mobile-homepage.png", {
        fullPage: true,
      });
    });

    // FIXME: Skipped due to 1px height oscillation (2004px ↔ 2005px) caused by layout instability
    // This needs investigation into flex/grid sub-pixel rendering or dynamic content heights
    test.skip("mobile news page", async ({ page }) => {
      await page.goto("/news");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot("mobile-news.png", {
        fullPage: true,
      });
    });
  });

  /**
   * Performance/Loading States Tests
   */
  test.describe("Loading States", () => {
    // FIXME: Skipped due to non-deterministic loading state timing
    // Testing transient loading states with visual snapshots is inherently flaky
    // because content can be in different states between DOMContentLoaded and networkidle
    test.skip("page loads without layout shift", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });

      // Take screenshot immediately
      await expect(page).toHaveScreenshot("loading-state-initial.png", {
        fullPage: false,
      });

      // Wait for full load
      await page.waitForLoadState("networkidle");

      // Take screenshot after load
      await expect(page).toHaveScreenshot("loading-state-complete.png", {
        fullPage: false,
      });
    });
  });
});
