import { InvoiceStatus } from "@/types/invoice";

export function getInvoiceStatusStyles(status: InvoiceStatus): {
  bg: string;
  text: string;
} {
  let bg = "";
  let text = "text-brand-white";

  switch (status) {
    case "Paid":
      bg = "bg-brand-green-500 dark:bg-[#0F2723]";
      break;
    case "Due":
      bg = "bg-brand-flashwhite";
      text = "text-brand-black dark:text-[#0F2723]";
      break;
    case "Overdue":
    case "Cancel":
      bg = "bg-brand-red-500";
      break;
  }
  return { bg, text };
}
