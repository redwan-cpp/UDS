# PROCESS — UTHAN DESIGN STUDIO

**Status:** Binding
**Last updated:** 2026-08-30
**Current phase:** PHASE 1 — UI/UX

---

## 1. The macro workflow

```
Research
  ↓
Requirements
  ↓
Architecture
  ↓
Design system
  ↓
UI/UX                ←── PHASE 1 ENDS HERE, AND STOPS
  ↓
Review
  ↓
Refinement
  ↓
Approval             ←── EXPLICIT CLIENT GATE
  ↓
Infrastructure
  ↓
CMS
  ↓
Backend
  ↓
Security
  ↓
SEO
  ↓
Performance
  ↓
Testing
  ↓
Deployment
```

A phase is not entered because the previous one looked easy. It is entered because the
previous one was reviewed and approved.

---

## 2. The seven-step loop

Every major piece of work runs this loop. No step is skipped, including for work that looks
trivial — trivial-looking work is where unreviewed assumptions accumulate.

### 1 — Inspect
Read the six project documents. Read the code that already exists in the area. Find the
established pattern before inventing one. Identify what will break.

### 2 — Plan
State the intent, the affected files, the components involved, the tokens used, the motion
and its reason, the responsive behaviour, and the accessibility implications. Name the
risks. If two readings of the request produce materially different work, ask now, not after.

### 3 — Implement
Build to `ruler.md`. Tokens only. Data layer only. Smallest change that fully does the job.

### 4 — Test
- Production build passes.
- Typecheck passes. Lint passes.
- Rendered at 320 / 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920.
- Traversed by keyboard alone, focus visible at every stop.
- Checked with `prefers-reduced-motion: reduce`.
- Checked with JavaScript disabled — content must still be present and readable.
- Contrast of any new pairing verified numerically.

### 5 — Review
Against the §4 quality bar below. Honestly. "It's fine" is not a review.

### 6 — Refine
Fix what the review found. Redesign what reads as generic rather than restyling it.

### 7 — Document
Update `design.md` when the design system moved. Update `architecture.md` when the
structure moved. Update `memory.md` when a durable decision was made. Update
`project-requirement.md` when scope moved.

---

## 3. Session protocol

**At the start of every session:**

1. Read `project-requirement.md`, `architecture.md`, `ruler.md`, `process.md`, `design.md`, `memory.md`.
2. Read `CURRENT PHASE` at the top of `memory.md`.
3. Apply that phase's restrictions.
4. Do not implement future-phase functionality, however convenient it seems.

**At the end of every session:**

1. Update `memory.md` with decisions made, and with anything explicitly rejected.
2. Leave the build in a passing state.
3. State plainly what is done, what is not, and what is blocked.

---

## 4. The quality bar

Asked before any UI is called finished. A "no" is a redesign, not a tweak.

**Identity**
- Does this look like an architecture studio, not a design agency and not a SaaS product?
- Would a practising architect find it credible?
- Is there a visual idea here, or just competent arrangement?

**Craft**
- Is the typography doing the hierarchical work?
- Is the spacing intentional and rhythmic, or defaulted?
- Are the images doing real design work, or filling holes?
- Is the composition asymmetric where asymmetry earns something?

**Motion**
- Does every animation have a reason?
- Does the page read before the motion finishes?
- Would this be annoying on the fifth visit?

**Mobile**
- Does mobile feel designed, or derived?
- Is any interaction dependent on hover?
- Is anything under 44px that needs to be tapped?

**Honesty**
- Is any studio fact invented?
- Is demo content clearly demo content?
- Is any claim unsupported?

**The final question**
- Does anything on this page look like a template? If yes, redesign it.

---

## 5. Phase gates

| Gate | Requirement to pass |
|---|---|
| Phase 1 → 2 | Every acceptance criterion in `project-requirement.md` §19 met, completion report delivered, **explicit client approval received** |
| Phase 2 → 3 | CMS selected and recorded in `architecture.md` and `memory.md`; every content type modelled; a non-technical editor has created and published a project unaided |
| Phase 3 → 4 | Contact submissions persist and deliver; auth roles enforced; no secret reachable from the browser |
| Phase 4 → 5 | Security review complete; rate limits live; headers verified; upload validation tested against malicious samples |
| Phase 5 → 6 | Metadata, structured data, sitemap and robots verified against live pages |
| Phase 6 → deploy | Core Web Vitals targets met on real hardware; accessibility audit passed; cross-browser verified |

---

## 6. When something is unclear

1. Do everything that does not depend on the answer.
2. For the part that does: state the assumption in writing and proceed, **unless** proceeding
   under a wrong assumption would be unsafe or would waste the work.
3. Ask at the point the answer is actually needed — not at the start of the task, and not
   after the work is already built the wrong way.
4. Never invent a fact about the studio to unblock yourself. `PLACEHOLDER` is always
   available and always correct.

---

## 7. Change discipline

- Reversible and local: make it.
- Irreversible, outward-facing, or a change to an approved decision: confirm first.
- Changing something recorded in `memory.md`: it is a decision reversal. Say so, say why,
  and update the record.
