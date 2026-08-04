/**
 * Swizzled BlogPostPage — renders hero image banner, formatted header, and readable content body.
 */
import React, { type ReactNode, useState } from "react";
import clsx from "clsx";
import {
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import {
  BlogPostProvider,
  useBlogPost,
} from "@docusaurus/plugin-content-blog/client";
import BlogLayout from "@theme/BlogLayout";
import BlogPostItem from "@theme/BlogPostItem";
import BlogPostPaginator from "@theme/BlogPostPaginator";
import BlogPostPageMetadata from "@theme/BlogPostPage/Metadata";
import BlogPostPageStructuredData from "@theme/BlogPostPage/StructuredData";
import ContentVisibility from "@theme/ContentVisibility";
import { BookOpen, Calendar, Clock, Globe } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import TagPill from "@site/src/components/shared/TagPill";
import BackLink from "@site/src/components/blog/BackLink";
import type { Props } from "@theme/BlogPostPage";
import "@site/src/css/blog.scss";

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

function BlogPostPageContent({ children }: { children: ReactNode }): ReactNode {
  const { metadata } = useBlogPost();
  const { nextItem, prevItem, frontMatter } = metadata;

  const image = frontMatter.image as string | undefined;
  const repo = frontMatter.repo as string | undefined;
  const website = frontMatter.website as string | undefined;
  const docs = frontMatter.docs as string | undefined;
  const tags = frontMatter.tags as
    | (string | { label?: string; permalink?: string })[]
    | undefined;
  const readingTime = Math.ceil(
    (metadata as { readingTime?: number }).readingTime || 1,
  );

  // Format date
  const dateStr = metadata.date
    ? new Date(metadata.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <BlogLayout>
      <ContentVisibility metadata={metadata} />

      {/* Back link (T017 - US3) */}
      <BackLink />

      {/* Hero image */}
      <HeroImage src={image} alt={(frontMatter.title as string) || ""} />

      {/* Article header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          {frontMatter.title as string}
        </h1>

        {repo && (
          <div>
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors no-underline"
            >
              <SiGithub className="h-3.5 w-3.5" />
              {repo.replace("https://github.com/", "")}
            </a>
          </div>
        )}

        {website && (
          <div>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors no-underline"
            >
              <Globe className="h-3.5 w-3.5" />
              {website.replace("https://", "").replace("www.", "")}
            </a>
          </div>
        )}

        {docs && (
          <div>
            <a
              href={docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors no-underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {docs.replace("https://", "").replace("www.", "")}
            </a>
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          {dateStr && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {dateStr}
            </span>
          )}
          {/* <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span> */}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const label = typeof tag === "string" ? tag : tag.label || "";
              const permalink =
                (typeof tag === "object" && "permalink" in tag
                  ? (tag as { permalink?: string }).permalink
                  : `/journal/tags/${encodeURIComponent(label.toLowerCase().replace(/\s+/g, "-"))}`) ||
                "#";
              return (
                <TagPill key={label} label={label} permalink={permalink} />
              );
            })}
          </div>
        )}
      </header>

      {/* Article body */}
      <div className="blog-post-content max-w-none">
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
        <BlogPostPageContent>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
