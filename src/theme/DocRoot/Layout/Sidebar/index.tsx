import React, { useCallback } from "react";
import { useLocation } from "@docusaurus/router";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDocsSidebar } from "@docusaurus/plugin-content-docs/client";
import DocSidebarDesktop from "@theme/DocSidebar/Desktop";
import DocCategoryMobileDrawer from "@site/src/theme/DocRoot/Layout/DocCategoryMobileDrawer";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function DocRootLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}: {
  sidebar: any;
  hiddenSidebarContainer: boolean;
  setHiddenSidebarContainer: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement | null {
  const { pathname } = useLocation();
  const docsSidebar = useDocsSidebar();

  const toggleSidebar = useCallback(() => {
    setHiddenSidebarContainer((prev) => !prev);
  }, [setHiddenSidebarContainer]);

  if (!docsSidebar) {
    return null;
  }

  return (
    <>
      <DocCategoryMobileDrawer activePath={pathname} />

      <aside
        className={[
          "hidden lg:block",
          "flex-shrink-0",
          "transition-[width] duration-200 ease-in-out",
          "sticky top-0",
          "max-h-screen",
          "flex flex-col",
          hiddenSidebarContainer
            ? "w-[var(--doc-sidebar-hidden-width)]"
            : "w-[var(--doc-sidebar-width)]",
        ].join(" ")}
      >
        {hiddenSidebarContainer ? (
          /* Expand button when collapsed */
          <button
            type="button"
            onClick={toggleSidebar}
            className="mt-3 mx-auto rounded-md p-1.5 text-slate-400 hover:text-accent dark:text-slate-500 dark:hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        ) : (
          <>
            {/* Collapse button when expanded */}
            <div className="flex items-center justify-end px-2 pt-2">
              <button
                type="button"
                onClick={toggleSidebar}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 max-h-[89vh] overflow-y-auto overflow-x-hidden border-r border-black/5 dark:border-white/[0.04] bg-white/80 dark:bg-surface-0/80 backdrop-blur-md rounded-xl">
              <div className="pb-6">
                <DocSidebarDesktop
                  sidebar={sidebar}
                  path={pathname}
                  onCollapse={toggleSidebar}
                  isHidden={hiddenSidebarContainer}
                />
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
