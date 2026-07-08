# @flowpay/schema

Shared Zod schemas and TypeScript input types for Flowpay.

This package is the contract layer between the native app and the server. Forms, route validators, and service inputs should reuse these schemas so validation rules stay consistent.

## Domains

| File | Purpose |
| --- | --- |
| `auth.schema.ts` | Sign-up and sign-in validation |
| `wallet.schema.ts` | Wallet create/update and wallet shape |
| `category.schema.ts` | Category create/update/list validation |
| `transaction.schema.ts` | Transaction create/update/list/summary validation |
| `budget.schema.ts` | Budget create/update validation |
| `invoice.schema.ts` | Invoice create/list/status validation |
| `notification.schema.ts` | Notification create/list/read-state validation |
| `index.ts` | Public barrel exports |

## Imports

```ts
import { createTransactionSchema } from "@flowpay/schema/transaction.schema";
import type { CreateTransactionInput } from "@flowpay/schema/transaction.schema";
```

Or through the barrel:

```ts
import { createInvoiceSchema } from "@flowpay/schema";
```

## Development Notes

- Keep schemas focused on transport/form input, not database table definitions.
- Export `z.infer` types beside each schema.
- Update both native forms and server route validators when adding a new schema.
- Prefer shared enums here when the API and app both need to understand a domain state.
