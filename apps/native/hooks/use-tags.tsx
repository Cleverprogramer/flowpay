import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: async () => {
      const res = await api.api.tag.$get();
      if (!res.ok) throw new Error("Failed to fetch tags");
      return res.json();
    },
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; color?: string }) => {
      const res = await api.api.tag.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create tag");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
}

export function useAttachTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { transactionId: string; tagIds: string[] }) => {
      const res = await api.api.tag.attach.$post({ json: data });
      if (!res.ok) throw new Error("Failed to attach tags");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.tag[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete tag");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
}
