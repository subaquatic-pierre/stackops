import { useEffect, useMemo } from "react";
import { usePrevious } from "@docusaurus/theme-common";
import { findFirstSidebarItemLink } from "@docusaurus/plugin-content-docs/client";
import useIsBrowser from "@docusaurus/useIsBrowser";

/**
 * Automatically expand a sidebar category when it becomes active
 * or when the active path changes within the same category.
 */
export function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  updateCollapsed,
  activePath,
}: {
  isActive: boolean;
  collapsed: boolean;
  updateCollapsed: (toCollapsed?: boolean) => void;
  activePath: string;
}) {
  const wasActive = usePrevious(isActive);
  const previousActivePath = usePrevious(activePath);
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    const stillActiveButPathChanged =
      isActive && wasActive && activePath !== previousActivePath;
    if ((justBecameActive || stillActiveButPathChanged) && collapsed) {
      updateCollapsed(false);
    }
  }, [
    isActive,
    wasActive,
    collapsed,
    updateCollapsed,
    activePath,
    previousActivePath,
  ]);
}

/**
 * Determine the href for a category, with an SSR-safe fallback
 * that renders the first child link href on the server side.
 */
export function useCategoryHrefWithSSRFallback(
  item: any,
): string | undefined {
  const isBrowser = useIsBrowser();
  return useMemo(() => {
    if (item.href && !item.linkUnlisted) {
      return item.href;
    }
    if (isBrowser || !item.collapsible) {
      return undefined;
    }
    return findFirstSidebarItemLink(item);
  }, [item, isBrowser]);
}
