import { View, Text } from "react-native";
import React, { useState } from "react";
import FlowpayNotificationItem from "@/components/base/settings/flowpay-notification-item";

const NOTIFICATION_SETTINGS = [
  {
    id: "expense_alerts",
    title: "Expense Alerts",
    description: "Get instant updates when new expenses are recorded",
  },
  {
    id: "budget_limit",
    title: "Budget Limit",
    description: "Budget nearly exceeded",
  },
  {
    id: "income_received",
    title: "Income Received",
    description: "Stay notified when new income is added to your records",
  },
  {
    id: "bill_reminder",
    title: "Bill Reminder",
    description: "Never miss due dates for your recurring bills",
  },
  {
    id: "goal_update",
    title: "Goal Update",
    description: "Track your savings and financial goal achievements",
  },
  {
    id: "high_spending",
    title: "High Spending",
    description: "Above usual spending",
  },
  {
    id: "finance_tips",
    title: "Finance Tips",
    description:
      "Receive personalized finance tips and smart spending suggestions",
  },
];

export default function NotificationSettingsView() {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    () =>
      NOTIFICATION_SETTINGS.reduce(
        (acc, item) => ({ ...acc, [item.id]: false }),
        {} as Record<string, boolean>,
      ),
  );

  const handleToggle = (id: string) => (value: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <View className="flex-col gap-y-2.5">
      {NOTIFICATION_SETTINGS.map((item) => (
        <FlowpayNotificationItem
          key={item.id}
          title={item.title}
          description={item.description}
          isSelected={toggleStates[item.id] ?? false}
          onValueChange={handleToggle(item.id)}
        />
      ))}
    </View>
  );
}
