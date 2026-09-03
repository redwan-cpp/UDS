"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import type { Product } from "@/types/content";

/**
 * A product line's own detail — reached by anchor from its card above, not a
 * separate route.
 *
 * Restyled to read like a product listing page rather than an editorial
 * spread: a real gallery (a large frame plus a clickable thumbnail rail,
 * the one interaction every ecommerce product page shares) stands in for a
 * single static hero image, and the copy is cut to what a listing actually
 * carries — a title and one line, then the specification. There is no price
 * and no cart, but the *shape* is the familiar one: image, name, one-line
 * pitch, spec sheet, one clear action.
 */
export function ProductFeature({
  product,
  position,
}: {
  product: Product;
  position: number;
}) {
  const flip = position % 2 === 0;
  const frames = product.gallery.length > 0 ? product.gallery : [product.hero];
  const [active, setActive] = useState(0);

  return (
    // `id={product.slug}` is the real anchor target — search results and the
    // product cards above both link to `/products#${slug}`. It used to point
    // nowhere: the only id on this section belonged to the heading, used for
    // `aria-labelledby`, and nothing addressed the section itself. `scroll-mt`
    // clears the fixed header, which would otherwise sit over the first few
    // lines of whichever product the link was for.
    <article
      id={product.slug}
      aria-labelledby={`product-heading-${product.slug}`}
      className="scroll-mt-24 border-t border-hairline pt-10 md:scroll-mt-28 md:pt-14"
    >
      <Container bleed>
        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 lg:grid-cols-12">
          <div className={`lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : ""}`}>
            {/* No `key` on the swapped image: this Reveal is armed once, on
                first scroll into view, by the curtain's own scroll trigger.
                Keying the image to `active` would remount it on every
                thumbnail click, re-arming a reveal whose trigger position
                may already be scrolled past — the classic way a scroll
                reveal gets stuck at `opacity: 0` after the fact. `Media`
                already fades a changed `src` in on its own `load`. */}
            <Reveal variant="curtain">
              <Media
                asset={frames[active]}
                ratio="landscape"
                revealMedia
                priority={position === 1}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>

            {frames.length > 1 && (
              <ul className="mt-3 flex gap-3">
                {frames.map((frame, i) => (
                  <li key={frame.src}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={i === active || undefined}
                      aria-label={`Image ${i + 1} of ${frames.length}`}
                      className={`relative block size-16 overflow-hidden border transition-colors duration-[var(--dur-fast)] ${
                        i === active
                          ? "border-accent"
                          : "border-hairline hover:border-accent/60"
                      }`}
                    >
                      <Media asset={frame} ratio="square" sizes="64px" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
            <Reveal delay={0.1}>
              <div className="flex items-baseline gap-4">
                <span data-numeric className="text-meta uppercase text-accent">
                  {String(position).padStart(2, "0")}
                </span>
                <Eyebrow>Product line</Eyebrow>
              </div>

              <h2 id={`product-heading-${product.slug}`} className="mt-5 text-h2">
                {product.title}
              </h2>

              <p className="mt-4 max-w-[46ch] text-body text-secondary text-pretty">
                {product.summary}
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-8">
              <div>
                <Eyebrow as="h3" className="pb-4">
                  Materials
                </Eyebrow>
                <ul className="flex flex-col">
                  {product.materials.map((material) => (
                    <li
                      key={material}
                      className="border-t border-hairline py-3 text-small last:border-b"
                    >
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Eyebrow as="h3" className="pb-4">
                  Applications
                </Eyebrow>
                <ul className="flex flex-col">
                  {product.applications.map((application) => (
                    <li
                      key={application}
                      className="border-t border-hairline py-3 text-small last:border-b"
                    >
                      {application}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Eyebrow as="h3" className="pb-4">
                  Specification
                </Eyebrow>
                <dl className="flex flex-col">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-4 border-t border-hairline py-3 last:border-b"
                    >
                      <dt className="text-meta uppercase text-secondary">
                        {spec.label}
                      </dt>
                      <dd className="text-right text-small text-secondary">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <Reveal delay={0.1}>
              <ButtonLink href="/contact" variant="quiet" className="mt-10">
                Enquire about {product.title.toLowerCase()}
                <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:translate-x-1 motion-reduce:transition-none" />
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </Container>
    </article>
  );
}
