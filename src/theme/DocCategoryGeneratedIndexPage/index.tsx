/**
 * Swizzled DocCategoryGeneratedIndexPage — renders category items as a grid of GridCard components.
 */
import React, { type ReactNode } from "react";
import { PageMetadata } from "@docusaurus/theme-common";
import {
  useCurrentSidebarCategory,
  useDocById,
  filterDocCardListItems,
} from "@docusaurus/plugin-content-docs/client";
import useBaseUrl from "@docusaurus/useBaseUrl";
import DocVersionBanner from "@theme/DocVersionBanner";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import Heading from "@theme/Heading";
import { GridCard } from "@site/src/components/shared/cards";
import { FileText, Folder } from "lucide-react";
import type { Props } from "@theme/DocCategoryGeneratedIndexPage";

function DocCategoryGeneratedIndexPageMetadata({
  categoryGeneratedIndex,
}: Props): ReactNode {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

function DocCategoryGeneratedIndexPageContent({
  categoryGeneratedIndex,
}: Props): ReactNode {
  const category = useCurrentSidebarCategory();
  const filteredItems = filterDocCardListItems(category.items);

  return (
    <div className="doc-category-index">
      <DocVersionBanner />
      <DocBreadcrumbs />
      <DocVersionBadge />

      <header className="mb-8">
        <Heading
          as="h1"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3"
        >
          {categoryGeneratedIndex.title}
        </Heading>
        {categoryGeneratedIndex.description && (
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            {categoryGeneratedIndex.description}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item, idx) => (
          <CategoryCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({
  item,
}: {
  item: ReturnType<typeof filterDocCardListItems>[number];
}) {
  // Only link and category items have href/label/docId
  const isCategory = item.type === "category";
  const isLink = item.type === "link";
  const docId = (item as { docId?: string }).docId;
  const doc = docId ? useDocById(docId) : undefined;

  // HTML items (type === 'html') have no href/label — skip rendering
  if (!isCategory && !isLink) {
    return null;
  }

  const title = (item as { label?: string }).label || "/";
  const description =
    (item as { description?: string }).description || doc?.description;
  const href = (item as { href?: string }).href || "#";

  return (
    <GridCard
      title={title}
      description={description}
      href={href}
      icon={
        isCategory ? (
          <Folder className="h-5 w-5" />
        ) : (
          <FileText className="h-5 w-5" />
        )
      }
    />
  );
}

export default function DocCategoryGeneratedIndexPage(
  props: Props,
): ReactNode {
  return (
    <>
      <DocCategoryGeneratedIndexPageMetadata {...props} />
      <DocCategoryGeneratedIndexPageContent {...props} />
    </>
  );
}
