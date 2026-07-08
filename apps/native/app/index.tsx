import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useAuthSession } from "../hooks/use-auth-session";
import { StatusBar } from "expo-status-bar";
import OnboardingSplashContainer from "@/components/containers/onboarding-splash-container";
import { useThemeColor } from "heroui-native";
import OnboardingTemplate from "@/components/templates/onboarding-template";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useAuthSession();

  useEffect(() => {
    if (pathname !== "/") return;

    if (!isPending && session?.data?.user) {
      const user = session.data.user;

      if (user?.onboardingCompleted) {
        router.replace("/(drawer)/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <>
        <StatusBar style="auto" />
        <OnboardingSplashContainer message="Flowpay makes managing your money simple, secure, and smart" />
      </>
    );
  }
  return <OnboardingTemplate />;
}
