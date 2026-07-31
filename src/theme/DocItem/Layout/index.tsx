import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import DocItemContent from '@theme/DocItem/Content';

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  return { hidden, mobile };
}

export default function DocItemLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const docTOC = useDocTOC();
  const { metadata } = useDoc();

  return (
    <div className="max-w-none">
      <ContentVisibility metadata={metadata} />
      <DocVersionBanner />
      <article>
        <DocBreadcrumbs />
        <DocVersionBadge />
        {docTOC.mobile}
        <DocItemContent>{children}</DocItemContent>
        <DocItemFooter />
      </article>
      <DocItemPaginator />
    </div>
  );
}
