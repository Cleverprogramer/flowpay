# @flowpay/auth

Shared Better Auth configuration for Flowpay.

This package wires Better Auth to the Drizzle-backed Flowpay database schema and exposes the configured `auth` instance used by the Hono server.

## What Lives Here

- Better Auth server configuration.
- Drizzle adapter integration.
- Email/password auth setup.
- Trusted native and web origins for the Flowpay app.

## Imports

```ts
import { auth } from "@flowpay/auth";
```

The server mounts it in `apps/server/src/app.ts`:

```ts
.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
```

## Dependencies

- `better-auth`
- `@better-auth/expo`
- `@flowpay/db`
- `@flowpay/env`

## Environment

This package reads validated server settings through `@flowpay/env/server`:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `CORS_ORIGIN`
- `NODE_ENV`

## Development Notes

- Keep auth table changes coordinated with `packages/db/src/schema/auth.ts`.
- Add new auth providers here, then expose any required native client behavior in `apps/native/lib/auth-client.ts`.
- Keep trusted origins aligned with app schemes in `apps/native/app.json`.
