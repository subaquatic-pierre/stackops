import React from "react";
import { cn } from "../../../lib/utils";

export interface CardSkeletonProps {
  count?: number;
  variant: "grid" | "row" | "featured";
}

function GridSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-black/5 dark:border-white/[0.06] bg-slate-100 dark:bg-surface-2 p-6">
      <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mb-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-1 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-1 h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-4 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="flex gap-1.5">
        <div className="h-5 w-12 rounded-md bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-16 rounded-md bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="animate-pulse flex items-start gap-4 rounded-lg border border-black/5 dark:border-white/[0.06] bg-slate-100 dark:bg-surface-2 p-4">
      <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700 sm:h-20 sm:w-20" />
      <div className="flex-1 min-w-0">
        <div className="mb-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-1 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-3 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-1">
          <div className="h-4 w-10 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-14 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-black/5 dark:border-white/[0.06] bg-slate-100 dark:bg-surface-2">
      <div className="h-48 w-full bg-slate-200 dark:bg-slate-700" />
      <div className="p-5">
        <div className="mb-2 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-1 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-4 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-1.5">
          <div className="h-5 w-12 rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-16 rounded-md bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

const skeletonMap: Record<"grid" | "row" | "featured", React.ComponentType> = {
  grid: GridSkeleton,
  row: RowSkeleton,
  featured: FeaturedSkeleton,
};

export default function CardSkeleton({
  count = 3,
  variant,
}: CardSkeletonProps) {
  const Skeleton = skeletonMap[variant];
  return (
    <div className={cn("space-y-4")}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}
