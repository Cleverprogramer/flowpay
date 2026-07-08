import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import FilterModal from "./filter-modal";
import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import FilterPill from "@/components/base/filter-pill";

export interface FlowpayTransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: TransactionFilters) => void;
}

export type TransactionFilters = {
  category: string;
  dateRange: string;
  customDateRange?: { start: string; end: string };
};

const CATEGORY_OPTIONS = [
  "All",
  "Income",
  "Expense",
  "Utilities",
  "Food",
  "Shopping",
  "Services",
  "Transport",
];
const DATE_OPTIONS = [
  "All",
  "Today",
  "This Week",
  "This Month",
  "Last Month",
  "Three Month",
  "Custom Range",
];

export default function TransactionFilterModal({
  visible,
  onClose,
  onApplyFilter,
}: FlowpayTransactionFilterModalProps) {
  const { isDark } = useAuthTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    onApplyFilter({
      category: selectedCategory,
      dateRange: selectedDate,
      ...(selectedDate === "Custom Range" && {
        customDateRange: { start: startDate, end: endDate },
      }),
    });
    onClose();
  };
  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      onApply={handleApply}
      title="Use Filter"
    >
      <View className="flex-col pb-4">
        {/* Category/Type */}
        <View className="mb-6">
          <Text
            className="text-base leading-5 text-brand-black dark:text-brand-white mb-4"
            style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
          >
            Category/Type
          </Text>
          <View className="flex-row flex-wrap">
            {CATEGORY_OPTIONS.map((category) => (
              <FilterPill
                key={category}
                label={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </View>
        </View>

        {/* Date Range */}
        <View className="mb-6">
          <Text
            className="text-base leading-5 text-brand-black dark:text-brand-white mb-4"
            style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
          >
            Date Range
          </Text>
          <View className="flex-row flex-wrap">
            {DATE_OPTIONS.map((date) => (
              <FilterPill
                key={date}
                label={date}
                isSelected={selectedDate === date}
                onPress={() => setSelectedDate(date)}
              />
            ))}
          </View>
        </View>

        {/* Custom Range Inputs (Shown conditionally) */}
        {selectedDate === "Custom Range" && (
          <View className="mb-4 bg-brand-flashwhite dark:bg-dark-charcoal-green p-4 rounded-2xl">
            <Text
              className="text-[14px] leading-4.5 text-brand-black dark:text-brand-white mb-3"
              style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
            >
              Custom Range
            </Text>
            <View className="flex-row items-center gap-x-4">
              <View className="flex-1">
                <Text
                  className="text-body-sm leading-3.75 text-brand-black dark:text-[#a1a1aa] mb-2"
                  style={{ fontFamily: ONBOARDING_FONT_FAMILY.medium }}
                >
                  Start Date
                </Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={isDark ? "#b0b0b0" : "#a1a1aa"}
                  className="h-11.25 bg-brand-white dark:bg-dark-green rounded-xl px-4 text-[13px] text-brand-black dark:text-brand-white"
                  style={{ fontFamily: ONBOARDING_FONT_FAMILY.medium }}
                />
              </View>
              <View className="flex-1">
                <Text
                  className="text-body-sm leading-3.75 text-brand-black dark:text-[#a1a1aa] mb-2"
                  style={{ fontFamily: ONBOARDING_FONT_FAMILY.medium }}
                >
                  End Date
                </Text>
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={isDark ? "#b0b0b0" : "#a1a1aa"}
                  className="h-11.25 bg-brand-white dark:bg-dark-green rounded-xl px-4 text-[13px] text-brand-black dark:text-brand-white"
                  style={{ fontFamily: ONBOARDING_FONT_FAMILY.medium }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </FilterModal>
  );
}
