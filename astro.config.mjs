import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // Kein Adapter nötig für statische Sites
  // Cloudflare Pages Functions laufen separat
  build: {
    // Output-Verzeichnis für Cloudflare Pages
    assets: 'assets',
  },
  site: import.meta.env.PUBLIC_SITE_URL || 'https://example.com',
  integrations: [
    sitemap({
      // Sitemap wird automatisch generiert
      // Alle Seiten in /src/pages werden automatisch aufgenommen
      // Seiten mit noindex werden automatisch ausgeschlossen
    }),
  ],
});
