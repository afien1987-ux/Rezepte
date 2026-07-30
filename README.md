# Vorratsküche – Deployment auf Cloudflare Workers

## 1. Anthropic API-Key besorgen
Diese App läuft *nicht* mehr über den in Claude.ai eingebauten KI-Zugang, sondern
braucht einen eigenen API-Key:

1. Auf https://console.anthropic.com registrieren/einloggen (eigenes Konto, getrennt
   vom claude.ai-Abo, mit eigenem Guthaben/Abrechnung).
2. Unter **API Keys** einen neuen Key erstellen, kopieren.

## 2. Repo auf GitHub anlegen
1. Neues Repo erstellen, z. B. `vorratskueche`.
2. Diese drei Dateien/Ordner hochladen (flach, ohne `.git`):
   - `worker.js`
   - `wrangler.jsonc`
   - `public/index.html`

## 3. Cloudflare Worker einrichten
1. Im Cloudflare Dashboard: **Workers & Pages → Create → Import a repository**.
2. Das GitHub-Repo auswählen und verbinden.
3. Cloudflare erkennt `wrangler.jsonc` automatisch (Build-Command bleibt leer,
   es gibt keinen Build-Schritt).
4. Deploy anstoßen.

## 4. API-Key als Secret hinterlegen
1. Im Worker-Projekt: **Settings → Variables and Secrets**.
2. Neues Secret anlegen:
   - Name: `ANTHROPIC_API_KEY`
   - Wert: der Key aus Schritt 1
   - Typ: **Secret** (nicht Text/Klartext-Variable)
3. Speichern. Falls die App die Variable nicht sofort zieht: einmal manuell
   redeployen (Deployments → Retry/Redeploy).

## 5. Testen
Die Worker-URL öffnen (z. B. `vorratskueche.<dein-subdomain>.workers.dev`).
Da die App jetzt als eigenständige Seite läuft (kein iframe wie in der
Claude-Artifact-Vorschau), sollte der Kamera-Button auf dem Handy normal
funktionieren und den System-Dialog für Kamera/Galerie öffnen.

## Hinweise
- Alle KI-Aufrufe laufen über die Route `/api/claude`, die `worker.js`
  serverseitig an die Anthropic API weiterreicht — der Key bleibt dadurch
  auf dem Server und landet nie im Browser.
- Modell ist fest auf `claude-sonnet-4-6` gesetzt (in `worker.js` anpassbar).
- Kein Build-Schritt: `public/index.html` lädt React, Babel Standalone
  (für JSX im Browser) und Tailwind über CDN.
