# @flowpay/db

Database package for Flowpay. It contains the Drizzle client, PostgreSQL table definitions, relations, migrations, and database tooling scripts.

## Data Domains

- Auth users, sessions, accounts, and verification records.
- Wallets for bank, credit, cash, and mobile balances.
- Categories for income and expenses.
- Transactions linked to users, wallets, and optional categories.
- Budgets linked to categories.
- Invoices and invoice line items.
- Notifications for user activity.

## Key Folders

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Drizzle client export |
| `src/schema` | PostgreSQL table definitions and relations |
| `src/migrations` | Generated migration SQL and Drizzle metadata |
| `drizzle.config.ts` | Drizzle Kit configuration |
| `supabase` | Local Supabase configuration |

## Imports

```ts
import { db } from "@flowpay/db";
import { wallet } from "@flowpay/db/schema/wallet";
```

## Scripts

Run from the root:

```bash
bun run db:push
bun run db:generate
bun run db:migrate
bun run db:studio
```

Or from this package:

```bash
bun run db:push
bun run db:generate
bun run db:migrate
bun run db:studio
```

## Environment

Drizzle reads `DATABASE_URL` through `@flowpay/env/server`.

## Development Notes

- Add new tables in `src/schema` and export them from `src/schema/index.ts`.
- Add relations in `src/schema/_relations.ts` when records need typed joins.
- Generate migrations for schema changes that should be tracked.
- Keep service-layer business logic in `apps/server/src/services`; this package should stay focused on persistence primitives.
