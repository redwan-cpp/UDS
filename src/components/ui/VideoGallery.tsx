import type { LinkedVideo, VideoAsset } from "@/types/content";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/typography";
import { directVideoMimeType, linkedVideoEmbedUrl } from "@/lib/video-links";

interface VideoGalleryProps {
  title: string;
  videos?: VideoAsset[];
  linkedVideos?: LinkedVideo[];
}

/**
 * Editor-supplied supporting footage, not a decorative autoplay background.
 *
 * `preload="metadata"` gives visitors a duration and first frame without
 * spending their data allowance on a video they may never play. Controls stay
 * visible because a project, article, or collaboration video needs a reader's
 * deliberate choice to start it.
 */
export function VideoGallery({ title, videos, linkedVideos }: VideoGalleryProps) {
  if (!videos?.length && !linkedVideos?.length) return null;

  return (
    <Section surface="dark" spacing="standard" label={`${title} videos`}>
      <Container>
        <Reveal>
          <Eyebrow as="h2">Videos</Eyebrow>
        </Reveal>
        <ul className="mt-8 flex flex-col gap-14">
          {videos?.map((video) => (
            <li key={video.sources[0].src}>
              <Reveal>
                <figure>
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={video.description || title}
                    className="aspect-video w-full border border-hairline bg-ink"
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
          {linkedVideos?.map((video) => {
            const embedUrl = linkedVideoEmbedUrl(video);
            const mimeType = directVideoMimeType(video.url);

            return (
              <li key={`${video.provider}-${video.url}`}>
                <Reveal>
                  <figure>
                    {embedUrl ? (
                      <iframe
                        title={video.label}
                        src={embedUrl}
                        loading="lazy"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="aspect-video w-full border border-hairline bg-ink"
                      />
                    ) : mimeType ? (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={video.label}
                        className="aspect-video w-full border border-hairline bg-ink"
                      >
                        <source src={video.url} type={mimeType} />
                      </video>
                    ) : null}
                    <figcaption className="mt-3 text-small text-secondary">
                      {video.label}
                    </figcaption>
                    {embedUrl ? (
                      <ButtonLink
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        className="mt-5"
                      >
                        Full video <Arrow />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </ButtonLink>
                    ) : null}
                  </figure>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
