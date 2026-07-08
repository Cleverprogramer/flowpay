import { View, Text } from "react-native";
import React from "react";
import FlowpayReportSummaryCard from "@/components/base/flowpay-report-summary-card";
import FlowpayReportBarChart from "@/components/base/flowpay-report-bar-chart";
import PeriodBadge from "@/components/base/period-badge";
import FlowpaySectionHeader from "@/components/base/flowpay-section-header";
import FlowpayTransactionCard from "@/components/base/flowpay-transaction-card";

const INCOME_CHART_DATA = [
  { label: "Jan", value: 3600 },
  { label: "Feb", value: 3600 },
  { label: "Mar", value: 5700 },
  { label: "Apr", value: 9900 },
  { label: "May", value: 5700 },
  { label: "Jun", value: 4200 },
  { label: "Jul", value: 7800 },
];

const INCOME_HISTORY = [
  { title: "Income", datetime: "31 Jul, 08:30 am", amount: 500.0 },
  { title: "Freelance Payment", datetime: "28 Jun, 08:00 am", amount: 750.0 },
];

export default function IncomeActivity() {
  return (
    <View className="flex-col gap-y-5">
      <FlowpayReportSummaryCard
        leftTitle="Total Income"
        leftValue={54000.9}
        rightTitle="Monthly Income"
        rightValue={4000.0}
        type="income"
      />

      {/* Overview section */}
      <View className="flex-col gap-y-3">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-h4 leading-6.25 text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Overview
          </Text>
          <PeriodBadge label="For Six Month" />
        </View>

        <FlowpayReportBarChart
          data={INCOME_CHART_DATA}
          variant="income"
          maxBarHeight={160}
        />
      </View>

      {/* Detail list example */}
      <View className="flex-col gap-y-2.5 w-full">
        <FlowpaySectionHeader
          title="Detail transaction"
          rightTitle="Sort by"
          rightTitleClassName="text-brand-black dark:text-brand-white text-[12px] font-medium"
          onRightPress={() => {}}
        />
        {INCOME_HISTORY.map((item, index) => (
          <FlowpayTransactionCard
            key={`income-${index}`}
            title={item.title}
            datetime={item.datetime}
            amount={item.amount}
            type="income"
          />
        ))}
      </View>
    </View>
  );
}
