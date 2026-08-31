/* =============================================================================
   DEMO CONTENT
   Names, roles and biographies below are PLACEHOLDERS. They describe nobody.

   Portraits: deliberately omitted. Attaching a real, identifiable person's
   photograph to an invented name and an invented role at a real studio
   misrepresents that person, regardless of the image licence. The TeamMember
   component therefore ships a designed portrait-pending state, which is also
   the honest production case for a new hire whose photograph has not been taken
   yet. Replace with the studio's own portraits and real names.
   ============================================================================= */

import type { TeamMember } from "@/types/content";

export const team: TeamMember[] = [
  {
    id: "principal",
    slug: "principal",
    name: "Principal Architect",
    role: "Founder & Principal",
    bio: "Leads design direction across the studio's architecture and interiors work, and stays on site through construction.",
    portrait: {
      src: "",
      alt: "",
      width: 3,
      height: 4,
    },
    order: 1,
    isDemo: true,
  },
  {
    id: "design-director",
    slug: "design-director",
    name: "Design Director",
    role: "Design Director",
    bio: "Runs concept development and the studio's model workshop, from first massing studies to full-size mock-ups.",
    portrait: { src: "", alt: "", width: 3, height: 4 },
    order: 2,
    isDemo: true,
  },
  {
    id: "technical-director",
    slug: "technical-director",
    name: "Technical Director",
    role: "Technical Director",
    bio: "Responsible for construction detailing, specification, and the studio's relationships with fabricators.",
    portrait: { src: "", alt: "", width: 3, height: 4 },
    order: 3,
    isDemo: true,
  },
  {
    id: "interiors-lead",
    slug: "interiors-lead",
    name: "Interiors Lead",
    role: "Associate, Interiors",
    bio: "Leads the interiors team, with a particular focus on joinery, surface and lighting.",
    portrait: { src: "", alt: "", width: 3, height: 4 },
    order: 4,
    isDemo: true,
  },
  {
    id: "projects-lead",
    slug: "projects-lead",
    name: "Projects Lead",
    role: "Associate, Delivery",
    bio: "Coordinates programme, cost and consultant teams across the studio's live projects.",
    portrait: { src: "", alt: "", width: 3, height: 4 },
    order: 5,
    isDemo: true,
  },
];
