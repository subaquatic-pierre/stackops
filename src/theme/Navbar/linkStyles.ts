/**
 * Shared link class name helpers for Navbar desktop and mobile nav links.
 */

export function desktopLinkClass(active: boolean): string {
  return `flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer hover:no-underline ${
    active
      ? "text-accent"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
  }`;
}

export function mobileLinkClass(active: boolean): string {
  return `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:no-underline ${
    active
      ? "text-accent bg-accent/8"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
  }`;
}
