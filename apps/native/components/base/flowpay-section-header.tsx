import { View, Text, Pressable } from "react-native";
import React from "react";
import { cn } from "heroui-native";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface FlowpaySectionHeaderProps {
  title: string;
  rightTitle?: string;
  rightTitleClassName?: string;
  onRightPress?: () => void;
  className?: string;
}

export default function FlowpaySectionHeader({
  title,
  rightTitle,
  rightTitleClassName = "text-brand-white",
  onRightPress,
  className = "mb-4 mt-6",
}: FlowpaySectionHeaderProps) {
  return (
    <View className={cn("flex-row items-end justify-between px-1", className)}>
      <Text
        className="text-h4 leading-6.25 text-brand-black dark:text-brand-white"
        style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
      >
        {title}
      </Text>

      {rightTitle && (
        <Pressable onPress={onRightPress} disabled={!onRightPress}>
          <Text
            className={`text-[14px] leading-4.5 ${rightTitleClassName}`}
            style={{ fontFamily: ONBOARDING_FONT_FAMILY.medium }}
          >
            {rightTitle}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
