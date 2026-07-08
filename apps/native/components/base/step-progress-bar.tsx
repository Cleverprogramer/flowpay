import { TransactionStep } from "@/types/transactions";

export interface StepProgressBarProps {
  currentStep: TransactionStep;
}

const STEPS = [
  { number: 1, label: "Type Choose" },
  { number: 2, label: "Add Form" },
  { number: 3, label: "Confirmation" },
];

import { View, Text } from "react-native";
import React from "react";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { cn } from "heroui-native";

export default function StepProgressBar({ currentStep }: StepProgressBarProps) {
  return (
    <View className="flex-row items-center gap-x-1.25 px-4.5 mt-5.5">
      {STEPS.map((step) => {
        const isActive = step.number <= currentStep;
        return (
          <View key={step.number} className="flex-1 flex-col gap-y-2.5">
            <View
              className={cn(
                "h-2.5 rounded-[30px]",
                isActive
                  ? "bg-dark-charcoal-green dark:bg-dark-charcoal-green"
                  : "bg-[#677e7a]",
              )}
            />
            <Text
              className="text-body-sm leading-4.25 text-brand-black dark:text-brand-white"
              style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
              numberOfLines={1}
            >
              {step.number}. {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
