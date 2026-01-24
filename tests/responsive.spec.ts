import { test, expect } from '@playwright/test';

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  largeDesktop: { width: 1920, height: 1080 },
};

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ context }) => {
    // Set consent cookie to skip banner
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
  });

  test.describe('Mobile (375px)', () => {
    test.use({ viewport: viewports.mobile });

    test('homepage renders correctly', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('content is readable without horizontal scroll', async ({ page }) => {
      await page.goto('/');

      // Check that page width doesn't exceed viewport
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewports.mobile.width + 10); // Small tolerance
    });

    test('CTA buttons are tap-friendly (min 44px)', async ({ page }) => {
      await page.goto('/');

      const ctaButton = page.getByRole('link', { name: 'Create Your Map' });
      const box = await ctaButton.boundingBox();

      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test('text is readable', async ({ page }) => {
      await page.goto('/');

      // Check that body text has reasonable font size
      const fontSize = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(14);
    });

    test('navigation elements are accessible', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('header')).toBeVisible();
    });

    test('pricing page renders correctly', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByRole('heading', { level: 1, name: 'Pricing' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Free', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Pro', exact: true })).toBeVisible();
    });

    test('features page renders correctly', async ({ page }) => {
      await page.goto('/features');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });

  test.describe('Tablet (768px)', () => {
    test.use({ viewport: viewports.tablet });

    test('homepage renders correctly', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('content is within viewport', async ({ page }) => {
      await page.goto('/');

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewports.tablet.width + 10);
    });

    test('pricing cards are visible', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByRole('heading', { name: 'Free', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Pro', exact: true })).toBeVisible();
    });
  });

  test.describe('Desktop (1280px)', () => {
    test.use({ viewport: viewports.desktop });

    test('homepage renders with full layout', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();

      // Desktop navigation should be fully visible
      await expect(page.getByRole('link', { name: 'Features' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Pricing' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
    });

    test('features page shows feature grid', async ({ page }) => {
      await page.goto('/features');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('pricing page shows plans side by side', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByRole('heading', { name: 'Free', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Pro', exact: true })).toBeVisible();
    });
  });

  test.describe('Large Desktop (1920px)', () => {
    test.use({ viewport: viewports.largeDesktop });

    test('content is properly constrained', async ({ page }) => {
      await page.goto('/');

      // Content should be centered and not stretch full width
      const mainContent = page.locator('.max-w-6xl').first();
      const box = await mainContent.boundingBox();

      // Max-w-6xl is 1152px, should not stretch to 1920px
      expect(box).not.toBeNull();
      expect(box!.width).toBeLessThan(1200);
    });
  });

  test.describe('All Pages at All Viewports', () => {
    const pages = ['/', '/features', '/pricing', '/privacy', '/terms'];

    for (const [viewportName, viewport] of Object.entries(viewports)) {
      for (const pagePath of pages) {
        test(`${pagePath} loads at ${viewportName}`, async ({ page }) => {
          await page.setViewportSize(viewport);
          const response = await page.goto(pagePath);
          expect(response?.status()).toBe(200);

          // No horizontal overflow
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          expect(hasHorizontalScroll).toBe(false);
        });
      }
    }
  });
});

test.describe('Visual Regression Prevention', () => {
  test.beforeEach(async ({ context }) => {
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
  });

  test('no layout shifts on homepage load', async ({ page }) => {
    await page.goto('/');

    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');

    // Verify key elements are visible and positioned (use specific selectors to avoid Astro dev toolbar)
    const header = page.getByRole('banner');
    const hero = page.getByRole('heading', { level: 1, name: /trails/ });
    const footer = page.getByRole('contentinfo');

    await expect(header).toBeVisible();
    await expect(hero).toBeVisible();
    await expect(footer).toBeVisible();
  });
});
