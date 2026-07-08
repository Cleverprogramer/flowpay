import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheet,
  Radio,
  RadioGroup,
  TextField,
  InputGroup,
  useThemeColor,
  Alert,
  CloseButton,
} from "heroui-native";
import { withUniwind } from "uniwind";
import { GeneralEdit } from "../../ui/icons/GeneralEdit";
import { FlowpayButton } from "../../ui/flowpay-button";
import { useCreateCategory } from "@/hooks/use-categories";
import { GeneralChevronDo2 } from "@/components/ui/icons/GeneralChevronDo2";

const StyledGeneralEdit = withUniwind(GeneralEdit);
const StyledGeneralOption = withUniwind(GeneralChevronDo2);

export interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (visible: boolean) => void;
}

export default function AddCategoryDialog({
  isOpen,
  onOpenChange,
}: AddCategoryDialogProps) {
  const insets = useSafeAreaInsets();
  const themeColorForeground = useThemeColor("foreground");

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏷️");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCreateCategory();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    try {
      await createCategory.mutateAsync({ name, emoji, type });
      onOpenChange(false);
      setName("");
      setEmoji("🏷️");
      setType("expense");
    } catch (error: any) {
      setError(error.message || "Failed to create category");
    }
  };

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
              Add Category
            </BottomSheet.Title>
          </View>

          {/* Error Alert */}
            {error && (
              <Alert status="danger" className="mb-6 rounded-[20px] bg-danger/10 border-danger/20">
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

          {/* Name Input */}
          <View className="flex-row gap-x-4 mb-8">
            <TouchableOpacity className="w-17.5 h-17.5 rounded-full bg-brand-flashwhite dark:bg-dark-charcoal-green items-center justify-center shrink-0">
              <Text className="text-2xl">{emoji}</Text>
            </TouchableOpacity>
            <TextField className="flex-1">
              <InputGroup className="w-full h-17.5 rounded-full bg-brand-flashwhite dark:bg-dark-charcoal-green overflow-hidden">
                <InputGroup.Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Category Name"
                  className="flex-1 bg-transparent rounded-full px-6 text-base text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_500Medium" }}
                  placeholderTextColor="#888888"
                />
              </InputGroup>
            </TextField>
          </View>

          {/* Type Selection */}
          <RadioGroup
            value={type}
            onValueChange={(val) => setType(val as "income" | "expense")}
            className="flex-col w-full mb-8"
            variant="secondary"
          >
            <RadioGroup.Item
              value="expense"
              className="flex-row items-center justify-between w-full bg-brand-flashwhite dark:bg-dark-charcoal-green rounded-[30px] p-4"
              style={{
                shadowColor: "rgba(139, 138, 138, 0.12)",
                shadowOffset: { width: -1, height: -5 },
                shadowOpacity: 1,
                shadowRadius: 61,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center gap-x-2.5">
                <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-white dark:bg-dark-green">
                  <StyledGeneralEdit
                    color={themeColorForeground}
                    width={24}
                    height={24}
                  />
                </View>
                <Text
                  className="text-[16px] leading-5 font-bold text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  Expense
                </Text>
              </View>
              <Radio />
            </RadioGroup.Item>

            <RadioGroup.Item
              value="income"
              className="flex-row items-center justify-between w-full bg-brand-flashwhite dark:bg-dark-charcoal-green rounded-[30px] p-4"
              style={{
                shadowColor: "rgba(139, 138, 138, 0.12)",
                shadowOffset: { width: -1, height: -5 },
                shadowOpacity: 1,
                shadowRadius: 61,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center gap-x-2.5">
                <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-white dark:bg-dark-green">
                  <StyledGeneralEdit
                    color={themeColorForeground}
                    width={24}
                    height={24}
                  />
                </View>
                <Text
                  className="text-[16px] leading-5 font-bold text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  Income
                </Text>
              </View>
              <Radio />
            </RadioGroup.Item>
          </RadioGroup>

          {/* Action Buttons */}
          <View className="gap-y-4 pb-6">
            <FlowpayButton
              onPress={handleCreate}
              isLoading={createCategory.isPending}
              className="bg-brand-green-500 dark:bg-dark-charcoal-green"
            >
              Save Category
            </FlowpayButton>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
