import { HomeHero } from "@/components/hero/HomeHero";
import { AboutStatement } from "@/components/sections/AboutStatement";
import { Numbers } from "@/components/sections/Numbers";
import { ExpertiseIndex } from "@/components/sections/ExpertiseIndex";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { LatestNews } from "@/components/sections/LatestNews";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

import { studio } from "@/data/studio";
import { statistics } from "@/data/statistics";
import { expertise } from "@/data/expertise";
import { brands } from "@/data/brands";
import { getProjects } from "@/data/projects";
import { getFeaturedNews } from "@/data/news";
import { img } from "@/data/media";
import { heroVideo } from "@/data/hero";

/**
 * The homepage.
 *
 * This route is the only place in the composition that reads the data layer —
 * every section below receives typed props (architecture.md §2.2). When the CMS
 * lands in Phase 2, the imports here become awaited fetches and nothing else in
 * the tree changes.
 */
export default function HomePage() {
  // All of the major projects, not a selection of four: the homepage grid
  // is the studio's body of work, and the full index (which also carries the
  // work without a case study) is one click away.
  const featuredProjects = getProjects();
  const latestNews = getFeaturedNews(3);

  return (
    <>
      {/* The poster is the video's own first frame, not a separate photograph —
          otherwise the static fallback shows one scene and autoplay swaps to a
          completely different one the moment it starts. */}
      <HomeHero
        poster={heroVideo.poster}
        video={heroVideo}
        services={studio.services}
      />

      <AboutStatement
        statement={studio.statement}
        approach={studio.approach}
        image={img(
          "about",
          1,
          "A stone spiral staircase, viewed straight down through the full height of its cylindrical void",
        )}
      />

      <Numbers statistics={statistics} brands={brands} />

      <ExpertiseIndex areas={expertise} />

      <FeaturedProjects projects={featuredProjects} />

      {/* The management team and the collaborator index used to sit here. Both
          now live on About (/about), where they already had fuller sections —
          the homepage was showing a truncated second copy of each. See
          memory.md; this reverses the original homepage order deliberately. */}

      <LatestNews items={latestNews} />

      <ClosingCTA closing={studio.closing} />
    </>
  );
}
