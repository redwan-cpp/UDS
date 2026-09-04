import type { Metadata } from "next";

import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead, Statement, Prose } from "@/components/typography";
import { TeamGrid } from "@/components/team/TeamGrid";
import { Numbers } from "@/components/sections/Numbers";
import { studio } from "@/data/studio";
import { team } from "@/data/team";
import { statistics } from "@/data/statistics";
import { expertise } from "@/data/expertise";
import { img } from "@/data/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Uthan Design Studio — an architecture and design practice working across architecture, interiors and spatial strategy.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="The practice"
        title="About"
        intro={studio.statement[0]}
      />

      <Section surface="light" spacing="pivotal">
        <Container>
          <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <Statement as="p" className="max-w-[22ch]">
                  {studio.statement[1] ?? studio.statement[0]}
                </Statement>
              </Reveal>
              {/* Prose reveals each paragraph on its own trigger — see
                  typography/index.tsx — so it sits outside the Statement's
                  Reveal rather than nested inside it. */}
              <div className="mt-10 border-t border-hairline pt-8">
                <Prose paragraphs={studio.approach} className="max-w-[54ch]" />
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal variant="curtain">
                <Media
                  asset={img(
                    "about",
                    2,
                    "Studio interior with drawings and models on a working table",
                  )}
                  ratio="tall"
                  revealMedia
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Same interactive figures band as the homepage — a hover-responsive
          rule and lift, not a static dl. Two places showing the same numbers
          two different ways would read as an inconsistency, not a variation. */}
      <Numbers statistics={statistics} />

      <Section
        id="expertise"
        surface="dark"
        spacing="standard"
        labelledBy="disciplines-heading"
      >
        <Container>
          <Reveal>
            <SectionHead
              index="02"
              eyebrow="Areas of work"
              title="What the studio does"
              id="disciplines-heading"
            />
          </Reveal>

          <ul className="grid grid-cols-1 gap-x-(--grid-gap) pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((area) => (
              <li
                key={area.id}
                className="flex items-baseline gap-4 border-t border-hairline py-5"
              >
                <span data-numeric className="text-meta uppercase text-accent">
                  {area.index}
                </span>
                <span className="text-body">{area.title}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="light" spacing="standard" labelledBy="people-heading">
        <Container>
          <Reveal>
            <SectionHead
              index="03"
              eyebrow="Who does the work"
              title="Management Team"
              id="people-heading"
              aside={
                <p className="text-small text-secondary">
                  Names and roles are placeholders. Portraits are deliberately
                  absent rather than borrowed from unrelated people.
                </p>
              }
            />
          </Reveal>
          <div className="pt-12">
            <TeamGrid members={team} />
          </div>
        </Container>
      </Section>
    </>
  );
}
