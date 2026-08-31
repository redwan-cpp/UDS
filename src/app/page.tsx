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
      <HomeHero
        poster={img(
          "hero",
          0,
          "Concrete building facade in raking afternoon light",
          { focal: { x: 0.5, y: 0.45 } },
        )}
        video={heroVideo}
        disciplines={studio.disciplines}
        tagline={studio.tagline}
      />

      <AboutStatement
        statement={studio.statement}
        approach={studio.approach}
        image={img("about", 1, "Cast concrete stair rising through a top-lit void")}
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
