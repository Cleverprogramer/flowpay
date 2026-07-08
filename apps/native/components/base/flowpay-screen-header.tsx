import { View, Text, Pressable } from "react-native";
import React from "react";
import { cn } from "heroui-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuthTheme from "@/hooks/use-auth-theme";

interface FlowpayScreenHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export default function FlowpayScreenHeader({
  title,
  rightElement,
  showBack = true,
  onBack,
  className,
}: FlowpayScreenHeaderProps) {
  const { isDark } = useAuthTheme();
  return (
    <View
      className={cn(
        "flex-row items-center justify-between w-full pt-1",
        className,
      )}
    >
      <View className="flex-row items-center gap-x-2.5">
        {showBack && (
          <Pressable
            onPress={() => {
              if (onBack) {
                onBack();
              } else {
                router.back();
              }
            }}
            className="w-12.5 h-12.5 rounded-[40px] bg-brand-flashwhite dark:bg-dark-charcoal-green items-center justify-center"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDark ? "#FFFFFF" : "#000000"}
            />
          </Pressable>
        )}
        <Text className="text-2xl font-bold text-brand-green-900 dark:text-brand-flashwhite">
          {title}
        </Text>
      </View>

      {/* Right Block */}
      {rightElement && (
        <View className="flex-row items-center gap-x-1.5">{rightElement}</View>
      )}
    </View>
  );
}
