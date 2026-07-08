import React from "react";
import { View, Text, Pressable, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/lib/use-theme-colors";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

export interface FlowpayDateTimePickerProps {
  visible: boolean;
  value: Date;
  onDateChange: (date: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Organism: A cross-platform Date & Time picker.
 * iOS: Shows a modal with a spinner and Cancel/Done buttons.
 * Android: Shows the native picker directly.
 */
export const FlowpayDateTimePicker: React.FC<FlowpayDateTimePickerProps> = ({
  visible,
  value,
  onDateChange,
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useThemeColors();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={value}
        mode="datetime"
        onChange={(_, date) => {
          onCancel(); // close picker
          if (date) {
            onDateChange(date);
            onConfirm();
          }
        }}
      />
    );
  }

  // iOS
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-[#2222224d] justify-end">
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0"
          onPress={onCancel}
        />
        <View className="w-full bg-brand-white dark:bg-dark-charcoal-green rounded-t-[20px]">
          {/* Header with Cancel / Title / Done */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-[#444]">
            <Pressable onPress={onCancel} className="py-1 px-2">
              <Text
                className="text-[16px] text-brand-black dark:text-brand-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.regular }}
              >
                Cancel
              </Text>
            </Pressable>
            <Text
              className="text-[16px] text-brand-black dark:text-brand-white"
              style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
            >
              Select Date & Time
            </Text>
            <Pressable
              onPress={onConfirm}
              className="py-1 px-2"
            >
              <Text
                className="text-[16px] text-brand-green-500 dark:text-brand-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
              >
                Done
              </Text>
            </Pressable>
          </View>

          {/* Spinner */}
          <View style={{ height: 216 }}>
            <DateTimePicker
              value={value}
              mode="datetime"
              display="spinner"
              onChange={(_, date) => {
                if (date) onDateChange(date);
              }}
              themeVariant={isDark ? "dark" : "light"}
              style={{ height: 216 }}
            />
          </View>

          {/* Bottom safe area spacing */}
          <View style={{ height: insets.bottom + 16 }} />
        </View>
      </View>
    </Modal>
  );
};
