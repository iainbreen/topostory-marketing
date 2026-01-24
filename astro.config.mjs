import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  site: 'https://www.topostory.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
