---
name: Coquillages — SALONFORMAT
description: A minimalist hand-drawn underwater learning experience.
colors:
  sea: "#083554"
  deep: "#05243d"
  ink: "#f5efdf"
  sand: "#f2e4c6"
  blue: "#adcfd6"
  line: "rgba(240,236,213,.36)"
  entrance-blue: "#174e78"
  entrance-white: "#faf8ef"
  entrance-hover: "#246594"
  secondary-paper: "#f0f1e9"
  secondary-ink: "#124568"
  card-paper: "#f1e7d0"
  entry-ocean: "rgba(16,72,110,.94)"
  entry-hover: "#edf2e9"
  entry-hover-ink: "#164569"
  next-paper: "#f4f3e9"
  next-ink: "#0d3e65"
  floating-control: "rgba(3,28,48,.64)"
  top-control: "rgba(3,30,51,.88)"
  top-control-border: "rgba(240,247,250,.6)"
  touch-ink: "#093b65"
  touch-paper: "rgba(255,251,236,.65)"
  touch-selected: "#ffdda4"
  transfer-feedback: "#fff0cc"
typography:
  display:
    fontFamily: "Della Respira, serif"
    fontSize: "clamp(64px,7.3vw,102px)"
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Della Respira, serif"
    fontSize: "clamp(36px,4vw,58px)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-.025em"
  body:
    fontFamily: "Josefin Sans, sans-serif"
    fontSize: "clamp(18px,1.65vw,22px)"
    lineHeight: 1.55
  label:
    fontFamily: "Josefin Sans, sans-serif"
    fontSize: "14px"
    letterSpacing: ".1em"
rounded:
  rectangular: "0px"
  floating: "2px"
  circular: "50%"
spacing:
  small: "8px"
  control-gap: "14px"
  group-gap: "24px"
  section-gap: "30px"
  page-inset: "40px"
components:
  button-primary:
    backgroundColor: "{colors.entrance-blue}"
    textColor: "{colors.entrance-white}"
    rounded: "{rounded.rectangular}"
    padding: "21px 26px 19px"
    height: "72px"
  button-primary-hover:
    backgroundColor: "{colors.entrance-hover}"
    textColor: "#fff"
  button-secondary:
    backgroundColor: "{colors.secondary-paper}"
    textColor: "{colors.secondary-ink}"
    padding: "14px 18px 12px"
    rounded: "{rounded.rectangular}"
  keepsake-card:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.sea}"
    padding: "28px 28px 22px"
    rounded: "{rounded.rectangular}"
  button-entry:
    backgroundColor: "{colors.entry-ocean}"
    textColor: "{colors.entrance-white}"
    rounded: "{rounded.rectangular}"
    padding: "25px 30px 23px"
    height: "86px"
    width: "340px"
  button-next:
    backgroundColor: "{colors.next-paper}"
    textColor: "{colors.next-ink}"
    padding: "12px 19px"
  shell-touch:
    backgroundColor: "transparent"
    rounded: "{rounded.circular}"
    padding: "0px"
    height: "48px"
    width: "48px"
---

# Design System: Coquillages — SALONFORMAT

## Overview

**Creative North Star: "The Hand-Drawn Ocean"**

Seven hand-drawn sea worlds fill the screen edge to edge. Cream-white pencil specimens, flowing blue water and transparent ivory/cobalt chalk fish preserve the minimal SALONFORMAT drawing world. Della Respira and Josefin Sans carry the quiet literary and geometric voices.

This independent SALONFORMAT Experience follows the visitor’s native scroll or swipe. Approaching the seabed, revealing original grooves and comparing illustrated growth all follow movement forward and backward. Water, fish and the slight snail drift have their own globally pausable ambience. An optional touch question invites recognition before a warm downloadable paper card.

**Key Characteristics:**

- Seven edge-to-edge drawn sea worlds
- Native reversible scroll journey
- Minimal cream-white pencil specimens
- Independent flowing water and chalk fish
- Floating navigation without filled bars
- Optional scallop question and warm PNG keepsake

## Colors

Sea and Deep support open blue water; Ink supplies cream-white text and drawn marks. Sand supports focus and selected controls. The opening uses Entry Ocean with a pale hover treatment; blue-white rectangles remain the action family. Card Paper warms the keepsake. Floating Control belongs only to individual bottom groups. Top Control and its pale border keep language and icon buttons legible over sunlit water; the header and footer remain unfilled. Touch Ink, Touch Paper and Touch Selected define the small scallop answer dots. Transfer Feedback is warm pale text over dark water.

## Typography

**Display Font:** Della Respira (serif fallback).
**Body Font:** Josefin Sans (sans-serif fallback).

Opening headings are monumental; scene headings remain calm and literary. Desktop opening text uses (21px), line-height (1.6), and maximum (26ch). Scene copy uses the body token and maximum (37ch). Mobile opening headings use clamp(44px,12vw,59px), with body text (17px). At mobile heights below (740px), scene headings reduce to (30px) and body to (16px) with line-height (1.4). Card titles and memory lines use Della Respira.

## Layout

A native root scroll track spans (9.05 viewport heights). Seven fixed-world scenes occupy one clipped viewport: entrance, seabed snail, shell, growth, mussel, scallop question and horizon/card. Chapter distances in viewport heights are (1.05), (1.4), (1.2), (1.75), (1.5), (1.15) and the final viewport. The entrance button, global Next and progress markers are direct alternatives to scrolling. No wheel or swipe interception is used.

The desktop two-column copy/specimen grid remains. The ocean reaches all edges, while navigation floats above it. Camera approach and snail proximity follow scroll position, without a timed scene transition. The full illustrations fit their fields, including the shell-only view. The opening retains its portrait drawing on mobile.

At (700px), headings, short explanation and illustrations form a single column. Major specimen fields use clamp(155px,28svh,245px); below (740px) viewport height they use (150px). Main mobile scene padding is (106px) above and (140px) below, shrinking to (92px) and (110px) on short screens. The bivalve simplification note has order (1), placing it on dark water above the illustration. A mobile overlay on animal, bivalve and transfer fades from rgba(2,29,50,.74), through rgba(2,29,50,.52) at (43%), to rgba(2,29,50,.12) at (70%), then rgba(2,29,50,.4), keeping text readable.

The ending uses an inner scroller inset (104px 0 104px) on desktop and (87px 0 104px) on mobile. Navigation stays outside the clip, so the card remains unobscured. Browser Back restores scene and scroll position; changing language preserves progress and the answer. Resizing preserves the corresponding journey position.

## Elevation & Depth

Painted water, restrained gradients and scroll-driven approach create depth. Header and footer have no fill or border. Individual bottom groups use translucent navy with (2px) corners; floating text receives a restrained contrast shadow. The paper card uses shadow (0 20px 45px rgba(3,25,40,.25)) and rotation (3deg). A thin bottom line reflects journey progress, not elapsed time.

Six ivory/cobalt chalk fish occupy different lanes, depths and speeds; the shell and growth views use two subtler fish. Tail bending uses the same raster while the body stays intact. The complete original snail drifts and bobs as an illustration, with foot movement from the same drawing. This does not assert swimming behavior. Water, fish and snail ambience are globally pausable, independently of scroll. Reduced motion stops ambient movement and camera transforms; the reversible illustrated journey stays available.

## Shapes

Actions and paper remain rectangular; icon controls, progress dots and touch targets are circular. Organic specimen silhouettes and minimal pencil texture carry the visual character. Full specimens remain contained, with no rectangular tip patches or floating growth-label boxes.

## Components

### Buttons

The entrance is a blue-white rectangle with minimum width (340px), minimum height (86px), (22px) type, pale (2px) border and padding (25px 30px 23px). It advances directly into the journey rather than starting playback. Mobile uses full width, minimum height (78px), and padding (21px 25px 19px). Hover becomes pale paper with blue text. Secondary actions use pale paper and blue text; text actions remain light. Focus uses a sand (3px) outline with (4px) button offset. Disabled controls have opacity (.45).

### Chips

The ending offers snail and bivalve keepsake choices: minimum height (42px), thin line border and translucent navy fill. Selection changes to sand with sea text.

### Cards / Containers

The warm rectangular paper preview contains an illustration, natural-language memory lines, a simplification note and SALONFORMAT credit. The selected DE, FR or EN version downloads locally as a PNG. No extra card action appears inside the scallop scene: visitors scroll onward or use global Next.

### Navigation

Fixed language, sound, ambience pause and fullscreen controls float above the ocean. Back, Next, progress and SALONFORMAT float below. Individual top controls use the Top Control backing and border; selected language uses pale paper. Bottom groups have padding (6px 12px), or (6px 9px) on mobile. Next uses pale paper with blue text. Fullscreen and home are hidden on mobile. Pausing ambience never disables scrolling. The first snail is also activatable by click, Enter or Space to reach the next view, with a quiet zoom cursor, hover glow and pale (2px) focus outline.

### Scroll Illustration

The shell silhouette and original pencil grooves reveal from tip to opening as scroll progresses and reverse on return. Both growth sequences follow scroll position immediately: three original opaque raster stages use anchored spatial interpolation, with the early snail tip fixed geometrically and mussel frames aligned near the hinge. There is no opening delay, transparent ghost blending or separate tip patch. These are artistic simplifications, not anatomical or time-accurate simulations. The groove reveal shows an existing drawing appearing, not material layers forming.

### Scallop Question

Visitors may touch the complete scallop illustration or use two accessible circular dot targets. Each target has a (48px) hit area with an inset pale dot, blue ring and blue center. Hover, focus and selection use warm Touch Selected. Touching an earlier part gives a supportive hint; choosing the free rim draws a tracing there. Transparent image margin is not an answer. Warm feedback uses a live status region. There are no scores, penalties or gate; visitors may scroll onward without answering.

## Do's and Don'ts

### Do:

- **Do** let native scroll and swipe determine story position.
- **Do** preserve complete original specimen drawings and sparse pencil texture.
- **Do** keep ambient pause independent from scroll progression.
- **Do** retain progress and answer when changing language.
- **Do** make the scallop question optional and keyboard accessible.
- **Do** call the raster growth an artistic simplification.

### Don't:

- **Don't** add timed scene changes or intercept wheel and swipe gestures.
- **Don't** restore filled blue header or footer bars.
- **Don't** present illustrated growth or groove reveal as biological simulation.
- **Don't** require a correct answer to reach the card.
- **Don't** crop specimens or add label boxes that resemble controls.


## Verfeinerung · 18. Oktober 2026

Der Einstieg stellt die blaue Meereswelt und das große weiße Schneckenhaus frei
in den Vordergrund. Weiße Schrift erklärt kurz Lernziel und selbst gestaltete
Entdeckerkarte; eine helle Hauptaktion lädt zum Eintauchen ein. Der sichtbare
Absender lautet ausschließlich SALONFORMAT.

Die Schnecke bleibt in Bewegung als komplette Zeichnung erhalten. Ganze
Wachstumsbilder werden am Bildanker angepasst und bei einem Stadienwechsel
kurz zeitlich überblendet. Die Meereswelten gehen über 650 ms ineinander über.
Keine streifenweise Körperverformung oder gleichzeitig schwebende CSS-Animation.

Am Ende ersetzt die eigene Entdeckerkarte die Motivwahl. Die ungedrehte helle
Karte trägt eine Muschelschale als Zeichenvorlage und die individuelle blaue Linie.
Freihandzeichnen per Finger, Stift oder Maus bleibt auf die Karte begrenzt.
Eine Schaltfläche erlaubt die Randmarkierung ohne Zeichnen. Die eigene Zeichnung
bleibt beim Sprachwechsel und Rückweg erhalten; nur ein ausdrücklicher Neustart
oder „Linie neu zeichnen“ löscht sie. Die Karte bleibt lokal im Browser.


## Abschluss · 19. Oktober 2026

Die eigene Zeichenkarte ist durch eine freiwillige bewegte Meerespostkarte ersetzt.
Sie verwendet die vorhandenen gemalten Wasser- und gezeichneten Tiermotive mit
Della Respira und Josefin Sans. Eine sechssekündige Schleife mit 120 Bildern wird
als animiertes GIF in Deutsch, Französisch und Englisch angeboten. Die Live-Vorschau
läuft unabhängig vom Scrollen; die Pausentaste und reduzierte Bewegung werden
respektiert. Kein Zeichnen, keine Aufgabe vor dem Download. Die Datei wird nur
auf ausdrücklichen Klick geladen.
