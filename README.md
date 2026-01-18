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

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Vercel](https://vercel.com/)** - Hosting and deployment
