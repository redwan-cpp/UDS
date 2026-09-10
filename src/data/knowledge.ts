/* =============================================================================
   Knowledge — the studio's own writing.

   Seed content only. One post so the page, the card layout and the share
   buttons have something real to render before the studio writes its first
   piece; `isDemo` is true and it is meant to be deleted, not extended.

   Written pieces are authored in the CMS from here on. This file exists for
   the same reason the other data files do: it is what `seed.ts` reads to
   rebuild a database from nothing.
   ============================================================================= */

import type { NewsItem } from "@/types/content";
import { img } from "./media";

export const knowledge: NewsItem[] = [
  {
    id: "k1",
    slug: "drawing-is-thinking",
    isDemo: true,
    title: "Drawing is thinking",
    kind: "publication",
    date: "2026-08-14",
    summary:
      "Why the studio still draws by hand before anything reaches a screen.",
    body: [
      "A drawing is not a record of a decision already made. It is where the decision happens — which is why the first sketch of a project is worth more to us than the last render.",
      "Working at full size changes what you notice. A junction that reads as a line at 1:100 becomes a question about tolerance, sequence and who fits what first. Those are the questions that decide whether a detail survives the site.",
    ],
    image: img("about", 4, "A working drawing on a studio table"),
    featured: true,
  },
];
