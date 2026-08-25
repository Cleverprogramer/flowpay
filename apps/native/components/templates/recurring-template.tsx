import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import { Container } from "@/components/container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import { format } from "date-fns";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import {
  useRecurringRules,
  useUpdateRecurringRule,
  useProcessDueRules,
} from "@/hooks/use-recurring-rules";

interface RuleRow {
  id: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  interval: "daily" | "weekly" | "monthly" | "yearly";
  nextRunAt: string;
  isActive: boolean;
  monthlyEquivalent?: number;
  daysUntilNextRun?: number;
}

const INTERVAL_LABELS: Record<RuleRow["interval"], string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function RecurringTemplate() {
  const insets = useSafeAreaInsets();
  const { data: rulesResponse, isLoading } = useRecurringRules();
  const rules = ((rulesResponse as any)?.data ?? []) as RuleRow[];

  const updateRule = useUpdateRecurringRule();
  const processDue = useProcessDueRules();

  const activeRules = rules.filter((rule) => rule.isActive);
  const totalMonthlyCost = rules
    .filter((rule) => rule.isActive && rule.type === "expense")
    .reduce((sum, rule) => sum + (rule.monthlyEquivalent ?? 0), 0);

  const handleProcessDue = () => {
    processDue.mutate(undefined, {
      onSuccess: (result: any) => {
        const created = result?.data?.createdTransactions ?? 0;
        Alert.alert(
          "Up to date",
          created > 0
            ? `Created ${created} transaction${created === 1 ? "" : "s"} from due rules.`
            : "Nothing was due right now.",
        );
      },
      onError: () => Alert.alert("Error", "Could not process rules."),
    });
  };

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
            Recurring
          </Text>
          <Pressable
            onPress={handleProcessDue}
            disabled={processDue.isPending}
            className="w-11 h-11 rounded-[40px] bg-brand-green-500 items-center justify-center"
          >
            {processDue.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="play" size={20} color="#FFFFFF" />
            )}
          </Pressable>
        </View>

        <Card
          className="rounded-[30px] bg-brand-green-500 p-5 border-0 w-full mb-7"
          style={{ borderCurve: "continuous" }}
        >
          <Text
            className="text-[13px] text-brand-white/80"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          >
            Monthly subscription cost
          </Text>
          <Text
            className="text-[32px] leading-10 text-brand-white mt-1"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            ${totalMonthlyCost.toLocaleString()}
          </Text>
          <Text
            className="text-[13px] text-brand-white/80 mt-2"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          >
            across {activeRules.length} active rule
            {activeRules.length === 1 ? "" : "s"}
          </Text>
        </Card>

        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" />
          </View>
        ) : rules.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-[42px] mb-3">🔁</Text>
            <Text
              className="text-[15px] text-brand-grey dark:text-gray-400 text-center px-8"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              No recurring transactions yet. Create rules for rent, salary, or
              subscriptions.
            </Text>
          </View>
        ) : (
          <View className="flex-col gap-y-4">
            {rules.map((rule) => (
              <Card
                key={rule.id}
                className={`rounded-[30px] bg-brand-white dark:bg-brand-green-500 p-4 border-0 w-full ${
                  rule.isActive ? "" : "opacity-60"
                }`}
                style={{ borderCurve: "continuous" }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-x-3 flex-1 pr-3">
                    <View className="w-11 h-11 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-brand-green-800">
                      <Ionicons
                        name={
                          rule.type === "income"
                            ? "arrow-down-circle-outline"
                            : "arrow-up-circle-outline"
                        }
                        size={22}
                        color={rule.type === "income" ? "#22c55e" : "#ef4444"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[16px] text-brand-black dark:text-brand-white"
                        numberOfLines={1}
                        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                      >
                        {rule.description}
                      </Text>
                      <Text
                        className="text-[13px] text-brand-grey dark:text-gray-400"
                        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                      >
                        ${Math.abs(rule.amount).toLocaleString()} ·{" "}
                        {INTERVAL_LABELS[rule.interval]}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() =>
                      updateRule.mutate({
                        id: rule.id,
                        isActive: !rule.isActive,
                      })
                    }
                    disabled={updateRule.isPending}
                    className={`rounded-full px-3.5 py-1.5 ${
                      rule.isActive
                        ? "bg-brand-flashwhite dark:bg-brand-green-800"
                        : "bg-brand-green-500"
                    }`}
                  >
                    <Text
                      className={`text-[12px] ${
                        rule.isActive
                          ? "text-brand-black dark:text-brand-white"
                          : "text-brand-white"
                      }`}
                      style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                    >
                      {rule.isActive ? "Pause" : "Resume"}
                    </Text>
                  </Pressable>
                </View>

                {rule.isActive && (
                  <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-brand-flashwhite dark:border-brand-green-800">
                    <Text
                      className="text-[12px] text-brand-grey dark:text-gray-400"
                      style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                    >
                      Next: {format(new Date(rule.nextRunAt), "MMM d, yyyy")}
                    </Text>
                    <View className="rounded-full bg-brand-flashwhite dark:bg-brand-green-800 px-2.5 py-1">
                      <Text
                        className="text-[11px] text-brand-black dark:text-brand-white"
                        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                      >
                        in {rule.daysUntilNextRun ?? 0}d
                      </Text>
                    </View>
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
}
