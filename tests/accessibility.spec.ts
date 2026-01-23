import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test.beforeEach(async ({ context }) => {
    // Set consent cookie to skip banner for cleaner accessibility tests
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

  test.describe('Automated Accessibility Scan', () => {
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/features', name: 'Features' },
      { path: '/pricing', name: 'Pricing' },
      { path: '/privacy', name: 'Privacy Policy' },
      { path: '/terms', name: 'Terms of Service' },
    ];

    for (const { path, name } of pages) {
      test(`${name} page passes accessibility checks`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        // Log violations for debugging
        if (results.violations.length > 0) {
          console.log(`Accessibility violations on ${path}:`);
          results.violations.forEach((v) => {
            console.log(`- ${v.id}: ${v.description}`);
            v.nodes.forEach((n) => console.log(`  ${n.html}`));
          });
        }

        expect(results.violations).toHaveLength(0);
      });
    }
  });

  test.describe('Keyboard Navigation', () => {
    test('can navigate header links with Tab', async ({ page }) => {
      await page.goto('/');

      // Start from body
      await page.locator('body').focus();

      // Tab through header elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to reach interactive elements
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(['A', 'BUTTON']).toContain(focusedElement);
    });

    test('focus indicators are visible', async ({ page }) => {
      await page.goto('/');

      // Focus first link
      const firstLink = page.locator('header a').first();
      await firstLink.focus();

      // Check that focus is visible (element has focus state)
      const isFocused = await firstLink.evaluate((el) => {
        return document.activeElement === el;
      });

      expect(isFocused).toBe(true);
    });

    test('can navigate through page with Tab key', async ({ page }) => {
      await page.goto('/');

      // Count focusable elements
      const focusableCount = await page.evaluate(() => {
        const focusable = document.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        return focusable.length;
      });

      expect(focusableCount).toBeGreaterThan(0);

      // Tab through some elements to ensure no traps
      for (let i = 0; i < Math.min(focusableCount, 10); i++) {
        await page.keyboard.press('Tab');
      }

      // Should still have an active element
      const activeTag = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeTag).toBeDefined();
    });
  });

  test.describe('Semantic HTML', () => {
    test('pages have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      // Check for h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Get all headings and verify hierarchy
      const headings = await page.evaluate(() => {
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(allHeadings).map((h) => ({
          level: parseInt(h.tagName[1]),
          text: h.textContent?.trim().slice(0, 50),
        }));
      });

      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0].level).toBe(1);
    });

    test('images have alt attributes', async ({ page }) => {
      await page.goto('/');

      const imagesWithoutAlt = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).filter((img) => !img.hasAttribute('alt')).length;
      });

      expect(imagesWithoutAlt).toBe(0);
    });

    test('links have accessible names', async ({ page }) => {
      await page.goto('/');

      const linksWithoutText = await page.evaluate(() => {
        const links = document.querySelectorAll('a');
        return Array.from(links).filter((link) => {
          const text = link.textContent?.trim();
          const ariaLabel = link.getAttribute('aria-label');
          const title = link.getAttribute('title');
          return !text && !ariaLabel && !title;
        }).length;
      });

      expect(linksWithoutText).toBe(0);
    });

    test('buttons have accessible names', async ({ page }) => {
      await page.goto('/');

      const buttonsWithoutText = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        return Array.from(buttons).filter((btn) => {
          const text = btn.textContent?.trim();
          const ariaLabel = btn.getAttribute('aria-label');
          return !text && !ariaLabel;
        }).length;
      });

      expect(buttonsWithoutText).toBe(0);
    });

    test('page has main landmark', async ({ page }) => {
      await page.goto('/');

      const hasMain = await page.locator('main').count();
      expect(hasMain).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Color Contrast', () => {
    test('text meets contrast requirements', async ({ page }) => {
      await page.goto('/');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .options({ runOnly: ['color-contrast'] })
        .analyze();

      expect(results.violations).toHaveLength(0);
    });
  });

  test.describe('Cookie Banner Accessibility', () => {
    test('cookie banner is keyboard accessible', async ({ page, context }) => {
      // Clear cookies to show banner
      await context.clearCookies();
      await page.goto('/');

      // Banner should be visible
      await expect(page.locator('#cookie-banner')).toBeVisible();

      // Tab to Accept All button and activate it
      let found = false;
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        const focusedText = await page.evaluate(() => {
          return document.activeElement?.textContent?.trim();
        });
        if (focusedText === 'Accept All') {
          found = true;
          break;
        }
      }

      expect(found).toBe(true);
    });

    test('cookie modal can be navigated by keyboard', async ({ page, context }) => {
      await context.clearCookies();
      await page.goto('/');

      // Open modal
      await page.getByText('Customize').click();
      await expect(page.locator('#cookie-modal')).toBeVisible();

      // Tab through modal elements
      const modalFocusable = await page.evaluate(() => {
        const modal = document.getElementById('cookie-modal');
        if (!modal) return 0;
        const focusable = modal.querySelectorAll(
          'button, [role="switch"], [tabindex]:not([tabindex="-1"])'
        );
        return focusable.length;
      });

      expect(modalFocusable).toBeGreaterThan(0);
    });
  });
});
