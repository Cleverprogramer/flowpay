import {
  View,
  Text,
  Platform,
  ScrollView,
  useWindowDimensions,
  Pressable,
  TextInput,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import useAuthTheme from "@/hooks/use-auth-theme";
import { Controller, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import {
  FieldError,
  Input,
  InputGroup,
  TextField,
  useToast,
} from "heroui-native";
import { signInSchema } from "@flowpay/schema";
import z from "zod";
import { useSignIn } from "@/hooks/use-auth-session";
import AuthPrimaryButton from "@/components/base/auth-primary-button";
import AuthSeparator from "@/components/base/auth-separator";
import AuthSocialButtons from "@/components/base/auth-social-button";
import { AuthFooterLink } from "@/components/base/auth-footer-link";

type SignInValues = z.infer<typeof signInSchema>;

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export default function SignInTemplate() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { toast } = useToast();
  const { colors } = useAuthTheme();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const signin = useSignIn();

  const contentWith = useMemo(() => Math.min(346, width - 48), [width]);
  const ctaWidth = useMemo(() => Math.min(345, width - 48), [width]);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);
    setAuthError(null);

    const parsed = signInSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) {
          setError(err.path[0] as keyof SignInValues, {
            type: "manual",
            message: err.message,
          });
        }
      });
      return;
    }

    try {
      await signin.mutateAsync({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      reset();

      toast.show({
        variant: "success",
        label: "Signed in successfully!",
      });

      router.replace("/");
    } catch (error) {
      setAuthError(getAuthErrorMessage(error, "Invalid password or email"));
    }
  };

  const emailError = errors.email?.message
    ? String(errors.email.message)
    : authError;

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
        <View style={{ width: contentWith }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: colors.inputBackground,
            })}
          >
            <Ionicons name="arrow-back" size={28} color={colors.icon} />
          </Pressable>

          <View className="mt-5.5 gap-2.5">
            <Text
              className="text-h2 leading-8.75"
              style={{
                fontFamily: ONBOARDING_FONT_FAMILY.bold,
                color: colors.textPrimary,
              }}
            >
              Welcome back! 👋
            </Text>
            <Text
              className="text-body-sm leading.3.75"
              style={{
                fontFamily: ONBOARDING_FONT_FAMILY.regular,
                color: colors.textSecondary,
              }}
            >
              Sign in to your Flowpay account to continue tracking your finances
            </Text>
          </View>
        </View>

        <View className="mt-8.5 gap-3.5" style={{ width: contentWith }}>
          {/* Email Field */}
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField isInvalid={!!emailError}>
                <Input
                  ref={emailInputRef}
                  value={value}
                  onChangeText={(text) => {
                    setFormError(null);
                    setAuthError(null);
                    clearErrors("email");
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  placeholder="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  className="h-17.5 rounded-[15px] px-5 text-body-sm leading-3.75"
                  style={{
                    fontFamily: ONBOARDING_FONT_FAMILY.medium,
                    color: colors.textPrimary,
                  }}
                />
                {emailError ? <FieldError>{emailError}</FieldError> : null}
              </TextField>
            )}
          />

          {/* Password Field */}
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField isInvalid={!!errors.password}>
                <InputGroup>
                  <InputGroup.Input
                    ref={passwordInputRef}
                    value={value}
                    onChangeText={(text) => {
                      setFormError(null);
                      clearErrors("password");
                      onChange(text);
                    }}
                    onBlur={onBlur}
                    placeholder="Password"
                    secureTextEntry={!isPasswordVisible}
                    autoComplete="off"
                    textContentType="none"
                    autoCorrect={false}
                    spellCheck={false}
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    className="h-17.5 rounded-[15px] px-5 text-body-sm leading-3.75"
                    style={{
                      fontFamily: ONBOARDING_FONT_FAMILY.medium,
                      color: colors.textPrimary,
                    }}
                  />
                  <InputGroup.Suffix>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                      onPress={() =>
                        setIsPasswordVisible((current) => !current)
                      }
                    >
                      <Ionicons
                        name={
                          isPasswordVisible ? "eye-outline" : "eye-off-outline"
                        }
                        size={24}
                        color={colors.textSecondary}
                      />
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
                {errors.password?.message ? (
                  <FieldError>{String(errors.password.message)}</FieldError>
                ) : null}
              </TextField>
            )}
          />
        </View>

        <View className="mt-auto gap-5.25" style={{ width: ctaWidth }}>
          <AuthPrimaryButton
            onPress={handleSubmit(onSubmit)}
            label={isSubmitting ? "Signing in..." : "Sign In"}
            disabled={isSubmitting}
          />

          <AuthSeparator />

          <AuthSocialButtons
            onGooglePress={() =>
              toast.show({
                variant: "default",
                label: "Google sign in coming soon",
              })
            }
            onApplePress={() =>
              toast.show({
                variant: "default",
                label: "Apple sign in coming soon",
              })
            }
            onFacebookPress={() =>
              toast.show({
                variant: "default",
                label: "Facebook sign in coming soon",
              })
            }
          />

          <AuthFooterLink
            prefix="Don't have an account?"
            actionLabel="Create one here"
            onActionPress={() => router.replace("/sign-up")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
