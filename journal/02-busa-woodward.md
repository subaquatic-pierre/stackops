# Busa Woodward

## Overview

**Busa Woodward** is a corporate website for an "Experience Engineering" firm based in Dubai, UAE. They operate at the intersection of strategy, design, and identity — working on mega-events, cultural districts, urban developments, and destination-building projects.

- **Version:** 1.2.8
- **Last Deployed:** 2026-07-23 (production)
- **Repository:** CODATIVITY/busa-woodward
- **Primary Tech:** Next.js 16, Directus CMS, Tailwind CSS 4, PostgreSQL

## Architecture

```
┌──────────────────────┐
│  www (4000)          │
│  Next.js 16 (App)    │
│  Tailwind CSS 4      │
│  @directus/sdk       │
└──────────┬───────────┘
           │ reads content
           ▼
┌──────────────────────┐     ┌──────────────┐
│  directus (5000)     │────▶│ PostgreSQL 16│
│  Directus 11.17.3    │     │  (directus)  │
│  Headless CMS        │     └──────────────┘
└──────────────────────┘
```

**3 services:** Next.js frontend, Directus CMS, PostgreSQL database. No separate API — the frontend talks directly to Directus via its SDK.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 4000 | Next.js 16 + Tailwind 4 | Public-facing corporate website |
| **directus** | 5000 | Directus 11.17.3 | Headless CMS for all content |

### www (Frontend)

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4, custom purple theme (`#8a39df`)
- **Fonts:** 58 self-hosted OTF files (Aktiv Grotesk, Gestura Display/Headline/Text)
- **Key pages:** Home, Studio, Labs, Story, People, Projects, Insights, Expos, Gallery, Contact
- **Logo:** `/www/public/images/logo.svg` — purple "BUSA WOODWARD" wordmark
- **Key components:** HeroCarousel (Embla), HomeLanguageSection (typewriter), FAQ accordion, testimonials slider

### Backend / CMS

- **CMS:** Directus 11.17.3 — headless, manages all content
- **Schema:** 28 collections including: page, project, article, team, Header, Footer, GlobalSettings, blocks (hero, section, slider, FAQ, testimonial), SEO
- **Next.js API routes:** 3 minimal routes — `/api/contact` (AWS SES), `/api/revalidate` (ISR), `/api/cache-buster`
- **Email:** AWS SES for contact form
- **Storage:** Hetzner S3 bucket (`busa-woodward`), CDN via Bunny CDN (`cdt-busa-woodward.b-cdn.net`)

## Key Features

- **Fully CMS-driven:** All pages render dynamic content blocks from Directus — no hardcoded content
- **Complex hero carousel:** Multi-category carousel with sidebar tabs, color-coded states, Embla autoplay
- **ISR with webhook revalidation:** Directus triggers Next.js revalidation on content changes
- **WordPress migration:** Extensive redirect map in `next.config.ts` for old WordPress URLs
- **SEO:** Dynamic sitemap, robots, per-page metadata from CMS, OpenGraph images
- **GitOps deployment:** GitHub Actions → Docker Hub → separate GitOps repo → ArgoCD sync

## Deployment

- **CI/CD:** GitHub Actions on tag push — builds Docker image, updates GitOps repo
- **Kubernetes (Hetzner):** Namespace `busa-woodward`
- **Domains:** Production `busawoodward.com`, staging `busa-woodward.codaweb.co`
- **Nginx routes:** cms.busawoodward.com → Directus admin
