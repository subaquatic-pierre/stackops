/**
 * Desktop navigation links for the main Navbar.
 */
import React from "react";
import Link from "@docusaurus/Link";
import { BookOpen, FolderGit2, Sun, Moon } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useColorMode } from "@docusaurus/theme-common";
import NavbarSearch from "@theme/Navbar/Search";
import { Button } from "@site/src/components/ui/button";
import { desktopLinkClass } from "./linkStyles";

interface DesktopNavProps {
  isDocsPage: boolean;
  isJournalPage: boolean;
}

export default function DesktopNav({ isDocsPage, isJournalPage }: DesktopNavProps) {
  const { colorMode, setColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

  return (
    <div className="hidden md:flex items-center gap-8">
      <Link to="/docs/" className={desktopLinkClass(isDocsPage)}>
        <BookOpen className="w-4 h-4" />
        <span>Technical Reference</span>
      </Link>
      <Link to="/journal" className={desktopLinkClass(isJournalPage)}>
        <FolderGit2 className="w-4 h-4" />
        <span>Journal</span>
      </Link>
      <div className="flex items-center gap-1">
        <NavbarSearch>{undefined}</NavbarSearch>
        <Link
          href="https://github.com/subaquatic-pierre/stackops"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer hover:no-underline"
        >
          <SiGithub className="w-4 h-4" />
        </Link>
        <Button
          variant="icon"
          size="icon-md"
          onClick={() => setColorMode(isDarkTheme ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {isDarkTheme ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
