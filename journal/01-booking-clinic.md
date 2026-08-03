# Booking Clinic

## Overview

**Booking Clinic** is a multi-tenant booking and CRM platform for healthcare clinics and appointment-based businesses. It provides shared admin dashboards for managing services, staff, locations, schedules, and bookings across multiple client workspaces, plus customizable public-facing booking websites.

- **Version:** 0.1.11
- **Last Deployed:** 2026-02-12 (staging)
- **Repository:** CODATIVITY/booking-clinic
- **Primary Tech:** Next.js 16, Express.js 5, Rust (Axum), PostgreSQL, Redis

## Architecture

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  www (4000)  │  │  api (5000)  │  │ email (6000) │
│  Next.js 16  │  │  Express 5   │  │  Rust/Axum   │
│  React 19    │  │  TypeScript  │  │  AWS SES     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────┬────────┴────────┬────────┘
                │                 │
         ┌──────┴──────┐   ┌──────┴──────┐
         │ PostgreSQL 17│   │  Redis 7.4  │
         │  (booking)   │   │ (cache/pub) │
         └──────────────┘   └─────────────┘
```

**5 services** orchestrated via Docker Compose: `api` (Express 5/TypeScript), `www` (Next.js 16), `email` (Rust/Axum), `postgres` (PostgreSQL 17), `redis` (Redis 7.4).

**External auth dependency:** OxideAuth serves as the authentication provider. The API proxies all auth operations through OxideAuth using a service account JWT.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 4000 | Next.js 16 + MUI 7 + FullCalendar | Admin dashboard and public booking pages |
| **api** | 5000 | Express 5 + MikroORM 6 | REST API with generic CRUD framework |
| **email** | 6000 | Rust (Axum) + SQLx | Event-driven email service with AWS SES |

### www (Frontend)

- **Framework:** Next.js 16 (App Router), React 19
- **UI:** MUI v7, Emotion, Ant Design Icons
- **Route groups:** `(auth)` login/register, `(dashboard)/[tenant]` admin, `(simple)` public booking
- **Key pages:** Dashboard, Schedule (FullCalendar), Bookings, Services, Providers, Locations, Users, Templates, Settings, Workspaces, Notifications
- **Logo:** `/www/public/brand/logo.png`, `logo-light.png`, `logo-dark.png`, `logo-icon.png`

### api (Backend)

- **Framework:** Express.js 5, TypeScript, SWC compilation
- **ORM:** MikroORM 6 with PostgreSQL
- **Entity CRUD:** Generic `BaseModelRouter<T>` pattern — 14 entities with automatic CRUD + RBAC
- **Auth flow:** Validates tokens against OxideAuth, enforces RBAC on all routes
- **Storage backends:** Local, Azure Blob, Hetzner S3 (configurable)
- **Special endpoints:** Public booking via deep links (`/booking/create-token`, `/booking/create-public-booking`)

### email (Microservice)

- **Language:** Rust
- **Framework:** Axum
- **Database:** Separate `email` PostgreSQL database
- **Messaging:** Redis pub/sub for event-driven dispatch
- **Provider:** AWS SES
- **Templates:** Handlebars/Tera templating

## Database

- **Primary DB:** PostgreSQL 17 (`booking` database, MikroORM 6 migrations)
- **Email DB:** Separate `email` database managed by Rust sqlx
- **Cache:** Redis (max 512MB, allkeys-lru eviction, AOF persistence)
- **12 entities:** User, Workspace, Provider, ServiceOffering, ServiceOfferingSlot, Location, Booking, Template, Notification, Chat, Upload, UploadTag

## Key Features

- **Multi-tenant isolation:** Workspace-scoped entities via `BaseWorkspaceEntity`, per-tenant branding and settings
- **Public booking with deep links:** Cryptographically-secure time-limited tokens for unauthenticated booking
- **Advanced scheduling:** Recurring slots via `daysOfWeek` JSON, templates for standardization
- **Typed service registry:** Compile-time API call safety with custom `useServiceSWR` hook
- **Polyglot architecture:** Node.js API, Next.js frontend, Rust email service
- **Fine-grained RBAC:** Permissions like `booking.serviceOfferingSlot.create`, validated through OxideAuth

## Deployment

- **Kubernetes (Hetzner):** Kustomize-based, namespace `booking`
- **Nginx:** `booking.codaweb.co` → dashboard, `booking-api.codaweb.co` → API
- **SSL:** Let's Encrypt/Certbot
- **Deploy script:** `deploy.sh {version} {env}` — builds all 3 Docker images, pushes to DockerHub, applies K8s manifests
