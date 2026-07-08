# Flowpay Native

The Flowpay native app is the mobile experience for the product. It uses Expo Router, React Native, HeroUI Native, Uniwind, TanStack Query, and Better Auth's Expo client to deliver onboarding, auth, finance tracking, invoices, reports, notifications, and settings.

## Product Areas

- Onboarding splash, profile setup, country selection, and completion screens.
- Email/password sign up and sign in.
- Dashboard with balance, income/expense, budgets, and invoice cards.
- Wallet, category, transaction, invoice, notification, reports, and profile/settings screens.
- Invoice PDF flow powered by server-generated invoice HTML and Expo print/share APIs.

## Key Folders

| Path | Purpose |
| --- | --- |
| `app` | Expo Router routes and layouts |
| `components/base` | Small reusable UI primitives and display components |
| `components/containers` | Feature-level composed components |
| `components/templates` | Screen templates for repeated page structures |
| `hooks` | Authenticated data fetching and mutations |
| `lib` | API client, auth client, query keys, formatting, theme helpers |
| `types` | Native-side app types |
| `assets` | App icons, splash assets, and onboarding imagery |

## Environment

Create `apps/native/.env`:

```env
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

The value is validated by `@flowpay/env/native`.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev:native` | Start Expo from the root workspace |
| `bun run --cwd apps/native dev` | Start Expo with cache clearing |
| `bun run --cwd apps/native start` | Start Expo normally |
| `bun run --cwd apps/native ios` | Build/run iOS target |
| `bun run --cwd apps/native android` | Build/run Android target |
| `bun run --cwd apps/native web` | Start Expo web |

## App Contracts

- Uses `@flowpay/schema` for form validation and request payload shapes.
- Uses `@flowpay/env/native` for public runtime configuration.
- Talks to the server through `lib/api-client.ts`.
- Persists auth through `lib/auth-client.ts` and Expo secure storage.

## Development Notes

- Keep screen-level request orchestration in `hooks`.
- Keep route files thin and compose UI through templates/containers.
- Use Flowpay UI primitives from `components/ui` and `components/base` before creating new one-off controls.
- When adding a new API-backed workflow, add a query key in `lib/query-keys.ts` and keep cache invalidation explicit.
