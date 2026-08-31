"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Media } from "@/components/ui/Media";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "./Wordmark";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { gsap, motionSafe } from "@/lib/gsap";
import type { NavItem, StudioProfile } from "@/types/content";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  studio: StudioProfile;
}

/**
 * The full-viewport index.
 *
 * Enters as a clip-path wipe from the top edge — the overlay arrives as a
 * surface being drawn down, not as a panel fading in. Items stagger behind it.
 *
 * Accessibility: a modal dialog with focus trapped inside, Escape to close, and
 * focus restored to the trigger on close. The paired hover imagery is purely
 * decorative and never the only way to understand a link.
 */
export function MenuOverlay({ open, onClose, items, studio }: MenuOverlayProps) {
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  useFocusTrap(panel, open, onClose);
  useLockBodyScroll(open);

  // Close on navigation — the route change is the confirmation.
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const el = panel.current;
    const inner = el?.querySelector<HTMLElement>("[data-menu-inner]");
    if (!el || !inner) return;

    return motionSafe(() => {
      // The wipe is a transform mask, not a `clip-path`: the panel travels down
      // while its content travels up by the same amount, so the index reads as
      // held still behind an opening surface. Animating `clip-path` on a
      // viewport-sized panel repaints the whole thing every frame.
      const tl = gsap.timeline({
        onComplete: () => gsap.set([el, inner], { willChange: "auto" }),
      });

      gsap.set([el, inner], { willChange: "transform" });

      tl.fromTo(
        el,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.5, ease: "power3.inOut" },
        0,
      )
        .fromTo(
          inner,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.5, ease: "power3.inOut" },
          0,
        )
        .fromTo(
          el.querySelectorAll("[data-menu-item]"),
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.035,
          },
          0.18,
        );
    });
  }, [open]);

  const preview = items.find((item) => item.href === active)?.image;

  return (
    <div
      ref={panel}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      tabIndex={-1}
      hidden={!open}
      className="surface-dark fixed inset-0 z-60 overflow-hidden bg-ink-raised outline-none"
    >
      <div
        data-menu-inner
        data-lenis-prevent
        className="h-full overflow-y-auto overscroll-contain"
      >
      <Container className="flex min-h-dvh flex-col justify-between py-5 md:py-6">
        {/* The dialog carries its own top row.
            `aria-modal` makes everything outside this element inert to
            assistive technology, so a close control living in the site header
            would be unreachable by keyboard and invisible to a screen reader.
            The header hides itself while this is open, and this row takes its
            place in exactly the same position. */}
        <div className="flex items-center justify-between gap-8">
          <Wordmark name={studio.name} />

          <button
            type="button"
            onClick={onClose}
            className="group/close -mr-2 flex min-h-11 items-center gap-3 px-2 text-nav uppercase transition-colors duration-[var(--dur-fast)] hover:text-accent"
          >
            Close
            <span aria-hidden="true" className="relative block size-4">
              <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div className="grid gap-12 pt-16 lg:grid-cols-[1fr_auto] lg:gap-16 lg:pt-20">
          <nav aria-label="Primary">
            <ul className="flex flex-col">
              {items.map((item) => {
                const current = pathname === item.href;
                return (
                  <li key={item.href} className="border-t border-hairline">
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onMouseEnter={() => setActive(item.href)}
                      onFocus={() => setActive(item.href)}
                      className="group flex items-baseline gap-5 py-4 transition-colors duration-[var(--dur-fast)] hover:text-accent md:gap-8 md:py-6"
                    >
                      <span
                        data-numeric
                        className="text-meta uppercase text-secondary transition-colors group-hover:text-accent"
                      >
                        {item.index}
                      </span>
                      <span className="overflow-hidden">
                        <span
                          data-menu-item
                          className="block text-h2 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-2 motion-reduce:transform-none motion-reduce:transition-none"
                        >
                          {item.label}
                        </span>
                      </span>
                      {current && (
                        <span className="ml-auto text-meta uppercase text-accent">
                          Current
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Decorative preview. Hidden from assistive technology and from
              anything without a fine pointer — it duplicates no information. */}
          <div
            aria-hidden="true"
            className="hidden w-[22rem] shrink-0 self-start lg:block"
          >
            <div className="aspect-[3/4] w-full bg-ink">
              {preview && (
                <Media
                  key={preview.src}
                  asset={preview}
                  ratio="tall"
                  sizes="22rem"
                  className="h-full animate-[fade_400ms_ease-out]"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-hairline pt-8 text-small sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-meta uppercase text-secondary">Contact</h2>
            <p className="mt-3">
              <a
                href={`mailto:${studio.contact.email}`}
                className="underline decoration-1 underline-offset-4 opacity-80 transition-opacity hover:opacity-100"
              >
                {studio.contact.email}
              </a>
            </p>
            <p className="mt-1 text-secondary">{studio.contact.phone}</p>
          </div>

          <div>
            <h2 className="text-meta uppercase text-secondary">Studio</h2>
            <address className="mt-3 not-italic text-secondary">
              {studio.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div>
            <h2 className="text-meta uppercase text-secondary">Follow</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {studio.social.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="inline-block py-1 underline decoration-1 underline-offset-4 opacity-80 transition-opacity hover:opacity-100"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="inline-block py-1 text-secondary">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      </div>
    </div>
  );
}
