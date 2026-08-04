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
