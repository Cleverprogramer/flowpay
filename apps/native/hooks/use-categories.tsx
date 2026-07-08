import { api, ApiError } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { Category } from "@flowpay/schema/category.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCategories(type?: "income" | "expense") {
  return useQuery({
    queryKey: queryKeys.category.list(type),
    queryFn: async () => {
      const res = await api.api.category.$get({
        query: type ? { type } : {},
      });

      if (!res.ok)
        throw new ApiError("Failed to fetch categories", 0, "NETWORK_ERROR");
      const data = await res.json();
      return data as Category[];
    },
  });
}

// ── Mutations ───────────────────────────────────────────────────

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      emoji?: string;
      type: "income" | "expense";
      color?: string;
      sortOrder?: number;
    }) => {
      const res = await api.api.category.$post({ json: data });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as any;
        let errMsg = "Failed to create category";
        if (errData.error) {
          errMsg =
            typeof errData.error === "string"
              ? errData.error
              : JSON.stringify(errData.error);
        } else if (errData.message) {
          errMsg = errData.message;
        }
        throw new Error(errMsg);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.category.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      emoji?: string;
      color?: string;
      sortOrder?: number;
    }) => {
      const res = await api.api.category[":id"].$put({
        param: { id },
        json: data,
      });
      if (!res.ok) throw new Error("Failed to update category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.category.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.category[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.category.all });
    },
  });
}
