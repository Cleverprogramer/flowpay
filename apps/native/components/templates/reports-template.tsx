import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Container } from "../container";
import FlowpayScreenHeader from "../base/flowpay-screen-header";
import { GeneralOption } from "../ui/icons/GeneralOption";
import { cn } from "heroui-native";
import DashboardOverview from "../containers/reports/dashboard-overview";
import IncomeActivity from "../containers/reports/income-activity";
import ExpenseActivity from "../containers/reports/expense-activity";

type ReportTab = "overview" | "income" | "expense";

export default function ReportsTemplate() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAuthTheme();
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");

  const iconColor = isDark ? "#FFFFFF" : "#000000";

  const getTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Your Insight";
      case "income":
        return "Income Activity";
      case "expense":
        return "Expense Activity";
    }
  };

  const tabs: { key: ReportTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "income", label: "Income" },
    { key: "expense", label: "Expense" },
  ];

  return (
    <Container className="p-4" isScrollable={false}>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 w-full">
          <FlowpayScreenHeader
            showBack={false}
            className="pt-0"
            title={getTitle()}
            rightElement={
              activeTab !== "overview" ? (
                <Pressable
                  hitSlop={8}
                  className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-brand-green-800"
                >
                  <GeneralOption color={iconColor} width={24} height={24} />
                </Pressable>
              ) : undefined
            }
          />
        </View>

        <View className="flex-row items-center bg-brand-flashwhite dark:bg-brand-green-800 rounded-[30px] p-1 mb-6 w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 items-center justify-center py-3 rounded-[30px]",
                  isActive
                    ? "bg-brand-green-500 dark:bg-brand-green-500"
                    : "bg-transparent",
                )}
              >
                <Text
                  className={cn(
                    "text-body-sm leading-3.75",
                    isActive
                      ? "text-brand-white"
                      : "text-brand-black dark:text-brand-white",
                  )}
                  style={{
                    fontFamily: isActive
                      ? "PlusJakartaSans_700Bold"
                      : "PlusJakartaSans_400Regular",
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Tab Content */}
        {activeTab === "overview" && <DashboardOverview />}
        {activeTab === "income" && <IncomeActivity />}
        {activeTab === "expense" && <ExpenseActivity />}
      </ScrollView>
    </Container>
  );
}
