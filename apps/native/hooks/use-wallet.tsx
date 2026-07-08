import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWallets() {
  return useQuery({
    queryKey: queryKeys.wallets.list(),
    queryFn: async () => {
      const res = await api.api.wallet.$get();
      if (!res.ok) throw new Error("Failed to fetch wallets");
      return res.json();
    },
  });
}

export function useWallet(id: string) {
  return useQuery({
    queryKey: queryKeys.wallets.details(id),
    queryFn: async () => {
      const res = await api.api.wallet[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Wallet not found");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useDefaultWallet() {
  return useQuery({
    queryKey: queryKeys.wallets.default(),
    queryFn: async () => {
      const res = await api.api.wallet.default.$get();
      if (!res.ok) throw new Error("No default wallet");
      return res.json();
    },
  });
}

// ── Mutations ───────────────────────────────────────────────────

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      type: "bank" | "credit" | "cash" | "mobile";
      icon?: string;
      currency?: string;
      isDefault?: boolean;
    }) => {
      const res = await api.api.wallet.$post({ json: data });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as any;
        throw new Error(
          errData.error || errData.message || "Failed to create wallet",
        );
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
    },
  });
}

export function useUpdateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      type?: "bank" | "credit" | "cash" | "mobile";
      icon?: string;
      currency?: string;
      isDefault?: boolean;
    }) => {
      const res = await api.api.wallet[":id"].$put({
        param: { id },
        json: data,
      });
      if (!res.ok) throw new Error("Failed to update wallet");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
    },
  });
}

export function useDeleteWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.wallet[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete wallet");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all });
    },
  });
}
