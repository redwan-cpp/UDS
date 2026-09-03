"use client";

import { useEffect, useRef, useState } from "react";

import { Wordmark } from "./Wordmark";
import { MenuOverlay } from "./MenuOverlay";
import { Container } from "@/components/ui/Container";
import { studio } from "@/data/studio";
import type { NavItem, SearchEntry } from "@/types/content";

interface SiteHeaderProps {
  items: NavItem[];
  studioName: string;
  searchIndex: SearchEntry[];
}

/**
 * Fixed header.
 *
 * Transparent over the hero, gaining an ink backdrop and a bottom hairline once
 * the page has moved. Hides on scroll-down past 400px and returns on scroll-up,
 * so it is out of the way while reading and one gesture away when wanted.
 *
 * Scroll state is written straight to data attributes on the element inside a
 * rAF-throttled passive listener — deliberately not React state. Driving it
 * through `useState` re-entered React's reconciler on every scroll event, which
 * is precisely the work that should not happen while the user is scrolling. The
 * appearance is styled in CSS from `[data-scrolled]` / `[data-hidden]`.
 *
 * Reading `window.scrollY` rather than Lenis keeps the header correct when Lenis
 * is absent — which it always is under reduced motion.
 */
export function SiteHeader({
  items,
  studioName,
  searchIndex,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const openRef = useRef(false);

  // Mirrored into a ref so the scroll listener can read the current value
  // without being torn down and rebuilt every time the menu opens.
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    let lastY = window.scrollY;
    let frame = 0;

    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      // Attribute writes are cheap and idempotent — a write that does not
      // change the value costs nothing and invalidates nothing.
      el.toggleAttribute("data-scrolled", y > 80);
      el.toggleAttribute("data-hidden", !openRef.current && y > 400 && y > lastY);
      lastY = y;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // The menu must never be opened onto a header that is hidden behind it.
  useEffect(() => {
    if (open) headerRef.current?.removeAttribute("data-hidden");
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        data-open={open || undefined}
        className="site-header surface-dark fixed inset-x-0 top-0 z-70 data-[scrolled]:backdrop-blur-xl data-[scrolled]:backdrop-saturate-150"
        inert={open || undefined}
      >
        {/* The centre shortcut row is deliberately gone: the wordmark holds the
            left, and every route is one click away in the index. That leaves
            the header a rule with two ends, which is what lets it sit as glass
            over the hero without competing with the display type under it. */}
        <Container className="flex items-center justify-between gap-8 py-5 md:py-6">
          <Wordmark name={studioName} />

          <div className="flex items-center gap-6 md:gap-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-controls="site-menu"
              className="group/search -m-2 flex min-h-11 min-w-11 items-center justify-center p-2 transition-colors duration-[var(--dur-fast)] hover:text-accent"
            >
              <span className="sr-only">Search the site index</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-[18px] w-[18px]"
              >
                <circle
                  cx="8.75"
                  cy="8.75"
                  r="5.75"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path
                  d="M13 13L17.5 17.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="square"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group/menu -mr-2 flex min-h-11 items-center gap-3 px-2 text-nav uppercase transition-colors duration-[var(--dur-fast)] hover:text-accent"
            >
              <span>Index</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
                <span className="block h-px w-full origin-left bg-current transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/menu:scale-x-75 motion-reduce:transition-none" />
                <span className="block h-px w-full origin-left scale-x-75 bg-current transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/menu:scale-x-100 motion-reduce:transition-none" />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <MenuOverlay
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        studio={studio}
        searchIndex={searchIndex}
      />
    </>
  );
}
