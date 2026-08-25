import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExpenseSplits(params?: {
  transactionId?: string;
  isSettled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.expenseSplits.list({
      transactionId: params?.transactionId,
      isSettled: params?.isSettled,
    }),
    queryFn: async () => {
      const res = await api.api["expense-split"].$get({
        query: {
          ...(params?.transactionId
            ? { transactionId: params.transactionId }
            : {}),
          ...(params?.isSettled !== undefined
            ? { isSettled: String(params.isSettled) }
            : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch splits");
      return res.json();
    },
  });
}

export function useSplitsSummary() {
  return useQuery({
    queryKey: queryKeys.expenseSplits.summary(),
    queryFn: async () => {
      const res = await api.api["expense-split"].summary.$get();
      if (!res.ok) throw new Error("Failed to fetch splits summary");
      return res.json();
    },
  });
}

export function useSplitEvenly() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      transactionId: string;
      participants: string[];
    }) => {
      const res = await api.api["expense-split"].even.$post({ json: data });
      if (!res.ok) throw new Error("Failed to split transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseSplits.all });
    },
  });
}

export function useCreateSplit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      transactionId: string;
      participantName: string;
      participantContact?: string;
      shareAmount: number;
    }) => {
      const res = await api.api["expense-split"].$post({ json: data });
      if (!res.ok) throw new Error("Failed to create split");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseSplits.all });
    },
  });
}

export function useSettleSplit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isSettled }: { id: string; isSettled: boolean }) => {
      const res = await api.api["expense-split"][":id"].settle.$patch({
        param: { id },
        json: { isSettled },
      });
      if (!res.ok) throw new Error("Failed to settle split");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseSplits.all });
    },
  });
}
