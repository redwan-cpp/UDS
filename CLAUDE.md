# UTHAN DESIGN STUDIO

Read these six files before making any significant change. They are part of the project,
not documentation about it.

| File | What it governs |
|---|---|
| `project-requirement.md` | Scope, requirements, phase definitions, acceptance criteria |
| `architecture.md` | Stack, structure, data flow, and what is deliberately NOT built yet |
| `ruler.md` | Engineering and design constitution. Binding. Outranks convenience |
| `process.md` | Workflow, the seven-step loop, quality bar, phase gates |
| `design.md` | Design system: colour contract, type scale, grid, motion |
| `memory.md` | Durable decisions, and everything explicitly rejected |

**Current phase is recorded at the top of `memory.md`.** Apply that phase's restrictions.
Do not implement future-phase functionality early, however convenient it seems.

## Quick reference

```bash
npm run dev        # dev server
npm run build      # production build — must pass clean
npm run lint       # eslint — must pass clean
npm run typecheck  # tsc --noEmit
```

Media tooling (development only, never shipped):

```bash
node scripts/fetch-curated.mjs    # source demo media from Wikimedia Commons
node scripts/process-media.mjs    # optimise + regenerate src/data/media.generated.ts
node scripts/contact-sheet.mjs    # contact sheets in .review/ for curation review
node scripts/transcode-hero.mjs   # re-encode a supplied hero video (WebM+MP4+poster)
```

Raw video masters go in the gitignored `media-source/` directory, never in `public/` —
anything under `public/` is publicly downloadable as-is, which defeats transcoding a
30MB+ camera export down to the ~2MB derivative the site actually serves.

`scripts/audit.js` is pasted into the browser console to check contrast, heading order,
accessible names, target sizes and horizontal overflow. It must report zero HIGH findings.

## The five rules broken most often

1. **Only routes read `src/data/**`.** Components take typed props.
2. **If a component paints a surface colour, it declares `surface-dark` / `surface-light`.**
   The accent flips by DOM inheritance, not by what is visually behind it.
3. **No literal design values outside `src/app/globals.css`,** and no content literals
   outside `src/data`.
4. **Two grid items of different intrinsic height never share an auto-placed row
   without an explicit `items-start` (or per-item `self-*`).** CSS Grid's default
   `stretch` pads the shorter one out to match the taller one, and a fixed-aspect
   image can't grow into that space — the result is a dead gap under whichever
   item is shorter. This produced two real bugs (`AboutStatement`'s photo column,
   the project gallery's landscape/portrait pairing) before it became a rule.
5. **A scroll reveal that wraps more than one paragraph, or a `stagger`-mapped
   list, must give each item its own trigger — not one trigger for the group.**
   One trigger on a tall block finishes long before the reader has scrolled far
   enough to see most of it, so everything below the first screenful arrives
   already at full opacity: content that reads as popping in from nothing. See
   `Prose` (`src/components/typography/index.tsx`) and `Reveal`'s `stagger` prop
   (`src/components/motion/Reveal.tsx`) for the fix.
