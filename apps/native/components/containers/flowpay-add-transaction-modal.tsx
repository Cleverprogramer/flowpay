import { View, Text } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BottomSheet, Radio, RadioGroup, useThemeColor } from "heroui-native";
import { withUniwind } from "uniwind";
import { GeneralEdit } from "../ui/icons/GeneralEdit";
import { GeneralArrowUpRi } from "../ui/icons/GeneralArrowUpRi";
import { GeneralArrowUpLe } from "../ui/icons/GeneralArrowUpLe";
import { FlowpayButton } from "../ui/flowpay-button";
import { GeneralChevronDo } from "../ui/icons/GeneralChevronDo";
import { GeneralChevronDo2 } from "../ui/icons/GeneralChevronDo2";

const StyledGeneralEdit = withUniwind(GeneralEdit);
const StyledGeneralArrowUpRi = withUniwind(GeneralArrowUpRi);
const StyledGeneralArrowUpLe = withUniwind(GeneralArrowUpLe);

export interface FlowpayAddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (type: "income" | "expense") => void;
}

export default function FlowpayAddTransactionModal({
  visible,
  onClose,
  onCreate,
}: FlowpayAddTransactionModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const themeColorForeground = useThemeColor("foreground");

  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "income",
  );

  const handleCreate = () => {
    onClose();
    onCreate(selectedType);
    router.push(`/transaction/add?type=${selectedType}`);
  };

  return (
    <BottomSheet isOpen={visible} onOpenChange={(open) => !open && onClose()}>
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
            <View className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green">
              <StyledGeneralEdit
                color={themeColorForeground}
                width={24}
                height={24}
              />
            </View>
            <BottomSheet.Title
              className="text-h3 leading-7.5 font-bold text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Add Transaction
            </BottomSheet.Title>
          </View>

          {/* Options */}
          <RadioGroup
            value={selectedType}
            onValueChange={(val) =>
              setSelectedType(val as "income" | "expense")
            }
            className="flex-col w-full mb-8"
            variant="secondary"
          >
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
                  <StyledGeneralArrowUpRi
                    color={themeColorForeground}
                    width={24}
                    height={24}
                  />
                </View>
                <Text
                  className="text-[16px] leading-5 font-bold text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  Add Income
                </Text>
              </View>
              <Radio />
            </RadioGroup.Item>

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
                  <StyledGeneralArrowUpLe
                    color={themeColorForeground}
                    width={24}
                    height={24}
                  />
                </View>
                <Text
                  className="text-[16px] leading-5 font-bold text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  Add Expense
                </Text>
              </View>
              <Radio />
            </RadioGroup.Item>
          </RadioGroup>

          {/* Action Buttons */}
          <View className="gap-y-4 pb-6">
            <FlowpayButton
              onPress={handleCreate}
              className="bg-brand-green-500 dark:bg-dark-charcoal-green"
            >
              Create Now
            </FlowpayButton>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
