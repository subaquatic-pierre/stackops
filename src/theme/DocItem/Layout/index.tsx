import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import DocItemContent from '@theme/DocItem/Content';

export default function DocItemLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { metadata } = useDoc();

  return (
    <div className="max-w-none">
      <ContentVisibility metadata={metadata} />
      <DocVersionBanner />
      <article>
        <DocBreadcrumbs />
        <DocVersionBadge />
        <DocItemContent>{children}</DocItemContent>
        <DocItemFooter />
      </article>
      <DocItemPaginator />
    </div>
  );
}
