import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for KCVV Next.js Visual Regression Testing
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewports
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  // Run local dev server before tests
  // For component tests, you can also run Storybook:
  // command: 'npm run storybook'
  // url: 'http://localhost:6006'
  webServer: process.env.TEST_STORYBOOK
    ? {
        command: "npm run storybook",
        url: "http://localhost:6006",
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      }
    : [
        // Start mock API server first for page tests
        {
          command: "node tests/mock-api-server.mjs",
          url: "http://localhost:8888",
          reuseExistingServer: !process.env.CI,
          timeout: 30 * 1000,
        },
        // Then start Next.js dev server with mock API URLs
        {
          command: "npm run dev",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 120 * 1000,
          env: {
            DRUPAL_API_URL: "http://localhost:8888",
            FOOTBALISTO_API_URL: "http://localhost:8888",
          },
        },
      ],
});
