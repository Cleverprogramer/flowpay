# Flowpay

![Bun](https://img.shields.io/badge/Bun-1.2%2B-black?logo=bun)
![Expo](https://img.shields.io/badge/Expo-SDK%2055-000020?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.83-61dafb?logo=react)
![Hono](https://img.shields.io/badge/Hono-API-f97316)
![Drizzle](https://img.shields.io/badge/Drizzle-PostgreSQL-336791?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript)

Flowpay is a mobile-first finance app built as a modern TypeScript monorepo. It gives users one calm place to manage wallets, categories, transactions, budgets, invoices, reports, notifications, and account settings.

Under the hood, it is intentionally sharp: Expo for the native app, Hono on Bun for the API, Better Auth for sessions, Drizzle with PostgreSQL for persistence, and shared Zod contracts so the client and server move together.

```txt
Native app -> Typed API client -> Hono routes -> Services -> Drizzle -> PostgreSQL
        \                         /
         \-> Shared env + schemas <-/
```

## Highlights

| Product | Platform |
| --- | --- |
| Wallets for bank, credit, cash, and mobile balances | Expo Router native app |
| Income and expense categories | Bun-powered Hono API |
| Transaction history, filters, and summaries | Better Auth sessions |
| Budgets by category and period | Drizzle ORM with PostgreSQL |
| Invoices with line items, tax, status, and export-ready HTML | Shared Zod validation |
| Notifications and profile settings | Turborepo workspace orchestration |

## Workspace

| Workspace | README | What It Owns |
| --- | --- | --- |
| `apps/native` | [Open](/Volumes/data/dev/flowpay/apps/native/README.md) | Expo mobile app, screens, templates, hooks, auth client, API client, design system pieces |
| `apps/server` | [Open](/Volumes/data/dev/flowpay/apps/server/README.md) | Hono app, route groups, auth middleware, services, invoice HTML generation |
| `packages/auth` | [Open](/Volumes/data/dev/flowpay/packages/auth/README.md) | Better Auth setup backed by the shared database schema |
| `packages/db` | [Open](/Volumes/data/dev/flowpay/packages/db/README.md) | Drizzle client, schema, relations, migrations, database scripts |
| `packages/env` | [Open](/Volumes/data/dev/flowpay/packages/env/README.md) | Validated server and native runtime environment variables |
| `packages/schema` | [Open](/Volumes/data/dev/flowpay/packages/schema/README.md) | Shared Zod schemas and inferred TypeScript input types |
| `packages/config` | [Open](/Volumes/data/dev/flowpay/packages/config/README.md) | Shared TypeScript base configuration |

## Architecture

```mermaid
flowchart TB
    subgraph Client["apps/native"]
        Screens["Expo Router Screens"]
        Hooks["React Query Hooks"]
        NativeAuth["Better Auth Expo Client"]
    end

    subgraph Shared["Shared Packages"]
        Schemas["@flowpay/schema"]
        Env["@flowpay/env"]
        Config["@flowpay/config"]
    end

    subgraph Server["apps/server"]
        Hono["Hono API"]
        Middleware["Auth Middleware"]
        Services["Domain Services"]
    end

    subgraph Data["packages/db"]
        Drizzle["Drizzle ORM"]
        Postgres["PostgreSQL"]
    end

    Screens --> Hooks
    Hooks --> Hono
    NativeAuth --> Hono
    Hono --> Middleware
    Middleware --> Services
    Services --> Drizzle
    Drizzle --> Postgres
    Screens --> Schemas
    Hono --> Schemas
    Hono --> Env
    Screens --> Env
    Config --> Client
    Config --> Server
```

## Quick Start

Install dependencies:

```bash
bun install
```

Create `apps/server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flowpay
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:8081
NODE_ENV=development
```

Create `apps/native/.env`:

```env
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

Push the database schema:

```bash
bun run db:push
```

Start everything:

```bash
bun run dev
```

Or run each side directly:

```bash
bun run dev:server
bun run dev:native
```

## Commands

| Command | What It Does |
| --- | --- |
| `bun run dev` | Starts workspace development tasks through Turborepo |
| `bun run dev:server` | Starts the Hono API with Bun hot reload |
| `bun run dev:native` | Starts Expo with a cleared cache |
| `bun run check-types` | Runs workspace type checks |
| `bun run build` | Runs workspace build tasks |
| `bun run db:push` | Pushes the Drizzle schema to PostgreSQL |
| `bun run db:generate` | Generates Drizzle migrations |
| `bun run db:migrate` | Applies Drizzle migrations |
| `bun run db:studio` | Opens Drizzle Studio |

## API Map

All product routes live under `/api`. Finance routes require an authenticated Better Auth session.

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

Flowpay stores a user-scoped finance graph:

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

Core tables include auth users/sessions/accounts, wallets, categories, transactions, budgets, invoices, invoice items, and notifications.

## Development Flow

1. Add or update request contracts in `packages/schema`.
2. Add database tables or relations in `packages/db` when persistence changes.
3. Implement server behavior in `apps/server/src/services` and route validation in `apps/server/src/routes`.
4. Wire native queries and mutations in `apps/native/hooks`.
5. Compose screens through `apps/native/components/templates` and feature containers.
6. Run type checks before handing off.

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
- Application code should import from `@flowpay/env` instead of reading raw `process.env`.
- API payloads should use `@flowpay/schema` instead of one-off validation rules.

## Requirements

- Bun `1.2.x`
- PostgreSQL
- Expo-compatible iOS, Android, or web development environment

## Repository Standard

Flowpay aims to stay practical and easy to move through:

- Shared packages hold contracts and infrastructure.
- Apps own product behavior and user experience.
- Server routes stay thin; services own domain logic.
- Native screens stay composed; hooks own data loading and mutation flow.
- TypeScript should be the first line of defense before runtime debugging.
