/* =============================================================================
   Contact form content — UI ONLY IN PHASE 1.
   Submission is stubbed at the boundary. No data is transmitted, stored or
   emailed. The server action, validation, rate limiting, bot protection and
   transactional email are Phase 3 — see architecture.md §3.5.

   This was a seven-step enquiry flow: intent, project type, location, scale,
   a description, contact details, then a review screen, with rules for which
   questions to skip. The studio replaced it with a form that fits on one
   screen and can be finished in seconds, so everything that existed to
   sequence questions is gone. What survives is the one list that was content
   rather than machinery — what an enquiry can be about.
   ============================================================================= */

import type { EnquiryTopic } from "@/types/content";

/**
 * Offered as a single native select. Ordered by how often the studio expects
 * each, so the common answer is near the top of an already-open list, and
 * "General enquiry" leads because it is the safe default for someone who does
 * not want to categorise themselves before saying hello.
 */
export const enquiryTopics: EnquiryTopic[] = [
  { value: "general", label: "General enquiry" },
  { value: "architecture", label: "Architecture — a new building, extension or change of use" },
  { value: "interior", label: "Interior — reworking a space that exists" },
  { value: "product", label: "Products — custom doors or fabricated sheet work" },
  { value: "consultation", label: "Consultation — feasibility, design review, second opinion" },
  { value: "collaboration", label: "Collaboration" },
  { value: "press", label: "Press or recruitment" },
];
