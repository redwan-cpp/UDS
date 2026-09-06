import { permanentRedirect } from "next/navigation";

/**
 * Portfolio was merged into /projects.
 *
 * Kept as a redirect rather than deleted: the route has been linked and
 * indexed, and a 404 is a worse answer than the page the visitor actually
 * wanted. `permanentRedirect` issues a 308, so search engines move their
 * index across instead of holding a dead URL.
 *
 * The category filter is carried through, so an existing link to a filtered
 * portfolio view still lands on that same filtered view.
 */
export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  permanentRedirect(category ? `/projects?category=${category}` : "/projects");
}
