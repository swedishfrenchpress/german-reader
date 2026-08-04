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
    fontSize: "clamp(3rem, 7vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  page-title:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(2.5rem, 6.5vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 0.96
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
    fontSize: "clamp(1.25rem, 3vw, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.8
  data:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1
  word:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.2
  lede:
    fontFamily: '"Iowan Old Style", Baskerville, "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(1.125rem, 2vw, 1.375rem)"
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
    letterSpacing: "normal"
  label:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.1em"
  micro:
    fontFamily: '"Avenir Next", Avenir, "Century Gothic", "Trebuchet MS", sans-serif'
    fontSize: "0.6875rem"
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
  button-small:
    backgroundColor: "transparent"
    textColor: "{colors.printers-black}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "9px 14px"
    height: "42px"
  icon-button:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.deep-vermilion}"
    rounded: "{rounded.circle}"
    size: "38px"
  icon-button-hover:
    backgroundColor: "{colors.printers-black}"
    textColor: "{colors.clean-sheet}"
    rounded: "{rounded.circle}"
    size: "38px"
  icon-button-on:
    backgroundColor: "{colors.classroom-ochre}"
    textColor: "{colors.printers-black}"
    rounded: "{rounded.circle}"
    size: "38px"
  icon-button-inline:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.deep-vermilion}"
    rounded: "{rounded.circle}"
    size: "30px"
  tool-pill:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.soft-graphite}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "8px 13px"
    height: "40px"
  tool-pill-on:
    backgroundColor: "{colors.berlin-blue}"
    textColor: "{colors.clean-sheet}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "8px 13px"
    height: "40px"
  chip:
    backgroundColor: "{colors.paper-cream}"
    textColor: "{colors.printers-black}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.vermilion-ink}"
    textColor: "{colors.clean-sheet}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
    height: "40px"
  input:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.printers-black}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "10px 12px"
    height: "44px"
  annotation-plate:
    backgroundColor: "{colors.clean-sheet}"
    textColor: "{colors.printers-black}"
    rounded: "{rounded.square}"
    padding: "24px 24px 20px"
  word-popover:
    backgroundColor: "{colors.printers-black}"
    textColor: "{colors.clean-sheet}"
    rounded: "{rounded.square}"
    padding: "20px 22px"
---

# Design System: Wort für Wort

## Overview

**Creative North Star: "The Berlin Print Workshop"**

Wort für Wort is a small print studio where a literary reader, a set of teaching plates, and a few hand-operated study machines are made at the same table. Warm paper stock and old-style serif type carry the German; hard one-pixel rules, tracked compact sans labels, and saturated blocks of ink operate the interface. Nothing glows, nothing floats without reason, and every raised object casts a hard, zero-blur offset the way a pressed sheet does.

The system is tactile, editorial, and scholarly without being precious. Its type ramp is deliberately capped: the largest step is a 5.25rem serif heading, and there is no poster-scale numeral anywhere in the product. Surfaces earn attention by rule, weight, and ink, not by size. Interface decoration is drawn by hand on the same grid as the icons — circles, rotated squares, triangles — and is always anchored clear of the text column.

It rejects glossy SaaS polish, glass and gradient, inflated rounding, cartoon gamification, and the hero + metric-strip + three-card landing arrangement the language-learning category defaults to. The homepage is a working page of the reader: real chapter-one German set at reading scale beside a live annotation plate.

**Key Characteristics:**

- Warm paper field with near-black editorial structure; a hairline center rule runs the full page background.
- Iowan Old Style for every word of German and every expressive heading; Avenir Next for all machinery.
- Four inks — vermilion, blue, ochre, green — each with one semantic job.
- Square corners, one-pixel borders, hard zero-blur offsets; blur only for genuinely floating overlays.
- Hand-drawn 16px-grid SVG icons in exactly two button sizes.

## Colors

The palette is a limited set of printing inks on warm stock: Paper Cream and Printer's Black carry the page, and each saturated color has one editorial or learning-state job it never trades away.

### Primary

- **Vermilion Ink** (#c9362b): Identity mark, focus ring, progress bar, primary-button hover field, the underline on a newly reached word, the chapter rule, the selected chip, and the lead tool's circular mark. This is the identity ink; it is never spent on an ordinary state.
- **Deep Vermilion** (#98261e): Readable accent text on pale ground — slugs, counts, chapter numerals, icon-button glyphs at rest, hovered reading words, and the primary-button hover shadow.

### Secondary

- **Berlin Blue** (#275ba8): Translation and completion. It fills translation blocks and grammar notes, fills the active reading pill, backs both finish panels, and casts the flashcard's plate shadow.
- **Classroom Ochre** (#e7b72b): Attention and "come back to this." The 5px top rule of the annotation plate, the 4px top rule of the word popover, the current and hovered board tile, the toggled-on icon button, and the finish panel's shadow.
- **Pale Classroom Ochre** (#fff6d8): Quiet attention ground — notice bands, the inline reset confirmation, the resume banner, hovered contents rows, and the learning tile.

### Tertiary

- **Study Green** (#2f745b): Confirmed knowledge only — the known tile, completed contents entries, and the CEFR level stamp.

### Neutral

- **Paper Cream** (#f3efe5): The page field, the drawer work surface, the resting board tile, and the resting chip.
- **Aged Paper** (#e9e1d2): Secondary copy inside the dark popover.
- **Printer's Black** (#171713): Body text, every structural rule and border, the primary button, the word popover plate, and every hard offset shadow.
- **Soft Graphite** (#6d685f): Supporting copy, navigation at rest, labels, and disabled control text.
- **Rule Gray** (#c9c0b0): Quiet dividers, control borders at rest, and the dotted underline under a tappable word.
- **Clean Sheet** (#fffdf7): Raised study surfaces — the specimen page, the annotation plate, quiz and settings panels, inputs, icon buttons, and pills.

### Named Rules

**The Limited-Ink Rule.** Paper Cream and Printer's Black establish every screen. Saturated color appears as a deliberate block or a meaningful state; it never blends into a gradient and never decorates.

**The Ink Semantics Rule.** One ink, one job. Vermilion is identity, focus, and new-word ink. Blue is translation and completion. Ochre is attention and in-progress. Green is confirmed knowledge. A word in the "learning" state is pale ochre with a 3px ochre inset rule — never vermilion, because vermilion would read as identity.

## Typography

**Display Font:** Iowan Old Style (with Baskerville, Palatino Linotype, Palatino, Book Antiqua, Georgia fallbacks)
**Body / Label Font:** Avenir Next (with Avenir, Century Gothic, Trebuchet MS, sans-serif fallbacks)

**Character:** The serif is literary and unhurried, spacious enough for sustained German reading. The sans behaves like workshop labelling: compact, heavy, frequently uppercase, and firmly tracked. Two voices, no third.

### Hierarchy

- **Display** (500, `clamp(3rem, 7vw, 5.25rem)`, 0.92, -0.04em): One per page at most, the homepage specimen heading. This is the ceiling of the ramp.
- **Page Title** (500, `clamp(2.5rem, 6.5vw, 4.5rem)`, 0.95): Inner-page `h1`.
- **Headline** (500, `clamp(2.25rem, 5.5vw, 3.75rem)`, 0.96): Major section headings.
- **Feature** (500, `clamp(2rem, 5vw, 3.375rem)`, 1.05): Course-chapter titles, the manifesto quotation, the flashcard word, finish panels, and the lead tool's name.
- **Title** (500, 2.25rem, 1.05): Annotation plate word, popover word, focus word, quiz word, chapter headings, drawer heading, tool names.
- **Reading** (400, `clamp(1.25rem, 3vw, 1.6rem)`, 1.8): Every line of German prose. Cap the measure at 62ch (46ch in the homepage specimen), set `hyphens: auto`, and tag it `lang="de"`.
- **Data** (500 serif, 1.75rem, 1, tabular lining numerals): Board statistics only.
- **Body Large / Body / Support** (400, 1.125 / 1 / 0.9375rem, 1.45–1.65): Glosses, intros, settings, and supporting prose; 44–62ch.
- **Control** (700, 0.8125rem): Navigation links, pills, chips, metadata, contents summary.
- **Label** (800, 0.75rem, 0.1em, uppercase): Button and action text.
- **Micro** (800, 0.6875rem, 0.1–0.14em, uppercase): Slugs, structural labels, stamps, definition-list terms, and inline action words. Nothing in the product is set smaller.

### Named Rules

**The Story-and-Workshop Rule.** Serif carries language, narrative, and human-scale meaning. Sans operates the machine and labels it. Never set a German word in the sans, and never set a button in the serif.

**The Capped-Ramp Rule.** 5.25rem is the largest type in the product. There is no poster numeral, no 13rem statistic, and no display face bigger than the page it heads. Scale is earned by rule and ink, not by size.

**The Tabular-Count Rule.** Every number that changes as the learner works — word counts, chapter numerals, progress, speech rate — is set `font-variant-numeric: lining-nums tabular-nums` so it does not jitter.

## Layout

The editorial shell is 1180px with 28px gutters, dropping to 16–20px below 680px. Reading columns are narrower than the shell by design: 760px for the intermediate reader and the notice bands, 820px for the course reader, 920px for the course bar and contents, 1100px for the recognition board, 720px for flashcards, 670px for the quiz and finish panels.

The homepage specimen is an asymmetric two-column grid (1.3fr / 0.7fr, 34px gap): the sheet of real German on the left, the annotation plate pinned right, the primary action and the honest facts line directly beneath. The rest of the page is a full-bleed tool block (one lead card, then a 1fr/1fr pair) and a vermilion manifesto band.

Vertical rhythm: 86px between major homepage sections, 84px between course chapters (62px on small screens), 60px between learning segments, 54–70px around the specimen. Inside components the working intervals are 7, 8, 10, 12, 14, 18, 20, 22, and 28px.

Three breakpoints. At **980px** the specimen stacks to one column and its plate shadow drops from 8px to 6px. At **900px** the tool pair stacks, the lead card's mark shrinks, and the board goes from eight columns to six. At **680px** gutters tighten, the wordmark text hides (the mark stays), the contents becomes one column, the focus card reflows to two columns with its tools on their own ruled row, the board becomes three columns, deck settings and answer rows stack, and every tap target holds — icon buttons *grow* to 44px under `(pointer: coarse)`, they never shrink.

## Elevation & Depth

Depth is structural, not atmospheric. A raised object is a piece of printed matter sitting on the sheet below it, so its shadow is a hard zero-blur offset in a real ink color. Blur appears exactly twice in the product, both for things that genuinely float over the whole page: the word popover and the vocabulary drawer.

### Shadow Vocabulary

- **Control Lift** (`4px 4px 0 #171713`; `4px 4px 0 #98261e` on the primary button): Hover and focus-visible on buttons, pills, and chips, always paired with `translate(-2px, -2px)`.
- **Tool Lift** (`6px 6px 0 #171713` with `translate(-3px, -3px)`): Homepage tool cards on hover and focus.
- **Vocabulary Plate** (`5px 5px 0 #171713`, `7px 7px 0` on hover): The floating vocabulary button.
- **Annotation Plate** (`8px 8px 0 #171713`, 6px at 980px, 5px at 680px): The homepage annotation plate and the sticky quiz panel.
- **Attention Plate** (`6px 6px 0 #e7b72b`): The resume banner.
- **Completion Plate** (`10px 10px 0 #e7b72b`): Both finish panels, on blue ground.
- **Flashcard Plate** (`10px 10px 0 #275ba8`): The flashcard.
- **Ambient Overlay** (`0 18px 45px rgba(32, 28, 20, .12)`): The word popover only.
- **Drawer Shadow** (`-18px 0 50px rgba(23, 23, 19, .2)`): The off-canvas vocabulary drawer only.

### Named Rules

**The Structural-Shadow Rule.** Zero-blur offsets for anything that reads as printed, stacked, or pressed. Blur only when the surface is fixed-position and sits above the entire page.

**The Lift-With-Offset Rule.** A hard shadow never appears alone. Whatever gains an offset also moves up-and-left by the same order (2px for controls, 3px for tool cards, 1px for the vocabulary button), so the object looks lifted rather than outlined.

## Shapes

Square is the default and near-universal: buttons, cards, panels, inputs, pills, chips, tiles, notices, and the popover all use `0` radius with one-pixel borders. The only circle in the interface is the icon button (`50%`) — and even that squares off inside the drawer head, where the close control adopts a black square border to match the ruled panel.

Rules do structural work that borders alone can't: the page background carries a hairline vertical center rule; the course bar is bounded top and bottom only; the annotation plate takes a 5px ochre top rule; the focus card takes a 5px vermilion top rule; the word popover takes a 4px ochre top rule; the course chapter head is introduced by a 58×4px vermilion bar. A tappable word is marked by a one-pixel dotted Rule Gray underline, thickening to a solid 2px vermilion when the word is newly reached — prose stays prose, never a field of buttons.

Print-shop geometry (a vermilion circle, a rotated blue square, an ochre triangle) anchors the homepage tool cards. It is absolutely positioned, `pointer-events: none`, always bled off a corner the copy vacates, and it moves on hover. It never sits on a line of text at any width.

## Components

Components should read as printed teaching equipment: plainly constructed, visibly bounded, responsive to touch.

### Buttons

- **Shape:** Square (`0`), one-pixel Printer's Black border, 48px minimum height, 13px/19px padding, uppercase 0.75rem/800/0.1em label type.
- **Primary:** Printer's Black field, Clean Sheet text. On hover or focus it flips to Vermilion Ink with a Deep Vermilion offset.
- **Secondary:** Transparent on paper, black text, same physical lift with a black offset.
- **Small:** 42px minimum height, 9px/14px padding, for banner and inline actions.
- **Disabled:** 0.42 opacity, `not-allowed` cursor, lift and shadow suppressed. The shape never changes.

### Icon Buttons

Exactly two sizes, one job each — no third. **Standalone** is a 38px circle (Clean Sheet ground, Rule Gray border, Deep Vermilion glyph) used in plates, drawers, and toolbars. **Inline** is a 30px circle used inside a line of prose. Hover inverts to a Printer's Black field with a white glyph; the toggled-on state is an ochre field with black glyph; disabled drops to 0.4 opacity with graphite glyph on Clean Sheet. Under `(pointer: coarse)` they grow to 44px and 40px respectively.

### Icons

Every icon is authored inline SVG on a 16×16 grid with a 1.6 stroke, square caps, mitre joins, `currentColor`, and `fill="none"` (solid fills only where the mark is a solid form: the speaker cone and the play triangle). They live as `ICON_PATHS` in `app.js` and are emitted by `GermanReader.icon(name)`. The shipped set is: speak, star, check, close, play, book, grid, cards. Add new marks to that map, drawn on the same grid with the same stroke.

### Chips and Pills

- **Chip** (deck filters): Square Paper Cream control, Rule Gray border, 8px/12px padding, 40px minimum height, 0.8125rem/700 control type. Selected is a solid Vermilion Ink field with white text.
- **Tool Pill** (reading controls): Square Clean Sheet control, Rule Gray border, graphite text, 8px/13px padding, 40px minimum. Hover and active are a solid Berlin Blue field with white text.
- Both take the standard lift on hover and focus, and both drop to 0.45 opacity with lift suppressed when disabled.

### Cards / Containers

- **Corner Style:** Square (`0`).
- **Background:** Clean Sheet for raised study surfaces; a 55%-alpha Clean Sheet wash for the homepage tool cards, resolving to solid Clean Sheet on hover.
- **Shadow Strategy:** Hard offsets only, and only on plates and interactive cards. Ordinary containers are bounded by rules and carry no shadow.
- **Border:** One-pixel Printer's Black for structural surfaces, Rule Gray for quiet ones.
- **Internal Padding:** 20–36px, tightening to 16–22px below 680px.

### Inputs / Fields

- **Style:** Clean Sheet ground, Rule Gray one-pixel border, square corners, 10px/12px padding, 44px minimum height (selects 40px).
- **Focus:** The global focus language applies — a 2px Vermilion outline at 2px offset. Never a color-only cue.
- **Disabled / unavailable:** Reduced opacity with shape preserved, plus a `title` explaining why. Audio controls register with a global availability system: when the browser has no speech API or no German voice installed, every registered control is disabled and an ochre notice band states the reason in words.
- **Notices:** `.page-notice` is a 760px ochre-bordered band on pale ochre for speech and storage unavailability. Destructive actions use the same treatment inline (`.reset-confirm`) rather than a native `confirm()`; its confirm button is a solid vermilion square, its decline a plain outline.

### Navigation

A ruled editorial header at 1180px with a one-pixel Rule Gray bottom border. The wordmark is a 34px vermilion square rotated -3° carrying a white "W", beside tracked uppercase 0.8125rem text. Links are 0.8125rem/700 in Soft Graphite; hover and `aria-current="page"` darken to Printer's Black and light a vermilion bottom rule. **Links carry the pages' own German names — Lesen, Wortfeld, Karteikarten — with English `aria-label`s.** No nav item is ever hidden; below 680px only the wordmark *text* collapses, leaving the mark and all three routes.

### Signature: The Annotation Plate

The homepage answer surface, and the clearest statement of the world. A Clean Sheet plate, one-pixel black border, a 5px Classroom Ochre top rule, an 8px hard black offset. Inside: the German word with its article in Title serif, a green level stamp on the same baseline, an English gloss at Body Large, a `.note-facts` definition list on 5.5rem/1fr rows separated by Rule Gray hairlines (micro uppercase terms, serif definitions), a Berlin Blue grammar note, then two 38px icon buttons. It is `aria-live="polite"`: tapping any word in the specimen rewrites it in place.

### Signature: The Word Popover

The in-reader counterpart, and the only place the plate inverts. Fixed to the bottom centre at `min(540px, 100% - 30px)`, Printer's Black ground, Clean Sheet text, 4px ochre top rule, ambient blur shadow, entering with a 16px rise. Icon buttons inside it go transparent with graphite borders and white glyphs.

### Board Tiles

An eight-column grid (six at 900px, three at 680px) of square serif tiles ruled one pixel apart. Resting is Paper Cream; hover and current are solid Classroom Ochre; **known** is solid Study Green with white text; **learning** is Pale Classroom Ochre with a `inset 0 0 0 3px` ochre rule. The three states are mutually exclusive, enforced in `store.js`: `setState` clears the others so `known` / `learning` / `new` can never disagree across screens.

### Named Rules

**The One-Focus-Language Rule.** Every focusable thing in the product takes the same 2px Vermilion outline at 2px offset, and anything that lifts on hover takes the identical lift on `:focus-visible`. Keyboard and mouse get the same physical feedback; no component invents its own focus style.

**The Two-Size Icon-Button Rule.** 38px standalone, 30px inline, 44/40px under a coarse pointer. If a new control seems to need a third size, it needs a different component.

**The Drawn-Mark Rule.** Iconography is drawn in-house on the 16px grid and emitted from `ICON_PATHS`. No emoji, no icon font, no third-party icon package, no `<img>` icons.

**The One-State-Per-Word Rule.** A word is `known`, `learning`, or `new`. Every surface reads that single state from the store; no screen keeps its own idea of a word's status.

## Do's and Don'ts

### Do:

- **Do** let Paper Cream and Printer's Black establish most of every screen, with saturated ink reserved for state.
- **Do** set every word of German in Iowan Old Style, tag it `lang="de"`, and give reading prose 1.8 line-height inside a 62ch measure.
- **Do** keep the ramp capped at 5.25rem and let rules, ink, and weight create hierarchy instead.
- **Do** pair every hard offset with a matching translate, and give `:focus-visible` the same lift the mouse gets.
- **Do** draw new icons on the 16px grid at 1.6 stroke with square caps and add them to `ICON_PATHS`.
- **Do** state unavailability in words — an ochre notice band plus disabled controls — rather than letting a control fail silently.
- **Do** grow tap targets on coarse pointers (44px / 40px) rather than shrinking dense controls.

### Don't:

- **Don't** use emoji, icon fonts, or third-party icon sets anywhere in the interface.
- **Don't** add a small uppercase eyebrow or kicker above a heading. The heading, the slug rule, or the ruled bar does that work.
- **Don't** introduce a third icon-button size, a third type family, or a fifth ink.
- **Don't** spend Vermilion on an ordinary state; it is identity, focus, and new-word ink only.
- **Don't** put a blurred shadow on anything that isn't fixed-position and floating over the whole page.
- **Don't** introduce gradients, glass, inflated radii, or a poster-scale numeral.
- **Don't** turn progress into badges, confetti, or cartoon reward; progress is a count, a rule, and a tile color.
- **Don't** let print-shop geometry cross the text column, and don't let it capture pointer events.
- **Don't** replace an inline confirmation with a native `confirm()` dialog.
