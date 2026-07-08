import {
  View,
  Text,
  useWindowDimensions,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthTheme from "@/hooks/use-auth-theme";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { Radio, RadioGroup, SearchField } from "heroui-native";
import AuthPrimaryButton from "@/components/base/auth-primary-button";

interface Country {
  name: string;
  code: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "France", code: "FR", flag: "🇫🇷" },
];

interface SelectCountryProps {
  onNext: (country: Country) => void;
  onBack: () => void;
}

export default function SelectCountry({ onNext, onBack }: SelectCountryProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark, colors } = useAuthTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState<string | undefined>(
    undefined,
  );
  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCode) ?? null;

  const contentWidth = useMemo(() => Math.min(346, width - 48), [width]);
  const ctaWidth = useMemo(() => Math.min(345, width - 48), [width]);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNext = () => {
    if (selectedCountry) {
      onNext(selectedCountry);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.screenBackground }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
      >
        <View style={{ width: contentWidth }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: colors.inputBackground,
            })}
          >
            <Ionicons name="arrow-back" size={28} color={colors.icon} />
          </Pressable>

          <View className="mt-7.5 gap-2.5">
            <Text
              className="text-h2 leading-8.75"
              style={{
                fontFamily: ONBOARDING_FONT_FAMILY.bold,
                color: colors.textPrimary,
              }}
            >
              Select your country
            </Text>
            <Text
              className="text-body-sm leading-3.75"
              style={{
                fontFamily: ONBOARDING_FONT_FAMILY.regular,
                color: colors.textSecondary,
              }}
            >
              Choose your country
            </Text>
          </View>
        </View>

        <View className="mt-5.5" style={{ width: contentWidth }}>
          <SearchField value={searchQuery} onChange={setSearchQuery}>
            <SearchField.Group>
              <SearchField.SearchIcon
                iconProps={{ size: 20, color: colors.inputPlaceholder }}
              />
              <SearchField.Input
                className="h-17.5 rounded-[15px]"
                placeholder="Search Your Country"
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </View>

        <RadioGroup
          value={selectedCode}
          onValueChange={setSelectedCode}
          variant="secondary"
          className="mt-5.5 gap-2.5"
          style={{ width: contentWidth }}
        >
          {filteredCountries.map((country) => (
            <RadioGroup.Item
              key={country.code}
              value={country.code}
              className="h-17.5 rounded-[15px] flex-row items-center justify-between px-5"
              style={{
                backgroundColor: colors.inputBackground,
                borderWidth: selectedCode === country.code ? 2 : 0,
                borderColor: colors.textPrimary,
              }}
            >
              <View className="flex-row items-center gap-3.25">
                <Text className="text-[30px]">{country.flag}</Text>
                <Text
                  className="text-body-sm leading-3.75"
                  style={{
                    fontFamily: ONBOARDING_FONT_FAMILY.medium,
                    color: colors.textPrimary,
                  }}
                >
                  {country.name}
                </Text>
              </View>
              <Radio />
            </RadioGroup.Item>
          ))}
        </RadioGroup>

        <View className="mt-5.5 gap-5.25" style={{ width: ctaWidth }}>
          <AuthPrimaryButton
            onPress={handleNext}
            disabled={!selectedCountry}
            label="Next"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
