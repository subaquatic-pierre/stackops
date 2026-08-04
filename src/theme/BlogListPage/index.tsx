/**
 * Swizzled BlogListPage — renders featured entries on page 1 (from all posts),
 * followed by date-sorted regular entries for the current page.
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
import FilterBar from "@site/src/components/blog/FilterBar";
import FeaturedSection from "@site/src/components/blog/FeaturedSection";
import RegularSection from "@site/src/components/blog/RegularSection";
import EmptyState from "@site/src/components/blog/EmptyState";
import {
  type BlogPluginPost,
  getFrontMatter,
  getMetadata,
  sortFeaturedByOrder,
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

  // All blog posts (not just current page)
  const pluginData = usePluginData("docusaurus-plugin-content-blog") as
    | { blogPosts?: BlogPluginPost[] }
    | undefined;
  const allPosts = pluginData?.blogPosts ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const hasActiveFilters = searchQuery !== "";
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // ── Featured posts (all posts, page-1 only) ──────────────────────

  const featuredItems = useMemo(() => {
    if (!isFirstPage || hasActiveFilters) return [];
    return sortFeaturedByOrder(
      allPosts.filter((p) => p.metadata.frontMatter?.featured === true),
    );
  }, [allPosts, isFirstPage, hasActiveFilters]);

  const featuredPermalinks = useMemo(
    () => new Set(featuredItems.map((p) => p.metadata.permalink)),
    [featuredItems],
  );

  // ── Regular posts (current page, search-filtered, minus featured) ─

  const regularItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const matches = items.filter((item) => {
      const fm = getFrontMatter(item);
      const meta = getMetadata(item);

      if (query) {
        const title = ((fm.title as string) || "").toLowerCase();
        const desc = ((fm.description as string) || "").toLowerCase();
        if (!title.includes(query) && !desc.includes(query)) return false;
      }

      if (
        isFirstPage &&
        meta.permalink &&
        featuredPermalinks.has(meta.permalink as string)
      ) {
        return false;
      }

      return true;
    });

    return sortRegularByDate(matches);
  }, [items, searchQuery, isFirstPage, featuredPermalinks]);

  // ── Render ───────────────────────────────────────────────────────

  return (
    <BlogLayout>
      <FilterBar onSearchChange={handleSearchChange} />

      {/* Search returned nothing */}
      {items.length === 0 && <EmptyState reason="search" />}

      {/* Featured grid (page 1 only) */}
      <FeaturedSection posts={featuredItems} />

      {/* Regular entries grid */}
      <RegularSection items={regularItems} />

      {/* Nothing to show at all */}
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
