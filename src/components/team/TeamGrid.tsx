"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { SocialIcon } from "@/components/contact/SocialIcon";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { Flip, gsap, prefersReducedMotion } from "@/lib/gsap";
import type { TeamMember } from "@/types/content";
import { CloseIcon } from "@/components/ui/Button";

/**
 * A team member, expanding in place to a detail view on click.
 *
 * Adapted from a card pattern seen on watermelon.ui — but rebuilt, not
 * copied: that implementation depends on Framer Motion's `layoutId` for the
 * shared-element morph, which is not in this project's five-dependency
 * budget (memory.md). GSAP's `Flip` does the same job — measure the
 * element's rect, let React re-render it in its new state, animate the
 * delta — and costs nothing extra to bundle: it has shipped inside the core
 * `gsap` package since 3.13, so it is already sitting in `node_modules`,
 * not a sixth dependency.
 *
 * The expanded card is the *same* DOM element as the grid card, not a
 * duplicate mounted elsewhere — reparenting it would mean unmounting and
 * remounting, which is exactly what Flip exists to avoid. It self-centers
 * via `fixed; inset: 0; margin: auto` with explicit dimensions rather than a
 * transform, deliberately: that is the one thing that must not carry a
 * static transform of its own, since Flip's animated transform is applied on
 * top of whatever the browser already computed for both the start and end
 * rect, and a competing hand-authored transform is the usual way this class
 * of animation gets a first frame that jumps.
 */
function TeamMemberCard({
  member,
  position,
  expanded,
  onExpand,
  onCollapse,
}: {
  member: TeamMember;
  position: number;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}) {
  const hasPortrait = Boolean(member.portrait.src);
  const articleRef = useRef<HTMLElement>(null);

  useFocusTrap(articleRef, expanded, onCollapse);
  useLockBodyScroll(expanded);

  return (
      <article
        ref={articleRef}
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded || undefined}
        aria-label={expanded ? `${member.name}, ${member.role}` : undefined}
        tabIndex={expanded ? -1 : undefined}
        data-flip-id={member.id}
        className={
          expanded
            ? "surface-dark fixed inset-6 z-90 overflow-y-auto bg-ink p-6 text-paper outline-none sm:p-8 md:inset-0 md:m-auto md:h-[min(38rem,85vh)] md:w-[min(56rem,90vw)] md:p-10"
            : "group/member relative border-t border-hairline pt-5"
        }
      >
        <div
          className={
            expanded
              ? "grid grid-cols-1 gap-8 md:h-full md:grid-cols-12 md:items-stretch md:gap-(--grid-gap)"
              : ""
          }
        >
          <div
            className={
              expanded
                ? "relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-ink-soft md:col-span-5 md:aspect-auto md:h-full"
                : "relative aspect-[3/4] w-full overflow-hidden bg-ink-soft"
            }
          >
            {hasPortrait ? (
              <Media
                asset={member.portrait}
                ratio="auto"
                className="h-full w-full"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
              />
            ) : (
              // This block paints an ink surface, which may sit inside a light
              // section. It must declare its own surface or it inherits the
              // light-surface tokens and lands olive-on-ink at 2.6:1.
              <div className="surface-dark flex h-full flex-col justify-between p-5">
                <span data-numeric className="text-meta uppercase text-accent">
                  {String(position).padStart(2, "0")}
                </span>
                <span className="text-meta uppercase text-secondary">
                  Portrait to follow
                </span>
              </div>
            )}

            {/* "View profile" over the portrait, at rest only — the expanded
                view carries its own, more legible LinkedIn control below. */}
            {!expanded && member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="surface-dark absolute inset-0 flex items-end bg-ink/70 p-5 opacity-100 transition-opacity duration-[var(--dur-slow)] ease-out-soft motion-reduce:transition-none md:opacity-0 md:group-hover/member:opacity-100 md:focus-visible:opacity-100"
              >
                <span className="inline-flex items-center gap-2.5 text-meta uppercase text-paper">
                  View profile
                  <SocialIcon label="LinkedIn" />
                </span>
                <span className="sr-only">
                  {member.name} on LinkedIn (opens in a new tab)
                </span>
              </a>
            )}
          </div>

          <div
            className={
              expanded
                ? "flex flex-col md:col-span-7 md:justify-center"
                : "contents"
            }
          >
            {expanded && (
              <button
                type="button"
                onClick={onCollapse}
                className="group/close absolute top-6 right-6 -m-2 flex size-11 items-center justify-center text-secondary transition-colors hover:text-accent sm:top-8 sm:right-8"
              >
                <span className="sr-only">Close</span>
                <CloseIcon />
              </button>
            )}

            <span
              data-numeric
              className={
                expanded
                  ? "text-meta uppercase text-accent"
                  : "sr-only"
              }
            >
              {String(position).padStart(2, "0")}
            </span>

            <h3 className={expanded ? "mt-3 text-h2" : "mt-5 text-h3"}>
              {member.name}
            </h3>
            <p className="mt-1.5 text-meta uppercase text-accent">
              {member.role}
            </p>

            {expanded ? (
              <p className="mt-6 max-w-[52ch] text-body text-secondary text-pretty">
                {member.detail ?? member.bio}
              </p>
            ) : (
              member.bio && (
                <p className="mt-4 max-w-[38ch] text-small text-secondary">
                  {member.bio}
                </p>
              )
            )}

            {expanded && member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="mt-8 inline-flex w-fit items-center gap-2.5 border-t border-hairline pt-4 text-meta uppercase text-paper transition-colors hover:text-accent"
              >
                Connect on LinkedIn
                <SocialIcon label="LinkedIn" />
              </a>
            )}
          </div>
        </div>

        {/* The whole rest-state card is one click target. A <button> cannot
            wrap the LinkedIn <a> above (nested interactive elements), so this
            is a click handler on the article itself instead — every other
            control inside it calls stopPropagation so it never fires by
            accident when a visitor meant to follow a real link. */}
        {!expanded && (
          <button
            type="button"
            onClick={onExpand}
            aria-label={`View profile: ${member.name}, ${member.role}`}
            className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          />
        )}
      </article>
  );
}

/**
 * Expand and collapse read as two different gestures, not one played in
 * reverse — matching the site's own duration/ease vocabulary (design.md's
 * Motion tokens): `ease-out-soft` for anything entering, `ease-in-out-soft`
 * for anything leaving and returning. GSAP's `ease` string does not read a
 * CSS custom property, so these are the same curves spelled in GSAP's own
 * built-in vocabulary rather than the raw cubic-bezier values.
 */
const FLIP_MOTION = {
  expand: { duration: 0.55, ease: "power3.out" },
  collapse: { duration: 0.45, ease: "power2.inOut" },
} as const;

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const direction = useRef<keyof typeof FLIP_MOTION>("expand");
  const sorted = [...members].sort((a, b) => a.order - b.order);

  const expand = (id: string) => {
    direction.current = "expand";
    flipState.current = Flip.getState(`[data-flip-id="${id}"]`);
    setExpandedId(id);
  };

  const collapse = () => {
    if (expandedId) {
      direction.current = "collapse";
      flipState.current = Flip.getState(`[data-flip-id="${expandedId}"]`);
    }
    setExpandedId(null);
  };

  // Runs after React has committed the new DOM shape but before the browser
  // paints it — the one moment Flip needs: the element already has its new
  // size and position, and animating from the captured old state can start
  // from there without a flash of the finished layout first.
  useLayoutEffect(() => {
    if (!flipState.current) return;
    const state = flipState.current;
    flipState.current = null;

    if (prefersReducedMotion()) return;

    const { duration, ease } = FLIP_MOTION[direction.current];

    Flip.from(state, {
      duration,
      ease,
      absolute: true,
      // Enter/leave durations track the direction they belong to rather
      // than a single fixed pair — a close whose text fades out slower than
      // the card itself is shrinking is exactly the kind of mismatch that
      // reads as sloppy rather than as one continuous motion.
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0 },
          { opacity: 1, duration: duration * 0.6, ease: "power1.out" },
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, duration: duration * 0.5, ease: "power1.in" }),
    });
  }, [expandedId]);

  if (members.length === 0) return null;

  return (
    <>
      {/* One shared backdrop instead of one per card: only a single card can
          ever be expanded, and a backdrop that mounts and unmounts with the
          card vanishes in one frame while the card is still mid-flight —
          the discontinuity that made closing read as sloppy against the
          smoother, CSS-driven open. Always mounted, opacity-transitioned by
          CSS on the same `--dur-cinematic` scale the rest of the site's
          overlays (the menu, the page transition) already use, so the dim
          and the card settle together instead of one snapping ahead of the
          other. */}
      <div
        aria-hidden="true"
        onClick={collapse}
        data-open={expandedId !== null || undefined}
        className="fixed inset-0 z-90 pointer-events-none bg-ink/80 opacity-0 backdrop-blur-sm transition-opacity duration-[var(--dur-cinematic)] ease-in-out-soft data-[open=true]:pointer-events-auto data-[open=true]:opacity-100 motion-reduce:transition-none"
      />

      <Reveal
        as="div"
        stagger={0.08}
        className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {sorted.map((member, i) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            position={i + 1}
            expanded={expandedId === member.id}
            onExpand={() => expand(member.id)}
            onCollapse={collapse}
          />
        ))}
      </Reveal>
    </>
  );
}
