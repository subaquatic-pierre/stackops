import React from "react";
import Link from "@docusaurus/Link";
import { cn } from "../../../lib/utils";
import TagPill from "../TagPill";

export interface GridCardProps {
  title: string;
  description?: string;
  tags?: string[];
  href: string;
  icon?: React.ReactNode;
  className?: string;
  tagBasePath?: string;
}

export default function GridCard({
  title,
  description,
  tags,
  href,
  icon,
  className,
  tagBasePath = "/docs/tags/",
}: GridCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group flex flex-col rounded-xl border border-black/5 dark:border-white/[0.08]",
        "bg-slate-100 dark:bg-white/5",
        "p-6 transition-colors hover:border-accent/40 dark:hover:border-accent/30",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-0",
        "no-underline",
        className,
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 flex justify-center text-slate-500 dark:text-slate-400">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {tags.map((tag) => (
            <TagPill
              key={tag}
              label={tag}
              permalink={`${tagBasePath}${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
              stopPropagation
            />
          ))}
        </div>
      )}
    </Link>
  );
}
