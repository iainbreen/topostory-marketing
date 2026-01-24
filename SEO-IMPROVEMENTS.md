# SEO Improvements for TopoStory Marketing Site

## Implementation Status

### Completed

| Item | Status | File(s) |
|------|--------|---------|
| robots.txt | Done | `public/robots.txt` |
| Sitemap | Done | `astro.config.mjs` (uses @astrojs/sitemap) |
| Canonical URLs | Done | `src/layouts/BaseLayout.astro` |
| Open Graph tags (og:url, og:image, og:locale) | Done | `src/layouts/BaseLayout.astro` |
| Twitter image tag | Done | `src/layouts/BaseLayout.astro` |
| Structured data (JSON-LD Organization) | Done | `src/layouts/BaseLayout.astro` |
| Custom 404 page | Done | `src/pages/404.astro` |
| SVG accessibility (aria-labels) | Done | `src/components/Hero.astro`, `src/components/Features.astro` |
| HSTS security header | Done | `vercel.json` |

### Remaining Action Items

1. **Add OG preview image** - Create and add `public/images/og-image.jpg` (1200x630px recommended)
   - Meta tags are in place pointing to `/images/og-image.jpg`
   - Social sharing will work once image is added

---

## Google Search Console Setup

After deploying these changes, complete the following:

### 1. Verify Domain Ownership
- Go to [Google Search Console](https://search.google.com/search-console)
- Add property: `https://www.topostory.com`
- Recommended: Use DNS TXT record verification (via your domain registrar)
- Alternative: HTML file upload to `public/` directory

### 2. Submit Sitemap
- Go to Sitemaps section
- Submit: `https://www.topostory.com/sitemap-index.xml`

### 3. Request Indexing
- Use URL Inspection tool
- Submit key pages: `/`, `/features`, `/pricing`

### 4. Configure Settings
- Set preferred domain version (www)
- Set target country if relevant (Ireland)
- Review Core Web Vitals report after indexing

---

## Verification Checklist

After deployment, verify:

- [ ] `https://www.topostory.com/robots.txt` is accessible
- [ ] `https://www.topostory.com/sitemap-index.xml` lists all pages
- [ ] View page source shows canonical, OG, and Twitter meta tags
- [ ] 404 page displays correctly for invalid URLs
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) validates structured data
- [ ] [opengraph.xyz](https://www.opengraph.xyz/) shows correct social preview (after adding og-image.jpg)
- [ ] Lighthouse SEO score is 90+

---

## Optional Future Enhancements

- Add `preload` hints for critical fonts
- Add `prefetch` to navigation links
- Add FAQ schema to pricing page for rich snippets
- Add breadcrumb schema
- Consider `@astrojs/image` for image optimization
