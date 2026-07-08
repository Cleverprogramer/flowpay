import { useAppTheme } from "@/contexts/app-theme-context";
import { useThemeColor } from "heroui-native";

export default function useAuthTheme() {
    const { isDark } = useAppTheme();
    const foreground = useThemeColor('foreground');
    const muted = useThemeColor("muted");
    const surface = useThemeColor("surface");
    const surfaceSecondary = useThemeColor("surface-secondary");
    const separator = useThemeColor("separator");
    const danger = useThemeColor("danger");

    return {
        isDark,
        colors: {
            screenBackground: isDark ? "#0C1A18" : "#FFFFFF",
            cardBackground: isDark ? surface : "#FFFFFF",
            textPrimary: foreground,
            textSecondary: isDark ? muted : "#333333",
            textInverse: "#FFFFFF",
            inputBackground: isDark ? surfaceSecondary : "#F0F0F0",
            inputText: foreground,
            inputPlaceholder: isDark ? muted : "#333333",
            separator: isDark ? separator : "#000000",
            buttonBackground: "#1C3E38",
            socialBackground: isDark ? surfaceSecondary : "#F0F0F0",
            error: danger,
            icon: foreground,
        }
    }
}