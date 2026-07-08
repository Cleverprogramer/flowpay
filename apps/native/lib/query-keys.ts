export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => ["auth", "session"] as const,
    user: (id: string) => ["auth", "user", id] as const,
  },
  user: {
    all: ["user"] as const,
    profile: () => ["user", "profile"] as const,
    onboarding: () => ["user", "onboarding"] as const,
  },
  category: {
    all: ["category"] as const,
    list: (type?: "income" | "expense") => ["category", "list", type] as const,
  },
  wallets: {
    all: ["wallets"] as const,
    list: () => ["wallets", "list"] as const,
    details: (id: string) => ["wallets", "details", id] as const,
    default: () => ["wallets", "default"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (params?: Record<string, unknown>) =>
      ["transactions", "list", params] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
    summary: (params?: Record<string, unknown>) =>
      ["transactions", "summary", params] as const,
  },
  budgets: {
    all: ["budgets"] as const,
    list: () => ["budgets", "list"] as const,
    detail: (id: string) => ["budgets", "detail", id] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    list: (params?: Record<string, unknown>) =>
      ["invoices", "list", params] as const,
    detail: (id: string) => ["invoices", "detail", id] as const,
  },
};
