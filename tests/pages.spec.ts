import { test, expect } from '@playwright/test';

test.describe('Page Loading & Content', () => {
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

  test.describe('Homepage (/)', () => {
    test('loads without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      const response = await page.goto('/');
      expect(response?.status()).toBe(200);
      expect(errors).toHaveLength(0);
    });

    test('displays hero section', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Get Started Free' })).toBeVisible();
    });

    test('displays feature cards', async ({ page }) => {
      await page.goto('/');
      // Should have 6 feature cards
      const featureSection = page.locator('section').filter({ hasText: 'Everything you need' });
      await expect(featureSection).toBeVisible();
    });

    test('displays map showcase section', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText('Choose Your Style')).toBeVisible();
      // Should show style preview cards
      await expect(page.getByText('Classic')).toBeVisible();
    });

    test('displays CTA section', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText('Start Creating Today')).toBeVisible();
    });
  });

  test.describe('Features Page (/features)', () => {
    test('loads without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      const response = await page.goto('/features');
      expect(response?.status()).toBe(200);
      expect(errors).toHaveLength(0);
    });

    test('displays page heading', async ({ page }) => {
      await page.goto('/features');
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Features');
    });

    test('displays core feature sections', async ({ page }) => {
      await page.goto('/features');
      await expect(page.getByText('GPX Import')).toBeVisible();
      await expect(page.getByText('Elevation Data')).toBeVisible();
    });
  });

  test.describe('Pricing Page (/pricing)', () => {
    test('loads without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      const response = await page.goto('/pricing');
      expect(response?.status()).toBe(200);
      expect(errors).toHaveLength(0);
    });

    test('displays pricing heading', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByRole('heading', { level: 1, name: 'Pricing' })).toBeVisible();
    });

    test('displays Free plan', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByText('Free', { exact: true })).toBeVisible();
      await expect(page.getByText('3 exports per month')).toBeVisible();
    });

    test('displays Pro plan', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByText('Pro')).toBeVisible();
      await expect(page.getByText('€3.50')).toBeVisible();
    });

    test('displays FAQ section', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
      await expect(page.getByText('What counts as an export?')).toBeVisible();
      await expect(page.getByText('Can I cancel anytime?')).toBeVisible();
      await expect(page.getByText('What file formats can I export?')).toBeVisible();
      await expect(page.getByText('Do you offer refunds?')).toBeVisible();
    });
  });

  test.describe('Privacy Page (/privacy)', () => {
    test('loads without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      const response = await page.goto('/privacy');
      expect(response?.status()).toBe(200);
      expect(errors).toHaveLength(0);
    });

    test('displays privacy policy content', async ({ page }) => {
      await page.goto('/privacy');
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy');
    });
  });

  test.describe('Terms Page (/terms)', () => {
    test('loads without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      const response = await page.goto('/terms');
      expect(response?.status()).toBe(200);
      expect(errors).toHaveLength(0);
    });

    test('displays terms of service content', async ({ page }) => {
      await page.goto('/terms');
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms');
    });
  });
});

test.describe('Console Error Detection', () => {
  const pages = ['/', '/features', '/pricing', '/privacy', '/terms'];

  for (const pagePath of pages) {
    test(`no console errors on ${pagePath}`, async ({ page, context }) => {
      // Set consent cookie
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

      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Filter out expected/benign errors
      const criticalErrors = consoleErrors.filter(
        (error) => !error.includes('favicon') && !error.includes('404')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  }
});
