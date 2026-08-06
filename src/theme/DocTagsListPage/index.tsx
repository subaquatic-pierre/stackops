/**
 * Swizzled DocTagsListPage — replaces Docusaurus's default tags listing
 * with a layout that matches the custom search page (RowCard-based).
 */
import React, { type ReactNode } from "react";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  translateTagsPageTitle,
} from "@docusaurus/theme-common";
import SearchMetadata from "@theme/SearchMetadata";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import { Tag } from "lucide-react";
import type { Props } from "@theme/DocTagsListPage";
import { groupTagsByFirstLetter } from "@site/src/lib/tag-utils";

function DocTagsListPageMetadata({ title }: { title: string }): ReactNode {
  return (
    <>
      <PageMetadata title={title} />
      <SearchMetadata tag="doc_tags_list" />
    </>
  );
}

function DocTagsListPageContent({
  tags,
  title,
}: Props & { title: string }): ReactNode {
  if (tags.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
          {title}
        </h1>
        <div className="py-12 text-center">
          <Tag className="mx-auto h-10 w-10 mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400">
            No tags have been added to any documents yet.
          </p>
        </div>
      </div>
    );
  }

  // Group tags by first letter for alphabetical display
  const { groups: grouped, letters } = groupTagsByFirstLetter(tags);

  return (
    <HtmlClassNameProvider className={ThemeClassNames.page.docsTagsListPage}>
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10">
          {title}
        </h1>

        <div className="space-y-12">
          {letters.map((letter) => (
            <section key={letter}>
              <h2 className="text-xl font-semibold text-slate-300 dark:text-slate-600 mb-4 tracking-wide">
                {letter}
              </h2>
              <ul className="space-y-2">
                {grouped[letter]
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((tag) => (
                    <li key={tag.permalink}>
                      <Link
                        to={tag.permalink}
                        className="group flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/5 px-4 py-3 hover:border-accent/50 hover:bg-accent/5 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <Tag className="h-4 w-4 text-accent flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                            {tag.label}
                          </span>
                          {tag.description && (
                            <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs">
                              — {tag.description}
                            </span>
                          )}
                        </span>
                        <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                          {tag.count} {tag.count === 1 ? "doc" : "docs"}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </HtmlClassNameProvider>
  );
}

export default function DocTagsListPage(props: Props): ReactNode {
  const title = translateTagsPageTitle();
  return (
    <>
      <DocTagsListPageMetadata title={title} />
      <DocTagsListPageContent {...props} title={title} />
    </>
  );
}
