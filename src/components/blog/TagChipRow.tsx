import React from "react";
import { X } from "lucide-react";
import { cn } from "@site/src/lib/utils";

interface TagChipRowProps {
  selectedTags: string[];
  onRemove: (tag: string) => void;
}

export default function TagChipRow({
  selectedTags,
  onRemove,
}: TagChipRowProps): React.ReactNode {
  if (selectedTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {selectedTags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border border-black/10 dark:border-white/10",
            "bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent",
          )}
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            className="inline-flex items-center justify-center rounded-sm p-0.5 hover:bg-accent/20 transition-colors"
            aria-label={`Remove ${tag} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
