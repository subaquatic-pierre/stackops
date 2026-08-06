<div align="center">
  <img src="./static/img/icon.svg" alt="StackOps Logo" width="80" height="80" />
  <h1>StackOps</h1>
  <p><strong>Software engineering through an operational lens.</strong></p>
</div>

---

## Introduction

**StackOps** is a hybrid digital cookbook and encyclopedia for infrastructure, operations, and development. Built for high-speed retrieval, it replaces complex nested hierarchies with a highly-opinionated flat structure, relying heavily on metadata tags and full-text search.

Whether you are executing an under-pressure incident response playbook or reviewing a deep-dive on system architectures, StackOps is designed to get you the exact information you need, instantly.

## Core Features

- **Actionable Cookbooks:** Goal-oriented recipes, incident response playbooks, and copy-paste commands designed for rapid execution (e.g., `revoke-aws-keys.mdx`).
- **Reference Material:** Deep-dive explanations of system architectures, configuration locations, and theoretical concepts.
- **Flat Architecture:** Content organized in flat directories with front-matter tags and full-text search. Metadata drives discovery without nested sub-folders.
- **Engineering Journal:** A running log of projects, homelab experiments, and technical articles — captured as dated entries rather than polished portfolio pieces.
- **Modern UI/UX:** Built with a custom glassmorphism theme, strict Dark/Light mode adherence, dynamic gradient typography, and seamless transitions.

## Tech Stack

- **Framework:** [Docusaurus v3](https://docusaurus.io/) (React-based Static Site Generator)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Language:** TypeScript & MDX

---

## 🚀 Local Development

### Prerequisites

- Node.js (v20.0 or newer recommended)
- npm

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/subaquatic-pierre/stack-garden.git
cd stack-garden
npm install
```

### Starting the Dev Server

To start the local development server with hot-reloading:

```bash
npm start
```

The site will be available at `http://localhost:3000/`.

### Building for Production

To bundle the website into static files for production:

```bash
npm run build
```

This generates the optimized site in the `build/` directory. You can test the production build locally using `npm run serve`.

### Troubleshooting Cache

If you encounter layout or styling issues after checking out new branches or modifying core `docusaurus.config.ts` paths, clear the bundler cache:

```bash
npm run clear
```

---

## 📂 Project Architecture

The project deviates from a standard Docusaurus setup to enforce our flat architecture and custom routing:

```text
/
├── .opencode/           # Engineering specifications & AI agent rules
├── docs/                # Technical Reference Manual (Knowledge Base)
│   ├── aws/             # Flat directory for AWS-related MDX files
│   ├── kubernetes/      # Flat directory for K8s-related MDX files
│   └── linux/           # Flat directory for Linux-related MDX files
├── journal/             # Engineering Journal — per-project directories with index.mdx + assets
├── src/
│   ├── components/      # Custom React & shadcn/ui components
│   ├── css/             # Tailwind & Custom CSS (custom.css)
│   ├── pages/           # Landing page (index.tsx)
│   └── theme/           # Swizzled Docusaurus components (Navbar, Footer, Logo)
├── static/              # Images, icons, and static assets
├── docusaurus.config.ts # Core configuration
└── tailwind.config.js   # Tailwind & Dark Mode configuration
```

## 📝 Writing Content

### Adding to the Technical Reference (`/docs`)

1. Create an `.mdx` file directly inside the relevant domain folder (e.g., `docs/postgres/create-user.mdx`). **Do not create nested subfolders.**
2. Ensure you include detailed front-matter tags for discovery:

```yaml
---
title: "How to Create a New User in PostgreSQL"
tags: [postgres, sql, user-management, actionable]
---
```

### Adding to the Journal (`/journal`)

1. Create an `.mdx` file in the `journal/` directory.
2. Use standard Docusaurus blog front-matter (date, authors, tags).

```yaml
---
title: "StackOps Platform"
date: 2026-07-31
tags: [react, tailwind, docusaurus]
---
```

---

## License

&copy; 2026 StackOps. All rights reserved.


UPDATE

UPDATE
