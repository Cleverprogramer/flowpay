import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTransfers(params?: { walletId?: string; page?: number }) {
  return useQuery({
    queryKey: queryKeys.transfers.list(params),
    queryFn: async () => {
      const res = await api.api.transfer.$get({
        query: {
          page: String(params?.page ?? 1),
          ...(params?.walletId ? { walletId: params.walletId } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch transfers");
      return res.json();
    },
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sourceWalletId: string;
      destinationWalletId: string;
      amount: number;
      fee?: number;
      note?: string;
    }) => {
      const res = await api.api.transfer.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create transfer");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}
