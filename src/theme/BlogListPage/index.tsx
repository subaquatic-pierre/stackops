/**
 * Swizzled BlogListPage — renders featured entries (FeaturedCard) on page 1,
 * followed by categorized sections (Project Showcase, Articles, Playbooks) with RowCards.
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
import { FeaturedCard, RowCard } from "@site/src/components/shared/cards";
import FilterBar from "@site/src/components/blog/FilterBar";
import type { Props } from "@theme/BlogListPage";

// Category display order and labels
const CATEGORY_CONFIG: Record<string, { label: string; order: number }> = {
  "project-showcase": { label: "Projects", order: 1 },
  article: { label: "Articles", order: 2 },
};

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Apply filters to items (category + search)
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const fm = (item.content as { frontMatter?: Record<string, unknown> })
        .frontMatter;
      const itemCategory = (fm?.category as string) || "article";

      // Text search (title + description)
      if (query) {
        const title = ((fm?.title as string) || "").toLowerCase();
        const desc = ((fm?.description as string) || "").toLowerCase();
        if (!title.includes(query) && !desc.includes(query)) return false;
      }

      // Category filter
      if (selectedCategory !== null && itemCategory !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  const hasActiveFilters = selectedCategory !== null || searchQuery !== "";

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  // Separate featured items from regular items
  const featuredItems: Array<Props["items"][number]> = [];
  const regularItems: Array<Props["items"][number]> = [];
  for (const item of filteredItems) {
    const fm = (item.content as { frontMatter?: Record<string, unknown> })
      .frontMatter;
    if (isFirstPage && fm?.featured === true && !hasActiveFilters) {
      featuredItems.push(item);
    } else {
      regularItems.push(item);
    }
  }

  // Group regular items by category
  const byCategory: Record<string, Array<Props["items"][number]>> = {};
  const uncategorized: Array<Props["items"][number]> = [];
  for (const item of regularItems) {
    const fm = (item.content as { frontMatter?: Record<string, unknown> })
      .frontMatter;
    const category = (fm?.category as string) || "article";
    if (CATEGORY_CONFIG[category]) {
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(item);
    } else {
      uncategorized.push(item);
    }
  }
  if (uncategorized.length > 0) {
    if (!byCategory["article"]) byCategory["article"] = [];
    byCategory["article"].push(...uncategorized);
  }

  // Sort categories by config order
  const sortedCategories = Object.entries(byCategory).sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a[0]]?.order ?? 99;
    const orderB = CATEGORY_CONFIG[b[0]]?.order ?? 99;
    return orderA - orderB;
  });

  return (
    <BlogLayout>
      {/* Filter bar with search */}
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />

      {/* Category return control */}
      {selectedCategory && (
        <div className="mb-4 -mt-6">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-accent hover:text-accent-light transition-colors"
          >
            ← View all categories
          </button>
        </div>
      )}

      {/* Empty state (T007) */}
      {filteredItems.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-2">
            No entries match your filters.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Try adjusting your search or category filter.
          </p>
        </div>
      )}

      {/* Featured section — page 1 only, no filters active */}
      {isFirstPage && featuredItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Featured
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item, idx) => {
              const post = mapPostToRowCard(item);
              return (
                <FeaturedCard
                  key={idx}
                  title={post.title}
                  description={post.description}
                  tags={post.tags}
                  href={post.href}
                  image={post.image || "/img/placeholder-journal.svg"}
                  date={post.date}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Categorized sections */}
      {sortedCategories.map(([category, catItems]) => (
        <section key={category} className="mb-10">
          {/* Skip heading for default "article" category */}
          {category !== "article" && (
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {CATEGORY_CONFIG[category]?.label || category}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {catItems.map((item, idx) => {
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
      ))}

      {regularItems.length === 0 &&
        featuredItems.length === 0 &&
        filteredItems.length > 0 && (
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
