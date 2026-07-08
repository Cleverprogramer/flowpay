import { View, Text } from "react-native";
import React, { useState } from "react";
import SelectCountry from "../containers/onboarding/select-country";
import {
  useCompleteOnboarding,
  useUpdateProfile,
} from "@/hooks/use-auth-session";
import ProfileSetup from "../containers/onboarding/profile-setup";
import { SuccessModal } from "../containers/onboarding/success-modal";

type OnboardingStep = "country" | "profile" | "success";

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface OnboardingFlowProps {
  userData: {
    name: string;
    email: string;
  };
  onComplete: () => void;
}

export default function OnboardingFlow({
  userData,
  onComplete,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("country");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateProfile = useUpdateProfile();
  const completeOnboarding = useCompleteOnboarding();

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setCurrentStep("profile");
  };

  const handleProfileComplete = async (profileData: any) => {
    try {
      await updateProfile.mutateAsync({
        name: profileData.name,
        phone: profileData.phone,
        country: profileData.country.name,
        image: profileData.profileImage,
      });

      await completeOnboarding.mutateAsync();

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.";
      alert(errorMessage);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onComplete();
  };

  const handleBack = () => {
    if (currentStep === "profile") {
      setCurrentStep("country");
    }
  };

  return (
    <>
      {currentStep === "country" && (
        <SelectCountry onNext={handleCountrySelect} onBack={() => {}} />
      )}

      {currentStep === "profile" && selectedCountry && (
        <ProfileSetup
          userData={userData}
          country={selectedCountry}
          onNext={handleProfileComplete}
          onBack={handleBack}
        />
      )}

      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </>
  );
}
