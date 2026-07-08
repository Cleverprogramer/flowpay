import { View, Text, Pressable } from "react-native";
import React, { ReactNode } from "react";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface AuthRowProps {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
}

export default function AuthRow({
  label,
  icon,
  onPress,
  backgroundColor,
  textColor,
}: AuthRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-22 rounded-2xl px-8 flex-row items-center"
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        backgroundColor,
      })}
    >
      <View className="w-8 items-center">{icon}</View>
      <Text
        className="ml-8 text-base leading-5"
        style={{ fontFamily: ONBOARDING_FONT_FAMILY.regular, color: textColor }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
