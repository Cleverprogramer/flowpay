import { View, Text } from "react-native";
import React from "react";
import { Card, cn, Select } from "heroui-native";
import { GeneralWallet } from "../ui/icons/GeneralWallet";
import { GeneralChevronDo } from "../ui/icons/GeneralChevronDo";

interface FlowpayBudgetPlanCardProps {
  month: string;
  availableCash: string | number;
  months?: string[]; // Optional array of months for the dropdown
  onMonthChange?: (month: string) => void;
  className?: string; // Container additional styling
}

export default function FlowpayBudgetPlanCard({
  month,
  availableCash,
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  onMonthChange,
  className,
}: FlowpayBudgetPlanCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[30px] bg-brand-green-500 p-4 flex-row items-center justify-between border-0 w-full min-h-17.75",
        className,
      )}
      style={{
        borderCurve: "continuous",
        shadowColor: "rgba(139, 138, 138, 0.12)",
        shadowOffset: { width: -1, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 61,
        elevation: 10,
      }}
    >
      <View className="flex-row items-center gap-x-2.5 flex-1">
        <GeneralWallet color="#FFFFFF" width={24} height={24} />
        <View className="flex-col items-start h-10 gap-y-3.5 justify-center flex-1 pr-2">
          <Select
            value={{ value: month, label: `Budget for ${month}` }}
            onValueChange={(selected) => {
              if (selected && onMonthChange) {
                // Single selection mode gives { value, label } payload
                onMonthChange((selected as { value: string }).value);
              }
            }}
            presentation="bottom-sheet"
          >
            <Select.Trigger
              className="flex-row items-center gap-x-1 w-full bg-transparent border-0 p-0 m-0 h-auto min-h-0"
              style={{ paddingHorizontal: 0 }}
            >
              <Select.Value
                placeholder="Select Month"
                className="text-[16px] leading-5 text-brand-white"
                style={{ fontFamily: "PlusJakartaSans_700Bold" }}
              />
              <Select.TriggerIndicator isAnimatedStyleActive={false}>
                <GeneralChevronDo color="#FFFFFF" width={20} height={20} />
              </Select.TriggerIndicator>
            </Select.Trigger>

            <Select.Portal>
              <Select.Overlay />
              <Select.Content presentation="bottom-sheet" className="pb-8">
                {months.map((m) => (
                  <Select.Item key={m} value={m} label={`Budget for ${m}`}>
                    <Select.ItemLabel className="text-brand-black dark:text-brand-white" />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Portal>
          </Select>

          <Card.Description
            className="text-body-xs leading-3.25 text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            numberOfLines={1}
          >
            Your cash available
          </Card.Description>
        </View>
      </View>

      <Card.Title
        className="text-base leading-5 text-brand-white text-right"
        style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        numberOfLines={1}
      >
        {typeof availableCash === "number"
          ? `$${availableCash.toLocaleString()}`
          : availableCash}
      </Card.Title>
    </Card>
  );
}
