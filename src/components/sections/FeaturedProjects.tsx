import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectLoop } from "@/components/projects/ProjectLoop";
import type { Project } from "@/types/content";

/**
 * The work band.
 *
 * A grid of photographs that give up their details on hover, rather than the
 * alternating full-width spreads this used to be. The spread gave four
 * projects a page each, which took four screens to say what a practice's
 * homepage should say in one.
 *
 * The grid itself now lives in `ProjectLoop`, which holds two rows on screen
 * and steps through the rest on an endless loop. This section keeps the head,
 * the surface and the route out to the full index — the parts that are
 * composition rather than behaviour.
 *
 * Count-agnostic: it renders whatever it is handed, at two columns from `md`,
 * and the loop's controls appear only when there is more than one window of
 * work to step through.
 */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section
      surface="dark"
      spacing="pivotal"
      labelledBy="projects-heading"
      id="projects"
    >
      <Container>
        <Reveal>
          <SectionHead
            index="04"
            eyebrow="Selected work"
            title="Projects"
            id="projects-heading"
            aside={
              <p className="text-small text-secondary">
                The studio&rsquo;s major projects. Hover a card for the detail,
                or open one for the full case study.
              </p>
            }
          />
        </Reveal>

        {/* The grid moved into `ProjectLoop`, which windows it to two rows and
            steps through the rest. The reveal wraps the loop rather than the
            cards: a per-card stagger belongs to a list that arrives once, and
            these cards now re-enter on every step, where a staggered cascade
            would fire again each time a reader pressed an arrow. */}
        <Reveal>
          <ProjectLoop projects={projects} />
        </Reveal>

        {/* Centred under the loop's own down control, and on the same axis as
            it, so the two read as one column of controls: step through the
            work here, or leave the loop for the whole list.

            No rule of its own. The loop already closes with a hairline under
            the bottom stepper, and a second full-width rule 80px below it made
            a band out of what is a single button. The spacing carries it. */}
        <Reveal className="mt-10 flex justify-center">
          <ButtonLink href="/projects" variant="secondary">
            Show all projects
            <Arrow />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
