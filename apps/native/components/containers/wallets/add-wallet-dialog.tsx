import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheet,
  Radio,
  RadioGroup,
  TextField,
  InputGroup,
  useThemeColor,
  Alert,
  CloseButton,
  Switch,
} from "heroui-native";
import { withUniwind } from "uniwind";
import { GeneralChevronDo2 } from "@/components/ui/icons/GeneralChevronDo2";
import { FlowpayButton } from "../../ui/flowpay-button";
import { useCreateWallet } from "@/hooks/use-wallet";

const StyledGeneralOption = withUniwind(GeneralChevronDo2);

export interface AddWalletDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddWalletDialog({
  isOpen,
  onOpenChange,
}: AddWalletDialogProps) {
  const insets = useSafeAreaInsets();
  const themeColorForeground = useThemeColor("foreground");

  const createWallet = useCreateWallet();

  const [name, setName] = useState("");
  const [type, setType] = useState<"bank" | "credit" | "cash" | "mobile">(
    "bank",
  );
  const [currency, setCurrency] = useState("USD");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Wallet name is required");
      return;
    }
    setError(null);
    try {
      await createWallet.mutateAsync({
        name,
        type,
        currency: currency.toUpperCase() || "USD",
        isDefault,
      });
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to create wallet");
    }
  };

  const resetForm = () => {
    setName("");
    setType("bank");
    setCurrency("USD");
    setIsDefault(false);
    setError(null);
  };

  const walletTypes = [
    { label: "Bank", value: "bank", icon: "home" },
    { label: "Credit", value: "credit", icon: "card" },
    { label: "Cash", value: "cash", icon: "cash" },
    { label: "Mobile", value: "mobile", icon: "phone-portrait" },
  ] as const;

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={["80%"]}
          enablePanDownToClose={true}
          backgroundClassName="bg-brand-white dark:bg-dark-green rounded-t-[40px]"
          style={{ paddingBottom: Math.max(insets.bottom + 20, 34) }}
          className="pt-11"
        >
          {/* Header */}
          <View className="flex-row items-center gap-x-2.5 mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => onOpenChange(false)}
                className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green"
              >
                <StyledGeneralOption
                  color={themeColorForeground}
                  width={24}
                  height={24}
                />
              </TouchableOpacity>
            </View>
            <BottomSheet.Title
              className="text-h3 leading-7.5 font-bold text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Add Wallet
            </BottomSheet.Title>
          </View>

          {/* Error Alert */}
          {error && (
            <Alert
              status="danger"
              className="mb-6 rounded-[20px] bg-danger/10 border-danger/20"
            >
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title className="text-white">Error</Alert.Title>
                <Alert.Description className="text-white/70">
                  {error}
                </Alert.Description>
              </Alert.Content>
              <CloseButton onPress={() => setError(null)} />
            </Alert>
          )}

          {/* Form Fields */}
          <View className="flex-col gap-y-4 mb-6">
            <TextField className="w-full">
              <InputGroup className="w-full h-17.5 rounded-full bg-brand-flashwhite dark:bg-dark-charcoal-green overflow-hidden">
                <InputGroup.Input
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (error) setError(null);
                  }}
                  placeholder="Wallet Name"
                  className="flex-1 bg-transparent rounded-full px-6 text-base text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_500Medium" }}
                  placeholderTextColor="#888888"
                />
              </InputGroup>
            </TextField>

            <TextField className="w-full">
              <InputGroup className="w-full h-17.5 rounded-full bg-brand-flashwhite dark:bg-dark-charcoal-green overflow-hidden">
                <InputGroup.Input
                  value={currency}
                  onChangeText={setCurrency}
                  placeholder="Currency (e.g. USD)"
                  maxLength={3}
                  className="flex-1 bg-transparent rounded-full px-6 text-base text-brand-black dark:text-brand-white uppercase"
                  style={{ fontFamily: "PlusJakartaSans_500Medium" }}
                  placeholderTextColor="#888888"
                />
              </InputGroup>
            </TextField>

            <View className="flex-row items-center justify-between h-17.5 px-6 rounded-full bg-brand-flashwhite dark:bg-dark-charcoal-green">
              <Text
                className="text-brand-black dark:text-brand-white text-[16px]"
                style={{ fontFamily: "PlusJakartaSans_500Medium" }}
              >
                Set as default
              </Text>
              <Switch
                isSelected={isDefault}
                onSelectedChange={setIsDefault}
              />
            </View>
          </View>

          {/* Type Selection */}
          <Text
            className="text-brand-silver mb-3 ml-2"
            style={{ fontFamily: "PlusJakartaSans_500Medium" }}
          >
            Wallet Type
          </Text>
          <RadioGroup
            value={type}
            onValueChange={(val) => setType(val as any)}
            className="flex-row flex-wrap gap-3 mb-8"
          >
            {walletTypes.map((t) => (
              <RadioGroup.Item
                key={t.value}
                value={t.value}
                className={`flex-row h-14 px-5 rounded-[28px] items-center justify-between w-[48%] ${
                  type === t.value
                    ? "bg-brand-white dark:bg-dark-green"
                    : "bg-brand-flashwhite dark:bg-dark-charcoal-green"
                }`}
              >
                <View className="flex-row items-center gap-x-2">
                  <Ionicons
                    name={t.icon as any}
                    size={18}
                    color={
                      type === t.value ? themeColorForeground : "#888888"
                    }
                  />
                  <Text
                    className={`text-[14px] font-bold ${
                      type === t.value
                        ? "text-brand-black dark:text-brand-white"
                        : "text-brand-silver"
                    }`}
                    style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                  >
                    {t.label}
                  </Text>
                </View>
                <Radio
                  className={
                    type === t.value
                      ? "text-brand-black dark:text-brand-white"
                      : "text-brand-silver"
                  }
                />
              </RadioGroup.Item>
            ))}
          </RadioGroup>

          {/* Action Buttons */}
          <View className="gap-y-4 pb-6">
            <FlowpayButton
              onPress={handleCreate}
              isLoading={createWallet.isPending}
              className="bg-brand-green-500 dark:bg-dark-charcoal-green"
            >
              Save Wallet
            </FlowpayButton>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
