# PROJECT MEMORY — UTHAN DESIGN STUDIO

```
CURRENT PHASE:
PHASE 1 — UI/UX
```

Durable decisions only. Not a log, not a changelog. If a line here stops being true, change
it deliberately and say why — reversing something in this file is a decision, not a tweak.

---

## Client

- **Uthan Design Studio** — architecture and design practice.
- **Every business fact is unsupplied.** Legal name, address, founding year, principals, team,
  regions, real projects, real statistics, real clients, real sustainability practice: all
  `PLACEHOLDER`. Nothing about the studio may be invented to fill a layout.
- Products arm confirmed in brief: **Custom Doors**, **Fabricated Sheet Work**.
- Homepage section order is client-specified. **Revised by the studio:** Hero → About →
  Numbers (+ collaborator marquee) → Expertise → Major Projects → Latest News → Closing CTA
  → Footer. The Management Team band was removed from the homepage and now lives only on
  About (`/about`), which already carried a fuller version — the homepage was showing a
  truncated second copy. The collaborator names survive on the homepage as the marquee
  under the figures.
- **The practice page is `/about`, not `/studio`.** Renamed at the studio's request — route,
  nav label target, search index, and every internal link moved together in one pass; a
  permanent redirect from `/studio` (`next.config.ts`) covers anything still pointing at the
  old path. Its own **Collaborators section is gone**, not just relabelled: `BrandIndex` is
  no longer rendered anywhere, which leaves it and `BrandsSection`/`brands.ts` fully
  orphaned — flagged as a follow-up rather than deleted in the same pass that removed their
  only remaining caller. The figures band on this page is now the *same* `Numbers` component
  the homepage uses (hover rule-draw, accent lift on the numeral) instead of a second,
  static `<dl>` — two places showing the same numbers two different ways read as an
  inconsistency, not a variation worth keeping.
- **A `/impeccable critique` design review** (dual-agent: an unanchored design-director
  pass plus the skill's own detector/browser-injection pass) scored the homepage 25/32 on
  Nielsen's heuristics — snapshot at `.impeccable/critique/2026-09-03T16-02-35Z__src-app-page-tsx.md`.
  Confirmed the site reads as authored for an architecture practice rather than a generic
  template (`ProjectSymbol`'s real section-mark convention, the CAD crosshair cursor, and
  the "index"/"figures" vocabulary were named as the specific evidence for that verdict),
  and surfaced three real defects, now fixed:
  - **No closing CTA.** The homepage's persuasive arc ran Projects → News → Footer, so a
    convinced visitor had nowhere to act on it — the footer treats "Contact" as one of four
    equal-weight columns under a display-scale "Uthan" wordmark, not an invitation. Fixed
    with `ClosingCTA.tsx`, index `08`, the last section before the footer: a serif statement
    (`studio.closing`) plus a primary "Start a conversation" button to `/contact`. Composed
    like `AboutStatement` — numbered index, eyebrow, hairline rule, left-aligned column —
    deliberately not centred: this site's rule is asymmetry with a reason, and a CTA is not
    an exception to it.
  - **The menu overlay's hover-image had never once fired.** design.md documents "hovering
    an item reveals its paired image in the right half at desktop" as a flagship
    interaction, but no `NavItem` in `navigation.ts` set `image`, so the preview panel was a
    permanently empty `bg-ink` box on every route. Fixed by giving each of the six nav items
    an `image` drawn from the same curated set its destination page already uses (`about`,
    `project`, `product`, `sustain`, `news`, `urban` for Contact) via the existing `img()`
    accessor — no new media, no literal path, same provenance discipline as everywhere else
    in `src/data`.
  - **Two P3 polish items**: the footer's demo-build disclaimer had no `max-w`, rendering at
    ~179 characters per line — capped at `max-w-[68ch]`, the project's own documented Barlow
    body-copy measure. And on mobile, `ExpertiseIndex`'s nine rows (each carrying its own
    inline image, since there's no room for the desktop sticky companion) sat entirely ahead
    of the homepage's first project photograph — the strongest persuasive asset on the page.
    Capped the mobile list at 4 rows behind a "Show all 9 areas" toggle
    (`MOBILE_PREVIEW_COUNT` in `ExpertiseIndex.tsx`); all nine stay in the DOM and reachable,
    just not the reason a fast-scrolling visitor bounces before reaching any actual work.

---

## Brand decisions

- Visual thesis: **"Space described in sequence."** The interface is a frame; the work is the
  subject; the scroll is the walk between framed views.
- Palette is black + pistachio + warm architectural white, as briefed.
- **The accent flips with the surface.** Pistachio `#B7D77A` on dark; Olive `#4E5D2A` on
  light. Pistachio measures 1.4:1 on warm white and is therefore *prohibited* as text, icon
  or meaningful line on light surfaces. This is the single most-broken rule in the palette.
- **The studio's mark is three stacked plates**, supplied as vector by the studio and kept
  verbatim in `public/brand/` as the source of truth. It is rendered through `UthanMark`,
  which makes exactly two changes to the supplied file, both about theming: the plates take
  `currentColor` instead of the supplied `rgb(22,31,33)`, and the two connector slivers take
  `currentColor` at 45% instead of a fixed grey. That grey is not decoration — it is what
  makes the plates read as overlapping rather than as three loose shapes — so it is kept as
  a *ratio* between two tones, which survives at any colour, rather than as a fixed value
  that breaks the moment the mark sits on paper instead of ink. One component therefore
  serves the light and the dark lockup, and they cannot drift apart.
- **Radius is `0`.** One exception: `2px` on form controls. Rounded cards are out of language.
- **No shadow tokens exist**, deliberately. Depth comes from surface tone and overlap.
- One accent only. No second accent colour will be introduced.
- Structure is expressed with hairlines and interval, not with containers.
- **A component that paints a surface colour declares that surface.** The accent flip is
  inherited through the DOM, not from what is visually behind an element, so an ink block
  inside a light section needs `surface-dark` or it renders olive-on-ink at 2.6:1.
- `.surface-*` redeclares `--color-accent` / `--color-secondary` / `--color-hairline`
  **directly**. Aliasing through an intermediate variable does not work: a custom property
  containing `var()` is substituted where it is declared, not where it is used. This shipped
  pistachio onto warm white before it was caught.

---

## Typography decisions

- Two families, no more: **Barlow** for display, headings, UI and
  metadata; **Newsreader** (variable optical size) for editorial statements and long-form.
- Self-hosted via `next/font`. No external font request — this is also what keeps a strict
  CSP achievable in Phase 4.
- Metadata is Barlow uppercase and tracked. **A mono family was rejected** — it would have
  been a third typeface doing a job tracking already does.
- Fluid `clamp()` scale; type does not step at breakpoints.

---

## Architecture decisions

- **Next.js 16 App Router · TypeScript strict · Tailwind v4 (CSS-first `@theme` tokens)**.
- **Five runtime dependencies**: `next`, `react`, `react-dom`, `gsap`, `lenis`. A sixth needs
  a written justification.
- **Only routes read `src/data/**`.** Sections and components receive typed props. This one
  rule is what makes the Phase 2 CMS swap a change to one layer instead of a rewrite.
- `MediaAsset` carries `alt`, `caption`, `credit`, `source`, `licence`, `width`, `height` from
  day one, matching the future media library, so no migration is needed later.
- Server components by default. `"use client"` only for: menu overlay, portfolio filter,
  contact flow, motion primitives, team card expand.
- Portfolio filter state lives in the URL, not component state — linkable and shareable.

---

## Layout decisions

- **A grid row never `stretch`es a shorter item to match a taller sibling.** CSS Grid's
  default cross-axis alignment does this automatically for any two column-span items that
  land in the same auto-placed row. Text stretches invisibly; a fixed-aspect image cannot
  grow past its own ratio, so it sits at natural height inside the taller box and the
  difference becomes bare ground beneath it. Every row pairing media with text of different
  natural height carries `items-start` (or per-item `self-*`). Two real defects shipped from
  this before it became a rule: `AboutStatement`'s photo column (fixed with a single flowing
  column instead of a fought-over row), and the project gallery's landscape/portrait pairing
  (fixed with a flex row that gives each image its own natural height instead of two grid
  items whose spans happened to sum to 12).

---

## Motion decisions

- **The hero has a video now — reversing the Phase 1 "no video" call.** The completion
  report (`phase-1-report.md`) recorded no hero video because no openly-licensed footage
  of sufficient quality had been found; that was a sourcing gap, not a design rejection.
  The studio supplied a clip directly. It is a static-camera CGI/rendered loop (only the
  light animates), not photography of a real building — worth knowing since the brief
  leans toward photographic realism, but it was supplied with an explicit instruction to
  use it, so it shipped as given rather than second-guessed. Re-encoded via
  `scripts/transcode-hero.mjs`: 33MB HEVC source → ~1.9MB WebM + ~2.2MB MP4, muted, no
  quality loss visible since nothing in frame moves but the light. The poster is the
  video's own first frame (not a separate photograph), so the static-to-video handoff on
  autoplay is seamless. `VideoAsset.src` became `VideoAsset.sources: {src,type}[]` to
  carry both encodes — the one type change this required.
- **GSAP + ScrollTrigger** is the animation system.
- **Lenis is the only smooth-scroll engine.** Locomotive Scroll was evaluated and rejected:
  Lenis is smaller, does not take over layout, and bridges to the GSAP ticker cleanly.
  **Locomotive must never be installed alongside it.**
- Motion language: curtain transform-mask reveals, counter-scale on masked images, word
  stagger on headings, rule draw for hairlines, capped `8%` parallax on background media only.
- **A reveal that spans more than one paragraph, or a list mapped with `stagger`, gives every
  item its own scroll trigger — never one trigger for the whole group.** A single trigger on
  a tall block resolves to full opacity long before a normally-scrolling reader has seen most
  of the content, so everything past the first screenful arrives already fully formed. That
  mismatch is the actual mechanism behind content reading as "popping in from nothing" — it
  is not the same bug as the stagger-wrapper fix below, and fixing one does not fix the other.
  `Prose` reveals each paragraph independently for this reason.
- **The `stagger` prop's wrapper element must never itself carry `data-reveal`.** Marking
  both `data-reveal` and `data-reveal-children` held the wrapper at `opacity: 0` for the
  entire staggered animation, since nothing ever animated the wrapper's own opacity — only
  its children were tweened. The group was invisible until the wrapper's `data-revealed`
  landed on completion, at which point CSS-driven opacity snapped from 0 to 1 in one frame:
  every child appearing at once, already in place, regardless of the stagger interval. Fixed
  in `Reveal.tsx` by marking staggered wrappers with `data-reveal-children` only.
- Loading sequence: max **1.6s**, once per session, skippable, shortens when assets are
  ready early, does not run at all under reduced motion.
- Under `prefers-reduced-motion: reduce`, Lenis is never constructed and timelines are never
  created — final states render immediately rather than animating faster.
- Armed (hidden) start states are CSS-only under `html.js-motion`, set by a synchronous boot
  script. No JS or reduced motion means nothing is ever hidden.
- **`MotionFailsafe`** releases any element still armed and on screen after 4s, covering
  script errors, a dead ticker, or a throttled tab. It is the only `!important` in the
  project — a stalled tween keeps rewriting its inline transform, which outranks normal CSS.
- Z-order: `60` menu overlay · `70` header · `80` page transition · `90` intro. The header
  sits above the overlay; the overlay is `aria-modal` and therefore carries its own close
  control, because a control outside the dialog is unreachable by keyboard.
- **Everything composites.** Every animation moves `transform` or `opacity` only. The
  curtain reveal, the intro, the page transition and the menu wipe were all originally
  `clip-path` and were rebuilt as transform masks — `clip-path` is paint-level and repaints
  a viewport-sized element every frame.
- The curtain mask offsets are `+120%` frame / `−20%` content, netting to 100% at the start
  and 0 at the end. **Equal-and-opposite offsets cancel and reveal nothing** — that bug
  shipped briefly and was caught by measuring the armed geometry, not by looking.
- Scroll handlers write data attributes inside a rAF throttle; they never call `setState`.
- `will-change` is applied only while an element is moving and cleared on completion.
- Images: AVIF then WebP, derivatives capped at 2048 (sources are 2400px, widest container
  1680px). Halves the bytes decoded per scroll on photography.
- **A lazy image fades in on its own `load`, independent of the scroll-reveal system.**
  A curtain or text reveal fires on viewport position; a lazy image's bytes arrive on
  network time. Those two clocks have nothing to do with each other, so without this an
  image could pop into an already-open, already-settled frame well after its surrounding
  text had finished animating in — content that visibly loaded at two different speeds.
  `Media` stamps a non-priority `<img>` with `data-media-loading` until it resolves; CSS
  hides it only under `.js-motion`, the same no-JS/reduced-motion gate the reveal contract
  uses, so nothing here can hide content that JS never runs for. `priority` images are
  exempt — they are fetched eagerly to be ready before they're seen, so gating them behind
  post-hydration state only risks hiding them during the paint they exist for.
  React's `onLoad` alone was not reliable enough to ship: testing found a fully-loaded,
  fully-decoded image (`img.complete === true`) that never fired a `load` event a handler
  caught, leaving it stuck invisible. `Media` now also polls `.complete` directly and gives
  up waiting outright after 4s — the same guarantee `MotionFailsafe` makes for the reveal
  system, applied to image loading specifically.
- **A CAD crosshair replaces the pointer** on fine pointers with motion enabled
  (`CrosshairCursor`). This reverses the blanket rejection of cursor followers below, at the
  studio's request. The objections are answered rather than ignored: position is written to
  a `translate3d` inside a rAF so nothing lays out or paints, and the system cursor is only
  hidden over the page surface — links, buttons and fields keep their own, because a hand
  over a link is a better affordance than a reticle. Never mounted for coarse pointers or
  reduced motion.
  - **Carries a coordinate readout and a snap state**, both real AutoCAD conventions rather
    than invented decoration: a zero-padded X/Y readout (dynamic input) in the site's own
    tabular-numeral register, and a pickbox that fills solid and swaps the readout for
    "SELECT" over anything interactive (object-snap acquisition). The snap hit-test is a
    single shared `SNAP_SELECTOR` constant, reused for the crosshair's own logic — kept as
    one list rather than duplicated against the CSS `cursor: pointer` override, so the two
    cannot silently drift apart.
- **The header is glass.** `backdrop-filter` on the header was previously rejected as an
  expensive way to reproduce what a 94% ink fill already did; over the hero *video* the two
  no longer look alike, so the studio asked for the blur and it now earns its cost. Applied
  as a Tailwind `data-[scrolled]:backdrop-blur-*` utility, **not** as a hand-written
  `backdrop-filter` in `globals.css` — the CSS transformer strips that declaration silently,
  which is how this first shipped looking like a flat veil.
- **The mark lights up, on the first-visit intro and on every route change** (`NeonMark`).
  Two stacked copies of `UthanMark` — a dim unlit one always present, a bright pistachio one
  revealed bottom-to-top via `clip-path` — with a double `drop-shadow` (tight, then wide) for
  the glow. "Neon" is deliberately not a new colour: the palette takes one accent and no
  second is introduced, so the glow is pistachio at higher intensity, not an invented hue.
  This and the header's glass are the two reversals of the "no glow, no glass" anti-brief —
  see design.md's Anti-brief note.
  - The **first-visit intro** (`LoadingSequence`) drives the fill with GSAP, chained against
    the same timeline as the rule-draw and letter reveal it already had; lengthened from a
    1.6s ceiling to 2.4s at the studio's request; still skippable, still never runs under
    reduced motion or no JS (armed only under `.js-motion`, default fully lit).
  - **Every route change** (`PageTransition`) shows the mark too, briefly — but is **not**
    built on a GSAP timeline, and this was not a stylistic choice. It fires on every
    navigation rather than once per session, and testing surfaced a GSAP timeline getting
    *stuck fully covering the page* twice under that frequency: once from React 18 Strict
    Mode double-invoking the mount effect in development (a `useRef(true)` "is this the
    first render" flag reads as already-flipped on the second simulated mount, since Strict
    Mode's mount→cleanup→mount replay reuses the same ref — fixed everywhere in this file by
    seeding a **second `useState`** with the initial prop value and comparing during render,
    not a ref, both because a ref survives the replay and because this project's lint rules
    forbid reading `ref.current` during render outright), and again from the timeline's own
    `setTimeout` rescue not reliably firing a second time. Rebuilt on plain React state (a
    `data-phase` attribute) and CSS transitions instead: the panel's position becomes a pure
    function of state with no mid-flight tween state to strand, and the transform is
    compositor-driven rather than dependent on a JS frame callback. Confirmed empirically,
    not just in theory — the CSS-driven version showed genuine smooth mid-transition values
    where the GSAP version had shown none.
- **Team cards expand to a detail view via GSAP `Flip`** (`TeamGrid.tsx`), not Framer Motion's
  `layoutId`. `Flip` has shipped free inside the core `gsap` package since 3.13 (formerly a
  paid "Club GreenSock" plugin), so it cost nothing against the five-dependency cap; it is
  registered once in `src/lib/gsap.ts` alongside `ScrollTrigger`. The expanded card is the
  *same* DOM element as the grid card — Flip measures its rect before the state change, React
  re-renders it in place at its new size/position, `Flip.from` animates the delta — never a
  duplicate mounted elsewhere, which would mean an unmount/remount FLIP exists to avoid. Two
  real bugs shipped building this before the pattern below was fixed:
  - **`position: fixed; margin: auto` self-centres only with `inset: 0`, not `inset: auto`.**
    Per spec, a fixed/absolute box with all four insets `auto` falls back to its *static*
    (in-flow) position — the expanded card rendered thousands of pixels down the page, at
    exactly where it sits in the grid, because `md:inset-auto` was written where `md:inset-0`
    was meant. The margin-auto centering trick needs explicit zero insets to have anything to
    distribute the margin against.
  - **`surface-dark` alone does not make text light** — it only redeclares `--color-accent` /
    `--color-secondary` / `--color-hairline`. Actual text colour comes from `color`, set at
    `body` (`--color-paper`) and overridden per-section by `Section`'s `text-ink` /
    `text-paper` utility. The expanded card added `surface-dark` for the accent flip but
    forgot the paired `text-paper`, so a heading with no colour class of its own kept
    inheriting `text-ink` from the ancestor light `Section` — rgb(10,10,10) on an ink
    background, invisible. Every existing dark surface in the codebase already writes
    `surface-dark` and `text-paper` together (see `Section.tsx`'s `SURFACE` map); this is not
    a new rule, just a reminder that the two are a pair, not one flipping the other.
- **A stepped-terrace silhouette sits behind the figures band** (`TerraceMotif`, used in
  `Numbers.tsx`), the one plain dark "held pause" section in the homepage scroll that had no
  imagery of its own. Geometry sourced from haikei.app's "Layered Steps" generator, read
  straight off its live DOM (no download, no generated file to track) and stripped of its
  own default violet fills — every path is `currentColor` at `text-hairline`, the token
  already reserved "decorative only," at `opacity-20` on its wrapper. One placement, not a
  site-wide treatment: a texture earns its place once, spread everywhere it reads as
  wallpaper instead of restraint.
- **The product detail view reads as a listing page, not an editorial spread** —
  `ProductFeature.tsx`. The original build paired a full three-paragraph `Prose` block with
  a large serif `Statement` under each product's title; both are gone, replaced by
  `product.summary` alone at body scale. In their place: a real gallery, a large frame plus
  a clickable thumbnail rail — the one interaction every ecommerce product page shares —
  standing in for the single static hero image `product.gallery` used to only get further
  down the page in a separate grid. No price, no cart: the *shape* is the familiar one
  (image, name, one line, spec sheet, one action), not the commerce chrome. Caught while
  building it: the thumbnail `<Media>` originally carried `key={frames[active].src}` so
  swapping the active frame remounted it — which also re-arms its `Reveal variant="curtain"`
  scroll trigger on every click, and a trigger whose position has already been scrolled past
  gets stuck at `opacity: 0` rather than firing again. Fixed by dropping the `key`; `Media`
  already cross-fades a changed `src` in on its own `load`.
- **`data-[open]:` only matches an empty-valued presence attribute, not a boolean rendered as
  the string `"true"`.** Real bug, not a guess: `TeamGrid`'s shared backdrop was written as
  `data-open={expandedId !== null || undefined}` with `data-[open]:opacity-100` in its
  className, and the backdrop never became visible — React stringifies a `data-*` boolean to
  literally `data-open="true"` (unlike real DOM boolean attributes, which React special-cases),
  and Tailwind's bracket-only `data-[open]` variant compiles to a selector that wants the
  bare, empty-string form (`<div data-open>`, the shape `.toggleAttribute()` produces — see
  `SiteHeader`'s working `data-[scrolled]:`). Fixed by matching the value Tailwind actually
  needs: `data-[open=true]:opacity-100`. Confirmed by toggling the attribute directly in the
  console and reading `getComputedStyle` before touching JSX — inspecting the generated
  stylesheet's `cssRules` was not reliable here, since Tailwind v4 nests utilities in
  `@layer` blocks that a shallow `sheet.cssRules` walk does not flatten.
  - **Same pass, the team card's close animation was smoothed.** The backdrop used to mount
    and unmount with the card (`{expanded && <div className="fixed inset-0 ...">}`), so it
    vanished in a single frame while the card was still mid-shrink — a discontinuity between
    an instant disappearance and an in-flight GSAP tween that is exactly what read as
    "sloppy" specifically on close (open never had this problem, since GSAP's own resolve
    covered the mount). Now one shared backdrop lives at the `TeamGrid` level, always
    mounted, CSS-transitioned on `--dur-cinematic` so it settles on the same clock as the
    card's Flip tween instead of snapping ahead of it. Expand and collapse also stopped
    sharing one duration/ease: `power3.out` at `0.55s` for expanding (matches
    `ease-out-soft`'s role, "anything entering"), `power2.inOut` at `0.45s` for collapsing
    (matches `ease-in-out-soft`'s role, "anything that leaves and returns") — GSAP's `ease`
    property does not read a CSS custom property, so these are the same two curves already
    documented above, spelled in GSAP's own built-in vocabulary instead of raw cubic-bezier.
- **The crosshair cursor is a mid-sized local reticle (72px arms), not a full-viewport CAD
  line, and its colour genuinely flips with the surface it is over** — pistachio on dark,
  olive on light, the same rule every section's own accent already follows — rather than a
  fixed value stood in for it. The crosshair is mounted once at the document root, outside
  any `.surface-dark` / `.surface-light` ancestor, so `--color-accent` never flips for it on
  its own; `CrosshairCursor.tsx` now does the hit-test itself, inside the same rAF-throttled
  handler that already writes position and the coordinate readout: `document.elementFromPoint`
  on the pointer's own coordinates (safe because the crosshair and every child inherits
  `pointer-events: none`, so it can never hit-test itself), then `.closest(".surface-dark,
  .surface-light")`, then a `data-surface` attribute CSS reads. A `mix-blend-mode: difference`
  version shipped first and was replaced — it solved contrast generically but not the actual
  ask, which was the site's own two real tokens, not a computed invert. Worth remembering
  from building the blend-mode version even though it is gone: `mix-blend-mode` does not
  cascade to children, so it has to sit on each painted mark individually, never on a
  non-painting wrapper.
- **Rejected:** magnetic buttons, tilt effects, scroll-jacked full-page sections, overshoot
  easing, `ease-in` on entrances.

---

## Explicitly rejected

| Rejected | Why |
|---|---|
| **Three.js / WebGL hero** | The art direction is photographic and typographic. A shader would be ornamental depth over the real subject, plus a bundle, a DPR budget, a context-loss path and a poster fallback — for nothing the photography does not already do |
| Locomotive Scroll | Lenis chosen; two smooth-scroll engines is a defect |
| Framer Motion | Would duplicate GSAP's role |
| UI component libraries (MUI, Chakra, shadcn) | The entire point is that this must not look like a library |
| CSS-in-JS runtime | Runtime cost for no benefit against a token layer |
| A mono typeface | Third family doing a job tracking already does |
| Rounded cards, shadows, glass, gradient meshes | Outside the architectural language |
| A second accent colour | Dilutes the one signal the accent carries |
| Building a custom CMS | Explicit client constraint; no compelling architectural reason |
| Third-party analytics / tag managers | Privacy, CSP, and performance |

---

## CMS decision — PROVISIONAL, NOT ADOPTED

**Provisional recommendation: Payload CMS.** MIT-licensed, free self-hosted, runs inside the
same Next.js app (one deploy target), TypeScript-native so the `src/types/content.ts`
contract can be shared, and ships drafts, versions, roles, media and SEO fields without a
paid tier. Risk: couples CMS availability to the web app. Fallback if the studio wants a
fully decoupled service: **Directus**.

**Status: not confirmed. No CMS code may be written until Phase 2 is approved and this line
is updated to say ADOPTED.**

---

## SEO decisions

- Phase 1 builds the structure only: semantic landmarks, one `<h1>` per page, ordered
  headings, crawlable `<a href>`, descriptive slugs, real text in the HTML, `alt` strategy,
  internal linking. `generateStaticParams` on every `[slug]` route.
- Metadata, canonicals, Open Graph, JSON-LD, sitemap and robots are **Phase 5**. Structured
  data will only ever describe visible content.

---

## Security decisions

- Phase 1 obligations already in force: no secrets in the repo, no third-party scripts, no
  unsanitised external SVG, no `dangerouslySetInnerHTML` on unvetted content.
- No public authentication surface will exist on the marketing site — this removes an entire
  attack class by design.
- Fooocus, when built, sits behind a backend service layer. Credentials and internal
  endpoints never reach the browser, and the public site must function with Fooocus offline.

---

## Content status

- All Phase 1 content is **demo content**, marked `isDemo: true` and banner-commented in
  every data file. Demo projects are never presented as real Uthan work, and the projects,
  portfolio, news, products and sustainability pages each carry a visible demo notice.
- **Demo media: Wikimedia Commons**, CC0 / public domain / attributed Creative Commons,
  provenance per file in `public/media/CREDITS.json` and surfaced in figure captions.
  Openverse was tried first and rate-limits anonymous clients to a handful of requests.
- **Curation is manual.** 74 assets were downloaded, reviewed on generated contact sheets,
  and 48 deleted. 26 remain: 16 photographs, 10 architectural drawings. Assignment of
  asset-to-role lives in `src/data/media.curation.ts`.
- Commons' peer-reviewed Featured/Quality tiers skew to heritage and postcard imagery and
  contain miscategorised files. It is a documentation archive, not a contemporary
  architecture library. **The demo library is the weakest part of Phase 1 and is resolved by
  the studio supplying real photography — no design change is required.**
- **No portraits.** Attaching a real, identifiable person's photograph to an invented name
  and role misrepresents that person regardless of licence. The team grid ships a designed
  portrait-pending state instead, which is also the honest production state for a new hire.
- **No logo wall.** Collaborators are set in type. A real company's mark would be false
  proof of a relationship; an invented mark would be worthless.
- **No dead links.** Unsupplied social profiles and unavailable documents render as text
  with their state stated, never as `href="#"`.
- Expertise categories, statistics and sustainability principles are placeholders pending
  client confirmation.

---

## Outstanding decisions

1. CMS confirmation (Phase 2 gate).
2. Wordmark: RESOLVED — the studio supplied a drawn mark. See the Brand decisions note on `UthanMark`.
3. Real expertise categories — the nine in use are placeholders.
4. Real statistics.
5. Real sustainability practice.
6. Photography art direction for production.
7. Whether project detail pages get a shared-element page transition.
8. Deployment target.
9. Domain.

---

## Verification performed (Phase 1)

- Production build, typecheck and lint: clean.
- Automated in-browser audit across all 13 routes: **zero HIGH findings** — no contrast
  failure, no missing `alt`, no control without an accessible name, one `<h1>` per page, no
  skipped heading levels, landmarks present.
- Horizontal overflow: **80 page/width combinations** (10 routes × 320/375/390/768/1024/
  1280/1440/1920) — zero overflow.
- Link integrity: zero dead anchors; all 27 distinct internal links resolve.
- No-JS / reduced-motion equivalence: with `js-motion` removed, zero reveal targets remain
  hidden and the intro overlay stays `display: none`. Server HTML carries 2.1k–6.3k
  characters of real text per route.
- Menu dialog keyboard cycle: focus trapped, `Esc` closes, focus restored to the trigger,
  body scroll released.

## Approved

**Pages:** — *awaiting review; Phase 1 complete and submitted.*
**Components:** — *awaiting review; Phase 1 complete and submitted.*

Nothing is approved until the Phase 1 completion report is reviewed and signed off.
