# OxideAuth

## Overview

**OxideAuth** is a custom-built authentication and authorization service that provides centralized auth for CODATIVITY's client applications. It handles user identity, JWT-based authentication, OAuth2 integration (Google), email delivery (AWS SES), and file storage (AWS S3).

- **Version:** 14
- **Last Deployed:** Rolling
- **Repository:** CODATIVITY/oxideauth
- **Primary Tech:** Rust (API), Next.js (Dashboard), PostgreSQL

## Architecture

```
┌──────────────────────┐
│  dashboard (8081)     │
│  Next.js (React)     │
│  Admin UI            │
└──────────┬───────────┘
           │ calls API
           ▼
┌──────────────────────┐     ┌──────────────┐
│  api (8080)          │────▶│ PostgreSQL   │
│  Rust backend        │     │  (external)  │
│  JWT, OAuth2, SES   │     └──────────────┘
└──────────────────────┘
```

**2 services** plus external PostgreSQL. Source code for `oxideauth-api/` and `oxideauth-dashboard/` are in separate repositories (gitignored from this repo). This repository contains only deployment configuration.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **oxideauth-api** | 8080 | Rust | Auth API server |
| **oxideauth-dashboard** | 8081 | Next.js (React) | Admin dashboard |

### oxideauth-api (Rust Backend)

- **Language:** Rust (evidenced by `RUST_LOG` config)
- **Features:**
  - JWT token issuance and validation (24-hour default expiry)
  - OAuth2 / Google social login (`/auth/oauth/google`)
  - Owner account seeding (`pierre@codativity.com`)
  - Service accounts for machine-to-machine auth
  - Email delivery via AWS SES (`oxideauth@nebuladev.io` / `projects@codativity.com`)
  - File storage via AWS S3
  - Database auto-migration (`DROP_TABLES` flag)
  - CORS whitelisting for dashboard origin

### oxideauth-dashboard

- **Framework:** Next.js / React
- **Purpose:** Administrative interface for managing auth configurations
- **Config:** `NEXT_PUBLIC_*` environment variables

## Key Features

- **Centralized auth:** Powers authentication for all CODATIVITY client apps (Booking Clinic, Maven, RAKNYE, etc.)
- **JWT-based:** Configurable secrets and token expiration
- **Google OAuth2:** Social login integration
- **Service accounts:** Machine-to-machine authentication for backend services
- **Production domain:** `oxideauth-api.codaweb.co` (API), `oxideauth.codaweb.co` (dashboard)
- **Multi-env:** Separate `.env` for local dev and `.env.prod` for production

## Deployment

- **Deploy flow:** `deploy.sh` reads version, updates `.version`, swaps env files, builds Docker images, pushes to DockerHub, applies K8s manifests
- **Kubernetes:** Kustomize-based, NodePorts 31880 (api) / 31881 (dashboard)
- **Docker images:** `cdtroman/oxideauth-api`, `cdtroman/oxideauth-dashboard`
- **External PostgreSQL:** Connection to `10.0.0.4:5432` (prod), `84.22.107.181:5432` (dev)
- **Nginx:** Reverse proxy with SSL termination on port 443

## Security Notes

⚠️ **Secrets in plaintext:** AWS access keys, JWT secrets, OAuth client secrets, database passwords, and Docker registry credentials are stored as plaintext in `env/` and `kubernetes/secrets.yaml`.

⚠️ **Immutable image pull:** `imagePullPolicy: IfNotPresent` — can lead to stale deployments if tags are reused.

⚠️ **External database:** PostgreSQL is not containerized within Kubernetes — hardcoded IPs in config.
