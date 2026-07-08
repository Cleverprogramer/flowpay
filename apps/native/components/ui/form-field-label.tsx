import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import React from "react";
import { Text } from "react-native";

export interface FormFieldLabelProps {
  children: string;
  className?: string;
}

/**
 * Atom: A consistent label used above form fields throughout the app.
 */
export const FormFieldLabel: React.FC<FormFieldLabelProps> = ({
  children,
  className = "",
}) => (
  <Text
    className={`text-h4 leading-6.25 text-brand-black dark:text-brand-white ${className}`}
    style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
  >
    {children}
  </Text>
);
