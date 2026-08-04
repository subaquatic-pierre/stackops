/**
 * Swizzled BlogListPage — renders featured entries (FeaturedCard) on page 1,
 * followed by all other journal entries with RowCards.
 */
import React, { type ReactNode, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import BlogListPageStructuredData from "@theme/BlogListPage/StructuredData";
import { FeaturedCard, RowCard } from "@site/src/components/shared/cards";
import FilterBar from "@site/src/components/blog/FilterBar";
import type { Props } from "@theme/BlogListPage";

function BlogListPageMetadata(props: Props): ReactNode {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function mapPostToRowCard(item: Props["items"][number]) {
  const fm = (item.content as { frontMatter?: Record<string, unknown> })
    .frontMatter;
  const meta = (item.content as { metadata?: Record<string, unknown> })
    .metadata;

  const title = (fm?.title as string) || (meta?.title as string) || "Untitled";
  const description =
    (fm?.description as string) || (meta?.description as string);
  const tags = fm?.tags as string[] | undefined;
  const image = fm?.image as string | undefined;
  const permalink = (meta?.permalink as string) || "#";
  const date = (meta?.date || fm?.date) as string | undefined;

  return {
    title,
    description,
    tags,
    image,
    href: permalink,
    date,
  };
}

function BlogListPageContent(props: Props): ReactNode {
  const { metadata, items } = props;
  const isFirstPage = metadata.page === 1;

  // Access all blog posts from the plugin data store (not just current page)
  const pluginData = usePluginData(
    "docusaurus-plugin-content-blog",
  ) as { blogPosts?: Array<{ content: unknown; metadata: { permalink: string; date: Date; frontMatter?: Record<string, unknown> } }> } | undefined;
  const allPosts = pluginData?.blogPosts ?? [];

  const [searchQuery, setSearchQuery] = useState("");

  const hasActiveFilters = searchQuery !== "";
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Featured posts: drawn from ALL blog posts (not just current page)
  // so they always appear on page 1 regardless of date or pagination
  const featuredItems = useMemo(() => {
    if (!isFirstPage || hasActiveFilters) return [];

    const featured: Array<typeof allPosts[number]> = [];
    for (const post of allPosts) {
      const fm = post.metadata.frontMatter;
      if (fm?.featured === true) {
        featured.push(post);
      }
    }

    featured.sort((a, b) => {
      const fa = a.metadata.frontMatter;
      const fb = b.metadata.frontMatter;
      const orderA = fa?.order as number | undefined;
      const orderB = fb?.order as number | undefined;
      if (orderA != null && orderB != null) return orderA - orderB;
      if (orderA != null) return -1;
      if (orderB != null) return 1;
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
    });

    return featured;
  }, [allPosts, isFirstPage, hasActiveFilters]);

  // Build a set of featured permalinks to exclude from regular list
  const featuredPermalinks = useMemo(
    () => new Set(featuredItems.map((p) => p.metadata.permalink)),
    [featuredItems],
  );

  // Regular posts: current page items, search-filtered, minus featured
  const regularItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const regular: Array<Props["items"][number]> = [];

    for (const item of items) {
      const fm = (item.content as { frontMatter?: Record<string, unknown> })
        .frontMatter;
      const meta = (item.content as { metadata?: Record<string, unknown> })
        .metadata as { permalink?: string } | undefined;

      // Text search
      if (query) {
        const title = ((fm?.title as string) || "").toLowerCase();
        const desc = ((fm?.description as string) || "").toLowerCase();
        if (!title.includes(query) && !desc.includes(query)) continue;
      }

      // Skip if already shown as featured
      if (isFirstPage && meta?.permalink && featuredPermalinks.has(meta.permalink)) {
        continue;
      }

      regular.push(item);
    }

    regular.sort((a, b) => {
      const fa = (a.content as { frontMatter?: Record<string, unknown> }).frontMatter;
      const fb = (b.content as { frontMatter?: Record<string, unknown> }).frontMatter;
      const ma = (a.content as { metadata?: Record<string, unknown> }).metadata;
      const mb = (b.content as { metadata?: Record<string, unknown> }).metadata;
      const dateA = (ma?.date || fa?.date) as string | undefined;
      const dateB = (mb?.date || fb?.date) as string | undefined;
      if (dateA && dateB) return dateB.localeCompare(dateA);
      return 0;
    });

    return regular;
  }, [items, searchQuery, isFirstPage, featuredPermalinks]);

  return (
    <BlogLayout>
      {/* Filter bar with search */}
      <FilterBar onSearchChange={handleSearchChange} />

      {/* Empty state */}
      {items.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-2">
            No entries match your search.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Try adjusting your search terms.
          </p>
        </div>
      )}

      {/* Featured section — page 1 only, no filters active, drawn from ALL posts */}
      {isFirstPage && featuredItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Featured
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((post, idx) => {
              const fm = post.metadata.frontMatter ?? {};
              return (
                <FeaturedCard
                  key={idx}
                  title={(fm.title as string) || "Untitled"}
                  description={fm.description as string | undefined}
                  tags={fm.tags as string[] | undefined}
                  href={post.metadata.permalink}
                  image={(fm.image as string) || "/img/placeholder-journal.svg"}
                  date={(fm.date as string) || post.metadata.date.toISOString()}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Regular entries — current page items, sorted, minus featured */}
      {regularItems.length > 0 && (
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {regularItems.map((item, idx) => {
              const post = mapPostToRowCard(item);
              return (
                <RowCard
                  key={idx}
                  title={post.title}
                  description={post.description}
                  tags={post.tags}
                  href={post.href}
                  image={post.image}
                  date={post.date}
                  tagBasePath="/journal/tags/"
                />
              );
            })}
          </div>
        </section>
      )}

      {regularItems.length === 0 &&
        featuredItems.length === 0 &&
        items.length > 0 && (
          <p className="py-12 text-center text-slate-500 dark:text-slate-400">
            No journal entries yet.
          </p>
        )}

      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
