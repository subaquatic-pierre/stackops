# Luke Stays

## Overview

**Luke Stays** is a full-scale short-term rental and property management platform — an online travel agency (OTA) combined with a landlord/partner portal. It allows guests to search and book serviced apartments across the UK and Dubai, partners to list properties, and Dubai real estate customers to browse properties.

- **Version:** 0.1.0 (package), deployed with version tags up to 62
- **Last Deployed:** Rolling via GitOps
- **Repository:** CODATIVITY/LukeStaysNextJS
- **Primary Tech:** Next.js 15, MUI v5, Azure Functions, WordPress (headless)

## Architecture

```
┌────────────────────────────────────────┐
│  www (8000)                            │
│  Next.js 15.5 (Pages Router)           │
│  MUI v5, i18n (EN/RU)                 │
│  143 components, 10 contexts           │
└──────────┬─────────────────────────────┘
           │ calls Azure Functions
           ▼
┌──────────────────────────────────────────┐
│  Azure Functions (lukestays2.azure...)   │
│  Proxies: Uplisting, Stripe, PriceLabs,  │
│  Superhog, Goyzer                        │
└──────────────────────────────────────────┘
           │                         │
           ▼                         ▼
┌────────────────┐    ┌──────────────────────┐
│  WordPress     │    │  ActiveCampaign      │
│  (blog data)   │    │  (CRM, email lists)  │
└────────────────┘    └──────────────────────┘
```

**Single Next.js service.** All backend logic delegated to Azure Functions (serverless proxy layer) which talks to Uplisting (PMS), Stripe, PriceLabs, Superhog, and Goyzer. WordPress serves blog content via GraphQL. No local database.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 8000 | Next.js 15.5 + MUI v5 | Public website (3 portals in one app) |

### www (Frontend)

- **Framework:** Next.js 15.5 (Pages Router), React 18, TypeScript
- **UI:** MUI v5 with custom theme, MUI X Pro, Emotion, SCSS
- **143 components, 10 context providers, 10 custom hooks, 24 type files**
- **Three portals in one app:**
  - **Guests** (`/guests`): Property search → booking funnel → payment → verification
  - **Partners** (`/partners`): Property management, franchise, academy
  - **Dubai Real Estate** (`/dubai-real-estate`): Property listing, search, buying/renting guides
- **Logo:** `www/src/static/brand/lukestays-logo.png`
- **Images:** 219 featured images in `/public/images/` — heroes, cities, properties, franchises
- **Internationalization:** `next-translate-plugin` — English + Russian, 173 component-level namespaces

### API & Data Flow

- **No Next.js API routes** — all backend through Azure Functions
- **Azure Functions endpoints:** GetUplistingData, GetProperties, GetCalendar, CreateBooking, CreatePaymentIntent, ProductPaymentHandler, SuperhogHandler, Goyzer
- **WordPress GraphQL:** Blog content direct from `blog.lukestays.com/graphql`
- **CRM:** ActiveCampaign with 40+ per-city contact tags and list management
- **File cache:** Disk-based cache for SSR/SSG performance (`cache/` directory)

## Key Features

- **Three-in-one portal:** Guests, Partners, and Dubai Real Estate — all in a single Next.js app with URL-path routing
- **Full booking funnel:** Multi-step pre-booking (city → date → details → season), property search with Google Maps, Stripe payment, Superhog guest verification
- **Dynamic pricing:** PriceLabs integration for real-time property pricing
- **CRM-driven marketing:** ActiveCampaign with abandoned cart recovery, booking confirmation lists, WiFi opt-in
- **Component-level i18n:** 173 translation namespaces auto-translated at build via Google Cloud Translate
- **Mixed rendering:** SSG for static pages, SSR for property detail pages
- **495-line redirect map:** Legacy URL migration from previous site structure
- **Internal Stripe testing tool:** `/property-test` page for payment validation
- **GitOps deployment:** GitHub Actions → Docker Hub → GitOps repo → ArgoCD

## Deployment

- **CI/CD:** GitHub Actions on tag push — builds Docker image, updates GitOps repo
- **Kubernetes (Hetzner):** Namespace `lukestays`, NodePort 31830
- **Docker image:** `cdtroman/lukestays`
- **CronJob:** Every 5 minutes `kubectl rollout restart` (commented out)
- **Alternative deploy:** Azure Static Web Apps (legacy), systemd service on VM
- **Config:** 495-line `staticwebapp.config.json` for Azure SWA redirects
