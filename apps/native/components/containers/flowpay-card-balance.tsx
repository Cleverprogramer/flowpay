import { View, Text } from "react-native";
import React from "react";
import { Card, cn } from "heroui-native";
import { CardOrnament } from "../ui/icons/card-ornament";
import useAuthTheme from "@/hooks/use-auth-theme";
import { GeneralArrowUpRi } from "../ui/icons/GeneralArrowUpRi";

interface FlowpayCardBalanceProps {
  totalBalance: number;
  earned: number;
  spent: number;
  available: number;
  savings: number;
  className?: string;
}

export default function FlowpayCardBalance({
  totalBalance,
  earned,
  spent,
  available,
  savings,
  className = "",
}: FlowpayCardBalanceProps) {
  const { isDark } = useAuthTheme();
  return (
    <Card
      className={cn(
        "relative rounded-[30px] bg-brand-green-500 w-full min-h-39.25 p-5 overflow-hidden border-0",
        className,
      )}
      style={{ borderCurve: "continuous" }}
    >
      <View className="absolute -top-1 -right-4">
        <CardOrnament
          color={isDark ? "#0F2723" : "#FFFFFF"}
          width={223}
          height={125}
        />
      </View>

      <Card.Body className="flex-col w-full h-full justify-between gap-y-6 flex-1 p-0">
        <View className="flex-row items-start justify-between w-full">
          <View className="flex-col items-start gap-y-1">
            <Card.Description
              className="text-brand-white text-base leading-5"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              Total Balance
            </Card.Description>
            <Card.Title
              className="text-brand-white! dark:text-brand-white text-h2 leading-8.75"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {typeof totalBalance === "number"
                ? `$${totalBalance.toLocaleString()}`
                : totalBalance}
            </Card.Title>
          </View>
          <GeneralArrowUpRi color="#FFFFFF" width={24} height={24} />
        </View>

        <View className="flex-row items-center justify-between w-full">
          {/* Earned */}
          <View className="flex-row items-center gap-x-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-brand-green-50" />
            <View className="flex-col items-start gap-y-0.5">
              <Card.Title
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                Earned
              </Card.Title>
              <Card.Description
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                {typeof earned === "number"
                  ? `$${earned.toLocaleString()}`
                  : earned}
              </Card.Description>
            </View>
          </View>

          {/* Spent */}
          <View className="flex-row items-center gap-x-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-brand-white" />
            <View className="flex-col items-start gap-y-0.5">
              <Card.Title
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                Spent
              </Card.Title>
              <Card.Description
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                {typeof spent === "number"
                  ? `$${spent.toLocaleString()}`
                  : spent}
              </Card.Description>
            </View>
          </View>

          {/* Available */}
          <View className="flex-row items-center gap-x-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-brand-white" />
            <View className="flex-col items-start gap-y-0.5">
              <Card.Title
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                Available
              </Card.Title>
              <Card.Description
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                {typeof available === "number"
                  ? `$${available.toLocaleString()}`
                  : available}
              </Card.Description>
            </View>
          </View>

          {/* Savings */}
          <View className="flex-row items-center gap-x-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-brand-white" />
            <View className="flex-col items-start gap-y-0.5">
              <Card.Title
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                Savings
              </Card.Title>
              <Card.Description
                className="text-brand-white! text-body-sm leading-3.75"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                {typeof savings === "number"
                  ? `$${savings.toLocaleString()}`
                  : savings}
              </Card.Description>
            </View>
          </View>
        </View>
      </Card.Body>
    </Card>
  );
}
