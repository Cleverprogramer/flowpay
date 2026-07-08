import React from "react";
import { View, Text } from "react-native";
import { Card } from "heroui-native";
import { formatCurrency } from "@/lib/format";

interface InvoiceItemsCardProps {
  invoice: any;
}

export function InvoiceItemsCard({ invoice }: InvoiceItemsCardProps) {
  return (
    <Card
      variant="secondary"
      className="mb-4 rounded-[30px] p-0 overflow-hidden"
    >
      <Card.Body className="p-5 bg-brand-white dark:bg-brand-green-500">
        <Text
          className="text-base text-brand-black dark:text-brand-white mb-4"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          Items
        </Text>

        {invoice.items?.map((item: any) => (
          <View
            key={item.id}
            className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-brand-green-800"
          >
            <View className="flex-1 pr-3">
              <Text
                className="text-body-md text-brand-black dark:text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                {item.description}
              </Text>
              <Text
                className="text-body-sm text-brand-grey dark:text-gray-400 mt-0.5"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </Text>
            </View>
            <Text
              className="text-body-md text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {formatCurrency(item.total)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View className="mt-4 pt-3 border-t border-gray-200 dark:border-brand-green-800">
          <View className="flex-row justify-between mb-1">
            <Text
              className="text-body-sm text-brand-grey dark:text-gray-400"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              Subtotal
            </Text>
            <Text
              className="text-body-md text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {formatCurrency(invoice.subtotal)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text
              className="text-body-sm text-brand-grey dark:text-gray-400"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              Tax ({invoice.taxRate}%)
            </Text>
            <Text
              className="text-body-md text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {formatCurrency(invoice.taxAmount)}
            </Text>
          </View>
          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200 dark:border-brand-green-800">
            <Text
              className="text-body-lg text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Total
            </Text>
            <Text
              className="text-body-lg text-brand-black dark:text-brand-white"
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
