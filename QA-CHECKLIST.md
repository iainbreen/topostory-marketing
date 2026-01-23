# TopoStory Marketing Site - Pre-Launch QA Checklist

## Overview

This checklist covers all critical areas to verify before launching the TopoStory marketing site. Complete all sections and mark items as verified before go-live.

**Site:** www.topostory.com
**Tech Stack:** Astro 5.1.6, Tailwind CSS, Vercel
**Last Updated:** January 2026

---

## 1. Pages & Navigation

### Homepage (`/`)
- [ ] Page loads without errors
- [ ] Hero section displays correctly with map preview
- [ ] "Get Started Free" CTA links to `https://app.topostory.com`
- [ ] Feature cards (6) display with correct icons and descriptions
- [ ] Map showcase displays 4 style preview cards
- [ ] "See All Styles" button expands to show 8 styles
- [ ] Bottom CTA section renders with correct messaging
- [ ] All images load properly (no broken images)

### Features Page (`/features`)
- [ ] Page loads without errors
- [ ] Navigation highlights "Features" link as active
- [ ] All 6 core features display with descriptions
- [ ] 8 style presets section renders correctly
- [ ] Irish trails section displays
- [ ] AI POI system section displays
- [ ] CTA links to app.topostory.com

### Pricing Page (`/pricing`)
- [ ] Page loads without errors
- [ ] Navigation highlights "Pricing" link as active
- [ ] Free plan details display correctly (3 exports/month, all styles, standard resolution)
- [ ] Pro plan details display correctly (€3.50/month or €35/year)
- [ ] "17% annual discount" badge shows for yearly pricing
- [ ] "Get Started" buttons link to app.topostory.com
- [ ] FAQ section displays with 4 questions
- [ ] FAQ accordions expand/collapse correctly

### Privacy Policy (`/privacy`)
- [ ] Page loads without errors
- [ ] All sections render (data collection, third-party services, rights)
- [ ] GDPR compliance information present
- [ ] Contact information visible
- [ ] Footer links work correctly

### Terms of Service (`/terms`)
- [ ] Page loads without errors
- [ ] All legal sections render correctly
- [ ] Account requirements documented
- [ ] Payment terms documented
- [ ] Footer links work correctly

---

## 2. Header & Navigation

- [ ] Logo links to homepage
- [ ] "Features" link navigates to `/features`
- [ ] "Pricing" link navigates to `/pricing`
- [ ] "Sign In" button links to `https://app.topostory.com`
- [ ] "Get Started" button links to `https://app.topostory.com`
- [ ] Header is fixed/sticky on scroll
- [ ] Mobile hamburger menu works (if applicable)
- [ ] Active page highlighting works correctly

---

## 3. Footer

- [ ] Logo displays correctly
- [ ] Product links work:
  - [ ] Features → `/features`
  - [ ] Pricing → `/pricing`
- [ ] Legal links work:
  - [ ] Privacy Policy → `/privacy`
  - [ ] Terms of Service → `/terms`
- [ ] "Cookie Settings" link opens cookie preferences modal
- [ ] Copyright year is current (2026)

---

## 4. Cookie Consent System (GDPR)

### Banner Behavior
- [ ] Banner appears on first visit (no existing consent)
- [ ] Banner displays "Accept All", "Reject All", "Customize" buttons
- [ ] Banner disappears after clicking "Accept All"
- [ ] Banner disappears after clicking "Reject All"
- [ ] Banner does NOT reappear on subsequent page loads after consent given
- [ ] Banner appears on all pages (`/`, `/features`, `/pricing`, `/privacy`, `/terms`)

### Preferences Modal
- [ ] Modal opens when clicking "Customize"
- [ ] "Necessary" toggle is always ON and disabled
- [ ] "Analytics" toggle can be switched on/off
- [ ] "Marketing" toggle can be switched on/off
- [ ] "Save Preferences" saves selected options
- [ ] "Accept All" enables all categories
- [ ] "Reject All" disables optional categories
- [ ] Modal closes after saving preferences
- [ ] Cancel button closes modal without saving

### Cookie Verification
- [ ] `topostory_consent` cookie is set after consent
- [ ] Cookie structure contains `version`, `timestamp`, `categories`
- [ ] Cookie domain is `.topostory.com` (for cross-subdomain sharing)
- [ ] Cookie persists across browser sessions
- [ ] Footer "Cookie Settings" reopens modal with current preferences

---

## 5. Analytics (PostHog)

### Basic Tracking
- [ ] PostHog initializes only after analytics consent
- [ ] Page views are tracked
- [ ] PostHog does NOT initialize when analytics consent is denied

### Custom Events
- [ ] `cta_clicked` event fires on CTA button clicks
  - [ ] Includes `text`, `location`, `destination` properties
- [ ] `style_preview_clicked` event fires on style card clicks
- [ ] `pricing_plan_viewed` event fires when pricing section is visible

### Proxy Configuration
- [ ] Requests route through `/t/*` Vercel proxy
- [ ] Safari users are tracked correctly (ITP bypass)
- [ ] No direct requests to `posthog.com` domain

---

## 6. Intercom Integration

- [ ] Intercom widget does NOT appear before marketing consent
- [ ] Intercom widget appears after marketing consent given
- [ ] Widget positioned in bottom-right corner
- [ ] Chat functionality works
- [ ] Widget does NOT appear if marketing consent denied

---

## 7. Responsive Design

### Mobile (320px - 480px)
- [ ] Homepage renders correctly
- [ ] Navigation is mobile-friendly
- [ ] Feature cards stack vertically
- [ ] Pricing cards stack vertically
- [ ] Cookie banner is readable
- [ ] CTAs are tap-friendly (min 44x44px)
- [ ] Text is readable without zooming

### Tablet (481px - 1024px)
- [ ] Layout adapts appropriately
- [ ] Feature grid adjusts (2 columns)
- [ ] Images scale correctly
- [ ] Navigation works correctly

### Desktop (1025px+)
- [ ] Full layout displays
- [ ] Feature grid shows 3 columns
- [ ] Adequate whitespace
- [ ] Maximum content width constrained

---

## 8. Cross-Browser Compatibility

### Chrome (Latest)
- [ ] All pages render correctly
- [ ] Animations work
- [ ] Forms function properly
- [ ] Console has no errors

### Firefox (Latest)
- [ ] All pages render correctly
- [ ] Animations work
- [ ] Forms function properly
- [ ] Console has no errors

### Safari (Latest)
- [ ] All pages render correctly
- [ ] Animations work
- [ ] Cookie consent works with ITP
- [ ] Analytics tracking works via proxy
- [ ] Console has no errors

### Edge (Latest)
- [ ] All pages render correctly
- [ ] Animations work
- [ ] Forms function properly
- [ ] Console has no errors

### Mobile Safari (iOS)
- [ ] Pages render correctly
- [ ] Touch interactions work
- [ ] Cookie banner displays correctly

### Chrome Mobile (Android)
- [ ] Pages render correctly
- [ ] Touch interactions work
- [ ] Cookie banner displays correctly

---

## 9. Performance

### Lighthouse Scores (Target: 90+)
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

### Asset Loading
- [ ] Images are optimized (WebP/AVIF where supported)
- [ ] CSS is minified
- [ ] JavaScript is minified
- [ ] Fonts load efficiently (preload critical fonts)
- [ ] No render-blocking resources

---

## 10. SEO & Meta Tags

### Each Page Should Have
- [ ] Unique `<title>` tag
- [ ] Unique `<meta name="description">` tag
- [ ] Canonical URL set
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Card tags

### Technical SEO
- [ ] `robots.txt` exists and is configured correctly
- [ ] `sitemap.xml` exists and lists all pages
- [ ] No broken internal links
- [ ] No 404 errors on crawl
- [ ] Proper heading hierarchy (H1 → H2 → H3)

---

## 11. Security

### SSL/TLS
- [ ] HTTPS enforced on all pages
- [ ] Valid SSL certificate
- [ ] No mixed content warnings
- [ ] HSTS header set (if applicable)

### Headers
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN`
- [ ] Content Security Policy configured (if applicable)

### External Links
- [ ] External links have `rel="noopener noreferrer"`
- [ ] No sensitive data in URLs

---

## 12. Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] Skip to main content link (if applicable)
- [ ] Cookie modal can be navigated by keyboard

### Screen Readers
- [ ] Images have meaningful alt text
- [ ] Form inputs have labels
- [ ] Buttons have accessible names
- [ ] Page structure uses semantic HTML
- [ ] ARIA labels used appropriately

### Visual
- [ ] Color contrast meets 4.5:1 ratio for text
- [ ] Text can be resized to 200% without loss
- [ ] No information conveyed by color alone

---

## 13. Forms & Interactions

### FAQ Accordions
- [ ] Click expands/collapses content
- [ ] Only one item open at a time (if designed that way)
- [ ] Keyboard accessible (Enter/Space)
- [ ] Proper ARIA attributes

### Style Showcase
- [ ] Clicking style cards tracks analytics event
- [ ] "See All Styles" toggles visibility of additional cards
- [ ] Cards are keyboard accessible

---

## 14. Error Handling

- [ ] Custom 404 page exists and displays correctly
- [ ] 404 page has navigation back to homepage
- [ ] No JavaScript errors in console on any page
- [ ] Graceful degradation if JavaScript disabled

---

## 15. Environment & Deployment

### Environment Variables
- [ ] `PUBLIC_POSTHOG_KEY` is set in production
- [ ] `PUBLIC_INTERCOM_APP_ID` is set in production (if using Intercom)

### Vercel Configuration
- [ ] `vercel.json` rewrites are working (`/t/*` proxy)
- [ ] Trailing slash behavior is consistent
- [ ] Build succeeds without errors
- [ ] Preview deployments work

### DNS & Domain
- [ ] `www.topostory.com` resolves correctly
- [ ] `topostory.com` redirects to `www.topostory.com`
- [ ] SSL certificate covers both domains

---

## 16. Legal & Compliance

### GDPR
- [ ] Cookie banner appears before any tracking
- [ ] Users can reject all non-essential cookies
- [ ] Privacy policy explains data collection
- [ ] Privacy policy lists third-party services (PostHog, Intercom, Stripe)
- [ ] Users can change cookie preferences at any time

### Terms of Service
- [ ] Terms are accessible from footer
- [ ] Payment terms clearly stated
- [ ] Account requirements documented

---

## 17. Pre-Launch Final Checks

- [ ] All placeholder content replaced
- [ ] No "Lorem ipsum" or test content
- [ ] All links verified and working
- [ ] Analytics properly configured and receiving data
- [ ] Intercom configured with correct app ID
- [ ] Backup/rollback plan documented
- [ ] Team notified of launch
- [ ] Monitoring/alerting in place

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

