/**
 * Swizzled BlogTagsPostsPage — renders blog posts filtered by tag using RowCard components.
 * De-emphasizes author metadata in favor of content.
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
import type { Props } from "@theme/BlogTagsPostsPage";
import { RowCard } from "@site/src/components/shared/cards";
import Unlisted from "@theme/ContentVisibility/Unlisted";
import Heading from "@theme/Heading";

function mapPostToRowCard(item: Props["items"][number]) {
  const fm = (item.content as { frontMatter?: Record<string, unknown> }).frontMatter;
  const meta = (item.content as { metadata?: Record<string, unknown> }).metadata;

  const title = (fm?.title as string) || (meta?.title as string) || "Untitled";
  const description =
    (fm?.description as string) || (meta?.description as string);
  const tags = fm?.tags as string[] | undefined;
  const image = fm?.image as string | undefined;
  const permalink = meta?.permalink as string || "#";
  const date = (meta?.date || fm?.date) as string | undefined;
  const authors = fm?.authors as
    | ({ name?: string } | string)[] | { name?: string }
    | string | undefined;

  let authorName: string | undefined;
  if (Array.isArray(authors) && authors.length > 0) {
    const first = authors[0];
    authorName = typeof first === "string" ? first : first?.name;
  } else if (typeof authors === "object" && authors !== null && "name" in authors) {
    authorName = (authors as { name?: string }).name;
  }

  return { title, description, tags, image, href: permalink, date, author: authorName };
}

function BlogTagsPostsPageMetadata({ tag }: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);
  return (
    <>
      <PageMetadata title={title} description={tag.description} />
      <SearchMetadata tag="blog_tags_posts" />
    </>
  );
}

function BlogTagsPostsPageContent({
  tag,
  items,
  sidebar,
}: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);
  return (
    <BlogLayout sidebar={sidebar}>
      {tag.unlisted && <Unlisted />}

      <header className="mb-10">
        <Heading
          as="h1"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3"
        >
          {title}
        </Heading>
        {tag.description && (
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-4">
            {tag.description}
          </p>
        )}
        <Link
          href={tag.allTagsPath}
          className="text-sm font-medium text-accent dark:text-accent-light hover:text-accent-dim dark:hover:text-accent transition-colors"
        >
          <Translate
            id="theme.tags.tagsPageLink"
            description="The label of the link targeting the tag list page"
          >
            View All Tags
          </Translate>
        </Link>
      </header>

      {/* Content-first RowCards — author de-emphasized */}
      <div className="space-y-4">
        {items.map((item, idx) => {
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
              author={post.author}
            />
          );
        })}
      </div>
    </BlogLayout>
  );
}

export default function BlogTagsPostsPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagPostListPage,
      )}
    >
      <BlogTagsPostsPageMetadata {...props} />
      <BlogTagsPostsPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
