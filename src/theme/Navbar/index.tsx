import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { BookOpen, FolderGit2, Menu, X, Sun, Moon } from "lucide-react";
import { useColorMode } from "@docusaurus/theme-common";
import Logo from "@theme/Logo";
import ThemedImage from "@theme/ThemedImage";
import NavbarSearch from "@theme/Navbar/Search";
import { Button } from "../../components/ui/button";
import { useSharedBodyScrollLock } from "@site/src/hooks/bodyScrollLock";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { colorMode, setColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const isDocsPage = location.pathname.startsWith("/docs");
  const isEngineeringPage = location.pathname.startsWith("/engineering");

  const linkClass = (active: boolean) =>
    `flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer hover:no-underline ${
      active
        ? "text-accent"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:no-underline ${
      active
        ? "text-accent bg-accent/8"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
    }`;

  // Lock body scroll when mobile site-nav is open
  useSharedBodyScrollLock(isMobileMenuOpen);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close the category drawer whenever the site-nav panel opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.dispatchEvent(new CustomEvent("stackops:close-category-drawer"));
    }
  }, [isMobileMenuOpen]);

  // Close site-nav when category drawer opens
  useEffect(() => {
    function handleClose() {
      setIsMobileMenuOpen(false);
    }
    document.addEventListener("stackops:close-site-nav", handleClose);
    return () =>
      document.removeEventListener("stackops:close-site-nav", handleClose);
  }, []);

  const toggleMobile = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  const handleCategoryDrawerOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    // Only open drawer on mobile viewports
    if (typeof window !== "undefined" && window.innerWidth >= 996) {
      window.location.href = "/";
      return;
    }
    document.dispatchEvent(new CustomEvent("stackops:open-category-drawer"));
  };

  return (
    <>
      <nav className="navbar sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-surface-0/70 border-b border-black/5 dark:border-white/[0.04]">
        <div className="container max-w-xl flex items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center">
            {isDocsPage ? (
              <button
                onClick={handleCategoryDrawerOpen}
                className="flex items-center gap-2.5 cursor-pointer hover:no-underline group bg-transparent border-0 p-0"
                aria-label="Open document categories"
              >
                <ThemedImage
                  alt="StackOps Logo"
                  sources={{
                    light: "/img/logo-light-theme.svg",
                    dark: "/img/logo-dark-theme.svg",
                  }}
                  width="200"
                  height="32"
                />
              </button>
            ) : (
              <Logo />
            )}
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/docs/" className={linkClass(isDocsPage)}>
              <BookOpen className="w-4 h-4" />
              <span>Technical Reference</span>
            </Link>
            <Link to="/engineering" className={linkClass(isEngineeringPage)}>
              <FolderGit2 className="w-4 h-4" />
              <span>Journal</span>
            </Link>
            <NavbarSearch>{undefined}</NavbarSearch>
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
                {isDarkTheme ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
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
              {isDarkTheme ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <NavbarSearch>{undefined}</NavbarSearch>
            <Button
              variant="ghost"
              size="icon-md"
              onClick={toggleMobile}
              aria-label="Toggle navigation"
              className="-mr-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Backdrop & right panel live OUTSIDE the <nav> so backdrop-blur
           doesn't trap their fixed positioning in a new containing block ── */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[999] bg-black/50 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Slide-in panel from the right */}
      <div
        className={`fixed top-0 z-[1000] h-screen w-72 flex flex-col overflow-hidden bg-white dark:bg-surface-0 shadow-2xl border-l border-black/5 dark:border-white/[0.06] transition-[right] duration-300 ease-in-out ${
          isMobileMenuOpen ? "right-0" : "-right-72"
        }`}
      >
        <div className="flex items-center justify-between shrink-0 px-5 py-4 border-b border-black/5 dark:border-white/[0.06]">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Navigation
          </span>
          <Button
            variant="icon"
            size="icon-md"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-5 py-4">
          <Link to="/docs/" className={mobileLinkClass(isDocsPage)}>
            <BookOpen className="w-4 h-4" />
            <span>Technical Reference</span>
          </Link>
          <Link
            to="/engineering"
            className={mobileLinkClass(isEngineeringPage)}
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
