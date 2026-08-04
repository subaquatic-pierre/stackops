/**
 * Custom Docusaurus plugin that extracts search-relevant metadata from
 * all journal posts and exposes it as global data. This enables the
 * journal list page to search across ALL entries instead of being
 * limited to the current paginated page.
 *
 * @type {import('@docusaurus/types').Plugin<{posts: BlogPostSearchItem[]}>}
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

/**
 * @typedef {Object} BlogPostSearchItem
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 * @property {string} permalink
 * @property {string} date
 * @property {string} [image]
 * @property {boolean} featured
 */

/**
 * @typedef {Object} BlogSearchCatalog
 * @property {BlogPostSearchItem[]} posts
 */

/** @type {import('@docusaurus/types').PluginModule} */
module.exports = function blogSearchCatalogPlugin(_context, _options) {
  return {
    name: "blog-search-catalog",

    async loadContent() {
      const journalDir = path.resolve(__dirname, "../../../journal");
      const posts = scanJournalPosts(journalDir);
      return { posts };
    },

    contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};

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

        // Skip draft posts
        if (fm.draft === true) continue;

        // Compute permalink: relative dir under journal/ is the slug
        const relativeDir = path.relative(journalDir, dir);
        const slug =
          relativeDir || path.basename(mdxFile.name, path.extname(mdxFile.name));
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

  // Sort by date descending (matches blog default)
  results.sort((a, b) => b.date.localeCompare(a.date));

  return results;
}

/**
 * Normalize tags to string array.
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
 * Normalize date to ISO string.
 * @param {unknown} date
 * @returns {string}
 */
function normalizeDate(date) {
  if (date instanceof Date) return date.toISOString();
  if (typeof date === "string") return new Date(date).toISOString();
  if (typeof date === "number") return new Date(date).toISOString();
  return new Date(0).toISOString();
}
