import { View, Text } from "react-native";
import React from "react";

export default function PeriodBadge({ label }: { label: string }) {
  return (
    <View className="self-end bg-brand-flashwhite dark:bg-brand-green-800 rounded-[20px] px-3 py-1.5">
      <Text
        className="text-body-xs leading-3.25 text-brand-black dark:text-brand-white"
        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
      >
        {label}
      </Text>
    </View>
  );
}
