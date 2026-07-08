import { GeneralEdit } from "@/components/ui/icons/GeneralEdit";
import { InputGroup, TextField } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function ProfileField({
  value,
  isPassword,
  onChangeText,
  isDark,
}: {
  value: string;
  isPassword?: boolean;
  onChangeText?: (text: string) => void;
  isDark: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const iconColor = isDark ? "#FFFFFF" : "#000000";

  if (isEditing) {
    return (
      <TextField>
        <InputGroup className="w-full h-14 rounded-[30px] bg-brand-flashwhite dark:bg-brand-green-500 overflow-hidden">
          <InputGroup.Input
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword}
            autoFocus
            className="flex-1 bg-transparent px-5 text-[14px] rounded-[30px] text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_400Regular" }}
            placeholderTextColor={isDark ? "#999" : "#888"}
          />
          <InputGroup.Suffix className="pr-4 justify-center">
            <Pressable onPress={() => setIsEditing(false)} hitSlop={8}>
              <View className="w-6 h-6 rounded-xl bg-brand-green-500 dark:bg-brand-green-800 items-center justify-center">
                <Text
                  className="text-body-sm text-brand-white"
                  style={{ fontFamily: "PlusJakartaSans_700Bold" }}
                >
                  ✓
                </Text>
              </View>
            </Pressable>
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>
    );
  }

  return (
    <View className="flex-row items-center justify-between w-full rounded-[30px] bg-brand-flashwhite dark:bg-brand-green-500 px-5 py-4 min-h-14">
      <Text
        className="text-[14px] leading-4.5 text-brand-black dark:text-brand-white flex-1"
        style={{ fontFamily: "PlusJakartaSans_400Regular" }}
        numberOfLines={1}
      >
        {isPassword ? "••••••••" : value}
      </Text>
      <Pressable
        onPress={() => setIsEditing(true)}
        hitSlop={8}
        className="ml-2"
      >
        <GeneralEdit color={iconColor} width={20} height={20} />
      </Pressable>
    </View>
  );
}
