import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { NewsCard } from "@/components/news/NewsCard";
import { getNews } from "@/data/news";
import { navIndex } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Collaboration & News",
  description:
    "Collaborations, events, memoranda, announcements and publications from Uthan Design Studio.",
};

export default function NewsPage() {
  const items = getNews();

  return (
    <>
      <PageHero
        index={navIndex("/news")}
        eyebrow="From the studio"
        title="Collaboration & News"
        intro="Agreements, exhibitions, site milestones and things we have published."
        aside={
          <DemoNotice>
            Placeholder entries for design review. No collaboration, event or
            agreement described here is real, and no organisation is named.
          </DemoNotice>
        }
      />

      <Section surface="dark" spacing="none" className="pb-24 md:pb-32">
        <Container>
          <p className="pb-8 text-meta uppercase text-secondary">
            <span data-numeric>{items.length}</span> entries
          </p>

          <Reveal
            as="ul"
            stagger={0.07}
            className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item, i) => (
              <li key={item.id}>
                <NewsCard item={item} priority={i < 3} />
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
