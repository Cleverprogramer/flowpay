import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRecurringRules() {
  return useQuery({
    queryKey: queryKeys.recurringRules.list(),
    queryFn: async () => {
      const res = await api.api["recurring-rule"].$get();
      if (!res.ok) throw new Error("Failed to fetch recurring rules");
      return res.json();
    },
  });
}

export function useCreateRecurringRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      walletId: string;
      categoryId?: string;
      type: "income" | "expense";
      amount: number;
      description: string;
      note?: string;
      interval: "daily" | "weekly" | "monthly" | "yearly";
      startDate?: string;
    }) => {
      const res = await api.api["recurring-rule"].$post({ json: data });
      if (!res.ok) throw new Error("Failed to create recurring rule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurringRules.all,
      });
    },
  });
}

export function useUpdateRecurringRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      amount?: number;
      description?: string;
      interval?: "daily" | "weekly" | "monthly" | "yearly";
      isActive?: boolean;
    }) => {
      const res = await api.api["recurring-rule"][":id"].$put({
        param: { id },
        json: data,
      });
      if (!res.ok) throw new Error("Failed to update recurring rule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurringRules.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useDeleteRecurringRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api["recurring-rule"][":id"].$delete({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to delete recurring rule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurringRules.all,
      });
    },
  });
}

export function useProcessDueRules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.api["recurring-rule"]["process-due"].$post({});
      if (!res.ok) throw new Error("Failed to process due rules");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurringRules.all,
      });
    },
  });
}
