import { Container } from "@/components/ui/Container";
import { Figure, Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import type { MediaAsset } from "@/types/content";

/**
 * The main project gallery.
 *
 * Two authored compositions (design.md §7):
 *   Desktop — an editorial field. Images alternate between full-width, offset
 *             pairs and single indented plates, so the page has a rhythm
 *             instead of a uniform stack. The pattern is derived from position,
 *             so any number of images works.
 *   Mobile  — a horizontal snap-scroll strip. A masonry field on a 375px screen
 *             becomes an endless column of small pictures; a strip keeps each
 *             photograph at a size worth looking at.
 */
export function ProjectGallery({
  images,
  title,
}: {
  images: MediaAsset[];
  title: string;
}) {
  if (images.length === 0) return null;

  return (
    <section aria-labelledby="gallery-heading" className="py-16 md:py-24">
      <Container>
        <h2 id="gallery-heading" className="sr-only">
          {title}
        </h2>
      </Container>

      {/* Mobile: a snap strip. Sized so the next plate is always just visible,
          which is what tells you the strip scrolls. */}
      <div className="md:hidden">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-4">
          {images.map((image, i) => (
            <li key={image.src + i} className="w-[86%] shrink-0 snap-start">
              <Figure asset={image} ratio="landscape" sizes="86vw" />
            </li>
          ))}
        </ul>
        <Container>
          <p className="text-meta uppercase text-secondary">
            <span data-numeric>{images.length}</span> images · scroll sideways
          </p>
        </Container>
      </div>

      {/* Desktop: the editorial field.
          Beats 1 and 2 (landscape + portrait) are grouped into ONE flex row
          rather than left as two independent grid items whose column spans
          happen to sum to 12. CSS Grid auto-places same-row siblings into a
          shared track sized to the tallest one, then stretches every item to
          fill it — so a portrait neighbour taller than a landscape one left a
          slab of bare ink beneath the shorter image every three plates. A flex
          row with `items-start` sizes each image to its own aspect ratio and
          simply lets the bottom edges fall where they fall, which reads as
          rhythm rather than as a gap. */}
      <Container className="hidden md:block">
        <div className="flex flex-col gap-y-16">
          {groupIntoRows(images).map((row, ri) =>
            row.length === 1 ? (
              <Reveal key={row[0].image.src + row[0].i} variant="curtain">
                <Figure
                  asset={row[0].image}
                  ratio="wide"
                  sizes="(min-width: 1024px) 90vw, 100vw"
                />
              </Reveal>
            ) : (
              <div
                key={ri}
                className="flex flex-col items-start gap-(--grid-gap) sm:flex-row"
              >
                <div className="w-full sm:w-[58.3333%]">
                  <Reveal variant="curtain">
                    <Figure
                      asset={row[0].image}
                      ratio="landscape"
                      sizes="(min-width: 1024px) 52vw, 100vw"
                    />
                  </Reveal>
                </div>
                <div className="w-full sm:w-[41.6667%]">
                  <Reveal variant="curtain">
                    <Figure
                      asset={row[1].image}
                      ratio="portrait"
                      sizes="(min-width: 1024px) 38vw, 100vw"
                    />
                  </Reveal>
                </div>
              </div>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}

/**
 * Groups the gallery sequence into the rows the editorial field actually
 * renders: a single full-width plate, then a landscape+portrait pair, on
 * repeat. Kept out of the JSX so the pairing rule has one place to change.
 */
function groupIntoRows(
  images: MediaAsset[],
): { image: MediaAsset; i: number }[][] {
  const rows: { image: MediaAsset; i: number }[][] = [];
  for (let i = 0; i < images.length; ) {
    const beat = i % 3;
    if (beat === 0) {
      rows.push([{ image: images[i], i }]);
      i += 1;
    } else if (i + 1 < images.length) {
      rows.push([
        { image: images[i], i },
        { image: images[i + 1], i: i + 1 },
      ]);
      i += 2;
    } else {
      // A trailing single image that didn't get a partner — give it the
      // full-width treatment rather than a lone half-width plate.
      rows.push([{ image: images[i], i }]);
      i += 1;
    }
  }
  return rows;
}

/**
 * Rough work / behind the scenes.
 *
 * Set as a smaller, denser strip than the main gallery — these are working
 * documents, not finished plates, and presenting them at the same scale would
 * claim more for them than they are.
 */
export function ProcessGallery({ images }: { images: MediaAsset[] }) {
  if (images.length === 0) return null;

  return (
    <Reveal
      as="ul"
      stagger={0.08}
      className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      {images.map((image, i) => (
        <li key={image.src + i}>
          <Media
            asset={image}
            ratio="landscape"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          />
          {image.alt && (
            <p className="mt-3 text-caption text-secondary">{image.alt}</p>
          )}
        </li>
      ))}
    </Reveal>
  );
}
