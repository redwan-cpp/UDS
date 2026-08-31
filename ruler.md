# RULER — ENGINEERING & DESIGN CONSTITUTION

**Uthan Design Studio**
**Status:** Binding. Read before any significant change.
**Last updated:** 2026-08-30

This document outranks convenience, habit and momentum. When a decision conflicts with
this file, this file wins or the file gets amended deliberately — it does not get quietly
ignored.

---

## 0. The three questions

Before any commit:

1. Would this survive being looked at by an architect?
2. Does every value in it come from the token layer?
3. If the CMS replaced all content tomorrow, would this still work untouched?

If any answer is no, it is not finished.

---

## 1. USE

### Markup
- Semantic HTML: `<header> <nav> <main> <section> <article> <aside> <footer> <figure> <figcaption> <time>`.
- One `<h1>` per page. Heading levels in order, never skipped for size — size is typography's job.
- Real `<a href>` for navigation. Real `<button>` for actions. Never the reverse.
- `<ul>`/`<ol>` for lists of things, including project and portfolio grids.
- `alt` that describes what the image contributes; `alt=""` when it is genuinely decorative.
- `<time datetime>` for every date.

### TypeScript
- `strict: true`. Explicit prop types on every component.
- Content types in `src/types/content.ts` are the contract; widen them deliberately, never inline.
- Discriminated unions over optional-flag soup.
- Named exports for components. One primary export per file.

### Styling
- Design tokens for every colour, size, space, radius, duration, easing and breakpoint.
- **If a component paints a surface colour, it declares that surface.** Any element
  carrying `bg-ink*` or `bg-paper*` also carries `surface-dark` / `surface-light`.
  Without it the element inherits the *ancestor's* accent, secondary and hairline
  tokens — which is how an ink-coloured block inside a light section ended up
  rendering olive text at 2.6:1.
- Tailwind utilities that resolve to those tokens.
- `clamp()` for fluid type between an explicit floor and ceiling.
- Logical properties (`margin-inline`, `padding-block`) so direction changes are survivable.
- Modern CSS — grid, subgrid, `:has()`, container queries — where it removes JavaScript.
- Semantic tokens are redeclared, never aliased. A custom property whose value
  contains `var()` is substituted **where it is declared**, not where it is used:
  defining `--color-accent: var(--accent)` at `:root` and overriding only
  `--accent` deeper in the tree changes nothing. `.surface-*` sets
  `--color-accent` itself.

### Components
- Four tiers, dependencies only ever pointing downward: primitives → domain → sections → routes.
- Only routes read `src/data/**`.
- Components receive typed props and render. They do not fetch, and they do not know where content came from.
- Every list component handles zero items without collapsing.

### Motion
- GSAP for sequenced and scroll-linked motion. CSS transitions for hover, focus and tap.
- Exactly one smooth-scroll engine: Lenis.
- Every animation has a stated reason in a comment or in `design.md`.
- Final state renders first; the animation subtracts from it and restores it.
- Armed (hidden) start states are applied by CSS under `html.js-motion` only, a
  class the boot script adds solely when JavaScript runs **and** reduced motion
  is off. No JavaScript, or reduced motion, means nothing is ever hidden.
- `MotionFailsafe` hands content back if an animation stalls on screen. This is
  the one place `!important` is permitted in the project, because a stalled tween
  keeps rewriting its own inline transform.
- `gsap.matchMedia()` with a `no-preference` condition around every timeline.
- Animate `transform` and `opacity`. Nothing else — including `clip-path`, which is a
  paint-level property and repaints the element every frame.
- Promote with `will-change` only while an element is moving, and clear it on completion.
- Scroll and pointer handlers write to the DOM inside a rAF throttle. They never call
  `setState`, which puts React's reconciler on the scroll path.
- A reveal that covers more than one paragraph, or a list mapped with `stagger`,
  gives every item its own scroll trigger. One trigger on a tall block finishes
  before the reader has scrolled far enough to see most of it — everything past
  the first screenful arrives already at full opacity, which is the actual
  mechanism behind content "popping in from nothing." `Prose` reveals each
  paragraph independently for exactly this reason (§ typography).
- A grid item never gets its cross-axis size from `stretch` (the CSS Grid
  default) when it shares a row with a sibling of different intrinsic height.
  Set `items-start` on the row, or `self-*` on the item — a fixed-aspect image
  cannot grow to fill a stretched cell, so the difference becomes a dead gap
  under whichever item is shorter, not a shared aligned edge.

### Accessibility
- Keyboard first: everything reachable, everything operable, focus always visible.
- Focus-visible ring in pistachio, offset, never `outline: none` without a stronger replacement.
- Focus trapped in the menu overlay, released and restored on close.
- Labels bound to fields. Errors bound with `aria-describedby`.
- Contrast verified numerically against §4, not judged by eye.
- `prefers-reduced-motion: reduce` → final state, instantly.

### Performance
- `next/image` with explicit dimensions from `MediaAsset`.
- `priority` on the hero only. Everything below the fold is lazy.
- Server components by default; `"use client"` only for genuine islands.
- Video: muted, `playsinline`, poster-backed, paused offscreen and when the document is hidden.
- Nothing animates while offscreen.

### SEO
- Descriptive slugs. Crawlable navigation. Real text in the HTML.
- Internal links between related content (project → related projects → portfolio).
- Structured data only where it describes visible content — from Phase 5.

---

## 2. AVOID

### Design
- Generic templates, and the hero → three-feature-cards → testimonial → CTA rhythm in particular.
- Generic SaaS and agency layouts.
- Excessive rounded cards. This studio's language is edges and rules, not pills.
- Everything-in-a-card. If a card is not doing structural work, it is noise.
- Gradient meshes, glassmorphism, ambient blobs, glow.
- More than one accent colour.
- Decoration standing in for hierarchy.
- Centre-aligned body copy at length.
- Emoji as iconography.
- Stock-photo language: handshakes, generic "team collaborating", tinted business imagery.

### Motion
- Animation for decoration alone.
- Motion that delays reading.
- Two systems animating one property.
- `transition: all`.
- `ease-in` on anything entering the interface.
- `scale(0)` origins and bouncy overshoot.
- Animating `width`, `height`, `top`, `left`, `margin` — layout properties.
- Animating `clip-path`, `filter`, `backdrop-filter` or `box-shadow` — paint properties.
- Polling on an interval for something an `IntersectionObserver` can observe.
- A permanent `will-change` on anything that is not permanently in motion.
- Parallax so strong it detaches an image from its caption.
- Cursor gimmicks with no meaning.
- Long artificial loading screens. If content is ready, show it.

### Code
- `any`. `@ts-ignore`. `as unknown as`.
- Content literals inside JSX.
- Hard-coded hex, px font sizes, or magic durations outside the token layer.
- Arbitrary Tailwind values (`w-[437px]`) where a token exists.
- Components over ~300 lines. Split them.
- Copy-pasted layouts that should have been one component.
- Components created for the sake of having components.
- Giant UI libraries pulled in for one primitive.
- Dead code, unused dependencies, commented-out blocks.
- Temporary hacks left to become architecture.

### Security & content
- Secrets in the repository or in any client bundle.
- Untrusted third-party scripts.
- Dead links. No `href="#"`, ever. An unsupplied destination renders as text with
  its state stated, not as a link that goes nowhere.
- External SVG pasted in without inspection — SVG can carry script.
- `dangerouslySetInnerHTML` on anything not authored in this repo.
- Invented facts about Uthan Design Studio: real-sounding project names, fabricated client
  logos, invented statistics, invented sustainability claims, invented awards.
- Copyrighted media without a licence.
- Demo content presented as real client work.

### Process
- Implementing future-phase infrastructure early.
- Skipping a phase because it "looks easy".
- Marking work complete without checking it at 320px and with the keyboard.

---

## 3. Dark patterns — prohibited outright

No fake scarcity. No fake urgency. No fake social proof. No invented testimonials. No
countdown timers. No hidden opt-outs. No pre-checked consent. No hard-to-find close
buttons. No misdirection in the contact flow. No email capture as an exit interstitial.

An architecture practice sells judgement. Manipulation is off-brand as well as wrong.

---

## 4. The colour contract

Verified with WCAG relative-luminance maths, not by eye. Re-run the check before adding any
pairing not listed here.

| Pairing | Ratio | Permitted use |
|---|---|---|
| Warm white on Architectural Black | 17.5 | Any text |
| Warm white on Soft Black | 16.7 | Any text |
| Secondary warm white on Architectural Black | 16.1 | Any text |
| **Pistachio on Architectural Black** | **12.3** | Any text, accents, focus ring |
| **Architectural Black on Pistachio** | **12.3** | Button labels on a pistachio fill |
| Architectural Black on Warm white | 17.5 | Any text |
| Muted gray on Architectural Black | 5.7 | Body and metadata text |
| Deep gray on Warm white | 4.5 | Body and metadata text — at the floor, do not lighten |
| Muted gray on Warm white | 3.1 | **UI only.** Never body text |
| **Pistachio on Warm white** | **1.4** | **PROHIBITED for text or icons.** Fill only, with black on top |
| Hairline on Architectural Black | 1.4 | Decorative rules only. Never a state-carrying border |

**The two rules that get broken most often:**
1. Pistachio is a dark-surface colour. On warm white it may only be a *fill* carrying black
   content — never text, never an icon, never a thin line that means something.
2. Muted gray flips role by surface: body text on black, decoration only on warm white. On
   light surfaces, metadata uses deep gray.

Any new pairing is a flag, not a free choice: reuse a legal pairing, or re-run the matrix
and amend this table before shipping it.

---

## 5. Dependency policy

Five runtime dependencies: `next`, `react`, `react-dom`, `gsap`, `lenis`.

A sixth requires a written answer to: what does it do that we cannot? what does it cost in
kilobytes? is it maintained? what is the removal path? Absent those answers, the answer is no.

---

## 6. Definition of done

- [ ] Builds clean. Lints clean. Typechecks clean.
- [ ] No literal design value outside the token layer.
- [ ] No content literal outside the data layer.
- [ ] Checked at 320, 768, 1280 and 1920 at minimum.
- [ ] Traversed with the keyboard alone; focus visible throughout.
- [ ] Checked with `prefers-reduced-motion: reduce`.
- [ ] Every image has an intentional `alt`.
- [ ] Every new colour pairing appears in §4.
- [ ] Every element that paints a surface declares one.
- [ ] `node scripts/audit.js` in the browser reports zero HIGH findings.
- [ ] No `href="#"` anywhere.
- [ ] Nothing in it reads as a template.
