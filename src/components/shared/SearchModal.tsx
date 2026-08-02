import React, { useCallback, useEffect, useRef, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import { fetchIndexesByWorker, searchByWorker } from "@theme/searchByWorker";
import type { SearchResult } from "@theme/searchByWorker";
import {
  Search,
  X,
  Command,
  FileText,
  Hash,
  Loader2,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useSharedBodyScrollLock } from "../../hooks/bodyScrollLock";

const SEARCH_LIMIT = 8;

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Render a minimal headerless variant for the navbar (no footer). */
  variant?: "default" | "navbar";
}

export default function SearchModal({
  isOpen,
  onClose,
  triggerRef,
  variant = "default",
}: SearchModalProps) {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const history = useHistory();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Lock body scroll while open
  useSharedBodyScrollLock(isOpen);

  // ── Warm the search index on open ──
  useEffect(() => {
    if (!isOpen) {
      setReady(false);
      setResults([]);
      setQuery("");
      setSelectedIndex(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchIndexesByWorker(baseUrl, "")
      .then(() => {
        if (!cancelled) {
          setReady(true);
          setLoading(false);
          // Small delay so the modal transition completes before focus
          requestAnimationFrame(() => inputRef.current?.focus());
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, baseUrl]);

  // ── Debounced search ──
  useEffect(() => {
    if (!isOpen || !ready) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      searchByWorker(baseUrl, "", trimmed, SEARCH_LIMIT)
        .then((searchResults) => {
          setResults(searchResults ?? []);
          setSelectedIndex(0);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, ready, isOpen, baseUrl]);

  // ── Scroll selected item into view ──
  useEffect(() => {
    if (results.length === 0) return;
    const el = listRef.current?.children[selectedIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex, results.length]);

  // ── Keyboard handling: Escape, arrows, Enter ──
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Unfocus input on arrow keys so space/enter don't insert characters
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        inputRef.current?.blur();
        setSelectedIndex((prev) => {
          if (results.length === 0) return prev;
          if (e.key === "ArrowDown") {
            return prev >= results.length - 1 ? 0 : prev + 1;
          }
          return prev <= 0 ? results.length - 1 : prev - 1;
        });
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) navigateToResult(selected);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex]);

  // ── Return focus to trigger on close ──
  useEffect(() => {
    if (!isOpen && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      const url = result.document.u + (result.document.h || "");
      onClose();
      history.push(url);
    },
    [history, onClose],
  );

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  const showFooter = variant === "default";

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
      className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* Spacer — pushes the modal down below the navbar on desktop */}
      <div className="hidden sm:block flex-shrink-0 h-[12vh] min-h-[80px]" />

      <div className="mx-auto w-full max-w-3xl sm:max-w-[640px] flex flex-col flex-1 sm:flex-none sm:max-h-[70vh] overflow-hidden sm:rounded-2xl sm:border sm:border-white/10 bg-white dark:bg-surface-2 sm:shadow-2xl max-sm:rounded-none max-sm:border-0 max-sm:h-full">
        {/* ── Header / Input ── */}
        <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/[0.06] px-4 py-3">
          <Search
            className="h-5 w-5 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation…"
            aria-label="Search documentation"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
          />
          {!query.trim() && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-black/5 dark:border-white/10 px-2 py-1 text-xs text-slate-500">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1.5 text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {/* Loading state */}
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading search index…</span>
            </div>
          )}

          {/* Empty prompt */}
          {!loading && !query.trim() && (
            <div className="py-12 text-center text-sm text-slate-500">
              <Search className="mx-auto h-8 w-8 mb-3 text-slate-300 dark:text-slate-600" />
              <p>Type a keyword to search the knowledge base.</p>
            </div>
          )}

          {/* No results */}
          {!loading && query.trim() && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
                No results for “{query.trim()}”
              </p>
              <p className="text-sm text-slate-500">
                Try a different keyword or phrase.
              </p>
            </div>
          )}

          {/* Results list */}
          {results.length > 0 && (
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Search results"
              className="space-y-0.5"
            >
              {results.map((result, index) => {
                const isSelected = index === selectedIndex;
                const title = result.document.s || result.document.t;
                const breadcrumbs = result.document.b?.join(" ‣ ");
                const pageTitle = result.document.t;

                return (
                  <li
                    key={`${result.document.i}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      onClick={() => navigateToResult(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full text-left rounded-lg px-4 py-3 transition-colors",
                        isSelected
                          ? "bg-brand/10 dark:bg-brand/20"
                          : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-xs",
                            isSelected ? "text-brand" : "text-slate-400",
                          )}
                        >
                          {result.document.s ? (
                            <Hash className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Section title (bold) + optional page context */}
                          {result.document.s ? (
                            <>
                              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {title}
                              </p>
                              <p className="truncate text-xs text-slate-500 mt-0.5">
                                on{" "}
                                <span className="text-slate-600 dark:text-slate-400">
                                  {pageTitle}
                                </span>
                              </p>
                            </>
                          ) : (
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {title}
                            </p>
                          )}

                          {/* Breadcrumbs */}
                          {breadcrumbs && (
                            <p className="truncate text-xs text-slate-400 mt-1">
                              {breadcrumbs}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className={cn(
            "flex items-center border-t border-black/5 dark:border-white/[0.06] px-4 py-2.5 text-xs text-slate-500",
            showFooter ? "justify-between" : "justify-end",
          )}
        >
          {showFooter && (
            <div className="hidden sm:flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                <span className="ml-0.5">navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" />
                <span>select</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-[10px] font-mono leading-none px-1 py-0.5 rounded border border-current/20">
                  esc
                </span>
                <span>close</span>
              </span>
            </div>
          )}
          {query.trim() && (
            <Link
              to={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="text-brand hover:underline text-xs"
            >
              See all results →
            </Link>
          )}
          {!query.trim() && (
            <span className="text-slate-400">Type to search</span>
          )}
        </div>
      </div>
    </div>
  );
}
