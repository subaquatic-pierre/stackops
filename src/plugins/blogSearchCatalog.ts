/**
 * Custom Docusaurus plugin that extracts search-relevant metadata from
 * all journal posts and writes it to a static JSON file. The blog list
 * page fetches this file at runtime to enable cross-page search.
 */
import type { LoadContext, Plugin } from "@docusaurus/types";
import * as fs from "fs";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const matter = require("gray-matter");

export interface BlogPostSearchItem {
  title: string;
  description: string;
  tags: string[];
  permalink: string;
  date: string;
  image?: string;
  featured: boolean;
}

export interface BlogSearchCatalog {
  posts: BlogPostSearchItem[];
}

export default function blogSearchCatalogPlugin(
  context: LoadContext,
  _options: Record<string, never>,
): Plugin<BlogSearchCatalog> {
  return {
    name: "blog-search-catalog",

    async loadContent(): Promise<BlogSearchCatalog> {
      const journalDir = path.resolve(__dirname, "../../../journal");
      const posts = scanJournalPosts(journalDir);
      return { posts };
    },

    contentLoaded({ content }: { content: BlogSearchCatalog }): void {
      const staticDir = path.join(context.siteDir, "static");
      fs.mkdirSync(staticDir, { recursive: true });
      fs.writeFileSync(
        path.join(staticDir, "blog-search-catalog.json"),
        JSON.stringify(content),
        "utf-8",
      );
    },
  };
}

// ── File scanning ──────────────────────────────────────────────────

function scanJournalPosts(journalDir: string): BlogPostSearchItem[] {
  const results: BlogPostSearchItem[] = [];

  function walk(dir: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      }
    }

    const mdxFiles = entries.filter(
      (e) => e.isFile() && /\.mdx?$/.test(e.name),
    );
    for (const mdxFile of mdxFiles) {
      const filePath = path.join(dir, mdxFile.name);
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data: fm } = matter(raw);

        if (fm.draft === true) continue;

        const relativeDir = path.relative(journalDir, dir);
        const slug =
          relativeDir ||
          path.basename(mdxFile.name, path.extname(mdxFile.name));
        const permalink = `/journal/${slug}`;

        results.push({
          title: (fm.title as string) || slug,
          description: (fm.description as string) || "",
          tags: normalizeTags(fm.tags),
          permalink,
          date: normalizeDate(fm.date),
          image: fm.image as string | undefined,
          featured: fm.featured === true,
        });
      } catch {
        // Skip unreadable files
      }
    }
  }

  walk(journalDir);

  results.sort((a, b) => b.date.localeCompare(a.date));

  return results;
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeDate(date: unknown): string {
  if (date instanceof Date) return date.toISOString();
  if (typeof date === "string") return new Date(date).toISOString();
  if (typeof date === "number") return new Date(date).toISOString();
  return new Date(0).toISOString();
}
