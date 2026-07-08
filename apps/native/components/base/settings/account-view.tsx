import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { GeneralEdit } from "@/components/ui/icons/GeneralEdit";
import { useAuthSession } from "@/hooks/use-auth-session";
import { User } from "better-auth";
import ProfileField from "./profile-field";

export default function AccountView({ isDark }: { isDark: boolean }) {
    const { data: session } = useAuthSession();
  const user = session?.data?.user as any;

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("********");

  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <View className="flex-col items-center gap-y-6">
      {/* Avatar */}
      <View className="relative">
        <View className="w-25 h-25 rounded-[50px] bg-brand-green-500 dark:bg-brand-green-800 items-center justify-center">
          <Text
            className="text-[40px] text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            {firstLetter}
          </Text>
        </View>
        <Pressable className="absolute bottom-0 right-0 w-7.5 h-7.5 rounded-[15px] bg-brand-green-500 dark:bg-dark-charcoal-green items-center justify-center border-2 border-brand-white dark:border-brand-green-900">
          <GeneralEdit color="#FFFFFF" width={14} height={14} />
        </Pressable>
      </View>

      {/* Form Fields */}
      <View className="flex-col gap-y-3 w-full">
        <ProfileField value={name} onChangeText={setName} isDark={isDark} />
        <ProfileField value={phone} onChangeText={setPhone} isDark={isDark} />
        <ProfileField value={email} onChangeText={setEmail} isDark={isDark} />
        <ProfileField
          value={password}
          isPassword
          onChangeText={setPassword}
          isDark={isDark}
        />
      </View>

      {/* Save Changes Button */}
      <Pressable className="w-full h-15 rounded-[50px] bg-brand-green-500 dark:bg-dark-charcoal-green items-center justify-center mt-2">
        <Text
          className="text-[16px] leading-5 text-brand-white text-center"
          style={{ fontFamily: "PlusJakartaSans_700Bold" }}
        >
          Save Changes
        </Text>
      </Pressable>
    </View>
  );
}
