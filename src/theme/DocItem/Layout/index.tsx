import React, { type ReactNode } from "react";
import { useWindowSize } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import DocItemPaginator from "@theme/DocItem/Paginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocItemFooter from "@theme/DocItem/Footer";
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile";
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop";
import DocItemContent from "@theme/DocItem/Content";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import ContentVisibility from "@theme/ContentVisibility";

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === "desktop" || windowSize === "ssr") ? (
      <DocItemTOCDesktop />
    ) : undefined;
  return { hidden, mobile, desktop };
}

export default function DocItemLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { metadata } = useDoc();
  console.log(metadata);
  const docTOC = useDocTOC();

  return (
    <div className="flex items-start gap-8">
      {/* Main content column */}
      <div className="flex-1 min-w-0 max-w-7xl">
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

      {/* Desktop TOC — hidden below xl breakpoint */}
      {docTOC.desktop && metadata.slug !== "/" && (
        <aside className="hidden xl:block w-56 flex-shrink-0 sticky top-[68px] max-h-[calc(100vh-68px)] overflow-y-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            On this page
          </div>
          {docTOC.desktop}
        </aside>
      )}
    </div>
  );
}
