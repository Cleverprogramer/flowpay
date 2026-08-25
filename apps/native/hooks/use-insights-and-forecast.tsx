import { api } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSubscriptionInsight() {
  return useQuery({
    queryKey: ["insights", "subscriptions"] as const,
    queryFn: async () => {
      const res = await api.api.insight.subscriptions.$get();
      if (!res.ok) throw new Error("Failed to fetch subscription insight");
      return res.json();
    },
  });
}

export function useNoSpendInsight() {
  return useQuery({
    queryKey: ["insights", "no-spend"] as const,
    queryFn: async () => {
      const res = await api.api.insight["no-spend"].$get();
      if (!res.ok) throw new Error("Failed to fetch no-spend insight");
      return res.json();
    },
  });
}

export function useNetWorth() {
  return useQuery({
    queryKey: ["forecast", "net-worth"] as const,
    queryFn: async () => {
      const res = await api.api.forecast["net-worth"].$get();
      if (!res.ok) throw new Error("Failed to fetch net worth");
      return res.json();
    },
  });
}

export function useSavingsRate(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["insights", "savings-rate", params] as const,
    queryFn: async () => {
      const res = await api.api.insight["savings-rate"].$get({
        query: params ?? {},
      });
      if (!res.ok) throw new Error("Failed to fetch savings rate");
      return res.json();
    },
  });
}

export function useCashFlowProjection() {
  return useQuery({
    queryKey: ["forecast", "cash-flow"] as const,
    queryFn: async () => {
      const res = await api.api.forecast["cash-flow"].$get();
      if (!res.ok) throw new Error("Failed to fetch cash flow");
      return res.json();
    },
  });
}

export function useCommitImport() {
  return useMutation({
    mutationFn: async (data: {
      walletId: string;
      rows: Array<{
        date: string;
        amount: number;
        description: string;
        typeHint?: "income" | "expense" | null;
        note?: string | null;
      }>;
    }) => {
      const res = await api.api.import.commit.$post({ json: data });
      if (!res.ok) throw new Error("Failed to import transactions");
      return res.json();
    },
  });
}
