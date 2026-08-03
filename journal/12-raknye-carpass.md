# RAK NYE (CarPass)

## Overview

**RAK NYE (CarPass)** is a comprehensive parking and access management system for the Ras Al Khaimah New Year's Eve celebration on Al Marjan Island, UAE. It manages vehicle registration, car pass issuance, ANPR camera integration, barcode/QR access control, hotel quota management, and live parking statistics.

- **Version:** 239
- **Last Deployed:** Rolling
- **Repository:** CODATIVITY/raknye2025-apps
- **Primary Tech:** Next.js 16, Express.js, .NET 8, MongoDB, Python

## Architecture

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│www (8005)│  │dashboard │  │api (8001)│  │anpr(7000)│
│Next.js 16│  │ (8000)   │  │Express   │  │.NET 8    │
│Public    │  │Next.js 16│  │Mongoose  │  │MinimalAPI│
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     └────────┬────┴──────┬──────┴──────┬──────┘
              │           │             │
       ┌──────┴───────────┴─────────────┴──────┐
       │         MongoDB                       │
       │  raknye2025 / raknye2026              │
       └───────────────────────────────────────┘
              │
       ┌──────┴──────┐
       │  ETL (Python)│  Batch data pipeline
       └─────────────┘
```

**5 services:** Public website (Next.js), Admin dashboard (Next.js), REST API (Express/Mongoose), ANPR service (.NET 8), ETL pipeline (Python). MongoDB for data. External OxideAuth for authentication.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 8005 | Next.js 16 + MUI v7 | Public registration + info site (AR/EN) |
| **dashboard** | 8000 | Next.js 16 + MUI v7 + ApexCharts | Admin panel with RBAC |
| **api** | 8001 | Express.js + Mongoose | REST API backend |
| **anpr-service** | 7000 | .NET 8 C# Minimal API | ANPR camera integration |
| **etl** | — | Python 3 + PyMongo | Data extraction/transformation pipeline |

### www (Public Site)

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **UI:** MUI v7 + Ant Design icons + Redux Toolkit
- **i18n:** `react-intl` / `next-international` (English + Arabic, RTL support)
- **Key pages:** Home, Car Pass registration, Update CarPass, Parking registration, Marjan Island access, Celebration guide (with PDFs), Visitor survey, Live parking updates, Public display screen
- **Logo:** Multiple variants — `raknye-logo-2025.svg`, `raknye-logo-en.png`, `raknye-logo-ar.png`
- **Font:** AbuDhabiMedia

### dashboard (Admin Panel)

- **Roles:** Admin, Hotel, Stats — role-based views
- **Key features:** Car pass management, Hotel/quota management, Live parking stats (ApexCharts), Scan log viewer, Barcode/QR scanner (desktop + mobile), Token management
- **Puck CMS:** `@measured/puck` drag-and-drop page builder

### api (Backend)

- **Framework:** Express.js, TypeScript, SWC
- **ODM:** Mongoose (MongoDB)
- **Auth:** OxideAuth with permission-based RBAC
- **Routes:** Hotels, Car Passes, Car Pass Tokens, Scan Logs, Barcode generation, Emails (AWS SES), Statistics, Screen data, Survey, Uploads (Azure Blob / Hetzner S3)
- **Collections:** carp passes, carpasstokens, hotels, scanlogs, scans, surveys, messages, exceptionslog, statistics, cameras

### anpr-service (.NET 8)

- **Purpose:** ANPR camera integration with Hikvision iDS-TCM403-B cameras
- **Endpoints:** `/scan`, `/universal-intake` (XML/JSON parsing), `/register-plate` (camera allow list), `/handle-incoming-message` (WhatsApp webhook), `/message-delivery-callback` (SMS fallback), `/SendSMS`
- **Traffic flow logic:** Marjan1 entry duplicates as Yanas exit; Marjan2 duplicates as Dhayah exit
- **WhatsApp:** Twilio with SMS fallback for undelivered messages

### etl (Python)

- **Purpose:** Batch ETL pipeline from `raknye2025.scans` → `raknye2026.scanEvents`
- **Parsers:** XML (Hikvision), JSON, BSON, Gate — with configurable batch size (default 500)
- **Hotels script:** `hotels.py` for bulk CSV import of hotel accounts

## Key Features

- **ANPR camera integration:** Direct Hikvision camera integration with real-time plate registration
- **Multi-format scan parsing:** XML, JSON, BSON, multipart/form-data with robust fallback
- **10 parking locations:** Jais, Yanas, Dhayah, Mega, Marjan1-4, VIP1, VIP2
- **Traffic flow balancing:** Duplicate scan events across related locations for accurate counts
- **WhatsApp + SMS:** Twilio templated messages with automatic SMS fallback
- **Hotel quota system:** per-hotel quotas for guest vehicle passes
- **Barcode/QR entry:** PDF certificates with embedded QR codes for access passes
- **Live parking stats:** Real-time occupancy dashboard with ApexCharts and count-up animations
- **Mobile scanner:** HTML5 QR scanner for entry/exit checkpoints
- **Database migration:** Separate databases (`raknye2025` → `raknye2026`) with ETL
- **Multi-language:** Full Arabic/English bilingual site with separate logos per language

## Deployment

- **CI/CD:** Azure DevOps pipeline — auto-increments version, builds Docker images for www, dashboard, api
- **Kubernetes (Hetzner):** Namespace `carpass`, NodePorts: api 31700, dashboard 31701, www 31703, anpr 31704
- **Docker images:** `cdtroman/carpass-www`, `carpass-dashboard`, `carpass-api`, `carpass-anpr`
- **Nginx:** SSL termination, routes to `carpass.codaweb.co` (dashboard) and `carpass-api.codaweb.co` (API)
- **MongoDB:** External instance at `5.75.210.118`
- **Storage:** 5Gi persistent volume at `/data/carpass/uploads`
