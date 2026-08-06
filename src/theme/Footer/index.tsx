import React from 'react';
import Link from '@docusaurus/Link';
import Logo from '@theme/Logo';
import { BookOpen, FolderGit2 } from 'lucide-react';
import { SiGithub } from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/[0.04] py-12 bg-white dark:bg-surface-0 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo />

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link to="/docs/" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
              <BookOpen className="w-4 h-4" />
              <span>Technical Reference</span>
            </Link>
            <Link to="/journal" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
              <FolderGit2 className="w-4 h-4" />
              <span>Journal</span>
            </Link>
            <Link href="https://github.com/subaquatic-pierre" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer hover:no-underline">
              <SiGithub className="w-4 h-4" />
              <span>GitHub</span>
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-[13px] text-slate-500 m-0 text-center md:text-right">
            &copy; {new Date().getFullYear()} StackOps
          </p>
        </div>
      </div>
    </footer>
  );
}
