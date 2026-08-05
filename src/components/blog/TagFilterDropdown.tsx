import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { useClickOutside } from "@site/src/hooks/useClickOutside";
import { cn } from "@site/src/lib/utils";

interface TagFilterDropdownProps {
  availableTags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClose: () => void;
}

export default function TagFilterDropdown({
  availableTags,
  selectedTags,
  onToggle,
  onClose,
}: TagFilterDropdownProps): React.ReactNode {
  const [tagSearch, setTagSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(dropdownRef, onClose);

  // Focus the search input when dropdown opens
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Filter tags by search query
  const filteredTags = useMemo(() => {
    const query = tagSearch.toLowerCase().trim();
    if (!query) return availableTags;
    return availableTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [availableTags, tagSearch]);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredTags.length]);

  // Keyboard navigation (references filteredTags)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Don't intercept typing in the search input
      if (
        e.target === searchInputRef.current &&
        (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape")
      ) {
        // Allow these to be handled by the container
      } else if (e.target === searchInputRef.current) {
        return; // Let the user type normally
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev >= filteredTags.length - 1 ? 0 : prev + 1,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev <= 0 ? filteredTags.length - 1 : prev - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (e.target === searchInputRef.current && filteredTags.length > 0) {
            // If focused on search input and Enter pressed, select first match
            onToggle(filteredTags[0]);
          } else if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredTags.length
          ) {
            onToggle(filteredTags[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filteredTags, highlightedIndex, onToggle, onClose],
  );

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full mt-1 z-50 w-72 max-h-[340px] flex flex-col rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-surface-2 shadow-lg"
      onKeyDown={handleKeyDown}
    >
      {/* Search input inside dropdown */}
      <div className="relative flex-shrink-0 border-b border-black/5 dark:border-white/10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          ref={searchInputRef}
          type="text"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          placeholder="Search tags..."
          className="w-full bg-transparent pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
        />
        {tagSearch && (
          <button
            type="button"
            onClick={() => setTagSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tag pill list */}
      <div className="overflow-y-auto p-2" role="listbox" aria-multiselectable="true">
        {filteredTags.length === 0 ? (
          <p className="px-2 py-4 text-sm text-slate-400 dark:text-slate-500 text-center">
            {availableTags.length === 0
              ? "No tags available"
              : "No matching tags"}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {filteredTags.map((tag, index) => {
              const isSelected = selectedTags.includes(tag);
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={tag}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onToggle(tag)}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    // Selected: filled accent style
                    isSelected
                      ? "bg-accent text-white"
                      : isHighlighted
                        ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                        : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-accent/10 hover:text-accent",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
