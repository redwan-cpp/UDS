import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import { BrandIndex } from "@/components/brands/BrandIndex";
import type { Brand } from "@/types/content";

export function BrandsSection({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <Section surface="dark" spacing="connective" labelledBy="brands-heading">
      <Container>
        <Reveal>
          <SectionHead
            index="06"
            eyebrow="Who we work with"
            title="Collaborators"
            id="brands-heading"
            aside={
              <p className="text-small text-secondary">
                Consultants and makers the studio works with repeatedly, because
                the second project together is always better than the first.
              </p>
            }
          />
        </Reveal>

        <div className="pt-12">
          <BrandIndex brands={brands} />
        </div>
      </Container>
    </Section>
  );
}
