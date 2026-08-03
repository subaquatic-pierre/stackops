# The Craft Safari (TCS / next-commerce)

## Overview

**The Craft Safari** (repository: `next-commerce` / `tcs`) is a production e-commerce storefront for an online store selling Indian handcrafted goods and artisan products. It uses a headless WordPress + WooCommerce backend with a Next.js 15 frontend that owns all rendering. Payments are processed through Geidea (UAE, AED currency).

- **Version:** 314
- **Last Deployed:** 2026-07-23 (production)
- **Repository:** CODATIVITY/next-commerce (tcs)
- **Primary Tech:** Next.js 15, Bootstrap 5, WooCommerce, WordPress (headless), Geidea

## Architecture

```
┌──────────────────────────────────────────┐
│  www (8005)                              │
│  Next.js 15 (App Router)                 │
│  Bootstrap 5 + SCSS                      │
│  TanStack Query, Three-Layer Caching     │
└──────────┬───────────────────────────────┘
           │ /api/wc (secure proxy)
           │ /wp-json/wp/v2/ (direct)
           ▼
┌──────────────────────────────────────────┐
│  WordPress + WooCommerce (external)       │
│  admin.thecraftsafari.shop               │
│  Products, Orders, Blog, Custom Posts    │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│  Bunny CDN                │
│  cdt-tcs.b-cdn.net       │
│  Media offloading         │
└──────────────────────────┘
```

**Single Next.js service** with external WordPress/WooCommerce backend. Secure WooCommerce proxy keeps credentials server-side. Bunny CDN for media delivery. No database managed in this repo.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 8005 | Next.js 15 + Bootstrap 5 | E-commerce storefront |

### www (Frontend)

- **Framework:** Next.js 15.3.8 (App Router), React 19, TypeScript (`strict: false`)
- **Styling:** Bootstrap 5 + SCSS (NOT Tailwind), page-local `*.module.scss`
- **Key dependencies:** `@woocommerce/woocommerce-rest-api`, TanStack Query, Axios, PhotoSwipe, Swiper, Fuse.js, `@google/model-viewer` (3D)
- **Key pages:** Home (hero, categories, products, banner, social), Shop (with filters), Category, Product detail, Blog, Travel Diaries, About, Contact, Indian Crafts, Craft Tours, Art Atelier, Events, Checkout, Payment, My Account (orders, addresses, wishlist, profile), Cart
- **Logo:** `www/public/images/logo/logo.svg`, `logo.png`, `logo.pdf`
- **Images:** 17 subdirectories — about, collections, products, shop, slider, crafts, workshops, home
- **15 modals:** AskQuestion, ColorCompare, Login, MobileMenu, ProductSidebar, QuickAdd, QuickView, Register, ResetPass, ShareModal, ShopCart, ToolbarBottom, SearchModal, AttributeModal, ProductCategoryModal

### WooCommerce Proxy (`/api/wc`)

- **Secure proxy:** All WooCommerce calls go through a single Next.js API route
- **Allowlist:** `utils/proxy.ts` — `isPublicEndpoint()` (GET products, categories, tags) and `isAuthorizedEndpoint()` (orders, customers, coupons)
- **No credentials in browser:** `WC_CONSUMER_KEY`/`WC_CONSUMER_SECRET` remain server-side only
- **Guest order carve-outs:** Handles anonymous checkout flows

### Payment & Email

- **Geidea:** UAE payment gateway — client-side SDK + server-side payment intent creation
- **AWS SES:** Transactional email delivery
- **JWT auth:** WordPress JWT plugin (`/wp-json/jwt-auth/v1/token`), auto-login for public viewers

### Caching Architecture

1. **Next.js ISR:** `revalidate = 600` (10 minutes), `generateStaticParams()` pre-builds categories and products
2. **In-memory server cache:** 5-minute TTL for products/categories with `setInterval` sweeper
3. **TanStack Query:** 5-second `staleTime` on client side

## Key Features

- **Headless WooCommerce with secure proxy:** WC credentials never reach the browser — all calls funnel through allowlisted proxy
- **Three-layer caching:** ISR (10min), server memory (5min), TanStack Query (5s) — tiered approach
- **Custom post types:** Beyond WooCommerce — `home-banner`, `home-promotion`, `craft-tour`, `event`, `workshops`
- **Bunny CDN media offloading:** Custom WordPress PHP plugin rewrites attachment URLs to CDN
- **Geidea payment integration:** UAE-specific payment gateway with card + digital wallet support
- **3D model viewer:** `@google/model-viewer` for product visualization
- **Bootstrap 5 + SCSS:** Custom SCSS framework, not Tailwind — extensive global styles in `public/scss/main.scss`
- **Yoast SEO:** WordPress SEO metadata consumed via `yoast_head_json` for Next.js `generateMetadata()`
- **Dynamic sitemap:** Fetches all products, categories, and blogs from WC/WP at build time
- **Zoho CRM:** Newsletter subscription integration
- **Google Analytics + Meta Pixel:** Analytics via custom utility modules
- **Cookie consent:** Banner component included

## Deployment

- **CI/CD:** Manual deploy via `deploy.sh {version} {remote-host}`
- **Kubernetes (Hetzner):** Namespace `next-commerce`, NodePort 32701
- **Docker image:** `cdtroman/next-commerce-www`
- **WordPress:** Externally hosted at `admin.thecraftsafari.shop` (not containerized)
- **Non-root container:** Runs as `nextjs` user (UID 1001)
- **Versioning:** Integer versioning (currently 314)
- **Domain:** `beta.thecraftsafari.shop` (staging/testing)
