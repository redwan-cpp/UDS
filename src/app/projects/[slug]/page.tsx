import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { ProjectGallery, ProcessGallery } from "@/components/projects/ProjectGallery";
import { RelatedProjects } from "@/components/projects/RelatedProjects";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Prose, Statement } from "@/components/typography";
import { DemoNotice } from "@/components/hero/PageHero";
import {
  getProjectBySlug,
  getProjectSlugs,
  getRelatedProjects,
} from "@/data/projects";

/**
 * Statically rendered per project so every case study is individually
 * crawlable and cacheable. In Phase 2 this reads the CMS instead; the shape of
 * the page does not change.
 */
export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

/** A narrative band. Renders nothing when the CMS has not filled the section. */
function Narrative({
  eyebrow,
  heading,
  paragraphs,
  lead,
}: {
  eyebrow: string;
  heading: string;
  paragraphs?: string[];
  lead?: boolean;
}) {
  if (!paragraphs?.length) return null;

  return (
    // `lg:items-start`: the eyebrow/heading column is one short line; the text
    // column beside it can run to several paragraphs. The grid default
    // (stretch) would pin the short column to the top of a row sized by the
    // long one and leave bare space below it — `items-start` keeps every
    // column at its own natural height instead.
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-(--grid-gap)">
      <div className="lg:col-span-3">
        <Reveal>
          <Eyebrow as="h2">{eyebrow}</Eyebrow>
          <p className="mt-3 text-h3">{heading}</p>
        </Reveal>
      </div>
      <div className="lg:col-span-7 lg:col-start-5">
        {lead ? (
          <>
            {/* Prose now reveals each of its own paragraphs on its own
                trigger (see typography/index.tsx) — only the lead statement
                still needs its own wrapper here. */}
            <Reveal delay={0.1}>
              <Statement as="p" className="mb-8">
                {paragraphs[0]}
              </Statement>
            </Reveal>
            <Prose paragraphs={paragraphs.slice(1)} />
          </>
        ) : (
          <Prose paragraphs={paragraphs} />
        )}
      </div>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug, 3);

  return (
    <article>
      <ProjectHero project={project} />

      <Section surface="dark" spacing="standard">
        <Container>
          {project.isDemo && (
            <div className="pb-12">
              <DemoNotice>
                This project is placeholder content written for design review. It
                is not the studio&rsquo;s work, and no site, client or
                commission described here is real.
              </DemoNotice>
            </div>
          )}

          <ProjectFacts facts={project.facts} id="facts-top" />
        </Container>
      </Section>

      <Section surface="light" spacing="standard">
        <Container>
          <div className="flex flex-col gap-20 md:gap-28">
            <Narrative
              eyebrow="Description"
              heading="The project"
              paragraphs={project.description}
              lead
            />
            <Narrative
              eyebrow="Uniqueness"
              heading="What makes it particular"
              paragraphs={project.uniqueness}
            />
            <Narrative
              eyebrow="Our concept"
              heading="Where it started"
              paragraphs={project.concept}
            />
          </div>
        </Container>
      </Section>

      <Section surface="dark" spacing="none" className="py-8">
        <ProjectGallery images={project.gallery} title={`${project.title} gallery`} />
      </Section>

      {project.process && project.process.length > 0 && (
        <Section surface="soft" spacing="standard" labelledBy="process-heading">
          <Container>
            <Reveal>
              <Eyebrow as="h2" id="process-heading">
                Rough work
              </Eyebrow>
              <p className="mt-3 max-w-[38ch] text-h3">
                Drawings, studies and site
              </p>
              <p className="mt-4 max-w-[52ch] text-small text-secondary">
                The working documents behind the finished building — including
                the parts that changed.
              </p>
            </Reveal>

            <div className="pt-12">
              <ProcessGallery images={project.process} />
            </div>
          </Container>
        </Section>
      )}

      <Section surface="light" spacing="standard">
        <Container width="text" className="mx-0 lg:mx-auto">
          <ProjectFacts facts={project.facts} title="Project information" />
        </Container>
      </Section>

      <RelatedProjects projects={related} />
    </article>
  );
}
