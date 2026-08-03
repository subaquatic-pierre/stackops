import { useEffect, type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";

/**
 * Redirect page — routes old /tags?tag= links to the canonical
 * /docs/tags/{tag} Docusaurus pages (now swizzled with RowCard layout).
 */
export default function TagsPage(): ReactNode {
  const location = useLocation();
  const tag =
    new URLSearchParams(location.search).get("tag")?.trim() ?? "";

  const dest = tag
    ? `/engineering/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`
    : "/engineering/tags/";

  useEffect(() => {
    window.location.replace(dest);
  }, [dest]);

  return null;
}
