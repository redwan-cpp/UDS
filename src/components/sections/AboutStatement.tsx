import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Eyebrow, Statement } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import { ExpertiseBrowser } from "@/components/expertise/ExpertiseBrowser";
import type { ExpertiseArea, SectionCopy } from "@/types/content";

/**
 * The opening spread: what the studio is, beside what it does.
 *
 * These were two full-width bands — an editorial About statement with a
 * photograph, then a separate expertise index listing nine areas as rows,
 * with the figures band sitting between them. They were answering one
 * question in two places and taking three screens to do it, so they are now
 * one spread in equal halves: the statement left, the nine areas right.
 *
 * **One ground, divided by a rule.** A split-surface version of this — paper
 * left, ink right, each bleeding to its own viewport edge — was built and
 * rejected: two grounds inside one section read as two sections that had been
 * shoved together, and it made the right half recede rather than sit beside
 * its neighbour. The division is a vertical hairline again, which is what the
 * rest of the site uses to divide anything.
 *
 * The rule appears only at `lg`, where the halves are genuinely side by side.
 * Below that they stack and the horizontal rule under each panel's own label
 * carries the separation, so it survives the reflow without being restated.
 */
export function AboutStatement({
  statement,
  approach,
  areas,
  copy,
  expertiseCopy,
  readMoreLabel,
}: {
  statement: string[];
  approach: string[];
  areas: ExpertiseArea[];
  /** The statement half's own head. */
  copy: SectionCopy;
  /** The expertise half's head, passed straight through to the browser. */
  expertiseCopy: SectionCopy;
  readMoreLabel: string;
}) {
  return (
    <Section
      id="about"
      surface="light"
      spacing="standard"
      labelledBy="about-heading"
    >
      <Container>
        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-baseline gap-4 pb-4">
                <span className="text-meta uppercase text-accent" data-numeric>
                  {copy.index}
                </span>
                <Eyebrow>{copy.eyebrow}</Eyebrow>
              </div>
              <div className="h-px w-full bg-hairline" />
            </Reveal>

            <h2 id="about-heading" className="sr-only">
              About the studio
            </h2>

            <Reveal>
              <Statement as="p" className="mt-8 max-w-[20ch]">
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
                {readMoreLabel}
                <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:translate-x-1 motion-reduce:transition-none" />
              </ButtonLink>
            </Reveal>
          </div>

          {/* The dividing rule rides on this column rather than being its own
              grid item: a hairline needs no column of its own, and giving it
              one would put a thirteenth track in a twelve-column grid that no
              other composition on the page shares. */}
          <div className="lg:col-span-6 lg:border-l lg:border-hairline lg:pl-(--grid-gap)">
            <Reveal>
              <ExpertiseBrowser
                areas={areas}
                eyebrow={expertiseCopy.eyebrow ?? ""}
                index={expertiseCopy.index ?? ""}
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
