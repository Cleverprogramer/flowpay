import { View, Text, StyleProp, ViewStyle, Pressable } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Card, Chip } from "heroui-native";
import { GeneralWallet } from "../ui/icons/GeneralWallet";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

export type InvoiceStatus = "Paid" | "Due" | "Overdue" | "Cancel";

interface FlowpayInvoiceCardProps {
  title: string;
  datetime: string;
  amount: string | number;
  status: InvoiceStatus;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export default function FlowpayInvoiceCard({
  title,
  datetime,
  amount,
  status,
  icon,
  onPress,
  className = "",
}: FlowpayInvoiceCardProps) {
  const { isDark } = useAuthTheme();

  const fallbackIconColor = isDark ? "#FFFFFF" : "#000000";

  // Shared light shadow
  const shadowStyle: StyleProp<ViewStyle> = !isDark
    ? {
        shadowColor: "rgba(139, 138, 138, 0.12)",
        shadowOffset: { width: -1, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 61,
        elevation: 10,
      }
    : {};

  // Resolve status pill styling
  let statusBg = "";
  let statusText = "text-brand-white";
  switch (status) {
    case "Paid":
      statusBg = "bg-brand-green-500 dark:bg-[#0F2723]";
      break;
    case "Due":
      statusBg = "bg-brand-flashwhite";
      statusText = "text-brand-black dark:text-[#0F2723]";
      break;
    case "Overdue":
    case "Cancel":
      statusBg = "bg-brand-red-500";
      break;
  }

  return (
    <Pressable onPress={onPress} className="w-full">
      <Card
        className={`rounded-[30px] bg-brand-white dark:bg-brand-green-500 p-4 flex-row items-center justify-between border-0 w-full min-h-20.5 ${className}`}
        style={[{ borderCurve: "continuous" }, shadowStyle]}
      >
        <View className="flex-row items-center gap-x-3.5 flex-1 pr-2">
          {/* Left inner circle shape */}
          <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-brand-green-800">
            {icon ? (
              icon
            ) : (
              <GeneralWallet color={fallbackIconColor} width={23} height={23} />
            )}
          </View>

          <View className="flex-col items-start h-11.5 justify-between flex-1 overflow-hidden">
            <Card.Title
              className="text-[16px] leading-5 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              numberOfLines={1}
            >
              {title}
            </Card.Title>
            <Card.Description
              className="text-body-xs leading-3.75 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              numberOfLines={1}
            >
              {datetime}
            </Card.Description>
          </View>
        </View>

        <View className="flex-col items-end h-12.5 justify-between">
          <Card.Title
            className="text-[16px] leading-5 text-brand-black dark:text-brand-white text-right"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            numberOfLines={1}
          >
            {typeof amount === "number"
              ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : amount}
          </Card.Title>

          <Chip
            size="sm"
            variant="primary"
            color={
              status === "Paid"
                ? "success"
                : status === "Due"
                  ? "warning"
                  : "danger"
            }
            className="min-w-15 items-center justify-center"
          >
            <Chip.Label
              className="text-body-sm leading-3.75 text-brand-white"
              style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
            >
              {status}
            </Chip.Label>
          </Chip>
        </View>
      </Card>
    </Pressable>
  );
}
