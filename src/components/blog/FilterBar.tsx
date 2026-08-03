import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Search, X } from "lucide-react";

interface FilterBarProps {
  onSearchChange: (query: string) => void;
}

export default function FilterBar({
  onSearchChange,
}: FilterBarProps): React.ReactNode {
  const history = useHistory();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const selectedCategory: string | null = params.get("category") ?? null;

  const [searchQuery, setSearchQuery] = useState("");

  const setCategory = (category: string | null) => {
    const next = new URLSearchParams(location.search);
    if (category) {
      next.set("category", category);
    } else {
      next.delete("category");
    }
    history.replace({ search: next.toString() || undefined });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(location.search);
    next.delete("category");
    history.replace({ search: next.toString() || undefined });
    setSearchQuery("");
    onSearchChange("");
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const categories = [
    { value: null, label: "All" },
    { value: "project-showcase", label: "Projects" },
    { value: "article", label: "Articles" },
  ];

  const hasActiveFilters = selectedCategory !== null || searchQuery !== "";

  return (
    <div className="mb-10">
      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search journal entries..."
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-surface-2 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-shadow"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category tabs + clear */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                selectedCategory === cat.value
                  ? "bg-accent text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-accent hover:text-accent-light transition-colors whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
