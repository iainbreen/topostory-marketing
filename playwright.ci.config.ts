import { defineConfig, devices } from '@playwright/test';

/**
 * CI-specific Playwright configuration.
 * Runs only critical tests (@ci tagged) on Chromium for fast feedback.
 * Use `npm run test:full` for comprehensive multi-browser testing.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['cookie-consent.spec.ts', 'pages.spec.ts'],
  grep: /@ci/,
  fullyParallel: true,
  retries: 0,
  workers: 2,
  reporter: process.env.CI ? 'github' : 'list',
  forbidOnly: !!process.env.CI,

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
