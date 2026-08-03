import React, { useState } from "react";
import { useDocsSidebar } from "@docusaurus/plugin-content-docs/client";
import BackToTopButton from "@theme/BackToTopButton";
import DocRootLayoutSidebar from "@theme/DocRoot/Layout/Sidebar";
import DocRootLayoutMain from "@theme/DocRoot/Layout/Main";

export default function DocRootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <BackToTopButton />
      <div className="container flex flex-1 items-start gap-8 lg:gap-12 py-2 lg:py-4">
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocRootLayoutMain>
      </div>
    </div>
  );
}
