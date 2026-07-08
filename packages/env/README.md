# @flowpay/env

Runtime environment validation for Flowpay.

This package validates environment variables at the boundary so apps and packages can import known-good configuration instead of reading raw `process.env` values throughout the codebase.

## Exports

| Export | Used By | Variables |
| --- | --- | --- |
| `@flowpay/env/server` | API, auth, database tooling | `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN`, `NODE_ENV` |
| `@flowpay/env/native` | Expo app | `EXPO_PUBLIC_SERVER_URL` |

## Usage

```ts
import { env } from "@flowpay/env/server";

console.log(env.DATABASE_URL);
```

```ts
import { env } from "@flowpay/env/native";

console.log(env.EXPO_PUBLIC_SERVER_URL);
```

## Server `.env`

Create `apps/server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flowpay
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:8081
NODE_ENV=development
```

## Native `.env`

Create `apps/native/.env`:

```env
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

## Development Notes

- Add variables here before using them anywhere else.
- Keep server-only secrets in the server export.
- Native variables must use the `EXPO_PUBLIC_` prefix because they are exposed to the client bundle.
