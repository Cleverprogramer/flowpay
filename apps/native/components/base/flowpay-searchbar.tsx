import {
  View,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import React from "react";
import { cn, SearchField, useThemeColor } from "heroui-native";
import useAuthTheme from "@/hooks/use-auth-theme";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { GeneralSearch } from "../ui/icons/GeneralSearch";
import { useThemeColors } from "@/lib/use-theme-colors";
import { GeneralSliders } from "../ui/icons/GeneralSliders";

interface FlowpaySearchBarProps extends TextInputProps {
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  containerClassName?: string;
  showFilter?: boolean;
}

export default function FlowpaySearchbar({
  onSearchPress,
  onFilterPress,
  containerStyle,
  containerClassName = "w-full mb-8 pt-1",
  showFilter = true,
  placeholder = "Search service,etc",
  value,
  onChangeText,
  ...props
}: FlowpaySearchBarProps) {
  const { isDark } = useAuthTheme();
  const { iconColor } = useThemeColors();

  return (
    <SearchField
      value={value}
      onChange={onChangeText}
      className={cn(containerClassName)}
      style={containerStyle}
    >
      <SearchField.Group className="flex-row items-center w-full h-15 bg-brand-flashwhite dark:bg-dark-charcoal-green rounded-3xl px-6">
        <SearchField.Input
          className="flex-1 text-[16px] text-brand-black dark:text-brand-white pr-3 bg-transparent border-0"
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#b0b0b0" : "#a1a1aa"}
          style={{
            fontFamily: ONBOARDING_FONT_FAMILY.regular,
            paddingVertical: 0,
          }}
          {...props}
        />
        <View className="flex-row items-center gap-x-5 border-0">
          <Pressable
            className="items-center justify-center border-0"
            onPress={onSearchPress}
          >
            <GeneralSearch color={iconColor} width={24} height={24} />
          </Pressable>
          {showFilter && (
            <Pressable
              className="items-center justify-center border-0"
              onPress={onFilterPress}
            >
              <GeneralSliders color={iconColor} width={24} height={24} />
            </Pressable>
          )}
        </View>
      </SearchField.Group>
    </SearchField>
  );
}
