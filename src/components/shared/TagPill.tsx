import React from "react";
import Link from "@docusaurus/Link";

interface TagPillProps {
  label: string;
  permalink: string;
  /** If true, stops click propagation (for tags inside clickable cards) */
  stopPropagation?: boolean;
}

/**
 * Unified tag pill — used across blog detail, card components,
 * and anywhere tags are rendered on the site.
 * Matches the blog detail page style:
 * rounded-md, subtle border, accent hover.
 */
export default function TagPill({
  label,
  permalink,
  stopPropagation = false,
}: TagPillProps): React.ReactNode {
  return (
    <Link
      to={permalink}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      className="inline-flex items-center rounded-md border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors no-underline hover:no-underline"
    >
      {label}
    </Link>
  );
}
