import React, { type ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import BlogSidebar from "@theme/BlogSidebar";
import type { Props } from "@theme/BlogLayout";

/**
 * Swizzled BlogLayout — uses a centered max-w-4xl container for the
 * no-sidebar case instead of Infima's left-biased col--offset-1 grid.
 */
export default function BlogLayout(props: Props): ReactNode {
  const { sidebar, toc, children, ...layoutProps } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        {hasSidebar ? (
          <div className="row">
            <BlogSidebar sidebar={sidebar} />
            <main
              className={clsx("col", {
                "col--7": hasSidebar,
              })}
            >
              {children}
            </main>
            {toc && <div className="col col--2">{toc}</div>}
          </div>
        ) : (
          <main className="max-w-7xl mx-auto px-4">{children}</main>
        )}
      </div>
    </Layout>
  );
}
