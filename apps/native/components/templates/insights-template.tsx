import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Container } from "@/components/container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import {
  useSubscriptionInsight,
  useNoSpendInsight,
  useSavingsRate,
} from "@/hooks/use-insights-and-forecast";

function StatCard({
  label,
  value,
  sub,
  emoji,
}: {
  label: string;
  value: string;
  sub: string;
  emoji: string;
}) {
  return (
    <View className="flex-1 rounded-[30px] bg-brand-flashwhite dark:bg-brand-green-800 p-4">
      <Text className="text-[20px] mb-1">{emoji}</Text>
      <Text
        className="text-[22px] leading-6 text-brand-black dark:text-brand-white"
        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
      >
        {value}
      </Text>
      <Text
        className="text-[12px] text-brand-grey dark:text-gray-400 mt-0.5"
        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
      >
        {label}
      </Text>
      {!!sub && (
        <Text
          className="text-[11px] text-brand-grey dark:text-gray-400 mt-1"
          style={{ fontFamily: "PlusJakartaSans_400Regular" }}
        >
          {sub}
        </Text>
      )}
    </View>
  );
}

export default function InsightsTemplate() {
  const insets = useSafeAreaInsets();

  const { data: rateResponse, isLoading: rateLoading } = useSavingsRate();
  const { data: noSpendResponse } = useNoSpendInsight();
  const { data: subsResponse, isLoading: subsLoading } =
    useSubscriptionInsight();

  const savingsRate = (rateResponse as any)?.data as
    | {
        income: number;
        expense: number;
        saved: number;
        savingsRatePercentage: number | null;
      }
    | undefined;

  const noSpend = (noSpendResponse as any)?.data as
    | { noSpendDays: number; daysElapsed: number }
    | undefined;

  const subscriptions = ((subsResponse as any)?.data?.subscriptions ??
    []) as Array<{
    description: string;
    amount: number;
    interval: string;
    monthlyCost: number;
  }>;
  const totalMonthlyCost = (subsResponse as any)?.data?.totalMonthlyCost ?? 0;

  const rateValue = savingsRate?.savingsRatePercentage;
  const rateColor =
    rateValue == null
      ? "text-brand-black dark:text-brand-white"
      : rateValue >= 20
        ? "text-green-500"
        : rateValue >= 0
          ? "text-brand-black dark:text-brand-white"
          : "text-red-500";

  return (
    <Container className="p-4 md:p-6" isScrollable={false}>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-6 w-full pt-1">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 rounded-[40px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#16302B" />
          </Pressable>
          <Text
            className="text-h4 text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Insights
          </Text>
          <View className="w-11 h-11" />
        </View>

        <Card
          className="rounded-[30px] bg-brand-green-500 p-5 border-0 w-full mb-5"
          style={{ borderCurve: "continuous" }}
        >
          <Text
            className="text-[13px] text-brand-white/80"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          >
            Savings rate this month
          </Text>
          {rateLoading ? (
            <ActivityIndicator color="#FFFFFF" className="mt-3" />
          ) : (
            <>
              <Text
                className={`text-[44px] leading-[52px] mt-1 ${
                  rateValue != null && rateValue < 0
                    ? "text-red-400"
                    : "text-brand-white"
                }`}
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                {rateValue == null ? "—" : `${rateValue}%`}
              </Text>
              <Text
                className="text-[13px] text-brand-white/80 mt-1"
                style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              >
                ${savingsRate?.saved?.toLocaleString() ?? 0} kept from $
                {savingsRate?.income?.toLocaleString() ?? 0} earned
              </Text>
            </>
          )}
        </Card>

        <View className="flex-row gap-x-4 mb-5">
          <StatCard
            emoji="🧘"
            label="No-spend days"
            value={`${noSpend?.noSpendDays ?? 0}/${noSpend?.daysElapsed ?? 0}`}
            sub="days this month"
          />
          <StatCard
            emoji="🔁"
            label="Subscriptions"
            value={String(subscriptions.length)}
            sub={`$${totalMonthlyCost.toLocaleString()}/mo`}
          />
        </View>

        <Text
          className="text-xl text-brand-black dark:text-brand-white mb-3"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          Where money goes monthly
        </Text>

        {subsLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="small" />
          </View>
        ) : subscriptions.length === 0 ? (
          <View className="items-center py-8">
            <Text
              className="text-[14px] text-brand-grey dark:text-gray-400"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              No active recurring expenses yet
            </Text>
          </View>
        ) : (
          <View className="flex-col gap-y-2.5">
            {subscriptions.map((item) => {
              const shareOfTotal =
                totalMonthlyCost > 0
                  ? Math.round((item.monthlyCost / totalMonthlyCost) * 100)
                  : 0;
              return (
                <View
                  key={item.description}
                  className="rounded-[24px] bg-brand-flashwhite dark:bg-brand-green-800 p-4"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text
                      className="text-[15px] text-brand-black dark:text-brand-white flex-1 mr-2"
                      numberOfLines={1}
                      style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                    >
                      {item.description}
                    </Text>
                    <Text
                      className="text-[15px] text-brand-black dark:text-brand-white"
                      style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                    >
                      ${item.monthlyCost.toLocaleString()}/mo
                    </Text>
                  </View>
                  <View className="h-1.5 w-full rounded-full bg-brand-white dark:bg-brand-green-500 overflow-hidden">
                    <View
                      className="h-1.5 rounded-full bg-brand-green-500 dark:bg-brand-white"
                      style={{ width: `${Math.max(shareOfTotal, 3)}%` }}
                    />
                  </View>
                  <Text
                    className="text-[11px] text-brand-grey dark:text-gray-400 mt-1"
                    style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                  >
                    {item.interval} · {shareOfTotal}% of subscription spend
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Container>
  );
}
