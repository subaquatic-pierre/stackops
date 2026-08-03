/**
 * Swizzled BlogPostPage — renders hero image banner, formatted header, and readable content body.
 */
import React, { type ReactNode, useState } from "react";
import clsx from "clsx";
import { HtmlClassNameProvider, ThemeClassNames } from "@docusaurus/theme-common";
import {
  BlogPostProvider,
  useBlogPost,
} from "@docusaurus/plugin-content-blog/client";
import BlogLayout from "@theme/BlogLayout";
import BlogPostItem from "@theme/BlogPostItem";
import BlogPostPaginator from "@theme/BlogPostPaginator";
import BlogPostPageMetadata from "@theme/BlogPostPage/Metadata";
import BlogPostPageStructuredData from "@theme/BlogPostPage/StructuredData";
import TOC from "@theme/TOC";
import ContentVisibility from "@theme/ContentVisibility";
import { Calendar, Clock, User } from "lucide-react";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/BlogPostPage";

function HeroImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return null;
  }

  return (
    <div className="mb-8 overflow-hidden rounded-xl">
      <img
        src={src}
        alt={alt}
        className="w-full max-h-[400px] object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function BlogPostPageContent({
  sidebar,
  children,
}: {
  sidebar: Props["sidebar"];
  children: ReactNode;
}): ReactNode {
  const { metadata, toc } = useBlogPost();
  const { nextItem, prevItem, frontMatter } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;

  const image = frontMatter.image as string | undefined;
  const tags = frontMatter.tags as
    | (string | { label?: string; permalink?: string })[] | undefined;
  const readingTime = Math.ceil(
    (metadata as { readingTime?: number }).readingTime || 1,
  );
  const authors = frontMatter.authors as
    | ({ name?: string } | string)[] | { name?: string } | string | undefined;
  const category = frontMatter.category as string | undefined;

  // Format date
  const dateStr = metadata.date
    ? new Date(metadata.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  // Get author name
  let authorName: string | undefined;
  if (Array.isArray(authors) && authors.length > 0) {
    const first = authors[0];
    authorName = typeof first === "string" ? first : first?.name;
  } else if (
    typeof authors === "object" &&
    authors !== null &&
    "name" in authors
  ) {
    authorName = (authors as { name?: string }).name;
  }

  // Category badge color
  const categoryBadgeColor =
    category === "project-showcase"
      ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
      : category === "playbook"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "bg-blue-500/10 text-blue-600 dark:text-blue-400";

  return (
    <BlogLayout
      sidebar={sidebar}
      toc={
        !hideTableOfContents && toc.length > 0 ? (
          <TOC
            toc={toc}
            minHeadingLevel={tocMinHeadingLevel}
            maxHeadingLevel={tocMaxHeadingLevel}
          />
        ) : undefined
      }
    >
      <ContentVisibility metadata={metadata} />

      {/* Hero image */}
      <HeroImage src={image} alt={frontMatter.title as string || ""} />

      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          {frontMatter.title as string}
        </h1>

        {frontMatter.description && (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
            {frontMatter.description as string}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          {authorName && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {authorName}
            </span>
          )}
          {dateStr && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {dateStr}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
          {category && (
            <span
              className={clsx(
                "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                categoryBadgeColor,
              )}
            >
              {category === "project-showcase"
                ? "Project Showcase"
                : category === "playbook"
                  ? "Playbook"
                  : "Article"}
            </span>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const label = typeof tag === "string" ? tag : tag.label || "";
              const slug = label.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={label}
                  to={`/docs/tags/${encodeURIComponent(slug)}`}
                  className="inline-block rounded-md border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:bg-brand/10 hover:text-brand hover:border-brand/30 transition-colors no-underline hover:no-underline"
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Article body */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <BlogPostItem>{children}</BlogPostItem>
      </div>

      {/* Paginator */}
      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}
    </BlogLayout>
  );
}

export default function BlogPostPage(props: Props): ReactNode {
  const BlogPostContent = props.content;
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogPostPage,
        )}
      >
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />
        <BlogPostPageContent sidebar={props.sidebar}>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
