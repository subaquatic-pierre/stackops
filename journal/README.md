# Codativity Projects — Project Journal

> Generated: 2026-08-03 | 14 projects documented

A comprehensive journal of all CODATIVITY client and infrastucture projects, documenting architecture, technology stacks, applications, key features, and deployment approaches.

---

## Projects Index

| # | Project | Type | Stack | Version | Journal |
|---|---------|------|-------|---------|---------|
| 1 | **Booking Clinic** | SaaS — Multi-tenant booking/CRM | Next.js 16, Express 5, Rust, PostgreSQL, Redis | 0.1.11 | [01-booking-clinic.md](./01-booking-clinic.md) |
| 2 | **Busa Woodward** | Corporate website | Next.js 16, Directus CMS, Tailwind 4, PostgreSQL | 1.2.8 | [02-busa-woodward.md](./02-busa-woodward.md) |
| 3 | **Champions Karate** | Academy website + admin | Next.js 14, Strapi CMS, MUI v5, PostgreSQL | 189 | [03-champions-karate.md](./03-champions-karate.md) |
| 4 | **Codativity** | Agency corporate website | Next.js 15, Strapi CMS, MUI v5, PostgreSQL | 65 | [04-codativity.md](./04-codativity.md) |
| 5 | **ELE.MECH** | Corporate brochure site | Next.js 14, Tailwind 3, AWS SES | 29 | [05-elemech.md](./05-elemech.md) |
| 6 | **Event App Demo** | Event management platform | Next.js 13, Strapi CMS, MUI v5, PostgreSQL | 34 | [06-event-app-demo.md](./06-event-app-demo.md) |
| 7 | **Hetzner Cloud** | Infrastructure monorepo | Terraform, Ansible, ArgoCD, K8s, Nginx | — | [07-hetzner-cloud.md](./07-hetzner-cloud.md) |
| 8 | **Luke Stays** | Rental/property platform | Next.js 15, Azure Functions, MUI v5, WordPress | 62 | [08-lukestays.md](./08-lukestays.md) |
| 9 | **Maven Platform** | BOQ management (construction) | Next.js 15, Express 4, .NET 8, PostgreSQL | 1.13.12 | [09-maven-platform.md](./09-maven-platform.md) |
| 10 | **OxideAuth** | Centralized auth service | Rust, Next.js, PostgreSQL | 14 | [10-oxideauth.md](./10-oxideauth.md) |
| 11 | **Planara Events** | Event management SaaS site | Next.js 13, Strapi CMS, Mantine v6 | 4 | [11-planara-events.md](./11-planara-events.md) |
| 12 | **RAK NYE (CarPass)** | Parking/access management | Next.js 16, Express, .NET 8, MongoDB, Python | 239 | [12-raknye-carpass.md](./12-raknye-carpass.md) |
| 13 | **Sera Villas** | Luxury villa booking | Next.js 15, Directus CMS, Tailwind 4, Stripe, PostgreSQL | 1.1.2 | [13-sera-villas.md](./13-sera-villas.md) |
| 14 | **The Craft Safari** | E-commerce storefront | Next.js 15, WooCommerce, Bootstrap 5, Geidea | 314 | [14-tcs-craft-safari.md](./14-tcs-craft-safari.md) |

---

## Cross-Cutting Patterns

### Common Architectural Patterns

| Pattern | Projects | Description |
|---------|----------|-------------|
| **www + api split** | Booking Clinic, Champions Karate, Codativity, Event App Demo, Maven, RAK NYE | Separate frontend and backend API containers |
| **www-only (no local backend)** | ELE.MECH, Luke Stays, Planara, Sera Villas, TCS | Single Next.js app with external APIs/CMS |
| **Headless CMS** | Busa Woodward (Directus), Champions Karate (Strapi), Codativity (Strapi), Event App Demo (Strapi), Luke Stays (WordPress), Planara (Strapi), Sera Villas (Directus), TCS (WordPress/WooCommerce) | Decoupled content management |
| **OxideAuth integration** | Booking Clinic, Maven, RAK NYE | Centralized single sign-on and RBAC |
| **Polyglot microservices** | Booking Clinic (Rust email), Maven (.NET exporter), RAK NYE (.NET ANPR, Python ETL) | Specialized services in different languages |

### Common Infrastructure

| Component | Details |
|-----------|---------|
| **Hosting** | Hetzner Cloud (VMs + Kubernetes) |
| **Container Registry** | Docker Hub (`cdtroman/*`) |
| **Orchestration** | Kubernetes (kubeadm) with Kustomize overlays |
| **GitOps** | ArgoCD (primary), manual `kubectl apply` (legacy) |
| **Reverse Proxy** | Nginx on `cdt-control` with Let's Encrypt SSL |
| **CI/CD** | GitHub Actions (GitOps), Azure DevOps (legacy) |
| **Database Server** | Central `cdt-db` (PostgreSQL, MongoDB, MySQL) |
| **Object Storage** | Hetzner S3-compatible, Azure Blob Storage |
| **CDN** | Bunny CDN (`cdt-*.b-cdn.net`) |
| **Email** | AWS SES (primary), SendGrid (secondary) |
| **Payments** | Stripe (primary), Geidea (UAE-specific) |
| **Monitoring** | Prometheus/Grafana (commented out, planned) |

---

## Tech Stack Distribution

### Frontend Frameworks

- **Next.js:** All 14 projects (versions 13 through 16, both Pages and App Router)
- **UI Libraries:** MUI v5/v7 (7 projects), Tailwind CSS (4 projects), Bootstrap 5 (1 project), Mantine v6 (1 project), styled-components (1 project)

### Backend Languages

- **Node.js/TypeScript (Express.js):** Booking Clinic, Maven, RAK NYE
- **Rust:** Booking Clinic (email), OxideAuth (API)
- **.NET 8/C#:** Maven (BOQ Exporter), RAK NYE (ANPR Service)
- **Python:** RAK NYE (ETL)
- **Headless CMS:** Strapi v4, Directus 11, WordPress/WooCommerce

### Databases

- **PostgreSQL:** 10 projects (primary relational DB)
- **MongoDB:** 1 project (RAK NYE — scans, car passes, hotels)
- **Redis:** 1 project (Booking Clinic — caching, pub/sub)
- **No local DB:** 3 projects (Luke Stays, Planara, TCS — data in external services)

---

## Notes

- All journals were generated by deep-dive exploration of each project repository on 2026-08-03.
- Version numbers and deployment dates reflect the state at the time of exploration.
- Some `.env` files contain hardcoded credentials — a known security concern across several projects.
- The `hetzner-cloud` project is the central infrastructure repository managing all deployments.
