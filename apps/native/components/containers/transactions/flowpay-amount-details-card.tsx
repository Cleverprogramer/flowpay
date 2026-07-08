import React from "react";
import { View, StyleProp, ViewStyle, Pressable } from "react-native";
import { Card, cn } from "heroui-native";
import useAuthTheme from "@/hooks/use-auth-theme";
import { GeneralWallet } from "@/components/ui/icons/GeneralWallet";
import { GeneralArrowUpRi } from "@/components/ui/icons/GeneralArrowUpRi";

export type AmountDetailsStatus = "Success" | "Pending" | "Failed";

export interface FlowpayAmountDetailsCardProps {
  label: string; // "Total Amount"
  amount: string | number;
  status: AmountDetailsStatus;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export default function FlowpayAmountDetailsCard({
  label = "Total Amount",
  amount,
  status,
  icon,
  onPress,
  className = "",
}: FlowpayAmountDetailsCardProps) {
  const { isDark } = useAuthTheme();

  const fallbackIconColor = isDark ? "#FFFFFF" : "#000000";

  // Match shadow styles from design system
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
    case "Success":
      statusBg = "bg-brand-green-500 dark:bg-brand-green-800";
      break;
    case "Pending":
      statusBg = "bg-brand-flashwhite";
      statusText = "text-brand-black dark:text-brand-green-800";
      break;
    case "Failed":
      statusBg = "bg-brand-red-500";
      break;
  }

  return (
    <Pressable onPress={onPress} className="w-full">
      <Card
        className={cn(
          "rounded-[30px] bg-brand-white dark:bg-brand-green-500 p-4 flex-row items-start justify-between border-0 w-full min-h-23",
          className,
        )}
        style={[{ borderCurve: "continuous" }, shadowStyle]}
      >
        <View className="flex-row items-start gap-x-2.5 flex-1">
          {/* Left Shape */}
          <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-brand-green-800">
            {icon ? (
              icon
            ) : (
              <GeneralWallet color={fallbackIconColor} width={23} height={23} />
            )}
          </View>

          <View className="flex-col items-start flex-1 gap-y-2.5 min-h-12.5">
            <View className="flex-col items-start gap-y-1.25">
              <Card.Description
                className="text-[16px] leading-5 text-brand-black dark:text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                numberOfLines={1}
              >
                {label}
              </Card.Description>
              <Card.Title
                className="text-h3 leading-7.5 text-brand-black dark:text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                numberOfLines={1}
              >
                {typeof amount === "number"
                  ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : amount}
              </Card.Title>
            </View>

            {/* Status Pill */}
            <View
              className={cn(
                "min-w-15 px-4 items-center justify-center rounded-[10px]",
                statusBg,
              )}
            >
              <Card.Title
                className={cn("text-body-xs leading-normal", statusText)}
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                {status}
              </Card.Title>
            </View>
          </View>
        </View>

        {/* Trailing Icon matching Figma's iconGeneralArrowUp */}
        <View className="pt-1.5">
          <GeneralArrowUpRi color={fallbackIconColor} width={24} height={24} />
        </View>
      </Card>
    </Pressable>
  );
}
