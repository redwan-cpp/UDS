import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { Statement, Eyebrow } from "@/components/typography";
import { getSustainabilityPrinciples } from "@/data/sustainability";
import { navIndex } from "@/data/navigation";
import { heroCopy } from "@/data/copy";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "How Uthan Design Studio approaches material responsibility, passive design, reuse and the long life of a building.",
};

export default function SustainabilityPage() {
  const principles = getSustainabilityPrinciples();

  return (
    <>
      <PageHero
        index={navIndex("/sustainability")}
        eyebrow={heroCopy["/sustainability"].eyebrow}
        title={heroCopy["/sustainability"].title}
        intro={heroCopy["/sustainability"].intro}
        aside={
          <DemoNotice>
            These themes are placeholders. The studio&rsquo;s actual practice,
            and any figure or certification, is deliberately absent rather than
            invented.
          </DemoNotice>
        }
      />

      <Section surface="light" spacing="pivotal">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-(--grid-gap)">
            <div className="lg:col-span-8">
              <Reveal>
                <Statement as="p" className="max-w-[24ch]">
                  The greenest building is usually the one that is already
                  standing.
                </Statement>
                <p className="mt-8 max-w-[54ch] font-serif text-lead text-secondary">
                  The second greenest is the one nobody needs to rebuild in
                  twenty years. Most of what follows is about those two
                  sentences, applied at the point in a project where the answer
                  still costs nothing to change.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="dark" spacing="standard" labelledBy="principles-heading">
        <Container>
          <h2 id="principles-heading" className="sr-only">
            Principles
          </h2>

          <ul>
            {principles.map((principle) => (
              <li key={principle.id} className="border-t border-hairline last:border-b">
                <Reveal>
                  {/* `lg:items-start` (not the grid default of `stretch`) keeps
                      the title and description flush with the top of the row —
                      the natural reading position — regardless of how tall the
                      row grows. Without it, a short fixed-aspect image sharing
                      the row with a long description-plus-measures list got
                      stretched to the row's full height and sat pinned to the
                      top of that stretched box, leaving dead space below it
                      the height of the difference. The image itself is then
                      given `lg:self-center`, so whatever space its shorter
                      height leaves in a taller row is split evenly above and
                      below it — it reads as a picture floating beside the
                      text, not as a mistake. */}
                  <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-6 py-10 lg:grid-cols-12 lg:items-start lg:py-14">
                    <div className="flex items-baseline gap-4 lg:col-span-3">
                      <span data-numeric className="text-meta uppercase text-accent">
                        {principle.index}
                      </span>
                      <h3 className="text-h3">{principle.title}</h3>
                    </div>

                    <div className="lg:col-span-5 lg:col-start-5">
                      <p className="max-w-[56ch] text-body text-secondary">
                        {principle.description}
                      </p>

                      {principle.measures.length > 0 ? (
                        <ul className="mt-5 flex flex-col gap-2">
                          {principle.measures.map((measure) => (
                            <li key={measure} className="text-small">
                              {measure}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-5 text-meta uppercase text-secondary">
                          Specific measures to be confirmed by the studio
                        </p>
                      )}
                    </div>

                    {principle.image && (
                      <div className="lg:col-span-3 lg:col-start-10 lg:self-center">
                        <Media
                          asset={principle.image}
                          ratio="landscape"
                          sizes="(min-width: 1024px) 22vw, 100vw"
                        />
                      </div>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-14 border-l border-accent pl-5">
            <Eyebrow as="h2" className="text-accent">
              A note on what is not here
            </Eyebrow>
            <p className="mt-3 max-w-[60ch] text-small text-secondary">
              There are no percentages, ratings or certifications on this page.
              A sustainability claim is only worth making if it can be
              evidenced, and the studio has not yet supplied that evidence.
              Placeholder numbers here would be greenwashing with extra steps.
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
