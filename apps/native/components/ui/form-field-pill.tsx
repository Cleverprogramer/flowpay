import React from "react";
import { View, type ViewProps } from "react-native";

export interface FormFieldPillProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Atom: The rounded pill container used for form fields (inputs, selects, display values).
 * Standardizes the rounded-[30px] bg pattern used throughout add transaction and similar forms.
 */
export const FormFieldPill: React.FC<FormFieldPillProps> = ({
  children,
  className = "",
  ...props
}) => (
  <View
    className={`rounded-[30px] bg-brand-flashwhite dark:bg-dark-charcoal-green px-4 py-4 ${className}`}
    {...props}
  >
    {children}
  </View>
);
