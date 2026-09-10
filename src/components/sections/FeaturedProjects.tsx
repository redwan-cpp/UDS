import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import type { Project, SectionCopy } from "@/types/content";

/**
 * The work band.
 *
 * A grid of photographs that give up their details on hover, rather than the
 * alternating full-width spreads this used to be. The spread gave four
 * projects a page each, which took four screens to say what a practice's
 * homepage should say in one.
 *
 * The grid itself now lives in `ProjectGrid`, which shows four projects and
 * grows downward when the reader asks for more. This section keeps the head,
 * the surface and the route out to the full index — the parts that are
 * composition rather than behaviour.
 *
 * Count-agnostic: it renders whatever it is handed, at two columns from `md`,
 * and the loop's controls appear only when there is more than one window of
 * work to step through.
 */
export function FeaturedProjects({
  projects,
  copy,
  allLabel,
}: {
  projects: Project[];
  copy: SectionCopy;
  /** Label on the link out to the full index. */
  allLabel: string;
}) {
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
            index={copy.index}
            eyebrow={copy.eyebrow}
            title={copy.title}
            id="projects-heading"
            aside={
              copy.aside && (
                <p className="text-small text-secondary">{copy.aside}</p>
              )
            }
          />
        </Reveal>

        {/* The grid moved into `ProjectGrid`, which shows four and grows
            downward. The reveal wraps the grid rather than the cards: a
            per-card stagger belongs to a list that arrives once, and cards
            added by the control animate themselves on mount. */}
        <Reveal>
          <ProjectGrid projects={projects} />
        </Reveal>

        {/* Centred under the grid's own control, and on the same axis as it,
            so the two read as one column: expand the work here, or leave for
            the whole index.

            No rule of its own. The grid already closes with a hairline under
            its control, and a second full-width rule 80px below it made
            a band out of what is a single button. The spacing carries it. */}
        <Reveal className="mt-10 flex justify-center">
          <ButtonLink href="/projects" variant="secondary">
            {allLabel}
            <Arrow />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
