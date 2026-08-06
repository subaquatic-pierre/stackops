/**
 * Swizzled BlogTagsPostsPage — matches the DocTagDocListPage layout:
 * clean container, back link, tag pill header, simple link list.
 */
import React, { type ReactNode } from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import { useBlogTagsPostsPageTitle } from "@docusaurus/theme-common/internal";
import Link from "@docusaurus/Link";
import BlogLayout from "@theme/BlogLayout";
import SearchMetadata from "@theme/SearchMetadata";
import Unlisted from "@theme/ContentVisibility/Unlisted";
import Heading from "@theme/Heading";
import { Tag, ArrowLeft } from "lucide-react";
import type { Props } from "@theme/BlogTagsPostsPage";

function BlogTagsPostsPageMetadata({ tag }: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);
  return (
    <>
      <PageMetadata title={title} description={tag.description} />
      <SearchMetadata tag="blog_tags_posts" />
    </>
  );
}

function BlogTagsPostsPageContent({ tag, items }: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);

  return (
    <div className="py-12">
      {tag.unlisted && <Unlisted />}

      {/* Back link */}
      <Link
        to={tag.allTagsPath}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <Translate
          id="theme.tags.tagsPageLink"
          description="The label of the link targeting the tag list page"
        >
          View all tags
        </Translate>
      </Link>

      {/* Header with tag pill */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 dark:bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
            <Tag className="h-3.5 w-3.5" />
            {tag.label}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {tag.count} {tag.count === 1 ? "entry" : "entries"}
          </span>
        </div>
        <Heading
          as="h1"
          className="!mb-0 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          {title}
        </Heading>
        {tag.description && (
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {tag.description}
          </p>
        )}
      </div>

      {/* Entry list */}
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const fm = (item.content as { frontMatter?: Record<string, unknown> }).frontMatter;
            const meta = (item.content as { metadata?: Record<string, unknown> }).metadata;
            const entryTitle = (fm?.title as string) || (meta?.title as string) || "Untitled";
            const description = (fm?.description as string) || (meta?.description as string);
            const permalink = meta?.permalink as string || "#";
            const date = (meta?.date || fm?.date) as string | undefined;

            return (
              <li key={idx}>
                <Link
                  to={permalink}
                  className="group flex items-start gap-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/5 px-5 py-4 hover:border-accent/50 hover:bg-accent/5 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                      {entryTitle}
                    </p>
                    {description && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {description}
                      </p>
                    )}
                    {date && (
                      <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                        {new Date(date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-12 text-center">
          <Tag className="mx-auto h-10 w-10 mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400">
            No entries with this tag yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default function BlogTagsPostsPage(props: Props): ReactNode {
  return (
    <BlogLayout>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogTagPostListPage,
        )}
      >
        <BlogTagsPostsPageMetadata {...props} />
        <BlogTagsPostsPageContent {...props} />
      </HtmlClassNameProvider>
    </BlogLayout>
  );
}
