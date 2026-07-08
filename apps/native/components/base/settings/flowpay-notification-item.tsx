import { View, Text } from "react-native";
import React from "react";
import { Card, Switch } from "heroui-native";

interface FlowpayNotificationItemProps {
  title: string;
  description: string;
  isSelected: boolean;
  onValueChange?: (isSelected: boolean) => void;
  className?: string;
}

export default function FlowpayNotificationItem({
  title,
  description,
  isSelected,
  onValueChange,
  className = "",
}: FlowpayNotificationItemProps) {
  return (
    <Card
      className={`rounded-[15px] bg-brand-flashwhite/50 dark:bg-brand-green-500/50 py-4.5 px-5 flex-row items-center justify-between border-0 w-full ${className}`}
      style={{ borderCurve: "continuous" }}
    >
      <View className="flex-col items-start gap-y-1 flex-1 pr-6">
        <Card.Title
          className="text-base leading-4.5 text-brand-black dark:text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          numberOfLines={1}
        >
          {title}
        </Card.Title>
        <Card.Description
          className="text-body-xs leading-normal text-brand-black dark:text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          numberOfLines={2}
        >
          {description}
        </Card.Description>
      </View>

      <Switch isSelected={isSelected} onSelectedChange={onValueChange} />
    </Card>
  );
}
