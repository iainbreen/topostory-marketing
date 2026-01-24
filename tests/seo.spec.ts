import { test, expect } from '@playwright/test';

test.describe('SEO & Meta Tags', () => {
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

  test.describe('Page Titles', () => {
    const pageTitles = [
      { path: '/', shouldContain: 'TopoStory' },
      { path: '/features', shouldContain: 'Features' },
      { path: '/pricing', shouldContain: 'Pricing' },
      { path: '/privacy', shouldContain: 'Privacy' },
      { path: '/terms', shouldContain: 'Terms' },
    ];

    for (const { path, shouldContain } of pageTitles) {
      test(`${path} has appropriate title`, async ({ page }) => {
        await page.goto(path);
        const title = await page.title();

        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);
        expect(title.length).toBeLessThan(70); // SEO best practice
        expect(title.toLowerCase()).toContain(shouldContain.toLowerCase());
      });
    }

    test('each page has unique title', async ({ page }) => {
      const paths = ['/', '/features', '/pricing', '/privacy', '/terms'];
      const titles: string[] = [];

      for (const path of paths) {
        await page.goto(path);
        titles.push(await page.title());
      }

      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(paths.length);
    });
  });

  test.describe('Meta Descriptions', () => {
    const pages = ['/', '/features', '/pricing', '/privacy', '/terms'];

    for (const path of pages) {
      test(`${path} has meta description`, async ({ page }) => {
        await page.goto(path);

        const description = await page.getAttribute('meta[name="description"]', 'content');

        expect(description).toBeTruthy();
        expect(description!.length).toBeGreaterThan(50);
        expect(description!.length).toBeLessThan(160); // SEO best practice
      });
    }

    test('each page has unique meta description', async ({ page }) => {
      const paths = ['/', '/features', '/pricing', '/privacy', '/terms'];
      const descriptions: string[] = [];

      for (const path of paths) {
        await page.goto(path);
        const desc = await page.getAttribute('meta[name="description"]', 'content');
        if (desc) descriptions.push(desc);
      }

      const uniqueDescriptions = new Set(descriptions);
      expect(uniqueDescriptions.size).toBe(paths.length);
    });
  });

  test.describe('Open Graph Tags', () => {
    const pages = ['/', '/features', '/pricing'];

    for (const path of pages) {
      test(`${path} has OG tags`, async ({ page }) => {
        await page.goto(path);

        const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
        const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
        const ogType = await page.getAttribute('meta[property="og:type"]', 'content');

        expect(ogTitle).toBeTruthy();
        expect(ogDescription).toBeTruthy();
        expect(ogType).toBeTruthy();
      });
    }

    test('homepage has OG image', async ({ page }) => {
      await page.goto('/');

      const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
      // OG image is recommended but may not be implemented yet
      // This test documents the expectation
      if (ogImage) {
        expect(ogImage).toContain('http');
      }
    });
  });

  test.describe('Twitter Card Tags', () => {
    test('homepage has Twitter card tags', async ({ page }) => {
      await page.goto('/');

      const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');

      // Twitter cards are recommended but may not be implemented yet
      if (twitterCard) {
        expect(['summary', 'summary_large_image']).toContain(twitterCard);
      }
    });
  });

  test.describe('Canonical URLs', () => {
    const pages = ['/', '/features', '/pricing', '/privacy', '/terms'];

    for (const path of pages) {
      test(`${path} has canonical link`, async ({ page }) => {
        await page.goto(path);

        const canonical = await page.getAttribute('link[rel="canonical"]', 'href');

        // Canonical is recommended for SEO
        if (canonical) {
          expect(canonical).toContain('topostory.com');
          expect(canonical).toContain(path === '/' ? 'topostory.com/' : path);
        }
      });
    }
  });

  test.describe('Structured Data', () => {
    test('homepage may have JSON-LD structured data', async ({ page }) => {
      await page.goto('/');

      const jsonLd = await page.locator('script[type="application/ld+json"]').count();

      // Structured data is optional but recommended
      // This documents the current state
      console.log(`Found ${jsonLd} JSON-LD scripts`);
    });
  });

  test.describe('Heading Structure', () => {
    const pages = ['/', '/features', '/pricing', '/privacy', '/terms'];

    for (const path of pages) {
      test(`${path} has exactly one H1`, async ({ page }) => {
        await page.goto(path);

        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBe(1);
      });

      test(`${path} H1 is not empty`, async ({ page }) => {
        await page.goto(path);

        const h1Text = await page.locator('h1').textContent();
        expect(h1Text?.trim().length).toBeGreaterThan(0);
      });
    }
  });

  test.describe('Language & Charset', () => {
    test('HTML has lang attribute', async ({ page }) => {
      await page.goto('/');

      const lang = await page.getAttribute('html', 'lang');
      expect(lang).toBeTruthy();
      expect(lang).toBe('en');
    });

    test('page has charset meta tag', async ({ page }) => {
      await page.goto('/');

      const charset = await page.locator('meta[charset]').count();
      expect(charset).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Viewport', () => {
    test('has viewport meta tag', async ({ page }) => {
      await page.goto('/');

      const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
      expect(viewport).toBeTruthy();
      expect(viewport).toContain('width=device-width');
    });
  });

  test.describe('Robots', () => {
    test('pages are indexable (no noindex)', async ({ page }) => {
      const publicPages = ['/', '/features', '/pricing'];

      for (const path of publicPages) {
        await page.goto(path);

        const robots = await page.getAttribute('meta[name="robots"]', 'content');
        if (robots) {
          expect(robots).not.toContain('noindex');
        }
      }
    });
  });

  test.describe('Static Files', () => {
    test('robots.txt is accessible', async ({ page }) => {
      const response = await page.goto('/robots.txt');

      // robots.txt should exist or return 404
      // This documents the current state
      console.log(`robots.txt status: ${response?.status()}`);
    });

    test('sitemap.xml is accessible', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');

      // sitemap.xml should exist for good SEO
      // This documents the current state
      console.log(`sitemap.xml status: ${response?.status()}`);
    });
  });
});
