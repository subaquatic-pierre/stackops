# ELE.MECH

## Overview

**ELE.MECH** is a corporate marketing website for a Dubai-based MEP (Mechanical, Electrical, Plumbing), ELV (Extra Low Voltage), and Interior Fit-Out solutions company. It serves as a digital brochure showcasing services, portfolio, team, and client testimonials, with a contact form for lead generation.

- **Version:** 29
- **Last Deployed:** Not specified
- **Repository:** CODATIVITY/elemech
- **Primary Tech:** Next.js 14, Tailwind CSS 3, AWS SES

## Architecture

```
┌──────────────────────┐
│  www (8000)          │
│  Next.js 14 (App)    │
│  Tailwind CSS 3      │
│  Static Data Files   │
└──────────────────────┘
```

**Single-service architecture.** No backend, no database, no CMS. All content is hardcoded in TypeScript/TSX static data files. A previous architecture (Sanity CMS + Prisma + PostgreSQL + NextAuth) exists in the `bak/` directory but has been stripped out.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 8000 | Next.js 14 + Tailwind 3 | Static corporate website |

### www (Frontend)

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS 3 with custom theme (primary: `#690101` red)
- **Key pages:** Home, About Us, Services (4 + 4 sub-services), Portfolio (13 projects), Contact, Docs
- **Logo:** `www/public/images/logo/elemech-logo.png` (color), `elemech-logo--w.png` (white)
- **Images:** Organized in subdirectories — about, brands, footer, hero, logo, portfolio, services, strengthening, team, testimonial
- **Portfolio gallery:** Yet Another React Lightbox for full-screen image browsing
- **Contact form:** AWS SES email to `ravi@elemech.ae`, Google reCAPTCHA v3 + Enterprise verification

### API Routes (2 total)

- `POST /api/contact` — Sends contact form email via AWS SES
- `POST /api/verify-captcha` — Verifies Google reCAPTCHA Enterprise tokens

## Key Features

- **Fully static content:** All services, portfolio, team, testimonials defined in `src/static-data/` as TypeScript arrays
- **Nested service pages:** MEP services have sub-services (Mechanical, Electrical & ELV, Plumbing, Fire & Life Safety) at `/services/mep/mechanical`, etc.
- **Portfolio gallery:** Project images via `require()`, lightbox gallery on detail pages
- **reCAPTCHA v3 + Enterprise:** Dual-layer CAPTCHA verification for contact form
- **Email via AWS SES:** Template-based HTML/text email generation
- **Elfsight widget:** Embedded social media widget
- **Legacy codebase:** `bak/` directory contains previous Sanity + Prisma + NextAuth architecture

## Deployment

- **CI/CD:** GitHub Actions on tag push — Docker build, GitOps repo update
- **Kubernetes (Hetzner):** Namespace `elemech`, NodePort 32200
- **Nginx:** `elemech.codaweb.co` (staging), `elemech.ae` (production)
- **Docker image:** `cdtroman/elemech-www`
- **Static asset caching:** Nginx caches `/_next/static` and image files

## Security Notes

⚠️ **Committed secrets:** `.env` files contain hardcoded AWS credentials (access key, secret key) and reCAPTCHA keys in the repository.
