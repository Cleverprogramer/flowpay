# Flowpay Server

The Flowpay server is a Bun-powered Hono API. It mounts Better Auth, validates requests with shared Zod schemas, protects finance routes with session middleware, and delegates domain behavior to service modules backed by Drizzle ORM.

## Responsibilities

- Serve Better Auth endpoints at `/api/auth/*`.
- Enforce CORS using validated server environment variables.
- Authenticate finance requests and expose `userId` to handlers.
- Provide CRUD and summary routes for wallets, categories, transactions, budgets, invoices, and notifications.
- Generate invoice HTML for native PDF export.

## Route Groups

| Prefix | Purpose |
| --- | --- |
| `/api/auth/*` | Better Auth handlers |
| `/api/wallet` | Wallet CRUD and default wallet lookup |
| `/api/category` | Category listing and custom category CRUD |
| `/api/transaction` | Transaction CRUD plus summary reporting |
| `/api/budget` | Budget CRUD |
| `/api/invoice` | Invoice CRUD, status updates, and HTML generation |
| `/api/notification` | Notification listing, creation, and read-state updates |

## Key Folders

| Path | Purpose |
| --- | --- |
| `src/app.ts` | Hono app composition, middleware, route mounting, error handling |
| `src/index.ts` | App export entrypoint |
| `src/middleware` | Auth/session middleware |
| `src/routes` | HTTP route definitions and request validation |
| `src/services` | Domain logic and database operations |

## Environment

Create `apps/server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flowpay
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:8081
NODE_ENV=development
```

The values are validated by `@flowpay/env/server`.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev:server` | Start the API from the root workspace |
| `bun run --cwd apps/server dev` | Start Hono with Bun hot reload |
| `bun run --cwd apps/server check-types` | Type-check the server project |
| `bun run --cwd apps/server build` | Build the server with tsdown |
| `bun run --cwd apps/server compile` | Compile a Bun executable |
| `bun run --cwd apps/server start` | Start built output |

## Development Notes

- Route handlers should validate input with `@flowpay/schema` before calling services.
- Keep database writes in `src/services`; routes should stay mostly transport-focused.
- Use `authMiddleware` on finance route groups so all data remains user-scoped.
- Export any API shape needed by the native app through the Hono app type rather than duplicating types manually.
