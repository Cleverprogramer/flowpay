import { View, Text } from "react-native";
import React from "react";
import { Input, Label, TextField } from "heroui-native";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { useThemeColors } from "@/lib/use-theme-colors";

interface FormAmountInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function FormAmountInput({
  label,
  value,
  onChangeText,
  placeholder,
}: FormAmountInputProps) {
  const { isDark, iconColor } = useThemeColors();
  return (
    <TextField className="w-full flex-col gap-y-2.5">
      {label && (
        <Label>
          <Label.Text
            className="text-h4 text-brand-black dark:text-brand-white"
            style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold, lineHeight: 25 }}
          >
            {label}
          </Label.Text>
        </Label>
      )}
      <Input
        className="rounded-[30px] bg-brand-flashwhite dark:bg-dark-charcoal-green px-4 text-body-md min-h-12 border-0"
        style={{
          fontFamily: ONBOARDING_FONT_FAMILY.regular,
          color: iconColor,
        }}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#F0F0F0" : "#a1a1aa"}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
      />
    </TextField>
  );
}
