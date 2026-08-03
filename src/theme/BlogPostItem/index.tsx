/**
 * Custom BlogPostItem — renders only the MDX content body (children),
 * skipping the title/header since our BlogPostPage renders that separately.
 */
import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function BlogPostItem({ children }: Props): ReactNode {
  return <>{children}</>;
}
