import { HomeHero } from "@/components/hero/HomeHero";
import { AboutStatement } from "@/components/sections/AboutStatement";
import { Numbers } from "@/components/sections/Numbers";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { LatestNews } from "@/components/sections/LatestNews";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

import { studio } from "@/data/studio";

import {
  getExpertise,
  getBrands,
  getFeaturedNews,
  getStatistics,
} from "@/data/content.cms";
import { getProjects } from "@/data/projects.cms";
import { heroVideo } from "@/data/hero";
import { homeCopy, actionCopy } from "@/data/copy";

/**
 * The homepage.
 *
 * This route is the only place in the composition that reads the data layer —
 * every section below receives typed props (architecture.md §2.2). When the CMS
 * lands in Phase 2, the imports here become awaited fetches and nothing else in
 * the tree changes.
 */
export default async function HomePage() {
  // All of the major projects, not a selection of four: the homepage grid
  // is the studio's body of work, and the full index (which also carries the
  // work without a case study) is one click away.
  const featuredProjects = await getProjects();
  const latestNews = await getFeaturedNews(3);

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

      {/* One spread: what the studio is on the left, what it does on the
          right. These were two full-width bands with the figures between
          them — see AboutStatement for why they merged. */}
      <AboutStatement
        statement={studio.statement}
        approach={studio.approach}
        areas={await getExpertise()}
        copy={homeCopy.about}
        expertiseCopy={homeCopy.expertise}
        readMoreLabel={actionCopy.aboutPractice}
      />

      <FeaturedProjects
        projects={featuredProjects}
        copy={homeCopy.projects}
        allLabel={actionCopy.allProjects}
      />

      {/* Below the work, not above it: the figures are evidence for what has
          just been shown rather than a claim made before showing anything. */}
      <Numbers statistics={await getStatistics()} brands={await getBrands()} />

      {/* The management team and the collaborator index used to sit here. Both
          now live on About (/about), where they already had fuller sections —
          the homepage was showing a truncated second copy of each. See
          memory.md; this reverses the original homepage order deliberately. */}

      <LatestNews
        items={latestNews}
        copy={homeCopy.news}
        allLabel={actionCopy.allNews}
      />

      <ClosingCTA
        closing={studio.closing}
        copy={homeCopy.closing}
        actionLabel={actionCopy.startConversation}
      />
    </>
  );
}
