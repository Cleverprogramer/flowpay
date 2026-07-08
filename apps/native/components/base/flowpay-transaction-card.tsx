import { View, Text, Pressable } from "react-native";
import React from "react";
import { TransactionType } from "@/types/reports";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Card } from "heroui-native";
import { GeneralWallet } from "../ui/icons/GeneralWallet";
import { GeneralArrowUpRi } from "../ui/icons/GeneralArrowUpRi";

interface FlowpayTransactionCardProps {
  title: string;
  datetime: string;
  amount: string | number;
  type: TransactionType;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export default function FlowpayTransactionCard({
  title,
  datetime,
  amount,
  type,
  icon,
  onPress,
  className = "",
}: FlowpayTransactionCardProps) {
  const { isDark } = useAuthTheme();
  const isIncome = type === "income";
  const fallbackIconColor = isDark ? "#FFFFFF" : "#000000";
  const arrowColor = isDark ? "#FFFFFF" : "#000000";

  return (
    <Pressable onPress={onPress} className="w-full">
      <Card
        className={`flex-row items-center w-full justify-between gap-x-2.5 px-0 bg-transparent border-0 shadow-none elevation-0 rounded-none ${className}`}
        style={{ borderCurve: "continuous" }}
      >
        <View className="flex-row items-center flex-1">
          {/* Left inner circle shape */}
          <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-brand-green-500 mr-2.5">
            {icon ? (
              icon
            ) : (
              <GeneralWallet color={fallbackIconColor} width={23} height={23} />
            )}
          </View>

          <View className="flex-col items-start gap-y-1 flex-1">
            <Card.Title
              className="text-[16px] leading-5 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              numberOfLines={1}
            >
              {title}
            </Card.Title>
            <Card.Description
              className="text-body-sm leading-3.75 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              numberOfLines={1}
            >
              {datetime}
            </Card.Description>
          </View>
        </View>

        <View className="flex-col items-end gap-y-0.5">
          <Card.Title
            className="text-[16px] leading-5 text-brand-black dark:text-brand-white text-right"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            numberOfLines={1}
          >
            {typeof amount === "number"
              ? `${isIncome ? "+" : "-"}$${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : amount}
          </Card.Title>
          <View style={!isIncome ? { transform: [{ rotate: "180deg" }] } : {}}>
            <GeneralArrowUpRi color={arrowColor} width={24} height={24} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
