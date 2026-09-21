import { permanentRedirect } from "next/navigation";

/**
 * An individual old portfolio item. Portfolio was merged into /projects and
 * project slugs carried over unchanged, so the old item this URL pointed at
 * is at the same slug under /projects now. Sibling to `portfolio/page.tsx`,
 * same reasoning: a 404 is a worse answer than the page the visitor actually
 * wanted, and `permanentRedirect` issues a 308 so search engines move their
 * index across instead of holding a dead URL.
 */
export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/projects/${slug}`);
}
