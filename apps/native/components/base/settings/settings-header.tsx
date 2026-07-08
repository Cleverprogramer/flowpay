import { View, Text, Pressable } from "react-native";
import React from "react";
import { GeneralChevronRi } from "@/components/ui/icons/GeneralChevronRi";

interface SettingsHeaderProps {
  title: string;
  onBack?: () => void;
  iconColor: string;
}

export default function SettingsHeader({
  title,
  onBack,
  iconColor,
}: SettingsHeaderProps) {
  return (
    <View className="flex-row items-center gap-x-2.5 mb-6 w-full pt-1">
      {onBack && (
        <Pressable
          onPress={onBack}
          className="w-12.5 h-12.5 rounded-[40px] bg-brand-flashwhite dark:bg-dark-charcoal-green items-center justify-center"
        >
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <GeneralChevronRi color={iconColor} width={23} height={23} />
          </View>
        </Pressable>
      )}
      <Text
        className="text-h3 leading-7.5 text-brand-black dark:text-brand-white"
        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
      >
        {title}
      </Text>
    </View>
  );
}
