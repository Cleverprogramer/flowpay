import React from "react";
import {
  Button as HeroButton,
  type ButtonRootProps as HeroButtonProps,
  Spinner,
} from "heroui-native";
import { tv, type VariantProps } from "tailwind-variants";

/**
 * Flowpay Button Variants using tailwind-variants
 * Matches Figma designs and maintains consistency with FlowpayInput:
 * - Rounded 15px with continuous border curve
 * - Height matching inputs (70px for large)
 * - Typography: Plus Jakarta Sans Bold
 */
const buttonVariants = tv({
  base: "flex-row items-center justify-center active:opacity-80",
  variants: {
    variant: {
      solid: "",
      light: "bg-transparent",
      outline: "border bg-transparent",
      ghost: "bg-transparent",
    },
    color: {
      primary: "",
      secondary: "",
      success: "",
      danger: "",
      default: "",
    },
    size: {
      sm: "h-[45px] px-4",
      md: "h-[60px] px-[32px]",
      lg: "h-[70px] px-[40px]",
      icon: "h-[70px] w-[70px] p-0 items-center justify-center",
    },
    radius: {
      square: "rounded-[25px]",
      circle: "rounded-full",
      none: "rounded-none",
    },
    fullWidth: {
      true: "w-full",
    },
    isIconOnly: {
      true: "aspect-square p-0 items-center justify-center",
    },
  },
  compoundVariants: [
    // Solid Primary (Green 500: #1C3E38)
    {
      variant: "solid",
      color: "primary",
      class: "bg-brand-green-500",
    },
    // Solid Secondary (Flash White: #F0F0F0 -> Dark Green 500)
    {
      variant: "solid",
      color: "secondary",
      class: "bg-brand-flashwhite dark:bg-brand-green-500",
    },
    // Solid Default
    {
      variant: "solid",
      color: "default",
      class: "bg-brand-flashwhite dark:bg-brand-green-500",
    },
    // Light variants map to Figma's "White Neutral"
    {
      variant: "light",
      color: "primary",
      class: "bg-brand-flashwhite dark:bg-brand-green-500",
    },
    {
      variant: "light",
      color: "secondary",
      class: "bg-brand-flashwhite dark:bg-brand-green-500",
    },
    {
      variant: "light",
      color: "default",
      class: "bg-brand-flashwhite dark:bg-brand-green-500",
    },
    // Outline Primary
    {
      variant: "outline",
      color: "primary",
      class: "border-brand-green-500",
    },
    // Outline Default (Grey/Black: #333333 / #000000)
    {
      variant: "outline",
      color: "default",
      class: "border-brand-grey dark:border-brand-white",
    },
    // Danger
    {
      variant: "solid",
      color: "danger",
      class: "bg-brand-red-500",
    },
  ],
  defaultVariants: {
    variant: "solid",
    color: "primary",
    size: "lg",
    radius: "square",
  },
});

/**
 * Text Variants for the Button Label
 */
const textVariants = tv({
  base: "font-bold text-center",
  variants: {
    variant: {
      solid: "",
      light: "",
      outline: "",
      ghost: "",
    },
    color: {
      primary: "",
      secondary: "",
      success: "",
      danger: "",
      default: "",
    },
    size: {
      sm: "text-[12px] leading-[15px]",
      md: "text-[14px] leading-[18px]",
      lg: "text-[16px] leading-[20px]",
      icon: "",
    },
  },
  compoundVariants: [
    // Solid Primary Text (White)
    {
      variant: "solid",
      color: "primary",
      class: "text-white",
    },
    // Solid Secondary Text (Black -> White)
    {
      variant: "solid",
      color: "secondary",
      class: "text-brand-black dark:text-brand-white",
    },
    {
      variant: "solid",
      color: "default",
      class: "text-brand-black dark:text-brand-white",
    },
    // Outline Text
    {
      variant: "outline",
      color: "primary",
      class: "text-brand-black dark:text-brand-white",
    },
    {
      variant: "outline",
      color: "default",
      class: "text-brand-black dark:text-brand-white",
    },
    // Light / Ghost text
    {
      variant: "light",
      color: "primary",
      class: "text-brand-black dark:text-brand-white",
    },
    {
      variant: "light",
      color: "secondary",
      class: "text-brand-black dark:text-brand-white",
    },
    {
      variant: "light",
      color: "default",
      class: "text-brand-black dark:text-brand-white",
    },
    {
      variant: "ghost",
      color: "primary",
      class: "text-brand-black dark:text-brand-white",
    },
    {
      variant: "ghost",
      color: "default",
      class: "text-brand-black dark:text-brand-white",
    },
    // Danger Text
    {
      variant: "solid",
      color: "danger",
      class: "text-white",
    },
  ],
  defaultVariants: {
    variant: "solid",
    color: "primary",
    size: "lg",
  },
});

export interface FlowpayButtonProps
  extends
    Omit<HeroButtonProps, "variant" | "color" | "size" | "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode | ((state: any) => React.ReactNode);
  textClassName?: string;
  isLoading?: boolean;
}

/**
 * A reusable Button component following the Flowpay Design System.
 * Consistent with FlowpayInput and FlowpayInputOTP.
 */
const ButtonInner = React.forwardRef<any, FlowpayButtonProps>(
  (
    {
      className,
      variant,
      color,
      size,
      radius,
      fullWidth,
      isIconOnly,
      children,
      textClassName,
      style,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const buttonClass = buttonVariants({
      variant,
      color,
      size: isIconOnly ? "icon" : size,
      radius,
      fullWidth,
      isIconOnly,
      className,
    });

    const textClass = textVariants({
      variant,
      color,
      size: isIconOnly ? "icon" : size,
      className: textClassName,
    });

    const spinnerColor =
      color === "danger"
        ? "danger"
        : color === "success"
          ? "success"
          : "default";

    return (
      // @ts-expect-error Types mismatched from heroui-native
      <HeroButton
        ref={ref}
        className={buttonClass}
        style={[
          {
            borderCurve: "continuous",
          },
          style,
        ]}
        isDisabled={isLoading || props.isDisabled}
        feedbackVariant={
          (props.feedbackVariant || "scale") as
            | "scale"
            | "scale-ripple"
            | "scale-highlight"
            | "none"
        }
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" color={spinnerColor as any} />
        ) : typeof children === "function" ? (
          children({})
        ) : React.isValidElement(children) ? (
          children.type === HeroButton.Label ? (
            React.cloneElement(children as React.ReactElement<any>, {
              className: [textClass, (children.props as any)?.className]
                .filter(Boolean)
                .join(" "),
              style: [
                {
                  fontFamily: "PlusJakartaSans_700Bold",
                },
                (children.props as any)?.style,
              ],
            })
          ) : (
            children
          )
        ) : (
          <HeroButton.Label
            className={textClass}
            style={{
              fontFamily: "PlusJakartaSans_700Bold",
            }}
          >
            {children}
          </HeroButton.Label>
        )}
      </HeroButton>
    );
  },
);

export type FlowpayButtonType = typeof ButtonInner & {
  Label: typeof HeroButton.Label;
};

export const FlowpayButton = Object.assign(ButtonInner, {
  Label: HeroButton.Label,
}) as FlowpayButtonType;

FlowpayButton.displayName = "FlowpayButton";

// Also export as Button for backward compatibility
export const Button = FlowpayButton;
