import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from '@docusaurus/theme-common';
import { isSamePath } from '@docusaurus/theme-common/internal';
import {
  isActiveSidebarItem,
  findFirstSidebarItemLink,
  useDocSidebarItemsExpandedState,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import DocSidebarItems from '@theme/DocSidebarItems';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';

function useAutoExpandActiveCategory({
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

function useCategoryHrefWithSSRFallback(item: any): string | undefined {
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

function CategoryLinkLabel({ label }: { label: string }) {
  return (
    <span title={label} className="truncate font-semibold text-sm">
      {label}
    </span>
  );
}

function DocSidebarItemCategoryEmpty({ item, ...props }: any) {
  if (typeof item.href !== 'string') {
    return null;
  }
  const {
    type,
    collapsed,
    collapsible,
    items,
    linkUnlisted,
    ...forwardableProps
  } = item;
  const linkItem = {
    type: 'link',
    ...forwardableProps,
  };
  return <DocSidebarItemLink item={linkItem} {...props} />;
}

export default function DocSidebarItemCategory(props: any) {
  const visibleChildren = useVisibleSidebarItems(
    props.item.items,
    props.activePath,
  );
  if (visibleChildren.length === 0) {
    return <DocSidebarItemCategoryEmpty {...props} />;
  }
  return <DocSidebarItemCategoryCollapsible {...props} />;
}

function DocSidebarItemCategoryCollapsible({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: any) {
  const { items, label, collapsible, className, href } = item;
  const {
    docs: {
      sidebar: { autoCollapseCategories },
    },
  } = useThemeConfig();
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);
  const isActive = isActiveSidebarItem(item, activePath);
  const isCurrentPage = isSamePath(href, activePath);

  // Categories are open by default.
  const { collapsed, setCollapsed } = useCollapsible({
    initialState: () => false,
  });

  const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState();
  const updateCollapsed = (toCollapsed = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  };

  useAutoExpandActiveCategory({
    isActive,
    collapsed,
    updateCollapsed,
    activePath,
  });

  useEffect(() => {
    if (
      collapsible &&
      expandedItem != null &&
      expandedItem !== index &&
      autoCollapseCategories
    ) {
      setCollapsed(true);
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

  const handleItemClick = (e: React.MouseEvent) => {
    onItemClick?.(item);
    if (collapsible) {
      if (href) {
        if (isCurrentPage) {
          e.preventDefault();
          updateCollapsed();
        } else {
          updateCollapsed(false);
        }
      } else {
        e.preventDefault();
        updateCollapsed();
      }
    }
  };

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        'mb-3',
        className,
      )}>
      <div
        className={clsx(
          'flex items-center justify-between pr-2',
          'menu__list-item-collapsible',
          {
            'menu__list-item-collapsible--active': isActive,
          },
        )}>
        <Link
          className={clsx(
            'flex-1 min-w-0 py-3 px-3 rounded-md',
            'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
            'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]',
            'menu__link',
            {
              'menu__link--sublist': collapsible,
              'menu__link--sublist-caret': !href && collapsible,
              'menu__link--active': isActive,
              'text-green-600 dark:text-green-400 font-medium bg-green-500/5': isActive,
            },
          )}
          onClick={handleItemClick}
          aria-current={isCurrentPage ? 'page' : undefined}
          role={collapsible && !href ? 'button' : undefined}
          aria-expanded={collapsible && !href ? !collapsed : undefined}
          href={collapsible ? hrefWithSSRFallback ?? '#' : hrefWithSSRFallback}
          {...props}>
          <CategoryLinkLabel label={label} />
        </Link>
        {href && collapsible && (
          <button
            aria-label={
              collapsed
                ? translate(
                    {
                      id: 'theme.DocSidebarItem.expandCategoryAriaLabel',
                      message: "Expand sidebar category '{label}'",
                      description: 'The ARIA label to expand the sidebar category',
                    },
                    { label },
                  )
                : translate(
                    {
                      id: 'theme.DocSidebarItem.collapseCategoryAriaLabel',
                      message: "Collapse sidebar category '{label}'",
                      description: 'The ARIA label to collapse the sidebar category',
                    },
                    { label },
                  )
            }
            aria-expanded={!collapsed}
            type="button"
            className="clean-btn menu__caret flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}
