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
---

# Design System: Coquillages — SALONFORMAT

## Overview

**Creative North Star: "The Hand-Drawn Ocean"**

Seven hand-drawn sea worlds fill the screen edge to edge. A monumental cream-white shell opens the journey; each subsequent scene receives its own drawn backdrop. Minimal pencil marks, large specimens, flowing water and drawn fish carry the immersive SALONFORMAT direction. Transparent ivory and cobalt chalk fish belong to the same sparse drawing world.

One entrance starts an automatic journey. Short explanations appear with the drawings, while floating pause, back and next controls preserve the visitor’s pace. Della Respira and Josefin Sans remain the committed pairing. The final warm paper card offers a downloadable memory of the journey.

**Key Characteristics:**

- Seven edge-to-edge drawn sea worlds
- Minimal cream-white pencil specimens
- Flowing water and ivory/cobalt chalk fish
- Floating navigation without top or bottom bars
- One entrance and automatic progression
- Warm downloadable paper card

## Colors

Blue water and cream-white pencil drawing define the palette. Deep and Sea support contrast; Ink carries explanations; Sand supports focus, selected choices and progress. Entrance Blue and Entrance White remain the blue-white action family. The opening uses translucent Entry Ocean with a pale hover treatment. Next Paper and Next Ink distinguish the global advance control. Card Paper warms the keepsake. Floating Control belongs only to small individual navigation groups, never a screen-wide bar. Line provides quiet borders. Top Control and Top Control Border keep individual language and icon buttons readable against sunlit water without filling the header.

## Typography

**Display Font:** Della Respira (serif fallback).
**Body Font:** Josefin Sans (sans-serif fallback).

The opening display is monumental; scene headings remain calm and literary. Explanations use open geometric letterforms and short lines. Desktop opening copy uses (21px), line-height (1.6), and a maximum (26ch). General scene copy uses the body token and a maximum (37ch). Timed explanations use (21px) and line-height (1.5). Mobile opening headings use clamp(44px,12vw,59px); mobile copy uses (17px). Keepsake headings and card text also use Della Respira.

## Layout

The ocean is fixed to all viewport edges. Seven backdrop assignments cover the entrance, seabed snail, aperture, growth, young mussel, tidal shore and sea horizon. The opening uses a separate portrait drawing on mobile. The header is absolutely positioned over the drawing; the footer floats at the bottom. Both have no fill or border. Individual control groups may carry a small translucent backing.

Desktop scenes use the existing two-column copy/specimen grid. The opening entrance floats at (7vw) from the right and (23vh) from the bottom; opening top inset is clamp(155px,23vh,215px). General scenes reserve (128px) above and (110px) below. Living snail, drawn growth, bivalve and transfer fields use clamp(320px,43vw,580px).

At (700px), scenes become a single column with heading, short explanation, specimen, then timed explanation. Major specimen fields are (265px) tall. General top and bottom insets become (112px) and (124px). The opening button spans the available width between (23px) insets, above floating navigation. At (1000px), the desktop columns compact; at (1700px), the general scene container caps its width. On the mobile ending, the experience scrolls inside a clipped fixed inset (87px 0 104px); navigation remains outside that clip so it cannot cover the paper card. Ending scene padding is (24px) above and (32px) below. Complete specimens use contained drawing fields; the entire shell remains visible in the aperture scene too, with the drawn environment supplying the close view.

## Elevation & Depth

Depth comes primarily from painted water, scene-specific gradients and gentle camera transitions. No filled navigation bars interrupt the drawing. Small floating control groups use translucent navy backing with (2px) corners. Cream text receives a restrained contrast shadow where it floats over water. The paper card uses a shadow (0 20px 45px rgba(3,25,40,.25)) and rotation (3deg). The bottom time indicator is a fine luminous line (3px), rather than a footer surface.

A stronger gentle water drift affects the backdrop. Six transparent ivory/cobalt chalk fish swim at different lanes, apparent depths and speeds; the aperture and growth close-ups reduce this to two subtler fish. All use the same fish drawing with only the tail bending, keeping the body intact. The full original snail is drawn into a canvas; its foot region moves visibly within that same raster, while the complete illustration drifts and bobs. This floating treatment does not claim real snail swimming behavior. Growth starts immediately and uses three opaque hand-drawn raster stages with piecewise anchored spatial interpolation. One opaque stage is selected at a time, avoiding transparent double contours. The early snail tip stays geometrically fixed without a separate rectangular patch; mussel stages align at the hinge. This is an accelerated, simplified illustrated sequence. Reduced motion removes camera movement, water movement and swimming. Global pause stops story progression, currents, fish and specimen animation. On the opening and ending, ambience can pause independently of the story.

## Shapes

Actions and paper remain rectangular. Icon controls and progress markers are circular. Floating navigation group corners are only slightly softened. Shell silhouettes supply the organic forms; minimal hand-drawn lines retain their texture.

## Components

### Buttons

The opening entrance is a large blue-white rectangle: minimum width (340px), minimum height (86px), type (22px), pale border (2px), and padding (25px 30px 23px). Mobile uses full width, minimum height (78px), and padding (21px 25px 19px). Its hover becomes pale paper with blue text. Other primary actions retain the blue-white family. Secondary actions use pale paper and blue text; text actions remain visually light. Focus uses a sand outline (3px) with (4px) button offset. Disabled controls use opacity (.45).

### Chips

The ending offers snail and bivalve keepsake choices. Buttons have minimum height (42px), thin borders and translucent navy fill; selection switches to sand and sea.

### Cards / Containers

A warm rectangular paper preview contains the drawing, natural-language memory lines, simplification note and SALONFORMAT credit. It uses the paper shadow and slight rotation. The browser creates the downloadable PNG locally.

### Navigation

Language, sound, global pause/resume and fullscreen controls float at the top. Back, next, progress and SALONFORMAT float below; there is no header or footer fill. The global next action uses pale paper and blue text, with padding (12px 19px), shrinking to (9px 12px) on mobile. Individual bottom groups use padding (6px 12px), or (6px 9px) on mobile. Fullscreen and the home control are hidden on mobile. Unselected language and icon controls have opaque-enough deep-blue backing (rgba(3,30,51,.88)) and a pale border (rgba(240,247,250,.6)); their individual footprints float over the sea. Selected language controls have a pale fill; the current progress dot uses sand. A fine bottom time line shows automatic scene progress.

### Timed Illustration

Short additional explanations reveal with opacity and a slight vertical movement over (1s). Scene view transitions run over (.7s). The first snail has a quiet zoom cursor and glow on hover, with a pale (2px) focus outline. Growth labels have been removed so the drawing contains no boxes that resemble buttons. In the aperture scene, the complete ivory shell silhouette appears first, then its original pencil grooves reveal progressively from tip to opening over (4s). This reveals an existing drawing; it does not represent anatomical material layers. The automatic sequence has no sliders or required intermediate clicks. Visitors can pause, go back, advance or choose a progress marker. Clicking the first snail drawing, or pressing Enter or Space while it is focused, advances directly to the aperture scene. Forward navigation, progress links and an initial deep link start playback; browser Back pauses. Scene durations are animal (7s), aperture (6s), growth (9s), bivalve (9s) and transfer (6s). The drawn growth itself progresses immediately over (6s); the bivalve starts already open.

## Do's and Don'ts

### Do:

- **Do** preserve edge-to-edge sea with navigation floating over the drawing.
- **Do** use a different drawn backdrop for each of the seven worlds.
- **Do** fit complete specimen drawings inside their fields.
- **Do** animate the complete original snail using its own raster.
- **Do** describe growth as three hand-drawn, accelerated and simplified stages.
- **Do** keep global pause, back and next controls available.

### Don't:

- **Don't** restore filled blue header or footer bars.
- **Don't** add sliders, hotspots or required scene clicks to the journey.
- **Don't** crop specimen drawings, including the aperture scene.
- **Don't** describe the illustrated growth sequence as a biological simulation.
- **Don't** add fine detail that undermines the requested minimal hand-drawn style.
