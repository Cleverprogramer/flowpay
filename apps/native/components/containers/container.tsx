import {
  View,
  Text,
  ViewProps,
  ScrollViewProps,
  ScrollView,
} from "react-native";
import React, { PropsWithChildren } from "react";
import Animated, { AnimatedProps } from "react-native-reanimated";
import { cn } from "heroui-native";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = AnimatedProps<ViewProps> & {
  className?: string;
  isScrollable?: boolean;
  scrollViewProps?: Omit<ScrollViewProps, "contentContainerStyle">;
};

export default function Container(props: PropsWithChildren<Props>) {
  const { className, isScrollable, scrollViewProps, children } = props;
  return (
    <AnimatedView className={cn("flex-1 bg-background", className)} {...props}>
      {isScrollable ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </AnimatedView>
  );
}
