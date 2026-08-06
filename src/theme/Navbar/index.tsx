import React, { useState, useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useColorMode } from "@docusaurus/theme-common";
import Logo from "@theme/Logo";
import ThemedImage from "@theme/ThemedImage";
import { Button } from "@site/src/components/ui/button";
import { useSharedBodyScrollLock } from "@site/src/hooks/bodyScrollLock";
import DesktopNav from "./DesktopNav";
import MobileNavPanel from "./MobileNavPanel";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { colorMode, setColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const isDocsPage = location.pathname.startsWith("/docs");
  const isJournalPage = location.pathname.startsWith("/journal");

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
        <div className="container flex items-center justify-between">
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
          <DesktopNav isDocsPage={isDocsPage} isJournalPage={isJournalPage} />

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

      <MobileNavPanel
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isDocsPage={isDocsPage}
        isJournalPage={isJournalPage}
      />
    </>
  );
}
