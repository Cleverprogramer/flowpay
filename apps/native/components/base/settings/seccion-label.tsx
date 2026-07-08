import { Text } from "react-native";
import React from "react";

export default function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      className="text-[16px] leading-5 text-brand-black dark:text-brand-white mb-2.5"
      style={{ fontFamily: "PlusJakartaSans_700Bold" }}
    >
      {label}
    </Text>
  );
}
