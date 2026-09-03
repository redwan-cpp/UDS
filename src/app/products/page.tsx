import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFeature } from "@/components/products/ProductFeature";
import { getProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Custom doors and fabricated sheet work, designed and specified by Uthan Design Studio.",
};

export default function ProductsPage() {
  const products = getProducts();

  return (
    <>
      <PageHero
        index="04"
        eyebrow="Made, not bought"
        title="Products"
        intro="Two lines that come out of the studio's own projects: the doors people touch every day, and the folded metal that quietly decides how a facade reads."
        aside={
          <DemoNotice>
            Both product lines are real. The copy below is illustrative —
            written in the register a finished spec sheet would use — not
            confirmed capability data. Replaced once the studio supplies it.
          </DemoNotice>
        }
      />

      {/* The two lines as cards first — image, cycling on hover through the
          rest of the gallery, name and a line of summary. Each one is a
          same-page jump to its full feature below, not a separate route: two
          products do not need two pages, they need a way past the first
          screenful of writing to the one a visitor actually wants. */}
      <Section surface="dark" spacing="standard">
        <Container>
          {/* The cards below are h3 (matching the card language everywhere
              else on the site); without this the document jumped h1 to h3. */}
          <h2 className="sr-only">The product lines</h2>

          <Reveal
            as="ul"
            stagger={0.08}
            className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 md:grid-cols-2"
          >
            {products.map((product, i) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  anchorId={product.slug}
                  priority={i === 0}
                />
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section surface="dark" spacing="none" className="pb-24 md:pb-32">
        <Container>
          <div className="flex flex-col gap-24 md:gap-32">
            {products.map((product, i) => (
              <ProductFeature
                key={product.id}
                product={product}
                position={i + 1}
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
