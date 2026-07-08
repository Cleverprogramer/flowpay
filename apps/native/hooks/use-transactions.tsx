import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";

interface TransactionListParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  type?: "income" | "expense";
  walletId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export function useTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: queryKeys.transactions.list(params),
    queryFn: async () => {
      const res = await api.api.transaction.$get({
        query: {
          page: String(params?.page ?? 1),
          limit: String(params?.limit ?? 20),
          ...(params?.type ? { type: params.type } : {}),
          ...(params?.walletId ? { walletId: params.walletId } : {}),
          ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
          ...(params?.startDate ? { startDate: params.startDate } : {}),
          ...(params?.endDate ? { endDate: params.endDate } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: async () => {
      const res = await api.api.transaction[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Transaction not found");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useTransactionSummary(params?: {
  startDate?: string;
  endDate?: string;
  walletId?: string;
}) {
  return useQuery({
    queryKey: queryKeys.transactions.summary(params),
    queryFn: async () => {
      const res = await api.api.transaction.summary.$get({
        query: {
          ...(params?.startDate ? { startDate: params.startDate } : {}),
          ...(params?.endDate ? { endDate: params.endDate } : {}),
          ...(params?.walletId ? { walletId: params.walletId } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch summary");
      return res.json();
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: InferRequestType<typeof api.api.transaction.$post>["json"],
    ) => {
      const res = await api.api.transaction.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: { id: string } & InferRequestType<
      (typeof api.api.transaction)[":id"]["$put"]
    >["json"]) => {
      const res = await api.api.transaction[":id"].$put({
        param: { id },
        json: data,
      });
      if (!res.ok) throw new Error("Failed to update transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.transaction[":id"].$delete({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to delete transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
    },
  });
}
