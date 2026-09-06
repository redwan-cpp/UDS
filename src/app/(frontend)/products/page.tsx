import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CategoryFilter, readCategory } from "@/components/ui/CategoryFilter";
import { ProductCard } from "@/components/products/ProductCard";
import { navIndex } from "@/data/navigation";
import { heroCopy } from "@/data/copy";
import { getProducts } from "@/data/content.cms";
// Pure functions over an array — no database involved, so they stay where they
// were rather than following the accessor into the CMS module.
import { countProducts, filterProducts, productFilters } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Custom doors and fabricated sheet work, designed and specified by Uthan Design Studio.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = readCategory(category, productFilters);
  const products = filterProducts(await getProducts(), active);

  return (
    <>
      <PageHero
        index={navIndex("/products")}
        eyebrow={heroCopy["/products"].eyebrow}
        title={heroCopy["/products"].title}
        intro={heroCopy["/products"].intro}
        aside={
          <DemoNotice>
            Both product lines are real. The copy on each is illustrative — not
            confirmed capability data. Replaced once the studio supplies it.
          </DemoNotice>
        }
      />

      {/* Cards only. Each one is a real link into that product's own page,
          where the materials, applications and specification live — the
          listing's job is to get a visitor to the right line, not to hold the
          spec sheet for both at once. */}
      <Section
        surface="dark"
        spacing="none"
        className="pt-16 pb-24 md:pt-20 md:pb-32"
        labelledBy="product-index-heading"
      >
        <Container>
          {/* The cards below are h3 (matching the card language everywhere
              else on the site); without this the document jumped h1 to h3. */}
          <h2 id="product-index-heading" className="sr-only">
            The product lines
          </h2>

          <div className="flex flex-col gap-4 border-b border-hairline pb-3 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <CategoryFilter
              filters={productFilters.map((f) => ({
                value: f.value,
                label: f.label,
                count: countProducts(f.value),
              }))}
              active={active}
              basePath="/products"
              label="Filter products by category"
            />
            <p
              aria-live="polite"
              className="shrink-0 pb-3 text-meta uppercase text-secondary"
            >
              <span data-numeric>{products.length}</span>{" "}
              {products.length === 1 ? "line" : "lines"}
            </p>
          </div>

          {products.length === 0 ? (
            <p className="pt-14 text-meta uppercase text-secondary">
              No product lines in this category yet.
            </p>
          ) : (
            <Reveal
              as="ul"
              stagger={0.08}
              className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 pt-14 md:grid-cols-2"
            >
              {products.map((product, i) => (
                <li key={product.id}>
                  <ProductCard product={product} priority={i === 0} />
                </li>
              ))}
            </Reveal>
          )}
        </Container>
      </Section>
    </>
  );
}
