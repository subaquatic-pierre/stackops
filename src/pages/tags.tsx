import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { fetchIndexesByWorker, searchByWorker } from "@theme/searchByWorker";
import type { SearchResult } from "@theme/searchByWorker";
import { RowCard, CardSkeleton } from "../components/shared/cards";
import { Tag } from "lucide-react";

const SEARCH_LIMIT = 30;

export default function TagsPage() {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const location = useLocation();
  const tag =
    new URLSearchParams(location.search).get("tag")?.trim() ?? "";

  const [docsResults, setDocsResults] = useState<SearchResult[]>([]);
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
          setError("Failed to load search index.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  // Search for docs matching the tag
  useEffect(() => {
    if (!ready || !tag) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setError(null);
      searchByWorker(baseUrl, "", tag, SEARCH_LIMIT)
        .then((results) => {
          // Filter to keyword/description matches for better tag results
          const tagMatches =
            results?.filter(
              (r) => r.type === 2 || r.type === 3 || r.type === 0,
            ) ?? [];
          // Deduplicate by document ID
          const seen = new Set<number>();
          const deduped: SearchResult[] = [];
          for (const r of tagMatches) {
            if (!seen.has(r.document.i)) {
              seen.add(r.document.i);
              deduped.push(r);
            }
          }
          setDocsResults(deduped);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Search failed.",
          );
          setDocsResults([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [tag, ready, baseUrl]);

  const hasDocs = docsResults.length > 0;
  const isEmpty = !loading && !error && tag && !hasDocs;

  return (
    <Layout
      title={`Tag: ${tag || "Tags"}`}
      description={`Content tagged with "${tag}"`}
    >
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          {tag ? (
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tag:{" "}
              <span className="text-brand">{tag}</span>
            </h1>
          ) : (
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tags
            </h1>
          )}
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Empty prompt */}
        {!tag && (
          <div className="py-12 text-center">
            <Tag className="mx-auto h-10 w-10 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 dark:text-slate-400">
              Navigate to a tag page by clicking a tag badge on any document.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && docsResults.length === 0 && (
          <CardSkeleton variant="row" count={3} />
        )}

        {/* No content at all */}
        {isEmpty && (
          <div className="py-12 text-center">
            <p className="text-slate-900 dark:text-slate-100 font-medium mb-2 text-lg">
              No content tagged with “{tag}”
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Try a different tag or browse the knowledge base directly.
            </p>
          </div>
        )}

        {/* Results */}
        {tag && (
          <>
            {/* Knowledge Base */}
            {hasDocs && (
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Knowledge Base
                </h2>
                {docsResults.length === 0 && !loading && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No knowledge base documents tagged with “{tag}”.
                  </p>
                )}
                <ul className="space-y-3">
                  {docsResults.map((result, index) => {
                    const doc = result.document;
                    return (
                      <li key={`${doc.i}-${index}`}>
                        <RowCard
                          title={doc.t}
                          description={doc.s ? `Section: ${doc.s}` : undefined}
                          href={doc.u + (doc.h || "")}
                          tags={doc.b ? [doc.b[doc.b.length - 1]] : undefined}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Journal */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Journal
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Browse journal entries tagged with "
                {tag}".
              </p>
              <Link
                to={`/engineering/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
              >
                View journal entries for "{tag}" →
              </Link>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
