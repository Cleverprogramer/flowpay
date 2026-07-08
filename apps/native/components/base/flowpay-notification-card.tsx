import { View, Text } from "react-native";
import React from "react";
import useAuthTheme from "@/hooks/use-auth-theme";

interface FlowpayNotificationCardProps {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  isUnread?: boolean;
}

export default function FlowpayNotificationCard({
  title,
  description,
  time,
  icon,
  isUnread = false,
}: FlowpayNotificationCardProps) {
  const { isDark } = useAuthTheme();
  return (
    <View
      className="flex-row items-center justify-between w-full bg-brand-flashwhite dark:bg-dark-charcoal-green rounded-[30px] p-4 mb-2.5"
      style={{
        shadowColor: isDark ? "transparent" : "rgba(139, 138, 138, 0.12)",
        shadowOffset: { width: -1, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 61,
        elevation: isDark ? 0 : 5,
      }}
    >
      <View className="flex-row items-center gap-x-3 flex-1">
        {/* Unread Indicator */}
        {isUnread && (
          <View className="w-2.5 h-2.5 rounded-[5px] bg-brand-red-500" />
        )}

        {/* Icon Container */}
        <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-white dark:bg-dark-green">
          {icon}
        </View>

        {/* Text Content */}
        <View className="flex-col gap-y-1 flex-1 pr-2">
          <Text
            className="text-[16px] leading-5 font-bold text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="text-body-sm leading-3.75 text-[#A3A3A3] dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            numberOfLines={1}
          >
            {description}
          </Text>
        </View>
      </View>

      {/* Timestamp */}
      <Text
        className="text-body-xs leading-3.25 text-[#A3A3A3] dark:text-brand-white w-13.75 text-right"
        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
      >
        {time}
      </Text>
    </View>
  );
}
