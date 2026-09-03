import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { UthanMark } from "@/components/brand/UthanMark";
import { Eyebrow } from "@/components/typography";
import { IS_DEMO_BUILD } from "@/data/studio";
import type { NavItem, StudioProfile } from "@/types/content";

/**
 * The closing section.
 *
 * Treated as a real compositional move rather than a legal strip: the studio
 * name is set at display scale as the last thing on the page, with the index,
 * contact and location arranged beneath it on the same grid the rest of the
 * site uses.
 */
export function SiteFooter({
  studio,
  items,
}: {
  studio: StudioProfile;
  items: NavItem[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark border-t border-line bg-ink">
      <Container className="pt-20 pb-10 md:pt-28">
        {/* The name, at scale, as the closing statement — with the mark set
            to the cap height beside it, which is how the supplied lockup is
            composed. */}
        <div className="flex items-center gap-6 md:gap-8">
          <UthanMark className="h-[0.78em] w-auto shrink-0 text-display leading-none text-paper" />
          <p className="text-display leading-[0.86] tracking-[-0.04em] text-paper">
            Uthan
          </p>
        </div>

        <div className="mt-12 grid gap-12 border-t border-line pt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <nav aria-label="Footer">
            <Eyebrow as="h2">Index</Eyebrow>
            <ul className="mt-5 flex flex-col gap-2.5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group/f inline-flex py-1 text-small transition-colors duration-[var(--dur-fast)] hover:text-accent"
                  >
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/f:scale-x-100 motion-reduce:transition-none"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Eyebrow as="h2">Contact</Eyebrow>
            <div className="mt-5 flex flex-col gap-2.5 text-small">
              <a
                href={`mailto:${studio.contact.email}`}
                className="inline-block py-1 underline decoration-1 underline-offset-4 transition-colors hover:text-accent"
              >
                {studio.contact.email}
              </a>
              <a
                href={`tel:${studio.contact.phone.replace(/\s/g, "")}`}
                className="inline-block py-1 text-secondary transition-colors hover:text-accent"
              >
                {studio.contact.phone}
              </a>
              {studio.contact.hours && (
                <p className="text-secondary">{studio.contact.hours}</p>
              )}
            </div>
          </div>

          <div>
            <Eyebrow as="h2">Location</Eyebrow>
            <address className="mt-5 flex flex-col gap-1 text-small not-italic text-secondary">
              {studio.contact.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>

          <div>
            <Eyebrow as="h2">Follow</Eyebrow>
            <ul className="mt-5 flex flex-col gap-2.5 text-small">
              {studio.social.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="inline-block py-1 underline decoration-1 underline-offset-4 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="inline-flex items-baseline gap-2 py-1 text-secondary">
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
          <ul className="flex gap-6">
            {studio.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block py-1 transition-colors hover:text-accent"
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
