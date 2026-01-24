# TopoStory Marketing Site - Pre-Launch QA Checklist

## Overview

This checklist covers all critical areas to verify before launching the TopoStory marketing site. Items marked with **[AUTO]** are covered by automated tests. Run `npm test` to execute all automated checks.

**Site:** www.topostory.com
**Tech Stack:** Astro 5.1.6, Tailwind CSS, Vercel
**Last Updated:** January 2026

---

## Running Automated Tests

### First-Time Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (required once)
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests across all browsers
npm test

# Run tests with UI for debugging
npm run test:ui

# Run tests with visible browser
npm run test:headed

# Run specific test file
npx playwright test tests/pages.spec.ts

# Run tests for single browser
npx playwright test --project=chromium
```

### CI/CD Integration

Tests run automatically via GitHub Actions on:
- Push to `main` branch
- Push to `claude/**` branches
- Pull requests to `main`

See `.github/workflows/qa-tests.yml` for configuration.

### Test Coverage Summary

| Test File | Coverage Area | Tests |
|-----------|--------------|-------|
| `pages.spec.ts` | Page loading, content, console errors | ~20 |
| `navigation.spec.ts` | Header, footer, links, CTAs | ~15 |
| `responsive.spec.ts` | Mobile, tablet, desktop layouts | ~25 |
| `accessibility.spec.ts` | WCAG 2.1 AA, keyboard nav, semantics | ~20 |
| `seo.spec.ts` | Meta tags, OG tags, heading structure | ~25 |
| `analytics.spec.ts` | PostHog, Intercom, consent compliance | ~10 |
| `cookie-consent.spec.ts` | GDPR cookie banner & preferences | ~14 |

---

## 1. Pages & Navigation

### Homepage (`/`)
- [x] **[AUTO]** Page loads without errors (`pages.spec.ts`)
- [x] **[AUTO]** Hero section displays correctly (`pages.spec.ts`)
- [x] **[AUTO]** "Get Started Free" CTA links to app (`navigation.spec.ts`)
- [x] **[AUTO]** Feature cards display (`pages.spec.ts`)
- [x] **[AUTO]** Map showcase displays style preview cards (`pages.spec.ts`)
- [ ] "See All Styles" button expands to show 8 styles *(manual)*
- [x] **[AUTO]** Bottom CTA section renders (`pages.spec.ts`)
- [ ] All images load properly *(visual check)*

### Features Page (`/features`)
- [x] **[AUTO]** Page loads without errors (`pages.spec.ts`)
- [x] **[AUTO]** Navigation highlights "Features" link *(via navigation tests)*
- [x] **[AUTO]** Core features display (`pages.spec.ts`)
- [ ] 8 style presets section renders *(manual)*
- [ ] Irish trails section displays *(manual)*
- [ ] AI POI system section displays *(manual)*
- [x] **[AUTO]** CTA links to app.topostory.com (`navigation.spec.ts`)

### Pricing Page (`/pricing`)
- [x] **[AUTO]** Page loads without errors (`pages.spec.ts`)
- [x] **[AUTO]** Free plan displays correctly (`pages.spec.ts`)
- [x] **[AUTO]** Pro plan displays correctly (`pages.spec.ts`)
- [ ] "17% annual discount" badge shows *(manual)*
- [x] **[AUTO]** CTA buttons link to app (`navigation.spec.ts`)
- [x] **[AUTO]** FAQ section displays all 4 questions (`pages.spec.ts`)
- [ ] FAQ accordions expand/collapse *(manual)*

### Privacy Policy (`/privacy`)
- [x] **[AUTO]** Page loads without errors (`pages.spec.ts`)
- [ ] All sections render correctly *(manual review)*
- [ ] GDPR compliance information present *(manual review)*

### Terms of Service (`/terms`)
- [x] **[AUTO]** Page loads without errors (`pages.spec.ts`)
- [ ] All legal sections render *(manual review)*

---

## 2. Header & Navigation

- [x] **[AUTO]** Logo links to homepage (`navigation.spec.ts`)
- [x] **[AUTO]** "Features" link navigates to `/features` (`navigation.spec.ts`)
- [x] **[AUTO]** "Pricing" link navigates to `/pricing` (`navigation.spec.ts`)
- [x] **[AUTO]** "Sign In" button links to app domain (`navigation.spec.ts`)
- [x] **[AUTO]** "Get Started" button links to app domain (`navigation.spec.ts`)
- [x] **[AUTO]** Header is fixed/sticky (`navigation.spec.ts`)
- [ ] Mobile hamburger menu works *(manual on device)*

---

## 3. Footer

- [ ] Logo displays correctly *(visual check)*
- [x] **[AUTO]** Product links work (`navigation.spec.ts`)
- [x] **[AUTO]** Legal links work (`navigation.spec.ts`)
- [x] **[AUTO]** "Cookie Settings" opens modal (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Copyright year is current (`navigation.spec.ts`)

---

## 4. Cookie Consent System (GDPR)

### Banner Behavior
- [x] **[AUTO]** Banner appears on first visit (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Banner displays all buttons (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Banner disappears after "Accept All" (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Banner disappears after "Reject All" (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Banner hidden on subsequent visits (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Banner appears on all pages (`cookie-consent.spec.ts`)

### Preferences Modal
- [x] **[AUTO]** Modal opens on "Customize" (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Necessary toggle always ON (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Analytics toggle works (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Marketing toggle works (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Save Preferences saves correctly (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Cancel closes modal (`cookie-consent.spec.ts`)

### Cookie Verification
- [x] **[AUTO]** Cookie structure validated (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Accept All sets correct values (`cookie-consent.spec.ts`)
- [x] **[AUTO]** Reject All sets correct values (`cookie-consent.spec.ts`)

---

## 5. Analytics (PostHog)

- [x] **[AUTO]** PostHog only initializes with consent (`analytics.spec.ts`)
- [x] **[AUTO]** No tracking without consent (`analytics.spec.ts`)
- [x] **[AUTO]** No tracking before consent given (`analytics.spec.ts`)
- [ ] PostHog receives events in production *(manual in PostHog dashboard)*
- [ ] Proxy configuration works in production *(manual check)*

---

## 6. Intercom Integration

- [x] **[AUTO]** Widget hidden without marketing consent (`analytics.spec.ts`)
- [x] **[AUTO]** No Intercom requests without consent (`analytics.spec.ts`)
- [ ] Widget appears after marketing consent *(manual - requires API key)*
- [ ] Chat functionality works *(manual)*

---

## 7. Responsive Design

### Mobile (375px)
- [x] **[AUTO]** Homepage renders correctly (`responsive.spec.ts`)
- [x] **[AUTO]** No horizontal scroll (`responsive.spec.ts`)
- [x] **[AUTO]** CTAs are tap-friendly (≥44px) (`responsive.spec.ts`)
- [x] **[AUTO]** Text is readable (`responsive.spec.ts`)
- [x] **[AUTO]** Pricing page renders (`responsive.spec.ts`)
- [x] **[AUTO]** Features page renders (`responsive.spec.ts`)

### Tablet (768px)
- [x] **[AUTO]** Homepage renders correctly (`responsive.spec.ts`)
- [x] **[AUTO]** Content within viewport (`responsive.spec.ts`)
- [x] **[AUTO]** Pricing cards visible (`responsive.spec.ts`)

### Desktop (1280px)
- [x] **[AUTO]** Full layout displays (`responsive.spec.ts`)
- [x] **[AUTO]** Navigation fully visible (`responsive.spec.ts`)

### Large Desktop (1920px)
- [x] **[AUTO]** Content properly constrained (`responsive.spec.ts`)

---

## 8. Cross-Browser Compatibility

All automated tests run across these browsers via Playwright projects:

- [x] **[AUTO]** Chrome (Desktop) - `chromium` project
- [x] **[AUTO]** Firefox (Desktop) - `firefox` project
- [x] **[AUTO]** Safari (Desktop) - `webkit` project
- [x] **[AUTO]** Chrome Mobile - `mobile-chrome` project
- [x] **[AUTO]** Safari Mobile - `mobile-safari` project

Run all browsers: `npm test`
Run specific browser: `npx playwright test --project=webkit`

---

## 9. Performance

### Lighthouse Scores (Target: 90+)
- [ ] Performance: ___/100 *(run `npx lighthouse http://localhost:4321`)*
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

*Note: Consider adding `@playwright/test` lighthouse integration for automated performance testing.*

---

## 10. SEO & Meta Tags

### Titles
- [x] **[AUTO]** Each page has unique `<title>` (`seo.spec.ts`)
- [x] **[AUTO]** Titles contain relevant keywords (`seo.spec.ts`)
- [x] **[AUTO]** Title length 10-70 chars (`seo.spec.ts`)

### Meta Descriptions
- [x] **[AUTO]** Each page has meta description (`seo.spec.ts`)
- [x] **[AUTO]** Descriptions are unique (`seo.spec.ts`)
- [x] **[AUTO]** Description length 50-160 chars (`seo.spec.ts`)

### Open Graph
- [x] **[AUTO]** OG title, description, type present (`seo.spec.ts`)
- [ ] OG image configured *(manual - check social previews)*

### Heading Structure
- [x] **[AUTO]** Each page has exactly one H1 (`seo.spec.ts`)
- [x] **[AUTO]** H1 is not empty (`seo.spec.ts`)

### Technical SEO
- [x] **[AUTO]** HTML has `lang` attribute (`seo.spec.ts`)
- [x] **[AUTO]** Charset meta tag present (`seo.spec.ts`)
- [x] **[AUTO]** Viewport meta tag present (`seo.spec.ts`)
- [x] **[AUTO]** Pages are indexable (`seo.spec.ts`)
- [ ] robots.txt configured *(check `seo.spec.ts` output)*
- [ ] sitemap.xml exists *(check `seo.spec.ts` output)*

---

## 11. Security

### SSL/TLS
- [ ] HTTPS enforced *(production check)*
- [ ] Valid SSL certificate *(production check)*
- [ ] No mixed content warnings *(production check)*

### Headers
- [ ] Security headers configured in Vercel *(manual review)*

---

## 12. Accessibility (WCAG 2.1 AA)

### Automated Checks
- [x] **[AUTO]** All pages pass axe-core scan (`accessibility.spec.ts`)
- [x] **[AUTO]** Color contrast meets 4.5:1 (`accessibility.spec.ts`)

### Keyboard Navigation
- [x] **[AUTO]** Elements are focusable (`accessibility.spec.ts`)
- [x] **[AUTO]** Focus indicators visible (`accessibility.spec.ts`)
- [x] **[AUTO]** No keyboard traps (`accessibility.spec.ts`)
- [x] **[AUTO]** Cookie modal keyboard accessible (`accessibility.spec.ts`)

### Semantic HTML
- [x] **[AUTO]** Proper heading hierarchy (`accessibility.spec.ts`)
- [x] **[AUTO]** Images have alt text (`accessibility.spec.ts`)
- [x] **[AUTO]** Links have accessible names (`accessibility.spec.ts`)
- [x] **[AUTO]** Buttons have accessible names (`accessibility.spec.ts`)
- [x] **[AUTO]** Page has main landmark (`accessibility.spec.ts`)

---

## 13. Console Errors

- [x] **[AUTO]** No JS errors on any page (`pages.spec.ts`)

---

## 14. Environment & Deployment

### Environment Variables
- [ ] `PUBLIC_POSTHOG_KEY` is set in production
- [ ] `PUBLIC_INTERCOM_APP_ID` is set in production

### Vercel Configuration
- [ ] Rewrites working (`/t/*` proxy) *(production check)*
- [ ] Build succeeds without errors *(CI check)*

### DNS & Domain
- [ ] `www.topostory.com` resolves
- [ ] `topostory.com` redirects to `www`
- [ ] SSL covers both domains

---

## 15. Legal & Compliance

### GDPR
- [x] **[AUTO]** No tracking before consent (`analytics.spec.ts`)
- [x] **[AUTO]** Users can reject all cookies (`cookie-consent.spec.ts`)
- [ ] Privacy policy explains data collection *(manual review)*
- [x] **[AUTO]** Users can change preferences anytime (`cookie-consent.spec.ts`)

---

## 16. Pre-Launch Final Checks

- [ ] All placeholder content replaced *(manual review)*
- [ ] No "Lorem ipsum" or test content *(manual review)*
- [x] **[AUTO]** All internal links verified (`navigation.spec.ts`)
- [ ] Analytics configured and receiving data *(PostHog dashboard)*
- [ ] Intercom configured *(Intercom dashboard)*
- [ ] Backup/rollback plan documented
- [ ] Team notified of launch
- [ ] Monitoring/alerting in place

---

## Automation Summary

### What's Automated (~130 tests)
- Page loading and HTTP status
- Console error detection
- All navigation and link verification
- Responsive design across 4 viewports
- Cross-browser testing (5 browsers)
- WCAG 2.1 AA accessibility (via axe-core)
- SEO meta tags and structure
- Cookie consent GDPR compliance
- Analytics consent behavior
- Third-party tracking compliance

### What Requires Manual Testing
- Visual design verification
- Actual analytics data in dashboards
- Production SSL/DNS configuration
- Performance metrics (Lighthouse)
- Legal content review
- FAQ accordion functionality
- Intercom chat functionality (requires API key)
- Social media preview cards

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Developer | | | |
| Product Owner | | | |

---

## Notes

_Add any additional notes, known issues, or exceptions here:_

