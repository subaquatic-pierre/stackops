import React from "react";
import Link from "@docusaurus/Link";

export default function BackLink(): React.ReactNode {
  return (
    <div className="mb-6">
      <Link
        to="/engineering"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent-light transition-colors no-underline hover:no-underline"
      >
        ← Back to Journal
      </Link>
    </div>
  );
}
