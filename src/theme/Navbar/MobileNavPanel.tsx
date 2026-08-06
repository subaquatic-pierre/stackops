/**
 * Slide-in mobile navigation panel (appears from the right) plus backdrop.
 */
import React from "react";
import Link from "@docusaurus/Link";
import { BookOpen, FolderGit2, HomeIcon, X } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@site/src/components/ui/button";
import { mobileLinkClass } from "./linkStyles";
import NavbarSearch from "./Search";
import { useLocation } from "@docusaurus/router";

interface MobileNavPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDocsPage: boolean;
  isJournalPage: boolean;
}

export default function MobileNavPanel({
  isOpen,
  onClose,
  isDocsPage,
  isJournalPage,
}: MobileNavPanelProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[999] bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in panel from the right */}
      <div
        className={`fixed top-0 z-[1000] h-screen w-72 flex flex-col overflow-hidden bg-white dark:bg-surface-0 shadow-2xl border-l border-black/5 dark:border-white/[0.06] transition-[right] duration-300 ease-in-out ${
          isOpen ? "right-0" : "-right-72"
        }`}
      >
        <div className="flex items-center justify-between shrink-0 px-5 py-4 border-b border-black/5 dark:border-white/[0.06]">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Navigation
          </span>
          <Button
            variant="icon"
            size="icon-md"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-5 py-4">
          <NavbarSearch className="w-full">{undefined}</NavbarSearch>
          <Link to="/" className={mobileLinkClass(isHomePage)}>
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link to="/docs/" className={mobileLinkClass(isDocsPage)}>
            <BookOpen className="w-4 h-4" />
            <span>Technical Reference</span>
          </Link>
          <Link to="/journal" className={mobileLinkClass(isJournalPage)}>
            <FolderGit2 className="w-4 h-4" />
            <span>Journal</span>
          </Link>
          <Link
            href="https://github.com/subaquatic-pierre/stackops"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer hover:no-underline"
          >
            <SiGithub className="w-4 h-4" />
            <span>GitHub</span>
          </Link>

          <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/[0.06]">
            <span className="text-xs text-slate-400">
              Sidebar — toggle document categories via the logo
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
