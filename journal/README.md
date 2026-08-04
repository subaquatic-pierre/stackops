# Codativity Projects — Project Journal

> 17 entries | 14 client/infrastructure projects + 3 labs/tools

A comprehensive journal of all CODATIVITY client and infrastructure projects, documenting architecture, technology stacks, service components, key features, and deployment approaches. Entries are rendered as Docusaurus blog posts at `/journal`.

---

## Projects Index

| Project | Type | Primary Technologies |
|---------|------|---------------------|
| **Booking Clinic** | SaaS — Multi-tenant booking/CRM | Next.js, Express, Rust, PostgreSQL, Redis |
| **Busa Woodward** | Corporate website | Next.js, Directus CMS, Tailwind CSS, PostgreSQL |
| **Champions Karate** | Academy website + admin | Next.js, Strapi CMS, MUI, PostgreSQL |
| **Codativity** | Agency corporate website | Next.js, Strapi CMS, MUI, PostgreSQL |
| **ELE.MECH** | Corporate brochure site | Next.js, Tailwind CSS, AWS SES |
| **Event App Demo** | Event management platform | Next.js, Strapi CMS, MUI, PostgreSQL |
| **Hetzner Cloud** | Infrastructure monorepo | Terraform, Ansible, ArgoCD, Kubernetes, Nginx |
| **Luke Stays** | Rental/property platform | Next.js, Azure Functions, MUI, WordPress |
| **Maven Platform** | BOQ management (construction) | Next.js, Express, .NET, PostgreSQL |
| **OxideAuth** | Centralized auth service | Rust, Next.js, PostgreSQL |
| **Planara Events** | Event SaaS marketing site | Next.js, Strapi CMS, Mantine |
| **RAK NYE (CarPass)** | Parking/access management | Next.js, Express, .NET, MongoDB, Python |
| **Sera Villas** | Luxury villa booking | Next.js, Directus CMS, Tailwind CSS, Stripe, PostgreSQL |
| **The Craft Safari** | E-commerce storefront | Next.js, WooCommerce, Bootstrap, Geidea |

---

## Cross-Cutting Patterns

### Common Architectural Patterns

| Pattern | Projects | Description |
|---------|----------|-------------|
| **www + api split** | Booking Clinic, Champions Karate, Codativity, Event App Demo, Maven, RAK NYE | Separate frontend and backend API containers |
| **www-only (no local backend)** | ELE.MECH, Luke Stays, Planara, Sera Villas, TCS | Single Next.js app with external APIs/CMS |
| **Headless CMS** | Busa Woodward (Directus), Champions Karate (Strapi), Codativity (Strapi), Event App Demo (Strapi), Luke Stays (WordPress), Planara (Strapi), Sera Villas (Directus), TCS (WooCommerce) | Decoupled content management |
| **OxideAuth integration** | Booking Clinic, Maven, RAK NYE | Centralized single sign-on and RBAC |
| **Polyglot microservices** | Booking Clinic (Rust email), Maven (.NET exporter), RAK NYE (.NET ANPR, Python ETL) | Specialized services in different languages |

### Common Infrastructure

| Component | Details |
|-----------|---------|
| **Hosting** | Hetzner Cloud (VMs + Kubernetes) |
| **Orchestration** | Kubernetes (kubeadm) with Kustomize overlays |
| **GitOps** | ArgoCD with ApplicationSet auto-discovery |
| **Reverse Proxy** | Nginx with Let's Encrypt SSL |
| **CI/CD** | GitHub Actions (GitOps), Azure DevOps (legacy) |
| **Database Server** | Central `cdt-db` (PostgreSQL, MongoDB, MySQL) |
| **Object Storage** | Hetzner S3-compatible, Azure Blob Storage |
| **CDN** | Bunny CDN |
| **Email** | AWS SES (primary), SendGrid (secondary) |
| **Payments** | Stripe (primary), Geidea (UAE-specific) |

---

## Tech Stack Distribution

### Frontend

- **Next.js:** All 14 projects (Pages and App Router)
- **UI Libraries:** MUI (7 projects), Tailwind CSS (4), Bootstrap (1), Mantine (1), styled-components (1)

### Backend Languages

- **Node.js/TypeScript (Express.js):** Booking Clinic, Maven, RAK NYE
- **Rust:** Booking Clinic (email), OxideAuth (API)
- **.NET/C#:** Maven (BOQ Exporter), RAK NYE (ANPR Service)
- **Python:** RAK NYE (ETL)
- **Headless CMS:** Strapi, Directus, WordPress/WooCommerce

### Databases

- **PostgreSQL:** 10 projects (primary relational DB)
- **MongoDB:** 1 project (RAK NYE)
- **Redis:** 1 project (Booking Clinic — caching, pub/sub)
- **No local DB:** 3 projects (Luke Stays, Planara, TCS — data in external services)

---

## Labs & Tools

Additional journal entries covering infrastructure tooling and experiments:

| Entry | Type | Technologies |
|-------|------|-------------|
| **Multi-Strategy Deploy Pipeline** | DevOps tooling | Bash, Docker, Kubernetes, systemd |
| **Raderbot — Rust Trading Bot** | Experimental | Rust, Actix Web, WebSocket, Binance/BingX APIs |
| **Terraform Labs** | Infrastructure labs | Terraform, AWS (EC2, EKS, S3, Lambda, ECS) |
