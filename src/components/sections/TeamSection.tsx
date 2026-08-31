import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/typography";
import { Reveal } from "@/components/motion/Reveal";
import { TeamGrid } from "@/components/team/TeamGrid";
import type { TeamMember } from "@/types/content";

export function TeamSection({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <Section surface="soft" spacing="standard" labelledBy="team-heading">
      <Container>
        <Reveal>
          <SectionHead
            index="05"
            eyebrow="Who does the work"
            title="Management Team"
            id="team-heading"
            aside={
              <p className="text-small text-secondary">
                A small senior team that stays on projects from first sketch
                through to handover.
              </p>
            }
          />
        </Reveal>

        <div className="pt-12 md:pt-16">
          <TeamGrid members={members} />
        </div>
      </Container>
    </Section>
  );
}
