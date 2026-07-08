import { View, Text } from "react-native";
import React from "react";
import { Button } from "heroui-native";
import { Icon } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuthTheme from "@/hooks/use-auth-theme";
import SocialIconButton from "../ui/social-icon-button";

export default function AuthSocialButtons({
  onGooglePress,
  onApplePress,
  onFacebookPress,
}: {
  onGooglePress: () => void;
  onApplePress: () => void;
  onFacebookPress: () => void;
}) {
  const { colors } = useAuthTheme();
  return (
    <View className="flex-row items-center justify-between gap-3.5">
      <SocialIconButton
        iconName="logo-google"
        iconColor={colors.textPrimary}
        onPress={onGooglePress}
      />
      <SocialIconButton
        iconName="logo-apple"
        iconColor={colors.textPrimary}
        onPress={onApplePress}
      />
      <SocialIconButton
        iconName="logo-facebook"
        iconColor={colors.textPrimary}
        onPress={onFacebookPress}
      />
    </View>
  );
}
