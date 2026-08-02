import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';

function LinkLabel({ label }: { label: string }) {
  return (
    <span title={label} className="truncate text-[13px]">
      {label}
    </span>
  );
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: any) {
  const { href, label, className, autoAddBaseUrl } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        'py-0.5',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'flex items-center gap-1.5 py-2.5 px-3 rounded-md',
          'transition-colors',
          'menu__link',
          {
            'menu__link--active': isActive,
            'text-accent font-medium bg-accent/8': isActive,
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white': !isActive,
            'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]': !isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        <LinkLabel label={label} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
