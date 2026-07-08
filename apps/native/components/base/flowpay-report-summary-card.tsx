import { View, Text, StyleProp, ViewStyle } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Card, cn } from "heroui-native";
import { GeneralArrowUpRi } from "../ui/icons/GeneralArrowUpRi";
import { GeneralWallet } from "../ui/icons/GeneralWallet";

interface FlowpayReportSummaryCardProps {
  leftTitle: string;
  leftValue: string | number;
  rightTitle: string;
  rightValue: string | number;
  type: "income" | "expense";
  className?: string;
}

export default function FlowpayReportSummaryCard({
  leftTitle,
  leftValue,
  rightTitle,
  rightValue,
  type,
  className = "",
}: FlowpayReportSummaryCardProps) {
  const { isDark } = useAuthTheme();
  const iconColor = isDark ? "#FFFFFF" : "#1C3E38";

  // Light mode shadow matching other Flowpay components
  const shadowStyle: StyleProp<ViewStyle> = !isDark
    ? {
        shadowColor: "rgba(139, 138, 138, 0.12)",
        shadowOffset: { width: -1, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 61,
        elevation: 10,
      }
    : {};

  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return `$${val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return val;
  };

  return (
    <View
      className={cn(
        "flex-row items-stretch justify-between w-full gap-x-2.5",
        className,
      )}
    >
      <Card
        className="flex-1 flex-col items-start bg-brand-white dark:bg-brand-green-500 rounded-[30px] py-5 px-4 gap-y-3 border-0"
        style={[{ borderCurve: "continuous" }, shadowStyle]}
      >
        {/* Icon Circle */}
        <View className="w-12.5 h-12.5 rounded-[25px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center">
          <View
            style={
              type === "income"
                ? { transform: [{ rotate: "180deg" }] }
                : undefined
            }
          >
            <GeneralArrowUpRi color={iconColor} width={24} height={24} />
          </View>
        </View>

        <Card.Body className="flex-col items-start gap-y-1 p-0">
          <Card.Description
            className="text-body-sm leading-3.75 text-brand-black dark:text-brand-white text-center"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            numberOfLines={1}
          >
            {leftTitle}
          </Card.Description>
          <Card.Title
            className="text-body-xl leading-5.5 text-brand-black dark:text-brand-white text-center"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            numberOfLines={1}
          >
            {formatValue(leftValue)}
          </Card.Title>
        </Card.Body>
      </Card>

      {/* Right Card */}
      <Card
        className="flex-1 flex-col items-start bg-brand-white dark:bg-brand-green-500 rounded-[30px] py-5 px-4 gap-y-3 border-0"
        style={[{ borderCurve: "continuous" }, shadowStyle]}
      >
        {/* Icon Circle */}
        <View className="w-12.5 h-12.5 rounded-[25px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center">
          <GeneralWallet color={iconColor} width={23} height={23} />
        </View>

        <Card.Body className="flex-col items-start gap-y-1 p-0">
          <Card.Description
            className="text-body-sm leading-3.75 text-brand-black dark:text-brand-white text-center"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            numberOfLines={1}
          >
            {rightTitle}
          </Card.Description>
          <Card.Title
            className="text-body-xl leading-5.5 text-brand-black dark:text-brand-white text-center"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            numberOfLines={1}
          >
            {formatValue(rightValue)}
          </Card.Title>
        </Card.Body>
      </Card>
    </View>
  );
}
