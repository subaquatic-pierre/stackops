/**
 * Type declarations for blogSearchCatalog plugin.
 * The plugin is a plain .js file; this file provides
 * TypeScript types for consumers.
 */

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
