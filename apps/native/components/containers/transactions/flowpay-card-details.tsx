import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Card, cn } from "heroui-native";
import useAuthTheme from "@/hooks/use-auth-theme";
import { GeneralCard } from "@/components/ui/icons/GeneralCard";
import { GeneralChecklist2 } from "@/components/ui/icons/GeneralChecklist2";

export type CardDetailsStatus = "Success" | "Pending" | "Failed";

export interface TransferEntity {
  name: string;
  method: string;
  datetimeLine1: string;
  datetimeLine2: string;
  isCard?: boolean;
}

export interface FlowpayCardDetailsProps {
  sender: TransferEntity;
  receiver: TransferEntity;
  status?: CardDetailsStatus;
  statusText?: string; // Optional overlay text if needed
  className?: string;
}

export const FlowpayCardDetails: React.FC<FlowpayCardDetailsProps> = ({
  sender,
  receiver,
  status = "Success",
  className = "",
}) => {
  const { isDark } = useAuthTheme();

  // Match shadow styles from design system
  const shadowStyle: StyleProp<ViewStyle> = !isDark
    ? {
        shadowColor: "rgba(139, 138, 138, 0.12)",
        shadowOffset: { width: -1, height: -5 },
        shadowOpacity: 1,
        shadowRadius: 61,
        elevation: 10,
      }
    : {};

  // Status-based line & icon colors
  let lineColorClass = "";
  let axisIconColor = "";
  let methodIconColor = isDark ? "#FFFFFF" : "#000000";

  switch (status) {
    case "Success":
      lineColorClass = "bg-brand-green-500 dark:bg-brand-green-50";
      axisIconColor = isDark ? "#E8ECEB" : "#1C3E38"; // brand-green-50 : brand-green-500
      break;
    case "Pending":
      lineColorClass = "bg-brand-flashwhite dark:bg-brand-white/40";
      axisIconColor = isDark ? "rgba(255, 255, 255, 0.4)" : "#F0F0F0";
      break;
    case "Failed":
      lineColorClass = "bg-brand-red-500 dark:bg-brand-red-50";
      axisIconColor = isDark ? "#FFF2F7" : "#E9383E"; // brand-red-50 : brand-red-500
      break;
  }

  // Common inner layout for Sender/Receiver chunks
  const renderParticipant = (entity: TransferEntity) => (
    <View className="flex-row items-start justify-between flex-1">
      <View className="flex-col items-start gap-y-1 pt-0.5">
        <Card.Title
          className="text-[14px] leading-4.5 text-brand-black dark:text-brand-white"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          {entity.name}
        </Card.Title>
        <View className="flex-row items-center gap-x-1.5 mt-0.5">
          <Card.Description
            className="text-body-sm leading-3.75 text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          >
            {entity.method}
          </Card.Description>
          {entity.isCard ? (
            <GeneralCard color={methodIconColor} width={18} height={18} />
          ) : (
            <GeneralChecklist2 color={methodIconColor} width={18} height={18} />
          )}
        </View>
        {!entity.isCard && (
          <Card.Description
            className="text-body-sm leading-3.75 text-brand-black dark:text-brand-white mt-0.5"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
          >
            Fast Transfer Payment
          </Card.Description>
        )}
      </View>

      <Card.Description
        className="text-body-xs leading-normal text-brand-black dark:text-brand-white text-right"
        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
      >
        {entity.datetimeLine1}
        {"\n"}
        {entity.datetimeLine2}
      </Card.Description>
    </View>
  );

  return (
    <Card
      className={cn(
        "rounded-[30px] bg-brand-white dark:bg-brand-green-500 px-3.5 py-4 flex-row items-stretch border-0 w-full",
        className,
      )}
      style={[{ borderCurve: "continuous" }, shadowStyle]}
    >
      <View className="flex-col items-center justify-between w-6 mr-4">
        <GeneralChecklist2 color={axisIconColor} width={24} height={24} />
        <View
          className={`w-0.5 h-13.5 my-1.5 rounded-full ${lineColorClass}`}
        />
        <GeneralChecklist2 color={axisIconColor} width={24} height={24} />
      </View>

      {/* Right Column Content */}
      <View className="flex-col items-stretch flex-1 gap-y-4">
        {/* Sender */}
        {renderParticipant(sender)}

        {/* Horizontal Divider Content */}
        <View className="h-px bg-brand-silver dark:bg-brand-white/20 w-full" />

        {/* Receiver */}
        {renderParticipant(receiver)}
      </View>
    </Card>
  );
};
