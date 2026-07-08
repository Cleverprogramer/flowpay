import React from "react";
import { View, Text, Pressable } from "react-native";
import { FormFieldLabel } from "@/components/ui/form-field-label";
import { useThemeColors } from "@/lib/use-theme-colors";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { GeneralChevronDo } from "./icons/GeneralChevronDo";

export interface FormDateFieldProps {
  label?: string;
  value: string | null;
  placeholder?: string;
  onPress: () => void;
}

/**
 * Molecule: A labeled date/time picker trigger that displays a formatted date
 * or a placeholder inside a pill.
 */
export const FormDateField: React.FC<FormDateFieldProps> = ({
  label = "Date&Time",
  value,
  placeholder = "Select Here",
  onPress,
}) => {
  const { iconColor } = useThemeColors();

  return (
    <View className="w-full flex-col gap-y-2.5">
      <FormFieldLabel>{label}</FormFieldLabel>
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between rounded-[30px] bg-brand-flashwhite dark:bg-dark-charcoal-green px-4 min-h-12"
      >
        <Text
          className="text-body-md text-brand-black dark:text-brand-white flex-1"
          style={{ fontFamily: ONBOARDING_FONT_FAMILY.regular }}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <GeneralChevronDo color={iconColor} width={24} height={24} />
      </Pressable>
    </View>
  );
};
