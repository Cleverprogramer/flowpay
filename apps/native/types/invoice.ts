export type InvoiceStatus = "Paid" | "Due" | "Overdue" | "Cancel";

export interface DashboardInvoiceItem {
  id: string | number;
  title: string;
  datetime: string;
  amount: number | string;
  status: InvoiceStatus;
  icon?: React.ReactNode;
}

export interface InvoiceItemForm {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}
