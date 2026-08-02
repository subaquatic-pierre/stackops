import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import { fetchIndexesByWorker, searchByWorker } from "@theme/searchByWorker";
import type { SearchResult } from "@theme/searchByWorker";
import { Search, X, Command, FileText, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const SEARCH_LIMIT = 8;

export interface HomepageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function HomepageSearchModal({
  isOpen,
  onClose,
  triggerRef,
}: HomepageSearchModalProps) {
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
  const modalRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Warm the search index when the modal opens.
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
          inputRef.current?.focus();
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

  // Debounced search.
  useEffect(() => {
    if (!isOpen || !ready) return;
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      searchByWorker(baseUrl, "", query.trim(), SEARCH_LIMIT)
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

  // Close on Escape and basic focus trap.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev >= results.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? results.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) navigateToResult(selected);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex]);

  // Return focus to trigger when closing.
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
    [history, onClose]
  );

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[12vh] max-sm:p-0 max-sm:pt-0"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-2xl mx-4 sm:mx-0 overflow-hidden rounded-2xl border border-white/10 bg-white dark:bg-surface-2 shadow-2xl max-sm:rounded-none max-sm:border-0 max-sm:h-full max-sm:flex max-sm:flex-col">
        {/* Header / Input */}
        <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/[0.06] px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search knowledge base..."
            aria-label="Search knowledge base"
            autoComplete="off"
            className="flex-1 bg-transparent text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
          />
          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-black/5 dark:border-white/10 px-2 py-1 text-xs text-slate-500">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1.5 text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] max-sm:max-h-none max-sm:flex-1 overflow-y-auto px-2 py-2">
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-10 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading search index…</span>
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="py-8 text-center text-sm text-slate-500">
              Type a keyword or tag to search the knowledge base.
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
                No results for “{query.trim()}”
              </p>
              <p className="text-sm text-slate-500">
                Try a different keyword or tag.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul role="listbox" aria-label="Search results" className="space-y-1">
              {results.map((result, index) => (
                <li key={`${result.document.i}-${index}`} role="option" aria-selected={index === selectedIndex}>
                  <button
                    type="button"
                    onClick={() => navigateToResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full text-left rounded-xl px-4 py-3 transition-colors",
                      index === selectedIndex
                        ? "bg-brand/10 dark:bg-brand/20"
                        : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                          {result.document.s || result.document.t}
                        </p>
                        {result.document.b?.length > 0 && (
                          <p className="truncate text-xs text-slate-500">
                            {result.document.b.join(" / ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/5 dark:border-white/[0.06] px-4 py-2.5 text-xs text-slate-500">
          <div className="hidden sm:flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span className="sm:hidden text-slate-400">Type to search</span>
          {query.trim() && (
            <Link
              to={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="text-brand hover:underline"
            >
              See all results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
