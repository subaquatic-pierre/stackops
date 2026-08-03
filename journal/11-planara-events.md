# Planara Events

## Overview

**Planara** is an all-in-one event management SaaS product built by CODATIVITY for event organizers in Dubai and Saudi Arabia. It provides customizable registration platforms supporting conferences, workshops, camps, and classes — with bilingual support, badge scanning, venue selection, and payment gateway integrations.

- **Version:** 4
- **Last Deployed:** 2026-07-23 (production)
- **Repository:** CODATIVITY/planara-events
- **Primary Tech:** Next.js 13, Strapi CMS (external), Mantine UI, styled-components

## Architecture

```
┌──────────────────────────┐
│  www (8000)              │
│  Next.js 13 (Pages)      │
│  Mantine v6, styled-comp │
│  SSG + ISR (10s)        │
└──────────┬───────────────┘
           │ REST API
           ▼
┌──────────────────────────┐
│  Strapi CMS (external)   │
│  api.codativity.codaweb. │
│  Blog + SEO content     │
└──────────────────────────┘
```

**Single-service frontend.** No backend or database in this repository. The forntend fetches all dynamic content from an external Strapi CMS. This is purely the public marketing website and blog.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 8000 | Next.js 13 + Mantine v6 | Public marketing site + blog |

### www (Frontend)

- **Framework:** Next.js 13 (Pages Router), styled-components, Mantine v6
- **Rendering:** SSG with ISR (10-second revalidation), standalone output
- **Key pages:** Home (12-section landing), Blog listing + post detail
- **Logo:** `www/src/common/assets/image/webAppMinimal/logo.svg` (color), `logo-white.svg` (white)
- **Homepage sections:** Banner, Dashboard screenshot, AnalyticsTool, HowItWorks, Pricing, FAQ, CTA, Client logos, Integrations, Testimonials, Community
- **Blog:** Fetches from Strapi CMS (`api.codativity.codaweb.co`), 9 posts per page with client-side pagination
- **SEO:** Dynamic meta tags from Strapi SEO fields, Open Graph, Twitter cards
- **Images:** 42 items — app screenshots, tech partner logos, background patterns

### Content Sources

- **Strapi CMS:** External headless CMS at `api.codativity.codaweb.co`
  - Blog posts, categories, authors, tags
  - SEO metadata per page
  - Global site settings
- **Static data:** Landing page content (features, pricing, FAQs, testimonials) defined in `www/src/common/data/WebAppMinimal/index.js`

### Key Features

- **Headless CMS integration:** Blog updates propagate instantly via 10-second ISR — no redeploy needed
- **Dual theme system:** Light/dark modes with color variants
- **Rich animation layer:** animate.css, react-awesome-reveal, react-parallax, react-countup, react-tsparticles (particle effects)
- **Component library:** 45 reusable UI primitives in `www/src/common/components/`
- **Firebase alternative:** Complete Firebase Functions + Hosting setup retained as secondary deployment path
- **SEO-optimized:** Dynamic sitemap, robots, JSON-LD structured data, per-page metadata
- **Middle East compliance:** DTCM API integration, Saudi Arabia cloud deployment, Arabic support

## Deployment

- **CI/CD:** GitHub Actions on tag push — Docker build, GitOps repo update
- **Kubernetes (Hetzner):** Namespace `planara-events`, NodePort 31980
- **Docker image:** `cdtroman/planara-events-www`
- **Production URL:** `https://planara.codaweb.co` (staging), `planara.events` (demo)
- **Non-root container:** Runs as `nextjs` user (UID 1001)
- **GitOps flow:** Image tag updates in `CODATIVITY/hetzner-cloud` trigger ArgoCD sync
