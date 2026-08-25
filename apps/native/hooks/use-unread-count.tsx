import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"] as const,
    queryFn: async () => {
      const res = await api.api.notification["unread-count"].$get();
      if (!res.ok) throw new Error("Failed to fetch unread count");
      return res.json();
    },
  });
}
