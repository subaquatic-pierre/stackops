import React, { type ReactNode, useCallback, useState } from "react";
import clsx from "clsx";
import { Search } from "lucide-react";
import SearchModal from "@site/src/components/shared/SearchModal";

export default function NavbarSearch({
  className,
  children: _children,
}: {
  className?: string;
  children?: ReactNode;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Global Ctrl+K / Cmd+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search (Ctrl+K)"
        title="Search (Ctrl+K)"
        className={clsx(
          "flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer",
          className,
        )}
      >
        <Search className="h-4 w-4" />
      </button>

      <SearchModal
        isOpen={isOpen}
        onClose={close}
        // variant="navbar"
      />
    </>
  );
}
