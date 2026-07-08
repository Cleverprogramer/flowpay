import { View, Text, Pressable } from "react-native";
import React from "react";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface FilterPillProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function FilterPill({
  label,
  isSelected,
  onPress,
}: FilterPillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2.5 rounded-xl items-center justify-center mr-2 mb-2.5 border ${
        isSelected
          ? "bg-brand-green-500 dark:bg-brand-white border-transparent"
          : "bg-brand-flashwhite dark:bg-dark-charcoal-green border-transparent dark:border-[#3b82f633]"
      }`}
    >
      <Text
        className={`text-[13px] leading-3.75 font-bold ${
          isSelected
            ? "text-brand-white dark:text-dark-green"
            : "text-brand-black dark:text-brand-white"
        }`}
        style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
