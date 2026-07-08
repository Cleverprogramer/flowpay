import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Card, cn } from "heroui-native";

interface FlowpayProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onPress?: () => void;
  className?: string;
}

export default function FlowpayProfileCard({
  name,
  email,
  avatarUrl,
  onPress,
  className = "",
}: FlowpayProfileCardProps) {
  const { isDark } = useAuthTheme();
  const iconColor = isDark ? "#FFFFFF" : "#000000";
  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Pressable onPress={onPress} className="w-full">
      <Card
        className={cn(
          "rounded-[15px] bg-brand-flashwhite dark:bg-brand-green-500 p-4 flex-row items-center justify-between border-0 w-full",
          className,
        )}
        style={{ borderCurve: "continuous" }}
      >
        <View className="flex-row items-center gap-x-2.75 flex-1">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-12.5 h-12.5 rounded-[25px]"
              resizeMode="cover"
            />
          ) : (
            <View className="w-12.5 h-12.5 rounded-[25px] bg-brand-green-500 dark:bg-brand-green-800 items-center justify-center">
              <Text
                className="text-[22px] text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              >
                {firstLetter}
              </Text>
            </View>
          )}
          <View className="flex-col items-start gap-y-0.5 flex-1 pr-2">
            <Card.Title
              className="text-h4 leading-6.75 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              numberOfLines={1}
            >
              {name}
            </Card.Title>
            <Card.Description
              className="text-[14px] leading-4.75 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
              numberOfLines={1}
            >
              {email}
            </Card.Description>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
