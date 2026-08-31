# Uthan Design Studio

A concept website for a contemporary architecture practice — built end to end as a
self-directed project: design system, motion engineering, content architecture, and
accessibility, taken through a full Phase 1 UI/UX cycle with its own written process
and decision record.

**Uthan Design Studio is fictional.** There is no client. Every project, statistic,
team member, and news item on the site is clearly-flagged demo content, written to
exercise the design system at a realistic depth rather than to represent a real
business. The goal was to work the way a studio actually would on a real engagement —
brief, requirements, architecture, design system, build, QA — and to leave that process
visible rather than hidden.

## What this project is

Not a template. The brief called for something that reads as a serious architecture
practice rather than a generic agency or SaaS site — precise, spatial, editorial,
calm — and the build follows through on that at every layer:

- **A real design system**, not a component library skin. Every colour, type size,
  spacing value, radius, duration and easing curve lives in one token file. The accent
  colour flips between a dark-surface and light-surface variant automatically, because
  the brief's palette does not pass WCAG contrast unmodified on a light ground —
  verified numerically, not eyeballed.
- **A CMS-shaped content layer.** Every page reads from a typed `src/data` module
  through a fixed accessor contract. Swapping the demo data for a real CMS later is a
  change to one layer, not a rewrite — the type contract (`src/types/content.ts`) is
  written as if the CMS already existed.
- **Motion with a reason.** GSAP + Lenis, transform/opacity only (no layout-property or
  `clip-path` animation — both cost real frames on ordinary hardware), a CSS-first
  contract so nothing is ever hidden from a visitor without JavaScript or with reduced
  motion requested, and a failsafe that hands control back if an animation stalls.
- **Accessibility checked, not assumed.** A small in-browser audit script measures
  rendered contrast, heading order, accessible names, target sizes and horizontal
  overflow across every route and breakpoint — the same numbers a reviewer would get,
  run before the fact instead of found after.
- **Sourced, licensed demo media.** Photography is pulled from Wikimedia Commons under
  CC0 / Public Domain / CC-BY licences, hand-curated from a larger downloaded pool
  (most of what a keyword search returns is not usable), with per-image provenance
  recorded in `public/media/CREDITS.json`.

## Process

The project runs on six living documents, checked in alongside the code they govern —
not written after the fact, but read and updated through the build:

| Document | Governs |
|---|---|
| [`project-requirement.md`](./project-requirement.md) | Scope, requirements, phase definitions, acceptance criteria |
| [`architecture.md`](./architecture.md) | Stack, structure, data flow, and what is deliberately not built yet |
| [`ruler.md`](./ruler.md) | The engineering and design constitution — binding, outranks convenience |
| [`process.md`](./process.md) | Workflow, the seven-step loop, quality bar, phase gates |
| [`design.md`](./design.md) | The design system itself — colour contract, type scale, grid, motion |
| [`memory.md`](./memory.md) | Durable decisions, and everything explicitly rejected along the way |

[`phase-1-report.md`](./phase-1-report.md) is the completion report for the phase this
repository represents: what was built, what changed from the brief and why, what was
verified, and what remains a known limitation.

## Stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, TypeScript, strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), CSS-first `@theme` tokens |
| Motion | [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) |
| Images | `next/image`, AVIF/WebP, [`sharp`](https://sharp.pixelplumbing.com) pipeline |
| Deployment target | Static-first App Router output |

## Routes

`/` · `/studio` · `/projects` · `/projects/[slug]` · `/portfolio` · `/products` ·
`/sustainability` · `/news` · `/news/[slug]` · `/contact` · `/privacy` · `/terms` · 404

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build         # production build
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
```

Media tooling (development only — never shipped):

```bash
node scripts/fetch-curated.mjs    # source demo media from Wikimedia Commons
node scripts/process-media.mjs    # optimise + regenerate the media registry
node scripts/contact-sheet.mjs    # build contact sheets for curation review
```

`scripts/audit.js` is pasted into the browser console during QA to check contrast,
heading order, accessible names, target sizes and horizontal overflow.

## Licence & attribution

Code is available for reference as a portfolio piece. Demo photography is sourced
under open licences from Wikimedia Commons; full per-image creator, licence and source
attribution is recorded in `public/media/CREDITS.json` and `public/media/pool/CREDITS.json`.
