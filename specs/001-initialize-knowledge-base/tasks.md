---

description: "Task list for initializing the StackOps technical reference"

---

# Tasks: Initialize Knowledge Base Reference

**Input**: Design documents from `/specs/001-initialize-knowledge-base/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not included. The project constitution explicitly prohibits introducing a testing framework or test suite.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the project is ready for knowledge-base implementation.

> The Docusaurus project is already initialized. This phase contains only a readiness check.

- [x] T000 Verify Node.js dependencies are installed by running `npm install` if `node_modules/` is absent

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Remove placeholder content, prepare the flat domain structure, and update navigation so no broken links remain.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 Remove `docs/intro.mdx`
- [x] T002 [P] Remove `docs/tutorial-basics/` directory and all contents
- [x] T003 [P] Remove `docs/tutorial-extras/` directory and all contents
- [x] T004 [P] Create `docs/aws/` directory
- [x] T005 [P] Create `docs/kubernetes/` directory
- [x] T006 [P] Create `docs/linux/` directory
- [x] T007 Remove all `/docs/intro` references from `docusaurus.config.ts`, swizzled navbar/footer components, and the landing page

**Checkpoint**: Foundation ready — placeholder content is gone, domain folders exist, and navigation links are clean.

---

## Phase 3: User Story 1 - Browse Technical Reference by Domain (Priority: P1) 🎯 MVP

**Goal**: Readers can open the technical reference and see a structured welcome page with links to AWS, Kubernetes, and Linux domains.

**Independent Test**: Navigate to `/docs/` and confirm the welcome page shows a domain index and content-type explanation; confirm the sidebar lists the three domains as categories.

### Implementation for User Story 1

- [x] T008 Create `docs/welcome.mdx` with `slug: /`, intro text, domain index, and actionable-vs-reference explanation, using Tailwind utility classes only and no BEM-style naming
- [x] T009 Verify the navbar "Technical Reference" item opens `/docs/`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Find Actionable Playbooks (Priority: P1)

**Goal**: Each domain contains a goal-oriented playbook with copy-paste commands that readers can execute.

**Independent Test**: Open each domain and confirm it contains one actionable document with objective, prerequisites, procedure, and verification sections.

### Implementation for User Story 2

- [x] T010 [P] [US2] Create `docs/aws/revoke-leaked-iam-keys.mdx` with required front matter and playbook structure
- [x] T011 [P] [US2] Create `docs/kubernetes/force-delete-stuck-pod.mdx` with required front matter and playbook structure
- [x] T012 [P] [US2] Create `docs/linux/find-process-listening-port.mdx` with required front matter and playbook structure

**Checkpoint**: User Story 2 is fully functional and testable independently.

---

## Phase 5: User Story 3 - Find Reference Material (Priority: P2)

**Goal**: Each domain contains a conceptual reference document explaining architectures, config locations, or patterns.

**Independent Test**: Open each domain and confirm it contains one reference document with overview, key concepts, and examples sections.

### Implementation for User Story 3

- [x] T013 [P] [US3] Create `docs/aws/vpc-architecture-overview.mdx` with required front matter and reference structure
- [x] T014 [P] [US3] Create `docs/kubernetes/deployment-manifest-examples.mdx` with required front matter and reference structure
- [x] T015 [P] [US3] Create `docs/linux/common-config-locations.mdx` with required front matter and reference structure

**Checkpoint**: User Stories 1, 2, and 3 are all independently functional.

---

## Phase 6: User Story 4 - Add New Documents Following a Pattern (Priority: P3)

**Goal**: Authors can infer naming and front-matter conventions from existing documents, and the structure remains flat.

**Independent Test**: Inspect any two documents from different domains and confirm consistent naming, front matter, and no nested folders.

### Implementation for User Story 4

- [x] T016 [US4] Verify all knowledge-base documents follow the front-matter contract (`title`, `description`, `tags`), filename conventions, and the objective engineering-focused voice required by Constitution Principle V
- [x] T017 [US4] Verify no nested subdirectories exist under `docs/aws/`, `docs/kubernetes/`, or `docs/linux/`

**Checkpoint**: All user stories are independently functional and authoring conventions are consistent.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final build validation and quickstart verification.

- [x] T018 Run `npm run build` and resolve any broken-link or compilation errors
- [x] T019 Run the validation steps in `specs/001-initialize-knowledge-base/quickstart.md`
- [x] T020 Verify search returns results for at least one keyword per domain (e.g., `iam`, `pod`, `systemd`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel once the foundation is ready.
  - Or sequentially in priority order: US1 → US2 → US3 → US4.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Independent of US1 content but shares the domain folder structure.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). Independent of US1/US2 content.
- **User Story 4 (P3)**: Can start after US2 and US3 are complete because it validates the patterns established by the seed documents.

### Within Each User Story

- Content tasks marked [P] can run in parallel because they target different domain folders.
- Verification tasks depend on content tasks in the same story.

### Parallel Opportunities

- All cleanup and folder-creation tasks in Phase 2 can run in parallel (different paths).
- All actionable documents in Phase 4 can be written in parallel.
- All reference documents in Phase 5 can be written in parallel.
- Different user stories can be worked on simultaneously by different contributors once the foundation is ready.

---

## Parallel Example: User Story 2

```bash
# Launch all actionable documents together:
Task: "Create docs/aws/revoke-leaked-iam-keys.mdx"
Task: "Create docs/kubernetes/force-delete-stuck-pod.mdx"
Task: "Create docs/linux/find-process-listening-port.mdx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm `/docs/` renders the welcome page

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Welcome page and navigation
3. User Story 2 → Actionable playbooks seeded
4. User Story 3 → Reference material seeded
5. User Story 4 → Conventions verified
6. Polish → Build passes and quickstart validation succeeds

### Parallel Team Strategy

With multiple contributors:

1. Team completes Phase 2 (Foundational) together.
2. Once Foundational is done:
   - Contributor A: User Story 1 (welcome page)
   - Contributor B: User Story 2 (actionable docs)
   - Contributor C: User Story 3 (reference docs)
3. User Story 4 and Polish validate the integrated result.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps each task to its user story for traceability.
- Each user story is independently completable and verifiable.
- No test tasks are included per the project constitution.
- Commit after each phase or logical task group.
- Stop at any checkpoint to validate the story independently.
