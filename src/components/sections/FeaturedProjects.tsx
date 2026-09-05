import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { WorkCard } from "@/components/projects/WorkCard";
import type { Project } from "@/types/content";

/**
 * The work band.
 *
 * A grid of photographs that give up their details on hover, rather than the
 * alternating full-width spreads this used to be. The spread gave four
 * projects a page each; the grid shows the whole body of work at once and lets
 * the reader choose where to stop, which is what a practice's homepage is for.
 *
 * Count-agnostic: it renders whatever it is handed, at two columns from `md`.
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

        {/* `items-start` is not needed here — every card is the same fixed
            ratio — but the gap is generous on purpose: these cards carry a lot
            on hover and need room to not read as a contact sheet. */}
        <Reveal
          as="ul"
          stagger={0.08}
          className="mt-16 grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 md:mt-20 md:grid-cols-2"
        >
          {projects.map((project, i) => (
            <li key={project.id}>
              <WorkCard project={project} index={i + 1} priority={i < 2} />
            </li>
          ))}
        </Reveal>

        <Reveal className="mt-20 flex justify-start border-t border-hairline pt-10">
          <ButtonLink href="/projects" variant="secondary">
            The full index
            <Arrow />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
