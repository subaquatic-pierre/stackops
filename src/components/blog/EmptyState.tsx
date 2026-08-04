/**
 * Empty / no-results state for the journal listing page.
 */
import React from "react";

interface EmptyStateProps {
  /** "search" when a filter returned nothing, "empty" when no posts exist */
  reason: "search" | "empty";
}

export default function EmptyState({ reason }: EmptyStateProps) {
  if (reason === "search") {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-2">
          No entries match your search.
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Try adjusting your search terms.
        </p>
      </div>
    );
  }

  return (
    <p className="py-12 text-center text-slate-500 dark:text-slate-400">
      No journal entries yet.
    </p>
  );
}
