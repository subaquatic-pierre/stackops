/**
 * Swizzled BlogListPage — renders featured entries on page 1,
 * followed by date-sorted regular entries.
 *
 * Featured ordering is handled at build time by `processBlogPosts`
 * in docusaurus.config.ts, so this component just splits the
 * current page's items into featured / regular.
 *
 * Search now queries the full blog post catalog (all pages)
 * instead of being limited to the current paginated page.
 */
import React, {
  type ReactNode,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
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
import type { BlogPostSearchItem } from "@site/src/plugins/blogSearchCatalog";
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

  // Load the full blog post catalog (all pages) for search.
  // The plugin writes this JSON to /static/blog-search-catalog.json at build time.
  const [allPosts, setAllPosts] = useState<BlogPostSearchItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/blog-search-catalog.json")
      .then((res) => {
        if (!res.ok) throw new Error("Catalog not available");
        return res.json();
      })
      .then((data: { posts: BlogPostSearchItem[] }) => {
        if (!cancelled) setAllPosts(data.posts ?? []);
      })
      .catch(() => {
        // Catalog unavailable — fallback to current-page search
        if (!cancelled) setAllPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const hasActiveFilters = searchQuery !== "";
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Split items into featured / regular based on search state.
  // - When NOT searching: use paginated items (current page only).
  // - When searching: filter the FULL catalog across all pages.
  const { featuredItems, regularItems, resultCount } = useMemo(() => {
    const featured: BlogPluginPost[] = [];
    const regular: Props["items"][number][] = [];

    const query = searchQuery.toLowerCase().trim();

    if (query && allPosts.length > 0) {
      // ── Full catalog search (all pages) ──────────────────────────
      const filtered = allPosts.filter((post) => {
        const title = post.title.toLowerCase();
        const desc = post.description.toLowerCase();
        return title.includes(query) || desc.includes(query);
      });

      // Convert catalog items to the shape expected by RegularSection
      for (const post of filtered) {
        const syntheticItem = {
          content: {
            frontMatter: {
              title: post.title,
              description: post.description,
              tags: post.tags,
              image: post.image,
              date: post.date,
              featured: post.featured,
            },
            metadata: {
              permalink: post.permalink,
              title: post.title,
              date: post.date,
            },
          },
        } as unknown as Props["items"][number];

        regular.push(syntheticItem);
      }

      return {
        featuredItems: [],
        regularItems: sortRegularByDate(regular),
        resultCount: filtered.length,
      };
    }

    // ── Paginated (current page only) ──────────────────────────────
    // Also serves as fallback when catalog is unavailable
    for (const item of items) {
      const fm = getFrontMatter(item);
      const meta = getMetadata(item);

      // Fallback search when catalog isn't available
      if (query && allPosts.length === 0) {
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
      resultCount: undefined,
    };
  }, [items, searchQuery, isFirstPage, hasActiveFilters, allPosts]);

  const isEmpty =
    regularItems.length === 0 && featuredItems.length === 0;
  const showPaginator = !hasActiveFilters && items.length > 0;

  // ── Render ───────────────────────────────────────────────────────

  return (
    <BlogLayout>
      <FilterBar onSearchChange={handleSearchChange} />

      {/* Search result count (only when results found) */}
      {hasActiveFilters && resultCount != null && resultCount > 0 && (
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          {resultCount} {resultCount === 1 ? "entry" : "entries"} match{" "}
          {"\u201C"}{searchQuery}{"\u201D"}
        </p>
      )}

      <FeaturedSection posts={featuredItems} />

      <RegularSection items={regularItems} />

      {/* Empty state when search returns no results */}
      {hasActiveFilters && isEmpty && items.length > 0 && (
        <EmptyState reason="search" />
      )}

      {/* Empty state when page has no posts (non-search) */}
      {!hasActiveFilters && isEmpty && (
        <EmptyState reason="empty" />
      )}

      {showPaginator && <BlogListPaginator metadata={metadata} />}
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
