"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { Arrow } from "@/components/ui/Button";
import type { Product } from "@/types/content";

/** How long each frame holds before advancing to the next. */
const CYCLE_MS = 900;

/**
 * A product line, as a card.
 *
 * Shares the homepage work card's language — scrim, name and summary rising
 * in on hover — with one addition: hovering also cycles through the product's
 * gallery, a frame at a time, the way a listing shows more photos without a
 * click. `WorkCard` shows one photograph; this shows the set.
 *
 * The card links into that product's own page, where the materials,
 * applications and specification live. The listing's job is to get a visitor
 * to the right line; the spec sheet belongs on the line's own page rather
 * than stacked below the grid for every product at once.
 *
 * Implementation:
 * - Every frame is rendered and stacked (via `Media`, so each one keeps the
 *   same load-fade-in safety net every other lazy image on the site has);
 *   only `opacity` changes between them, so a frame change composites.
 * - The cycle is a real `setInterval`, started on `pointerenter` and cleared
 *   on `pointerleave` or unmount — never running while the card is not
 *   hovered, so an off-screen card costs nothing.
 * - Cycling is mouse-only. A coarse pointer has no hover to trigger it, so
 *   the detail block (and the still hero frame) is simply always shown there
 *   — the same rule `WorkCard` and the portfolio grid already follow.
 *   Reduced motion gets the hero frame, held still, for the same reason.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  // Not `[product.hero, ...product.gallery]`: in this data `gallery[0]` is
  // already the hero shot (both drawn from the same curated set at the same
  // starting index), so prepending the hero separately duplicated it — two
  // frames sharing one `src`, which React then refused to key uniquely.
  const frames = product.gallery.length > 0 ? product.gallery : [product.hero];
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const stop = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActive(0);
  };

  const start = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (reducedRef.current || frames.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % frames.length);
    }, CYCLE_MS);
  };

  useEffect(() => () => stop(), []);

  return (
    <article>
      <Link
        href={`/products/${product.slug}`}
        aria-label={`${product.title} — ${product.summary}`}
        onPointerEnter={start}
        onPointerLeave={(e) => e.pointerType === "mouse" && stop()}
        className="group relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {frames.map((frame, i) => (
            <div
              key={frame.src}
              aria-hidden={i !== active || undefined}
              className={`absolute inset-0 transition-opacity duration-[var(--dur-slow)] ease-out-soft motion-reduce:transition-none ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Media
                asset={frame}
                ratio="auto"
                priority={priority && i === 0}
                sizes="(min-width: 768px) 46vw, 100vw"
                className="h-full w-full"
              />
            </div>
          ))}
        </div>

        {/* Frame index, so the cycling reads as "more photos" rather than as
            an unexplained flicker — the job a photo-count badge does on a
            listing card. */}
        {frames.length > 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-4 left-4 flex gap-1.5"
          >
            {frames.map((_, i) => (
              <span
                key={i}
                className={`block h-1 w-4 transition-colors duration-[var(--dur-base)] ${
                  i === active ? "bg-accent" : "bg-paper/35"
                }`}
              />
            ))}
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/92 from-0% via-ink/50 via-55% to-transparent opacity-0 transition-opacity duration-[var(--dur-slow)] ease-out-soft motion-reduce:transition-none md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7">
          <div className="surface-dark">
            <span
              data-numeric
              className="text-meta uppercase text-paper/80 transition-opacity duration-[var(--dur-base)] md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
            >
              Product line
            </span>

            <h3 className="mt-2 text-h3 text-paper">{product.title}</h3>

            <p className="mt-3 max-w-[46ch] text-small text-paper/85 text-pretty transition-[opacity,transform] duration-[var(--dur-slow)] ease-out-soft motion-reduce:transform-none motion-reduce:transition-none md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
              {product.summary}
            </p>

            <span className="mt-5 inline-flex items-center gap-2.5 border-t border-paper/25 pt-4 text-meta uppercase text-paper">
              View the line
              <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
