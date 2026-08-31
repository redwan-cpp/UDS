import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/content";

/**
 * Closing a project page with somewhere to go.
 *
 * Also the site's main internal-linking device: it keeps every project within
 * two clicks of every other one, which is what makes the work crawlable in
 * depth rather than only from the index.
 */
export function RelatedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section surface="soft" spacing="standard" labelledBy="related-heading">
      <Container>
        <Reveal>
          <SectionHead
            eyebrow="Continue"
            title="Related projects"
            id="related-heading"
          />
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.08}
          className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, i) => (
            <li key={project.id}>
              <ProjectCard project={project} index={i + 1} />
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
