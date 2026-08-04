import React, { useState } from "react";
import Link from "@docusaurus/Link";
import { cn, tagToSlug } from "../../../lib/utils";
import TagPill from "../TagPill";

export interface RowCardProps {
  title: string;
  description?: string;
  tags?: string[];
  href: string;
  image?: string;
  imageAlt?: string;
  date?: string;
  author?: string;
  className?: string;
  tagBasePath?: string;
}

function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          className,
          "flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800",
        )}
      >
        <svg
          className="h-6 w-6 text-slate-400 dark:text-slate-500"
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
      className={cn(className, "object-cover")}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

export default function RowCard({
  title,
  description,
  tags,
  href,
  image,
  imageAlt,
  date,
  author,
  className,
  tagBasePath = "/docs/tags/",
}: RowCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-black/5 dark:border-white/[0.08]",
        "bg-slate-100 dark:bg-white/5",
        "p-4 transition-colors hover:border-accent/40 dark:hover:border-accent/30",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0",
        "no-underline",
        className,
      )}
    >
      {/* Image thumbnail */}
      {image && (
        <ImageWithFallback
          src={image}
          alt={imageAlt || title}
          className="h-16 w-16 flex-shrink-0 rounded-lg sm:h-20 sm:w-20"
        />
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Title */}
        <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <TagPill
                key={tag}
                label={tag}
                permalink={`${tagBasePath}${tagToSlug(tag)}`}
                stopPropagation
              />
            ))}
          </div>
        )}

        {/* Date & Author */}
        {(date || author) && (
          <div className="mt-2 flex items-center gap-2 text-[11px]">
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
