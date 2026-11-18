---
name: Coquillages
description: A painted journey into shell formation
colors:
  sea: "#123f88"
  deep: "#092b69"
  paper: "#f6f1de"
  powder: "#a8c8ed"
  primary-hover: "#fffaf0"
  focus: "#fff6d5"
typography:
  display:
    fontFamily: "Della Respira, serif"
    fontSize: "clamp(43px, 4.15vw, 63px)"
    fontWeight: 400
    lineHeight: 1.10
    letterSpacing: "-.022em"
  body:
    fontFamily: "Josefin Sans, sans-serif"
    fontSize: "21px"
    lineHeight: 1.5
  label:
    fontFamily: "Josefin Sans, sans-serif"
    fontSize: "13px"
    letterSpacing: ".10em"
rounded:
  square: "0"
  circle: "50%"
spacing:
  header-x: "36px"
  header-y: "25px"
  mobile-copy-x: "23px"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.square}"
    padding: "20px 25px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  language-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
  icon-button:
    rounded: "{rounded.circle}"
    size: "42px"
---

# Design System: Coquillages

## Overview

**Creative North Star: "The Hand-Drawn Ocean"**

A continuous blue and ivory pencil-and-pastel sea carries the visitor from the animal to the material forming its shell. Visible strokes, shared light and integrated surroundings define the world; Della Respira and Josefin Sans retain its quiet literary and geometric voices.

Native scrolling determines the journey and reverses every formation state. A stationary schematic section makes the protein framework, mineral crystals and added inner shell layer visible. Interface controls sit lightly over the painting, with local tonal support where contrast requires it.

**Key Characteristics:**

- Full-world blue and ivory paintings with visible pencil strokes
- Five chapters and native reversible scroll
- Stationary shell-formation section
- Sparse controls and short DE/FR/EN explanations

## Colors

Cobalt water and deep blue support warm ivory drawing and text. `sea`, `deep`, `paper` and `powder` are the CSS custom properties in `dist/voyage.css`; the other two tokens capture observed interaction colors. Powder blue belongs to the painted palette, rather than a second action hierarchy. Paper becomes the light field of the formation section; its text switches to deep blue. Local translucent blue backgrounds protect controls over ivory shell.

## Typography

Della Respira is the display face; Josefin Sans carries body copy, labels, navigation and the SALONFORMAT signature. Both fonts are local WOFF2 assets. The opening uses the display token above; generic headings use `clamp(42px, 4.6vw, 70px)`. Chapter-specific desktop headings range from 31–49px. Body explanations use 20–21px, around 29–34ch; mobile explanations use 16–17px, with 15px on short screens. Mobile opening type uses `clamp(34px, 9vw, 43px)`, reducing to 32px below 741px viewport height. Preserve these contextual adjustments rather than forcing one scale onto every scene.

## Layout

The canvas, vignette and story are fixed full-viewport layers; a native document scroll track sets chapter progress. Five chapters are `start`, `animal`, `formation`, `bivalve`, `ending`. Desktop copy sits at 7vw/19vh, with formation copy on the right at 62vw/16vh and bivalve copy at 64vw/22vh. Painting placement is composed separately for mobile, not merely cropped from desktop. At widths below 700px, copy starts 23px from each side, generally 108–115px down; a short-screen rule applies below 741px height. Tablet overrides cover 700–1000px. The header uses 25px/36px padding and the footer 36px side insets, 24px from the bottom. Mobile header uses 20px padding; footer side insets are 19px. Fullscreen and sound controls are hidden below 700px. At widths of at least 700px and heights up to 500px, a compact landscape composition uses 12px/22px header padding, 34px controls, copy at 76px (opening at 70px), 28px opening type, 25px formation type and 14–15px body copy. Its footer sits 10px from the bottom. Resize preserves the current chapter and progress.

## Elevation & Depth

Depth comes from the painted environment, camera approach, crossfades and subtle tonal fields beneath copy. No card stack or raised content panels. Text shadows support legibility; the sources dialog has no box shadow. A small loading notice alone uses `0 6px 20px rgba(0,0,0,.12)`. The vignette is fixed above the painting and fades during formation. Animal copy has a stronger local radial dark wash as the camera approaches the pale shell. Below 700px, the scroll hint has a compact translucent dark backing.

## Shapes

Actions and language controls have square corners. Circular icon buttons and small circular chapter markers are the exceptions. Anatomy labels use compact rectangular tonal backings and describe the schematic; they are not interactive targets. Runtime placement clamps them inside the viewport and moves labels below copy when their bounds would overlap.

## Components

- **Primary entrance:** ivory button, deep-blue text, 264px minimum width and 64px minimum height; mobile 238px/56px, short mobile 50px high. Hover lifts it 2px.
- **Language navigation:** DE/FR/EN, selected state in ivory with deep-blue text. Desktop targets are at least 42px square; mobile uses 30px by 33px.
- **Icon controls:** sound, ambient motion and fullscreen, 42px circles on desktop and 32px on mobile. Motion pause leaves scroll available. Reduced-motion preference disables interface transitions/animations and initializes ambient pause.
- **Journey navigation:** back, five labelled chapter links and continue. Chapter links use `aria-current=step`; formation switches their color to deep blue. The ending hides continue.
- **Anatomy labels and model note:** explanatory noninteractive overlays; show the model's schematic nature without implying a microscopic view.
- **Sources dialog:** deep blue panel with research links and a statement distinguishing deposition inside the shell from outward growth at the opening. Closing restores the journey route.
- **Ending:** open painted sea, centered SALONFORMAT link, restart and sources. The header wordmark disappears here so the signature is not duplicated.

All interactive controls use a 2px warm-ivory focus outline with 7px offset. Interface easing is `cubic-bezier(.16,1,.3,1)` where used. Story progress itself follows scroll, not animation time.

## Do's and Don'ts

- Do preserve visible pencil and pastel strokes in every painting.
- Do integrate animals, shell, rock, water and vegetation in the same light.
- Do let native scroll determine and reverse story position.
- Do keep existing shell material fixed while revealing added structures.
- Do distinguish inner shell thickening from enlargement at the opening.
- Do keep ambient pause independent from scroll progression.

- Don't add quizzes, drawing tasks, postcards or downloads.
- Don't restore a personal byline or imply a museum collection or scientific endorsement.
- Don't replace painted worlds with detached specimens or generic interface cards.
- Don't present the schematic as microscopy or a species-specific biological simulation.
- Don't add timed chapter changes or intercept native wheel and swipe gestures.

## Project name and ambient motion

The opening keeps the localised question as its main headline and places “Coquillages” within the same heading in smaller Josefin Sans. The portfolio uses the project name with that question beneath it. DE/FR/EN questions explain the subject without changing the painted world.

A small continuous deformation field adds gentle movement to the snail’s head and feelers in the wide and animal views. The field returns to zero along its boundary. Painted texture is reused; no detached body asset is added. Light and fish movement are slightly more visible. The formation view remains fixed; its material addition is controlled by scroll. Ambient time stops on pause and when hidden; reduced-motion omits the snail deformation.

On narrow screens the full-height ocean composition is cached as one continuous scene before the camera moves. Water, the painted animal and seabed therefore share the same transform; camera bounds prevent the image edges entering the viewport. Source-coordinate projection keeps annotations and the small snail movement attached. Caption contrast washes fade completely at their bounds (`ellipse closest-side`) to avoid a rectangular cut in the water.

Mobile rendering safeguard: a decoded image is required before any cached scene is constructed. A sampled content check rejects an empty offscreen scene and uses a direct draw of the original painting instead. The separate mesh deformation is desktop-only; mobile retains continuous camera movement, light and fish. This avoids an isolated rectangular head when a browser has not completed image decoding. Chromium checks include a deliberate decode delay and three phone sizes. The additional WebKit runner could not start on this host; no current iPhone Safari certification is claimed.
