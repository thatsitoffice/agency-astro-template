import { defineConfig } from 'astro/config';
// Sitemap temporär deaktiviert wegen Build-Fehler
// import sitemap from '@astrojs/sitemap';

// Site URL (für später, wenn Sitemap wieder aktiviert wird)
const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://example.com';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // Kein Adapter nötig für statische Sites
  // Cloudflare Pages Functions laufen separat
  build: {
    // Output-Verzeichnis für Cloudflare Pages
    assets: 'assets',
  },
  site: siteUrl,
  integrations: [
    // Sitemap temporär deaktiviert - wird später manuell erstellt
    // sitemap(),
  ],
});
