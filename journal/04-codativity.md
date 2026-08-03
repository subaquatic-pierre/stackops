# Codativity

## Overview

**Codativity** is the corporate website for CODATIVITY Software Solutions — a Dubai-based software development agency. The site showcases services (business software, modernization, web apps, product development), products (CodaExpo), solutions (CodaPay, CodaWeb), portfolio case studies, and a blog.

- **Version:** 65
- **Last Deployed:** 2026-07-20 (production)
- **Repository:** CODATIVITY/codativity
- **Primary Tech:** Next.js 15, Strapi CMS, MUI v5, PostgreSQL

## Architecture

```
┌──────────────────────┐
│  www (3000)          │
│  Next.js 15          │
│  MUI v5, Framer Motion│
└──────────┬───────────┘
           │ REST API
           ▼
┌──────────────────────┐     ┌──────────────┐
│  api (1337)          │────▶│ PostgreSQL 13│
│  Strapi v4.5.4       │     │  (strapi)    │
│  Headless CMS        │     └──────────────┘
└──────────────────────┘
```

**3 services:** Next.js 15 frontend, Strapi CMS, PostgreSQL 13. Optional Nginx reverse proxy.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 3000 | Next.js 15 + MUI v5 | Public corporate website |
| **api** | 1337 | Strapi v4.5.4 | Headless CMS |

### www (Frontend)

- **Framework:** Next.js 15 (Pages Router), TypeScript
- **UI:** MUI v5, Emotion, Framer Motion, AOS, Swiper, React Slick
- **Key pages:** Home, About, Contact, Our Work, Blog, Case Studies, Services (4), Solutions (2), Products (CodaExpo), Careers, Privacy Policy
- **Logo:** Sourced dynamically from Strapi's global site settings
- **Rendering:** SSG with ISR (10-second revalidation)
- **SEO:** Shared SEO component reused across content types, dynamic sitemap

### api (Strapi Backend)

- **CMS:** Strapi v4.5.4
- **Content types:** GlobalSite (single), Page (i18n), Project, Post, Category (i18n), Testimonial, Tag
- **Shared components:** SEO, media, approach, challenge, solution, overview-item, results-benefits, quote, slider
- **Rich project pages:** Multi-section case study pages (approach, challenge, solution, challenges overview, benefits, results)
- **Contact form:** Nodemailer + SendGrid SMTP via Next.js API route

## Key Features

- **Headless CMS architecture:** All content managed through Strapi, served via REST to statically-generated Next.js
- **Rich case study system:** Structured project detail pages with approach, challenge, solution, results sections
- **CodaExpo product page:** Full landing page with hero, features, FAQ, custom footer — standalone micro-site
- **CodaPay solution page:** Specialized landing page with custom components
- **Dual GitOps pipeline:** Both Azure DevOps and GitHub Actions pipelines available
- **i18n ready:** Category and Page content types support internationalization
- **GDPR compliance:** Cookie consent banner included

## Deployment

- **CI/CD:** Azure DevOps or GitHub Actions — auto-increments version, builds Docker images
- **Kubernetes (Hetzner):** Namespace `codativity`, NodePort 31810 (www) / 31811 (api)
- **Docker images:** `cdtroman/codativity-www`, `cdtroman/codativity-api`
- **Domains:** `codativity.com` / `www.codativity.com`
- **GitOps:** Separate repo `CODATIVITY/hetzner-cloud` for K8s manifests
