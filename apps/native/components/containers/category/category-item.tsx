import { View, Text } from "react-native";
import React from "react";
import { Button, Card, Surface, useThemeColor } from "heroui-native";
import { Category } from "@flowpay/schema/category.schema";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryItem({
  item,
  onDelete,
}: {
  item: Category;
  onDelete: (id: string) => void;
}) {
  const dangerColor = useThemeColor("danger");
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
            <Text className="text-h4 font-bold">{item.emoji || "🏷️"}</Text>
          </Surface>
          <View className="flex-col">
            <Card.Title
              className="text-[16px] leading-5 text-brand-black dark:text-brand-white"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              {item.name}
            </Card.Title>
            <Card.Description
              className="text-body-sm leading-4 text-brand-silver mt-1"
              style={{ fontFamily: "PlusJakartaSans_500Medium" }}
            >
              {item.type === "expense" ? "Expense" : "Income"}
            </Card.Description>
          </View>
        </View>
        {!item.isSystem && (
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            onPress={() => onDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={dangerColor} />
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
