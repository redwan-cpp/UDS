import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import type { Project } from "@/types/content";

/**
 * The featured work band.
 *
 * Count-agnostic by design: the brief asks for four, and the component renders
 * whatever it is given — one, four, or twenty — without the layout changing
 * shape, because the alternation is derived from position rather than hard-coded.
 */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section
      surface="light"
      spacing="pivotal"
      labelledBy="projects-heading"
      id="projects"
    >
      <Container>
        <Reveal>
          <SectionHead
            index="04"
            eyebrow="Selected work"
            title="Major Projects"
            id="projects-heading"
            aside={
              <p className="text-small text-secondary">
                A small number of projects, shown at length. The full index is in
                the portfolio.
              </p>
            }
          />
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
          {projects.map((project, i) => (
            <FeaturedProject
              key={project.id}
              project={project}
              position={i + 1}
              priority={i === 0}
            />
          ))}
        </div>

        <Reveal className="mt-20 flex justify-start border-t border-hairline pt-10">
          <ButtonLink href="/projects" variant="secondary">
            All major projects
            <Arrow />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
