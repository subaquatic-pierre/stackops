# Champions Karate

## Overview

**Champions Karate** is a full-stack web application for a martial arts academy in Dubai, UAE. It serves as both a public marketing website and an internal admin dashboard, offering karate, kickboxing, self-defence, and fitness programs across five dojo locations.

- **Version:** 189 (integer versioning)
- **Last Deployed:** 2026-07-21 (production)
- **Repository:** CODATIVITY/champions-karate
- **Primary Tech:** Next.js 14, Strapi CMS, MUI v5, PostgreSQL

## Architecture

```
┌──────────────────────┐
│  www (8000)          │
│  Next.js 14          │
│  MUI v5, FullCalendar│
└──────────┬───────────┘
           │ fetches from Strapi
           ▼
┌──────────────────────┐     ┌──────────────┐
│  api (8001)          │────▶│ PostgreSQL   │
│  Strapi v4.13.6      │     │ champions_   │
│  Headless CMS        │     │ karate       │
└──────────────────────┘     └──────────────┘
```

**3 services:** Next.js frontend, Strapi CMS backend, PostgreSQL. No mail catching in dev (MailDev). Dual database strategy: PostgreSQL in production, SQLite in development.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 8000 | Next.js 14 + MUI v5 | Public site + admin dashboard |
| **api** | 8001 | Strapi v4 + PostgreSQL | Headless CMS, custom API routes |

### www (Frontend)

- **Framework:** Next.js 14 (Pages Router), React 18, TypeScript
- **UI:** MUI v5, Emotion, Ant Design Icons, FullCalendar, Framer Motion, AOS
- **97 npm dependencies**
- **Public site pages:** Home, About, Contact, Classes, Dojo Locations, Holiday Camps, Blog
- **Admin pages:** Dashboard, Blog management, Classes, Contact forms, Pages, Settings
- **Logo:** SVG at `www/src/images/champions-logo-yellow-transparent.svg`
- **Images:** 103 source images + 179 public images

### api (Strapi Backend)

- **CMS:** Strapi v4.13.6 (headless)
- **Content types:** Blog, ContactForm, Page, ClassTiming, Profile, SiteSetting
- **API prefix:** `/cms` for all REST endpoints
- **Custom endpoints:** `/cms/profiles/me`, `/cms/profiles/change-password`
- **Lifecycle hooks:** Auto-create profile on user registration
- **Email:** strapi-plugin-email-designer for customizable templates
- **Auth:** users-permissions plugin

## Key Features

- **Class scheduling system:** Enum-based scheduling for multiple class types, age groups, 5 locations, 7 days
- **Admin dashboard:** MUI-themed SPA within Next.js using Redux for state management
- **Contact form with reCAPTCHA:** Google reCAPTCHA Enterprise verification
- **File upload:** AWS SDK S3 integration
- **RTL/LTR layout:** RTL support with `stylis-plugin-rtl`
- **i18n scaffold:** Configured with `en` locale, ready for expansion
- **ISR:** 10-second revalidation via `getStaticProps`

## Deployment

- **CI/CD:** Azure DevOps pipeline — auto-increments version, builds Docker images, deploys via `kubectl apply -k`
- **Kubernetes (Hetzner):** Namespace `champions-karate`, NodePort 31850 (api) / 31851 (www)
- **Nginx:** `www.champions-uae.com` → frontend, `api.champions.codaweb.co` → Strapi
- **Docker images:** `cdtroman/champions-karate-www`, `cdtroman/champions-karate-api`
- **Versioning:** Monotonically increasing integer (currently 189)
