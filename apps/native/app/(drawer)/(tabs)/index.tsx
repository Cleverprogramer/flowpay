import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Container } from "@/components/container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthSession } from "@/hooks/use-auth-session";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { Link, router } from "expo-router";
import { GeneralSearch } from "@/components/ui/icons/GeneralSearch";
import { GeneralAlarm } from "@/components/ui/icons/GeneralAlarm";
import { Ionicons } from "@expo/vector-icons";
import FlowpayCardBalance from "@/components/containers/flowpay-card-balance";
import FlowpayIncomeExpense from "@/components/containers/flowpay-income-expense";
import FlowpayBudgetPlanCard from "@/components/containers/flowpay-budget-plan-card";
import { useThemeColors } from "@/lib/use-theme-colors";
import { useWallets } from "@/hooks/use-wallet";
import { useTransactionSummary } from "@/hooks/use-transactions";
import { useInvoices } from "@/hooks/use-invoice";
import { useGoals } from "@/hooks/use-goals";
import { useRecurringRules } from "@/hooks/use-recurring-rules";
import FlowpayInvoiceCard from "@/components/containers/flowpay-invoice-card";
import { format } from "date-fns";
import { InvoiceStatus } from "@/types/invoice";

const mapStatus = (status: string): InvoiceStatus => {
  switch (status) {
    case "paid":
      return "Paid";
    case "overdue":
      return "Overdue";
    case "cancelled":
      return "Cancel";
    default:
      return "Due";
  }
};

const MONTH_ABBRS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const currentMonthAbbr = MONTH_ABBRS[new Date().getMonth()];
  const [budgetMonth, setBudgetMonth] = useState(currentMonthAbbr);

  const { data: sessionData } = useAuthSession();
  const user = (sessionData as any)?.data?.user;
  const userName = user?.name || "User";
  const userImage = user?.image;
  const { iconColor } = useThemeColors();

  const monthDateRange = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, []);

  const { data: summaryResponse } = useTransactionSummary(monthDateRange);
  const summary = (summaryResponse as any)?.data as
    | {
        income: number;
        expense: number;
        balance: number;
        transactionCount: number;
      }
    | undefined;

  const monthlyIncome = summary?.income ?? 0;
  const monthlyExpense = summary?.expense ?? 0;

  const { data: walletsResponse } = useWallets();
  const wallets = walletsResponse?.data ?? [];

  const totalBalance = useMemo(() => {
    return wallets.reduce(
      (sum: number, w: any) => sum + Number(w.balance ?? 0),
      0,
    );
  }, [wallets]);

  const budgetDateRange = useMemo(() => {
    const monthIndex = MONTH_ABBRS.indexOf(budgetMonth);
    if (monthIndex === -1) return undefined;

    const year = new Date().getFullYear();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, [budgetMonth]);

  const { data: budgetSummaryResponse } =
    useTransactionSummary(budgetDateRange);
  const budgetSummary = budgetSummaryResponse?.data as
    | { income: number; expense: number; balance: number }
    | undefined;
  const budgetAvailable =
    (budgetSummary?.income ?? 0) - (budgetSummary?.expense ?? 0);

  const { data: invoicesResponse, isLoading: isLoadingInvoices } = useInvoices({
    limit: 3,
  });
  const recentInvoices = invoicesResponse?.data ?? [];

  const { data: goalsResponse } = useGoals();
  const goals = ((goalsResponse as any)?.data ?? []) as Array<{
    savedAmount: number;
    targetAmount: number;
  }>;
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const goalsPercentage =
    totalTarget > 0
      ? Math.min(100, Math.round((totalSaved / totalTarget) * 100))
      : 0;

  const { data: rulesResponse } = useRecurringRules();
  const recurringRules = ((rulesResponse as any)?.data ?? []) as Array<{
    isActive: boolean;
    type: string;
    monthlyEquivalent?: number;
  }>;
  const activeRuleCount = recurringRules.filter((rule) => rule.isActive).length;

  return (
    <Container className="p-4 md:p-6" isScrollable={false}>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-8 w-full pt-1">
          <View className="flex-row items-center gap-2.5">
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                className="w-12.5 h-12.5 rounded-[40px]"
                resizeMode="cover"
              />
            ) : (
              <View className="w-12.5 h-12.5 rounded-[40px] bg-brand-green-500 items-center justify-center">
                <Text
                  className="text-[22px] text-brand-white"
                  style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View className="flex-col justify-center gap-y-1">
              <Text
                className="text-[14px] leading-3.5 text-brand-black dark:text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                Welcome,
              </Text>
              <Text
                className="text-h4 leading-5 text-brand-black dark:text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                {userName}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-x-2.5">
            <Pressable className="w-12.5 h-12.5 rounded-[40px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center">
              <GeneralSearch color={iconColor} width={23} height={23} />
            </Pressable>
            <Link href="/notifications" asChild>
              <Pressable className="w-12.5 h-12.5 rounded-[40px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center">
                <GeneralAlarm color={iconColor} width={23} height={23} />
              </Pressable>
            </Link>
          </View>
        </View>

        <View className="flex-col w-full gap-y-2.5 mb-7">
          <FlowpayCardBalance
            totalBalance={totalBalance}
            earned={monthlyIncome}
            spent={monthlyExpense}
            available={totalBalance}
            savings={monthlyIncome - monthlyExpense}
          />
          <Pressable
            className="w-full bg-brand-green-500 items-center justify-center p-4 min-h-14.25"
            style={{ borderRadius: 50 }}
          >
            <Text
              className="text-[16px] leading-4.75 text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Scan here
            </Text>
          </Pressable>
        </View>

        <View className="flex-col w-full gap-y-2.5 mb-7">
          <Link href="/goals" asChild>
            <Pressable
              className="w-full rounded-[30px] bg-brand-flashwhite dark:bg-brand-green-800 p-4 border-0"
              style={{ borderCurve: "continuous" }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-x-3">
                  <Text className="text-[20px]">🎯</Text>
                  <Text
                    className="text-[16px] text-brand-black dark:text-brand-white"
                    style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                  >
                    Savings Goals
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={iconColor} />
              </View>
              <View className="h-1.5 w-full rounded-full bg-brand-white dark:bg-brand-green-500 overflow-hidden mb-1.5">
                <View
                  className="h-1.5 rounded-full bg-brand-green-500 dark:bg-brand-white"
                  style={{ width: `${Math.max(goalsPercentage, 2)}%` }}
                />
              </View>
              <Text
                className="text-[12px] text-brand-grey dark:text-gray-400"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                ${totalSaved.toLocaleString()} saved · {goalsPercentage}% of $
                {totalTarget.toLocaleString()}
              </Text>
            </Pressable>
          </Link>

          <Link href="/recurring" asChild>
            <Pressable
              className="w-full rounded-[30px] bg-brand-flashwhite dark:bg-brand-green-800 p-4 border-0"
              style={{ borderCurve: "continuous" }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-3">
                  <Text className="text-[20px]">🔁</Text>
                  <View>
                    <Text
                      className="text-[16px] text-brand-black dark:text-brand-white"
                      style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                    >
                      Recurring
                    </Text>
                    <Text
                      className="text-[12px] text-brand-grey dark:text-gray-400"
                      style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                    >
                      {activeRuleCount} active rule
                      {activeRuleCount === 1 ? "" : "s"}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={iconColor} />
              </View>
            </Pressable>
          </Link>

          <Link href="/insights" asChild>
            <Pressable
              className="w-full rounded-[30px] bg-brand-flashwhite dark:bg-brand-green-800 p-4 border-0"
              style={{ borderCurve: "continuous" }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-3">
                  <Text className="text-[20px]">💡</Text>
                  <View>
                    <Text
                      className="text-[16px] text-brand-black dark:text-brand-white"
                      style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                    >
                      Insights
                    </Text>
                    <Text
                      className="text-[12px] text-brand-grey dark:text-gray-400"
                      style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                    >
                      Savings rate, subscriptions & more
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={iconColor} />
              </View>
            </Pressable>
          </Link>

          <FlowpayIncomeExpense
            incomeAmount={monthlyIncome}
            expenseAmount={monthlyExpense}
            dateLabel="This month"
          />
          <FlowpayBudgetPlanCard
            month={budgetMonth}
            onMonthChange={setBudgetMonth}
            availableCash={budgetAvailable}
          />
        </View>

        <View className="flex-col w-full gap-y-2.5 mb-7">
          <View className="flex-row items-end justify-between w-full mb-1">
            <Text
              className="text-xl leading leading-6.25 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Invoice
            </Text>

            <Link href="/invoices" asChild>
              <Pressable>
                <Text
                  className="text-[14px] leading-3.75 text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                >
                  See all
                </Text>
              </Pressable>
            </Link>
          </View>

          {isLoadingInvoices ? (
            <View className="items-center py-6">
              <ActivityIndicator size="small" />
            </View>
          ) : recentInvoices.length === 0 ? (
            <View className="items-center py-6">
              <Text
                className="text-[13px] text-brand-grey dark:text-gray-400"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                No invoices yet
              </Text>
            </View>
          ) : (
            recentInvoices.map((inv: any) => (
              <FlowpayInvoiceCard
                key={inv.id}
                title={inv.clientName || inv.invoiceNumber}
                datetime={format(new Date(inv.createdAt), "yyyy-MM-dd HH:mm")}
                amount={inv.total}
                status={mapStatus(inv.status)}
                onPress={() => router.push(`/invoice/${inv.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
