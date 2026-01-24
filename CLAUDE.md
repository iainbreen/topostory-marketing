# Claude Code Context

This file provides context for Claude Code when working on this project.

## Project Overview

TopoStory marketing site - a static Astro website deployed to Vercel at `www.topostory.com`.

**Purpose:** Marketing landing pages, pricing, and features for TopoStory (a trail map creation service).

**Related:** The main application lives at `app.topostory.com` in a separate repository (`topostory`).

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Styling
- **Vercel** - Hosting with edge network
- **PostHog** - Analytics (EU region, proxied through `/t/*`)
- **Intercom** - Customer support chat

## Key Files

| File | Purpose |
|------|---------|
| `src/layouts/BaseLayout.astro` | Main layout with PostHog/Intercom initialization |
| `src/components/CookieConsent.astro` | GDPR cookie consent banner |
| `vercel.json` | Rewrites, security headers, redirects |
| `THREAT-ANALYSIS.md` | Security analysis and pre-launch checklist |
| `INCIDENT-RESPONSE.md` | Security incident runbook |
| `QA-CHECKLIST.md` | Pre-launch QA checklist |

## Environment Variables

Set in Vercel (Production only):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `PUBLIC_INTERCOM_APP_ID` | Intercom application ID |

## Important Patterns

### Cookie Consent

All analytics/marketing scripts require user consent:
- PostHog loads only after `analytics` consent
- Intercom loads only after `marketing` consent
- Consent stored in `topostory_consent` cookie (shared with app.topostory.com)

### Cross-Subdomain Tracking

Cookies are shared between `www.topostory.com` and `app.topostory.com` via:
```javascript
cookie_domain: '.topostory.com',
cross_subdomain_cookie: true
```

### PostHog Proxy

Safari ITP is bypassed by proxying PostHog through first-party domain:
- `/t/*` → `eu.i.posthog.com/*`
- `/t/static/*` → `eu-assets.i.posthog.com/static/*`

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run Playwright E2E tests
```

## Deployment

Push to `main` triggers automatic Vercel deployment. Domain setup:
- `www.topostory.com` - Production
- `topostory.com` - 308 redirect to www

## External Services Configuration

| Service | Dashboard | Notes |
|---------|-----------|-------|
| Vercel | vercel.com/dashboard | Bot protection in log-only mode |
| PostHog | app.posthog.com | Free plan, EU region |
| Intercom | app.intercom.com | Spam filtering enabled |
| UptimeRobot | uptimerobot.com | Monitors www + app |

## Testing

Playwright E2E tests in `tests/`:
- Cookie consent flow
- Tracking blocked when rejected

Run with: `npm run test`
