import React from "react";
import {
  useDocById,
  filterDocCardListItems,
} from "@docusaurus/plugin-content-docs/client";
import { GridCard } from "@site/src/components/shared/cards";
import { FileText, Folder } from "lucide-react";

interface CategoryCardProps {
  item: ReturnType<typeof filterDocCardListItems>[number];
}

export default function CategoryCard({ item }: CategoryCardProps) {
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
