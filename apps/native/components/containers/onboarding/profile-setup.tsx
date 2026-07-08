import {
  View,
  Text,
  useWindowDimensions,
  Platform,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React, { useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthTheme from "@/hooks/use-auth-theme";
import {
  Avatar,
  Checkbox,
  ControlField,
  Input,
  InputGroup,
} from "heroui-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { Ionicons } from "@expo/vector-icons";
import AuthPrimaryButton from "@/components/base/auth-primary-button";

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  country: Country;
}

interface ProfileSetupProps {
  userData: { name: string; email: string };
  country: Country;
  onNext: (data: ProfileData & { profileImage?: string }) => void;
  onBack: () => void;
}

export default function ProfileSetup({
  userData,
  country,
  onNext,
  onBack,
}: ProfileSetupProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark, colors } = useAuthTheme();

  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const contentWidth = useMemo(() => Math.min(346, width - 48), [width]);
  const ctaWidth = useMemo(() => Math.min(345, width - 48), [width]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (agreedToTerms) {
      onNext({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country,
        profileImage: profileImage || undefined,
      });
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
          alignItems: "center",
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
      >
        <View className="items-center gap-2.5" style={{ width: 327 }}>
          <Text
            className="text-h2 leading-8.75 text-center"
            style={{
              fontFamily: ONBOARDING_FONT_FAMILY.bold,
              color: colors.textPrimary,
            }}
          >
            Added Your Profile
          </Text>
          <Text
            className="text-body-sm leading-3.75 text-center"
            style={{
              fontFamily: ONBOARDING_FONT_FAMILY.regular,
              color: colors.textSecondary,
            }}
          >
            Complete your basic profile info
          </Text>
        </View>

        <View className="mt-5.5">
          <Pressable
            onPress={pickImage}
            className="items-center justify-center"
          >
            <Avatar className="w-25 h-25" alt="Profile Avatar">
              {profileImage ? (
                <Avatar.Image source={{ uri: profileImage }} asChild>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </Avatar.Image>
              ) : (
                <Avatar.Fallback>
                  <Ionicons
                    name="person-outline"
                    size={40}
                    color={colors.textSecondary}
                  />
                </Avatar.Fallback>
              )}
            </Avatar>
            <View
              className="absolute -bottom-1 -right-1 w-9.5 h-9.5 rounded-full items-center justify-center"
              style={{
                backgroundColor: colors.inputBackground,
                borderWidth: 3,
                borderColor: colors.screenBackground,
              }}
            >
              <Ionicons name="pencil-outline" size={18} color={colors.icon} />
            </View>
          </Pressable>
        </View>

        <View className="mt-5.5 gap-2.5" style={{ width: contentWidth }}>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            className="h-17.5 rounded-[15px] px-5 text-body-sm leading-3.75"
            style={{
              fontFamily: ONBOARDING_FONT_FAMILY.regular,
              color: colors.textPrimary,
            }}
          />

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            className="h-17.5 rounded-[15px] px-5 text-body-sm leading-3.75"
            style={{
              fontFamily: ONBOARDING_FONT_FAMILY.regular,
              color: colors.textPrimary,
            }}
          />

          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            autoCapitalize="none"
            autoComplete="tel"
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            className="h-17.5 rounded-[15px] px-5 text-body-sm leading-3.75"
            style={{
              fontFamily: ONBOARDING_FONT_FAMILY.regular,
              color: colors.textPrimary,
            }}
          />

          <InputGroup>
            <InputGroup.Input
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              textContentType="newPassword"
              className="h-17.5 rounded-[15px] px-5 text-body-sm leading-3.75"
              style={{
                fontFamily: ONBOARDING_FONT_FAMILY.regular,
                color: colors.textPrimary,
              }}
            />
            <InputGroup.Suffix>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                onPress={() => setShowPassword((current) => !current)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={colors.icon}
                />
              </Pressable>
            </InputGroup.Suffix>
          </InputGroup>
        </View>

        <View className="mt-5.25 gap-5.75" style={{ width: ctaWidth }}>
          <ControlField
            isSelected={agreedToTerms}
            onSelectedChange={setAgreedToTerms}
            className="flex-row items-center gap-1.25"
          >
            <ControlField.Indicator>
              <Checkbox variant="secondary" />
            </ControlField.Indicator>
            <Text
              className="text-body-sm leading-3.75 flex-1"
              style={{
                fontFamily: ONBOARDING_FONT_FAMILY.regular,
                color: colors.textPrimary,
              }}
            >
              By proceeding, you agree to our Terms & Privacy Policy
            </Text>
          </ControlField>

          <AuthPrimaryButton
            onPress={handleSubmit}
            disabled={!agreedToTerms || !name || !email}
            label="Finish"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
