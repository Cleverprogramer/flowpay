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
  goals: {
    all: ["goals"] as const,
    list: () => ["goals", "list"] as const,
    detail: (id: string) => ["goals", "detail", id] as const,
  },
  recurringRules: {
    all: ["recurring-rules"] as const,
    list: () => ["recurring-rules", "list"] as const,
    detail: (id: string) => ["recurring-rules", "detail", id] as const,
  },
  reports: {
    all: ["reports"] as const,
    spendingByCategory: (params?: Record<string, unknown>) =>
      ["reports", "spending-by-category", params] as const,
    monthlyTrends: (params?: Record<string, unknown>) =>
      ["reports", "monthly-trends", params] as const,
    walletBreakdown: () => ["reports", "wallet-breakdown"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    summary: () => ["dashboard", "summary"] as const,
  },
  clients: {
    all: ["clients"] as const,
    list: (params?: Record<string, unknown>) =>
      ["clients", "list", params] as const,
    detail: (id: string) => ["clients", "detail", id] as const,
  },
  expenseSplits: {
    all: ["expense-splits"] as const,
    list: (params?: Record<string, unknown>) =>
      ["expense-splits", "list", params] as const,
    summary: () => ["expense-splits", "summary"] as const,
  },
  transfers: {
    all: ["transfers"] as const,
    list: (params?: Record<string, unknown>) =>
      ["transfers", "list", params] as const,
  },
  tags: {
    all: ["tags"] as const,
    list: () => ["tags", "list"] as const,
  },
  templates: {
    all: ["templates"] as const,
    list: () => ["templates", "list"] as const,
  },
};
