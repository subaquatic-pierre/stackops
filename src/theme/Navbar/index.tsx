import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { BookOpen, FolderGit2, Menu, X, Sun, Moon } from "lucide-react";
import { useColorMode } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar, useLockBodyScroll } from "@docusaurus/theme-common/internal";
import Logo from "@theme/Logo";
import SearchBar from "@theme/SearchBar";
import NavbarSearch from "@theme/Navbar/Search";
import { Button } from "../../components/ui/button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { colorMode, setColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const mobileSidebar = useNavbarMobileSidebar();
  const isDocsPage = location.pathname.startsWith("/docs");

  // Lock body scroll when non-docs mobile menu is open
  useLockBodyScroll(!isDocsPage && isMobileMenuOpen);

  // Close mobile menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobile = () => {
    if (isDocsPage) {
      mobileSidebar.toggle();
    } else {
      setIsMobileMenuOpen((open) => !open);
    }
  };

  const isMobileMenuActive = isMobileMenuOpen || mobileSidebar.shown;

  return (
    <nav className="navbar sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-surface-0/70 border-b border-black/5 dark:border-white/[0.04]">
      <div className="container flex items-center justify-between">
        <Logo />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/docs/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline"
          >
            <BookOpen className="w-4 h-4" />
            <span>Technical Reference</span>
          </Link>
          <Link
            to="/engineering"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Journal</span>
          </Link>
          <NavbarSearch>
            <SearchBar />
          </NavbarSearch>
          <div className="flex items-center gap-1">
            <Link
              href="https://github.com/subaquatic-pierre"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer hover:no-underline"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </Link>
            <Button
              variant="icon"
              size="icon-md"
              onClick={() => setColorMode(isDarkTheme ? "light" : "dark")}
              aria-label="Toggle dark mode"
            >
              {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="icon"
            size="icon-md"
            onClick={() => setColorMode(isDarkTheme ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <NavbarSearch>
            <SearchBar />
          </NavbarSearch>
          <Button
            variant="ghost"
            size="icon-md"
            onClick={toggleMobile}
            aria-label="Toggle navigation"
            className="-mr-2"
          >
            {isMobileMenuActive ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Slide-in (non-docs pages only) */}
      {!isDocsPage && (
        <>
          {/* Backdrop */}
          <div
            className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <div
            className={`md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-surface-1 shadow-2xl border-l border-black/5 dark:border-white/[0.06] transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/[0.06]">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Navigation</span>
              <Button
                variant="icon"
                size="icon-md"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <Link
                to="/docs/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer hover:no-underline"
              >
                <BookOpen className="w-4 h-4" />
                <span>Technical Reference</span>
              </Link>
              <Link
                to="/engineering"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer hover:no-underline"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Journal</span>
              </Link>
              <Link
                href="https://github.com/subaquatic-pierre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer hover:no-underline"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
