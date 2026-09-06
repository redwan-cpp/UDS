import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Media, Figure } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Eyebrow, Prose, Statement } from "@/components/typography";
import { NewsCard } from "@/components/news/NewsCard";
import { Arrow } from "@/components/ui/Button";
import { DemoNotice } from "@/components/hero/PageHero";
import { formatDate } from "@/lib/labels";
import { getNews, getNewsBySlug, getNewsSlugs, newsKindLabels } from "@/data/news";

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const more = getNews()
    .filter((n) => n.slug !== slug)
    .slice(0, 3);

  return (
    <article>
      <header className="surface-dark bg-ink pt-32 md:pt-44">
        <Container width="text" className="mx-auto">
          <nav aria-label="Breadcrumb" className="pb-6">
            <Link
              href="/news"
              className="group/back inline-flex items-center gap-2 text-meta uppercase text-secondary transition-colors hover:text-accent"
            >
              <Arrow className="rotate-180 transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/back:-translate-x-1 motion-reduce:transition-none" />
              All entries
            </Link>
          </nav>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pb-5">
            <Eyebrow className="text-accent">{newsKindLabels[item.kind]}</Eyebrow>
            <time
              dateTime={item.date}
              data-numeric
              className="text-meta uppercase text-secondary"
            >
              {formatDate(item.date)}
            </time>
            {item.location && (
              <span className="text-meta uppercase text-secondary">
                {item.location}
              </span>
            )}
          </div>

          <div className="h-px w-full bg-hairline" />

          <div className="pt-8 pb-12">
            <RevealText
              as="h1"
              text={item.title}
              className="text-h1 text-balance"
              immediate
              stagger={0.05}
            />
            {item.organisation && (
              <p className="mt-6 text-meta uppercase text-secondary">
                With {item.organisation}
              </p>
            )}
          </div>
        </Container>

        <Reveal variant="curtain">
          <Media asset={item.image} ratio="cinema" priority revealMedia sizes="100vw" />
        </Reveal>
      </header>

      <Section surface="light" spacing="standard">
        <Container width="text" className="mx-auto">
          {item.isDemo && (
            <div className="pb-10">
              <DemoNotice>
                Placeholder entry written for design review. This agreement,
                event or announcement did not happen.
              </DemoNotice>
            </div>
          )}

          <Reveal>
            <Statement as="p" className="text-balance">
              {item.summary}
            </Statement>
          </Reveal>

          {/* Prose reveals each paragraph on its own trigger — see
              typography/index.tsx — so no outer wrapper is needed here. */}
          <div className="mt-10 border-t border-hairline pt-10">
            <Prose paragraphs={item.body} />
          </div>

          {item.documents && item.documents.length > 0 && (
            <Reveal>
              <div className="mt-12 border-t border-hairline pt-8">
                <Eyebrow as="h2" className="pb-4">
                  Documentation
                </Eyebrow>
                <ul className="flex flex-col">
                  {item.documents.map((doc) => (
                    <li
                      key={doc.label}
                      className="flex items-baseline justify-between gap-6 border-t border-hairline py-3.5"
                    >
                      {/* Rendered unlinked, not as href="#". File storage is a
                          later phase, and a dead link is worse than an honest
                          one that says so. */}
                      <span className="text-small">{doc.label}</span>
                      <span className="shrink-0 text-meta uppercase text-secondary">
                        Not yet available
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-caption text-secondary">
                  Documents are listed to show the layout. File storage arrives
                  with the CMS in a later phase.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {item.gallery && item.gallery.length > 0 && (
        <Section surface="dark" spacing="standard" label={`${item.title} gallery`}>
          <Container>
            <Reveal
              as="ul"
              stagger={0.08}
              className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 md:grid-cols-2"
            >
              {item.gallery.map((image, i) => (
                <li key={image.src + i}>
                  <Figure asset={image} ratio="landscape" sizes="(min-width: 768px) 46vw, 100vw" />
                </li>
              ))}
            </Reveal>
          </Container>
        </Section>
      )}

      <Section surface="soft" spacing="standard" labelledBy="more-heading">
        <Container>
          <h2 id="more-heading" className="text-h2">
            More from the studio
          </h2>
          <Reveal
            as="ul"
            stagger={0.07}
            className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {more.map((next) => (
              <li key={next.id}>
                <NewsCard item={next} />
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
    </article>
  );
}
