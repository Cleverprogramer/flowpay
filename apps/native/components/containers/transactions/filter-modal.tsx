import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import React from "react";
import { useThemeColors } from "@/lib/use-theme-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { GeneralFilter } from "@/components/ui/icons/GeneralFilter";
import { GeneralSetting } from "@/components/ui/icons/GeneralSetting";

interface FlowpayFilterModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  onApplyUrl?: string; // Optional URL logic or generic apply handler
  onApply: () => void;
  children: React.ReactNode;
}

export default function FilterModal({
  visible,
  onClose,
  title,
  onApplyUrl,
  onApply,
  children,
}: FlowpayFilterModalProps) {
  const { iconColor, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#2222224d] justify-end">
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0"
          onPress={onClose}
        />
        <View
          className="w-full bg-brand-white dark:bg-dark-green rounded-t-[40px] px-5 flex-1 mt-25"
          style={{ paddingBottom: insets.bottom + 20, paddingTop: 30 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8 pb-2">
            <View className="flex-row items-center gap-x-2.5">
              <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green">
                <GeneralFilter color={iconColor} width={24} height={24} />
              </View>
              <Text
                className="text-h3 leading-7.5 font-bold text-brand-black dark:text-brand-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
              >
                {title}
              </Text>
            </View>
            <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-[#0C8CE9] overflow-hidden shadow-lg border border-[#3b82f633]">
              <Pressable
                onPress={onClose}
                className="w-full h-full items-center justify-center"
              >
                <GeneralSetting color="#FFFFFF" width={24} height={24} />
              </Pressable>
            </View>
          </View>

          {/* Children / Sections */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 mb-7.5"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {children}
          </ScrollView>

          {/* Apply Button */}
          <Pressable
            onPress={onApply}
            className="w-full py-4 items-center justify-center rounded-full bg-brand-green-500 dark:bg-transparent border dark:border-brand-green-300"
          >
            <Text
              className="text-brand-white text-[16px] leading-5 font-bold"
              style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
            >
              Set Now
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
