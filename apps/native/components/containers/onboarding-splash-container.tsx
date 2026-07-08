import { useThemeColor } from "heroui-native";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "../ui/logo";
import { ONBOARDING_TEXT_STYLE } from "@/lib/const/onboarding-typography";

export default function OnboardingSplashContainer({ message }: { message: string }) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 28,
        paddingHorizontal: 24,
      }}
    >
      <View
        className="flex-1 items-center justify-center gap-6.5"
        style={{
          paddingBottom: 140,
        }}
      >
        <Logo size={1.25} color={foregroundColor} />
        <ActivityIndicator size="large" color={foregroundColor} />
      </View>

      <Text style={{ 
        ...ONBOARDING_TEXT_STYLE.splashMessage,
        color: foregroundColor,
        textAlign: "center",
      }}>
        {message}
      </Text>
    </View>
  );
}
