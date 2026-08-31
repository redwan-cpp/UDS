# PROJECT REQUIREMENTS — UTHAN DESIGN STUDIO

**Document owner:** Creative direction / Project lead
**Status:** Living document
**Last updated:** 2026-08-30
**Current phase:** PHASE 1 — UI/UX

---

## 1. Project identity

| Field | Value |
|---|---|
| Project name | Uthan Design Studio — Official Website |
| Client | Uthan Design Studio |
| Sector | Architecture, interior and spatial design |
| Deliverable | Production website, delivered in controlled phases |
| Repository | `D:\UDS` |
| Primary domain | `PLACEHOLDER — not yet supplied` |
| Legal entity name | `PLACEHOLDER — not yet supplied` |
| Registered address | `PLACEHOLDER — not yet supplied` |
| Founding year | `PLACEHOLDER — not yet supplied` |
| Principal architect(s) | `PLACEHOLDER — not yet supplied` |
| Team size | `PLACEHOLDER — not yet supplied` |
| Markets / regions served | `PLACEHOLDER — not yet supplied` |
| Real project list | `PLACEHOLDER — not yet supplied` |

> **Hard rule.** No business fact about Uthan Design Studio may be invented. Anything the
> client has not supplied is an explicit `PLACEHOLDER`, rendered from the demo-content
> layer, and flagged as demo content in source. Demo projects are never presented as real
> Uthan work.

---

## 2. Project objective

Build the digital identity of a serious contemporary architecture practice — not a
marketing brochure and not a template. The site must read as an architecture publication
crossed with a gallery experience: precise, spatial, material, calm, confident.

The finished product must:

1. Establish credibility with clients, institutions and collaborators inside one viewport.
2. Present built work as the primary content, with the interface receding behind it.
3. Be operable end-to-end by non-technical studio staff via a CMS (future phase).
4. Meet production standards for accessibility, performance, SEO and security.

---

## 3. Target audience

| Audience | Need | Primary journey |
|---|---|---|
| Private residential clients | Confidence, aesthetic alignment, process clarity | Home → Major Projects → Project detail → Contact |
| Commercial / developer clients | Scale, delivery capability, sector proof | Home → Numbers → Expertise → Portfolio → Contact |
| Institutional & government bodies | Rigour, sustainability, compliance signals | Home → Sustainability → Collaboration & News → Contact |
| Press & architecture media | Imagery, project narrative, factual data | Projects → Project detail → News |
| Prospective employees / collaborators | Studio culture, quality of work | Studio → Team → News |
| Product buyers (doors, fabrication) | Capability, finish quality, materials | Products → Contact |

---

## 4. Business goals

**MUST HAVE**
- Convert qualified enquiries through a considered contact experience.
- Communicate positioning without written over-explanation.
- Carry a portfolio that can grow to hundreds of projects without redesign.

**SHOULD HAVE**
- Support recruitment and collaboration enquiries.
- Present the products arm (custom doors, fabricated sheet work) as part of one ecosystem.

**NICE TO HAVE**
- Press-ready media kit per project.
- Multilingual presentation.

**FUTURE**
- Client project portal.
- Fooocus-assisted visual production pipeline for editorial imagery.

---

## 5. Website goals

1. A cinematic first impression that is unmistakably architectural.
2. Work-first information architecture.
3. Editorial typography carrying hierarchy without decoration.
4. Motion that describes space and sequence, never ornament.
5. A mobile experience designed on its own terms, not a shrunken desktop.
6. A structure a CMS can populate with zero UI rewriting.

---

## 6. Functional requirements

### 6.1 Routes — MUST HAVE (Phase 1)

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero → About → Numbers → Expertise → Major Projects → Team → Brands → News → Footer |
| `/projects` | Major Projects index | Featured architectural work |
| `/projects/[slug]` | Project detail | Publication-grade long-form project narrative |
| `/portfolio` | Portfolio | Lighter, filterable index of all work |
| `/products` | Products | Custom Doors, Fabricated Sheet Work |
| `/news` | Collaboration & News | Collaborations, events, MoUs, announcements |
| `/news/[slug]` | News detail | Article-format entry |
| `/sustainability` | Sustainability | Studio environmental position |
| `/studio` | Studio / About | Practice, approach, team |
| `/contact` | Contact | Multi-step conversational enquiry flow (UI only in Phase 1) |
| `*` | 404 | Custom architectural not-found page |

### 6.2 Components — MUST HAVE (Phase 1)

Navigation with full-screen menu overlay · first-visit loading sequence · cinematic video
hero with poster fallback · editorial statement block · animated numeric counters ·
expertise index · featured project showcase (count-agnostic) · project card / hero /
gallery / related projects · portfolio grid with filtering · product presentation module ·
news & collaboration card and article layout · team grid · brand index · multi-step contact
flow with validation and review · footer.

### 6.3 Behavioural requirements

| ID | Requirement | Priority |
|---|---|---|
| F-01 | All navigation is a real crawlable `<a href>` and keyboard reachable | MUST |
| F-02 | Menu overlay traps focus, closes on `Esc`, restores focus to the trigger | MUST |
| F-03 | Portfolio filtering reflects state in the URL query string | MUST |
| F-04 | Contact flow preserves answers when stepping backwards | MUST |
| F-05 | Contact flow is fully keyboard-operable, one question per step | MUST |
| F-06 | Hero video is muted, looping, `playsinline`, poster-backed, pauses offscreen | MUST |
| F-07 | Any section renders zero items without layout collapse | MUST |
| F-08 | All content originates in the typed data layer, never in JSX literals | MUST |
| F-09 | `prefers-reduced-motion: reduce` renders final states immediately | MUST |
| F-10 | The loading sequence runs once per session and never delays ready content | MUST |
| F-11 | Project detail supports variable gallery length and optional sections | SHOULD |
| F-12 | Contact flow offers a direct path for users who only want to send a message | SHOULD |

---

## 7. Non-functional requirements

| ID | Requirement | Target | Priority |
|---|---|---|---|
| N-01 | TypeScript strict mode; no `any` in application code | 100% | MUST |
| N-02 | Production build passes with zero errors and zero lint warnings | 0 | MUST |
| N-03 | Design tokens centralised; no brand hex hard-coded in components | 0 violations | MUST |
| N-04 | Runtime dependencies minimal and individually justified | ≤ 6 | MUST |
| N-05 | No secrets in client bundles or in the repository | 0 | MUST |
| N-06 | Components stay small and single-purpose | < 300 LOC guideline | SHOULD |

---

## 8. Page requirements (detail)

**Home.** Hero (full viewport, video, minimal nav) → About (editorial statement,
asymmetric) → Numbers (animated counters) → Expertise (index list with paired imagery) →
Major Projects (four featured; architecture supports n) → Management Team → Brands →
Latest News → Footer.

**Project detail.** Project Hero → Project Information → Description → Uniqueness → Our
Concept → Large Gallery → Rough Work / BTS → Project Information summary → Related Projects.

**Portfolio.** Name, image, short description, location, area size. Filters: All /
Residential / Commercial / Hospitality / Interior / Other. Filtering must be elegant,
minimal and URL-reflected.

**Products.** Custom Doors, Fabricated Sheet Work. Presented as part of the studio
ecosystem, not an e-commerce catalogue: no prices, no cart, no retail language.

**Collaboration & News.** Items may carry images, MoU documentation, date, organisation,
description and gallery.

**Sustainability.** Material responsibility, passive design, local context, energy, water,
adaptive reuse, responsible construction, long-term thinking. **No greenwashing.** Every
specific claim stays `PLACEHOLDER` until the studio supplies verified practice.

**Contact.** Conversational multi-step: intent → project type → location → scale → detail →
contact details → review → submit. Phase 1 is UI only; submission is stubbed and labelled.

---

## 9. CMS requirements — PLANNED, NOT IMPLEMENTED IN PHASE 1

The CMS must let non-technical editors manage: Projects, Portfolio, Products, News,
Collaborations, Team, Brands, Expertise, Homepage, Sustainability, SEO, Media and Contact
information.

**Selection constraints (MUST):** free or open-source · actively maintained · self-hostable ·
role-based access · draft/publish workflow · media library with alt text · rich text · SEO
fields · strong Next.js integration story.

**Explicitly rejected:** building a bespoke CMS from scratch without a compelling
architectural reason.

The evaluation and final decision are recorded in `architecture.md` and `memory.md`.

---

## 10. SEO requirements

**Phase 1 (MUST — structural):** semantic landmarks · one `<h1>` per page · ordered heading
levels · crawlable navigation · descriptive slugs · real text content · a meaningful `alt`
strategy · internal linking between related content.

**Future phases (MUST):** per-route metadata · canonical URLs · Open Graph · Twitter/X
cards · JSON-LD (`Organization`, `ProfessionalService`, `WebSite`, `BreadcrumbList`,
`Article`, `NewsArticle`, `ImageObject`, `CreativeWork`) · `sitemap.xml` · `robots.txt`.

Structured data must describe only content actually visible on the page.

---

## 11. Security requirements — PLANNED, NOT IMPLEMENTED IN PHASE 1

Threats to mitigate: XSS · CSRF · SQL injection · command injection · SSRF · path
traversal · IDOR · broken access control · authentication bypass · session attacks · brute
force · credential stuffing · malicious uploads · SVG injection · MIME spoofing · zip bombs ·
resource exhaustion · API abuse · enumeration · open redirects.

Controls: rate limiting on every state-changing and expensive endpoint · strategic,
privacy-friendly bot protection (Cloudflare Turnstile preferred) · upload validation by
size, MIME, extension and magic bytes · SVG sanitisation · storage isolation · security
headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame
protections).

**Phase 1 obligations that already apply:** no secrets in the repo · no untrusted
third-party scripts · no unsanitised external SVG · no `dangerouslySetInnerHTML` on
unvetted content.

---

## 12. Accessibility requirements

Target: **WCAG 2.2 AA**.

**MUST (Phase 1):** semantic HTML · keyboard operability for every interactive element ·
visible focus indicators · text contrast ≥ 4.5:1 and UI contrast ≥ 3:1 · accessible names on
icon-only controls · labelled fields with programmatic error association · focus management
for the menu overlay and multi-step flow · `prefers-reduced-motion` support · logical
screen-reader order · skip-to-content link · no keyboard traps · motion never the sole
carrier of meaning.

---

## 13. Performance requirements

| Metric | Target | Priority |
|---|---|---|
| LCP | < 2.5 s | MUST |
| INP | < 200 ms | MUST |
| CLS | < 0.1 | MUST |
| Hero poster | Served before video, correctly sized | MUST |
| Images | Modern formats, explicit dimensions, responsive sources | MUST |
| Below-fold media | Lazy loaded | MUST |
| Offscreen animation | Paused | MUST |
| Client JS on a content route | Minimal; interactive islands only | SHOULD |

Animation may never be the cause of a missed Core Web Vitals target.

---

## 14. Responsive requirements

Mobile-first. Explicitly designed and verified at
`320 · 375 · 390 · 768 · 1024 · 1280 · 1440 · 1920+`.

Mobile compositions are authored, not derived. Where a desktop layout does not survive
translation, the mobile layout is redesigned rather than compressed.

---

## 15. Animation requirements

Vocabulary: image reveals · text reveals · clip-path transitions · scroll-linked sequences ·
controlled scale · restrained parallax · hover states · page transitions · menu choreography.

Rules: every animation states a reason · exactly one smooth-scroll engine · reduced motion
renders the final state instantly · no animation of layout-triggering properties · nothing
animates offscreen · interface motion stays under ~300 ms unless it is a deliberate
cinematic beat · content is readable before its animation completes.

---

## 16. Media requirements

**Phase 1** uses clearly-labelled demo media from legitimately licensed sources. Demo media
is isolated in the data layer and marked `DEMO CONTENT`.

**Future media library metadata:** alt text · caption · credit · source · licence ·
dimensions · file size. Supported types: images, video, PDF, drawings, BTS material, MoU
documents.

---

## 17. Future requirements

**PLANNED — NOT IMPLEMENTED IN PHASE 1:** CMS · database · authentication · media storage
and CDN · contact processing and email · Fooocus image-generation service · analytics ·
rate limiting · CAPTCHA · upload pipeline · security headers · deployment automation.

Fooocus must never be required for the public site to function, and its credentials and
endpoints must never reach the browser.

---

## 18. Phase definitions

| Phase | Scope | State |
|---|---|---|
| **PHASE 1** | Design, UX, UI, layout, typography, responsive behaviour, animation, interaction, component system, page structure, demo content, and the frontend architecture the UI requires | **ACTIVE** |
| PHASE 2 | CMS selection, modelling, integration, content migration | Not started |
| PHASE 3 | Backend, contact processing, email, auth, database | Not started |
| PHASE 4 | Security hardening, rate limiting, headers, upload pipeline | Not started |
| PHASE 5 | SEO completion, structured data, sitemap, analytics | Not started |
| PHASE 6 | Performance, testing, deployment | Not started |
| PHASE 7 | Fooocus integration behind a service layer | Not started |

---

## 19. Acceptance criteria — Phase 1

Phase 1 is complete only when **all** hold:

1. Every Phase 1 route exists and renders with demo content.
2. Every listed component is built, reusable and typed.
3. No brand colour, font size, spacing value, duration or easing is hard-coded outside the token layer.
4. All content is read from `src/data/**`; no content literals in components.
5. Layouts verified at all eight breakpoints.
6. Keyboard navigation completes every journey; focus is always visible.
7. Contrast targets met across the palette, verified numerically rather than by eye.
8. `prefers-reduced-motion` renders complete, usable, final-state pages.
9. Production build passes with zero errors and zero lint warnings.
10. No lorem ipsum and no unlabelled placeholder blocks.
11. No section reads as a generic SaaS or agency template.
12. A Phase 1 completion report is delivered and approved before Phase 2 begins.
