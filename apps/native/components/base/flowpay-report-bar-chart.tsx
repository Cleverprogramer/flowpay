import { View, Text } from "react-native";
import React from "react";
import { BarChartDataPoint } from "@/types/reports";
import useAuthTheme from "@/hooks/use-auth-theme";
import { cn } from "heroui-native";

interface FlowpayReportBarChartProps {
  data: BarChartDataPoint[];
  maxBarHeight?: number;
  variant?: "income" | "expense" | "overview";
  className?: string;
}

export default function FlowpayReportBarChart({
  data,
  maxBarHeight = 160,
  variant = "overview",
  className = "",
}: FlowpayReportBarChartProps) {
  const { isDark } = useAuthTheme();

  const maxValue = Math.max(...data.map((d: BarChartDataPoint) => d.value), 1);

  const getBarColor = (isHighest: boolean) => {
    if (variant === "income") {
      return isHighest
        ? isDark
          ? "#FFFFFF"
          : "#1C3E38"
        : isDark
          ? "#3A6B5E"
          : "#D4E8E3";
    }
    if (variant === "expense") {
      return isHighest
        ? isDark
          ? "#FFFFFF"
          : "#1C3E38"
        : isDark
          ? "#3A6B5E"
          : "#D4E8E3";
    }
    // overview
    return isHighest
      ? isDark
        ? "#FFFFFF"
        : "#1C3E38"
      : isDark
        ? "#3A6B5E"
        : "#D4E8E3";
  };

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <View className={cn("flex-row items-end justify-between ", className)}>
      {data.map((point, index) => {
        const barHeight = Math.max((point.value / maxValue) * maxBarHeight, 8);
        const isHighest = point.value === maxValue;
        const barColor = getBarColor(isHighest);

        return (
          <View
            key={`${point.label}-${index}`}
            className="flex-col items-center flex-1"
            style={{ gap: 6 }}
          >
            {/* Value label above bar */}
            {isHighest && (
              <Text
                className="text-body-xs text-brand-black dark:text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                {formatValue(point.value)}
              </Text>
            )}

            {/* Bar */}
            <View
              style={{
                height: barHeight,
                width: 28,
                borderRadius: 14,
                backgroundColor: barColor,
              }}
            />

            {/* Month label */}
            <Text
              className="text-body-xs leading-3.25 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              {point.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
