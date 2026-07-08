import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { CreateInvoiceInput } from "@flowpay/schema";

interface InvoiceListParams {
  [key: string]: unknown;
  page?: number;
  limit?: number;
  status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

export function useInvoices(params?: InvoiceListParams) {
  return useQuery({
    queryKey: queryKeys.invoices.list(params),
    queryFn: async () => {
      const res = await api.api.invoice.$get({
        query: {
          page: String(params?.page ?? 1),
          limit: String(params?.limit ?? 20),
          ...(params?.status ? { status: params.status } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return res.json();
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: async () => {
      const res = await api.api.invoice[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Invoice not found");
      return res.json();
    },
    enabled: !!id,
  });
}

// ── Mutations ───────────────────────────────────────────────────

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvoiceInput) => {
      const res = await api.api.invoice.$post({ json: data });
      if (!res.ok) {
        let errMessage = "Failed to create invoice";
        try {
          const errData = (await res.json()) as any;
          if (errData && errData.error) errMessage = errData.error;
          else if (errData && errData.message) errMessage = errData.message;
        } catch (e) {}
        throw new Error(errMessage);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    }) => {
      const res = await api.api.invoice[":id"].status.$patch({
        param: { id },
        json: { status },
      });
      if (!res.ok) throw new Error("Failed to update invoice status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.api.invoice[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete invoice");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}
