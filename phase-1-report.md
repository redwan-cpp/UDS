# PHASE 1 COMPLETION REPORT — UTHAN DESIGN STUDIO

**Phase:** 1 — UI/UX
**Status:** Complete, awaiting review
**Date:** 2026-08-31

Phase 1 is finished and **stopped**. No CMS, database, authentication, backend, contact
processing, analytics, Fooocus integration or deployment work has been started, per the
brief. This report is the approval gate.

---

## 1. Completed

### Documentation
All six governing documents were written before implementation and updated as decisions
were made: `project-requirement.md`, `architecture.md`, `ruler.md`, `process.md`,
`design.md`, `memory.md`. `CLAUDE.md` points at them.

### Foundation
- **Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · GSAP · Lenis.**
  Five runtime dependencies, no more.
- Tailwind's default colour, font, radius and easing palettes are **cleared**, so
  `bg-blue-500` does not compile. Only the brand contract exists.
- Two self-hosted variable typefaces: **Archivo** (weight + width) and **Newsreader**
  (optical size). No external font request.

### Routes — all 13 built
`/` · `/studio` · `/projects` · `/projects/[slug]` · `/portfolio` · `/products` ·
`/sustainability` · `/news` · `/news/[slug]` · `/contact` · `/privacy` · `/terms` · 404.

Every project and article is statically prerendered and individually crawlable.

### Components
Navigation with a modal index overlay · first-visit loading sequence · cinematic hero with
poster fallback · editorial statement band · animated counters · expertise index with paired
imagery · featured project showcase (count-agnostic) · project hero / facts / gallery /
process gallery / related projects · portfolio grid with URL-reflected filtering · product
feature · news card and article · team grid · collaborator index · sustainability principle
index · seven-step contact flow · footer.

### The colour contract
The brief's palette was verified numerically, and it does not survive contact with a light
surface unmodified: **pistachio measures 1.4:1 on warm white.** So the accent flips by
surface — pistachio `#B7D77A` on dark, **olive `#4E5D2A`** (same hue, darkened until legal)
on light — and `.surface-light` / `.surface-dark` redeclare the semantic tokens so a
component writes `text-accent` once and is correct on both grounds.

---

## 2. Changed from the brief

| Brief | Delivered | Why |
|---|---|---|
| Black / pistachio / warm white | Same, plus **olive** as the light-surface accent | Pistachio is 1.4:1 on warm white — unusable as text or icon. Olive is the same hue at 6.4:1 |
| Cinematic **video** hero | Cinematic hero, **still photography**, video-ready | No openly-licensed architectural footage of sufficient quality was found. `BackgroundVideo` takes a `VideoAsset` and plays it the moment one is supplied; the poster path is not a fallback bolted on afterwards |
| Team section with portraits | Team section with a designed **portrait-pending** state | Attaching a real, identifiable person's photograph to an invented name and role misrepresents that person, whatever the licence says |
| "Brands" logo wall | Collaborators **set in type** | A real company's mark would be false proof of a relationship that does not exist; an invented mark would be worthless |
| Sustainability page | Built, with **no figures or certifications** | Every specific environmental claim is deliberately absent rather than invented. The page says so explicitly |
| Three.js considered | **Excluded** | The art direction is photographic and typographic. A shader would be ornamental depth over the actual subject, plus a bundle, a DPR budget and a context-loss path |

---

## 3. Design decisions worth flagging

**"Space described in sequence."** The interface is a frame; the work is the subject; the
scroll is the walk between framed views. Three commitments follow: structure is drawn with
hairlines and interval rather than cards (radius is `0`, and there are no shadow tokens at
all, deliberately); hierarchy is carried by type rather than decoration; asymmetry is used
where it buys real negative space.

**Section rhythm is weighted by role, not uniform.** Pivotal bands take 128–192px of block
padding, connective ones 80–96px. One padding value everywhere is what makes a page read as
"nothing gets its own moment".

**The expertise index and project gallery are authored twice**, not reflowed — desktop gets
rows with a sticky companion image and an editorial image field; mobile gets inline imagery
and a horizontal snap strip, because a masonry field at 375px is just a long column of small
pictures.

**Motion has a guarantee behind it.** Hidden start states are applied by CSS only under
`html.js-motion`, a class a synchronous boot script adds solely when JavaScript runs *and*
reduced motion is off — so no-JS and reduced-motion visitors never have anything hidden.
`MotionFailsafe` then covers the unpredictable failures (script error, dead ticker, a tab
throttled mid-tween) by releasing anything still armed and on screen after four seconds.
The site cannot hide its own content behind a broken animation.

**The contact flow is honest about being a prototype.** It validates, preserves answers when
you step back, skips questions that do not apply, and offers a direct "just send a message"
route — then tells you plainly that nothing was transmitted, rather than showing a
success screen that would lose a real enquiry.

---

## 4. Verified

| Check | Result |
|---|---|
| Production build | Clean |
| TypeScript strict | Clean, no `any` |
| ESLint | Clean |
| Automated audit, all 13 routes | **Zero HIGH findings** — no contrast failure, no missing `alt`, no control without an accessible name, one `<h1>` per page, no skipped heading levels, landmarks present |
| Horizontal overflow | **80 combinations** (10 routes × 320/375/390/768/1024/1280/1440/1920) — zero |
| Link integrity | Zero dead anchors; all 27 distinct internal links resolve |
| No-JS / reduced motion | Zero reveal targets remain hidden; intro overlay stays `display:none`; server HTML carries 2.1k–6.3k characters of real text per route |
| Menu dialog keyboard cycle | Focus trapped · `Esc` closes · focus restored to trigger · scroll released |
| Pointer targets | Meet the WCAG 2.2 AA 24px floor |

Contrast was measured on **rendered pairs in the browser**, not estimated from the palette —
which is how the two genuine failures below were caught.

### Bugs found and fixed during QA
1. **Pistachio rendered on warm white** (1.4:1). `--color-accent: var(--accent)` was
   substituted at `:root`, so overriding `--accent` deeper in the tree did nothing. A custom
   property containing `var()` resolves where it is *declared*. `.surface-*` now redeclares
   the semantic tokens directly.
2. **Olive on ink at 2.6:1** — the portrait-pending block paints an ink surface inside a
   light section and inherited the wrong tokens. Every component that paints a surface now
   declares one; this is a written rule.
3. **The menu overlay covered its own close button**, leaving `Esc` as the only exit. The
   header now sits above the overlay, and the `aria-modal` dialog carries its own close
   control — a control outside the dialog is unreachable by keyboard.
4. **Word masks clipped descenders** at the tight display leading.
5. **Hydration mismatch** from the boot script mutating `<html>` before hydration.
6. **Dead `href="#"` links** for unsupplied social profiles and documents, now rendered as
   text with their state stated.

---

## 5. Known limitations

**The demo photography is the weakest part of this build, and it is a sourcing problem, not
a design one.**

Wikimedia Commons was used because it needs no API key and has workable anonymous limits
(Openverse rate-limits anonymous clients to a handful of requests per hour). 74 assets were
downloaded, reviewed on generated contact sheets, and **48 were deleted**. 26 remain: 16
photographs and 10 architectural drawings.

Commons is a documentation archive. Even its peer-reviewed Featured and Quality tiers skew
to heritage and postcard imagery, and contain miscategorised files — a praying mantis was
filed under "building interiors". There is not enough contemporary minimal architecture in
it to give forty image slots a distinct frame, so the strongest images are assigned to the
most prominent positions in `src/data/media.curation.ts` and controlled repetition is
accepted further down.

**This resolves entirely when the studio supplies its own photography. No layout, component
or design-system change is required — only the asset ids in the curation file.**

Also outstanding:
- No hero video (see §2).
- Contact submission is stubbed; the flow says so on screen.
- Legal pages are deliberately unwritten — drafting a plausible privacy policy would be
  inventing legal commitments on the studio's behalf.
- All statistics, expertise categories, team names, collaborators and contact details are
  `PLACEHOLDER`.
- Performance was not measured on real hardware; Core Web Vitals verification is Phase 6.
  The structural work is done (explicit image dimensions, lazy below-fold media, offscreen
  video pausing, server-rendered content).
- The work is **not committed to git** — the repository has no commits yet, and committing
  was not requested.

---

## 6. What the studio needs to supply

1. Photography — the single highest-impact item.
2. Real project records: names, locations, areas, years, clients, narrative, galleries.
3. Confirmed expertise categories (the nine in use are placeholders).
4. Real statistics.
5. Actual sustainability practice, with evidence for any figure.
6. Team names, roles, portraits.
7. Collaborator names, and permission to show any marks.
8. Contact details, address, hours, social profiles.
9. Product specifications for doors and sheet work.
10. Privacy policy and terms.
11. Whether the wordmark stays typographic or a mark gets drawn.

---

## 7. Recommended next phase

**Phase 2 — CMS.** The frontend was built for this: content types are already the contract
(`src/types/content.ts`), only routes read the data layer, and `MediaAsset` already carries
the metadata a media library needs.

Provisional recommendation, **not yet adopted**: **Payload CMS** — MIT-licensed, free
self-hosted, runs inside the same Next.js application, TypeScript-native so the content
contract can be shared rather than duplicated, with drafts, versions, roles, media handling
and SEO fields at no tier. Risk: it couples CMS availability to the web app. **Directus** is
the fallback if a fully decoupled service is preferred.

The decision needs confirming before any CMS code is written.

**Do not start Phase 2 until this report is approved.**
