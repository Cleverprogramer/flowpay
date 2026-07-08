import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { InferResponseType } from "hono";
import { api } from "@/lib/api-client";
import { TransactionFilters, TransactionType } from "@/types/transactions";
import { useTransactions } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { useThemeColors } from "@/lib/use-theme-colors";
import FlowpayScreenHeader from "../base/flowpay-screen-header";
import { GeneralSearch } from "../ui/icons/GeneralSearch";
import { GeneralOption } from "../ui/icons/GeneralOption";
import FlowpayTransactionCard from "../base/flowpay-transaction-card";
import FlowpaySearchbar from "../base/flowpay-searchbar";
import TransactionFilterModal from "../containers/transactions/transaction-filter-modal";

type ListTransactionsResponse = InferResponseType<
  typeof api.api.transaction.$get,
  200
>;
type TransactionItem = NonNullable<ListTransactionsResponse>["data"][0];

type GroupedTransactions = {
  date: string;
  data: TransactionItem[];
};

export default function TransactionTemplate() {
  const { iconColor } = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    category: "All",
    dateRange: "All",
  });

  // Map filter category to type if applicable
  let filterType: "income" | "expense" | undefined;
  if (filters.category === "Income") filterType = "income";
  if (filters.category === "Expense") filterType = "expense";

  // Fetch real API data
  const { data: response, isLoading } = useTransactions({
    limit: 20, // Increase limit for main list or implement infinite scroll later
    ...(filterType ? { type: filterType } : {}),
  });

  const transactions = response?.data || [];

  // Group transactions by "Month Year" or custom grouping
  const groupTransactions = (txs: TransactionItem[]): GroupedTransactions[] => {
    const grouped = new Map<string, TransactionItem[]>();

    txs.forEach((tx) => {
      const date = new Date(tx.transactionDate);
      // Create a key like "July 2024"
      const key = format(date, "MMMM yyyy");

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(tx);
    });

    // Convert map to array and maintain sorting (since query already returns desc by date, the arrays are mostly sorted)
    return Array.from(grouped.entries()).map(([dateStr, items]) => ({
      date: dateStr,
      data: items,
    }));
  };

  const groupedTransactions = groupTransactions(transactions);

  const handleApplyFilter = (appliedFilters: TransactionFilters) => {
    setFilters(appliedFilters);
  };

  return (
    <View
      className="flex-1 bg-brand-flashwhite dark:bg-brand-green-900"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-2.5 pb-5">
        <FlowpayScreenHeader
          title="Transaction"
          className="mb-0 pt-0"
          rightElement={
            <>
              <Pressable className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green group">
                <GeneralSearch color={iconColor} width={23} height={23} />
              </Pressable>
              <Pressable className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green ml-1.25">
                <GeneralOption color={iconColor} width={23} height={23} />
              </Pressable>
            </>
          }
        />
      </View>

      {/* Scrollable content */}
      <ScrollView
        className="flex-1 w-full"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
      >
        {/* Search Bar */}
        <FlowpaySearchbar
          containerClassName="mx-6 mt-2.5 mb-[22px]"
          onFilterPress={() => setFilterModalVisible(true)}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center mt-10">
            <ActivityIndicator size="large" />
          </View>
        ) : groupedTransactions.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text
              className="text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            >
              No transactions found
            </Text>
          </View>
        ) : (
          <View className="px-6 flex-col gap-y-5.5">
            {/* Transaction Lists grouped by month */}
            {groupedTransactions.map((group, groupIndex) => (
              <View key={`group-${groupIndex}`} className="flex-col gap-y-5.5">
                {/* Month Heading */}
                <Text
                  className="text-h4 leading-6.25 text-brand-black dark:text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  {group.date}
                </Text>

                {/* Flat list of transactions */}
                <View className="flex-col gap-y-2.5">
                  {group.data.map((transaction) => (
                    <View key={transaction.id} className="flex-col gap-y-2.5">
                      <FlowpayTransactionCard
                        title={
                          transaction.categoryName || transaction.description
                        }
                        datetime={format(
                          new Date(transaction.transactionDate),
                          "dd MMM, hh:mm a",
                        )}
                        amount={transaction.amount}
                        type={transaction.type as TransactionType}
                        icon={
                          transaction.categoryEmoji ? (
                            <Text className="text-xl">
                              {transaction.categoryEmoji}
                            </Text>
                          ) : undefined
                        }
                        className="px-0"
                        onPress={() => {
                          router.push(`/transaction/${transaction.id}`);
                        }}
                      />
                      {/* Separator */}
                      <View className="w-full h-px bg-[#D9D9D9] opacity-30" />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <TransactionFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
      />
    </View>
  );
}
