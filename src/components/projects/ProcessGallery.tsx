"use client";

import { Media } from "@/components/ui/Media";
import type { MediaAsset } from "@/types/content";

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
 * **These sheets deliberately do not enlarge, and are guarded against casual
 * saving**: no context menu, no drag-off, no selection, and `.uds-protected`
 * takes the images out of hit-testing so a right-click or long-press has no
 * image to offer. This is the studio's unpublished thinking — concept
 * sketches and working drawings — and the finished photography above is what
 * the page is actually offering to be looked at closely.
 *
 * Worth being straight about the ceiling: this stops the three gestures
 * someone reaches for without thinking. It cannot stop a screenshot, devtools,
 * or a direct request for the file URL, and nothing rendered in a browser can.
 * If a drawing genuinely must not leave the studio, the answer is not
 * publishing it at full resolution — serve a smaller derivative, or keep it
 * off the site.
 *
 * This file was `ProjectGallery.tsx` and carried a second, larger composition
 * of the same name for the main gallery. That was superseded by
 * `ProjectSlideshow` and had not been imported by anything since; it is gone,
 * and the file is now named for the one component it actually holds.
 */
export function ProcessGallery({ images }: { images: MediaAsset[] }) {
  if (images.length === 0) return null;

  return (
    <div>
      <ul
        tabIndex={0}
        // A focusable scroll container needs a name, or it is announced as an
        // unlabelled group that happens to be tabbable.
        aria-label="Rough work, scrolls horizontally"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        className="uds-scroll-x uds-protected -mx-(--gutter) flex snap-x snap-mandatory gap-6 px-(--gutter) pb-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {images.map((image, i) => (
          <li
            key={image.src + i}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
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
          </li>
        ))}
      </ul>

      <p className="text-meta uppercase text-secondary">
        <span data-numeric>{images.length}</span> sheets · scroll sideways
      </p>
    </div>
  );
}
