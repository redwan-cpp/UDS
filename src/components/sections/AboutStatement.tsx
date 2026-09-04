import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionSketch } from "@/components/ui/SectionSketch";
import { Figure } from "@/components/ui/Media";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Eyebrow, Statement } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import type { MediaAsset } from "@/types/content";

/**
 * The About band.
 *
 * Deliberately not a "we are a passionate team" block. It is an editorial
 * opening spread: a short statement set large in the serif, then the supporting
 * paragraphs dropped to a narrow column on the left while the photograph runs
 * off the right edge of the grid. The asymmetry does real work — it leaves the
 * negative space that makes the statement read as a statement.
 */
export function AboutStatement({
  statement,
  approach,
  image,
}: {
  statement: string[];
  approach: string[];
  image: MediaAsset;
}) {
  return (
    <Section id="about" surface="light" spacing="pivotal" labelledBy="about-heading">
      {/* The drawn section, along the foot of the band, behind everything.
          It sits here rather than anywhere else because this is the section
          that already argues the studio works "in plan, section and light" —
          a drawing under that sentence is the sentence's own evidence, not
          decoration hunting for a wall. Anchored bottom-left so it reads as
          standing on the section's own baseline, and cropped by the band
          rather than fitted into it, the way a sheet runs off the edge of a
          drawing board. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[min(22rem,45%)] text-hairline opacity-70 md:block"
      >
        <SectionSketch />
      </div>

      <Container className="relative">
        <Reveal>
          <div className="flex items-baseline gap-4 pb-4">
            <span className="text-meta uppercase text-accent" data-numeric>
              01
            </span>
            <Eyebrow>The studio</Eyebrow>
          </div>
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        {/*
          One flowing text column, one independent photo column, both placed
          in the same explicit grid row (7 + 5 = 12, no overlap). This used to
          be three items — statement, photo, approach — with the photo and the
          approach block sharing an *auto-placed* second row, nudged into
          position with `mt-24` on one and `-mt-32` on the other. Those two
          margins were fighting over the height of a row neither of them fully
          controlled: the row's height came from the (tall) photo, so pulling
          the (short) approach text up by 8rem left it stranded in the middle
          of that tall row instead of near the statement above it — the "gap
          with no purpose". A single flowing column has no row to fight over.
        */}
        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 pt-12 md:pt-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 lg:col-start-1">
            <h2 id="about-heading" className="sr-only">
              About the studio
            </h2>
            <Reveal>
              <Statement as="p" className="max-w-[20ch] text-ink">
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

            {/* Each paragraph gets its own trigger, the same as the
                statement lines above — a shared reveal on the whole block
                finishes before a reader scrolling normally has seen most of
                it, which is what reads as content popping in already-formed. */}
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

          {/* The photograph breaks the container to the right — the one grid
              break this section is allowed. `mt-16` is purely decorative
              offset; nothing in the other column counteracts it, so it can
              never reopen this bug.

              Rendered via Figure, not the bare Media used elsewhere in this
              set: this particular frame is CC BY, and attribution is a term
              of the licence, not optional decoration. The caption carries it
              in the same quiet register as a caption anywhere else on the
              site — see media.curation.ts. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:-mr-(--gutter) lg:mt-16">
            <Reveal variant="curtain">
              <Figure
                asset={image}
                ratio="tall"
                priority
                revealMedia
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
