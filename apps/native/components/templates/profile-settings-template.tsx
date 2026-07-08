import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { Container } from "../container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthTheme from "@/hooks/use-auth-theme";
import SettingsHeader from "../base/settings/settings-header";
import { SettingsView } from "@/types/settings";
import SettingsOverview from "../containers/settings/settings-overview";
import AccountView from "../base/settings/account-view";
import NotificationSettingsView from "../containers/settings/notification-settings-view";

export default function ProfileSettingsTemplate() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAuthTheme();
  const [currentView, setCurrentView] = useState<SettingsView>("overview");

  const iconColor = isDark ? "#FFFFFF" : "#000000";

  const getTitle = () => {
    switch (currentView) {
      case "overview":
        return "Settings";
      case "account":
        return "Profile";
      case "notification":
        return "Notification";
    }
  };

  const handleBack = () => {
    if (currentView !== "overview") {
      setCurrentView("overview");
    }
  };

  return (
    <Container className="px-4" isScrollable={false}>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SettingsHeader
          title={getTitle()}
          onBack={currentView !== "overview" ? handleBack : undefined}
          iconColor={iconColor}
        />

        {/* Content */}
        {currentView === "overview" && (
          <SettingsOverview onNavigate={setCurrentView} iconColor={iconColor} />
        )}
        {currentView === "account" && <AccountView isDark={isDark} />}
        {currentView === "notification" && <NotificationSettingsView />}
      </ScrollView>
    </Container>
  );
}
