# Neuaufbau 20 · implementierte Richtung

18. November 2026. Modus: Experience. Codegeleiteter Neuaufbau innerhalb der vom Nutzer bestätigten blau-weißen Stift-/Pastellwelt; keine neue Markenrichtung. Der Nutzer hat die neue zusammenhängende Meereszeichnung ausdrücklich als wunderschön bestätigt und den sichtbaren Stiftstrich verbindlich gemacht.

## Bild und Rhythmus

Ein großer weißer Meeresschneckenkörper mit natürlichem Übergang zum Haus liegt im selben Licht wie Fels, Wasser und Tang. Keine freigestellte Illustration vor einem unabhängigen Bühnenbild. Der freie linke Bildraum trägt den Einstieg. Della Respira und Josefin Sans bleiben.

Ein kontinuierlicher Scrollweg mit fünf Abschnitten ersetzt die sechs alten Stationen: Meer → Tier und Öffnung → stark vergrößerte Schalenbildung → Muschel → offenes Meer. Während der Bildungsphase steht der Bildausschnitt still. Die Bildentwicklung übernimmt die Erklärung: Mantel, organisches Gerüst, Mineralbildung, feste Schale. Text benennt nur das jeweils Sichtbare. Jeder Zustand ist durch Zurückscrollen umkehrbar; keine Zeitsperre, kein Slider, kein Quiz und keine Postkarte.

## Schlüsselszene

Der Schnitt ist schematisch. Die schon vorhandene Schale bleibt fest. Zwischen ihr und dem Mantel wird zuerst ein organisches Gerüst sichtbar, dann Calciumcarbonat-Kristalle und zusätzliches Material. Kristalle erscheinen ausschließlich im markierten Bildungsraum; sie schwimmen nicht als dekorative Teilchen im Meer. Größen, Formen, Reihenfolge und Zeit sind didaktisch vereinfacht. Die Darstellung beansprucht keine vollständige Mineralisationskinetik oder artspezifische Mikrostruktur. Keine Behauptung, jedes Weichtier bilde dieselben Schichten oder Perlmutt.

Die Zeichnung des vorhandenen Materials wird weder gedehnt noch durch ein größeres Altersbild ersetzt. Neue Bildanteile werden durch Freilegen fester gezeichneter Strukturen ergänzt. Die vorhandene Mikrobildtafel wird während der Bildungsphase weder verzerrt noch gezoomt.

## Inspiration und eigenständige Umsetzung

- The Boat, SBS / Matt Huynh, Communication Arts Interactive: Bewegung als Teil des Inhalts; zeichnerische Kontinuität statt austauschbarer Parallaxeffekte. https://www.commarts.com/project/23899/the-boat
- Admire & Amaze, de Bijenkorf / DEPT, Webby People's Voice Best Mobile Visual Design: Gegenstände sind Teil einer zusammenhängenden Umgebung und ihrer Beleuchtung. https://www.webbyawards.com/crafted-with-code/bijenkorf-admire-amaze/

Keine fremden Bilder, Texte, Geräusche oder Code übernommen.

## Wissenschaftliche Grundlage

- Sleight et al. (2020), Computationally predicted gene regulatory networks in molluscan biomineralization identify extracellular matrix production and ion transportation pathways, Bioinformatics 36:1326–1332. https://doi.org/10.1093/bioinformatics/btz754 (Open Access CC BY 4.0). Primärstudie zu Matrixbildung und Ionentransport, kein Beleg für eine universelle Kristallform.
- Clark et al. (2020), Deciphering mollusc shell production, Biological Reviews. https://doi.org/10.1111/brv.12640. Mantel, Matrix, Mineraltransport und artspezifische Unterschiede.
- Woods Hole Oceanographic Institution: How are seashells made? https://www.whoi.edu/ocean-learning-hub/ocean-facts/how-are-seashells-made/

Besuchstexte eigenständig formuliert. Darstellung und Texte in DE/FR/EN. Browserbedienung, reduzierte Bewegung, Lesbarkeit, Bildausschnitt, Umkehrbarkeit und unverändertes vorhandenes Material werden geprüft. Ein nachgewiesener Lernerfolg oder eine wissenschaftliche Freigabe durch ein Museum wird nicht behauptet.

## Dokumentierter Stand

Die Laufzeit `atelier-20` in `dist/index.html`, `dist/voyage.css` und `dist/voyage*.js` setzt die fünf Kapitel um. Desktop und mobile Bildkompositionen werden getrennt platziert. Das neue innere Material erscheint als zusammenhängende, aus der gemalten Schale entnommene Textur innerhalb einer wachsenden Begrenzung; die vorhandene Schale bleibt stehen. Der Quellenhinweis erklärt ausdrücklich, dass diese zusätzliche Lage innere Ablagerung zeigt und Vergrößerung am Öffnungsrand erfolgt.

PRODUCT.md und das tokenhaltige DESIGN.md beschreiben die aktuelle Fassung; `.impeccable/design.json` trägt dieselbe Richtung und darstellbare Bedienmuster. Diese Dokumentation hält Implementierung und Nutzerentscheidungen fest. Sie ist keine visuelle Qualitätszertifizierung, wissenschaftliche Freigabe oder Aussage über gemessene Lernwirkung.

## Responsive Ergänzung

Die bestehende Bildwelt bleibt erhalten. Eine kompakte Querformatregel ab 700px Breite bis 500px Höhe reduziert Typografie, Kopfzeile und Bedienabstände. Eine lokale dunkle Lasur schützt die Tierbeschreibung, eine kleine dunkle Fläche den mobilen Scrollhinweis. Anatomiebeschriftungen werden im sichtbaren Bereich gehalten und bei Kollision mit dem Text darunter verschoben. Orientierungswechsel erhalten Kapitel und Fortschritt. Die Definition des Mantels wurde in DE/FR/EN als natürliche Einführung in dünnes Gewebe unter der Schale formuliert.

Die interne technische Prüfung umfasst zwölf Kombinationen aus drei Sprachen und vier Ansichten (320×568, 844×390, 768×1024, 1024×768), jeweils acht Zustände: 96 Zustände ohne geometrischen Überlauf oder verletzte geprüfte Begrenzungen. Zusätzlich wurden Tastaturbedienung, vier unterscheidbare Bildungsphasen, Zurücknavigation, Kapitelbewahrung bei Rotation und Touch-Wischen geprüft. Diese begrenzten Prüfungen belegen keine allgemeine Barrierefreiheit, Lernwirkung oder wissenschaftliche Freigabe.
