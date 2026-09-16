import type { Metadata } from "next";

import { pageMetadata } from "@/lib/share";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { NewsCard } from "@/components/news/NewsCard";
import { getKnowledge } from "@/data/content.cms";
import { navIndex } from "@/data/navigation";
import { heroCopy } from "@/data/copy";

// The description was news's, copied and left behind — which would have put
// "events, memoranda, announcements" on the share card for a section of
// writing about building. Replaced with what this section actually is.
export const metadata: Metadata = pageMetadata({
  title: "Knowledge",
  description:
    "Writing from Uthan Design Studio on material, detail, and how buildings are put together.",
  path: "/knowledge",
});

export default async function NewsPage() {
  const items = await getKnowledge();

  return (
    <>
      <PageHero
        index={navIndex("/knowledge")}
        eyebrow={heroCopy["/knowledge"].eyebrow}
        title={heroCopy["/knowledge"].title}
        intro={heroCopy["/knowledge"].intro}
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
                <NewsCard item={item} priority={i < 3} basePath="/knowledge" />
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
