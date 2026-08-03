/**
 * Custom BlogPostItem — wraps MDX content in the standard Docusaurus
 * <MDXContent> + ".markdown" container so code blocks, links, and
 * headings pick up the theme's CSS selectors and component pipeline.
 * The title/header is skipped — BlogPostPage renders it separately.
 */
import React, { type ReactNode } from "react";
import BlogPostItemContent from "@theme/BlogPostItem/Content";

interface Props {
  children: ReactNode;
}

export default function BlogPostItem({ children }: Props): ReactNode {
  return <BlogPostItemContent>{children}</BlogPostItemContent>;
}
