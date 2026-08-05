import React, { useState, useCallback } from "react";
import { Search, X, Tag } from "lucide-react";
import TagFilterDropdown from "@site/src/components/blog/TagFilterDropdown";
import TagChipRow from "@site/src/components/blog/TagChipRow";

interface FilterBarProps {
  onSearchChange: (query: string) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function FilterBar({
  onSearchChange,
  availableTags,
  selectedTags,
  onTagsChange,
}: FilterBarProps): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleTagToggle = useCallback(
    (tag: string) => {
      if (selectedTags.includes(tag)) {
        onTagsChange(selectedTags.filter((t) => t !== tag));
      } else {
        onTagsChange([...selectedTags, tag]);
      }
    },
    [selectedTags, onTagsChange],
  );

  const handleTagRemove = useCallback(
    (tag: string) => {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    },
    [selectedTags, onTagsChange],
  );

  const handleCloseDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  return (
    <div className="mb-10">
      {/* Search bar + tag filter button */}
      <div className="flex gap-2 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
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

        {/* Tag filter button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-surface-2 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:border-accent/40 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40"
            aria-label="Filter by tags"
          >
            <Tag className="h-5 w-5" />
            <span className="hidden sm:inline">Tags</span>
            {selectedTags.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] rounded-full bg-accent text-[11px] font-bold text-white px-1 leading-none">
                {selectedTags.length}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <TagFilterDropdown
              availableTags={availableTags}
              selectedTags={selectedTags}
              onToggle={handleTagToggle}
              onClose={handleCloseDropdown}
            />
          )}
        </div>
      </div>

      {/* Selected tag chips */}
      <TagChipRow selectedTags={selectedTags} onRemove={handleTagRemove} />
    </div>
  );
}
