# Maven Platform

## Overview

**Maven Platform** is a Bill of Quantities (BOQ) management platform for the construction and procurement industry. It manages projects, work orders, BOQs, work items, classifications, checklists, and provides a specialized export engine generating formatted Excel (XLSX) and PDF documents.

- **Version:** 1.13.12
- **Last Deployed:** 2026-07-23 (production)
- **Repository:** Azure DevOps — MavenPlatform
- **Primary Tech:** Next.js 15, Express.js 4, .NET 8, PostgreSQL, MikroORM

## Architecture

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ www (4000)   │  │ api (5000)   │  │exporter(7000)│
│ Next.js 15   │  │ Express 4    │  │ .NET 8       │
│ MUI v7       │  │ MikroORM 6   │  │ Aspose.Cells │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────┬────────┴────────┬────────┘
                │                 │
         ┌──────┴──────┐          │
         │ PostgreSQL 17│          │
         │  (maven)    │◀─────────┘
         └─────────────┘
```

**4 services:** Next.js dashboard, Express API, .NET BOQ Exporter, PostgreSQL 17. External auth via OxideAuth.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 4000 | Next.js 15 + MUI v7 + Redux | Admin dashboard with TanStack Table |
| **api** | 5000 | Express 4 + MikroORM 6 | REST API with 25 service files |
| **BOQExporter** | 7000 | .NET 8 + Aspose.Cells | Professional XLSX/PDF generation |

### www (Dashboard)

- **Framework:** Next.js 15.2.8 (App Router), React 18, TypeScript
- **UI:** MUI v7 + MUI X Pro (Tree View), TanStack React Table v8, ApexCharts, FullCalendar, TipTap, DnD Kit
- **i18n:** English + Arabic with RTL support
- **Key pages:** Dashboard, Projects, Clients, Work Orders, BOQs, Work Items, BOQ Templates, Checklists, Section Editor, Settings, Users, Suppliers, Variable Option Sets, Tasks, Tenders, Bids, Invoice
- **Logo:** `/public/logo.png` + inline SVG geometric logo in `LogoIcon.tsx`

### api (Backend)

- **Framework:** Express.js 4, TypeScript, SWC
- **ORM:** MikroORM 6 with 22 entity models
- **Middleware:** Helmet, CORS, HPP, compression, Morgan
- **22+ route sets:** Projects, Users, Companies, BOQs, Work Orders, Classifications, Work Items, Work Item Entries, Entry Notes, Entry Revisions, Checklists, Checklist Responses, Workflow Statuses, Units, Uploads, Emails, Tools, Variable Option Sets, Section Notes, Settings
- **Flexible query protocol:** `$and`/`$or` JSON filters, populate, pagination, fuzzy search, soft delete
- **Auth:** OxideAuth integration, 5 role types (SuperAdmin, TeamManager, TeamLeader, QS, OfficeManager)

### BOQExporter

- **Framework:** .NET 8 ASP.NET Core Minimal API
- **Excel engine:** Aspose.Cells 25.8.0 (licensed)
- **Outputs:** Multi-sheet XLSX with cover, index, preambles, section sheets, summary
- **Custom formatting:** Fonts, colors, borders, print area, A4 portrait, page numbers, watermarks
- **Also generates:** PDF via SkiaSharp
- **Endpoints:** `POST /export-boq`, `POST /export-section`, `GET /ping`
- **Storage:** Uploads generated files to Hetzner S3, returns download URLs

## Database

- **PostgreSQL 17** via MikroORM
- **3 migration contexts:** local, staging, production
- **22 entities:** Boq, BoqChecklist, BoqChecklistResponse, BoqWorkItemEntry, BoqWorkItemEntryRevision, BoqWorkItemEntryNote, BoqWorkItemMeta, BoqWorkItem, BoqWorkflowStatus, Classification, Company, Project, ProjectField, Unit, User, WorkOrder, BoqWorkItemEntryMeta, Upload, UploadTag, VariableOptionSet, VariableOption, SectionNote, Settings
- **Python seeder:** Supports selective seeding of users, units, sections, companies, projects, work_orders, boqs
- **LibreOffice integration:** `libreoffice-calc` and `libreoffice-core` in production Docker image for server-side document conversion

## Key Features

- **Fine-grained RBAC:** 5 roles with permissions per entity (`maven.boq.create`, `maven.ui.admin`, etc.)
- **BOQ Export Engine:** Commercial-grade XLSX/PDF with Aspose.Cells — multi-sheet, table of contents, watermarks
- **TanStack React Table v8:** Performant data grids with sorting, filtering, pagination
- **MUI X Pro:** Tree View Pro for hierarchical data
- **TipTap rich text:** Full rich text editing with color, highlighting, images, alignment
- **Drag-and-drop:** DnD Kit for interactive reordering
- **File upload management:** Drag-and-drop uploads with QR code generation and categorization tags
- **Puck CMS:** Visual page builder (`@measured/puck`) integrated in frontend

## Deployment

- **Kubernetes (Staging):** Namespace `maven`, NodePorts 31750/31751/31752
- **Production (bare-metal):** Two VMs (`maven-web-1`, `maven-web-2`) via systemd, Cloudflare load-balanced
- **Docker images:** `cdtroman/maven-dashboard`, `maven-boq-api`, `maven-boq-exporter`
- **3 environments:** Local (Docker Compose), Staging (Kubernetes), Production (systemd VMs)
- **Deploy script:** `./deploy.sh {VERSION} {local|staging|production}` with `--dry-run` support
- **Storage:** Hetzner S3-compatible (`maven` bucket), Azure Blob (alternative)
