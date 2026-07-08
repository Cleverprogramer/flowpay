import { View, Text } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

export default function AuthSeparator({
  label = "Or Use With",
}: {
  label?: string;
}) {
  const { colors } = useAuthTheme();
  return (
    <View className="flex-row items-center gap-4.5">
      <View
        className="h-px flex-1"
        style={{ backgroundColor: colors.separator }}
      />
      <Text
        className="text-body-sm leading-3.75"
        style={{
          fontFamily: ONBOARDING_FONT_FAMILY.regular,
          color: colors.textSecondary,
        }}
      >
        {label}
      </Text>
      <View
        className="h-px flex-1"
        style={{ backgroundColor: colors.separator }}
      />
    </View>
  );
}
