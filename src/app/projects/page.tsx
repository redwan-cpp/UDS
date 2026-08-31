import type { Metadata } from "next";

import { PageHero, DemoNotice } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Major Projects",
  description:
    "Selected architecture, interior and urban projects by Uthan Design Studio, shown at length.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHero
        index="02"
        eyebrow="Selected work"
        title="Major Projects"
        intro="A small number of projects, documented properly — the thinking, the drawings, and what happened on site."
        aside={
          <DemoNotice>
            Every project shown here is placeholder content created for design
            review. None of it is the studio&rsquo;s work.
          </DemoNotice>
        }
      />

      <Section surface="dark" spacing="none" className="pb-24 md:pb-32">
        <Container>
          <p className="pb-8 text-meta uppercase text-secondary">
            <span data-numeric>{projects.length}</span> projects
          </p>

          <Reveal
            as="ul"
            stagger={0.08}
            className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project, i) => (
              <li key={project.id}>
                <ProjectCard project={project} index={i + 1} priority={i < 3} />
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
