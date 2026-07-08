import { View, Text } from "react-native";
import React from "react";
import { FormFieldLabel } from "../ui/form-field-label";
import { FormFieldPill } from "../ui/form-field-pill";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface FormDisplayFieldProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export default function FormDisplayField({
  label,
  value,
  icon,
}: FormDisplayFieldProps) {
  return (
    <View className="flex-1 flex-col gap-y-2.5">
      <FormFieldLabel>{label}</FormFieldLabel>
      <FormFieldPill
        className={`${icon ? "flex-row items-center justify-between" : ""}`}
      >
        <Text
          className="text-body-sm leading-3.75 text-brand-black dark:text-brand-white flex-1"
          style={{
            fontFamily: icon
              ? ONBOARDING_FONT_FAMILY.regular
              : ONBOARDING_FONT_FAMILY.bold,
          }}
          numberOfLines={1}
        >
          {value}
        </Text>
        {icon}
      </FormFieldPill>
    </View>
  );
}
