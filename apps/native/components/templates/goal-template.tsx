import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Container } from "@/components/container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import {
  useGoals,
  useCreateGoal,
  useContributeToGoal,
} from "@/hooks/use-goals";

interface GoalRow {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  targetAmount: number;
  savedAmount: number;
  remaining: number;
  percentage: number;
  daysRemaining?: number | null;
  isCompleted: boolean;
}

const QUICK_AMOUNTS = [10, 25, 50, 100];

function GoalProgressBar({ percentage }: { percentage: number }) {
  return (
    <View className="h-2 w-full rounded-full bg-brand-flashwhite dark:bg-brand-green-800 overflow-hidden">
      <View
        className="h-2 rounded-full bg-brand-green-500"
        style={{ width: `${Math.max(percentage, 2)}%` }}
      />
    </View>
  );
}

export default function GoalTemplate() {
  const insets = useSafeAreaInsets();
  const { data: goalsResponse, isLoading } = useGoals();
  const goals = ((goalsResponse as any)?.data ?? []) as GoalRow[];

  const createGoal = useCreateGoal();
  const contribute = useContributeToGoal();

  const [isCreateVisible, setCreateVisible] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createTarget, setCreateTarget] = useState("");

  const [contributingId, setContributingId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  const handleCreate = () => {
    const target = Number(createTarget);
    if (!createName.trim() || !target || target <= 0) {
      Alert.alert("Missing info", "Add a name and a positive target amount.");
      return;
    }
    createGoal.mutate(
      { name: createName.trim(), targetAmount: target },
      {
        onSuccess: () => {
          setCreateVisible(false);
          setCreateName("");
          setCreateTarget("");
        },
        onError: () => Alert.alert("Error", "Could not create goal."),
      },
    );
  };

  const handleContribute = () => {
    if (!contributingId) return;
    const amount = Number(contributionAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Invalid amount", "Enter an amount greater than zero.");
      return;
    }
    contribute.mutate(
      { id: contributingId, amount },
      {
        onSuccess: () => {
          setContributingId(null);
          setContributionAmount("");
        },
        onError: () => Alert.alert("Error", "Could not contribute."),
      },
    );
  };

  const contributingGoal = goals.find((g) => g.id === contributingId);

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
            Savings Goals
          </Text>
          <Pressable
            onPress={() => setCreateVisible(true)}
            className="w-11 h-11 rounded-[40px] bg-brand-green-500 items-center justify-center"
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
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
            Total saved
          </Text>
          <Text
            className="text-[32px] leading-10 text-brand-white mt-1"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            ${totalSaved.toLocaleString()}
          </Text>
          <Text
            className="text-[13px] text-brand-white/80 mt-2"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          >
            of ${totalTarget.toLocaleString()} across{" "}
            {goals.length} goal{goals.length === 1 ? "" : "s"}
          </Text>
        </Card>

        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" />
          </View>
        ) : goals.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-[42px] mb-3">🎯</Text>
            <Text
              className="text-[15px] text-brand-grey dark:text-gray-400"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              No goals yet. Tap + to start saving!
            </Text>
          </View>
        ) : (
          <View className="flex-col gap-y-4">
            {goals.map((goal) => (
              <Card
                key={goal.id}
                className="rounded-[30px] bg-brand-white dark:bg-brand-green-500 p-4 border-0 w-full"
                style={{ borderCurve: "continuous" }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-x-3 flex-1">
                    <View className="w-11 h-11 rounded-[40px] bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center">
                      <Text className="text-[20px]">{goal.emoji ?? "🎯"}</Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[16px] text-brand-black dark:text-brand-white"
                        numberOfLines={1}
                        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                      >
                        {goal.name}
                      </Text>
                      <Text
                        className="text-[13px] text-brand-grey dark:text-gray-400"
                        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                      >
                        ${goal.savedAmount.toLocaleString()} of $
                        {goal.targetAmount.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  {goal.isCompleted ? (
                    <Text className="text-[20px]">🎉</Text>
                  ) : goal.daysRemaining != null ? (
                    <View className="rounded-full bg-brand-flashwhite dark:bg-brand-green-800 px-2.5 py-1">
                      <Text
                        className="text-[11px] text-brand-black dark:text-brand-white"
                        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                      >
                        {goal.daysRemaining}d left
                      </Text>
                    </View>
                  ) : null}
                </View>

                <GoalProgressBar percentage={goal.percentage} />

                <View className="flex-row items-center justify-between mt-2.5">
                  <Text
                    className="text-[12px] text-brand-grey dark:text-gray-400"
                    style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                  >
                    {goal.percentage}% complete
                  </Text>
                  {!goal.isCompleted && (
                    <Pressable
                      onPress={() => {
                        setContributingId(goal.id);
                        setContributionAmount("");
                      }}
                      className="rounded-full bg-brand-green-500 px-4 py-1.5"
                    >
                      <Text
                        className="text-[12px] text-brand-white"
                        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                      >
                        Add funds
                      </Text>
                    </Pressable>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={isCreateVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-brand-white dark:bg-brand-green-500 rounded-t-[30px] p-6 pb-10">
            <Text
              className="text-xl text-brand-black dark:text-brand-white mb-5"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              New savings goal
            </Text>

            <Text
              className="text-[13px] text-brand-grey dark:text-gray-400 mb-1.5"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              What are you saving for?
            </Text>
            <TextInput
              value={createName}
              onChangeText={setCreateName}
              placeholder="e.g. New laptop"
              placeholderTextColor="#9CA3AF"
              className="rounded-2xl bg-brand-flashwhite dark:bg-brand-green-800 p-4 text-brand-black dark:text-brand-white mb-4"
            />

            <Text
              className="text-[13px] text-brand-grey dark:text-gray-400 mb-1.5"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              Target amount ($)
            </Text>
            <TextInput
              value={createTarget}
              onChangeText={setCreateTarget}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              className="rounded-2xl bg-brand-flashwhite dark:bg-brand-green-800 p-4 text-brand-black dark:text-brand-white mb-6"
            />

            <View className="flex-row gap-x-3">
              <Pressable
                onPress={() => setCreateVisible(false)}
                className="flex-1 rounded-full bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center p-4"
              >
                <Text
                  className="text-[15px] text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCreate}
                disabled={createGoal.isPending}
                className="flex-1 rounded-full bg-brand-green-500 items-center justify-center p-4"
              >
                {createGoal.isPending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text
                    className="text-[15px] text-brand-white"
                    style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                  >
                    Create goal
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!contributingId} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-brand-white dark:bg-brand-green-500 rounded-t-[30px] p-6 pb-10">
            <Text
              className="text-xl text-brand-black dark:text-brand-white mb-1"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Add to {contributingGoal?.name ?? "goal"}
            </Text>
            <Text
              className="text-[13px] text-brand-grey dark:text-gray-400 mb-4"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              Currently at {contributingGoal?.percentage ?? 0}%
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-4">
              {QUICK_AMOUNTS.map((amount) => (
                <Pressable
                  key={amount}
                  onPress={() => setContributionAmount(String(amount))}
                  className="rounded-full bg-brand-flashwhite dark:bg-brand-green-800 px-4 py-2"
                >
                  <Text
                    className="text-[14px] text-brand-black dark:text-brand-white"
                    style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                  >
                    ${amount}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              value={contributionAmount}
              onChangeText={setContributionAmount}
              placeholder="Custom amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              className="rounded-2xl bg-brand-flashwhite dark:bg-brand-green-800 p-4 text-brand-black dark:text-brand-white mb-6"
            />

            <View className="flex-row gap-x-3">
              <Pressable
                onPress={() => setContributingId(null)}
                className="flex-1 rounded-full bg-brand-flashwhite dark:bg-brand-green-800 items-center justify-center p-4"
              >
                <Text
                  className="text-[15px] text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleContribute}
                disabled={contribute.isPending}
                className="flex-1 rounded-full bg-brand-green-500 items-center justify-center p-4"
              >
                {contribute.isPending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text
                    className="text-[15px] text-brand-white"
                    style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                  >
                    Add funds
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
