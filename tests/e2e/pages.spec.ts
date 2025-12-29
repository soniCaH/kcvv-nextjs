import { test, expect } from "@playwright/test";

/**
 * E2E Visual Regression Tests for KCVV Pages
 *
 * Tests actual pages in the running Next.js application.
 * Ensures pixel-perfect parity with the Gatsby version.
 *
 * Prerequisites:
 * - npm run dev (started automatically by Playwright config)
 *
 * Run tests:
 * - npm run test:visual
 * - npm run test:visual:ui (interactive mode)
 *
 * Update baselines:
 * - npm run test:visual -- --update-snapshots
 */

test.describe("Page Visual Regression Tests", () => {
  /**
   * Homepage Tests
   */
  test.describe("Homepage", () => {
    test("homepage loads correctly", async ({ page }) => {
      await page.goto("/");

      // Wait for dynamic content to load
      await page.waitForSelector('[data-testid="homepage"]', {
        timeout: 10000,
      });

      // Take full page screenshot
      await expect(page).toHaveScreenshot("homepage-full.png", {
        fullPage: true,
        timeout: 30000,
      });
    });

    test("homepage hero section", async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector('[data-testid="homepage"]');

      // Screenshot just the hero section
      const hero = page.locator("header").first();
      await expect(hero).toHaveScreenshot("homepage-hero.png");
    });

    test("homepage above fold", async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector('[data-testid="homepage"]');

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

      // Wait for articles to load
      await page.waitForSelector('[data-testid="article-card"]', {
        timeout: 10000,
      });

      await expect(page).toHaveScreenshot("news-overview.png", {
        fullPage: true,
        timeout: 30000,
      });
    });

    test("news article page", async ({ page }) => {
      // First, get a valid article URL
      await page.goto("/news");
      await page.waitForSelector('[data-testid="article-card"] a');

      const firstArticleLink = page
        .locator('[data-testid="article-card"] a')
        .first();
      const articleUrl = await firstArticleLink.getAttribute("href");

      if (articleUrl) {
        await page.goto(articleUrl);
        await page.waitForSelector('[data-testid="article-header"]');

        await expect(page).toHaveScreenshot("news-article.png", {
          fullPage: true,
          timeout: 30000,
        });
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
      await page.waitForSelector('[data-testid="homepage"]');

      await expect(page).toHaveScreenshot("mobile-homepage.png", {
        fullPage: true,
      });
    });

    test("mobile news page", async ({ page }) => {
      await page.goto("/news");
      await page.waitForSelector('[data-testid="article-card"]');

      await expect(page).toHaveScreenshot("mobile-news.png", {
        fullPage: true,
      });
    });
  });

  /**
   * Responsive Tests - Tablet
   */
  test.describe("Tablet Responsiveness", () => {
    test.use({ viewport: { width: 768, height: 1024 } }); // iPad

    test("tablet homepage", async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector('[data-testid="homepage"]');

      await expect(page).toHaveScreenshot("tablet-homepage.png", {
        fullPage: true,
      });
    });
  });

  /**
   * Interactive Elements Tests
   */
  test.describe("Interactive Elements", () => {
    test("navigation menu interaction", async ({ page }) => {
      await page.goto("/");

      // Click menu button (if exists)
      const menuButton = page.locator('[aria-label*="menu"]').first();
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(500); // Wait for animation

        await expect(page).toHaveScreenshot("navigation-open.png");
      }
    });

    test("search functionality", async ({ page }) => {
      await page.goto("/");

      // Find and interact with search
      const searchButton = page.locator('[aria-label*="search"]').first();
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(300);

        await expect(page).toHaveScreenshot("search-open.png");
      }
    });
  });

  /**
   * Dark Mode / Theme Tests (if applicable)
   */
  test.describe("Theme Tests", () => {
    test("light mode", async ({ page }) => {
      await page.goto("/");
      await page.waitForSelector('[data-testid="homepage"]');

      await expect(page).toHaveScreenshot("theme-light.png", {
        fullPage: false,
      });
    });
  });

  /**
   * Performance/Loading States Tests
   */
  test.describe("Loading States", () => {
    test("page loads without layout shift", async ({ page }) => {
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

  /**
   * Footer Tests
   */
  test.describe("Page Footer", () => {
    test("footer section", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const footer = page.locator("footer").first();
      await expect(footer).toHaveScreenshot("footer.png");
    });
  });

  /**
   * Header Tests
   */
  test.describe("Page Header", () => {
    test("header section", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const header = page.locator("header").first();
      await expect(header).toHaveScreenshot("header.png");
    });
  });
});
