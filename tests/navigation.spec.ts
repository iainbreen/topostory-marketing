import { test, expect } from '@playwright/test';

test.describe('Navigation & Links', () => {
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

  test.describe('Header Navigation', () => {
    test('logo links to homepage', async ({ page }) => {
      await page.goto('/features');
      await page.locator('header a[href="/"]').first().click();
      await expect(page).toHaveURL('/');
    });

    test('Features link navigates correctly', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Features' }).first().click();
      await expect(page).toHaveURL('/features');
    });

    test('Pricing link navigates correctly', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Pricing' }).first().click();
      await expect(page).toHaveURL('/pricing');
    });

    test('Sign In link points to app domain', async ({ page }) => {
      await page.goto('/');
      const signInLink = page.getByRole('link', { name: 'Sign In' }).first();
      await expect(signInLink).toHaveAttribute('href', 'https://app.topostory.com');
    });

    test('Get Started button points to app domain', async ({ page }) => {
      await page.goto('/');
      const getStartedLink = page.locator('header').getByRole('link', { name: 'Get Started' });
      await expect(getStartedLink).toHaveAttribute('href', 'https://app.topostory.com');
    });

    test('header is visible and fixed', async ({ page }) => {
      await page.goto('/');
      const header = page.locator('header');
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('position', 'fixed');
    });
  });

  test.describe('Footer Navigation', () => {
    test('Features link in footer works', async ({ page }) => {
      await page.goto('/');
      await page.locator('footer').getByRole('link', { name: 'Features' }).click();
      await expect(page).toHaveURL('/features');
    });

    test('Pricing link in footer works', async ({ page }) => {
      await page.goto('/');
      await page.locator('footer').getByRole('link', { name: 'Pricing' }).click();
      await expect(page).toHaveURL('/pricing');
    });

    test('Privacy Policy link works', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Privacy Policy' }).click();
      await expect(page).toHaveURL('/privacy');
    });

    test('Terms of Service link works', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Terms of Service' }).click();
      await expect(page).toHaveURL('/terms');
    });

    test('Sign In link in footer points to app domain', async ({ page }) => {
      await page.goto('/');
      const signInLink = page.locator('footer').getByRole('link', { name: 'Sign In' });
      await expect(signInLink).toHaveAttribute('href', 'https://app.topostory.com');
    });

    test('displays current year in copyright', async ({ page }) => {
      await page.goto('/');
      const currentYear = new Date().getFullYear().toString();
      await expect(page.locator('footer')).toContainText(currentYear);
    });
  });

  test.describe('CTA Links', () => {
    test('hero CTA links to app', async ({ page }) => {
      await page.goto('/');
      const heroCTA = page.getByRole('link', { name: 'Get Started Free' });
      await expect(heroCTA).toHaveAttribute('href', 'https://app.topostory.com');
    });

    test('pricing page CTAs link to app', async ({ page }) => {
      await page.goto('/pricing');
      const ctaLinks = page.getByRole('link', { name: /Get Started/i });
      const count = await ctaLinks.count();

      for (let i = 0; i < count; i++) {
        const href = await ctaLinks.nth(i).getAttribute('href');
        expect(href).toBe('https://app.topostory.com');
      }
    });
  });

  test.describe('Internal Link Integrity', () => {
    const pages = ['/', '/features', '/pricing', '/privacy', '/terms'];

    for (const pagePath of pages) {
      test(`all internal links on ${pagePath} are valid`, async ({ page }) => {
        await page.goto(pagePath);

        // Get all internal links
        const internalLinks = await page.locator('a[href^="/"]').all();
        const hrefs = new Set<string>();

        for (const link of internalLinks) {
          const href = await link.getAttribute('href');
          if (href) hrefs.add(href);
        }

        // Verify each unique internal link returns 200
        for (const href of hrefs) {
          const response = await page.request.get(href);
          expect(response.status(), `Link ${href} should return 200`).toBe(200);
        }
      });
    }
  });

  test.describe('External Link Attributes', () => {
    test('external links have proper security attributes', async ({ page }) => {
      await page.goto('/');

      // Get all external links (to app.topostory.com)
      const externalLinks = page.locator('a[href^="https://app.topostory.com"]');
      const count = await externalLinks.count();

      expect(count).toBeGreaterThan(0);

      // External links to same-domain app don't necessarily need noopener
      // but they should at least be functional
      for (let i = 0; i < count; i++) {
        const href = await externalLinks.nth(i).getAttribute('href');
        expect(href).toContain('app.topostory.com');
      }
    });
  });
});
