"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";

import { Arrow } from "@/components/ui/Button";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import type { MediaAsset } from "@/types/content";

/**
 * The image viewer.
 *
 * A glass panel over the page rather than a solid one: the plate you opened
 * stays faintly present behind it, so the viewer reads as looking *closer* at
 * something on the page rather than as being taken to a different screen. It
 * is the same `.uds-glass` surface the site index already uses — glass is a
 * declared exception in this project (design.md's Anti-brief note), not a
 * decoration reached for here for the first time.
 *
 * What it has to get right, because a lightbox that misses these is a trap:
 *
 * - **`object-fit: contain`, not `cover`.** Every other image on the site is
 *   cropped to a frame the layout chose. This is the one place the whole
 *   photograph is the point, so it is fitted to the viewport instead — which
 *   is why it uses `next/image` directly rather than `Media`, whose job is
 *   the opposite.
 * - **Keyboard parity with the pointer.** Left/Right step through the set,
 *   `Esc` closes, focus is trapped inside while open and restored to the
 *   thumbnail that opened it on close (`useFocusTrap`), and the page behind
 *   cannot scroll (`useLockBodyScroll`).
 * - **The credit travels with the image.** Several demo plates are CC BY,
 *   where attribution is a licence term rather than a courtesy — an enlarged
 *   view that dropped it would be the one view that breaks the licence.
 * - **Enter animation is a keyframe, not a transition.** It plays once on
 *   insertion with no state flip to miss; there is deliberately no exit
 *   animation, because an exit needs a state machine that can strand the
 *   overlay on screen, and that failure is far worse than an instant close.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  label = "Image viewer",
}: {
  images: MediaAsset[];
  /** The open image, or `null` when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  /**
   * A `useState` setter, not a plain callback — stepping has to be a
   * functional update. React batches events, so two arrow presses landing in
   * one batch would both compute their target from the same stale index and
   * the second would be a no-op: hold Right and the viewer advances one plate
   * and stops.
   */
  onIndexChange: Dispatch<SetStateAction<number | null>>;
  label?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const open = index !== null;

  useFocusTrap(panel, open, onClose);
  useLockBodyScroll(open);

  const step = useCallback(
    (delta: number) => {
      if (images.length === 0) return;
      // Wraps in both directions: at the last plate the next one is the first
      // again, rather than a dead arrow the visitor has to work out is dead.
      onIndexChange((current) =>
        current === null
          ? current
          : (current + delta + images.length) % images.length,
      );
    },
    [images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    };
    // `Esc` is handled by useFocusTrap, which also owns focus restoration —
    // duplicating it here would close twice and fight over the restore.
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  if (index === null) return null;
  const image = images[index];
  if (!image) return null;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      className="uds-lightbox uds-glass surface-dark fixed inset-0 z-90 flex flex-col bg-ink/85 outline-none backdrop-blur-2xl backdrop-saturate-150 [animation:fade_var(--dur-base)_var(--ease-out-soft)]"
    >
      {/* Top rule: the counter on the left, close on the right — the same
          two-ends composition the header and the site index both use. */}
      <div className="flex shrink-0 items-center justify-between gap-6 border-b border-hairline px-(--gutter) py-4">
        <p className="text-meta uppercase text-secondary">
          <span data-numeric className="text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true"> / </span>
          <span data-numeric>{String(images.length).padStart(2, "0")}</span>
          <span className="sr-only">of {images.length}</span>
        </p>

        <button
          type="button"
          onClick={onClose}
          className="group/close -mr-2 flex min-h-11 items-center gap-3 px-2 text-nav uppercase transition-colors duration-[var(--dur-fast)] hover:text-accent"
        >
          Close
          <span aria-hidden="true" className="relative block size-4">
            <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      {/* The plate. `min-h-0` lets this row absorb the leftover height and
          keeps the image inside it rather than pushing the caption off the
          bottom of a short viewport. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-(--gutter) py-6">
        <Image
          // Keyed so a changed plate mounts fresh and replays the rise —
          // without it the swap is a silent src change with no read on it.
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="90vw"
          className="max-h-full w-auto max-w-full object-contain [animation:uds-rise_var(--dur-slow)_var(--ease-out-soft)]"
        />

        {images.length > 1 && (
          <>
            <ViewerArrow
              direction="previous"
              onClick={() => step(-1)}
              className="left-2 md:left-4"
            />
            <ViewerArrow
              direction="next"
              onClick={() => step(1)}
              className="right-2 md:right-4"
            />
          </>
        )}
      </div>

      {/* The caption rule. Alt text is the description here rather than a
          duplicate: it is already written per use, and in this view it is the
          only text about the picture. */}
      <div className="shrink-0 border-t border-hairline px-(--gutter) py-4">
        <p className="max-w-[70ch] text-small text-paper">{image.alt}</p>
        {(image.caption || image.credit) && (
          <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-caption text-secondary">
            {image.caption && <span>{image.caption}</span>}
            {image.credit && (
              <span>
                {image.credit}
                {image.licence ? ` · ${image.licence}` : ""}
              </span>
            )}
          </p>
        )}
        {images.length > 1 && (
          <p className="mt-2 text-meta uppercase text-secondary">
            Arrow keys to move · Esc to close
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * A step control. Square, hairline-bordered and transparent — the same
 * geometry as a secondary button, because that is what it is; a circular
 * translucent chevron would be a control from a different design system
 * borrowed for the occasion.
 */
function ViewerArrow({
  direction,
  onClick,
  className = "",
}: {
  direction: "previous" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-hairline bg-ink/60 text-paper transition-colors duration-[var(--dur-fast)] hover:border-accent hover:text-accent ${className}`}
    >
      <span className="sr-only">
        {direction === "previous" ? "Previous image" : "Next image"}
      </span>
      <Arrow className={direction === "previous" ? "rotate-180" : ""} />
    </button>
  );
}
