/**
 * Shared utility for grouping tags by first letter for alphabetical index pages.
 */

/** A tag item with at minimum a `label` and `permalink`. */
export interface TagItem {
  label: string;
  permalink: string;
}

/** Grouped tags by first letter (uppercase). */
export type GroupedTags<T extends TagItem> = Record<string, T[]>;

/**
 * Group an array of tag items by their first letter, returning
 * the groups and the sorted keys for iteration.
 */
export function groupTagsByFirstLetter<T extends TagItem>(
  tags: T[],
): { groups: GroupedTags<T>; letters: string[] } {
  const groups: GroupedTags<T> = {};
  for (const tag of tags) {
    const letter = tag.label.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(tag);
  }
  const letters = Object.keys(groups).sort();
  return { groups, letters };
}
