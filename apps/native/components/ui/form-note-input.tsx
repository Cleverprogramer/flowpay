import React from "react";
import { View } from "react-native";
import { TextArea } from "heroui-native";
import { FormFieldLabel } from "@/components/ui/form-field-label";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface FormNoteInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function FormNoteInput({
  value,
  onChangeText,
  placeholder = "Add any additional notes or terms...",
}: FormNoteInputProps) {
  return (
    <View className="flex-col gap-y-2.5">
      <FormFieldLabel>Note</FormFieldLabel>
      <TextArea
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="rounded-[30px] bg-brand-flashwhite dark:bg-dark-charcoal-green px-4 pt-4 pb-8 min-h-30 text-body-sm leading-3.75 text-brand-black dark:text-brand-white border-0 shadow-none focus:border-0"
        style={{
          fontFamily: ONBOARDING_FONT_FAMILY.regular,
          textAlignVertical: "top",
        }}
      />
    </View>
  );
}
