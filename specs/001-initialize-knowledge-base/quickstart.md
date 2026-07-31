# Quickstart: Validate Knowledge Base Reference

**Feature**: Initialize Knowledge Base Reference  
**Date**: 2026-07-31

## Prerequisites

- Node.js >= 20 installed
- Repository dependencies installed (`npm install` already run)

## Validation Steps

### 1. Build the site

```bash
npm run build
```

**Expected outcome**: Build completes with exit code 0 and no broken-link errors.

### 2. Start the development server

```bash
npm start
```

**Expected outcome**: Server starts at `http://localhost:3000/` without errors.

### 3. Verify the docs welcome page

1. Open `http://localhost:3000/docs/`.
2. Confirm the page shows:
   - An introduction to the StackOps technical reference.
   - A structured index linking to `AWS`, `Kubernetes`, and `Linux` domains.
   - A brief explanation of actionable versus reference content.

### 4. Verify domain structure

For each domain (`aws`, `kubernetes`, `linux`):

1. Navigate to `http://localhost:3000/docs/<domain>/`.
2. Confirm the sidebar category is expandable and shows a flat list of documents.
3. Confirm the domain contains:
   - One actionable document (filename follows `verb-noun-context.mdx`).
   - One reference document (filename follows `noun-context.mdx`).

### 5. Verify front-matter conventions

Open any two documents from different domains and confirm each has:

- `title`
- `description`
- `tags`

Optional fields (`last_updated`, `draft`) may be present but are not required.

### 6. Verify navigation links

1. Confirm the navbar "Technical Reference" link opens `/docs/`.
2. Confirm the footer no longer links to `/docs/intro`.
3. Confirm the footer "Technical Reference" link points to `/docs/`.

### 7. Verify search

1. Use the search input.
2. Search for one keyword per domain (e.g., `iam`, `pod`, `systemd`).
3. Confirm relevant documents appear in the results.

### 8. Verify no generic tutorial content remains

1. Confirm `docs/intro.mdx` is removed.
2. Confirm `docs/tutorial-basics/` and `docs/tutorial-extras/` are removed.
3. Confirm navigating to `/docs/intro` returns a 404.

## Sign-Off Criteria

The feature is validated when:

- `npm run build` succeeds.
- The welcome page renders at `/docs/`.
- Each of the three domains has one actionable and one reference document.
- All navigation links point to valid pages.
- Search returns results for at least one keyword per domain.
