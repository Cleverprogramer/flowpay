export type TransactionStep = 1 | 2 | 3;
export type TransactionType = "income" | "expense";

export interface SelectOption {
  value: string;
  label: string;
}

export interface CategoryOption {
  value: string;
  emoji: string;
  label: string;
}

export interface WalletOption {
  value: string;
  emoji: string;
  label: string;
}

export type TransactionFilters = {
  category: string;
  dateRange: string;
  customDateRange?: { start: string; end: string };
};