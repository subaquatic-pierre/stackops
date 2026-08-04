/**
 * Regular journal entries section — current page items, date-sorted.
 */
import React from "react";
import type { Props } from "@theme/BlogListPage";
import { RowCard } from "@site/src/components/shared/cards";
import { mapPostToRowCard } from "@site/src/lib/blog-utils";

interface RegularSectionProps {
  items: Props["items"][number][];
}

export default function RegularSection({ items }: RegularSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              tagBasePath="/journal/tags/"
            />
          );
        })}
      </div>
    </section>
  );
}
