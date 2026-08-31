import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { NewsCard } from "@/components/news/NewsCard";
import type { NewsItem } from "@/types/content";

export function LatestNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section surface="light" spacing="standard" labelledBy="news-heading">
      <Container>
        <Reveal>
          <SectionHead
            index="07"
            eyebrow="From the studio"
            title="Collaboration & News"
            id="news-heading"
            aside={
              <ButtonLink href="/news" variant="quiet">
                All entries
                <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:translate-x-1 motion-reduce:transition-none" />
              </ButtonLink>
            }
          />
        </Reveal>

        <ul className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:pt-16">
          {items.map((item) => (
            <li key={item.id}>
              <NewsCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
