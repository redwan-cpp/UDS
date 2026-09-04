"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/motion/Reveal";
import type { MediaAsset } from "@/types/content";

/**
 * A gallery plate.
 *
 * The image is a button that opens the viewer, and the caption sits outside
 * it — a caption inside the control would be read out as part of the button's
 * name, turning "Open image 3" into the whole credit line. The corner mark is
 * the affordance: at rest the plate is just the photograph, and the expand
 * glyph arrives on hover or focus, the same way every other card on the site
 * holds its detail back until it is being looked at.
 */
function Plate({
  image,
  ratio,
  sizes,
  index,
  onOpen,
  priority,
}: {
  image: MediaAsset;
  ratio: "landscape" | "portrait" | "wide";
  sizes: string;
  index: number;
  onOpen: (index: number) => void;
  priority?: boolean;
}) {
  return (
    <figure>
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Enlarge: ${image.alt}`}
        className="group relative block w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <Media
          asset={image}
          ratio={ratio}
          sizes={sizes}
          priority={priority}
          revealMedia
        />

        {/* Expand mark: four corner brackets pulling outward on hover. Drawn
            rather than borrowed — one stroke weight, matching the section
            mark and the arrow already in the system. */}
        <span
          aria-hidden="true"
          className="surface-dark pointer-events-none absolute top-4 right-4 flex size-9 items-center justify-center border border-paper/30 bg-ink/50 text-paper opacity-0 transition-opacity duration-[var(--dur-base)] ease-out-soft group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-4">
            <path
              d="M6 2H2V6M10 2H14V6M14 10V14H10M6 14H2V10"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="square"
            />
          </svg>
        </span>
      </button>

      {(image.caption || image.credit) && (
        <figcaption className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-caption text-secondary">
          {image.caption && <span>{image.caption}</span>}
          {image.credit && (
            <span className="opacity-70">
              {image.credit}
              {image.licence ? ` · ${image.licence}` : ""}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

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
 *
 * Every plate opens the viewer (`Lightbox`), where the photograph is shown
 * whole rather than cropped to the frame the composition chose for it. One
 * viewer instance serves both compositions — the mobile strip and the desktop
 * field are two arrangements of the same list, so they share one index.
 */
export function ProjectGallery({
  images,
  title,
}: {
  images: MediaAsset[];
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

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
        <ul className="uds-scroll-x flex snap-x snap-mandatory gap-4 px-(--gutter) pb-4">
          {images.map((image, i) => (
            <li key={image.src + i} className="w-[86%] shrink-0 snap-start">
              <Plate
                image={image}
                ratio="landscape"
                sizes="86vw"
                index={i}
                onOpen={setOpen}
              />
            </li>
          ))}
        </ul>
        <Container>
          <p className="text-meta uppercase text-secondary">
            <span data-numeric>{images.length}</span> images · scroll sideways ·
            tap to enlarge
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
                <Plate
                  image={row[0].image}
                  ratio="wide"
                  sizes="(min-width: 1024px) 90vw, 100vw"
                  index={row[0].i}
                  onOpen={setOpen}
                />
              </Reveal>
            ) : (
              <div
                key={ri}
                className="flex flex-col items-start gap-(--grid-gap) sm:flex-row"
              >
                <div className="w-full sm:w-[58.3333%]">
                  <Reveal variant="curtain">
                    <Plate
                      image={row[0].image}
                      ratio="landscape"
                      sizes="(min-width: 1024px) 52vw, 100vw"
                      index={row[0].i}
                      onOpen={setOpen}
                    />
                  </Reveal>
                </div>
                <div className="w-full sm:w-[41.6667%]">
                  <Reveal variant="curtain">
                    <Plate
                      image={row[1].image}
                      ratio="portrait"
                      sizes="(min-width: 1024px) 38vw, 100vw"
                      index={row[1].i}
                      onOpen={setOpen}
                    />
                  </Reveal>
                </div>
              </div>
            ),
          )}
        </div>
      </Container>

      <Lightbox
        images={images}
        index={open}
        onClose={() => setOpen(null)}
        onIndexChange={setOpen}
        label={title}
      />
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
 * Rough work — sketches, drawings and site photography.
 *
 * A horizontal strip rather than a grid, because that is what this material
 * is: a run of working documents you scan along, not a set of finished plates
 * you study one at a time. A grid gives every sheet the same weight and the
 * same finish as the photography above it, which flatters it wrongly — these
 * are notes.
 *
 * It is a real scroll container, not a JS carousel: it works with a trackpad,
 * a shift-wheel, a touch drag, and the keyboard (the strip is focusable and
 * scrolls with arrow keys) without shipping a line of script. The plates snap
 * so the strip always settles somewhere deliberate.
 *
 * These are the sheets most worth enlarging — a drawing at 31% of a column is
 * legible as a drawing and not as its content — so each one opens the viewer
 * too.
 */
export function ProcessGallery({ images }: { images: MediaAsset[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div>
      <ul
        // A focusable scroll container needs a name, or it is announced as an
        // unlabelled group that happens to be tabbable. It keeps `tabIndex`
        // even though the plates are now buttons: the buttons tab in sequence,
        // and the container itself remains arrow-key scrollable for anyone
        // who reaches it that way.
        aria-label="Rough work, scrolls horizontally"
        className="uds-scroll-x -mx-(--gutter) flex snap-x snap-mandatory gap-6 px-(--gutter) pb-6"
      >
        {images.map((image, i) => (
          <li
            key={image.src + i}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Enlarge: ${image.alt}`}
              className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Media
                asset={image}
                ratio="landscape"
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
              />
              <p className="mt-3 flex gap-3 text-caption text-secondary">
                <span data-numeric className="shrink-0 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {image.alt}
              </p>
            </button>
          </li>
        ))}
      </ul>

      <p className="text-meta uppercase text-secondary">
        <span data-numeric>{images.length}</span> sheets · scroll sideways ·
        click to enlarge
      </p>

      <Lightbox
        images={images}
        index={open}
        onClose={() => setOpen(null)}
        onIndexChange={setOpen}
        label="Rough work"
      />
    </div>
  );
}
