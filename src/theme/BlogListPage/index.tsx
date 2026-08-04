/**
 * Swizzled BlogListPage — renders featured entries on page 1,
 * followed by date-sorted regular entries.
 *
 * Featured ordering is handled at build time by `processBlogPosts`
 * in docusaurus.config.ts, so this component just splits the
 * current page's items into featured / regular.
 */
import React, { type ReactNode, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import BlogListPageStructuredData from "@theme/BlogListPage/StructuredData";
import FilterBar from "@site/src/components/blog/FilterBar";
import FeaturedSection from "@site/src/components/blog/FeaturedSection";
import RegularSection from "@site/src/components/blog/RegularSection";
import EmptyState from "@site/src/components/blog/EmptyState";
import {
  type BlogPluginPost,
  getFrontMatter,
  getMetadata,
  sortRegularByDate,
} from "@site/src/lib/blog-utils";
import type { Props } from "@theme/BlogListPage";

// ── Metadata ────────────────────────────────────────────────────────

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

// ── Content ─────────────────────────────────────────────────────────

function BlogListPageContent(props: Props): ReactNode {
  const { metadata, items } = props;
  const isFirstPage = metadata.page === 1;

  const [searchQuery, setSearchQuery] = useState("");
  const hasActiveFilters = searchQuery !== "";
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Featured posts are pre-sorted first by processBlogPosts.
  // On page 1 they appear in the featured grid; on other pages
  // they flow into the regular list.
  const { featuredItems, regularItems } = useMemo(() => {
    const featured: BlogPluginPost[] = [];
    const regular: Props["items"][number][] = [];

    const query = searchQuery.toLowerCase().trim();

    for (const item of items) {
      const fm = getFrontMatter(item);
      const meta = getMetadata(item);

      if (query) {
        const title = ((fm.title as string) || "").toLowerCase();
        const desc = ((fm.description as string) || "").toLowerCase();
        if (!title.includes(query) && !desc.includes(query)) continue;
      }

      if (isFirstPage && fm.featured === true && !hasActiveFilters) {
        featured.push({
          content: item.content,
          metadata: {
            permalink: (meta.permalink as string) || "#",
            date: new Date((meta.date || fm.date || new Date()) as string),
            frontMatter: fm,
          },
        });
      } else {
        regular.push(item);
      }
    }

    return {
      featuredItems: featured,
      regularItems: sortRegularByDate(regular),
    };
  }, [items, searchQuery, isFirstPage, hasActiveFilters]);

  // ── Render ───────────────────────────────────────────────────────

  return (
    <BlogLayout>
      <FilterBar onSearchChange={handleSearchChange} />

      {items.length === 0 && <EmptyState reason="search" />}

      <FeaturedSection posts={featuredItems} />

      <RegularSection items={regularItems} />

      {regularItems.length === 0 &&
        featuredItems.length === 0 &&
        items.length > 0 && <EmptyState reason="empty" />}

      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

// ── Export ──────────────────────────────────────────────────────────

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
