import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { fetchIndexesByWorker, searchByWorker } from "@theme/searchByWorker";
import type { SearchResult } from "@theme/searchByWorker";
import { RowCard, CardSkeleton } from "../components/shared/cards";
import { Search } from "lucide-react";

const SEARCH_LIMIT = 20;

export default function SearchPage() {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const location = useLocation();
  const query =
    new URLSearchParams(location.search).get("q")?.trim() ?? "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Warm the search index on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchIndexesByWorker(baseUrl, "")
      .then(() => {
        if (!cancelled) {
          setReady(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(true);
          setError("Failed to load search index. Please try again.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  // Debounced search when query changes
  useEffect(() => {
    if (!ready) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setError(null);
      searchByWorker(baseUrl, "", trimmed, SEARCH_LIMIT)
        .then((searchResults) => {
          setResults(searchResults ?? []);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Search failed. Please try again.",
          );
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, ready, baseUrl]);

  return (
    <Layout title={`Search${query ? `: ${query}` : ""}`} description="Search the knowledge base">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
          {query ? `Search results for: “${query}”` : "Search"}
        </h1>

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && results.length === 0 && (
          <CardSkeleton variant="row" count={4} />
        )}

        {/* Empty prompt */}
        {!loading && !error && !query.trim() && (
          <div className="py-12 text-center">
            <Search className="mx-auto h-10 w-10 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400">
              Enter a keyword above to search the knowledge base.
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && query.trim() && results.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-900 dark:text-slate-100 font-medium mb-2 text-lg">
              No results for “{query.trim()}”
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Try a different keyword or phrase.
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <ul className="space-y-3">
            {results.map((result, index) => {
              const doc = result.document;
              return (
                <li key={`${doc.i}-${index}`}>
                  <RowCard
                    title={doc.s || doc.t}
                    description={doc.s ? `Section on ${doc.t}` : undefined}
                    href={doc.u + (doc.h || "")}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
}
