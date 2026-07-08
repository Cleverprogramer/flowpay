import React from "react";
import { View, Text, Pressable } from "react-native";
import { Card } from "heroui-native";

export type ServerStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

const STATUS_OPTIONS: { value: ServerStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

interface InvoiceStatusCardProps {
  currentStatus: ServerStatus;
  isPending: boolean;
  onStatusUpdate: (status: ServerStatus) => void;
}

export function InvoiceStatusCard({
  currentStatus,
  isPending,
  onStatusUpdate,
}: InvoiceStatusCardProps) {
  return (
    <Card
      variant="secondary"
      className="mb-4 rounded-[30px] p-0 overflow-hidden"
    >
      <Card.Body className="p-5 bg-brand-white dark:bg-brand-green-500">
        <Text
          className="text-body-lg text-brand-black dark:text-brand-white mb-3"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          Update Status
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const isActive = currentStatus === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  if (!isActive) onStatusUpdate(opt.value);
                }}
                className={`px-4 py-2.5 rounded-full ${
                  isActive
                    ? "bg-brand-green-500 dark:bg-dark-charcoal-green"
                    : "bg-brand-flashwhite dark:bg-brand-green-800"
                }`}
                disabled={isPending}
              >
                <Text
                  className={`text-body-sm ${
                    isActive
                      ? "text-brand-white"
                      : "text-brand-black dark:text-brand-white"
                  }`}
                  style={{
                    fontFamily: isActive
                      ? "PlusJakartaSans_700Bold"
                      : "PlusJakartaSans_400Regular",
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card.Body>
    </Card>
  );
}
