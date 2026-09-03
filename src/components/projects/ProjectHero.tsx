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
 * The photograph leads, full-bleed, and the name follows beneath it with the
 * summary set against it on the right. This reverses the earlier order, which
 * put the title first on the reasoning that a publication names the work
 * before showing it. The studio asked for the image to open the page, and it
 * is the stronger opening for a practice whose case is made visually — the
 * hero is the argument, and the title is the caption on it.
 *
 * The concern the old order was protecting against — a reader without images
 * meeting a blank page — does not apply: the hero carries real alt text, so a
 * screen reader hears a description of the work and then its name, in that
 * order, which is the same sequence a sighted reader gets.
 */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="surface-dark bg-ink">
      {/* Full-bleed, and running right to the top edge: the fixed header is
          transparent until the page scrolls, so it sits over the banner rather
          than on an ink band above it. Reclaiming that band is also what lets
          the banner, the title and the facts all land above the fold on a
          laptop. */}
      <div className="relative">
        <Reveal variant="curtain">
          <Media
            asset={project.hero}
            ratio="banner"
            priority
            revealMedia
            sizes="100vw"
          />
        </Reveal>

        {/* The header's own text sits on this. A project hero is whatever
            photograph the studio uploaded and may be bright at the top, so the
            wordmark and the index need their own ground rather than trusting
            the image to be dark there. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 from-0% via-ink/35 via-55% to-transparent md:h-40"
        />
      </div>

      <Container>
        {/* The name, with the summary answering it across the grid. */}
        <div className="grid grid-cols-1 gap-8 pt-12 pb-8 md:pt-14 lg:grid-cols-12 lg:items-end lg:gap-(--grid-gap)">
          <div className="lg:col-span-7">
            <RevealText
              as="h1"
              text={project.title}
              className="text-h1"
              immediate
              stagger={0.07}
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.25}>
              <p className="max-w-[44ch] font-serif text-lead text-secondary">
                {project.summary}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal variant="rule" duration={0.9}>
          <div className="h-px w-full bg-hairline" />
        </Reveal>

        {/* The facts that belong with the title, on the rule beneath it. */}
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3 pt-5 pb-12">
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
      </Container>
    </header>
  );
}
