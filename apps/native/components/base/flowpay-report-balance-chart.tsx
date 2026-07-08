import { View, Text, StyleProp, ViewStyle, Pressable } from "react-native";
import React from "react";
import { BarChartDataPoint } from "@/types/reports";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Card, cn } from "heroui-native";
import { GeneralOption } from "../ui/icons/GeneralOption";
import FlowpayReportBarChart from "./flowpay-report-bar-chart";

interface FlowpayReportBalanceChartProps {
  balance: number;
  changeLabel?: string;
  periodLabel?: string;
  chartData: BarChartDataPoint[];
  onMenuPress?: () => void;
  className?: string;
}

export default function FlowpayReportBalanceChart({
  balance,
  changeLabel = "+5%",
  periodLabel = "For this month",
  chartData,
  onMenuPress,
  className = "",
}: FlowpayReportBalanceChartProps) {
  const { isDark } = useAuthTheme();

  const iconColor = isDark ? "#FFFFFF" : "#000000";

  const shadowStyle: StyleProp<ViewStyle> = !isDark
    ? {
        shadowColor: "rgba(139, 138, 138, 0.12)",
        shadowOffset: { width: -1, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 61,
        elevation: 10,
      }
    : {};

  const formatBalance = (val: string | number) => {
    if (typeof val === "number") {
      return `$${val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return val;
  };

  return (
    <Card
      className={cn(
        "w-full bg-brand-white dark:bg-brand-green-500 rounded-[30px] border-0 p-5",
        className,
      )}
      style={[{ borderCurve: "continuous" }, shadowStyle]}
    >
      <Card.Body className="flex-col gap-y-4 p-0">
        <View className="flex-row items-center justify-between w-full">
          <Card.Title
            className="text-[14px] leading-4.5 text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Income & Expense Balance
          </Card.Title>
          <Pressable onPress={onMenuPress} hitSlop={8}>
            <GeneralOption color={iconColor} width={20} height={20} />
          </Pressable>
        </View>

        <Card.Title
          className="text-h2 leading-8.75 text-brand-black dark:text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          {formatBalance(balance)}
        </Card.Title>

        {/* Change indicator */}
        <View className="flex-row items-center gap-x-2">
          <View className="bg-brand-green-50 dark:bg-brand-green-800 rounded-[20px] px-3 py-1">
            <Card.Description
              className="text-body-xs leading-3.25 text-brand-green-500 dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {changeLabel}
            </Card.Description>
          </View>
          <Card.Description
            className="text-body-xs leading-3.25 text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          >
            {periodLabel}
          </Card.Description>
        </View>

        {/* Bar Chart */}
        <FlowpayReportBarChart
          data={chartData}
          variant="overview"
          maxBarHeight={140}
        />
      </Card.Body>
    </Card>
  );
}
