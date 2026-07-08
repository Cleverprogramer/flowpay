import React from "react";
import { View, Text } from "react-native";
import { Card } from "heroui-native";
import { InvoiceStatus } from "@/types/invoice";
import { getInvoiceStatusStyles } from "@/lib/flowpay-invoice-status";
import { formatCurrency } from "@/lib/format";

interface InvoiceHeaderCardProps {
  invoice: any;
  displayStatus: InvoiceStatus;
  formatDate: (d: string | Date | null) => string;
}

export function InvoiceHeaderCard({
  invoice,
  displayStatus,
  formatDate,
}: InvoiceHeaderCardProps) {
  const { bg: statusBg, text: statusText } =
    getInvoiceStatusStyles(displayStatus);

  return (
    <Card
      variant="secondary"
      className="mb-4 rounded-[30px] p-0 overflow-hidden"
    >
      <Card.Body className="p-5 bg-brand-white dark:bg-brand-green-500">
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <Card.Title
              className="text-h4 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {invoice.invoiceNumber}
            </Card.Title>
            <Card.Description
              className="text-[13px] text-brand-grey dark:text-gray-300 mt-1"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              {invoice.clientName}
            </Card.Description>
            {invoice.clientEmail && (
              <Card.Description
                className="text-body-sm text-brand-grey dark:text-gray-400"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                {invoice.clientEmail}
              </Card.Description>
            )}
          </View>
          <View
            className={`h-7 px-4 items-center justify-center rounded-[10px] ${statusBg}`}
          >
            <Text
              className={`text-body-sm leading-3.75 ${statusText}`}
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {displayStatus}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View>
            <Text
              className="text-body-xs text-brand-grey dark:text-gray-400 uppercase tracking-wider"
              style={{ fontFamily: "PlusJakartaSans_500Medium" }}
            >
              Issue Date
            </Text>
            <Text
              className="text-[13px] text-brand-black dark:text-brand-white mt-1"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {formatDate(invoice.issueDate)}
            </Text>
          </View>
          <View>
            <Text
              className="text-body-xs text-brand-grey dark:text-gray-400 uppercase tracking-wider"
              style={{ fontFamily: "PlusJakartaSans_500Medium" }}
            >
              Due Date
            </Text>
            <Text
              className="text-[13px] text-brand-black dark:text-brand-white mt-1"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {formatDate(invoice.dueDate)}
            </Text>
          </View>
          <View className="items-end">
            <Text
              className="text-body-xs text-brand-grey dark:text-gray-400 uppercase tracking-wider"
              style={{ fontFamily: "PlusJakartaSans_500Medium" }}
            >
              Total
            </Text>
            <Text
              className="text-body-xl text-brand-black dark:text-brand-white mt-1"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>
      </Card.Body>
    </Card>
  );
}
