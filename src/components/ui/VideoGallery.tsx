import type { VideoAsset } from "@/types/content";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/typography";

interface VideoGalleryProps {
  title: string;
  videos?: VideoAsset[];
}

/**
 * Editor-supplied supporting footage, not a decorative autoplay background.
 *
 * `preload="metadata"` gives visitors a duration and first frame without
 * spending their data allowance on a video they may never play. Controls stay
 * visible because a project, article, or collaboration video needs a reader's
 * deliberate choice to start it.
 */
export function VideoGallery({ title, videos }: VideoGalleryProps) {
  if (!videos?.length) return null;

  return (
    <Section surface="dark" spacing="standard" label={`${title} videos`}>
      <Container>
        <Reveal>
          <Eyebrow as="h2">Moving image</Eyebrow>
        </Reveal>
        <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          {videos.map((video) => (
            <li key={video.sources[0].src}>
              <Reveal>
                <figure>
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={video.description}
                    className="aspect-video w-full bg-ink"
                  >
                    {video.sources.map((source) => (
                      <source key={source.src} src={source.src} type={source.type} />
                    ))}
                  </video>
                  {video.description ? (
                    <figcaption className="mt-3 text-small text-secondary">
                      {video.description}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
