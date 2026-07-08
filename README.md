<h1 align="center">FlowPay</h1>

<p align="center">
  <strong>Mobile-first finance management for wallets, transactions, budgets, invoices, and calm money workflows.</strong>
</p>

<p align="center">
  <a href="https://github.com/Cleverprogramer/flowpay/issues">Issues</a>
  ·
  <a href="#quick-start">Quick Start</a>
  ·
  <a href="#environment-setup">Environment Setup</a>
  ·
  <a href="#project-structure">Project Structure</a>
</p>

<p align="center">
  <img alt="Bun" src="https://img.shields.io/badge/Bun-1.2.19-000000?style=for-the-badge&logo=bun&logoColor=white" />
  <img alt="Expo" src="https://img.shields.io/badge/Expo-55-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.83-61DAFB?style=for-the-badge&logo=react&logoColor=111827" />
  <img alt="Hono" src="https://img.shields.io/badge/Hono-API-F97316?style=for-the-badge" />
  <img alt="Drizzle" src="https://img.shields.io/badge/Drizzle-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

---

## Overview

FlowPay is a full-stack personal finance platform built as a production-minded TypeScript monorepo. It pairs an Expo mobile app with a Bun-powered Hono API, a Drizzle/PostgreSQL data layer, Better Auth sessions, and shared Zod contracts that keep the client and server moving together.

The app is designed around everyday financial clarity: users can manage wallets, categorize income and expenses, review transaction history, plan budgets, create invoices, track notifications, and adjust profile settings from one focused mobile experience.

## What You Get

### Mobile App

- Expo Router navigation with onboarding, auth, tabs, drawer routes, profiles, wallets, invoices, reports, categories, and transaction flows.
- Better Auth Expo integration for authenticated mobile sessions.
- Wallet, category, transaction, budget, invoice, report, notification, and settings screens.
- Reusable templates, containers, base components, icon components, and design-system primitives.
- TanStack Query hooks for API-backed finance workflows.
- Invoice HTML, print, and sharing foundations through Expo native capabilities.
- Uniwind, Tailwind utilities, custom typography, haptics, safe areas, drawers, sheets, and mobile-first interaction patterns.

### Backend API

- Bun runtime with Hono route modules and service-based business logic.
- Better Auth integration with shared auth/database packages.
- Wallet, category, transaction, budget, invoice, and notification API domains.
- Zod request validation through shared schemas and Hono validators.
- Drizzle-backed PostgreSQL persistence with migrations, relations, and typed schema exports.
- Thin route handlers with domain behavior organized in service modules.

### Shared Packages

- `@flowpay/schema` for shared validation contracts and inferred TypeScript types.
- `@flowpay/db` for Drizzle schema, migrations, relations, and database scripts.
- `@flowpay/auth` for Better Auth configuration.
- `@flowpay/env` for validated server and native environment variables.
- `@flowpay/config` for shared TypeScript configuration.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Mobile | Expo 55, React Native 0.83, Expo Router, React 19, TanStack Query, Better Auth Expo, Uniwind |
| API | Bun, Hono, Better Auth, Zod, `@hono/zod-validator` |
| Data | PostgreSQL, Drizzle ORM, Drizzle Kit, Supabase local config |
| Shared | TypeScript, Zod, workspace packages, strict environment validation |
| Tooling | Bun workspaces, Turborepo, tsdown, TypeScript project references |

## Project Structure

```txt
flowpay/
├── apps/
│   ├── native/                  # Expo mobile app
│   │   ├── app/                 # Expo Router routes
│   │   ├── assets/images/       # App icons, splash assets, onboarding artwork
│   │   ├── components/          # UI, base, container, template, and icon components
│   │   ├── contexts/            # Theme and app-level providers
│   │   ├── hooks/               # Finance, auth, wallet, invoice, and notification hooks
│   │   ├── lib/                 # API client, auth client, constants, formatting helpers
│   │   └── types/               # Mobile-facing TypeScript types
│   └── server/                  # Bun + Hono API
│       └── src/
│           ├── middleware/      # Auth middleware
│           ├── routes/          # REST route modules
│           ├── services/        # Domain service logic
│           ├── app.ts           # Hono app composition
│           └── index.ts         # Server entrypoint
├── packages/
│   ├── auth/                    # Better Auth setup
│   ├── config/                  # Shared TypeScript base config
│   ├── db/                      # Drizzle schema, migrations, relations, scripts
│   ├── env/                     # Validated runtime environment contracts
│   └── schema/                  # Shared Zod API schemas
├── package.json                 # Workspace scripts
├── turbo.json                   # Turborepo pipeline
└── bun.lock                     # Bun dependency lockfile
```

## Quick Start

### 1. Clone The Repo

```bash
git clone https://github.com/Cleverprogramer/flowpay.git
cd flowpay
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

Create the environment files listed below and fill in values for your local setup.

### 4. Prepare The Database

```bash
bun run db:push
```

### 5. Run The Stack

Start the full workspace through Turborepo:

```bash
bun run dev
```

Or run the apps directly:

```bash
bun run dev:server
bun run dev:native
```

Then open the Expo app on iOS, Android, or web from the Expo development server.

## Environment Setup

### Server (`apps/server/.env`)

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flowpay
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:8081
NODE_ENV=development
```

### Native App (`apps/native/.env`)

```bash
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

## Scripts

### Root

| Command | Description |
| --- | --- |
| `bun run dev` | Start workspace development tasks through Turborepo. |
| `bun run build` | Run workspace build tasks. |
| `bun run check-types` | Run workspace type checks. |
| `bun run dev:server` | Start the Hono API with Bun hot reload. |
| `bun run dev:native` | Start Expo with a cleared cache. |
| `bun run db:push` | Push the Drizzle schema to PostgreSQL. |
| `bun run db:generate` | Generate Drizzle migrations. |
| `bun run db:migrate` | Apply Drizzle migrations. |
| `bun run db:studio` | Open Drizzle Studio. |

### Native App

| Command | Description |
| --- | --- |
| `bun run dev` | Start Expo with a cleared cache. |
| `bun run android` | Run the native app on Android. |
| `bun run ios` | Run the native app on iOS. |
| `bun run web` | Start the Expo web target. |
| `bun run prebuild` | Generate native iOS/Android projects. |

### Server

| Command | Description |
| --- | --- |
| `bun run dev` | Start the API with Bun hot reload. |
| `bun run build` | Build the server with tsdown. |
| `bun run check-types` | Type-check the server project. |
| `bun run start` | Run the built server output. |
| `bun run compile` | Compile the server into a Bun executable. |

## API Map

All API routes live under `/api`. Finance routes are designed for authenticated Better Auth sessions.

| Area | Endpoints |
| --- | --- |
| Auth | `/api/auth/*` |
| Wallets | `GET /api/wallet`, `GET /api/wallet/default`, `GET /api/wallet/:id`, `POST /api/wallet`, `PUT /api/wallet/:id`, `DELETE /api/wallet/:id` |
| Categories | `GET /api/category`, `POST /api/category`, `PUT /api/category/:id`, `DELETE /api/category/:id` |
| Transactions | `GET /api/transaction`, `GET /api/transaction/summary`, `GET /api/transaction/:id`, `POST /api/transaction`, `PUT /api/transaction/:id`, `DELETE /api/transaction/:id` |
| Budgets | `GET /api/budget`, `GET /api/budget/:id`, `POST /api/budget`, `PUT /api/budget/:id`, `DELETE /api/budget/:id` |
| Invoices | `GET /api/invoice`, `GET /api/invoice/:id`, `GET /api/invoice/:id/html`, `POST /api/invoice`, `PATCH /api/invoice/:id/status`, `DELETE /api/invoice/:id` |
| Notifications | `GET /api/notification`, `POST /api/notification`, `PATCH /api/notification/mark-all-read`, `PATCH /api/notification/:id/read` |

## Data Model

FlowPay stores a user-scoped finance graph:

```mermaid
erDiagram
    USER ||--o{ SESSION : owns
    USER ||--o{ ACCOUNT : owns
    USER ||--o{ WALLET : owns
    USER ||--o{ CATEGORY : owns
    USER ||--o{ TRANSACTION : records
    USER ||--o{ BUDGET : tracks
    USER ||--o{ INVOICE : sends
    USER ||--o{ NOTIFICATION : receives
    WALLET ||--o{ TRANSACTION : contains
    CATEGORY ||--o{ TRANSACTION : classifies
    CATEGORY ||--o{ BUDGET : limits
    INVOICE ||--o{ INVOICE_ITEM : includes
```

Core tables include auth users, sessions, accounts, wallets, categories, transactions, budgets, invoices, invoice items, and notifications.

## Development Flow

1. Add or update request contracts in `packages/schema`.
2. Add database tables or relations in `packages/db` when persistence changes.
3. Implement backend behavior in `apps/server/src/services`.
4. Wire validated Hono routes in `apps/server/src/routes`.
5. Connect mobile queries and mutations in `apps/native/hooks`.
6. Compose user-facing flows through `apps/native/components/templates` and feature containers.
7. Run type checks before handoff.

```bash
bun run check-types
```

For database changes:

```bash
bun run db:generate
bun run db:push
```

## Environment Rules

- Server-only secrets belong in `apps/server/.env` and are validated by `@flowpay/env/server`.
- Native public values belong in `apps/native/.env` and must use the `EXPO_PUBLIC_` prefix.
- Application code should import from `@flowpay/env` instead of reading raw environment variables.
- API payloads should use `@flowpay/schema` instead of one-off validation rules.
- Database changes should move through Drizzle schema updates and migrations.

## Requirements

- Bun `1.2.x`
- PostgreSQL
- Expo-compatible iOS, Android, or web development environment

## Repository Standard

FlowPay aims to stay practical, typed, and easy to move through:

- Shared packages own contracts, config, environment parsing, auth, and database infrastructure.
- Apps own product behavior, screens, routes, and user experience.
- Server routes stay thin; services own domain logic.
- Native screens stay composed; hooks own data loading and mutation flow.
- TypeScript and Zod should catch shape problems before runtime debugging.
