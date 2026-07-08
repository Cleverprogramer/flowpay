import useAuthTheme from "@/hooks/use-auth-theme";

/**
 * A shared hook to centralize theme colors across the application.
 * Currently standardizes the repetition of `iconColor = isDark ? "#FFFFFF" : "#000000"`.
 */
export function useThemeColors() {
  const { isDark } = useAuthTheme();

  return {
    isDark,
    iconColor: isDark ? "#FFFFFF" : "#000000",
  };
}
