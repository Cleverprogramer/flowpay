import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates.list(),
    queryFn: async () => {
      const res = await api.api.template.$get();
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    },
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      walletId: string;
      categoryId?: string;
      name: string;
      type: "income" | "expense";
      amount: number;
      description: string;
      note?: string;
    }) => {
      const res = await api.api.template.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create template");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
}

export function useApplyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      transactionDate?: string;
      amountOverride?: number;
    }) => {
      const { id, ...json } = data;
      const res = await api.api.template[":id"].apply.$post({
        param: { id },
        json,
      });
      if (!res.ok) throw new Error("Failed to apply template");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.template[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete template");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
}
