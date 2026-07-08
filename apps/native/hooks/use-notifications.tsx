import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNotifications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...queryKeys.auth.session(), "notifications", params],
    queryFn: async () => {
      const res = await api.api.notification.$get({
        query: {
          page: String(params?.page ?? 1),
          limit: String(params?.limit ?? 50),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const res = await api.api.notification[":id"].read.$patch({
        param: { id },
        json: { isRead },
      });
      if (!res.ok) throw new Error("Failed to mark notification");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.auth.session(), "notifications"],
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.api.notification["mark-all-read"].$patch();
      if (!res.ok) throw new Error("Failed to mark all notifications as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.auth.session(), "notifications"],
      });
    },
  });
}
