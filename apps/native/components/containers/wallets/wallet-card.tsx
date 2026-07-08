import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, useThemeColor, Surface } from "heroui-native";
import type { Wallet } from "@flowpay/schema/wallet.schema";

interface WalletCardProps {
  wallet: Wallet;
  onDelete: (id: string) => void;
}

export function WalletCard({ wallet, onDelete }: WalletCardProps) {
  const dangerColor = useThemeColor("danger");

  const getTypeIcon = (walletType: string) => {
    switch (walletType) {
      case "bank":
        return "🏠";
      case "credit":
        return "💳";
      case "cash":
        return "💰";
      case "mobile":
        return "📱";
      default:
        return "💼";
    }
  };

  return (
    <Card
      variant="secondary"
      className="mb-3 rounded-[20px] p-0 overflow-hidden"
    >
      <Card.Body className="flex-row items-center justify-between p-4 bg-brand-flashwhite dark:bg-brand-green-500">
        <View className="flex-row items-center gap-x-3">
          <Surface
            variant="tertiary"
            className="w-10 h-10 rounded-[20px] items-center justify-center bg-brand-white dark:bg-dark-charcoal-green"
          >
            <Text className="text-h4 font-bold">
              {getTypeIcon(wallet.type)}
            </Text>
          </Surface>
          <View className="flex-col">
            <Card.Title
              className="text-[16px] leading-5 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {wallet.name} {wallet.isDefault && "⭐"}
            </Card.Title>
            <Card.Description
              className="text-body-sm leading-4 text-brand-silver mt-1 capitalize"
              style={{ fontFamily: "PlusJakartaSans_500Medium" }}
            >
              {wallet.type} • {wallet.currency}
            </Card.Description>
          </View>
        </View>
        {!wallet.isSystem && (
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            onPress={() => onDelete(wallet.id)}
          >
            <Ionicons name="trash-outline" size={20} color={dangerColor} />
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
