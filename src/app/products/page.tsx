import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
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
