# TECHNICAL ARCHITECTURE — UTHAN DESIGN STUDIO

**Status:** Living document
**Last updated:** 2026-08-30
**Current phase:** PHASE 1 — UI/UX

Everything under §2 is implemented. Everything under §3 is marked
`PLANNED — NOT IMPLEMENTED IN PHASE 1` and must not be built until its phase is approved.

---

## 1. Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Server components keep content routes light; the file-router maps cleanly onto the IA; metadata, sitemap and image primitives are needed in later phases and are built in |
| Language | **TypeScript (strict)** | The data layer is the contract the future CMS must satisfy; it has to be typed |
| Styling | **Tailwind CSS v4** with a CSS-first `@theme` token layer | v4 defines tokens as real CSS custom properties, so one file is the single source of truth and the site can be re-themed without touching components |
| Animation | **GSAP + ScrollTrigger** | One system owning scroll-linked and sequenced motion; avoids two libraries fighting over the same properties |
| Smooth scroll | **Lenis — the only smooth-scroll engine** | Evaluated against Locomotive Scroll. Lenis is smaller, actively maintained, does not take over layout, and integrates with ScrollTrigger through a documented ticker bridge. **Locomotive Scroll must never be installed alongside it.** |
| Fonts | `next/font` (self-hosted, no external request) | Removes a third-party origin, kills FOUT, and keeps CSP tight later |
| Runtime deps | `next`, `react`, `react-dom`, `gsap`, `lenis` | Five. Every addition needs a written justification in `ruler.md` terms |

**Rejected for Phase 1:** UI component libraries (the whole point is that this does not look
like a library), CSS-in-JS runtimes (cost at runtime for no gain here), Framer Motion
(would duplicate GSAP's role), state managers (no global client state exists), and
Three.js — see §2.7.

---

## 2. Phase 1 architecture — IMPLEMENTED

### 2.1 Directory structure

```
src/
├── app/                       # routes; server components by default
│   ├── layout.tsx             # fonts, shell, providers, skip link
│   ├── page.tsx               # home
│   ├── not-found.tsx          # 404
│   ├── about/page.tsx         # the practice (was /studio; /studio 308s here)
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── portfolio/page.tsx     # 308 to /projects; the two merged
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── sustainability/page.tsx
│   ├── contact/page.tsx
│   ├── careers/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── globals.css            # token layer + base layer only
├── components/
│   ├── navigation/            # SiteHeader, MenuOverlay, SearchPanel, Wordmark
│   ├── hero/                  # HomeHero, PageHero
│   ├── typography/            # index.tsx: SectionHead, Eyebrow, Statement, Prose
│   ├── projects/              # ProjectCard, WorkCard, ProjectHero, ProjectFacts,
│   │                          #   ProjectSlideshow, ProcessGallery, ProjectSymbol,
│   │                          #   RelatedProjects
│   ├── portfolio/             # PortfolioGrid
│   ├── products/              # ProductCard, ProductGallery
│   ├── news/                  # NewsCard
│   ├── team/                  # TeamGrid
│   ├── brands/                # LogoMarquee
│   ├── contact/               # ContactFlow, SocialIcon, StudioMap
│   ├── footer/                # SiteFooter
│   ├── sections/              # homepage bands: AboutStatement, Numbers,
│   │                          #   ExpertiseIndex, FeaturedProjects, LatestNews,
│   │                          #   ClosingCTA
│   ├── motion/                # Reveal, RevealText, Counter, SmoothScroll,
│   │                          #   LoadingSequence, PageTransition, MotionFailsafe,
│   │                          #   NeonMark
│   └── ui/                    # Container, Section, Media, Button, BackgroundVideo,
│                              #   CategoryFilter, Lightbox, CrosshairCursor,
│                              #   TerraceMotif, ViewMore
├── data/                      # ALL content. Typed. Demo-flagged.
├── lib/                       # gsap.ts (registration + motion helpers), labels.ts
├── types/                     # the content contract
└── hooks/                     # useFocusTrap, useLockBodyScroll
```

Alongside the app, `scripts/` holds the media pipeline and review tooling. None of it ships:

| Script | Purpose |
|---|---|
| `fetch-media.mjs` | Demo media by free-text search (first pass) |
| `fetch-curated.mjs` | Demo media from Commons' peer-reviewed Featured / Quality categories |
| `process-media.mjs` | Downscale, re-encode, and generate `src/data/media.generated.ts` with real on-disk dimensions |
| `contact-sheet.mjs` | Labelled contact sheets of the library, for the curation review |
| `audit.js` | In-browser accessibility and layout audit (contrast, headings, targets, overflow) |

### 2.2 Component architecture

Four tiers, and a component may only depend downward:

1. **Primitives** (`ui/`, `typography/`, `motion/`) — no domain knowledge. `Container`,
   `Rule`, `Media`, `Reveal`, `Counter`. Reusable anywhere.
2. **Domain components** (`projects/`, `portfolio/`, `news/`, …) — know one content type.
   They accept typed props; they never import from `data/` themselves.
3. **Sections** — compose domain components into a page band. Own their own spacing rhythm.
4. **Routes** (`app/**/page.tsx`) — the only place `data/` is read. Fetch, then pass down.

This single rule — *only routes read data* — is what makes the future CMS swap a change to
one layer instead of a rewrite.

**Server/client boundary.** Server components are the default. `"use client"` appears only
where an island genuinely needs it: the menu overlay and search panel, the contact flow,
the interactive galleries (slideshow, viewer, team card), and the motion primitives. The
category filter is deliberately *not* one — it is real links, so a filtered view stays
linkable and crawlable and ships no JavaScript. Sections stay server-rendered so content is in the HTML for crawlers and
for users without JavaScript.

### 2.3 Design-system architecture

`src/app/globals.css` holds three layers and nothing else:

1. `@theme` — the token definitions (colour, type scale, spacing, radius, duration, easing,
   breakpoints, container widths). This is the **only** place a literal brand value appears.
2. `@layer base` — element defaults, focus-visible treatment, reduced-motion overrides,
   selection colours.
3. `@layer components` — a very small set of genuinely repeated compositions.

Components consume tokens through Tailwind utilities that resolve to those custom
properties. A hard-coded hex, px font size, or arbitrary duration in a component file is a
review failure, not a style preference.

### 2.4 Media pipeline

Three layers, so that sourcing, curation and consumption stay separable:

1. `src/data/media.generated.ts` — the raw library. Machine-written from the media
   directories, carrying real post-optimisation dimensions and full provenance (creator,
   licence, source URL) per asset. Never edited by hand.
2. `src/data/media.curation.ts` — **hand-authored.** Named sets (`hero`, `project`,
   `interior`, `process`, …) mapping roles to specific asset ids. Every asset was reviewed
   on a contact sheet before assignment; roughly two-thirds of what was downloaded was
   deleted rather than used.
3. `src/data/media.ts` — the accessor. `img(set, index, alt)` returns a typed `MediaAsset`.
   The index wraps, so a layout asking for six frames from a set of four renders six images
   rather than four images and two holes.

Content files ask for a *role*, never a file path. When the CMS lands, only layer 3 changes.

### 2.5 Content abstraction — the CMS contract

`src/types/content.ts` defines the shape of every content entity: `Project`,
`PortfolioItem`, `Product`, `NewsItem`, `TeamMember`, `Brand`, `ExpertiseArea`,
`Statistic`, `SustainabilityPrinciple`, `MediaAsset`, `Seo`.

`src/data/*` exports typed arrays plus accessor functions:

```ts
getProjects()      getProjectBySlug(slug)   getFeaturedProjects(limit?)
getPortfolio()     getNews()                getNewsBySlug(slug)
getRelatedProjects(slug, limit?)            …
```

Routes call the accessors, never the arrays. When the CMS lands, the accessor bodies become
`async` fetches and the return types do not move. Every accessor is already written to be
`await`-safe at the call site.

`MediaAsset` carries `src`, `alt`, `width`, `height`, `caption?`, `credit?`, `source?`,
`licence?` from day one — the same metadata the future media library will store — so no
migration is needed later.

Demo content is marked with `isDemo: true` and a `DEMO CONTENT` banner comment at the top
of every data file.

### 2.6 Routing

File-based, flat, and descriptive. Dynamic segments are `[slug]` and resolved through the
accessor functions. `generateStaticParams` is used on `[slug]` routes so every project and
article is statically rendered and individually crawlable. Filter state on `/portfolio`
lives in the URL query string, not component state, so a filtered view is linkable and
shareable.

### 2.7 Animation architecture

- `SmoothScroll` (client, mounted once in the root layout) owns the single Lenis instance
  and drives GSAP's ticker. It is the only place Lenis is constructed. It destroys itself
  and removes the ticker callback on unmount.
- `Reveal` / `RevealText` are declarative wrappers over ScrollTrigger. Markup renders in its
  final, readable state; the animation subtracts from that state and then restores it, so a
  JS failure leaves the page complete rather than blank.
- `RevealText` splits headings into words for staggered entry, but keeps an unsplit
  accessible name and hides the split fragments from assistive technology.
- `Counter` animates a numeral only when in view, once, and writes the final value
  immediately under reduced motion.
- Every timeline is created inside `gsap.matchMedia()` with a
  `(prefers-reduced-motion: no-preference)` condition. Under `reduce`, Lenis is not
  constructed at all and scrubbed timelines never exist — final states render immediately
  rather than animating faster.
- Simple hover, focus and tap states are CSS transitions. ScrollTrigger is reserved for
  genuinely scroll-linked or pinned sequences. Two systems never animate the same property.
- `MotionFailsafe` is the guarantee behind all of it. Armed start states are CSS-only under
  `html.js-motion`, which covers no-JS and reduced motion; the failsafe covers everything
  else by releasing any element still armed and on screen after four seconds. The site
  cannot hide its own content behind a broken animation.

**Z-index scale.** `60` menu overlay · `70` site header · `80` page transition · `90` intro.
The header sits *above* the overlay so the wordmark stays visible, and the overlay — which
is `aria-modal` — carries its own close control, because a control outside the dialog would
be unreachable by keyboard and invisible to a screen reader.

### 2.8 Three.js — evaluated and deliberately excluded

A WebGL layer was considered for the hero. It was rejected: the art direction is
photographic and typographic, the hero's job is to show real architecture, and a shader
would have been ornamental depth over the top of the actual subject. Excluding it also
removes a large bundle, a device-pixel-ratio budget, a context-loss failure mode and a
poster fallback path. This is a recorded decision, not an omission — see `memory.md`.

### 2.9 Asset architecture

```
public/
├── media/        # demo photography and video (labelled, licence recorded in data layer)
├── brand/        # the studio mark and favicons
└── og/           # social card images (future)
```

Images render through `next/image` with explicit `width`/`height` from `MediaAsset`, so
`CLS` is structurally prevented rather than tuned. Below-fold media is lazy by default; the
hero poster and first project image are `priority`. Video ships with a poster, is muted,
`playsinline`, looping, and pauses when offscreen or when the document is hidden.

**Video never ships as delivered.** A camera or phone export arrives as HEVC in a
QuickTime container — 30MB+ for a few seconds, with an audio track the muted hero never
plays, and patchy browser decode support outside Safari. `scripts/transcode-hero.mjs`
re-encodes it into what `BackgroundVideo` actually serves: WebM (VP9) as the primary
source, MP4 (H.264) as the compatibility fallback, both muted and scaled to 1920px, plus
a poster JPEG extracted from the video's own first frame — so the static fallback and
the video's real opening frame are the same image, not two different photographs handed
off mid-page-load. `VideoAsset.sources` is an ordered array for exactly this reason: the
browser plays the first `type` it can decode. Raw masters live in the gitignored
`media-source/` directory, never in `public/` (see CLAUDE.md).

### 2.10 Responsive architecture

Breakpoint tokens live with the other tokens. Layout is composed from a shared 12-column
grid primitive with a fluid gutter. Type scales fluidly with `clamp()` between an explicit
minimum and maximum rather than stepping at breakpoints. Where a desktop composition cannot
survive translation — the expertise index and the project detail gallery in particular — the
mobile version is a separately authored composition, not a reflow.

---

## 3. Future architecture — PLANNED, NOT IMPLEMENTED IN PHASE 1

### 3.1 CMS — ADOPTED, PHASE 2 IN PROGRESS

Decision framework, to be executed and confirmed at the start of Phase 2. Candidates carried
forward: **Payload CMS**, **Directus**, **Strapi Community Edition**, **Sanity (free tier)**,
**Keystone**.

Scoring criteria, in the client's priority order: free availability · licence · self-hosting ·
non-technical editor experience · media management · image handling · rich text ·
draft/publish workflow · authentication · roles · SEO fields · API quality · Next.js
compatibility · security posture · maintenance activity · deployment complexity.

**Confirmed and adopted by the studio on 2026-09-06: Payload CMS** (`payload@3.88.0`,
supported against this project's Next 16.3.3). The scoring framework above was not run to
completion — the studio took the provisional recommendation as it stood, which is their call
to make and is recorded here so nobody later mistakes it for the output of the comparison.
Directus remains the fallback. It is
MIT-licensed and free when self-hosted, runs inside the same Next.js application (one deploy
target rather than two), is TypeScript-native so the `src/types/content.ts` contract can be
generated from the same definitions, and ships drafts, versions, roles, media handling and
SEO fields without paid tiers. The main risk is that it couples CMS availability to the web
app; Directus is the fallback if the studio prefers a fully decoupled service. That risk is
now accepted rather than hypothetical: if Payload cannot boot, neither does the marketing
site. The accessor boundary in §2.5 is what keeps the fallback available, so it is
load-bearing from here rather than merely tidy.

### 3.2 Database — SQLITE IN DEVELOPMENT, POSTGRESQL STILL THE TARGET
PostgreSQL, driven by whichever CMS is selected. No direct database access from route
handlers; all reads go through the content layer.

**Deviation, recorded rather than quietly taken (2026-09-06).** Phase 2 runs on SQLite via
`@payloadcms/db-sqlite`. There is no PostgreSQL on the development machine and no Docker to
run one — checked before choosing: neither binary installed, nothing listening on 5432 — so
the Postgres adapter would have produced a CMS that could not boot on the machine it is
being built on. Payload's adapters are a config swap plus a migration, so this defers the
infrastructure decision rather than replacing it. **Production is still PostgreSQL**, and
switching is a Phase 3 task, not a rewrite. The database file (`uthan.db`) and the uploads
directory (`media/`) are gitignored: both are local state, and `media/` is deliberately
outside `public/`, which is served verbatim.

### 3.3 Authentication — PLANNED, NOT IMPLEMENTED IN PHASE 1
CMS-owned. Editor / Author / Admin roles. No public authentication surface exists on the
marketing site, which removes an entire attack class by design.

### 3.4 Media storage & CDN — PLANNED, NOT IMPLEMENTED IN PHASE 1
Object storage behind a CDN, with derivative generation at upload. The `MediaAsset` type is
already shaped for this.

### 3.5 Contact system — PLANNED, NOT IMPLEMENTED IN PHASE 1
Server action → validation → rate limit → bot check → persistence → transactional email.
The Phase 1 flow is deliberately stubbed at the submit boundary so this drops in behind an
unchanged UI.

### 3.6 Fooocus integration — PLANNED, NOT IMPLEMENTED IN PHASE 1

```
CMS → Media Manager → Image Generation Service → Fooocus
                                      ↓
                        Generated image → Review → Approve → Publish
```

Constraints that are architectural, not optional: Fooocus sits behind a backend service
layer; no credential or internal endpoint ever reaches the browser; the public site
functions completely when Fooocus is offline; generated images enter the library as drafts
requiring human approval.

### 3.7 SEO — PLANNED, NOT IMPLEMENTED IN PHASE 1
Route-level `generateMetadata`, canonicals, Open Graph, Twitter/X cards, JSON-LD, generated
`sitemap.xml` and `robots.txt`. Phase 1 has already built the semantic structure this needs.

### 3.8 Analytics — PLANNED, NOT IMPLEMENTED IN PHASE 1
Privacy-respecting, cookieless, self-hosted or EU-hosted. No third-party tag manager.

### 3.9 Security — PLANNED, NOT IMPLEMENTED IN PHASE 1
Headers (CSP without `unsafe-inline`, HSTS, X-Content-Type-Options, Referrer-Policy,
Permissions-Policy, frame protections) · rate limiting · Turnstile on abuse-prone flows ·
upload validation by magic bytes · SVG sanitisation · isolated storage origin.
Self-hosted fonts and zero third-party scripts in Phase 1 are what make a strict CSP
achievable later.

### 3.10 Deployment — PLANNED, NOT IMPLEMENTED IN PHASE 1
Target undecided. Constraints: Node runtime for the CMS, CDN in front of static output,
preview deployments per branch, environment secrets never in the repository.

---

## 4. Architectural invariants

These hold across every phase and are not renegotiated per feature:

1. Content flows one way: data layer → route → section → component.
2. Only routes read the data layer.
3. Only `globals.css` contains literal design values.
4. One smooth-scroll engine. One animation system.
5. The page is complete and readable before any animation runs.
6. No secret is ever available to the browser.
7. Future infrastructure is not implemented early "while we are in here".
