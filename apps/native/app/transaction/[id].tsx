import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import useAuthTheme from "@/hooks/use-auth-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useTransaction } from "@/hooks/use-transactions";
import { GeneralChevronRi } from "@/components/ui/icons/GeneralChevronRi";
import { GeneralShare } from "@/components/ui/icons/GeneralShare";
import { GeneralDownload } from "@/components/ui/icons/GeneralDownload";
import FlowpayAmountDetailsCard from "@/components/containers/transactions/flowpay-amount-details-card";
import { FlowpayCardDetails } from "@/components/containers/transactions/flowpay-card-details";

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useAuthTheme();
  const insets = useSafeAreaInsets();
  const { data: authRes } = useAuthSession();

  const { data: response, isLoading } = useTransaction(id);
  const detail = response?.data;

  const iconColor = isDark ? "#FFFFFF" : "#000000";

  if (isLoading || !detail) {
    return (
      <View
        className="flex-1 bg-brand-flashwhite dark:bg-brand-green-900 items-center justify-center"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text className="dark:text-white">Transaction not found</Text>
        )}
      </View>
    );
  }

  const isIncome = detail.type === "income";
  const displayAmount = `${isIncome ? "+" : "-"}$${Math.abs(detail.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const txDate = new Date(detail.transactionDate);

  // Derive sender/receiver depending on transaction type
  const userName = authRes?.data?.user?.name || "Me";
  const senderName = isIncome ? "External Source" : userName;
  const receiverName = isIncome
    ? userName
    : detail.categoryName || "External Recipient";

  const sender = {
    name: senderName,
    method: "Account",
    datetimeLine1: format(txDate, "MMMM d, yyyy"),
    datetimeLine2: format(txDate, "hh:mm a"),
    isCard: false,
  };

  const receiver = {
    name: receiverName,
    method: `${detail.walletName || "Wallet"} | ${detail.walletType || "bank"}`,
    datetimeLine1: format(txDate, "MMMM d, yyyy"),
    datetimeLine2: format(txDate, "hh:mm a"),
    isCard: detail.walletType === "credit",
  };

  // Transaction details rows
  const detailRows = [
    {
      label: "Transaction Code",
      value: `#${detail.id.slice(-8).toUpperCase()}`,
    },
    {
      label: "Transfer Amount",
      value: `$${detail.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "App Fee",
      value: `$0.00`, // hardcoded unless added to API later
    },
    {
      label: "Total Amount",
      value: `$${detail.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    { label: "Note", value: detail.note || "—" },
  ];
  return (
    <View
      className="flex-1 bg-brand-flashwhite dark:bg-brand-green-900"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-2.5 mt-7.5 mb-5.5">
        <View className="flex-row items-center flex-1">
          <Pressable
            onPress={() => router.back()}
            className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green"
          >
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <GeneralChevronRi color={iconColor} width={23} height={23} />
            </View>
          </Pressable>
          <Text
            className="text-h3 leading-7.5 text-brand-black dark:text-brand-white ml-2.5"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Details
          </Text>
        </View>

        <View className="flex-row items-center gap-x-1.25">
          <Pressable className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green">
            <GeneralShare color={iconColor} width={23} height={23} />
          </Pressable>
          <Pressable className="w-12.5 h-12.5 rounded-[40px] items-center justify-center bg-brand-flashwhite dark:bg-dark-charcoal-green">
            <GeneralDownload color={iconColor} width={23} height={23} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: insets.bottom + 30,
        }}
      >
        {/* Transaction Category Title */}
        <Text
          className="text-h4 leading-6.25 text-brand-black dark:text-brand-white mb-2.5"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          {detail.categoryName || detail.description}
        </Text>

        {/* Amount Information Card */}
        <View className="w-full mb-2.5">
          <FlowpayAmountDetailsCard
            label="Total Amount"
            amount={displayAmount}
            status={"Success"}
          />
        </View>

        {/* Transfer Flow Card (sender → receiver) */}
        <View className="w-full mb-2">
          <FlowpayCardDetails
            status={"Success"}
            sender={sender}
            receiver={receiver}
          />
        </View>

        {/* Transaction Details Section */}
        <View className="mt-2 flex-col gap-y-5.5">
          {/* Section Heading */}
          <Text
            className="text-h4 leading-6.25 text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Transaction Details
          </Text>

          {/* Detail Rows */}
          <View className="flex-col gap-y-2.5">
            {detailRows.map((row) => (
              <View key={row.label} className="flex-col gap-y-2.5">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-sm leading-5 text-brand-black dark:text-brand-white"
                    style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                  >
                    {row.label}
                  </Text>
                  <Text
                    className="text-sm leading-5 text-brand-black dark:text-brand-white text-right"
                    style={{ fontFamily: "PlusJakartaSans_400Regular" }}
                  >
                    {row.value}
                  </Text>
                </View>
                {/* Separator */}
                <View className="w-full h-px bg-[#D9D9D9] opacity-30" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Back to Home Button — sticky at bottom */}
      <View className="px-3.75">
        <Pressable
          onPress={() => router.replace("/")}
          className="w-full h-16.25 rounded-[50px] bg-brand-green-500 dark:bg-dark-charcoal-green items-center justify-center"
        >
          <Text
            className="text-[16px] leading-5 text-brand-white text-center"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Back to home
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
