import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["notification-preferences"] as const,
    queryFn: async () => {
      const res = await api.api["notification-preference"].$get();
      if (!res.ok) throw new Error("Failed to fetch preferences");
      return res.json();
    },
  });
}

export function useWalletLimitStatus(id: string) {
  return useQuery({
    queryKey: ["wallet-limit-status", id] as const,
    queryFn: async () => {
      const res = await api.api.wallet[":id"]["limit-status"].$get({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to fetch limit status");
      return res.json();
    },
    enabled: !!id,
  });
}
