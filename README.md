# TopoStory Marketing Site

Marketing and landing pages for [TopoStory](https://www.topostory.com).

Built with [Astro](https://astro.build/) and deployed to Vercel at `www.topostory.com`.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:4321 to view the site.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

## Project Structure

```
├── CLAUDE.md               # Claude Code context file
├── THREAT-ANALYSIS.md      # Security analysis
├── INCIDENT-RESPONSE.md    # Incident runbook
├── QA-CHECKLIST.md         # QA testing checklist
├── vercel.json             # Rewrites, headers, redirects
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shared HTML structure + analytics init
│   ├── pages/
│   │   ├── index.astro         # Landing page
│   │   ├── pricing.astro       # Pricing comparison
│   │   ├── features.astro      # Feature details
│   │   ├── privacy.astro       # Privacy policy
│   │   └── terms.astro         # Terms of service
│   ├── components/
│   │   ├── Header.astro        # Navigation header
│   │   ├── Footer.astro        # Site footer
│   │   ├── Hero.astro          # Hero section
│   │   ├── Features.astro      # Feature grid
│   │   ├── MapShowcase.astro   # Style preview cards
│   │   ├── Pricing.astro       # Pricing cards
│   │   ├── CTA.astro           # Call-to-action sections
│   │   └── CookieConsent.astro # GDPR cookie banner
│   └── styles/
│       └── global.css          # Tailwind imports + custom styles
└── tests/
    └── cookie-consent.spec.ts  # E2E tests for cookie consent
```

## Deployment Architecture

TopoStory uses a split deployment:

| Domain | Purpose | Repository |
|--------|---------|------------|
| `www.topostory.com` | Marketing site (this repo) | `topostory-marketing` |
| `app.topostory.com` | Application | `topostory` |

### Cross-Domain Links

All "Sign In", "Get Started", and CTA buttons link to `https://app.topostory.com`.

No authentication or API calls happen on this site - it's purely static marketing content.

## Deployment

### Initial Setup

1. Create a new Vercel project and link this repo
2. Add `www.topostory.com` as the production domain
3. Set up redirect: `topostory.com` → `www.topostory.com`

### Deploy

Push to `main` to trigger automatic deployment.

```bash
git add .
git commit -m "Update marketing content"
git push
```

## Adding Content

### New Pages

Create a new `.astro` file in `src/pages/`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Page Title">
  <section class="py-20">
    <!-- Your content -->
  </section>
</BaseLayout>
```

### Images

Add images to `public/images/`. Reference them in components:

```astro
<img src="/images/example.png" alt="Description" />
```

## Analytics (PostHog)

PostHog is used for product analytics across both the marketing site and application.

### Configuration

Analytics runs in **production only** to avoid polluting data with test events. Environment variables are set in Vercel (Production environment only):

| Variable | Where | Purpose |
|----------|-------|---------|
| `PUBLIC_POSTHOG_KEY` | Marketing site | Client-side tracking |
| `VITE_POSTHOG_KEY` | App (client) | Client-side tracking |
| `POSTHOG_API_KEY` | App (server) | Server-side event tracking (webhooks) |

### Safari Support (Proxy)

Safari's Intelligent Tracking Prevention blocks third-party analytics. We proxy PostHog requests through our own domain using Vercel rewrites:

```
Browser → /t/capture → Vercel rewrite → eu.i.posthog.com/capture
```

This is configured in `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/t/static/:path*", "destination": "https://eu-assets.i.posthog.com/static/:path*" },
    { "source": "/t/:path*", "destination": "https://eu.i.posthog.com/:path*" }
  ]
}
```

The client uses `api_host: '/t'` instead of the direct PostHog URL.

### Cross-Domain Tracking

Both sites share cookies on `.topostory.com` to track user journeys from marketing → app:

```javascript
posthog.init(key, {
  cookie_domain: '.topostory.com',
  cross_subdomain_cookie: true
});
```

## Customer Support (Intercom)

Intercom provides a chat widget for customer support inquiries on the marketing site.

### Configuration

Set the environment variable in Vercel (Production environment only):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_INTERCOM_APP_ID` | Intercom application ID |

### How it Works

- The widget loads after users accept marketing cookies (GDPR consent)
- Visitors on the marketing site are **anonymous** (not logged in)
- The same Intercom App ID is used on `app.topostory.com` where users are identified
- Chat widget appears in the bottom-right corner

### Consent Integration

Intercom only initializes when `consent.categories.marketing` is true. The initialization flow:

1. Page loads → check `topostory_consent` cookie
2. If marketing consent exists → `initIntercom()` runs
3. If no consent → wait for `consent-marketing-allowed` event from cookie banner
4. Cookie banner accepts → dispatches event → Intercom initializes

## Cookie Consent (GDPR)

The site includes a GDPR-compliant cookie consent banner that:

- Appears on first visit with Accept All / Reject All / Customize options
- Blocks PostHog and Intercom until appropriate consent is given
- Stores preferences in `topostory_consent` cookie (shared with app.topostory.com)
- Allows users to update preferences via "Cookie Settings" link in footer

See `src/components/CookieConsent.astro` for implementation.

## Security & Compliance

### Documentation

| Document | Purpose |
|----------|---------|
| [THREAT-ANALYSIS.md](./THREAT-ANALYSIS.md) | Pre-launch security analysis and checklist |
| [INCIDENT-RESPONSE.md](./INCIDENT-RESPONSE.md) | Security incident response runbook |
| [QA-CHECKLIST.md](./QA-CHECKLIST.md) | Pre-launch QA testing checklist |

### Security Headers

Configured in `vercel.json`:

- `X-Frame-Options: DENY` - Clickjacking protection
- `X-Content-Type-Options: nosniff` - MIME type sniffing protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer control
- `Permissions-Policy` - Restricts camera, microphone, geolocation

### Monitoring

- **Uptime:** UptimeRobot monitors `www.topostory.com` and `app.topostory.com`
- **Bot Protection:** Vercel bot protection enabled (log-only mode)
- **Analytics:** PostHog with automatic bot filtering

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Vercel](https://vercel.com/)** - Hosting and deployment
- **[PostHog](https://posthog.com/)** - Product analytics (EU region)
- **[Intercom](https://intercom.com/)** - Customer support chat
