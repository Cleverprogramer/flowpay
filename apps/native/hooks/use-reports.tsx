import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useSpendingByCategory(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: queryKeys.reports.spendingByCategory(params),
    queryFn: async () => {
      const res = await api.api.report["spending-by-category"].$get({
        query: params ?? {},
      });
      if (!res.ok) throw new Error("Failed to fetch spending report");
      return res.json();
    },
  });
}

export function useMonthlyTrends(months: number = 6) {
  return useQuery({
    queryKey: queryKeys.reports.monthlyTrends({ months }),
    queryFn: async () => {
      const res = await api.api.report["monthly-trends"].$get({
        query: { months },
      });
      if (!res.ok) throw new Error("Failed to fetch monthly trends");
      return res.json();
    },
  });
}

export function useWalletBreakdown() {
  return useQuery({
    queryKey: queryKeys.reports.walletBreakdown(),
    queryFn: async () => {
      const res = await api.api.report["wallet-breakdown"].$get();
      if (!res.ok) throw new Error("Failed to fetch wallet breakdown");
      return res.json();
    },
  });
}
