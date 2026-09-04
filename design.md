# DESIGN SYSTEM — UTHAN DESIGN STUDIO

**Status:** Living document. Evolves with the design.
**Last updated:** 2026-08-30
**Current phase:** PHASE 1 — UI/UX

Every value in this document exists as a token in `src/app/globals.css`. That file is the
implementation; this file is the reasoning. If they disagree, one of them is a bug.

---

## 1. Brand direction

### The idea

**"Space described in sequence."**

An architecture studio is not judged by how much it says. It is judged by how it handles
edge, interval, material and light. The site is built as a sequence of framed views —
each section a held composition, the scroll acting as the walk between them. The interface
is a frame; the work is the subject. Nothing decorative competes with the photography.

Three commitments follow from this and are not negotiable at component level:

1. **The rule, not the box.** Structure is expressed with hairlines, alignment and
   interval — not with cards, shadows and rounded containers. Radius is `0` by default.
2. **Typographic hierarchy, not decorative hierarchy.** Scale, weight, tracking and
   position carry the levels. Colour is not a hierarchy tool here.
3. **Asymmetry with a reason.** Off-centre placement is used to create tension against the
   grid and to leave real negative space — never as arbitrary displacement.

### Feel

Minimal · architectural · editorial · cinematic · sophisticated · calm · premium · timeless.

### Anti-brief

Not corporate. Not an agency template. Not SaaS. No gradient meshes, no ambient blobs, no
rounded card grids, no emoji, no stock handshake photography, no second accent colour.

Two items originally on this list — **glass** and **glow** — were reversed at the studio's
explicit request; see the Brand decisions note on `.uds-glass` and the Motion decisions
note on `NeonMark` in `memory.md`. Both survive here as a record of the default, not as a
live rule: the header, the site index and the loading/transition screens use them
deliberately, and nothing else should reach for either without the same kind of ask behind
it.

---

## 2. Colour

### Tokens

| Token | Hex | Role |
|---|---|---|
| `--color-ink` | `#0A0A0A` | Architectural Black. Primary dark surface |
| `--color-ink-soft` | `#111111` | Soft Black. Secondary dark surface |
| `--color-ink-raised` | `#171716` | Raised dark surface (menu overlay, hovered rows) |
| `--color-paper` | `#F3F1E8` | Warm Architectural White. Primary light surface |
| `--color-paper-dim` | `#EAE8DE` | Secondary Warm White. Recessed light surface |
| `--color-pistachio` | `#B7D77A` | Accent **for dark surfaces** |
| `--color-olive` | `#4E5D2A` | Accent **for light surfaces** — the same hue, darkened until legal |
| `--color-mute` | `#8A8A82` | Muted Gray. Secondary text **on dark** |
| `--color-mute-deep` | `#6E6E68` | Secondary text **on light** |
| `--color-line` | `#2A2A28` | Hairline on dark |
| `--color-line-light` | `#D3D0C2` | Hairline on light |

### The contract

Verified with WCAG relative luminance. These are measurements, not estimates.

| Pairing | Ratio | Verdict |
|---|---|---|
| paper on ink | 17.5 | Text ✓ |
| paper on ink-soft | 16.7 | Text ✓ |
| paper-dim on ink | 16.1 | Text ✓ |
| ink on paper | 17.5 | Text ✓ |
| **pistachio on ink** | **12.3** | Text ✓ · focus ring ✓ |
| **ink on pistachio** | **12.3** | Button label on pistachio fill ✓ |
| pistachio on ink-raised | 11.1 | Text ✓ |
| **olive on paper** | **6.4** | Text ✓ |
| olive on paper-dim | 5.9 | Text ✓ |
| **paper on olive** | **6.4** | Button label on olive fill ✓ |
| mute on ink | 5.7 | Body & metadata text ✓ |
| mute-deep on paper | 4.5 | Body & metadata text ✓ — at the floor, never lighten |
| mute on paper | 3.1 | **UI only.** Never text |
| **pistachio on paper** | **1.4** | **PROHIBITED.** Never text, never an icon, never a meaningful line |
| **ink on olive** | **2.8** | **PROHIBITED.** An olive fill takes paper, not ink |
| line on ink | 1.4 | Decorative rules only |
| line-light on paper | 1.4 | Decorative rules only |

**The rule underneath the table:** the accent flips with the surface. Dark surface →
pistachio. Light surface → olive. A designer reaching for pistachio on warm white has
picked the wrong token, not a lighter shade.

Any pairing not in this table must be measured and added before it ships.

### Distribution

Roughly 70% ink surfaces, 25% paper surfaces, 5% accent. The accent appears at most twice
per viewport. Its job is to mark the single most important thing in view — a primary action,
an active state, a focus ring, a live counter — not to decorate.

Surfaces alternate deliberately down the homepage so the scroll has light and dark beats
rather than one continuous tone.

---

## 3. Typography

### Families

| Family | Role | Why |
|---|---|---|
| **Barlow** | Display, headings, navigation, UI, metadata | A low-contrast grotesque with a tall x-height and tight, even spacing. Set at display scale it reads structural rather than neutral, and it holds its shape at metadata size where a softer grotesque blurs |
| **Newsreader** (variable: optical size + weight, with italics) | Editorial statements, pull quotes, project narrative | A publication serif with a genuine optical-size axis, so it holds at 14px and at 48px without looking like the same drawing scaled |

Two families. Self-hosted through `next/font` — no external request, no FOUT, and a strict
CSP stays achievable in a later phase. No third family is permitted; metadata is set in
Barlow, uppercase and tracked, not in a mono.

### Scale

Fluid via `clamp()` between an explicit floor and ceiling — the type does not step at
breakpoints, it breathes between them.

| Token | Size | Family | Tracking | Leading | Use |
|---|---|---|---|---|---|
| `--text-display` | `clamp(2.75rem, 8.2vw, 8.5rem)` | Barlow, 500 | `-0.04em` | `0.86` | Hero wordmark only |
| `--text-h1` | `clamp(2.25rem, 6vw, 5.25rem)` | Barlow, 500 | `-0.035em` | `0.92` | Page titles, project titles |
| `--text-h2` | `clamp(1.75rem, 3.6vw, 3.25rem)` | Barlow, 500 | `-0.03em` | `1.0` | Section titles |
| `--text-h3` | `clamp(1.375rem, 2vw, 1.8125rem)` | Barlow, 500 | `-0.02em` | `1.15` | Sub-sections, card titles |
| `--text-statement` | `clamp(1.375rem, 2.9vw, 2.5rem)` | Newsreader, 300 | `-0.015em` | `1.3` | Editorial statements, pull quotes |
| `--text-lead` | `clamp(1.125rem, 1.4vw, 1.375rem)` | Newsreader, 400 | `0` | `1.6` | Introductory paragraphs |
| `--text-body` | `1.0625rem` | Barlow, 400 | `0` | `1.65` | Interface body copy |
| `--text-body-serif` | `1.125rem` | Newsreader, 400 | `0` | `1.7` | Long-form project narrative |
| `--text-small` | `0.9375rem` | Barlow, 400 | `0` | `1.55` | Secondary copy |
| `--text-caption` | `0.875rem` | Barlow, 400 | `0.005em` | `1.5` | Image captions, credits |
| `--text-meta` | `0.75rem` | Barlow, 500 | `0.13em`, uppercase | `1.4` | Eyebrows, indices, labels, years |
| `--text-nav` | `0.875rem` | Barlow, 500 | `0.02em` | `1` | Navigation |

The reading end of this scale was raised one step in September 2026 — body 16→17px, small
14→15px, caption 13→14px, meta 11→12px, nav 13→14px, h3's floor 20→22px. The studio's
clients skew older, and 11px tracked uppercase is the point where a style decision becomes
a barrier. Display, h1 and h2 are deliberately untouched: they were never the legibility
problem, and growing them would have cost every composition its proportion for nothing.
The hierarchy compresses slightly as a result, which is the correct trade rather than a
casualty of one. The `ch` measure caps below scale with the type, so line lengths are
unchanged.

### Rules

- Display is used **once per page**, and only in a hero.
- Measure is capped at **68 characters** for Barlow body and **72** for Newsreader.
- Negative tracking scales with size; small text is never tracked negative.
- Metadata is the only uppercase style. Headings are never all-caps.
- Numerals are tabular in counters, statistics and tables; proportional elsewhere.
- Never two serif blocks adjacent — the serif marks a change of register, and loses that
  job if it becomes the default.
- Hyphenation off on display and headings; on for justified narrative columns.

---

## 4. Grid, spacing and containers

### Grid

12 columns. Fluid gutter `clamp(1rem, 1.6vw, 1.75rem)`. Below `768px` the grid collapses to
4 columns and layouts are re-authored rather than reflowed.

The grid is visible in the design's logic even when not drawn: headings, rules and image
edges land on column lines. Editorial sections deliberately break one element out of the
grid per section — never more than one, or the break stops meaning anything.

**Rows never stretch a shorter item to match a taller one.** CSS Grid's default cross-axis
alignment is `stretch`: two column-span items auto-placed into the same row both get
stretched to the row's full height, which is set by the taller one. A block of text stretches
invisibly (nothing to see), but a fixed-aspect image cannot grow past its own aspect ratio —
it sits at its natural height inside the taller box, and the difference becomes bare ground
beneath it. Every row that pairs a media item with a text item of different natural height
sets `items-start` on the row (or `self-*` on the item), so each column keeps its own height
and the row's total height is simply the tallest of them — no gap, because nothing was ever
asked to grow into space it couldn't fill. This produced two real defects before it became a
rule: the About section's photo column, and the project gallery's landscape/portrait pairing.

### Containers

| Token | Width | Use |
|---|---|---|
| `--container-full` | `100%` | Full-bleed media, hero |
| `--container-wide` | `1680px` | Default page container |
| `--container-text` | `760px` | Long-form narrative |
| `--container-narrow` | `560px` | Forms, single-column flows |

Page gutter: `clamp(1.25rem, 4vw, 4.5rem)`.

### Spacing scale

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160 · 192 · 256` (px).

Rules that actually get broken, so they are written down:

- **Internal spacing ≤ external spacing.** An element's own padding never exceeds the gap
  between it and its neighbour. Violating this is what makes a layout read as cramped and
  empty simultaneously.
- **Section padding is weighted by role, not uniform.** Pivotal sections (hero, featured
  projects, closing CTA) take `128–192px` block padding at desktop. Connective sections take
  `80–96px`. Applying one value everywhere is what makes a page read as "nothing gets its
  own moment".
- Mobile section padding: `64–96px`. Not the desktop value, not half of it — chosen.

### Radius, borders, shadows

- **Radius: `0`.** The single exception is `2px` on form controls, so a focus ring reads as
  belonging to the field. Rounded cards are outside the language.
- **Borders: `1px` hairlines only**, in `--color-line` / `--color-line-light`. Structure comes
  from the rule, not from the container.
- **Shadows: none.** Depth is created with surface tone changes and overlap, not elevation.
  There is no `--shadow-*` token, deliberately, so one cannot be reached for absent-mindedly.

---

## 5. Components

### Buttons

Three variants only.

| Variant | Dark surface | Light surface |
|---|---|---|
| **Primary** | Pistachio fill, ink label | Olive fill, paper label |
| **Secondary** | Transparent, paper label, hairline border | Transparent, ink label, hairline border |
| **Quiet** | Text with an underline that draws on hover | Same |

Geometry: `0` radius, `14px 28px` padding, `--text-meta` styling, minimum target `44 × 44px`.
Hover moves the fill or the underline, never the button's position. Active state darkens by
tone, no depression effect.

### Links

Inline links carry a 1px underline offset `0.2em`, in `currentColor` at 40% opacity, going
to full opacity on hover over `--dur-fast`. Navigation and index links use a rule that wipes
in from the left via `scaleX` on a `transform-origin: left` pseudo-element. External links
are marked in text, not with an icon.

### Navigation

**Desktop.** Fixed header, transparent over the hero, gaining an ink backdrop and a bottom
hairline after `80px` of scroll. Wordmark left, index right, menu trigger far right. Hides
on scroll-down past `400px`, returns on scroll-up.

**Menu overlay.** Full-viewport ink panel entering as a `clip-path` wipe from the top edge
over `--dur-cinematic`. Primary routes set at `--text-h2`, numbered `01–09`, staggered in at
`40ms` intervals. Hovering an item reveals its paired image in the right half at desktop.
Focus is trapped, `Esc` closes, focus returns to the trigger, background scroll is locked.

**Mobile.** Wordmark and menu trigger only. The overlay is a full-screen stack; no hover
imagery; targets at `56px`.

### Forms

Bottom-rule fields — no boxes. Label sits above in `--text-meta`, field text at
`--text-body`. Rule is `--color-line`, becoming pistachio/olive on focus with a `2px` offset
focus ring. Errors are text below the field in a colour that meets 4.5:1, bound with
`aria-describedby`, and never carried by colour alone. Required state is stated in the
label, never with a bare asterisk.

### Missing media

An absent image is a designed state, not a gap. A ruled ink field at the same proportion
the photograph will occupy, carrying its index and what is missing, set in `--text-meta`.
Used for team portraits today, and it is the honest production state for any record whose
media has not been supplied yet.

### Image treatments

- Ratios are chosen per role: `3:4` portrait for team and vertical architecture, `4:5` for
  portfolio, `16:9` for landscape project heroes, `2:1` for full-bleed bands.
- Crops are deliberate and stated in the data layer. Faces and structural lines are not
  cropped by accident.
- Duotone, heavy filters and colour overlays are **not** used. Architecture photography is
  the content; treating it is editing someone else's work. **One exception, at the studio's
  request: index and grid thumbnails.** A project card sits desaturated and returns to full
  colour under the pointer — a grid of competing thumbnails reads as one field with a
  consistent tone, and the card being considered is the one that comes back. It applies to
  `WorkCard` and the project index only. A full-bleed plate, a case study's own gallery, the
  hero and every product image are never treated, so the photograph is never *shown* to a
  visitor in an edited state — only held back in a contact-sheet register until chosen.
  Gated behind a fine pointer: with no hover there is nothing to restore the colour, so a
  phone gets the photography as shot.
- A `4%` ink scrim sits under text laid over images, plus a gradient only where legibility
  actually requires it.
- Every image has an intentional `alt`; decorative images take `alt=""`.
- **Rough work is not enlargeable, and is guarded against casual saving.** The concept
  sketches and working drawings in a case study are the studio's unpublished thinking, not
  the finished plates the page is offering to be studied — so that strip has no viewer, no
  context menu, no drag-off and no selection, and its images are out of hit-testing so a
  right-click has no image to offer. This is deterrence at the level of the three gestures
  someone reaches for without thinking. It does not stop a screenshot, devtools or a direct
  request for the file URL, and nothing rendered in a browser does; if a drawing genuinely
  must not leave the studio, the answer is a smaller derivative or not publishing it.

### Background motifs

One. `TerraceMotif` — a stepped-terrace silhouette, filled, behind the homepage figures
band on ink; geometry sourced from haikei.app's Layered Steps generator and recoloured
through this project's own tokens.

A drawn counterpart on the light bands (`SectionSketch`) was built and then removed at the
studio's request. Recorded because the reasoning still holds if it ever comes back: an
architectural line drawing carries a specific building, so it has to be authored rather
than sourced, and a motif spread across every section stops being restraint and becomes
wallpaper.

### The lockup

The studio's supplied artwork (`public/brand/uthan-lockup.svg`) is the closing mark of every
page, set large in the footer. It is used as artwork, not reconstructed: the footer
previously set the mark beside the name in Barlow, which quietly overruled the spacing and
the letterforms the studio had already decided. Served as a file rather than inlined — 29
paths on every page for a mark that caches once — from an ink-ground derivative, since the
supplied file is drawn for a light page and the footer is always ink.

**The header carries no mark**, only the name set in Barlow. The mark appearing small in a
fixed header on top of the same mark at scale in the footer meant it read twice on every
page; the header's job is to hold the name and get out of the way of the work behind it.

### Cards — used sparingly, and only where they earn it

A card is permitted only where the content is genuinely a discrete, repeated, linked object:
portfolio items, news items, team members. It is a **hairline-and-interval** card: no
background fill, no shadow, no radius, `1px` top rule, content aligned to the grid. Hover
raises the image scale to `1.03` and shifts the title, nothing else.

**Team cards expand in place** rather than linking to a separate page — the studio's whole
team is five people, not a section worth its own route. Clicking a card morphs it, via GSAP
`Flip`, into a larger detail view showing the same element (not a duplicate) at a bigger size
and a fixed, centred position; a second click, `Esc`, or the backdrop returns it to its grid
slot. See the Flip note under Motion decisions in `memory.md` for why `Flip` and not Framer
Motion's `layoutId`.

Everything else — expertise, statistics, sustainability principles — is composed as an
**index**: numbered rows separated by hairlines, which is how architecture publications
actually present sets.

**Products are cards that link to their own page.** The listing carries the image, the name
and one line; the materials, applications and specification live on `/products/[slug]`.
Stacking every product's spec sheet under the grid made the index a document to scroll past
rather than a set to choose from.

### Category filters

One component (`CategoryFilter`) serves the project index and the product index. It is a row
of real links — a filtered view is linkable, crawlable and ships no JavaScript — and the
active state is carried by weight, a drawn rule and `aria-current`, never by colour alone.

The row **scrolls sideways; it does not wrap**. A wrapping filter set is fine at six
categories and quietly stops working at sixteen: it grows downward and pushes the results it
is filtering off the screen. The scrollbar is kept and themed rather than hidden — a row that
scrolls with no sign that it scrolls is a row whose right-hand half nobody finds — in the
secondary tone, not the accent, because it sits directly beneath a drawn accent rule and two
accent marks that close together read as one mistake. The fade is on the right edge only: at
rest the row is at scroll 0, so a left fade would dim the active filter to hint at content
that isn't there.

### The hero's service lines

The four service lines on the hero's baseline rule are links, each to the work that shows
it — Interior to its category filter, Exterior to the project index, Products to the product
index, Consultancy to the areas-of-work list. The destinations live in `studio.services`,
because which work stands for which service is a content decision, not a layout one. They
are set as index links, not buttons: the rule wipes in from the left on hover, the gesture
the nav and the project index already use.

### The image viewer

Gallery plates and slideshow frames open a viewer (`Lightbox`): a glass panel over the page,
the whole photograph fitted rather than cropped, arrows and Left/Right to step, `Esc` to
close, focus trapped and returned, and the credit travelling with the image because several
plates are CC BY where attribution is a licence term. The enter animation is a keyframe, not
a transition, and there is deliberately no exit animation — an exit needs a state machine
that can strand the overlay on screen, which is a far worse failure than an instant close.

---

## 6. Motion

### Principles

1. **Motion describes space.** Reveals behave like a view being uncovered — transform
   masks and counter-moving layers — not like objects flying in. (Not literal `clip-path`
   wipes: see "Everything composites" below for why.)
2. **The page reads before the motion ends.** Text is present and legible at animation
   start; the animation resolves position, not existence.
3. **One system per property.** GSAP owns scroll-linked and sequenced motion. CSS owns
   hover, focus and tap. They never touch the same property.
4. **Restraint scales with frequency.** A once-per-visit hero sequence may take 1.2s. A
   hover state has 160ms.
5. **Every animation has a reason**, recorded here or in a comment.
6. **A trigger belongs to the thing that animates, not to the group around it.** A
   multi-paragraph reveal or a stagger-mapped list gives each item its own scroll
   trigger. One trigger for a tall block completes long before the reader has
   scrolled far enough to see most of it — that mismatch is what content "popping
   in already-formed" actually is. See `Prose` and `Reveal`'s `stagger` prop.

### Tokens

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | `160ms` | Hover, focus, tap |
| `--dur-base` | `240ms` | State changes, filter transitions, image hover |
| `--dur-slow` | `400ms` | Menu items, panel entries |
| `--dur-cinematic` | `550ms` | Menu overlay, page transitions |
| `--dur-reveal` | `900ms` | Hero and image reveals |
| `--ease-out-soft` | `cubic-bezier(0.23, 1, 0.32, 1)` | Default for anything entering |
| `--ease-in-out-soft` | `cubic-bezier(0.77, 0, 0.175, 1)` | Anything that leaves and returns |
| `--ease-architectural` | `cubic-bezier(0.16, 1, 0.3, 1)` | Long reveals — a hard decelerate that settles rather than eases |

Interface motion stays under ~300ms. The overlay and page transition sit at 550ms and the
scroll reveals at 900ms because those are once-per-visit cinematic beats, not interface
feedback — the distinction the duration tiers exist to draw. Built-in CSS easings are too
weak to read as deliberate, so the tokens above are the canonical strong curves.
`ease-in` is never used on an entrance: it delays the exact moment the eye is on.

`ease-in` is never used on an entrance. Nothing overshoots.

### The vocabulary

| Pattern | Behaviour | Reason |
|---|---|---|
| **Curtain reveal** | A frame at `+120%` and its content at `−20%` inside it, both resolving to `0` | An image uncovered by an opening frame, the photograph lagging behind it |
| **Counter-scale** | Image starts at `1.06` inside its mask and settles to `1.0` as the mask opens | The photograph appears held, not pushed |
| **Word stagger** | Headings enter word by word, `y: 0.5em` → `0`, `50ms` apart | Reading rhythm; also renders as complete text without JS |
| **Rule draw** | Hairlines scale from `0` to `1` on the X axis from the left | Structure being drawn, matching the brand idea |
| **Counter** | Numerals count once on entry, tabular so the layout never shifts | The number is the content |
| **Parallax** | Max `8%` differential on background media only | Depth without detaching an image from its caption |
| **Menu wipe** | `clip-path` from the top edge, items staggered `40ms` | The overlay arrives as a surface, not a fade |
| **Page transition** | Ink panel wipes across, route swaps behind it, wipes out | Continuity between framed views |

### Loading experience

Runs **once per session**, and never delays content that is already ready.

```
UTHAN wordmark, letters revealed by an ascending mask   (0 → 500ms)
Two hairlines draw horizontally to full width           (300 → 800ms)
A single pistachio rule crosses the intersection        (700 → 1000ms)
Whole panel lifts on a clip-path wipe, hero underneath  (1000 → 1600ms)
```

Hard rules: it is skippable by any key or click; it never exceeds `1.6s`; if fonts and the
hero poster are ready sooner it shortens rather than waiting; it is `aria-hidden` with an
`aria-busy` region announcing completion; and under `prefers-reduced-motion` it does not run
at all — the page renders directly.

### Hover states

Desktop pointer only, gated behind `@media (hover: hover) and (pointer: fine)`.
Project rows: title shifts `8px` right, paired image fades in, hairline draws.
Images: `scale(1.03)` over `--dur-base`.
Buttons: fill tone shift only.
No cursor followers, no magnetic buttons, no tilt.

### Everything composites

Every animation in the project moves `transform` or `opacity` and nothing else. That is a
performance constraint, but it is also why the motion reads as calm: properties that force
layout or paint drop frames under load, and a reveal that stutters looks cheap however well
it is timed.

Two consequences worth recording, because both were originally built the other way:

- **The curtain is a transform mask, not a `clip-path`.** `clip-path` is a paint-level
  property; animating it on full-bleed photography repaints a viewport-sized image every
  frame. The frame starts at `+120%` and the content at `−20%` inside it, so the pair nets
  to a full 100% offset — entirely outside the clip window — and resolves to `0`. The 20%
  difference is what reads as depth. The offsets must not be equal and opposite: that
  cancels out and leaves the content sitting in its final position with nothing to reveal.
- **The header is driven by data attributes, not React state.** Styling it from `useState`
  re-entered React's reconciler on every scroll event.

Layers are promoted with `will-change` only while something is actually moving, and handed
back on completion. A permanent promotion on every image in a grid costs memory for a state
most of them never enter.

### The failsafe

Every armed (hidden) start state is applied by CSS under `html.js-motion`, a class the boot
script adds only when JavaScript runs *and* reduced motion is off. That covers the two
predictable failures. `MotionFailsafe` covers the unpredictable ones: it watches for
elements that are armed, on screen, and still unrevealed after four seconds — a script
error, a dead ticker, a tab throttled so hard a tween stalls — and hands the content back.

It is the only place `!important` appears in the project, because a stalled tween keeps
rewriting its own inline transform on every tick it does get, and an inline style outranks
any normal rule. A last-resort override is exactly what `!important` is for.

### Word masks

Heading reveals clip each word in an `overflow: hidden` mask. The mask must be taller than
the glyph or a tight display leading slices the descenders, so the inner span carries its
own `line-height: 1.14` and the mask takes a `-0.12em` block margin to give that height
back to the line box. Without the compensation the heading's leading loosens; without the
line-height the descenders are cut.

### Loading and empty states

Media reserves its aspect ratio before loading, so nothing shifts. There are no skeleton
shimmers — an ink block at the correct ratio, resolving to the image, is quieter and
matches the language. Empty states are a single line of `--text-meta` on a hairline rule.

That resolve is now a deliberate cross-fade, not a hard cut. A scroll-triggered reveal and
a lazy image's network fetch are unrelated clocks; without decoupling them, an image can
pop into an already-open, already-settled frame well after its surrounding text has
finished animating in. `Media` fades a non-priority `<img>` in on its own `load` (armed
under `.js-motion` like every other hidden start state, so it can never hide content with
no JS), and gives up waiting after 4s on the same guarantee `MotionFailsafe` makes for the
reveal system — see `memory.md`'s Motion decisions.

### Reduced motion

Under `prefers-reduced-motion: reduce`: Lenis is not constructed, ScrollTrigger timelines
are not created, the loading sequence does not run, parallax is off, and every reveal
renders in its final state immediately. Opacity-only transitions under `--dur-fast` remain,
because they carry state feedback rather than movement. The result is a complete, calm,
fully usable site — not a faster version of the animated one.

---

## 7. Responsive behaviour

| Width | Behaviour |
|---|---|
| `320–479` | Single column. Display type at its floor. Menu is a full-screen stack. Project index becomes stacked image-over-title blocks. Section padding `64px`. |
| `480–767` | Single column, larger media, `80px` padding. |
| `768–1023` | 8-column grid. Portfolio at 2 up. Team at 2 up. Header shows the index. |
| `1024–1279` | Full 12-column grid. Portfolio 3 up. Menu overlay gains hover imagery. |
| `1280–1439` | Design baseline. All compositions at intended proportion. |
| `1440–1919` | Container caps at `1680px`; gutters grow. |
| `1920+` | Container stays capped; the page centres in generous margin. Display type does not keep growing. |

**Authored, not derived.** Three compositions are separately designed for mobile rather than
reflowed: the expertise index (rows become a stacked accordion of numbered entries), the
project detail gallery (a horizontal snap-scroll strip instead of a masonry field), and the
homepage hero (typography re-set for portrait, not scaled down).

Touch targets are `44px` minimum, `56px` in the mobile menu. No interaction depends on
hover; every hover behaviour has a tap or focus equivalent.

---

## 8. Accessibility

- Landmarks on every page; a skip link to `#main` as the first focusable element.
- Focus ring: `2px` pistachio on dark / olive on light, `3px` offset, never removed.
- Focus trapped in the menu overlay and released on close, with focus restored to the trigger.
- The contact flow announces step changes via a polite live region and moves focus to the
  new step heading.
- The portfolio filter is a real radio group, keyboard operable, with the result count
  announced politely.
- Counters expose their final value to assistive technology immediately, not the animated
  intermediate values.
- Decorative split-text fragments are `aria-hidden`; the accessible name is the unsplit string.
- Colour is never the only signal for state — filters carry a rule and a weight change, not
  just a tint.
- Verified by keyboard traversal and with `prefers-reduced-motion` on, every phase.

---

## 9. Open design decisions

Recorded here so they are not silently defaulted:

- **Wordmark.** The studio's drawn mark (three stacked plates) set beside the name in Barlow. Source vectors in `public/brand/`; rendered through `UthanMark`, which recolours them to `currentColor` so one component serves every surface.
- **Photography direction.** Phase 1 uses labelled demo imagery. Real art direction — lens,
  time of day, whether people appear in the frames — is set with the studio.
- **Demo library size.** The demo library is 26 assets after curation: 16 photographs and
  10 architectural drawings, hand-picked on a contact sheet from 74 downloaded. It is not
  enough to give every slot a distinct frame, so the strongest images are assigned to the
  most prominent positions (`src/data/media.curation.ts`) and controlled repetition is
  accepted further down. Real photography resolves this; no design change is required.
- **Expertise categories.** The nine listed are placeholders and must be confirmed.
- **Statistics.** Placeholder values, CMS-driven later.
- **Sustainability claims.** Placeholder until the studio supplies verified practice.
- **Page transition scope.** Currently a wipe on primary routes only; whether project
  detail pages get a shared-element transition is open.
