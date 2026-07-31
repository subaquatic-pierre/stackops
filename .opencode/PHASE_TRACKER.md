# Project Phase Tracker

## SINGLE SOURCE OF TRUTH
Always check this file before executing any task.

## Phase 0: Pre-Planning & Agent Setup [COMPLETED]
- [x] Initialize the `.opencode/` directory at the project root.
- [x] Create `.opencode/AGENTS.md` with operational parameters and rules.
- [x] Create `.opencode/PHASE_TRACKER.md` tracking granular sub-tasks.
- [x] Create the directory `.opencode/SPECS/` to hold future templates.
- [x] Draft initial spec blueprints for templates and architecture.

## Phase 1: Planning & Architecture [COMPLETED]
- [x] Define project scope and core features. (Covered by SPECS)
- [x] Finalize tech stack and architectural decisions. (Covered by SPECS)
- [x] Final Review and Sign-off of Phase 1 to proceed to Bootstrapping.

## Phase 2: Environment Setup & Bootstrapping [COMPLETED]
- [x] Scaffold Docusaurus project (Skip: Already initialized).
- [x] Install and configure Tailwind CSS.
- [x] Set up shadcn/ui component integration.
- [x] Configure `docusaurus.config.ts` (projects route).
- [x] Restructure directory (rename blog to projects, etc.).
- [x] Implement initial landing page and branding spec.

## Phase 3: UI & Design Refinement [COMPLETED]
- [x] Refine landing page layout, animations, and responsiveness.
- [x] Swizzle and customize Docusaurus Navbar to perfectly match StackOps branding.
- [x] Swizzle and customize Docusaurus Footer to match StackOps branding.
- [x] Ensure strict dark-mode theme enforcement across all built-in components.

## Phase 4: Knowledge Base Implementation [PENDING]
- [ ] Create `.opencode/SPECS/` template for "Actionable/Cookbook" content.
- [ ] Create `.opencode/SPECS/` template for "Reference" content.
- [ ] Set up initial `/docs` directory structures (`aws`, `linux`, etc.).
- [ ] Implement and test tagging architecture.
- [ ] Verify Tailwind prose/typography styles inside MDX files.

## Phase 5: Project Showcase Implementation [PENDING]
- [ ] Define Front Matter specification for Project entries.
- [ ] Customize the Project Listing (Index) page to function as a portfolio grid.
- [ ] Build reusable UI components for project tech stack tags and links.
- [ ] Create initial showcase entries to verify routing and layout.

## Phase 6: Global Features & Polish [PENDING]
- [ ] Configure Search functionality.
- [ ] Global performance and accessibility audit.
- [ ] Final visual QA and bug fixes.