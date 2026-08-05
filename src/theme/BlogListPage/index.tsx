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
 * Tag filtering is supported alongside text search with AND logic.
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
import { useLocation, useHistory } from "@docusaurus/router";
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

// ── Helpers ─────────────────────────────────────────────────────────

/** Parse comma-separated tags from URL query string */
function parseTagsFromURL(search: string): string[] {
  const params = new URLSearchParams(search);
  const raw = params.get("tags");
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => decodeURIComponent(t.trim()))
    .filter(Boolean);
}

/** Build the `?tags=` query string for URL persistence */
function buildTagsParam(tags: string[]): string {
  if (tags.length === 0) return "";
  return `tags=${tags.map((t) => encodeURIComponent(t)).join(",")}`;
}

/** Check if every selected tag is present in the post's tags */
function postHasAllTags(post: BlogPostSearchItem, selectedTags: string[]): boolean {
  return selectedTags.every((tag) => post.tags.includes(tag));
}

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
  const [catalogError, setCatalogError] = useState(false);

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
        if (!cancelled) {
          setAllPosts([]);
          setCatalogError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Tag state & URL sync ─────────────────────────────────────────

  const location = useLocation();
  const history = useHistory();

  const [selectedTags, setSelectedTags] = useState<string[]>(() =>
    parseTagsFromURL(location.search),
  );

  // Sync URL when selectedTags changes
  useEffect(() => {
    const tagsParam = buildTagsParam(selectedTags);
    const currentParams = new URLSearchParams(location.search);

    if (tagsParam) {
      currentParams.set("tags", selectedTags.map((t) => encodeURIComponent(t)).join(","));
    } else {
      currentParams.delete("tags");
    }

    const newSearch = currentParams.toString();
    const newUrl = location.pathname + (newSearch ? `?${newSearch}` : "");
    history.replace(newUrl);
  }, [selectedTags, location.pathname, location.search, history]);

  // Compute unique available tags from all posts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of allPosts) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [allPosts]);

  const [searchQuery, setSearchQuery] = useState("");
  const hasActiveSearch = searchQuery !== "";
  const hasActiveTags = selectedTags.length > 0;
  const hasActiveFilters = hasActiveSearch || hasActiveTags;

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, []);

  // ── Filtering logic ──────────────────────────────────────────────

  /**
   * Applies the combined text + tag filter to a list of catalog items.
   * Returns only posts that match BOTH the text query AND all selected tags.
   */
  const applyCombinedFilter = (
    posts: BlogPostSearchItem[],
    query: string,
    tags: string[],
  ): BlogPostSearchItem[] => {
    return posts.filter((post) => {
      // Text match
      if (query) {
        const title = post.title.toLowerCase();
        const desc = post.description.toLowerCase();
        if (!title.includes(query) && !desc.includes(query)) return false;
      }
      // Tag match (AND logic)
      if (tags.length > 0) {
        return postHasAllTags(post, tags);
      }
      return true;
    });
  };

  // Split items into featured / regular based on filter state.
  // - When NOT filtering: use paginated items (current page only).
  // - When filtering: filter the FULL catalog across all pages.
  const { featuredItems, regularItems, resultCount } = useMemo(() => {
    const featured: BlogPluginPost[] = [];
    const regular: Props["items"][number][] = [];

    const query = searchQuery.toLowerCase().trim();

    const shouldUseCatalog = (hasActiveSearch || hasActiveTags) && allPosts.length > 0;

    if (shouldUseCatalog) {
      // ── Full catalog filtering (all pages) ────────────────────────
      const filtered = applyCombinedFilter(allPosts, query, selectedTags);

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

      // Fallback filter when catalog isn't available
      if ((hasActiveSearch || hasActiveTags) && allPosts.length === 0) {
        // Text filter
        if (hasActiveSearch) {
          const title = ((fm.title as string) || "").toLowerCase();
          const desc = ((fm.description as string) || "").toLowerCase();
          if (!title.includes(query) && !desc.includes(query)) continue;
        }
        // Tag filter (fallback)
        if (hasActiveTags) {
          const postTags: string[] = Array.isArray(fm.tags) ? fm.tags as string[] : [];
          if (!selectedTags.every((tag) => postTags.includes(tag))) continue;
        }
      }

      // Featured posts are hidden when any filter is active
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
  }, [items, searchQuery, selectedTags, isFirstPage, hasActiveSearch, hasActiveTags, hasActiveFilters, allPosts]);

  const isEmpty = regularItems.length === 0 && featuredItems.length === 0;
  const showPaginator = !hasActiveFilters && items.length > 0;

  // ── Result message ────────────────────────────────────────────────

  const renderResultMessage = () => {
    if (!hasActiveFilters || resultCount == null || resultCount === 0) return null;

    const plural = resultCount === 1 ? "entry" : "entries";

    if (hasActiveSearch && hasActiveTags) {
      const tagList = selectedTags.join(", ");
      return (
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          {resultCount} {plural} match{" "}
          {"\u201C"}
          {searchQuery}
          {"\u201D"} filtered by {tagList}
        </p>
      );
    }

    if (hasActiveTags) {
      const tagList = selectedTags.join(", ");
      return (
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          {resultCount} {plural} with {tagList}
        </p>
      );
    }

    return (
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        {resultCount} {resultCount === 1 ? "entry" : "entries"} match{" "}
        {"\u201C"}
        {searchQuery}
        {"\u201D"}
      </p>
    );
  };

  // ── Empty state reason ────────────────────────────────────────────

  const getEmptyReason = (): "search" | "empty" => {
    if (hasActiveFilters) return "search";
    return "empty";
  };

  // ── Render ───────────────────────────────────────────────────────

  return (
    <BlogLayout>
      <FilterBar
        onSearchChange={handleSearchChange}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagsChange={handleTagsChange}
      />

      {/* Result count message */}
      {renderResultMessage()}

      {/* Filter summary when tags are active (shown above post list) */}
      {hasActiveTags && resultCount != null && resultCount > 0 && (
        <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
          Filtered by:{" "}
          {selectedTags.map((tag, i) => (
            <span key={tag}>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {tag}
              </span>
              {i < selectedTags.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}

      <FeaturedSection posts={featuredItems} />

      <RegularSection items={regularItems} />

      {/* Empty state when filters return no results */}
      {hasActiveFilters && isEmpty && items.length > 0 && (
        <EmptyState reason="search" />
      )}

      {/* Empty state when page has no posts (non-filter) */}
      {!hasActiveFilters && isEmpty && <EmptyState reason="empty" />}

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
