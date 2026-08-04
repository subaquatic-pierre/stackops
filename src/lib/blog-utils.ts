/**
 * Shared utilities for working with Docusaurus blog post data.
 * Extracted from BlogListPage to keep that component thin.
 */

import type { Props } from "@theme/BlogListPage";

// ── Types ───────────────────────────────────────────────────────────

/** Shape returned by usePluginData('docusaurus-plugin-content-blog') */
export interface BlogPluginPost {
  content: unknown;
  metadata: {
    permalink: string;
    date: Date;
    frontMatter?: Record<string, unknown>;
  };
}

export interface CardPost {
  title: string;
  description?: string;
  tags?: string[];
  image?: string;
  href: string;
  date?: string;
}

// ── Frontmatter / metadata helpers ─────────────────────────────────

export function getFrontMatter(
  item: Props["items"][number],
): Record<string, unknown> {
  const fm = (item.content as { frontMatter?: Record<string, unknown> })
    .frontMatter;
  return fm ?? {};
}

export function getMetadata(
  item: Props["items"][number],
): Record<string, unknown> {
  const meta = (item.content as { metadata?: Record<string, unknown> })
    .metadata;
  return meta ?? {};
}

// ── Card mapping ────────────────────────────────────────────────────

export function mapPostToRowCard(item: Props["items"][number]): CardPost {
  const fm = getFrontMatter(item);
  const meta = getMetadata(item);

  return {
    title: (fm.title as string) || (meta.title as string) || "Untitled",
    description: (fm.description as string) || (meta.description as string),
    tags: fm.tags as string[] | undefined,
    image: fm.image as string | undefined,
    href: (meta.permalink as string) || "#",
    date: (meta.date || fm.date) as string | undefined,
  };
}

// ── Sorting ─────────────────────────────────────────────────────────

export function sortFeaturedByOrder(posts: BlogPluginPost[]): BlogPluginPost[] {
  return [...posts].sort((a, b) => {
    const fa = a.metadata.frontMatter ?? {};
    const fb = b.metadata.frontMatter ?? {};
    const orderA = fa.order as number | undefined;
    const orderB = fb.order as number | undefined;

    if (orderA != null && orderB != null) return orderA - orderB;
    if (orderA != null) return -1;
    if (orderB != null) return 1;
    return (
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    );
  });
}

export function sortRegularByDate(
  items: Props["items"][number][],
): Props["items"][number][] {
  return [...items].sort((a, b) => {
    const fa = getFrontMatter(a);
    const fb = getFrontMatter(b);
    const ma = getMetadata(a);
    const mb = getMetadata(b);
    const dateA = (ma.date || fa.date) as string | undefined;
    const dateB = (mb.date || fb.date) as string | undefined;
    if (dateA && dateB) return dateB.localeCompare(dateA);
    return 0;
  });
}

export const sortAllPosts = async ({ blogPosts }: any) => {
  // Pre-sort: featured posts first (by order field, then date),
  // then regular posts by date descending.
  const featured = blogPosts.filter(
    (p: any) => p.metadata.frontMatter?.featured === true,
  );
  const regular = blogPosts.filter(
    (p: any) => p.metadata.frontMatter?.featured !== true,
  );

  featured.sort((a: any, b: any) => {
    const oa = a.metadata.frontMatter?.order as number | undefined;
    const ob = b.metadata.frontMatter?.order as number | undefined;
    if (oa != null && ob != null) return oa - ob;
    if (oa != null) return -1;
    if (ob != null) return 1;
    return b.metadata.date.getTime() - a.metadata.date.getTime();
  });

  return [...featured, ...regular];
};
