# Astro Agentur-Template

Produktionsreifes Astro-Template für statische Marketing-Websites, optimiert für Cloudflare Pages.

## 🚀 Features

- ✅ **Astro 4** mit TypeScript
- ✅ **SEO-optimiert**: Meta Tags, OG Tags, JSON-LD, automatische Sitemap
- ✅ **Performance**: Vanilla CSS, minimales JavaScript, optimierte Bilder
- ✅ **Accessibility**: Semantisches HTML, ARIA-Labels, Keyboard Navigation
- ✅ **Kontaktformular**: Mit Cloudflare Turnstile (serverseitige Verifizierung)
- ✅ **Cloudflare Pages**: Optimiert für Deployment auf Cloudflare Pages
- ✅ **Security Headers**: Vorkonfiguriert in `_headers`
- ✅ **Design-Tokens**: Zentrale CSS Custom Properties für einfache Anpassung

## 📁 Projektstruktur

```
/
├── public/                 # Statische Assets
│   ├── robots.txt
│   ├── favicon.svg
│   ├── og-default.jpg
│   ├── _headers          # Cloudflare Security Headers
│   └── _redirects        # Cloudflare Redirects
├── src/
│   ├── components/        # Wiederverwendbare Komponenten
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SEOHead.astro
│   │   ├── ContactForm.astro
│   │   └── Section*.astro
│   ├── content/          # Konfiguration & Content
│   │   ├── site.ts       # Site-Konfiguration
│   │   └── navigation.ts # Navigation
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/            # Seiten (routing)
│   └── styles/
│       └── global.css    # Design Tokens & Base Styles
└── functions/            # Cloudflare Pages Functions
    └── api/
        └── contact.ts    # Kontaktformular Backend
```

## 🛠️ Installation

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Environment Variables einrichten:**
   
   Erstellen Sie eine `.env` Datei im Root-Verzeichnis:
   ```env
   PUBLIC_SITE_URL=https://ihre-domain.com
   PUBLIC_TURNSTILE_SITE_KEY=ihr-turnstile-site-key
   TURNSTILE_SECRET_KEY=ihr-turnstile-secret-key
   CONTACT_TO_EMAIL=info@ihre-domain.com
   RESEND_API_KEY=ihr-resend-api-key  # Optional
   ```

## 🏃 Entwicklung

### Lokale Entwicklung (Frontend)

```bash
npm run dev
```

Die Website läuft dann auf `http://localhost:4321`

### Lokale Entwicklung (mit Functions)

Um auch die Cloudflare Pages Functions lokal zu testen:

```bash
# Wrangler installieren (falls noch nicht vorhanden)
npm install -g wrangler

# Frontend + Functions lokal starten
wrangler pages dev dist --compatibility-date=2024-01-01
```

**Hinweis:** Für lokales Testing der Functions müssen Sie zuerst `npm run build` ausführen.

## 📦 Build

```bash
npm run build
```

Der Build-Output befindet sich in `/dist`.

## 🚢 Deployment auf Cloudflare Pages

### 1. Repository verbinden

1. Gehen Sie zu [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
2. Klicken Sie auf "Create a project"
3. Verbinden Sie Ihr Git-Repository (GitHub, GitLab, etc.)

### 2. Build Settings konfigurieren

**Build Command:**
```bash
npm run build
```

**Build Output Directory:**
```
dist
```

**Root Directory:** (leer lassen oder `/`)

### 3. Environment Variables setzen

In den Cloudflare Pages Settings → Environment Variables:

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `PUBLIC_SITE_URL` | Vollständige URL Ihrer Website | `https://ihre-domain.com` |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Site Key (öffentlich) | `0x4AAAAAA...` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile Secret Key (geheim) | `0x4AAAAAA...` |
| `CONTACT_TO_EMAIL` | E-Mail-Adresse für Kontaktformular | `info@ihre-domain.com` |
| `RESEND_API_KEY` | (Optional) Resend API Key für E-Mail-Versand | `re_...` |

**Wichtig:** 
- `PUBLIC_*` Variablen sind im Frontend verfügbar
- Andere Variablen sind nur im Backend (Functions) verfügbar

### 4. Cloudflare Turnstile einrichten

1. Gehen Sie zu [Cloudflare Dashboard](https://dash.cloudflare.com) → Turnstile
2. Erstellen Sie eine neue Site
3. Kopieren Sie Site Key und Secret Key
4. Tragen Sie diese in die Environment Variables ein

### 5. Deploy

Nach dem ersten Push wird automatisch deployed. Weitere Pushes triggern automatische Deployments.

## 📝 Anpassungen für neues Projekt

### 1. Projekt duplizieren

```bash
# Neues Verzeichnis erstellen
cp -r astro-agency-template neues-projekt
cd neues-projekt
```

### 2. Branding anpassen

**`src/content/site.ts`** anpassen:
- `name`: Name der Agentur
- `domain`: Ihre Domain
- `defaultSEO`: Standard SEO-Daten
- `organization`: Firmendaten, Adresse, Kontakt
- `socials`: Social Media Links

**`src/content/navigation.ts`** anpassen:
- Navigationslinks anpassen
- Neue Seiten hinzufügen/entfernen

### 3. Design anpassen

**`src/styles/global.css`** anpassen:
- Design Tokens (CSS Custom Properties) ändern
- Farben, Schriftgrößen, Spacing anpassen

### 4. Neue Seite anlegen

1. Neue Datei in `src/pages/` erstellen, z.B. `src/pages/neue-seite.astro`
2. BaseLayout verwenden:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import { site } from '../content/site';
   ---
   <BaseLayout
     title="Neue Seite - " + site.name
     description="Beschreibung der Seite"
     canonicalPath="/neue-seite"
   >
     <h1>Neue Seite</h1>
     <!-- Inhalt -->
   </BaseLayout>
   ```
3. Navigation in `src/content/navigation.ts` aktualisieren

### 5. Kontaktformular konfigurieren

1. **Turnstile Keys** in Cloudflare Pages Environment Variables setzen
2. **E-Mail-Versand konfigurieren:**
   
   **Option A: Resend API (empfohlen)**
   - Account bei [Resend](https://resend.com) erstellen
   - API Key generieren
   - In `functions/api/contact.ts` die `from`-Adresse anpassen
   - `RESEND_API_KEY` in Environment Variables setzen
   
   **Option B: Nur Logging (Development)**
   - Ohne `RESEND_API_KEY` werden E-Mails nur in den Logs ausgegeben
   - Für Production sollte ein E-Mail-Service verwendet werden

### 6. SEO prüfen

- ✅ Alle Seiten haben eindeutige Titles und Descriptions
- ✅ Canonical URLs sind korrekt
- ✅ OG Images vorhanden (1200x630px empfohlen)
- ✅ Sitemap wird automatisch generiert (`/sitemap.xml`)
- ✅ `robots.txt` ist vorhanden und korrekt konfiguriert

## 🔍 SEO-Checkliste

Nach dem Setup sollten Sie prüfen:

- [ ] **Sitemap:** `https://ihre-domain.com/sitemap.xml` aufrufen
- [ ] **robots.txt:** `https://ihre-domain.com/robots.txt` prüfen
- [ ] **Meta Tags:** View Source auf jeder Seite prüfen
- [ ] **OG Tags:** [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) testen
- [ ] **Structured Data:** [Google Rich Results Test](https://search.google.com/test/rich-results) prüfen
- [ ] **Performance:** [PageSpeed Insights](https://pagespeed.web.dev/) testen
- [ ] **Accessibility:** [WAVE](https://wave.webaim.org/) oder ähnliche Tools testen

## 🧪 Kontaktformular testen

1. **Lokal testen:**
   - `npm run build`
   - `wrangler pages dev dist`
   - Formular ausfüllen und absenden
   - Console-Logs prüfen (ohne Resend API)

2. **Production testen:**
   - Formular auf Live-Site ausfüllen
   - E-Mail sollte an `CONTACT_TO_EMAIL` gesendet werden
   - Bei Fehlern: Cloudflare Pages Logs prüfen

## 📚 Wichtige Dateien

### `src/content/site.ts`
Zentrale Konfiguration für:
- Site-Name, Domain
- SEO-Defaults
- Organization-Daten (für JSON-LD)
- Social Media Links

### `src/components/SEOHead.astro`
SEO-Komponente für:
- Meta Tags
- OG Tags
- Twitter Cards
- JSON-LD Structured Data
- Canonical URLs

### `functions/api/contact.ts`
Backend für Kontaktformular:
- Input-Validierung
- Honeypot-Check
- Turnstile-Verifizierung
- E-Mail-Versand (Resend API oder Logging)

### `public/_headers`
Security Headers für Cloudflare Pages:
- CSP (Content Security Policy)
- X-Frame-Options
- Caching-Regeln

## 🐛 Troubleshooting

### Build-Fehler

**Problem:** `Cannot find module '@astrojs/cloudflare'`
**Lösung:** `npm install` ausführen

**Problem:** TypeScript-Fehler
**Lösung:** `npm run build` erneut ausführen, manchmal hilft ein `rm -rf node_modules && npm install`

### Kontaktformular funktioniert nicht

1. **Turnstile Keys prüfen:**
   - Site Key muss mit `PUBLIC_` Präfix gesetzt sein
   - Secret Key muss ohne `PUBLIC_` gesetzt sein

2. **Functions-Logs prüfen:**
   - Cloudflare Dashboard → Pages → Ihr Projekt → Functions Logs

3. **CORS-Problem:**
   - Sollte nicht auftreten, da alles auf derselben Domain läuft

### Sitemap wird nicht generiert

- Prüfen Sie, ob `@astrojs/sitemap` in `package.json` installiert ist
- Prüfen Sie, ob `PUBLIC_SITE_URL` korrekt gesetzt ist
- Nach Build sollte `/dist/sitemap.xml` existieren

## 📄 Lizenz

Dieses Template ist für den internen Gebrauch der Agentur bestimmt.

## 🤝 Support

Bei Fragen oder Problemen:
1. Dokumentation prüfen
2. Code-Kommentare lesen
3. Cloudflare Pages Logs prüfen

---

**Viel Erfolg mit Ihrem neuen Projekt! 🚀**
