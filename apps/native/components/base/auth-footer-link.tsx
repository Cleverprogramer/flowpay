import { View, Text, Pressable } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface AuthFooterLinkProps {
  prefix: string;
  actionLabel: string;
  onActionPress: () => void;
}

export function AuthFooterLink({
  prefix,
  actionLabel,
  onActionPress,
}: AuthFooterLinkProps) {
  const { colors } = useAuthTheme();

  return (
    <View className="h-4.5 flex-row items-center justify-center">
      <Text
        className="text-body-sm leading-3.75"
        style={{
          fontFamily: ONBOARDING_FONT_FAMILY.regular,
          color: colors.textPrimary,
        }}
      >
        {prefix}{" "}
      </Text>
      <Pressable onPress={onActionPress}>
        <Text
          className="text-body-sm leading-3.75"
          style={{
            fontFamily: ONBOARDING_FONT_FAMILY.bold,
            color: colors.textPrimary,
          }}
        >
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}
