import { Pressable } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";

export default function SocialIconButton({
  iconName,
  iconColor,
  onPress,
}: {
  iconName: "logo-google" | "logo-apple" | "logo-facebook";
  iconColor?: string;
  onPress: () => void;
}) {
  const { colors } = useAuthTheme();
  const resolvedIconColor = iconColor ?? colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      className="h-17.5 flex-1 rounded-full items-center justify-center"
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        backgroundColor: colors.socialBackground,
      })}
    >
      <Ionicons name={iconName} size={24} color={resolvedIconColor} />
    </Pressable>
  );
}
