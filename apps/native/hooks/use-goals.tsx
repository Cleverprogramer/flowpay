import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals.list(),
    queryFn: async () => {
      const res = await api.api.goal.$get();
      if (!res.ok) throw new Error("Failed to fetch goals");
      return res.json();
    },
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(id),
    queryFn: async () => {
      const res = await api.api.goal[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Goal not found");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      walletId?: string;
      name: string;
      description?: string;
      emoji?: string;
      color?: string;
      targetAmount: number;
      targetDate?: string;
    }) => {
      const res = await api.api.goal.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create goal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useContributeToGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const res = await api.api.goal[":id"].contribute.$patch({
        param: { id },
        json: { amount },
      });
      if (!res.ok) throw new Error("Failed to contribute to goal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      description?: string;
      emoji?: string;
      color?: string;
      targetAmount?: number;
      savedAmount?: number;
      targetDate?: string | null;
    }) => {
      const res = await api.api.goal[":id"].$put({
        param: { id },
        json: data,
      });
      if (!res.ok) throw new Error("Failed to update goal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.goal[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete goal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
