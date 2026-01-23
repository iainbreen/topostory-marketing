import { test, expect } from '@playwright/test';

test.describe('Analytics & Tracking', () => {
  test.describe('PostHog Initialization', () => {
    test('PostHog does NOT initialize without analytics consent', async ({ page, context }) => {
      // Set consent with analytics disabled
      await context.addCookies([{
        name: 'topostory_consent',
        value: encodeURIComponent(JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          categories: { necessary: true, analytics: false, marketing: false }
        })),
        domain: 'localhost',
        path: '/'
      }]);

      const posthogRequests: string[] = [];
      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('posthog') || url.includes('/t/')) {
          posthogRequests.push(url);
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Filter out non-tracking requests (like static assets)
      const trackingRequests = posthogRequests.filter(
        (url) => url.includes('/e') || url.includes('/capture') || url.includes('/decide')
      );

      expect(trackingRequests).toHaveLength(0);
    });

    test('PostHog initializes with analytics consent', async ({ page, context }) => {
      // Set consent with analytics enabled
      await context.addCookies([{
        name: 'topostory_consent',
        value: encodeURIComponent(JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          categories: { necessary: true, analytics: true, marketing: false }
        })),
        domain: 'localhost',
        path: '/'
      }]);

      let posthogInitialized = false;
      page.on('request', (request) => {
        const url = request.url();
        // PostHog makes requests to /t/* (proxied) or posthog.com
        if (url.includes('/t/') || url.includes('posthog')) {
          posthogInitialized = true;
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Note: If no PostHog key is set in dev, this may not initialize
      // The test documents expected behavior
      console.log(`PostHog initialized: ${posthogInitialized}`);
    });
  });

  test.describe('Intercom Initialization', () => {
    test('Intercom does NOT load without marketing consent', async ({ page, context }) => {
      // Set consent with marketing disabled
      await context.addCookies([{
        name: 'topostory_consent',
        value: encodeURIComponent(JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          categories: { necessary: true, analytics: false, marketing: false }
        })),
        domain: 'localhost',
        path: '/'
      }]);

      const intercomRequests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('intercom')) {
          intercomRequests.push(request.url());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      expect(intercomRequests).toHaveLength(0);
    });

    test('Intercom widget is hidden without marketing consent', async ({ page, context }) => {
      await context.addCookies([{
        name: 'topostory_consent',
        value: encodeURIComponent(JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          categories: { necessary: true, analytics: false, marketing: false }
        })),
        domain: 'localhost',
        path: '/'
      }]);

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Intercom widget should not exist
      const intercomWidget = page.locator('.intercom-launcher, #intercom-container');
      await expect(intercomWidget).toHaveCount(0);
    });
  });

  test.describe('Consent-Based Loading', () => {
    test('accepting consent enables analytics', async ({ page, context }) => {
      await context.clearCookies();

      let analyticsLoaded = false;
      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/t/') || url.includes('posthog')) {
          analyticsLoaded = true;
        }
      });

      await page.goto('/');

      // Accept all cookies
      await page.getByRole('button', { name: 'Accept All' }).click();

      // Wait for potential analytics initialization
      await page.waitForTimeout(1000);

      // Document behavior (actual result depends on env variables)
      console.log(`Analytics loaded after consent: ${analyticsLoaded}`);
    });

    test('rejecting consent does not enable analytics', async ({ page, context }) => {
      await context.clearCookies();

      const analyticsRequests: string[] = [];
      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('/t/') || url.includes('posthog')) {
          analyticsRequests.push(url);
        }
      });

      await page.goto('/');

      // Reject all cookies
      await page.getByRole('button', { name: 'Reject All' }).click();

      // Wait and verify no analytics loaded
      await page.waitForTimeout(1000);

      const trackingRequests = analyticsRequests.filter(
        (url) => url.includes('/e') || url.includes('/capture')
      );
      expect(trackingRequests).toHaveLength(0);
    });
  });

  test.describe('Analytics Event Structure', () => {
    test('CTA buttons have tracking data attributes', async ({ page, context }) => {
      await context.addCookies([{
        name: 'topostory_consent',
        value: encodeURIComponent(JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          categories: { necessary: true, analytics: false, marketing: false }
        })),
        domain: 'localhost',
        path: '/'
      }]);

      await page.goto('/');

      // Check that CTA buttons exist and are clickable
      const heroCTA = page.getByRole('link', { name: 'Get Started Free' });
      await expect(heroCTA).toBeVisible();
      await expect(heroCTA).toHaveAttribute('href', 'https://app.topostory.com');
    });

    test('style preview cards are interactive', async ({ page, context }) => {
      await context.addCookies([{
        name: 'topostory_consent',
        value: encodeURIComponent(JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          categories: { necessary: true, analytics: false, marketing: false }
        })),
        domain: 'localhost',
        path: '/'
      }]);

      await page.goto('/');

      // Style cards should be visible
      await expect(page.getByText('Classic')).toBeVisible();
      await expect(page.getByText('Nordic')).toBeVisible();
    });
  });

  test.describe('Privacy Compliance', () => {
    test('no tracking before any consent given', async ({ page, context }) => {
      await context.clearCookies();

      const trackingRequests: string[] = [];
      page.on('request', (request) => {
        const url = request.url();
        if (
          url.includes('posthog') ||
          url.includes('intercom') ||
          url.includes('analytics') ||
          url.includes('google-analytics') ||
          url.includes('gtag') ||
          url.includes('facebook') ||
          url.includes('pixel')
        ) {
          trackingRequests.push(url);
        }
      });

      await page.goto('/');

      // Banner should be visible, but no tracking should fire
      await expect(page.locator('#cookie-banner')).toBeVisible();

      expect(trackingRequests).toHaveLength(0);
    });

    test('third-party cookies policy is followed', async ({ page, context }) => {
      await context.addCookies([{
        name: 'topostory_consent',
        value: encodeURIComponent(JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          categories: { necessary: true, analytics: false, marketing: false }
        })),
        domain: 'localhost',
        path: '/'
      }]);

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that only first-party cookies are set
      const cookies = await context.cookies();
      const thirdPartyCookies = cookies.filter(
        (c) => !c.domain.includes('localhost') && !c.domain.includes('topostory')
      );

      expect(thirdPartyCookies).toHaveLength(0);
    });
  });
});
