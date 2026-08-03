# Sera Villas

## Overview

**Sera Villas** is a luxury vacation rental marketing website and booking platform for high-end villas in Mallorca, Spain. The brand manages four properties (Villa Escondido, Villa Lumina, Villa Vertice, Villa Terra) with full booking functionality including availability checking, Stripe payments, and automated confirmation emails.

- **Version:** 1.1.2
- **Last Deployed:** 2026-07-10 (production)
- **Repository:** CODATIVITY/sera-villas
- **Primary Tech:** Next.js 15, Directus CMS, Tailwind CSS 4, Stripe, PostgreSQL

## Architecture

```
┌──────────────────────┐
│  www (4000)          │
│  Next.js 15.5 (App)  │
│  Tailwind 4, shadcn  │
│  Stripe, Uplisting   │
└──────────┬───────────┘
           │ reads content
           ▼
┌──────────────────────┐     ┌──────────────┐
│  directus (5000)     │────▶│ PostgreSQL 16│
│  Directus 11.17.3    │     │ sera_villas_ │
│  Headless CMS        │     │ db           │
└──────────────────────┘     └──────────────┘
           │
           ▼
┌──────────────────────┐
│  External Services:   │
│  Uplisting (PMS)     │
│  Stripe (payments)    │
│  AWS SES (email)     │
│  Hetzner S3 (storage) │
│  Bunny CDN           │
└──────────────────────┘
```

**3 services:** Next.js frontend, Directus CMS, PostgreSQL. External integrations with Uplisting PMS, Stripe, AWS SES, and Hetzner S3.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 4000 | Next.js 15 + Tailwind 4 + shadcn/ui | Public luxury villa website + booking |
| **directus** | 5000 | Directus 11.17.3 | Headless CMS |

### www (Frontend)

- **Framework:** Next.js 15.5.5 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4 with shadcn/ui (New York style, Neutral base)
- **Key libraries:** Motion (animations), Embla Carousel, Lucide React, React Hook Form + Zod, Stripe, next-safe-action
- **Key pages:** Home (hero, villa listing, testimonials, blog, Instagram), Villas listing + detail, Blog, About Us, Booking (multi-step flow), Booking confirmation, Privacy/Cookie/Terms pages
- **Logo:** `/public/assets/logo.svg` (icon-only), `/public/assets/logo-text.svg` (icon + text)
- **Images:** Hero (`hero.jpg`), villa photos, map, room photos, OG images, 19 tech partner logos
- **Components:** 60+ blocks — HomeHero, VillaListSection, VillaGallerySection, VillaFeaturesSection, BookingPanel, PaymentForm, BlogSection, TestimonialSection, FAQ, ContactSection, etc.
- **Context providers:** 9 total — booking, villa, theme, notification, modal, reveal, script, viewport

### Directus CMS

- **Version:** 11.17.3
- **Collections:** blog (posts), page (CMS pages), seo (metadata)
- **Relations:** Directus users (authors), Directus files (featured images)
- **SDK:** `@directus/sdk` v21.2.2 for content fetching

### Third-Party Integrations

- **Uplisting (PMS):** Property details, availability, calendars, pricing (cleaning fees, extra guests, weekly/monthly discounts), channel commissions
- **Stripe:** Full payment flow — customer creation, payment intents, checkout sessions, refunds
- **AWS SES:** Transactional emails (booking confirmation, contact form)
- **Hetzner S3:** Object storage for CMS uploads, Bunny CDN for delivery at `cdt-sera-villas.b-cdn.net`

## Key Features

- **Full booking engine:** Multi-step flow with guest details, Stripe payment, confirmation emails
- **Uplisting proxy:** API calls proxied through Next.js server — hides credentials, avoids CORS
- **Dynamic pricing:** Cleaning fees, extra guest charges, taxes, weekly (5%) and monthly (10%) discounts
- **Availability calendars:** Normalized calendar data from Uplisting
- **Multi-channel commissions:** Tracks Airbnb (18.34%), Booking.com (15%), HomeAway (8%), Google (6%), Direct (0%)
- **SEO:** Dynamic sitemap, per-page metadata, OpenGraph images, robots.txt, structured data
- **GitOps deployment:** GitHub Actions → Docker Hub → GitOps repo → ArgoCD sync
- **CDN delivery:** Bunny CDN for static assets, CloudFront for Uplisting property photos
- **Concierge mentions:** All properties advertise premium services (private chefs, airport transfers, grocery pre-stocking, etc.)

## Deployment

- **CI/CD:** GitHub Actions on tag push — builds Docker image, updates GitOps repo
- **Kubernetes (Hetzner):** Namespace `sera-villas`, NodePorts 32500 (www) / 32501 (cms)
- **Docker image:** `cdtroman/sera-villas-www`
- **Domains:** `seravillas.com` (production), `sera-villas.codaweb.co` (staging)
- **Deploy script:** `deploy.sh {version} {local|production}` with `--dry-run` support
- **Database:** External PostgreSQL at `10.0.0.4:5432`, database `sera_villas_db`
