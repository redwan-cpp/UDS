import Link from "next/link";

import { Media } from "@/components/ui/Media";
import { Arrow } from "@/components/ui/Button";
import { formatDate } from "@/lib/labels";
import { newsKindLabels } from "@/data/news";
import type { NewsItem } from "@/types/content";

/**
 * A news or collaboration entry.
 *
 * Hairline-and-interval, not a filled card: a top rule, the image, then the
 * metadata and title on the grid. One link wraps the whole entry so there is a
 * single tab stop per destination.
 */
export function NewsCard({ item, priority = false }: { item: NewsItem; priority?: boolean }) {
  return (
    <article className="border-t border-hairline pt-5">
      <Link href={`/news/${item.slug}`} className="group block">
        <Media
          asset={item.image}
          ratio="landscape"
          hoverScale
          priority={priority}
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
        />

        {/* The category is set as a bordered tag rather than as another line
            of accent text: on a card that already carries a date, a title and
            a summary, it was reading as a fourth run of prose instead of as
            the classification it is. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center border border-accent/50 px-2.5 py-1 text-meta uppercase text-accent transition-colors duration-[var(--dur-base)] group-hover:border-accent">
            {newsKindLabels[item.kind]}
          </span>
          <time
            dateTime={item.date}
            className="text-meta uppercase text-secondary"
            data-numeric
          >
            {formatDate(item.date)}
          </time>
        </div>

        <h3 className="mt-3 text-h3 text-balance transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1.5 motion-reduce:transform-none motion-reduce:transition-none">
          {item.title}
        </h3>

        <p className="mt-3 max-w-[46ch] text-small text-secondary">{item.summary}</p>

        {item.organisation && (
          <p className="mt-4 text-meta uppercase text-secondary">
            {item.organisation}
          </p>
        )}

        <span className="mt-5 inline-flex items-center gap-2.5 text-meta uppercase text-accent">
          Read
          <Arrow className="transition-transform duration-[var(--dur-base)] ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </Link>
    </article>
  );
}
