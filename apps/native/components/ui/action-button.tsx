import React from "react";
import { Button, cn } from "heroui-native";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";

interface ActionButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
  isDisabled?: boolean;
}

export default function ActionButton({
  label,
  variant = "primary",
  className,
  onPress,
  disabled,
  isDisabled,
  ...props
}: ActionButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-brand-green-500 dark:bg-dark-charcoal-green"
      : "bg-brand-flashwhite dark:bg-dark-green border border-[#D9D9D9] dark:border-transparent";

  const textClass =
    variant === "primary"
      ? "text-brand-white"
      : "text-brand-black dark:text-brand-white";

  return (
    <Button
      className={cn(
        "h-16.25 rounded-[50px] items-center justify-center",
        variantClass,
        className,
      )}
      isDisabled={disabled || isDisabled}
      onPress={onPress}
      {...props}
    >
      <Button.Label
        className={cn("text-base leading-5 text-center", textClass)}
        style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
      >
        {label}
      </Button.Label>
    </Button>
  );
}
