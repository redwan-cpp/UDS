import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/typography";
import { IS_DEMO_BUILD } from "@/data/studio";
import type { NavItem, StudioProfile } from "@/types/content";

/**
 * A footer link, set as a row on a contents page.
 *
 * The footer's links used to be plain text in a flat column, and four
 * different kinds of it — the index undecorated, the email underlined, the
 * phone in mute, the legal row smaller again. Two problems came out of that.
 * The affordance was invisible: the index column and the postal address were
 * both unadorned paper text in identically shaped columns, so nothing on the
 * page distinguished the things you can click from the things you cannot. And
 * the rows measured 29–31px, over the WCAG 2.2 floor of 24 but under this
 * site's own documented 44px minimum (design.md §Accessibility).
 *
 * Both are fixed by the same move, and it is a move the site already owns:
 * the hairline-separated full-width row that `ExpertiseBrowser` uses for the
 * nine areas, which is the shape a drawing set's contents page uses. The rule
 * structure is what says "this is an index of places to go" — per design.md
 * §1, structure is carried by hairlines and interval, not by boxes — and row
 * padding is what makes the target legal, rather than a padding trick bolted
 * onto text that stayed 15px tall.
 *
 * The address deliberately does NOT get this treatment. It is not a link, and
 * the whole point is that it should no longer look like one.
 */
const ROW =
  "group/link flex min-h-11 w-full items-center border-t border-line text-small transition-colors duration-[var(--dur-fast)] hover:text-accent focus-visible:text-accent";

/** The indent-on-hover already used by every card and row on the site. */
const LABEL =
  "transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/link:translate-x-1.5 group-focus-visible/link:translate-x-1.5 motion-reduce:transform-none motion-reduce:transition-none";

/**
 * The closing section.
 *
 * Treated as a real compositional move rather than a legal strip: the index,
 * contact and location are arranged on the same grid the rest of the site
 * uses, under the studio's own lockup.
 */
export function SiteFooter({
  studio,
  items,
  headings,
}: {
  studio: StudioProfile;
  items: NavItem[];
  /** The four column headings. Copy, so it comes from `src/data`. */
  headings: { index: string; contact: string; location: string; follow: string };
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark border-t border-line bg-ink">
      <Container className="pt-16 pb-10 md:pt-20">
        {/* The studio's own lockup, as a signature — not as a banner.
            This was set at display scale, 736x241px, which came to roughly a
            quarter of the footer's height and made it the largest non-
            photographic graphic anywhere on the site. That is three of this
            project's own rules at once: the interface is meant to be a frame
            with the work as the subject (design.md §1), hierarchy is meant to
            be typographic rather than decorative, and the anti-brief rules out
            reading as an agency template — which a full-bleed logo slab above
            a link strip is the house style of.

            It stays, because it is the studio's mark and it belongs at the end
            of the page. It is simply sized as a mark: ~240px, near the height
            of an h1, so it reads as a peer of the page's headings rather than
            as a masthead shouting over them. With the rule directly beneath it
            the footer now opens the same way every other section on this site
            opens — a label, a hairline, then the content.

            Served as a file rather than inlined: it is 29 paths, the footer is
            on every page, and inlining would put ~25KB of path data into every
            document for a mark that caches once. It is the ink-ground
            derivative (see the note in that file) because this footer is
            always ink; the source stays untouched. */}
        {/* `unoptimized`: Next's image optimizer refuses SVG unless
            `dangerouslyAllowSVG` is set globally, and that flag would apply to
            every image the optimizer ever handles, remote ones included — a
            real widening of the attack surface to buy nothing, since there is
            no raster work to do on a vector. Width and height are still
            declared, which is what actually reserves the space and prevents
            the shift. */}
        <Image
          src="/brand/uthan-lockup-on-ink.svg"
          alt={studio.name}
          width={917}
          height={300}
          unoptimized
          className="h-auto w-full max-w-[min(15rem,55%)]"
        />

        <div className="mt-10 grid gap-12 border-t border-line pt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <nav aria-label="Footer">
            <Eyebrow as="h2">{headings.index}</Eyebrow>
            <ul className="mt-5 border-b border-line">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={ROW}>
                    <span className={LABEL}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Eyebrow as="h2">{headings.contact}</Eyebrow>
            {/* The phone was in mute here while the email beside it was in
                paper and underlined — two treatments for two links that do the
                same job. Both are links, so both are rows. */}
            <div className="mt-5 border-b border-line">
              <a href={`mailto:${studio.contact.email}`} className={ROW}>
                <span className={LABEL}>{studio.contact.email}</span>
              </a>
              <a
                href={`tel:${studio.contact.phone.replace(/\s/g, "")}`}
                className={ROW}
              >
                <span className={LABEL}>{studio.contact.phone}</span>
              </a>
            </div>
            {studio.contact.hours && (
              <p className="mt-4 text-small text-secondary">
                {studio.contact.hours}
              </p>
            )}
          </div>

          <div>
            <Eyebrow as="h2">{headings.location}</Eyebrow>
            <address className="mt-5 flex flex-col gap-1 text-small not-italic text-secondary">
              {studio.contact.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>

          <div>
            <Eyebrow as="h2">{headings.follow}</Eyebrow>
            <ul className="mt-5 border-b border-line">
              {studio.social.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href} className={ROW}>
                      <span className={LABEL}>{link.label}</span>
                    </a>
                  ) : (
                    // A pending account is not a link, so it does not get the
                    // hover or the indent — but it keeps the row and the rule
                    // so the set still reads as one column.
                    <span className="flex min-h-11 w-full items-center justify-between gap-2 border-t border-line text-small text-secondary">
                      {link.label}
                      <span className="text-meta uppercase">Pending</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {IS_DEMO_BUILD && (
          <p className="mt-12 max-w-[68ch] border-t border-line pt-6 text-caption text-secondary">
            <span className="text-accent">Demo build.</span> Projects, statistics,
            team, partners and contact details on this site are placeholder
            content for design review — they are not Uthan Design Studio&rsquo;s
            work or details. Photography is licensed demo media from Wikimedia
            Commons; provenance for every file is recorded in{" "}
            <code className="text-secondary">public/media/CREDITS.json</code>.
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-caption text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {studio.name}. All rights reserved.
          </p>
          {/* The legal links sit in a horizontal bar, so there is no row
              structure to carry the affordance and they were rendering as mute
              text indistinguishable from the copyright line beside them. An
              underline is the honest tool at this size. */}
          <ul className="flex gap-6">
            {studio.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
