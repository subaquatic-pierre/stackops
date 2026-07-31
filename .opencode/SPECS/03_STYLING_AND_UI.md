# Styling & UI Architecture

## 1. Tailwind CSS Integration

Tailwind CSS will serve as the primary utility-first styling framework for both custom React components and Markdown/MDX content.

- **Configuration:** Managed via `tailwind.config.js` at the project root.
- **Entry Point:** Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) will be injected into `/src/css/custom.css`.
- **Docusaurus Compatibility:** We will ensure Tailwind does not conflict with default Docusaurus styles, primarily by carefully scoping or utilizing Tailwind prefixes if necessary, though standard implementation usually suffices.

## 2. shadcn/ui Integration

shadcn/ui will be used for rapid, accessible, and customizable UI component development.

- **Configuration:** Managed via `components.json` at the project root.
- **Component Location:** All shadcn/ui components will be installed explicitly into `/src/components/ui/`.
- **Usage:** These components will be consumed by our custom React pages (e.g., Landing page, Project showcase index) and optionally within MDX files.

## 3. Custom Component Strategy

- **Location:** Any bespoke React components written by the developer (that are not direct shadcn/ui installations) will reside in `/src/components/shared/`.
- **Composition:** Custom components should heavily compose shadcn/ui primitives and utilize Tailwind CSS for layout and styling.

## 4. CSS Convention

- **No BEM:** CSS should NOT use BEM (e.g., `__` naming conventions like `navbar__inner`). 
- **Tailwind First:** We must use standard built-in Tailwind utility classes as much as possible for all styling instead of writing custom CSS rules.