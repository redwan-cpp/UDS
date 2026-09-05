import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Eyebrow, Statement } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import { ExpertiseBrowser } from "@/components/expertise/ExpertiseBrowser";
import type { ExpertiseArea } from "@/types/content";

/**
 * The opening spread: what the studio is, beside what it does.
 *
 * These were two full-width bands — an editorial About statement with a
 * photograph, then a separate Expertise index listing nine areas as rows with
 * a sticky companion image, with the figures band sitting between them. They
 * were answering one question in two places and taking three screens to do
 * it, so they are now one spread: the statement holds the left, the nine
 * areas become a browsable column on the right.
 *
 * **A vertical hairline divides them, not a box.** Two panels on one ground,
 * each with its own index and eyebrow, separated by a rule — the same way a
 * drawing sheet carries two titled panels. The rule appears only at `lg`,
 * where the two are genuinely side by side; below that they stack and the
 * divider becomes the horizontal rule each panel already has under its own
 * label, so the separation survives the reflow without being restated.
 *
 * The About photograph that used to hold the right column is gone — the
 * expertise browser occupies that space now, and it carries nine photographs
 * of its own rather than one. That frame is still in use elsewhere in the
 * curated set, so nothing is orphaned by dropping it here.
 */
export function AboutStatement({
  statement,
  approach,
  areas,
}: {
  statement: string[];
  approach: string[];
  areas: ExpertiseArea[];
}) {
  return (
    <Section id="about" surface="light" spacing="pivotal" labelledBy="about-heading">
      <Container>
        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-baseline gap-4 pb-4">
                <span className="text-meta uppercase text-accent" data-numeric>
                  01
                </span>
                <Eyebrow>The studio</Eyebrow>
              </div>
              <div className="h-px w-full bg-hairline" />
            </Reveal>

            <h2 id="about-heading" className="sr-only">
              About the studio
            </h2>

            <Reveal>
              <Statement as="p" className="mt-8 max-w-[20ch] text-ink">
                {statement[0]}
              </Statement>
            </Reveal>

            {statement.slice(1).map((paragraph, i) => (
              <Reveal key={i} delay={0.1}>
                <p className="mt-8 max-w-[46ch] font-serif text-lead text-secondary">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            {/* Each paragraph gets its own trigger, the same as the statement
                lines above — a shared reveal on the whole block finishes
                before a reader scrolling normally has seen most of it, which
                is what reads as content popping in already-formed. */}
            <div className="mt-12 flex flex-col gap-5 border-t border-hairline pt-8">
              {approach.map((paragraph, i) => (
                <Reveal key={i} delay={Math.min(i, 2) * 0.05}>
                  <p className="max-w-[54ch] text-body text-pretty">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <ButtonLink href="/about" variant="quiet" className="mt-8">
                Read about the practice
                <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:translate-x-1 motion-reduce:transition-none" />
              </ButtonLink>
            </Reveal>
          </div>

          {/* The dividing rule rides on this column rather than being its own
              grid item: a hairline needs no column of its own, and giving it
              one would put a third track in a twelve-column grid that the rest
              of the page's compositions do not share. */}
          <div className="lg:col-span-4 lg:col-start-9 lg:border-l lg:border-hairline lg:pl-(--grid-gap)">
            <Reveal>
              <ExpertiseBrowser areas={areas} eyebrow="What we do" index="02" />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
