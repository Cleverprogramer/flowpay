import { View, Text, Pressable } from "react-native";
import React, { useCallback } from "react";
import useAuthTheme from "@/hooks/use-auth-theme";
import { useThemeColor } from "heroui-native";
import { ThemeToggle } from "@/components/theme-toggle";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
        headerRight: renderThemeToggle,
        drawerStyle: { backgroundColor: themeColorBackground },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: "Tabs",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable className="mr-4">
                <Ionicons
                  name="add-outline"
                  size={24}
                  color={themeColorForeground}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
    </Drawer>
  );
}
