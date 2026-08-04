/**
 * Custom Docusaurus plugin that extracts search-relevant metadata from
 * all journal posts and writes it to a static JSON file. The blog list
 * page fetches this file at runtime to enable cross-page search.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function blogSearchCatalogPlugin(context, _options) {
  return {
    name: "blog-search-catalog",

    async loadContent() {
      const journalDir = path.resolve(__dirname, "../../journal");
      const posts = scanJournalPosts(journalDir);

      return { posts };
    },

    contentLoaded({ content }) {
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

/**
 * Walk the journal directory, find all .mdx files, and extract frontmatter.
 * @param {string} journalDir
 * @returns {BlogPostSearchItem[]}
 */
function scanJournalPosts(journalDir) {
  /** @type {BlogPostSearchItem[]} */
  const results = [];

  /** @param {string} dir */
  function walk(dir) {
    let entries;
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
          title: fm.title || slug,
          description: fm.description || "",
          tags: normalizeTags(fm.tags),
          permalink,
          date: normalizeDate(fm.date),
          image: fm.image || undefined,
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

/**
 * @param {unknown} tags
 * @returns {string[]}
 */
function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .filter((t) => typeof t === "string")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * @param {unknown} date
 * @returns {string}
 */
function normalizeDate(date) {
  if (date instanceof Date) return date.toISOString();
  if (typeof date === "string") return new Date(date).toISOString();
  if (typeof date === "number") return new Date(date).toISOString();
  return new Date(0).toISOString();
}
