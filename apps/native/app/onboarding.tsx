import { View, Text } from "react-native";
import React, { useEffect } from "react";
import OnboardingFlow from "@/components/templates/onboarding-flow";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useAuthSession } from "@/hooks/use-auth-session";

export default function Onboarding() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: session } = useAuthSession();

  useEffect(() => {
    const user = session?.data?.user;
    if (!user) {
      router.replace("/sign-in");
      return;
    }
  }, [session, router]);

  if (!session?.data?.user) {
    return null;
  }

  const userData = {
    name: (params.name as string) || session?.data?.user?.name || "",
    email: (params.email as string) || session?.data?.user?.email || "",
  };

  const handleComplete = () => {
    // Navigation is handled inside OnboardingFlow -> SuccessModal
  };
  
  return (
    <OnboardingFlow userData={userData} onComplete={handleComplete} />
  );
}
