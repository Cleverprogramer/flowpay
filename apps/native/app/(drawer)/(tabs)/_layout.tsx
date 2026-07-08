import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "heroui-native";
import { BlurTargetView } from "expo-blur";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { GeneralEdit } from "@/components/ui/icons/GeneralEdit";
import FlowpayAddTransactionModal from "@/components/containers/flowpay-add-transaction-modal";
import useAuthTheme from "@/hooks/use-auth-theme";

export default function TabLayout() {
  const themeColorBackground = useThemeColor("background");
  const { isDark } = useAuthTheme();
  const [isAddTransactionVisible, setAddTransactionVisible] = useState(false);

  return (
    <>
      <BlurTargetView
        style={{ flex: 1, backgroundColor: themeColorBackground }}
      >
        <NativeTabs
          iconColor={{
            default: isDark ? "#A3A3A3" : "#16302B",
            selected: isDark ? "#FFFFFF" : "#16302B",
          }}
          labelStyle={{
            default: {
              color: isDark ? "#A3A3A3" : "#16302B",
              fontWeight: "600",
            },
            selected: {
              color: isDark ? "#FFFFFF" : "#16302B",
              fontWeight: "600",
            },
          }}
          blurEffect="systemMaterialDark"
        >
          <NativeTabs.Trigger name="index">
            <NativeTabs.Trigger.Icon
              sf={{ default: "house", selected: "house.fill" }}
              md="home"
            />
            <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="transactions">
            <NativeTabs.Trigger.Icon
              sf={{ default: "newspaper", selected: "newspaper.fill" }}
              md="article"
            />
            <NativeTabs.Trigger.Label>Transaction</NativeTabs.Trigger.Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="reports">
            <NativeTabs.Trigger.Icon
              sf={{ default: "chart.pie", selected: "chart.pie.fill" }}
              md="pie_chart"
            />
            <NativeTabs.Trigger.Label>Reports</NativeTabs.Trigger.Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="profile">
            <NativeTabs.Trigger.Icon
              sf={{ default: "person", selected: "person.fill" }}
              md="person"
            />
            <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
          </NativeTabs.Trigger>
        </NativeTabs>

        <View
          className="absolute right-6 bottom-32 z-10 w-15 h-15"
          pointerEvents="box-none"
        >
          <Pressable
            className="flex-1 rounded-[40px] bg-[#16302B] items-center justify-center p-3.25 border-2 border-transparent dark:border-[#3b82f615]"
            style={{
              shadowColor: "rgba(0,0,0,0.5)",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 15,
              elevation: 16,
            }}
            onPress={() => setAddTransactionVisible(true)}
          >
            <GeneralEdit color="#FFFFFF" width={22} height={22} />
          </Pressable>
        </View>
      </BlurTargetView>
      
      <FlowpayAddTransactionModal
        visible={isAddTransactionVisible}
        onClose={() => setAddTransactionVisible(false)}
        onCreate={() => {
          setAddTransactionVisible(false);
        }}
      />
    </>
  );
}
