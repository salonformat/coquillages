# Technische Prüfung — 11. Oktober 2026

- Syntaxprüfung aller ausgelieferten Module bestanden.
- Acht Unitprüfungen: vollständige DE/FR/EN-Texte, Routen, globale Portfolio-Links, Reihenfolge und automatische Wachstumszeit.
- Browserprüfung: kompletter Ablauf mit nur einem Startklick in allen drei Sprachen; Pause, Browser-Zurück mit angehaltener Szene, Sprachwechsel, PNG-Export. Keine JavaScript- oder HTTP-Fehler.
- Responsive Ansichten bei 1440 × 900 und 390 × 844 aufgenommen. Kein horizontaler Überlauf in allen sieben Stationen bei 390 Pixeln.
- Separater Browserdurchgang mit normaler Bewegung: WebGL, Kamerafahrt und View Transitions verfügbar; Zurück hält an; Ton ein/aus funktioniert.
- Gezeichnete Fische und Strömung: Bildinhalt verändert sich während der Bewegung, bleibt bei Pause unverändert und setzt sich nach Fortsetzen wieder in Bewegung.
- Sichtbare Sammlungsverweise entfernt. Navigation und SALONFORMAT in allen Stationen erreichbar. Keine Regler oder Pflicht-Hotspots.

Die Prüfung erfolgte mit Chromium. Safari, Firefox und reale Mobilgeräte wurden nicht separat geprüft. Die Wachstumsillustration besteht aus drei gezeichneten Stadien; sie ist eine beschleunigte Vereinfachung, keine anatomische Simulation. Lernwirkung mit echten Besuchern wurde noch nicht gemessen.

Technische Ergebnisse und Ansichten werden lokal unter output/qa gespeichert und nicht ausgeliefert.

Die letzte Überarbeitung verkürzt den Ablauf auf 37 Sekunden plus Übergänge. Wachstum setzt in beiden Wachstumsansichten unmittelbar ein und verändert das Bild innerhalb von 500 ms. Ein direkter Klick oder Enter auf der Schnecke wechselt zur Schalenöffnung. Die ganze Schale ist auch dort sichtbar. Die beiden beschrifteten Kästchen an der Wachstumszeichnung wurden entfernt, da sie wie zusätzliche Buttons wirkten. Die erste Schneckenzeichnung treibt als Illustration leicht durchs Bild.
