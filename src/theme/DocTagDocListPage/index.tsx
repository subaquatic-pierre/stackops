/**
 * Swizzled DocTagDocListPage — replaces Docusaurus's default per-tag doc list
 * with a layout that matches the custom search page (RowCard-based).
 */
import React, { type ReactNode } from "react";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  usePluralForm,
} from "@docusaurus/theme-common";
import Translate, { translate } from "@docusaurus/Translate";
import SearchMetadata from "@theme/SearchMetadata";
import Unlisted from "@theme/ContentVisibility/Unlisted";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import { Tag, FileText, ArrowLeft } from "lucide-react";
import type { Props } from "@theme/DocTagDocListPage";

function useNDocsTaggedPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: "theme.docs.tagDocListPageTitle.nDocsTagged",
          description:
            'Pluralized label for "{count} docs tagged". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "One doc tagged|{count} docs tagged",
        },
        { count },
      ),
    );
}

function usePageTitle(props: Props): string {
  const nDocsTaggedPlural = useNDocsTaggedPlural();
  return translate(
    {
      id: "theme.docs.tagDocListPageTitle",
      description: "The title of the page for a docs tag",
      message: '{nDocsTagged} with "{tagName}"',
    },
    {
      nDocsTagged: nDocsTaggedPlural(props.tag.count),
      tagName: props.tag.label,
    },
  );
}

function DocTagDocListPageMetadata({
  title,
  tag,
}: Props & { title: string }): ReactNode {
  return (
    <>
      <PageMetadata title={title} description={tag.description} />
      <SearchMetadata tag="doc_tag_doc_list" />
    </>
  );
}

function DocTagDocListPageContent({
  tag,
  title,
}: Props & { title: string }): ReactNode {
  return (
    <HtmlClassNameProvider
      className={ThemeClassNames.page.docsTagDocListPage}
    >
      <div className="container max-w-4xl mx-auto px-6 py-12">
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

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 dark:bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
              <Tag className="h-3.5 w-3.5" />
              {tag.label}
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-500">
              {tag.count} {tag.count === 1 ? "doc" : "docs"}
            </span>
          </div>
          <Heading as="h1" className="!mb-0 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </Heading>
          {tag.description && (
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {tag.description}
            </p>
          )}
        </div>

        {/* Doc list */}
        {tag.items.length > 0 ? (
          <ul className="space-y-3">
            {tag.items.map((doc) => (
              <li key={doc.id}>
                <Link
                  to={doc.permalink}
                  className="group flex items-start gap-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-white/5 px-5 py-4 hover:border-accent/50 hover:bg-accent/5 transition-colors"
                >
                  <FileText className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                      {doc.title}
                    </p>
                    {doc.description && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-10 w-10 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400">
              No documents with this tag yet.
            </p>
          </div>
        )}
      </div>
    </HtmlClassNameProvider>
  );
}

export default function DocTagDocListPage(props: Props): ReactNode {
  const title = usePageTitle(props);
  return (
    <>
      <DocTagDocListPageMetadata {...props} title={title} />
      <DocTagDocListPageContent {...props} title={title} />
    </>
  );
}
