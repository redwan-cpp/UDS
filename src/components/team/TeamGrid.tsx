import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { SocialIcon } from "@/components/contact/SocialIcon";
import type { TeamMember } from "@/types/content";

/**
 * A team member.
 *
 * Handles the portrait-pending state as a designed condition rather than a
 * broken one: a ruled ink field carrying the member's index and role, in the
 * same proportion the photograph will occupy. This is the honest state for demo
 * content (attaching a real person's face to an invented name and role would
 * misrepresent that person) and it is also the real production state for
 * someone whose portrait has not been taken yet.
 */
function TeamMemberCard({ member, position }: { member: TeamMember; position: number }) {
  const hasPortrait = Boolean(member.portrait.src);

  return (
    <article className="group/member border-t border-hairline pt-5">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink-soft">
        {hasPortrait ? (
          <Media
            asset={member.portrait}
            ratio="tall"
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

        {/* "View profile" over the portrait. Rendered only when a real profile
            URL exists — see TeamMember.linkedin. It is a real link, not a
            hover-only affordance: it stays reachable by keyboard, and on a
            coarse pointer (no hover to trigger) it is simply always visible. */}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
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

      <h3 className="mt-5 text-h3">{member.name}</h3>
      <p className="mt-1.5 text-meta uppercase text-accent">{member.role}</p>
      {member.bio && (
        <p className="mt-4 max-w-[38ch] text-small text-secondary">{member.bio}</p>
      )}
    </article>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <Reveal
      as="div"
      stagger={0.08}
      className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
    >
      {[...members]
        .sort((a, b) => a.order - b.order)
        .map((member, i) => (
          <TeamMemberCard key={member.id} member={member} position={i + 1} />
        ))}
    </Reveal>
  );
}
