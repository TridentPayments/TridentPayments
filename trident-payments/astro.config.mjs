// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The production domain is not confirmed yet. Set SITE_URL in your hosting
// provider (or .env) to the final https:// origin — it drives canonical URLs,
// Open Graph URLs, robots.txt and the sitemap.
const PLACEHOLDER_SITE = 'https://trident-payments.example';
const site = (process.env.SITE_URL || PLACEHOLDER_SITE).replace(/\/+$/, '');

if (site === PLACEHOLDER_SITE) {
  console.warn(
    '\n[trident] SITE_URL is not set. Using a placeholder domain for canonical/OG/sitemap URLs.\n' +
      '          Set SITE_URL=https://your-domain.com before deploying to production.\n'
  );
}

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
