import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { BookOpen, FolderGit2, Menu, X, Sun, Moon } from 'lucide-react';
import { useColorMode } from '@docusaurus/theme-common';
import Logo from '@theme/Logo';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { colorMode, setColorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-surface-0/70 border-b border-black/5 dark:border-white/[0.04]">
      <div className="container h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/docs/" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
            <BookOpen className="w-4 h-4" />
            <span>Technical Reference</span>
          </Link>
          <Link to="/projects" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
            <FolderGit2 className="w-4 h-4" />
            <span>Projects</span>
          </Link>
          <Link href="https://github.com/subaquatic-pierre" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub</span>
          </Link>
          <button
            onClick={() => setColorMode(isDarkTheme ? 'light' : 'dark')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent border-0 cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setColorMode(isDarkTheme ? 'light' : 'dark')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent border-0 cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className="p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer bg-transparent border-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 dark:border-white/[0.04] bg-white/95 dark:bg-surface-0/95 backdrop-blur-md absolute w-full left-0">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link to="/docs/" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
              <BookOpen className="w-4 h-4" />
              <span>Technical Reference</span>
            </Link>
            <Link to="/projects" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
              <FolderGit2 className="w-4 h-4" />
              <span>Projects</span>
            </Link>
            <Link href="https://github.com/subaquatic-pierre" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
