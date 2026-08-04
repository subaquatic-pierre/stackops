/**
 * Featured posts section — rendered at the top of page 1 of the journal.
 * Drawn from ALL blog posts, not just the current page.
 */
import React from "react";
import { FeaturedCard } from "@site/src/components/shared/cards";
import type { BlogPluginPost } from "@site/src/lib/blog-utils";

interface FeaturedSectionProps {
  posts: BlogPluginPost[];
}

export default function FeaturedSection({ posts }: FeaturedSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Featured
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, idx) => {
          const fm = post.metadata.frontMatter ?? {};
          return (
            <FeaturedCard
              key={idx}
              title={(fm.title as string) || "Untitled"}
              description={fm.description as string | undefined}
              tags={fm.tags as string[] | undefined}
              href={post.metadata.permalink}
              image={(fm.image as string) || "/img/placeholder-journal.svg"}
              date={
                (fm.date as string) || post.metadata.date.toISOString()
              }
            />
          );
        })}
      </div>
    </section>
  );
}
