import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { DemoNotice } from "@/components/hero/PageHero";
import { ProductGallery } from "@/components/products/ProductGallery";
import {
  getProductBySlug,
  getProductSlugs,
  getProducts,
} from "@/data/content.cms";

/**
 * Statically rendered per product line, the same as every project and news
 * entry — individually crawlable and cacheable rather than a fragment of a
 * listing page. In Phase 2 this reads the CMS instead; the shape does not
 * change.
 */
export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.summary,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const other = await (await getProducts()).find((p) => p.slug !== product.slug);
  const frames = product.gallery.length > 0 ? product.gallery : [product.hero];

  return (
    <article>
      <Section surface="dark" spacing="pivotal">
        <Container bleed>
          <div className="px-(--gutter)">
            <ButtonLink href="/products" variant="quiet">
              <Arrow className="rotate-180 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:-translate-x-1 motion-reduce:transition-none" />
              All products
            </ButtonLink>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 px-(--gutter) lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ProductGallery frames={frames} priority />
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span data-numeric className="text-meta uppercase text-accent">
                    {String(product.order).padStart(2, "0")}
                  </span>
                  <Eyebrow>Product line</Eyebrow>
                </div>

                <h1 className="mt-5 text-h2">{product.title}</h1>

                <p className="mt-4 max-w-[46ch] text-body text-secondary text-pretty">
                  {product.summary}
                </p>
              </Reveal>

              {product.isDemo && (
                <div className="mt-8">
                  <DemoNotice>
                    This product line is real. The copy below is
                    illustrative — not confirmed capability data. Replaced
                    once the studio supplies it.
                  </DemoNotice>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-8">
                <div>
                  <Eyebrow as="h2" className="pb-4">
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
                  <Eyebrow as="h2" className="pb-4">
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
                  <Eyebrow as="h2" className="pb-4">
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
                <ButtonLink href="/contact" variant="primary" className="mt-10">
                  Enquire about {product.title.toLowerCase()}
                  <Arrow />
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {other && (
        <Section surface="light" spacing="connective">
          <Container>
            <ButtonLink href={`/products/${other.slug}`} variant="quiet">
              Also from the studio — {other.title}
              <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:translate-x-1 motion-reduce:transition-none" />
            </ButtonLink>
          </Container>
        </Section>
      )}
    </article>
  );
}
