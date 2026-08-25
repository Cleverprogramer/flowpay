import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCategorizationRules() {
  return useQuery({
    queryKey: ["categorization-rules"] as const,
    queryFn: async () => {
      const res = await api.api["categorization-rule"].$get();
      if (!res.ok) throw new Error("Failed to fetch rules");
      return res.json();
    },
  });
}

export function useSuggestCategory() {
  return useMutation({
    mutationFn: async (description: string) => {
      const res = await api.api["categorization-rule"].suggest.$post({
        json: { description },
      });
      if (!res.ok) throw new Error("Failed to suggest category");
      return res.json();
    },
  });
}

export function useCreateCategorizationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      categoryId: string;
      keyword: string;
      matchType?: "contains" | "starts_with" | "exact";
      priority?: number;
    }) => {
      const res = await api.api["categorization-rule"].$post({ json: data });
      if (!res.ok) throw new Error("Failed to create rule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorization-rules"],
      });
    },
  });
}

export function useDeleteCategorizationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api["categorization-rule"][":id"].$delete({
        param: { id },
      });
      if (!res.ok) throw new Error("Failed to delete rule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorization-rules"],
      });
    },
  });
}
