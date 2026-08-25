import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: async () => {
      const res = await api.api.dashboard.$get();
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json();
    },
  });
}
