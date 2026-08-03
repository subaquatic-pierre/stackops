# Event App Demo (Event Hoster)

## Overview

**Event Hoster** is a full-stack event management platform designed for conference organizers. It supports multi-day events with speakers, agendas, attendee registration, ticket generation, QR code check-in, certificates, messaging, feedback collection, and a public-facing marketing website. The demo was built for a 3-day RAK conference (Oct 30 – Nov 1, 2023).

- **Version:** 34
- **Last Deployed:** Not specified
- **Repository:** CODATIVITY/event-app-demo
- **Primary Tech:** Next.js 13, Strapi CMS, MUI v5, Ant Design

## Architecture

```
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│ www (3000)  │  │dashboard(4000)│  │  api (5000)  │
│ Next.js 13  │  │ Next.js 13   │  │ Strapi 4.13  │
│ Public site │  │ Admin/user   │  │ Headless CMS │
└──────┬──────┘  └──────┬───────┘  └──────┬───────┘
       │                │                 │
       └────────────────┴─────────┬───────┘
                                  │
                          ┌───────┴───────┐
                          │  PostgreSQL   │
                          │ event_app_demo│
                          └───────────────┘
```

**4 services:** Public website, Admin dashboard, Strapi API, PostgreSQL. Dev mail catcher included.

## Applications

| App | Port | Framework | Purpose |
|-----|------|-----------|---------|
| **www** | 3000 | Next.js 13 + MUI v5 | Public event website (bilingual EN/AR) |
| **dashboard** | 4000 | Next.js 13 + MUI v5 + Ant Design | Admin/user dashboard with RBAC |
| **api** | 5000 | Strapi v4.13.6 | Headless CMS, custom API routes |

### www (Public Site)

- **Framework:** Next.js 13 (Pages Router), TypeScript
- **UI:** MUI v5, react-intl (EN/AR with RTL), AOS animations
- **Key pages:** Home (countdown timer), About, Agenda (3-day with hall filtering), Speakers, Contact, News/Blog, Certificate verification, Profile
- **Logo:** `/www/public/images/logo.svg`, logo variants, partner logos (FSC, RAK, Emirates)
- **Images:** 61 items — hero images, speaker headshots (20+), partner logos, venue photos
- **Internationalization:** `en` and `ar` locales via `react-intl`, flag-based language switcher

### dashboard (Admin/User App)

- **Framework:** Next.js 13, Redux Toolkit, FullCalendar, next-auth
- **7 user roles:** admin, member, author, organizer, speaker, visitor — each with custom navigation menus
- **Key features:**
  - **QR code scanner:** Camera-based check-in for attendees (html5-qrcode)
  - **Schedule management:** FullCalendar with drag-and-drop event CRUD
  - **Certificate generation:** Dynamic PDF certificates with embedded QR codes (`pdf-lib`)
  - **Ticket generation:** QR-coded entry tickets
  - **Chat/messaging:** Real-time messaging with emoji picker
  - **Attendance tracking:** Per-day, per-hall records (online/in-person)
  - **Blog management:** CRUD for news articles

### api (Strapi Backend)

- **CMS:** Strapi v4.13.6
- **Content types:** Event (i18n), Profile, Abstract, Blog, AttendRecord, FeedbackForm, Message, Notification, TicketType, ProfileLog
- **Custom endpoints:** `/api/profiles/me`, `/api/profiles/admins`, `/api/attend-records/add/:id`
- **File storage:** Azure Blob Storage for certificates, tickets, profile pictures
- **Email:** SendGrid (production), maildev (development)
- **Plugins:** i18n, users-permissions, email-designer

## Key Features

- **7-role RBAC:** admin, member, author, organizer, speaker, visitor with custom menus
- **QR-based check-in:** Camera scanner + QR code generation for tickets and certificates
- **PDF certificate generation:** Dynamic PDFs with attendee name, session hours, QR codes
- **Multi-day agenda:** 3-day schedule with Hall A/B/C filtering
- **Bilingual support:** English + Arabic with RTL layout
- **Countdown timer:** Landing page countdown to event date
- **Feedback collection:** 12-question satisfaction survey
- **Notification system:** In-app notifications for profile updates, registrations, abstracts
- **Payment integration:** Stripe client-side for ticket purchases

## Deployment

- **Kubernetes (Hetzner):** Namespace `event-app-demo`, NodePorts 31840/31841/31842
- **Docker images:** `cdtroman/event-app-demo-api`, `-dashboard`, `-www`
- **Manual deploy:** `deploy.sh {version}` — builds all 3 images, pushes, applies K8s
- **Domains:** `event-app-demo.codaweb.co` (www), `event-app-demo-dashoard.codaweb.co` (dashboard), `event-app-demo-api.codaweb.co` (API)
