# 🚀 Cloudflare Pages Deployment - Schritt für Schritt

Diese Anleitung führt Sie Schritt für Schritt durch das Deployment Ihrer Website auf Cloudflare Pages.

## 📋 Voraussetzungen

Bevor Sie starten, benötigen Sie:
- ✅ Ein Cloudflare-Konto (kostenlos erstellbar auf [cloudflare.com](https://cloudflare.com))
- ✅ Ein Git-Repository (GitHub, GitLab oder Bitbucket)
- ✅ Ihre Website muss in diesem Repository sein

---

## SCHRITT 1: Code in Git hochladen

### 1.1 Git-Repository erstellen (falls noch nicht vorhanden)

**Option A: Neues Repository auf GitHub erstellen**
1. Gehen Sie zu [github.com](https://github.com)
2. Klicken Sie auf "New repository"
3. Geben Sie einen Namen ein (z.B. "meine-website")
4. Klicken Sie auf "Create repository"

**Option B: Lokales Git-Repository initialisieren**
```bash
# Im Projektordner ausführen
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Code zu GitHub hochladen

**Falls Sie noch kein Git-Repository haben:**
```bash
# Im Projektordner
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/IHR-USERNAME/IHR-REPO.git
git push -u origin main
```

**Falls Sie bereits ein Repository haben:**
```bash
git add .
git commit -m "Website fertig für Deployment"
git push
```

---

## SCHRITT 2: Cloudflare Pages Projekt erstellen

### 2.1 Cloudflare Dashboard öffnen

1. Gehen Sie zu [dash.cloudflare.com](https://dash.cloudflare.com)
2. Loggen Sie sich ein (oder erstellen Sie ein Konto)

### 2.2 Pages öffnen

1. Im linken Menü auf **"Pages"** klicken
2. Klicken Sie auf **"Create a project"**

### 2.3 Git-Repository verbinden

1. Wählen Sie **"Connect to Git"**
2. Wählen Sie Ihren Git-Provider (GitHub, GitLab, Bitbucket)
3. Erlauben Sie Cloudflare den Zugriff auf Ihre Repositories
4. Wählen Sie Ihr Repository aus der Liste aus
5. Klicken Sie auf **"Begin setup"**

---

## SCHRITT 3: Build-Einstellungen konfigurieren

### 3.1 Projekt-Name

- **Project name:** Geben Sie einen Namen ein (z.B. "meine-website")
- Dieser Name wird Teil Ihrer URL: `meine-website.pages.dev`

### 3.2 Build-Konfiguration

**Production branch:**
- Lassen Sie `main` oder `master` stehen (je nachdem, wie Ihr Haupt-Branch heißt)

**Build settings:**

**Framework preset:** 
- Wählen Sie **"Astro"** aus der Liste

**Build command:**
```
npm run build
```

**Build output directory:**
```
dist
```

**Root directory:** 
- Lassen Sie dieses Feld **leer** (oder `/`)

**Node.js version:**
- Wählen Sie **"18"** oder **"20"** (empfohlen: 20)

### 3.3 Speichern

Klicken Sie auf **"Save and Deploy"**

---

## SCHRITT 4: Erste Deployment prüfen

### 4.1 Build-Prozess beobachten

- Sie sehen jetzt den Build-Prozess in Echtzeit
- Warten Sie, bis "Success" angezeigt wird (dauert 2-5 Minuten)

### 4.2 Website testen

- Nach erfolgreichem Build erhalten Sie eine URL: `https://meine-website.pages.dev`
- Klicken Sie darauf und testen Sie Ihre Website

---

## SCHRITT 5: Environment Variables setzen

### 5.1 Settings öffnen

1. Gehen Sie zu Ihrem Projekt in Cloudflare Pages
2. Klicken Sie auf **"Settings"** (oben rechts)
3. Scrollen Sie zu **"Environment Variables"**

### 5.2 Variablen hinzufügen

Klicken Sie auf **"Add variable"** und fügen Sie diese Variablen hinzu:

#### Variable 1: PUBLIC_SITE_URL
- **Variable name:** `PUBLIC_SITE_URL`
- **Value:** `https://ihre-domain.com` (oder Ihre Pages-URL: `https://meine-website.pages.dev`)
- **Environment:** Wählen Sie **"Production"** (und optional "Preview" und "Branch preview")

#### Variable 2: PUBLIC_TURNSTILE_SITE_KEY
- **Variable name:** `PUBLIC_TURNSTILE_SITE_KEY`
- **Value:** Ihr Turnstile Site Key (siehe Schritt 6)
- **Environment:** Production + Preview

#### Variable 3: TURNSTILE_SECRET_KEY
- **Variable name:** `TURNSTILE_SECRET_KEY`
- **Value:** Ihr Turnstile Secret Key (siehe Schritt 6)
- **Environment:** Production + Preview

#### Variable 4: CONTACT_TO_EMAIL
- **Variable name:** `CONTACT_TO_EMAIL`
- **Value:** `info@ihre-domain.com` (Ihre E-Mail-Adresse)
- **Environment:** Production + Preview

#### Variable 5: RESEND_API_KEY (Optional)
- **Variable name:** `RESEND_API_KEY`
- **Value:** Ihr Resend API Key (falls Sie E-Mails senden möchten)
- **Environment:** Production + Preview

**Wichtig:** Nach dem Hinzufügen der Variablen muss ein neuer Build ausgelöst werden!

### 5.3 Neuen Build auslösen

1. Gehen Sie zu **"Deployments"**
2. Klicken Sie auf die drei Punkte (⋯) beim letzten Deployment
3. Wählen Sie **"Retry deployment"**

---

## SCHRITT 6: Cloudflare Turnstile einrichten (für Kontaktformular)

### 6.1 Turnstile öffnen

1. Im Cloudflare Dashboard links auf **"Turnstile"** klicken
2. Falls nicht sichtbar: Über das Menü "Security" → "Turnstile"

### 6.2 Neue Site erstellen

1. Klicken Sie auf **"Add Site"**
2. **Site name:** Geben Sie einen Namen ein (z.B. "Kontaktformular")
3. **Domain:** Geben Sie Ihre Domain ein (z.B. `ihre-domain.com` oder `*.pages.dev`)
4. **Widget mode:** Wählen Sie **"Managed"** (empfohlen)
5. Klicken Sie auf **"Create"**

### 6.3 Keys kopieren

Nach der Erstellung sehen Sie:
- **Site Key** (öffentlich) - kopieren Sie diesen
- **Secret Key** (geheim) - kopieren Sie diesen

### 6.4 Keys in Environment Variables eintragen

Gehen Sie zurück zu Schritt 5 und tragen Sie die Keys ein:
- `PUBLIC_TURNSTILE_SITE_KEY` = Site Key
- `TURNSTILE_SECRET_KEY` = Secret Key

---

## SCHRITT 7: Eigene Domain verbinden (Optional)

### 7.1 Custom Domain hinzufügen

1. Gehen Sie zu Ihrem Projekt → **"Custom domains"**
2. Klicken Sie auf **"Set up a custom domain"**
3. Geben Sie Ihre Domain ein (z.B. `www.ihre-domain.com`)
4. Folgen Sie den Anweisungen

### 7.2 DNS-Einträge konfigurieren

Cloudflare zeigt Ihnen die benötigten DNS-Einträge:
- **CNAME:** `www` → `meine-website.pages.dev`
- **A Record:** `@` → IP-Adresse (falls Cloudflare Ihre Domain verwaltet, wird dies automatisch gemacht)

### 7.3 SSL aktivieren

- SSL wird automatisch von Cloudflare aktiviert
- Warten Sie 5-10 Minuten, bis das SSL-Zertifikat erstellt wurde

---

## SCHRITT 8: Automatische Deployments

### 8.1 Wie es funktioniert

- Jedes Mal, wenn Sie Code zu Ihrem Git-Repository pushen, wird automatisch ein neues Deployment erstellt
- Cloudflare baut Ihre Website automatisch neu

### 8.2 Deployment testen

1. Machen Sie eine kleine Änderung in Ihrem Code
2. Committen und pushen Sie:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```
3. Gehen Sie zu Cloudflare Pages → Deployments
4. Sie sehen automatisch ein neues Deployment starten

---

## ✅ Checkliste

- [ ] Code ist in Git-Repository hochgeladen
- [ ] Cloudflare Pages Projekt erstellt
- [ ] Build-Einstellungen konfiguriert (Build command: `npm run build`, Output: `dist`)
- [ ] Erste Deployment erfolgreich
- [ ] Environment Variables gesetzt:
  - [ ] PUBLIC_SITE_URL
  - [ ] PUBLIC_TURNSTILE_SITE_KEY
  - [ ] TURNSTILE_SECRET_KEY
  - [ ] CONTACT_TO_EMAIL
  - [ ] RESEND_API_KEY (optional)
- [ ] Turnstile eingerichtet
- [ ] Neuer Build nach Environment Variables ausgelöst
- [ ] Website funktioniert auf Pages-URL
- [ ] Custom Domain verbunden (optional)
- [ ] Kontaktformular getestet

---

## 🐛 Troubleshooting

### Problem: Build schlägt fehl

**Lösung:**
1. Gehen Sie zu Deployments → Klicken Sie auf das fehlgeschlagene Deployment
2. Scrollen Sie zu "Build logs"
3. Prüfen Sie die Fehlermeldung
4. Häufige Probleme:
   - Falsche Node.js Version → In Build Settings ändern
   - Fehlende Dependencies → `package.json` prüfen
   - Falscher Build Output → Sollte `dist` sein

### Problem: Website zeigt Fehler

**Lösung:**
1. Prüfen Sie die Browser-Konsole (F12)
2. Prüfen Sie, ob alle Environment Variables gesetzt sind
3. Prüfen Sie die Build-Logs in Cloudflare

### Problem: Kontaktformular funktioniert nicht

**Lösung:**
1. Prüfen Sie, ob Turnstile Keys korrekt gesetzt sind
2. Prüfen Sie die Functions-Logs in Cloudflare Pages
3. Testen Sie das Formular lokal mit Wrangler

### Problem: Environment Variables werden nicht übernommen

**Lösung:**
1. Nach dem Hinzufügen von Variablen: Neuen Build auslösen
2. Prüfen Sie, ob die Variablen für das richtige Environment gesetzt sind (Production/Preview)

---

## 📞 Support

Bei Problemen:
1. Prüfen Sie die [Cloudflare Pages Dokumentation](https://developers.cloudflare.com/pages/)
2. Prüfen Sie die Build-Logs in Cloudflare
3. Prüfen Sie die Functions-Logs (falls Kontaktformular Probleme hat)

---

**Viel Erfolg mit Ihrem Deployment! 🚀**
