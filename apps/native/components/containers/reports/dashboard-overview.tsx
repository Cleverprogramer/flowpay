import { View, Text } from 'react-native'
import React from 'react'
import FlowpaySectionHeader from '@/components/base/flowpay-section-header'
import FlowpayIncomeExpense from '../flowpay-income-expense'
import FlowpayReportBalanceChart from '@/components/base/flowpay-report-balance-chart'

const OVERVIEW_CHART_DATA = [
  { label: "Jan", value: 5200 },
  { label: "Feb", value: 7400 },
  { label: "Mar", value: 9600 },
  { label: "Apr", value: 11900 },
  { label: "May", value: 18300 },
  { label: "Jun", value: 15000 },
  { label: "Jul", value: 21000 },
];

export default function DashboardOverview() {
  return (
    <View className='flex-col gap-y-5'>
      <FlowpaySectionHeader
        title="Dashboard"
        rightTitle="See all"
        rightTitleClassName="text-brand-black dark:text-brand-white text-[12px] font-medium"
        onRightPress={() => {}}
      />

      <View className="self-start bg-brand-green-500 dark:bg-brand-green-800 rounded-[20px] px-3 py-1.5 -mt-2">
        <Text
          className="text-body-xs leading-3.25 text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          For this month
        </Text>
      </View>

      {/* Income / Expense Summary */}
      <FlowpayIncomeExpense
        incomeAmount={15000}
        expenseAmount={6000}
        dateLabel="This month"
      />

      {/* Balance Chart Card */}
      <FlowpayReportBalanceChart
        balance={21000}
        changeLabel="+5%"
        periodLabel="For this month"
        chartData={OVERVIEW_CHART_DATA}
      />

    </View>
  )
}