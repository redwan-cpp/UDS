import type { Metadata } from "next";

import { pageMetadata, projectJsonLd } from "@/lib/share";
import { notFound } from "next/navigation";

import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { ProcessGallery } from "@/components/projects/ProcessGallery";
import { ProjectSlideshow } from "@/components/projects/ProjectSlideshow";
import { RelatedProjects } from "@/components/projects/RelatedProjects";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ViewMore } from "@/components/ui/ViewMore";
import { VideoGallery } from "@/components/ui/VideoGallery";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, Prose, RichText, Statement } from "@/components/typography";
import type { Paragraph } from "@/types/content";
import { DemoNotice } from "@/components/hero/PageHero";
import { getCopy } from "@/data/content.cms";
import {
  getProjectBySlug,
  getProjectSlugs,
  getRelatedProjects,
} from "@/data/projects.cms";

/**
 * Statically rendered per project so every case study is individually
 * crawlable and cacheable. In Phase 2 this reads the CMS instead; the shape of
 * the page does not change.
 */
export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  // The project's own hero, not the site's default picture. A shared project
  // link is the likeliest thing anybody posts from this site, and the card
  // should show the building rather than the studio's stock frame.
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    seo: project.seo,
    image: project.hero,
  });
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
  paragraphs?: Paragraph[];
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
                <RichText paragraph={paragraphs[0]} />
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
  const { sectionCopy } = await getCopy();
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  // A project with nothing written is a card in the index, not a page. Since
  // `portfolio` merged into `projects` the collection holds both, and this is
  // the line between them — `getProjectSlugs` refuses the same set, so nothing
  // is built that this would then reject.
  if (!project || !project.description?.length) notFound();

  const related = await getRelatedProjects(slug, 3);
  const remainingDescription = project.description.slice(1);
  const hasMoreWriting =
    remainingDescription.length > 0 ||
    Boolean(project.uniqueness?.length) ||
    Boolean(project.concept?.length);

  return (
    <article>
      {/* Editor-authored, from the studio's own project fields — not public
          input. Same escaping as the sitewide graph in layout.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd(project)).replace(/</g, "\\u003c"),
        }}
      />
      <ProjectHero project={project} />

      {project.isDemo && (
        <Section surface="dark" spacing="none" className="pb-14">
          <Container>
            <DemoNotice>
              This project is placeholder content written for design review. It
              is not the studio&rsquo;s work, and no site, client or commission
              described here is real.
            </DemoNotice>
          </Container>
        </Section>
      )}

      {/* More of the project, before the reading. Someone who wants the images
          gets them without opening anything; someone who wants the argument
          opens the disclosure below. */}
      {project.gallery?.length ? (
        <Section surface="dark" spacing="standard">
          <Container width="full" bleed>
            <ProjectSlideshow
              images={project.gallery}
              title={`${project.title} — gallery`}
              fullBleed
            />
          </Container>
        </Section>
      ) : null}

      <VideoGallery
        videos={project.videos}
        linkedVideos={project.linkedVideos}
        title={project.title}
      />

      {/* The writing and the information table sit behind one disclosure. The
          hero already answers "what is this" — the long form is for the reader
          who wants it, and putting it behind a control keeps the page's spine
          the work itself rather than a wall of type. It is a native <details>,
          so the text is still in the DOM for search and for find-in-page. */}
      {/* The information table is open on the page, above the disclosure —
          these are the facts a visitor scans for and should not have to open
          anything to reach. Only the long-form writing sits behind View more. */}
      <Section surface="light" spacing="standard">
        <Container>
          {project.facts?.length ? (
            <ProjectFacts
              facts={project.facts}
              title={sectionCopy["project.facts"].title}
            />
          ) : null}

          <div className="pt-16 md:pt-20">
            <Narrative
              eyebrow={sectionCopy["project.description"].eyebrow}
              heading="The project"
              paragraphs={[project.description[0]]}
              lead
            />
            {hasMoreWriting ? (
              <ViewMore label="View more" openLabel="View less" className="mt-12">
                <div className="flex flex-col gap-20 md:gap-28">
                  {remainingDescription.length > 0 ? (
                    <Prose paragraphs={remainingDescription} />
                  ) : null}
                <Narrative
                  eyebrow={sectionCopy["project.uniqueness"].eyebrow}
                  heading="What makes it particular"
                  paragraphs={project.uniqueness}
                />
                <Narrative
                  eyebrow={sectionCopy["project.concept"].eyebrow}
                  heading="Where it started"
                  paragraphs={project.concept}
                />
                </div>
              </ViewMore>
            ) : null}
          </div>
        </Container>
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

      {/* The information table moved up into the disclosure above, beside the
          writing it belongs with, rather than repeating the same facts a third
          time at the foot of the page. */}

      <RelatedProjects projects={related} copy={sectionCopy["project.related"]} />
    </article>
  );
}
