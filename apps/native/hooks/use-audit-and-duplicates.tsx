import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useBalanceAudit(params?: { page?: number; walletId?: string }) {
  return useQuery({
    queryKey: ["balance-audit", params] as const,
    queryFn: async () => {
      const res = await api.api["balance-audit"].$get({
        query: {
          page: String(params?.page ?? 1),
          ...(params?.walletId ? { walletId: params.walletId } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch audit trail");
      return res.json();
    },
  });
}

export function useDuplicates() {
  return useQuery({
    queryKey: ["transaction-duplicates"] as const,
    queryFn: async () => {
      const res = await api.api.transaction.duplicates.$get();
      if (!res.ok) throw new Error("Failed to scan duplicates");
      return res.json();
    },
  });
}
