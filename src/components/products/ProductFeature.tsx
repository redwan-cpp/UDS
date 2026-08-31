import { Container } from "@/components/ui/Container";
import { Media, Figure } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Prose, Statement } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import type { Product } from "@/types/content";

/**
 * A product line.
 *
 * Presented as part of the studio's architectural output, not as a shop: no
 * price, no cart, no "add to basket", no star ratings. The specification table
 * is the closest thing to a product listing, and it reads like a schedule from
 * a drawing set — which is what it actually is.
 */
export function ProductFeature({
  product,
  position,
}: {
  product: Product;
  position: number;
}) {
  const flip = position % 2 === 0;

  return (
    <article
      aria-labelledby={`product-${product.id}`}
      className="border-t border-hairline pt-10 md:pt-14"
    >
      <Container bleed>
        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 lg:grid-cols-12">
          <div className={`lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : ""}`}>
            <Reveal variant="curtain">
              <Media
                asset={product.hero}
                ratio="landscape"
                revealMedia
                priority={position === 1}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
          </div>

          <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
            <Reveal delay={0.1}>
              <div className="flex items-baseline gap-4">
                <span data-numeric className="text-meta uppercase text-accent">
                  {String(position).padStart(2, "0")}
                </span>
                <Eyebrow>Product line</Eyebrow>
              </div>

              <h2 id={`product-${product.id}`} className="mt-5 text-h2">
                {product.title}
              </h2>

              <Statement as="p" className="mt-6 max-w-[24ch] text-balance">
                {product.summary}
              </Statement>
            </Reveal>

            {/* Prose reveals each paragraph on its own trigger — see
                typography/index.tsx — so it sits outside the block above
                rather than nested inside its single reveal. */}
            <div className="mt-8">
              <Prose paragraphs={product.description} className="max-w-[52ch]" />
            </div>
          </div>
        </div>
      </Container>

      <Container bleed className="mt-16">
        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow as="h3" className="pb-4">
              Materials
            </Eyebrow>
            <ul className="flex flex-col">
              {product.materials.map((material) => (
                <li
                  key={material}
                  className="border-t border-hairline py-3 text-small"
                >
                  {material}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <Eyebrow as="h3" className="pb-4">
              Applications
            </Eyebrow>
            <ul className="flex flex-col">
              {product.applications.map((application) => (
                <li
                  key={application}
                  className="border-t border-hairline py-3 text-small"
                >
                  {application}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <Eyebrow as="h3" className="pb-4">
              Specification
            </Eyebrow>
            <dl className="flex flex-col">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 border-t border-hairline py-3"
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
      </Container>

      {product.gallery.length > 0 && (
        <Container bleed className="mt-16">
          <Reveal
            as="ul"
            stagger={0.08}
            className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-8 sm:grid-cols-3"
          >
            {product.gallery.map((image, i) => (
              <li key={image.src + i}>
                <Figure
                  asset={image}
                  ratio="tall"
                  sizes="(min-width: 640px) 30vw, 100vw"
                />
              </li>
            ))}
          </Reveal>
        </Container>
      )}

      <Container bleed className="mt-12">
        <ButtonLink href="/contact" variant="quiet">
          Enquire about {product.title.toLowerCase()}
          <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:translate-x-1 motion-reduce:transition-none" />
        </ButtonLink>
      </Container>
    </article>
  );
}
