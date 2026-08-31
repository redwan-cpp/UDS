import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow } from "@/components/typography";
import { categoryLabels, statusLabels } from "@/lib/labels";
import type { Project } from "@/types/content";

/**
 * The opening of a project page.
 *
 * Title first, then the photograph full-bleed beneath it. That order is
 * deliberate: an architecture publication leads with the name of the work and
 * lets the image follow, and it puts real text at the top of the document for
 * anyone reading without images.
 */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="surface-dark bg-ink pt-32 md:pt-44">
      <Container>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pb-5">
          <Eyebrow>{categoryLabels[project.category]}</Eyebrow>
          <span className="text-meta uppercase text-secondary">
            {project.location}
          </span>
          <span data-numeric className="text-meta uppercase text-secondary">
            {project.year}
          </span>
          <span className="text-meta uppercase text-accent">
            {statusLabels[project.status]}
          </span>
        </div>

        <Reveal variant="rule" duration={0.9}>
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        <div className="grid grid-cols-1 gap-8 pt-10 pb-14 lg:grid-cols-12 lg:gap-(--grid-gap)">
          <div className="lg:col-span-7">
            <RevealText
              as="h1"
              text={project.title}
              className="text-h1"
              immediate
              stagger={0.07}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.25}>
              <p className="max-w-[44ch] font-serif text-lead text-secondary">
                {project.summary}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Full-bleed. The one place the container is deliberately escaped. */}
      <Reveal variant="curtain">
        <Media
          asset={project.hero}
          ratio="cinema"
          priority
          revealMedia
          sizes="100vw"
        />
      </Reveal>
    </header>
  );
}
