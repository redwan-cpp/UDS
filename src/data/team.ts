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
    detail:
      "Founded the studio on the position that a drawing is only finished once it has been tested against a full-size mock-up. Still reviews every set of construction drawings before they leave the office, and still visits every live site at least once a fortnight.",
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
    detail:
      "Trained as a furniture maker before architecture, which shows in how early the studio's projects start being built rather than only drawn. Believes a concept that has not survived being cut out of card and plywood has not really been tested yet.",
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
    detail:
      "Spends more time in workshops than in the office, which is deliberate — a detail drawn without knowing how the fabricator will actually cut and join it is a detail that gets redrawn on site. Maintains the studio's own library of tested junctions.",
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
    detail:
      "Works from the inside out where most of the studio's projects work from the outside in — a room's material and light are decided early, and the architecture is asked to accommodate them rather than the other way round. Keeps a running sample library organised by how a surface actually behaves in use, not by finish.",
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
    detail:
      "The point of contact holding a project's programme, budget and consultant team in the same view, so a decision made in one of those does not quietly cost the studio in the other two. Joined from a contractor background, which is why the studio's drawings are checked against buildability before they are checked against anything else.",
    portrait: { src: "", alt: "", width: 3, height: 4 },
    order: 5,
    isDemo: true,
  },
];
