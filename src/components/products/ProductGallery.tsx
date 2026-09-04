"use client";

import { useState } from "react";

import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import type { MediaAsset } from "@/types/content";

/**
 * The product detail page's gallery — a large frame plus a clickable
 * thumbnail rail, the one interaction every ecommerce product page shares.
 * Isolated from the page around it because it is the only interactive part:
 * the page itself stays a server component so `generateStaticParams` and
 * `generateMetadata` can do their job.
 *
 * No `key` on the swapped image: the `Reveal` is armed once, on first
 * scroll into view, by the curtain's own scroll trigger. Keying the image to
 * `active` would remount it on every thumbnail click, re-arming a reveal
 * whose trigger position may already be scrolled past — the classic way a
 * scroll reveal gets stuck at `opacity: 0` after the fact. `Media` already
 * fades a changed `src` in on its own `load`.
 */
export function ProductGallery({
  frames,
  priority,
}: {
  frames: MediaAsset[];
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <Reveal variant="curtain">
        <Media
          asset={frames[active]}
          ratio="landscape"
          revealMedia
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </Reveal>

      {frames.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {frames.map((frame, i) => (
            <li key={frame.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active || undefined}
                aria-label={`Image ${i + 1} of ${frames.length}`}
                className={`relative block size-16 overflow-hidden border transition-colors duration-[var(--dur-fast)] ${
                  i === active
                    ? "border-accent"
                    : "border-hairline hover:border-accent/60"
                }`}
              >
                <Media asset={frame} ratio="square" sizes="64px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
