import React, { useState } from "react";
import Link from "@docusaurus/Link";
import { cn } from "../../../lib/utils";

export interface FeaturedCardProps {
  title: string;
  description?: string;
  tags?: string[];
  href: string;
  image: string;
  imageAlt?: string;
  date?: string;
  author?: string;
  className?: string;
}

function HeroImageWithFallback({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-t-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
        <svg
          className="h-8 w-8 text-slate-400 dark:text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-48 w-full rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

export default function FeaturedCard({
  title,
  description,
  tags,
  href,
  image,
  imageAlt,
  date,
  author,
  className,
}: FeaturedCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-black/5 dark:border-white/[0.06]",
        "bg-slate-100 dark:bg-surface-2",
        "transition-colors hover:border-accent/30 dark:hover:border-accent/30",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0",
        "no-underline",
        className,
      )}
    >
      {/* Hero image */}
      <HeroImageWithFallback src={image} alt={imageAlt || title} />

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/tags?tag=${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-block rounded-md border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors no-underline hover:no-underline"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Date & Author */}
        {(date || author) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {date && (
              <span className="text-slate-500 dark:text-slate-500">
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {author && (
              <span className="text-slate-400 dark:text-slate-500">
                {author}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
