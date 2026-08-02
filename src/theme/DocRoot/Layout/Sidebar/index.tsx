import React, { useState, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import { prefersReducedMotion, ThemeClassNames } from '@docusaurus/theme-common';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import DocSidebarDesktop from '@theme/DocSidebar/Desktop';
import ExpandButton from '@theme/DocRoot/Layout/Sidebar/ExpandButton';
import DocCategoryMobileDrawer from '@site/src/components/shared/DocCategoryMobileDrawer';

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
  const [hiddenSidebar, setHiddenSidebar] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [hiddenSidebar, setHiddenSidebarContainer]);

  if (!docsSidebar) {
    return null;
  }

  return (
    <>
      <DocCategoryMobileDrawer activePath={pathname} />

      <aside
        className={[
          ThemeClassNames.docs.docSidebarContainer,
          'hidden lg:block',
          'flex-shrink-0',
          'transition-[width] duration-200 ease-in-out',
          'sticky top-0',
          'max-h-screen',
          'flex flex-col',
          hiddenSidebarContainer ? 'w-[var(--doc-sidebar-hidden-width)]' : 'w-[var(--doc-sidebar-width)]',
        ].join(' ')}
        onTransitionEnd={(e) => {
          if (
            e.currentTarget.classList.contains(ThemeClassNames.docs.docSidebarContainer) &&
            hiddenSidebarContainer
          ) {
            setHiddenSidebar(true);
          }
        }}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden border-r border-black/5 dark:border-white/[0.04] bg-white/80 dark:bg-surface-0/80 backdrop-blur-md rounded-xl">
          <div className="pt-2 pb-6">
            <DocSidebarDesktop
              sidebar={sidebar}
              path={pathname}
              onCollapse={toggleSidebar}
              isHidden={hiddenSidebar}
            />
            {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
          </div>
        </div>
      </aside>
    </>
  );
}
