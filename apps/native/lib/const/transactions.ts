import { CategoryOption, WalletOption } from "@/types/transactions";

export const CATEGORIES: CategoryOption[] = [
  { value: "salary", emoji: "💼", label: "Salary" },
  { value: "grocery", emoji: "🛒", label: "Grocery" },
  { value: "rent", emoji: "🏠", label: "Rent" },
  { value: "electricity", emoji: "💡", label: "Electricity" },
  { value: "entertainment", emoji: "🎬", label: "Entertainment" },
  { value: "coffee", emoji: "☕", label: "Coffee" },
  { value: "education", emoji: "📚", label: "Education" },
  { value: "gym", emoji: "🏋️", label: "Gym" },
];

export const WALLET_OPTIONS: WalletOption[] = [
  { value: "bank", emoji: "🏠", label: "Bank Account" },
  { value: "credit", emoji: "💳", label: "Credit Card" },
  { value: "cash", emoji: "💰", label: "Cash" },
  { value: "mobile", emoji: "📱", label: "Mobile Wallet" },
];
