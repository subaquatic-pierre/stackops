# Project Architecture Specification

## 1. High-Level Directory Structure

The project will use a modified Docusaurus v3 architecture to accommodate the Knowledge Base, Project Showcase, and custom UI components.

```text
/
├── .docusaurus/         # Docusaurus build cache (auto-generated)
├── .opencode/           # Project planning, tracking, and specs
├── docs/                # Primary directory for the Knowledge Base
├── projects/            # Project Showcase (replaces default 'blog/')
├── node_modules/        # Project dependencies
├── src/                 # Custom code, components, and styling
│   ├── components/      # React components
│   │   ├── shared/      # Reusable custom components (e.g., SiteHeader)
│   │   └── ui/          # shadcn/ui generated components
│   ├── css/             # Global CSS
│   │   └── custom.css   # Main entry point for Tailwind CSS
│   └── pages/           # Custom standalone pages (e.g., Home, About)
├── static/              # Static assets (images, fonts, etc.)
├── docusaurus.config.ts # Main Docusaurus configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── components.json      # shadcn/ui configuration
└── package.json
```

## 2. Project Showcase (The `/projects` Route)

The Project Showcase will leverage the Docusaurus Blog plugin, modified to serve as a portfolio.

- **Source Directory:** `/projects/` (renamed from `/blog/`).
- **URL Route:** `/projects/`
- **Implementation Strategy:** In `docusaurus.config.ts`, the blog preset will be configured with `path: './projects'` and `routeBasePath: '/projects'`.
- **Advantages:** Provides built-in tagging, chronological sorting (optional), and easy markdown-based authoring while maintaining a professional URL structure.