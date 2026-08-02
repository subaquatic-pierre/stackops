import React, {useState, useCallback, useEffect} from 'react';
import clsx from 'clsx';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {prefersReducedMotion} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import DocSidebarItems from '@theme/DocSidebarItems';
import {X} from 'lucide-react';
import {useSharedBodyScrollLock} from '@site/src/components/shared/bodyScrollLock';

function useMotionSafeTransition(): string {
  if (!ExecutionEnvironment.canUseDOM) {
    // SSR: no animation classes (avoids hydration mismatch)
    return '';
  }
  return prefersReducedMotion()
    ? ''
    : 'transition-transform duration-200 ease-in-out';
}

declare global {
  interface WindowEventMap {
    'stackops:open-category-drawer': CustomEvent;
    'stackops:close-category-drawer': CustomEvent;
    'stackops:close-site-nav': CustomEvent;
  }
}

export default function DocCategoryMobileDrawer({
  activePath,
}: {
  activePath: string;
}): React.ReactElement | null {
  const [open, setOpen] = useState(false);
  const docsSidebar = useDocsSidebar();
  const transitionClass = useMotionSafeTransition();

  // Lock body scroll while category drawer is open
  useSharedBodyScrollLock(open);

  const openDrawer = useCallback(() => {
    // Close the site-nav panel (right side) if open
    document.dispatchEvent(new CustomEvent('stackops:close-site-nav'));
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setOpen(false), []);

  // Listen for the custom event from the navbar logo
  useEffect(() => {
    function handleOpen() {
      openDrawer();
    }
    document.addEventListener('stackops:open-category-drawer', handleOpen);
    return () =>
      document.removeEventListener('stackops:open-category-drawer', handleOpen);
  }, [openDrawer]);

  // Listen for close event (e.g., from hamburger opening site-nav)
  useEffect(() => {
    function handleClose() {
      setOpen(false);
    }
    document.addEventListener('stackops:close-category-drawer', handleClose);
    return () =>
      document.removeEventListener('stackops:close-category-drawer', handleClose);
  }, []);

  if (!docsSidebar) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={closeDrawer}
        className={clsx(
          'fixed inset-0 z-[199] bg-black/60',
          !ExecutionEnvironment.canUseDOM || prefersReducedMotion()
            ? ''
            : 'transition-opacity duration-200 ease-in-out',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Category drawer panel — slides from left */}
      <div
        className={clsx(
          'fixed top-0 left-0 z-[200] h-screen w-[300px]',
          'bg-surface-0 border-r border-white/[0.06]',
          'flex flex-col',
          transitionClass,
          open ? 'translate-x-0' : '-translate-x-full',
        )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] bg-surface-0 shrink-0">
          <span className="text-sm font-semibold text-slate-300">
            Categories
          </span>
          <button
            type="button"
            aria-label="Close category navigation"
            onClick={closeDrawer}
            className="flex items-center justify-center h-12 w-12 -mr-2 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category tree */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <DocSidebarItems
            items={docsSidebar.items}
            activePath={activePath}
            onItemClick={(item) => {
              if (
                (item.type === 'category' && item.href) ||
                item.type === 'link'
              ) {
                closeDrawer();
              }
            }}
            level={1}
          />
        </div>
      </div>
    </>
  );
}
