import { View, Text, Pressable } from "react-native";
import React from "react";
import { Modal } from "react-native";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface FlowpayConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function FlowpayConfirmationModal({
  visible,
  onCancel,
  onConfirm,
  title = "Just to make sure your input!",
  description = "Please double check all the income details you have entered. Once submitted, this data will be saved to your tracker.",
}: FlowpayConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-[#2222224d] justify-end">
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0"
          onPress={onCancel}
        />
        <View className="w-full bg-brand-white dark:bg-dark-charcoal-green rounded-t-[40px] px-6 pt-11 pb-10 items-center">
          {/* Alert Icon */}
          <View className="w-20 h-20 rounded-[40px] border-[3px] border-brand-green-300 dark:border-brand-white items-center justify-center mb-6">
            <View className="w-12.5 h-12.5 rounded-[25px] bg-brand-flashwhite dark:bg-dark-green items-center justify-center">
              <Text className="text-h3">!</Text>
            </View>
          </View>

          {/* Heading */}
          <Text
            className="text-h3 leading-8 text-brand-black dark:text-brand-white text-center mb-4"
            style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
          >
            {title}
          </Text>

          {/* Description */}
          <Text
            className="text-[14px] leading-5 text-brand-black dark:text-brand-white text-center mb-8 px-4"
            style={{ fontFamily: ONBOARDING_FONT_FAMILY.regular }}
          >
            {description}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row w-full gap-x-4">
            <Pressable
              onPress={onCancel}
              className="flex-1 h-15 rounded-[50px] bg-brand-flashwhite dark:bg-dark-green items-center justify-center border border-[#D9D9D9] dark:border-transparent"
            >
              <Text
                className="text-[16px] leading-5 text-brand-black dark:text-brand-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 h-15 rounded-[50px] bg-brand-green-500 dark:bg-dark-green items-center justify-center"
            >
              <Text
                className="text-[16px] leading-5 text-brand-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
              >
                Confirm & Save
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
