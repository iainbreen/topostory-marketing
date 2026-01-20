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
src/
├── layouts/
│   └── BaseLayout.astro    # Shared HTML structure
├── pages/
│   ├── index.astro         # Landing page
│   ├── pricing.astro       # Pricing comparison
│   └── features.astro      # Feature details
├── components/
│   ├── Header.astro        # Navigation header
│   ├── Footer.astro        # Site footer
│   ├── Hero.astro          # Hero section
│   ├── Features.astro      # Feature grid
│   ├── MapShowcase.astro   # Style preview cards
│   ├── Pricing.astro       # Pricing cards
│   └── CTA.astro           # Call-to-action sections
└── styles/
    └── global.css          # Tailwind imports + custom styles
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

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Vercel](https://vercel.com/)** - Hosting and deployment
- **[PostHog](https://posthog.com/)** - Product analytics (EU region)
