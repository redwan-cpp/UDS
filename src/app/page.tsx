import { HomeHero } from "@/components/hero/HomeHero";
import { AboutStatement } from "@/components/sections/AboutStatement";
import { Numbers } from "@/components/sections/Numbers";
import { ExpertiseIndex } from "@/components/sections/ExpertiseIndex";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { TeamSection } from "@/components/sections/TeamSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { LatestNews } from "@/components/sections/LatestNews";

import { studio } from "@/data/studio";
import { statistics } from "@/data/statistics";
import { expertise } from "@/data/expertise";
import { team } from "@/data/team";
import { brands } from "@/data/brands";
import { getFeaturedProjects } from "@/data/projects";
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
  const featuredProjects = getFeaturedProjects(4);
  const latestNews = getFeaturedNews(3);

  return (
    <>
      {/* The poster is the video's own first frame, not a separate photograph —
          otherwise the static fallback shows one scene and autoplay swaps to a
          completely different one the moment it starts. */}
      <HomeHero
        poster={heroVideo.poster}
        video={heroVideo}
        disciplines={studio.disciplines}
        tagline={studio.tagline}
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

      <Numbers statistics={statistics} />

      <ExpertiseIndex areas={expertise} />

      <FeaturedProjects projects={featuredProjects} />

      <TeamSection members={team} />

      <BrandsSection brands={brands} />

      <LatestNews items={latestNews} />
    </>
  );
}
