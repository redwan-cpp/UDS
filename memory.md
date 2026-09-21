# PROJECT MEMORY — UTHAN DESIGN STUDIO

```
CURRENT PHASE:
PHASE 4 — SECURITY
```

**Phase 2 → 3 gate passed, 2026-09-17** (`process.md` §5). CMS selected and recorded (Payload,
`architecture.md` §3.1). Every content type is modelled *and read by the site* — see "Modelled
is not the same as wired" below for the last four that were not. A non-technical editor at the
studio created and published real work unaided on the live site: the project *Rakhalia Krishi
Bari* and the news post announcing the Redova collaboration.

**Phase 3 → 4 gate passed 2026-09-21, deliberately without both criteria fully met — the
studio's call, recorded rather than smoothed over.** PostgreSQL in production, the contact form
stores enquiries in the panel (`34f700f`), and no secret reaches the browser (verified by
reading every non-`NEXT_PUBLIC_` env reference in the source — all of them stay in
`payload.config.ts` and collection server code, never in a `"use client"` file). The site is
also already **deployed** — a BDIX VPS behind Caddy (`deployment.md`) — Phase 6 work done early
because the studio needed a live site.

**Two items deliberately deferred, not resolved:**
- **A restore test of the off-site Backblaze backup has not been run.** Nobody has confirmed
  the backup is actually restorable, only that it's being written. Needs VPS + Backblaze access.
- **"Roles enforced" is only half true.** `Users.ts` itself is solid — only an admin can create
  or delete a user, or change a role, and self-promotion is impossible. But `editorAccess`
  (`collections/fields.ts`), which every content collection uses, only checks "is anyone signed
  in" — it does not distinguish Editor from Author, so the documented "Author — writes,
  publishes own work" scoping is not actually enforced anywhere. An Author can edit anything an
  Editor can. Not urgent while the studio only has editor/admin accounts, but the documented
  behaviour and the enforced behaviour disagree, and that gap is what's recorded here, not
  papered over.

**Security headers, 2026-09-21** — the first Phase 4 item (`project-requirement.md` §11):
CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'`,
all in `next.config.ts`'s static `headers()`, scoped to the public site only (`/admin` and
`/api` excluded — Payload's admin UI is not audited against this policy, and breaking the
studio's only way to manage the site is a worse outcome than a narrower scope for now).

**`script-src` carries `'unsafe-inline'`, and that was not the first attempt or a shortcut.**
A nonce-based CSP was built first, correctly, and empirically cost every route its static/ISR
caching the moment a page called `headers()` to read the nonce — confirmed in the build output,
not assumed. A hash-only policy (no nonce, covering just this site's own fixed inline scripts)
was built next and shipped through an actual production build into a real browser — and Next's
own App Router turned out to inject several inline scripts of its own for RSC/streaming payload
delivery, a different one on every render, with no supported way to disable the mechanism.
Blocking them broke hydration outright (`React error #412`) on every route tested, not just
structured data or animation. Given this project's own performance requirements
(`project-requirement.md` §13) and the amount of recorded effort that has gone into keeping
routes static (`generateStaticParams` on every `[slug]` route, the image/bundle work throughout
this file), `'unsafe-inline'` on this one directive is the considered trade, not an oversight —
every other directive stays strict, including `object-src 'none'` and `frame-ancestors 'none'`.
Dev mode also carries `'unsafe-eval'` (React's stack-trace reconstruction in Turbopack/HMR —
"React will never use eval() in production," per its own warning), gated on `NODE_ENV` so
production stays as strict as it can actually be.

**Turnstile, 2026-09-21** — the bot defence `Enquiries.ts` already named as owed. Dormant
until `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are set, same pattern as SMTP:
the studio gets a working form guarded by the honeypot and rate limits alone until Cloudflare
keys exist, not one that silently rejects every submission. `Turnstile.tsx` renders nothing
without a site key; `turnstileOk()` in `Enquiries.ts` returns `true` (does not block) without a
secret key, and also on a network failure reaching Cloudflare — the visitor's connection
dropping is not the visitor's fault, and the honeypot/rate limits are still standing guard
either way. `appearance="interaction-only"`: most visitors see nothing at all.
- **Verified end to end using Cloudflare's own published dummy test keys** (documented at
  `developers.cloudflare.com/turnstile/troubleshooting/testing`, not secrets) — both the
  accept path (`1x00...AA` site key + matching always-pass secret → `201`) and the reject path
  (same site key, paired with the always-*fail* secret → `400`, same generic message as the
  honeypot). The honeypot was re-checked afterward too, since it now shares a hook with
  Turnstile — still rejects on its own before Turnstile is ever reached.
- **The CSP built two entries earlier needed one addition**: `https://challenges.cloudflare.com`
  in `script-src`, `frame-src` and `connect-src` (`next.config.ts`) — Turnstile loads a script
  and renders its challenge in an iframe from that origin. Present in the policy even while the
  studio's keys are unset, since the widget renders nothing without a site key regardless.
- **Not yet done: the privacy page doesn't mention Turnstile.** It currently names the Google
  Maps embed as the site's only third-party content, which stops being true the moment the
  studio's Cloudflare keys are added. Update it then, not now — the disclosure should describe
  what's actually live, and Turnstile isn't yet.

**Enquiries reach the studio through the panel only — the studio declined email,
2026-09-17.** For this site, "persist and deliver" means *saved and visible under Inbox →
Enquiries*. Two consequences, accepted: someone must check the panel at least every 10 days,
because enquiries are deleted after that whether read or not (the studio chose this over
deleting only handled ones); and the panel's "Forgot password" sends nothing, so a locked-out
editor is reset by an admin. The email code is dormant, not removed — adding `SMTP_USER` /
`SMTP_PASS` turns it on.

Durable decisions only. Not a log, not a changelog. If a line here stops being true, change
it deliberately and say why — reversing something in this file is a decision, not a tweak.

---

## Client

- **Uthan Design Studio** — architecture and design practice.
- **Every business fact is unsupplied.** Legal name, address, founding year, principals, team,
  regions, real projects, real statistics, real clients, real sustainability practice: all
  `PLACEHOLDER`. Nothing about the studio may be invented to fill a layout.
- Products arm confirmed in brief: **Custom Doors**, **Fabricated Sheet Work**. Each has its
  own route (`/products/[slug]`) carrying the materials, applications and specification; the
  index is cards only. Categorised (`doors`, `metalwork`) behind the same filter the project
  index uses. Two lines and two categories is a thin filter and that is the honest state of
  it — inventing a third category to make the row look busier would be claiming a capability
  the studio has not.
- Homepage section order is client-specified. **Revised by the studio:** Hero → the opening
  spread (About statement + expertise browser, one section) → Major Projects → Numbers +
  collaborator marquee → Latest News → Closing CTA → Footer. The figures moved below the
  work at the studio's request: they read as evidence for what has just been shown rather
  than a claim made before showing anything.
- **The homepage alternates ground strictly**, black and white the whole way down: hero ink,
  spread paper, projects ink, figures paper, news ink, closing paper, footer ink. Requested
  by the studio, and it is why `LatestNews` is dark and `ClosingCTA` light rather than the
  other way round — those two were flipped to close the only gap in the run. About and Expertise were themselves two separate bands, with the
  figures sitting between them, until the studio asked for them merged — see Layout
  decisions. The Management Team band was removed from the homepage and lives on
  About (`/about`), which already carried a fuller version — the homepage was showing a
  truncated second copy. The collaborator names survive on the homepage as the marquee
  under the figures.
- **The practice page is `/about`, not `/studio`.** Renamed at the studio's request — route,
  nav label target, search index, and every internal link moved together in one pass; a
  permanent redirect from `/studio` (`next.config.ts`) covers anything still pointing at the
  old path. The figures band on this page is now the *same* `Numbers` component the homepage
  uses (hover rule-draw, accent lift on the numeral) instead of a second, static `<dl>` —
  two places showing the same numbers two different ways read as an inconsistency, not a
  variation worth keeping.
- Its own **Collaborators section is gone**, not just relabelled. `BrandIndex` and
  `BrandsSection` were left orphaned by that removal and have since been deleted.
  `brands.ts` and `LogoMarquee` have **not** — an earlier note here claiming they were
  orphaned too was simply wrong, and they still feed the homepage collaborator marquee
  through `Numbers`.
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
- **The accent belongs to ink; paper is monochrome.** Pistachio `#B7D77A` on dark. On light
  `--color-accent` resolves to **ink**, so warm white carries no colour and emphasis is a
  17.5:1 tonal step against mute-deep. Pistachio measures 1.4:1 on warm white and is
  *prohibited* there — the single most-broken rule in the palette, and now impossible to
  break by reaching for the accent token.
  - This reverses the olive light-surface accent, at the studio's request: it was legal at
    6.4:1 but read as a tint rather than as emphasis, while carrying every index number,
    eyebrow and active state on half the site. Nothing depended on the hue — every active
    state already carries weight, a drawn rule or `aria-current` — so it cost a
    reinforcement, not a signal, and the focus ring improved from 6.4:1 to 17.5:1.
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
- **Index thumbnails are desaturated and return to colour on hover — reversing "no filters
  on architecture photography"**, at the studio's request. It applies to project cards only
  (`WorkCard`, the project index), never to a full-bleed plate, a case-study gallery, the
  hero or a product image: a grid of competing thumbnails reads as one field with a
  consistent tone, and the card being considered is the one that comes back — so the
  photograph is never *shown* edited, only held in a contact-sheet register until chosen.
  Fine pointers only, since with no hover there is nothing to restore the colour — **and 768px
  and up** (2026-09-17): some phone browsers report a fine, hovering pointer, so the pointer
  test alone left phone cards grey for good. `filter`
  is on the compositor's accelerated list alongside `transform` and `opacity`, so this does
  not breach the "everything composites" rule.
- **One background motif.** `TerraceMotif` — the stepped mass as a filled silhouette, on
  the ink figures band. A drawn counterpart on the light bands (`SectionSketch`: outline,
  slab edges, dashed gridlines with bubbles, poché hatch, a dimension run with 45° ticks)
  was built and then removed at the studio's request. Kept in the record because the
  reasoning survives it: an architectural line drawing carries a specific building, so it
  has to be authored rather than sourced, and a motif spread across every section stops
  being restraint and becomes wallpaper.
- **The supplied lockup is the footer's closing mark, at scale; the header carries no mark
  at all.** The footer previously set `UthanMark` beside the name in Barlow — a
  reconstruction of the lockup rather than the lockup, which overruled spacing and
  letterforms the studio had already decided. It now uses the artwork, served as a file
  rather than inlined (29 paths on every page for a mark that caches once) from an
  ink-ground derivative, since the supplied file is drawn for a light page and the footer is
  always ink. The header lost its mark in the same pass: small in a fixed header on top of
  the same mark at scale in the footer, it read twice on every page.
  - The derivative is generated, and two things about that generation are load-bearing.
    The supplied file is sized in percentages, which leaves it with no intrinsic dimensions
    and collapses it to nothing inside an `<img>` — it takes the viewBox's own 917×300. And
    the header comment must contain no `--`: a double hyphen is illegal inside an XML
    comment and makes the whole document malformed, which presents as a broken image and
    not as any kind of parse error. Both were shipped and caught in the browser first.
  - It renders `unoptimized`. Next's image optimizer refuses SVG unless
    `dangerouslyAllowSVG` is set, and that flag applies to every image the optimizer ever
    handles, remote included — a real widening of the attack surface to buy nothing, since
    there is no raster work to do on a vector.
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
- **The reading end of the scale was raised one step** (body 16→17px, small 14→15px,
  caption 13→14px, meta 11→12px, nav 13→14px, h3 floor 20→22px) because the studio's
  clients skew older. Display, h1 and h2 were left alone deliberately: they were never the
  legibility problem, and enlarging them would have cost every composition its proportion
  to fix something that was not broken. The hierarchy compresses a little as a result,
  which is the correct trade. Measure caps are in `ch`, so they scaled with the type and no
  line length changed.

---

## Architecture decisions

- **Next.js 16 App Router · TypeScript strict · Tailwind v4 (CSS-first `@theme` tokens)**.
- **Five runtime dependencies**: `next`, `react`, `react-dom`, `gsap`, `lenis`. A sixth needs
  a written justification.
- **Only routes read `src/data/**`.** Sections and components receive typed props. This one
  rule is what makes the Phase 2 CMS swap a change to one layer instead of a rewrite.
- `MediaAsset` carries `alt`, `caption`, `credit`, `source`, `licence`, `width`, `height` from
  day one, matching the future media library, so no migration is needed later.
- Server components by default. `"use client"` only for: menu overlay, work-index filter,
  contact flow, motion primitives, team card expand.
- Work-index filter state lives in the URL, not component state — linkable and shareable.
- **Projects and Portfolio are one collection, 2026-09-13 — reversing the original split, at
  the studio's request.** Two collections described the same building at two depths: a
  portfolio entry was the card, a project was the case study, and `projectSlug` tied them
  together. The routes merged early (`/portfolio` has 308'd to `/projects` since Phase 1) but
  the collections did not, so every piece of work had to be entered twice and kept in step by
  hand — which is the part an editor actually feels, and what the studio asked to be rid of.
  The split was not wrong when it was made: it let the index carry work nobody had written
  up, without forcing a hero, a gallery, a description and a facts table onto each one. That
  requirement survives, met differently — those fields are simply no longer required on a
  Project, and **an empty `description` is now what marks a card**. A project with one gets a
  page and is linked to; a project without appears in the index and nowhere else.
  `generateStaticParams`, the detail route, the related strip and the search index all read
  that same test, so nothing is built, linked or indexed that would 404. The homepage band is
  unchanged: it was always Projects filtered by `featured`.

- **Editorial prose gets Word-style character formatting — bold, italic, underline,
  strikethrough, sub/superscript, links — and stops there, 2026-09-17.** Applies to the
  fields always rendered through `Prose`: `Project.description` / `uniqueness` / `concept`,
  `News.body`, `Knowledge.body`, `Product.description` (`richParagraphs()` in
  `collections/fields.ts`, Payload's Lexical editor). **No headings, lists, quotes, colours or
  font sizes**: `design.md`'s type scale is closed, and those are the controls that let an
  editor defeat it. Links are URL-only (internal document links would need a route resolver
  per collection). `content.ts` carries it as `Paragraph = string | RichParagraph`, so the
  plain-string demo data needed no edits.
  - **Enter makes a new paragraph, not a run-on.** `toRichParagraphs` splits every row into its
    paragraphs, so each still gets its own `<p>` and its own scroll trigger (rule 5). HTML comes
    from Payload's own converters (text escaped, URLs sanitised) with only the wrapping `<p>`
    removed, because `Prose` already renders one.
  - **The rich text is a new `content` column; the old plain `text` column is kept, hidden.**
    Converting `text` in place is a varchar→jsonb change Postgres will not cast, so the schema
    push offers to drop the column — which on the live site held the paragraphs the studio had
    already published. `scripts/migrate-rich-text.ts` copies each `text` into `content` and is
    safe to re-run; the site reads `text` for any row not yet moved (including old versions
    restored from history). Remove the hidden column only after every environment has migrated.
  - **Excluded on purpose:** the Studio statement / approach / About paragraphs. The homepage
    and About page set `paragraph[0]` as a display-scale lead line, where bold and links read
    as noise. Same pattern if it is ever wanted.
  - `npm run generate:importmap` after changing the editor's features — without it the admin
    field renders as an empty box with no error.

- **Modelled is not the same as wired — the CMS gap this project kept reopening.** Five times a
  collection or global existed in the panel, was seeded, and was read by nothing, so an editor's
  save changed nothing on the site: the studio profile (`4c38421`), the menu (`d92fa1a`), and on
  2026-09-17 **Site copy** (every heading and standfirst — routes still imported `copy.ts`),
  **Careers** (the page imported `careers.ts`), **SEO fields** (no accessor read `seo`), plus the
  **search index** (built from the static demo modules, so the studio's own project and news
  post were unsearchable). All now read the CMS: `getCopy()` lays the global over `copy.ts`
  field by field (blank keeps the default; `copy.ts` also fixes the set of keys), and
  `pageMetadata` / `articleMetadata` take the item's `seo` overrides, including `noIndex`.
  **Test for a new content type is not "it appears in the panel" but "change it in the panel
  and see the page change."**
  - **Still static, knowingly:** the contact form's enquiry topics (`contact.ts`) and the
    privacy / terms page bodies, which are placeholders until the studio supplies a policy.
    The privacy placeholder also still says the site has no backend — stale since the contact
    form began storing enquiries, and something the real policy must cover.

- **Uploaded photographs are capped at 2560px wide when saved, 2026-09-17** (`Media` upload
  `resizeOptions`). The studio uploads straight from renderers — 7680×4320, 4–8MB — and the
  two-vCPU server cut each display size from that original at 4–6s a time, so a ten-image
  project page timed out on phones. The site never requests wider than 2048, so nothing
  visible is lost. Width only, so a tall portrait keeps its full width. SVG is untouched.
  `scripts/shrink-media.ts` applies the same cap to files uploaded before it (back up first:
  originals are replaced in place, same filename and URL).
- **Any uploaded hero video replaces the shipped clip** — an MP4 alone is enough; WebM and the
  poster are optional (`db129d2`). Requiring all three made an MP4-only upload silently do
  nothing. **The footer's developer credit is a Studio global field** (label + URL), not a
  constant.

---

## Layout decisions

- **The About statement and the expertise index are one spread**, not two bands with the
  figures between them. They answered one question in two places across roughly three
  screens; merged, the statement holds the left and the nine areas become a browsable
  column on the right. `ExpertiseIndex` is gone; `ExpertiseBrowser` replaces it.
  - **Equal halves on one paper ground, divided by a vertical hairline.** A split-surface
    version — paper left, ink right, each bleeding to its own viewport edge — was built and
    rejected by the studio: two grounds inside one section read as two sections shoved
    together, and it made the right half recede rather than sit beside its neighbour. Worth
    keeping in the record because the mechanics were sound and may be wanted elsewhere: the
    split has to live outside `Container` for a ground to reach the viewport edge, with each
    half's content capped at half the container width and hugged to the centre line so
    alignment still matches every other section.
  - **All nine areas must be on screen at once.** An index you scroll to finish reading is a
    list, and the point of the shape is that the whole set stays visible while one is open.
    So the photograph is sized in `vh` rather than by aspect ratio: on a short viewport it
    gives up height and the rows stay put. Measured at 1366×640 the panel is 634px with the
    frame down to its 128px floor — still nine rows, still no scroll.
  - The right panel is a real tablist — hover opens a row on a fine pointer, Up/Down, Home
    and End work from the keyboard, roving `tabindex` keeps it to one tab stop. The old
    rows were deliberately *not* focusable on the reasoning that a tab stop swapping a
    decorative image is a trap with no payoff; that stopped being true the moment the
    description travelled with the image, since a keyboard user who cannot reach the rail
    cannot reach eight ninths of the content.
  - The rail carries **titles, not bare numerals**. The first attempt was a row of nine
    numbers, which hid what the areas are and gave a 16×25px target — under the WCAG 2.2
    floor and under this site's own 44px rule. Caught by the audit, not by review. Rows
    fix both structurally rather than by padding a too-small control.
  - Column proportion went 6/5 → 7/4 → 6/6 as the studio asked for equal halves. The 16:9
    frame stayed from the 7/4 pass, where it was introduced because a 4:3 plate left the
    right column 360px taller than the left. With two grounds the imbalance stopped
    mattering: the grid stretches both halves to the same height, so the shorter side reads
    as a matted panel rather than as bare ground under the text.
  - The homepage About photograph went with it. That frame is still curated elsewhere, so
    nothing is orphaned; the spread carries nine photographs now instead of one.

- **Vertical rhythm and display type are fluid on both axes, not on width alone.** Section
  padding was fixed breakpoint steps, which made it a function of viewport *width* and
  nothing else: a 1366×640 laptop hit the `lg` step and spent 384px of a 640px viewport on
  padding — 60% of the screen empty, with the content it framed squeezed into what was left.
  The values were correct for the tall display they were tuned on and wrong for most of the
  machines they meet. `--space-pivotal` / `--space-standard` / `--space-connective` now clamp
  against `min(vh, vw)`, as do `--text-display` and `--text-h1`: the `vh` term binds on short
  and ultrawide monitors, the `vw` term on phones, which are tall and narrow and where a
  height-only rule would go wrong in the other direction. Verified by measurement from
  320×640 up to 2560×1400, including a 2400×700 ultrawide.
- Tailwind's `py-(--token)` paren shorthand did not compile for these while `px-(--gutter)`
  did; `py-[var(--token)]` does. Not worth diagnosing further — the bracket form is the
  canonical syntax and it is what these use.

- **One `CategoryFilter` serves both indexes**, and it scrolls sideways rather than wrapping.
  A wrapping filter row is fine at six categories and quietly fails at sixteen: it grows
  downward and pushes the results it is filtering off the screen. It replaced
  `PortfolioFilter`, which also read `src/data` directly — a standing violation of the
  "only routes read `src/data`" rule; the filter list now arrives as a prop.
  The scrollbar is kept and themed (`.uds-scroll-x`) rather than hidden, in the *secondary*
  tone: an accent thumb sat a few pixels under the active filter's own drawn accent rule and
  the two read as one confused mark. The edge fade is right-side only — at rest the row is at
  scroll 0, so a symmetrical fade dims the active filter to signal content that is not there.

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
- **`/products` is the card grid and nothing else — there is no per-product detail view.**
  This went through two revisions before landing here, both worth keeping: the original
  build paired a full three-paragraph `Prose` block and a large serif `Statement` under each
  product's title with a `ProductFeature.tsx` detail section (materials, applications, a
  spec table, a real image gallery with a clickable thumbnail rail) reached by anchor-scroll
  from its card. The studio's actual ask, once seen, was narrower than either version: no
  detail section at all, just the cards. `ProductFeature.tsx` is deleted; `ProductCard`'s
  bottom prompt no longer promises "Materials & specification" it can't deliver — it reads
  "Enquire" and links straight to `/contact`, same as the search index's product entries
  (`/products`, not a `#slug` anchor that no longer resolves to anything). Two things caught
  while the detail view briefly existed, worth remembering even though the component is
  gone: a thumbnail-swap `<Media>` keyed to the active frame remounts its
  `Reveal variant="curtain"` on every click, re-arming a scroll trigger whose position may
  already be scrolled past — it gets stuck at `opacity: 0` rather than firing again, fixed
  by dropping the `key` (`Media` already cross-fades a changed `src` in on its own `load`).
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
- **Gallery plates and slideshow frames open a glass viewer** (`Lightbox`). The whole
  photograph is fitted rather than cropped — the one place on the site where the frame does
  not get to choose the crop — so it uses `next/image` directly rather than `Media`, whose
  job is the opposite. Arrows and Left/Right step with wrapping, `Esc` closes, focus is
  trapped and restored, body scroll locks, and the credit travels with the image because
  several demo plates are CC BY, where attribution is a licence term rather than a courtesy.
  In the slideshow a press that never travelled counts as a tap and opens it, distinguished
  by distance because the frame captures the pointer for dragging and a click fires at the
  end of a drag too; closing leaves the carousel on whichever plate was last looked at.
  - Its enter animation is a **keyframe, not a transition**, and there is deliberately no
    exit animation. A keyframe plays once on insertion with no state flip to miss; an exit
    needs a state machine that can strand a full-screen overlay on the page, which is a far
    worse failure than an instant close. Same reasoning that rebuilt `PageTransition`.
  - Stepping uses a **functional state update**. React batches events, so two arrow presses
    landing in one batch both computed their target from the same stale index and the second
    was a no-op — hold Right and the viewer advanced one plate and stopped. Caught in
    testing, not in review.
- **Lenis is resynced on every route change, and so is ScrollTrigger.** Lenis keeps its own
  `targetScroll` and writes it to the window every frame; nothing about a client-side
  navigation told it the document underneath had been replaced, so it carried the old page's
  position into the new one and re-asserted it over whatever the router had just set. The
  symptom is landing on a page already scrolled, or a first gesture that jumps.
  - It is timing-dependent, which is what makes it nasty to pin down. With a mouse wheel the
    events stop when you stop turning it and the router usually wins the race; with a
    trackpad they do not — inertial momentum keeps delivering wheel events for a second or
    more *after* the click that navigated, and those land on the new page. Reported from a
    real machine and not reproducible with synthetic wheel events in the test harness, which
    is exactly the shape of an inertia-dependent bug.
  - Handled by intent rather than by reading the scroll position back: a link click sets 0
    outright (reading `window.scrollY` there would be reading the very value the bug
    corrupts), while a back/forward or a link carrying a fragment waits a frame and adopts
    whatever history restoration or the anchor decided.
  - `ScrollTrigger.refresh()` moved here for the same reason. It had only ever run on
    `fonts.ready` and window `load`, both of which fire once for the page a visitor lands
    on — every route reached by clicking a link afterwards kept the previous page's
    measurements.
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

## CMS decision — ADOPTED

**Payload CMS, confirmed by the studio on 2026-09-06.** MIT-licensed, free self-hosted, runs
inside the same Next.js app (one deploy target), TypeScript-native so the
`src/types/content.ts` contract can be shared, and ships drafts, versions, roles, media and
SEO fields without a paid tier.

Version at adoption: `payload@3.88.0`, whose `@payloadcms/next` peer range is
`>=16.2.6 <17.0.0`. This project runs Next 16.3.3, so it is inside the supported range —
checked before installing, not after.

**The accepted risk, restated rather than buried:** this couples CMS availability to the web
app. If Payload cannot boot, the marketing site does not boot either. **Directus** remains
the documented fallback if the studio later wants a decoupled service; the content layer is
what makes that switch survivable, so the accessor boundary in §2.5 of `architecture.md` is
now load-bearing rather than tidy.

### Dependency exemption — ruler.md §5

The five-runtime-dependency cap (`next`, `react`, `react-dom`, `gsap`, `lenis`) required a
written answer before a sixth. Here it is.

- **What does it do that we cannot?** Draft/publish workflow, versioning, role-based auth,
  a media library with alt text, and a generated admin UI for non-technical editors. Writing
  those is a project, not a component, and `project-requirement.md` §9 explicitly rejects
  building a bespoke CMS without a compelling architectural reason.
- **What does it cost in kilobytes?** On the public site, nothing — and this is the
  condition of the exemption, not a hope. Payload's admin bundle is served from its own
  route group; the marketing pages must keep shipping the same five runtime dependencies to
  the browser. That is a claim to verify with a bundle check, and it is the thing to
  re-verify whenever Payload is upgraded.
- **Is it maintained?** Actively; 3.88.0 is current at adoption.
- **What is the removal path?** Routes call accessors in `src/data/**`, never Payload. The
  accessor bodies become `async` fetches and the return types do not move. Reverting means
  restoring the typed arrays behind those same signatures — which is exactly what the file
  layout was built for in Phase 1.

**Anything that breaks the public site's dependency profile is not covered by this
exemption.** A sixth *client* dependency still needs its own answer.

---

## SEO decisions

- Phase 1 builds the structure only: semantic landmarks, one `<h1>` per page, ordered
  headings, crawlable `<a href>`, descriptive slugs, real text in the HTML, `alt` strategy,
  internal linking. `generateStaticParams` on every `[slug]` route.
- Metadata, canonicals, Open Graph, JSON-LD, sitemap and robots are **Phase 5**. Structured
  data will only ever describe visible content.
- **Ahead of Phase 5, already built:** per-route metadata, canonicals, Open Graph and Twitter
  cards on every page (`src/lib/share.ts`, `c243191`), `robots.ts`, the editor's SEO
  title / description / image / no-index overrides on projects, products, news and Knowledge
  (2026-09-17), and — 2026-09-19 — `sitemap.xml` and sitewide JSON-LD.
  - **`sitemap.xml`** (`src/app/sitemap.ts`) lists every static route plus every published
    project/product/news/Knowledge slug, read through the same accessors the pages already use.
    Card-only projects (no `description`) are correctly excluded — `getProjectSlugs` already
    filters to that same test. `robots.ts` now also declares `Sitemap:` explicitly, since not
    every crawler checks the well-known path unprompted.
  - **JSON-LD** (`organizationJsonLd` in `src/lib/share.ts`, rendered once from the root layout)
    is a `ProfessionalService` + `WebSite` graph built from `getStudio()`: name, tagline, phone,
    email, address, `GeoCoordinates` from the studio's own `coordinates` field, and `sameAs`
    linking every social profile the studio actually runs. This is the entity-verification
    layer that both Google's Knowledge Panel and an AI answer engine lean on to confirm "this
    website is this business" — it does not by itself make an LLM cite the studio; that also
    needs the studio's Google Business Profile, directory listings and backlinks to agree with
    it (account-side work, not a code change).
    - **Deliberately not asserted:** structured `openingHoursSpecification` (`hours` is free
      text — "Sunday–Thursday, 9:00 AM – 5:00 PM" — not schema.org's day/time codes, and
      parsing it risks stating a wrong hour if the field is ever phrased differently) and a
      split `PostalAddress` (`addressLines` has no declared street/city/postcode boundary;
      the lines are joined whole rather than guessed apart).
  - **`<`  is escaped to `<`** in the JSON-LD script tag — `JSON.stringify` does not do
    this on its own, and without it a CMS-entered string containing `</script>` (a tagline, an
    address line) could break out of the tag. Same class of fix as the rich-text HTML escaping.
  - **Per-page `CreativeWork`/`Article`/`BreadcrumbList`, 2026-09-21.** `projectJsonLd` and
    `articleJsonLd` (`src/lib/share.ts`), rendered on `/projects/[slug]`, `/news/[slug]` and
    `/knowledge/[slug]` — one `articleJsonLd` for both News and Knowledge, since `toKnowledge`
    already maps onto the same `NewsItem` shape those pages already share. `CreativeWork` over
    a more specific architectural type: schema.org has no widely-supported one, and asserting
    a type crawlers don't reliably parse is worse than the honest generic one they do.
  - **The per-document SEO override fields are fully wired, not just modelled** — `toSeo`
    (`src/data/payload.ts`) populates `.seo` on Project/Product/News/Knowledge, and every
    detail route's `generateMetadata` already passes it through to `pageMetadata`/
    `articleMetadata`. The 2026-09-17 note here calling this dormant was correct when written
    and is stale now; confirmed by reading the current code rather than trusting that note.
- **The favicon was a generic placeholder, not the studio's mark, 2026-09-19.** `favicon.ico`
  (present since Phase 1) was a black-circle-white-triangle icon that predates the studio's mark
  being drawn — confirmed by fetching it directly, not assumed. `scripts/generate-favicon.mjs`
  rebuilds `favicon.ico` / `icon.png` / `apple-icon.png` from `public/brand/uthan-mark.svg` on
  the site's own paper background (`--color-paper`); rerun it if the mark ever changes.
  - **Two rendering bugs found and fixed while building it**, both worth recording since they
    would resurface on any future SVG-to-raster pipeline: `sharp`'s `resize(..., {fit:
    "contain"})` pads the letterboxed area with **opaque black**, not transparent, by default —
    it needs an explicit `background: {r:0,g:0,b:0,alpha:0}`. And `sharp(path)` rasterises an
    SVG once at its own default size before any `resize()` is applied when the SVG declares
    `width="100%" height="100%"` with no intrinsic pixel size (as every brand SVG here does) —
    an explicit `density` avoids resizing up from that small implicit raster.
- **Redirects added for what the studio's previous site left in Google's index, 2026-09-19:**
  `/pricing` → `/contact`, `/services` → `/about#expertise`, `/team` → `/about#team`
  (`next.config.ts`). None are renames of a URL this rebuild ever served — they 404'd. A stale
  search result landing on the closest real page beats one landing on a dead page. The About
  page's team section gained an `id="team"` it did not have, so the last of those actually
  lands somewhere. Getting Google to stop *showing* the old sitelinks/description is a Search
  Console action, not something a redirect alone fixes quickly — see the outstanding item below.

---

## Security decisions

- Phase 1 obligations already in force: no secrets in the repo, no third-party scripts, no
  unsanitised external SVG, no `dangerouslySetInnerHTML` on unvetted content.
- No public authentication surface will exist on the marketing site — this removes an entire
  attack class by design.
- **The contact form is the one public write, and is guarded accordingly** (`34f700f`): field
  length limits, a honeypot, five submissions per connection per ten minutes, saved before it
  is emailed so a mail failure never loses an enquiry. Turnstile and security headers remain
  Phase 4.
  - **2026-09-17, at the studio's request:** a site-wide cap of twenty per ten minutes, because
    a botnet sends from many addresses and the per-address limit alone would let it fill the
    database and exhaust Gmail's sending quota (which gets the account suspended). The accepted
    cost: a flood can turn away a real visitor for minutes.
  - **Enquiries are deleted after 10 days, read or not** — the studio's choice, made knowing the
    panel is the only copy since email was declined. Swept each time a new enquiry is saved, not on a timer — storage only
    grows when enquiries arrive, so no scheduler is needed. The consequence to know: an
    enquiry nobody opens in the panel within 10 days is gone for good.
- **GraphQL is off** (`graphQL.disable`, 2026-09-18). Nothing called it — the site uses the Local
  API, the panel uses REST — so it was a public endpoint with no user. Turn it back on only for
  a real consumer.
- **The page must never depend on the JS bundle to become visible** (2026-09-18). The boot
  script's `js-motion` / `js-intro` hide content until the app runs; when it never ran (a
  browser below Next's baseline, a script blocker, a dropped chunk) the visitor sat on the
  intro's "000" indefinitely — reproduced by blocking the JS chunks. The boot script now removes
  both classes itself if `MotionFailsafe` has not marked `data-hydrated` within 6s. This was
  the "works in some browsers, not others" report.
- **Rich text renders as HTML, and only through Payload's converters** (`src/data/payload.ts`):
  text escaped, link URLs sanitised, a fixed inline tag set. It is authored by signed-in
  editors only. Do not widen the editor's features without checking what they emit.
- Fooocus, when built, sits behind a backend service layer. Credentials and internal
  endpoints never reach the browser, and the public site must function with Fooocus offline.

---

## Content status

- **Rough work does not enlarge and is guarded against casual saving.** The case-study
  sketches and working drawings are the studio's unpublished thinking, not the finished
  plates the page offers for study, so that strip has no viewer, no context menu, no
  drag-off, no selection, and its images are out of hit-testing so a right-click has no
  image in hand to offer. Stated plainly because it would be easy to mistake for
  protection: this stops the three gestures someone reaches for without thinking, and stops
  nothing else. A screenshot, devtools, or the file URL all still work and always will. If
  a drawing genuinely must not leave the studio, the answer is a smaller derivative or not
  publishing it — not a CSS rule.
- **The hero's four service lines are links**, each to the work that shows it (Interior to
  its category filter, Exterior to the project index, Products to the product index,
  Consultancy to the areas-of-work list, which gained a real `#expertise` anchor in the
  process — the search index had been pointing at that anchor since before it existed).
  The destinations live in `studio.services` alongside the labels, because which work stands
  for which service is a content decision.

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

1. CMS confirmation: RESOLVED — Payload, 2026-09-06; Phase 2 gate passed 2026-09-17.
2. Wordmark: RESOLVED — the studio supplied a drawn mark. See the Brand decisions note on `UthanMark`.
3. Real expertise categories — the nine in use are placeholders.
4. Real statistics.
5. Real sustainability practice.
6. Photography art direction for production.
7. Whether project detail pages get a shared-element page transition.
8. Deployment target: RESOLVED — BDIX VPS, systemd + Caddy, PostgreSQL, off-site backups to
   Backblaze (`deployment.md`).
9. Domain: RESOLVED — uthandesignstudio.com.
10. Whether the demo content comes down now that real work is being published.
11. A privacy policy and terms, now that the contact form collects personal data.
12. **Google Search Console verification and reindex request** for the studio's domain — an
    account action, not a code change. Needed to get Google to drop the stale `/pricing`,
    `/services`, `/team` sitelinks and description faster than a natural recrawl would.
13. **The Google Business Profile address does not match the studio's real one** — a screenshot
    of the live search result showed "5th Floor, House # 1, Road # 4, Gulshan Badda Link Road",
    while the CMS (and the map embed already in use) has "Plot 1, Road 4, Gulshan, Dhaka 1212".
    Likely the source of the stale sitelinks along with the old site's crawl. Correcting the
    listing is account-side (Google Business Profile), and matters beyond cosmetics: mismatched
    name/address/phone across the studio's own web presence is a standard reason a local
    business fails to rank as one consistent entity, and is exactly the kind of inconsistency
    an AI system cross-checking sources before citing a business would treat as a red flag.
14. **Getting an AI system to suggest Uthan for "best interior designer in Dhaka/Bangladesh"
    is not a single fix.** The JSON-LD entity data above is the on-page half; the other half is
    off-page and account-side: the Google Business Profile corrected and verified (13), reviews
    on it, consistent citations on relevant directories, and backlinks from other real sites
    (press, partners, directories) that mention the studio the same way. No code change reaches
    any of that.

---

## Verification performed (Phase 1)

- **A maintainability sweep** (September 2026) built an import graph over all source files
  and computed transitive reachability from the framework's entry points. It found five
  components unreachable from any route — `FeaturedProject`, `TeamSection`, `BrandsSection`,
  `BrandIndex` and `ProjectGallery` — plus three unused exports, all now deleted. Roughly
  450 lines, about 4% of the source tree. Dependencies came back clean: exactly the five
  documented runtime deps, nothing unused.
- **`eslint` reports unused imports and variables as warnings, not errors**, so `npm run
  lint` exits 0 with them present and neither the build nor CI notices. That is how the four
  drifted copies of the reduced-motion check and a stale `ProductCategory` import survived.
  Worth knowing before trusting a clean lint run as evidence that nothing is orphaned; the
  import-graph pass is what actually catches it.

- **`scripts/audit.js` no longer guesses at a background it cannot see.** Its contrast check
  walked up the DOM for the nearest solid colour, which meant a card title in `text-paper`
  sitting on a dark scrim over a photograph was measured against the *section's* paper two
  levels further up and reported as paper-on-paper at 1.0:1 — a permanent pair of false HIGH
  findings that made the "zero HIGH" gate meaningless. `bgOf` now returns "unknown" when a
  background-image sits between the text and the nearest solid colour, or when the text is
  in a positioned box that also contains an image or video painted beneath it, and the check
  skips rather than guessing. Decorative `[aria-hidden]` text is skipped too — the crosshair's
  coordinate readout is a fixed overlay whose ground is whatever it floats over, which has
  nothing to do with its DOM ancestry. A checker that cannot see the ground has to say so.

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
