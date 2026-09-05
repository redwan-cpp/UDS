import { Section } from "@/components/ui/Section";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Eyebrow, Statement } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import { ExpertiseBrowser } from "@/components/expertise/ExpertiseBrowser";
import type { ExpertiseArea } from "@/types/content";

/**
 * The opening spread: what the studio is, beside what it does.
 *
 * These were two full-width bands — an editorial About statement with a
 * photograph, then a separate expertise index listing nine areas as rows,
 * with the figures band sitting between them. They were answering one
 * question in two places and taking three screens to do it, so they are now
 * one spread: the statement holds the left half, the nine areas the right.
 *
 * **The two halves are two grounds, split down the middle.** Paper on the
 * left, ink on the right, each running to its own edge of the viewport — the
 * colour change is what divides them, so there is no rule and no box doing
 * the same job twice. It is the one place on the site where a single section
 * carries both surfaces, and each half declares its own (`surface-light` is
 * the Section's; the right half sets `surface-dark` itself), so the accent,
 * the secondary text and the hairlines flip correctly on each side without
 * either being told what is behind it.
 *
 * The split lives outside `Container`, which is what lets each ground reach
 * the viewport edge rather than stopping at the page gutter. Alignment is
 * kept by capping each half's content at half the container width and hugging
 * it to the centre line: at any width up to the container's cap the content
 * simply fills its half from the page gutter, exactly as every other section
 * does, and past that the two columns meet in the middle while the outer
 * margins grow — which is what the capped container does too.
 *
 * Below `lg` the halves stack, each keeping its own ground, so the division
 * survives the reflow as a horizontal edge instead of a vertical one.
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
  // Half the page container, so the two halves' contents align to the same
  // centre line the full-width sections above and below align their edges to.
  const halfWidth = "w-full lg:max-w-[calc(var(--container-wide)/2)]";
  const halfPadding = "px-(--gutter) py-[var(--space-pivotal)]";

  return (
    <Section
      id="about"
      surface="light"
      spacing="none"
      labelledBy="about-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className={`${halfPadding} lg:flex lg:justify-end`}>
          <div className={halfWidth}>
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
                Read about the practice
                <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:translate-x-1 motion-reduce:transition-none" />
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        {/* Declares its own surface, per the rule that whatever paints a
            ground names it — otherwise the accent here would still resolve to
            the light surface's olive and land at 2.6:1 on ink. */}
        <div
          className={`surface-dark bg-ink text-paper ${halfPadding} lg:flex lg:justify-start`}
        >
          <div className={halfWidth}>
            <Reveal>
              <ExpertiseBrowser areas={areas} eyebrow="What we do" index="02" />
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
