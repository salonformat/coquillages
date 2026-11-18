# Coquillages — Wie wachsen Muscheln und Meeresschnecken?

Eine SALONFORMAT Experience in Deutsch, français und English. Fünf Kapitel führen durch eine zusammenhängende blau-elfenbeinfarbene Stift-/Pastellwelt: Meer, Tier, Schalenbildung, Muschel, offenes Meer. Della Respira und Josefin Sans werden lokal geladen.

Scrollen und Wischen steuern die reversible Reise. Im schematischen Schnitt erscheinen Eiweißgerüst, Kalkkristalle und eine neue innere Schicht; die vorhandene Schale bleibt fest. Die Erklärung unterscheidet diese innere Verstärkung von Vergrößerung am Öffnungsrand. Bewegungspause und optionaler Ton sind unabhängig vom Scrollfortschritt. Das Ende bietet Neustart, Quellen und SALONFORMAT.

## Lokal

`npm run dev` startet den lokalen Server unter `http://127.0.0.1:4173`.

- `npm run check`: Syntax der Laufzeitmodule und des Servers.
- `npm test`: Modell, Inhalte, Routen und Scrollzuordnung (`tests/voyage.test.mjs`).
- `npm run test:browser`: Browserprüfungen (`tests/voyage.browser.mjs`). Playwright wird benötigt; `PLAYWRIGHT_MODULE_PATH` kann den Modulpfad setzen.

Die aktuelle Laufzeit besteht aus `dist/index.html`, `dist/voyage.css` und den `dist/voyage*.js`-Modulen; `npm run check` erfasst zusätzlich die Kunst-/Akkretionsmodule. Ältere Dateien und Berichte im Projekt können frühere Fassungen beschreiben. Maßgeblich für das aktuelle Produkt sind PRODUCT.md, DESIGN.md und docs/NEUAUFBAU-20.md. Dokumentation ist keine Qualitätszertifizierung; technische Prüfungen ersetzen keine Erprobung mit Besuchern oder wissenschaftliche Freigabe.
