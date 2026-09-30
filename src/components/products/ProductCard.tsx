import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { Arrow } from "@/components/ui/Button";
import type { Product } from "@/types/content";

/**
 * A product line, as a card.
 *
 * Product photography remains still and unfiltered in the index. The
 * desaturated-to-colour treatment belongs only to architectural project
 * thumbnails; rotating a product gallery on hover made the card's image feel
 * unstable and obscured the material being considered.
 *
 * The card links into that product's own page, where the materials,
 * applications and specification live. The listing's job is to get a visitor
 * to the right line; the spec sheet belongs on the line's own page rather
 * than stacked below the grid for every product at once.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article>
      <Link
        href={`/products/${product.slug}`}
        aria-label={`${product.title} — ${product.summary}`}
        className="group relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Media
            asset={product.hero}
            ratio="auto"
            priority={priority}
            sizes="(min-width: 768px) 46vw, 100vw"
            className="h-full w-full"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/92 from-0% via-ink/50 via-55% to-transparent"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7">
          <div className="surface-dark">
            <span
              data-numeric
              className="text-meta uppercase text-paper/80"
            >
              Product line
            </span>

            <h3 className="mt-2 text-h3 text-paper">{product.title}</h3>

            <p className="mt-3 max-w-[46ch] text-small text-paper/85 text-pretty">
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
