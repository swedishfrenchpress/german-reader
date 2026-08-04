---
name: Wort für Wort
description: A tactile Berlin print workshop for contextual German learning.
colors:
  paper-cream: "#f3efe5"
  aged-paper: "#e9e1d2"
  printers-black: "#171713"
  soft-graphite: "#6d685f"
  vermilion-ink: "#c9362b"
  deep-vermilion: "#98261e"
  berlin-blue: "#275ba8"
  classroom-ochre: "#e7b72b"
  classroom-ochre-pale: "#fff6d8"
  study-green: "#2f745b"
  rule-gray: "#c9c0b0"
  clean-sheet: "#fffdf7"
typography:
  display:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(3.5rem, 8vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  poster-data:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "clamp(7rem, 18vw, 13rem)"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.04em"
  page-title:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(2.75rem, 7vw, 5rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  feature:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(2rem, 5vw, 3.375rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  reading:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(1.25rem, 3vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.8
  word:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.2
  lede:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
  body-large:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  support:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.04em"
  label:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "0.6875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.14em"
  micro:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "0.625rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  square: "0"
  circle: "50%"
components:
  button-primary:
    backgroundColor: "{colors.printers-black}"
    textColor: "{colors.clean-sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "13px 19px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.vermilion-ink}"
    textColor: "{colors.clean-sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "13px 19px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.printers-black}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "13px 19px"
    height: "48px"
  chip:
    backgroundColor: "{colors.paper-cream}"
    textColor: "{colors.printers-black}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
  chip-selected:
    backgroundColor: "{colors.vermilion-ink}"
    textColor: "{colors.clean-sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
  input:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.printers-black}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "10px 12px"
---

# Design System: Wort für Wort

## Overview

**Creative North Star: "The Berlin Print Workshop"**

Wort für Wort should feel like entering a small Berlin print studio where a literary reader, a teaching poster, and a set of hand-operated study tools are being made at the same table. Paper warmth and old-style serif type create a scholarly reading atmosphere; hard rules, compact labels, and saturated blocks of ink keep it active rather than precious.

The system is tactile, editorial, energetic, and scholarly. It rejects glossy SaaS polish and cartoonish gamification: learning states are communicated through ink, geometry, weight, and physical movement rather than glass effects, inflated rounding, or ornamental reward systems.

**Key Characteristics:**

- Warm paper fields with near-black editorial structure.
- Literary serif text paired with compact modernist sans-serif labels.
- Saturated vermilion, blue, ochre, and green used as deliberate ink blocks.
- Square, one-pixel-bordered surfaces with hard offset shadows.
- Circles, squares, and triangles used as print-shop geometry, not decoration for its own sake.

## Colors

The palette behaves like a limited set of printing inks on warm stock: Paper Cream and Printer's Black establish the page, while each saturated color has a clear editorial or learning-state job.

### Primary

- **Vermilion Ink** (#c9362b): The main accent for identity, emphasis, active learning, highlighted words, progress, and decisive hover states.
- **Deep Vermilion** (#98261e): A quieter red for links, metadata, chapter markers, and readable accent text on pale surfaces.

### Secondary

- **Berlin Blue** (#275ba8): Translation, informational, and supporting-action color; also a structural shadow or completion surface when contrast is needed.
- **Classroom Ochre** (#e7b72b): Attention, current selection, collected vocabulary, and warm physical highlights.
- **Pale Classroom Ochre** (#fff6d8): A quiet attention surface behind resume messages and hoverable course rows.

### Tertiary

- **Study Green** (#2f745b): Confirmed knowledge, completed states, and level/status markers.

### Neutral

- **Paper Cream** (#f3efe5): The dominant page field and default control surface.
- **Aged Paper** (#e9e1d2): A darker paper tone available for subtle layering.
- **Printer's Black** (#171713): Primary text, hard rules, dark bands, and the strongest structural shadows.
- **Soft Graphite** (#6d685f): Secondary copy, instructions, and low-priority navigation.
- **Rule Gray** (#c9c0b0): Dividers, inactive borders, and quiet control outlines.
- **Clean Sheet** (#fffdf7): Raised cards, inputs, popover text, and high-contrast light surfaces.

### Named Rules

**The Limited-Ink Rule.** Paper Cream and Printer's Black carry the page. Saturated colors appear in deliberate blocks or meaningful states; do not blend them into glossy gradients or scatter them as decoration.

## Typography

**Display Font:** Iowan Old Style (with Baskerville, Palatino Linotype, Palatino, Book Antiqua, and Georgia fallbacks)  
**Body Font:** Avenir Next (with Avenir, Century Gothic, Trebuchet MS, and sans-serif fallbacks)  
**Label Font:** Avenir Next (with Avenir, Century Gothic, Trebuchet MS, and sans-serif fallbacks)

**Character:** The serif is literary, human, and spacious enough for sustained German reading. The sans-serif behaves like workshop labeling: compact, assertive, frequently uppercase, and carefully tracked.

### Hierarchy

- **Display** (500, `clamp(3.5rem, 8vw, 6rem)`, 0.9): Home-page hero statements; balanced, tightly tracked, and capped for reliable wrapping.
- **Page Title** (500, `clamp(2.75rem, 7vw, 5rem)`, 0.95): Inner-page titles and long legal headings.
- **Headline** (500, `clamp(2.5rem, 6vw, 4.5rem)`, 0.95): Major section headings.
- **Feature** (500, `clamp(2rem, 5vw, 3.375rem)`, 1.05): Chapter displays, manifesto quotations, flashcards, and completion moments.
- **Title** (500, 2.25rem, 1.05): Cards, quiz words, popovers, and drawers.
- **Reading** (400, `clamp(1.25rem, 3vw, 1.75rem)`, 1.8): German story lines; keep them near 50–62 characters and tag them `lang="de"` for language-aware wrapping.
- **Body / Support** (400, 0.9375–1.125rem, 1.5–1.7): Explanations, translations, settings, and supporting prose; long passages stay within 65–70 characters.
- **Control** (700, 0.8125rem, 1.2): Navigation, buttons, chips, and compact metadata.
- **Label / Micro** (800, 0.625–0.6875rem, 1.2, 0.10–0.14em): Uppercase progress, state, and structural labels only.

### Named Rules

**The Story-and-Workshop Rule.** Serif type carries language, narrative, and human-scale meaning. Sans-serif type operates the interface and labels the learning machinery; do not reverse those jobs casually.

## Layout

The wide editorial shell tops out at 1180px with 28px desktop gutters. Focused reading narrows to 760–820px, the learning board expands to 1100px, and flashcards settle at 720px. Large marketing sections use asymmetric two-column grids; learning tools favor regular, ruled grids and centered reading columns.

Spacing is generous around narrative sections and compact inside tools. Repeated intervals of 8, 12, 20, and 28px create the working rhythm, while major sections use 70–96px of vertical space. At 900px, two-column hero and card layouts stack and the learning board reduces from eight to six columns. At 680px, gutters tighten to 16–20px, the board becomes three columns, settings and content grids stack, selected navigation is simplified, and dense controls reflow without shrinking tap targets.

## Elevation & Depth

Depth is predominantly structural: a card or control reads as a physical print piece offset from the sheet beneath it. Soft ambient shadow is reserved for temporary overlays that genuinely float above the workspace.

### Shadow Vocabulary

- **Button Lift** (`4px 4px 0 #171713`): Hover feedback for standard outlined controls.
- **Compact Plate** (`5px 5px 0 #171713`): Persistent floating vocabulary action.
- **Panel Plate** (`8px 8px 0 #171713`): Sticky quiz and task panels.
- **Poster Plate** (`12px 12px 0 #171713`): Large expressive poster objects.
- **Blue Card Plate** (`10px 10px 0 #275ba8`): Flashcards and selected learning artifacts.
- **Ambient Overlay** (`0 18px 45px rgba(32, 28, 20, .12)`): Word popovers.
- **Drawer Shadow** (`-18px 0 50px rgba(23, 23, 19, .2)`): Off-canvas vocabulary drawer.

### Named Rules

**The Structural-Shadow Rule.** Use crisp, zero-blur offsets for objects that feel printed, stacked, or pressed. Use blur only when a temporary overlay physically sits above the entire page.

## Shapes

The default silhouette is square: buttons, cards, fields, chips, navigation rules, and panels use zero radius and one-pixel borders. Circular geometry is reserved for compact icon controls, dots, and graphic print forms. Large circles, rotated squares, and triangles can anchor expressive sections, but functional containers remain rectilinear. Dotted underlines mark tappable reading words without turning prose into a field of buttons.

## Components

Components should feel like pieces of printed teaching equipment: plainly constructed, visibly bounded, and responsive to touch.

### Buttons

- **Shape:** Square corners (`0`) with a one-pixel Printer's Black border and a minimum height of 48px.
- **Primary:** Printer's Black field, Clean Sheet text, 13px/19px padding, bold compact label type.
- **Hover / Focus:** Move two pixels up-left and gain a four-pixel hard offset shadow; primary buttons switch to Vermilion Ink with a Deep Vermilion shadow. Preserve a visible keyboard focus state.
- **Secondary:** Transparent paper field with Printer's Black text and the same physical hover lift.

### Chips

- **Style:** Square Paper Cream controls with a Rule Gray border and 8px/12px padding.
- **State:** Selected chips become solid Vermilion Ink with light text. Tool pills use Clean Sheet at rest and Berlin Blue for hover or active state.

### Cards / Containers

- **Corner Style:** Square (`0`).
- **Background:** Clean Sheet for raised study surfaces; translucent or Paper Cream surfaces for inline editorial cards.
- **Shadow Strategy:** Hard offset plates only on prominent or interactive cards; ordinary content containers use borders without shadow.
- **Border:** One-pixel Printer's Black for structural cards or Rule Gray for quiet supporting containers.
- **Internal Padding:** Usually 20–36px, reduced to 16px for dense mobile states.

### Inputs / Fields

- **Style:** Clean Sheet background, Rule Gray one-pixel border, square corners, and 10px/12px padding.
- **Focus:** Strengthen the border toward Printer's Black or Vermilion Ink and retain a visible focus outline; never rely on color alone.
- **Error / Disabled:** Disabled controls reduce opacity while preserving their shape. Error treatment is not yet established and should use text plus a semantic color/state indicator.

### Navigation

The navigation is a ruled editorial header: an uppercase tracked wordmark, a slightly rotated Vermilion Ink mark, and low-key Soft Graphite links. Hover and current-page states darken to Printer's Black and add a thin Vermilion underline. On small screens the wordmark text and one secondary route may hide, but the identity mark and essential routes remain.

### Interactive Reading Words

Words stay typographically inside the sentence. A dotted neutral underline signals interactivity; hover or active states introduce Deep Vermilion and a faint red wash, while newly introduced words receive a solid two-pixel Vermilion underline and stronger weight.

### Word Popover and Vocabulary Drawer

The word popover is a Printer's Black plate with a Classroom Ochre top rule and a soft ambient shadow. The vocabulary drawer is a Paper Cream work surface entering from the right, separated by a hard border and directional shadow. Both keep serif type for the German word and sans-serif type for controls and metadata.

## Do's and Don'ts

### Do:

- **Do** let Paper Cream and Printer's Black establish most of every screen.
- **Do** use the serif for German words, stories, and expressive headings, and the sans-serif for controls and metadata.
- **Do** use one-pixel rules, square corners, and crisp offset shadows to preserve the print-workshop construction.
- **Do** reserve Vermilion, Blue, Ochre, and Green for clear hierarchy, information, selection, and learning states.
- **Do** preserve generous reading line-height and focused 760–820px reading widths.

### Don't:

- **Don't** introduce glossy gradients, glassmorphism, inflated rounding, or soft SaaS-style card stacks.
- **Don't** turn learning progress into cartoon rewards, decorative badges, or confetti.
- **Don't** use saturated colors interchangeably; each ink has a specific semantic job.
- **Don't** add ambient shadows to ordinary cards or controls; hard offsets are the default physical language.
- **Don't** shrink dense mobile controls below comfortable tap targets or remove the reduced-motion behavior.
