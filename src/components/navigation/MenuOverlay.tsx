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
import { CloseIcon } from "@/components/ui/Button";

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
export function MenuOverlay({
  open,
  onClose,
  items,
  studio,
}: MenuOverlayProps) {
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
      className="uds-glass surface-dark fixed inset-0 z-60 overflow-hidden outline-none backdrop-blur-2xl backdrop-saturate-150"
    >
      <div
        data-menu-inner
        data-lenis-prevent
        className="h-full overflow-y-auto overscroll-contain"
      >
      {/* `min-h-dvh` rather than a fixed height so the panel can still grow and
          scroll on a short viewport, but the spacing below is tuned so that on
          an ordinary laptop it does not need to: the index used to overflow and
          demand a scroll to reach the contact block, which is a poor first
          impression for a menu whose whole job is orientation. */}
      <Container className="flex min-h-dvh flex-col py-5 md:py-6">
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
            <CloseIcon />
          </button>
        </div>

        {/* `flex-1` + `min-h-0` lets this middle band absorb whatever height is
            left rather than pushing the contact block off the bottom. */}
        <div className="grid min-h-0 flex-1 gap-10 pt-10 lg:grid-cols-[1fr_26rem] lg:gap-16 lg:pt-12">
          <nav aria-label="Primary" className="flex flex-col">
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
                      className="group flex items-baseline gap-5 py-3 transition-colors duration-[var(--dur-fast)] hover:text-accent md:gap-8 md:py-4"
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

          {/* Decorative preview. Search moved out to its own panel, so this
              column is the image again. Hidden from assistive technology and
              from anything without the room for it — it duplicates nothing.

              **It fills the column rather than holding a ratio.** This was a
              4:3 landscape plate pinned to the top of the column with
              `self-start`, which left a growing well of empty ink beneath it —
              on a tall monitor, more empty column than image. Letting it
              stretch turns the same photograph into a portrait slot the height
              of the index beside it, which is both the shape the space
              actually is and the shape architectural photography survives
              being cropped to: a section rather than a postcard.

              `ratio="auto"` is what makes that possible — every other ratio
              declares an `aspect-*` that would fight `h-full` for control of
              the height. The crop is handled by `object-cover` inside `Media`.

              The column also widens from 24rem to 26rem. At full height, 24rem
              was driving the plate past 1:2.5 on a tall display, which stops
              reading as a portrait and starts reading as a strip. */}
          <div aria-hidden="true" className="hidden lg:block">
            <div className="h-full w-full bg-ink">
              {preview && (
                <Media
                  key={preview.src}
                  asset={preview}
                  ratio="auto"
                  sizes="26rem"
                  className="h-full w-full animate-[fade_400ms_ease-out]"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-hairline pt-6 text-small sm:grid-cols-2 lg:grid-cols-3">
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
