import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PanResponder, Text, View } from "react-native";
import OnboardingSplashContainer from "../containers/onboarding-splash-container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OnboardingSlideContainer from "../containers/onboarding-slide-container";
import OnboardingFinalContainer from "../containers/onboarding-final-container";

const SPLASH_DURATION_MS = 1500;

const onboardingSlides = [
  {
    id: "slide-1",
    kind: "slide",
    imageSource: require("../../assets/images/onboarding/onboarding-left.png"),
    title: "Take Control of Your\nMoney",
    description:
      "Track income, expenses, and manage in one simple app. Stay on top of your finances effortlessly.",
  },
  {
    id: "slide-2",
    kind: "slide",
    imageSource: require("../../assets/images/onboarding/onboarding-right.png"),
    title: "Your Smart Money\nCompanion",
    description:
      "Easily create new records, track your income, and manage expenses keeping your finances clear and organized",
  },
  {
    id: "slide-3",
    kind: "final",
    imageSource: require("../../assets/images/onboarding/onboarding-3.png"),
  },
] as const;

export default function OnboardingTemplate() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSplashVisible(false);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timeout);
  }, []);

  const activeSlide = useMemo(
    () => onboardingSlides[activeSlideIndex],
    [activeSlideIndex],
  );

  const shiftSlide = useCallback((step: -1 | 1) => {
    setActiveSlideIndex((current) => {
      const nextIndex = current + step;
      return Math.min(Math.max(nextIndex, 0), onboardingSlides.length - 1);
    });
  }, []);

  const handleNext = useCallback(() => {
    shiftSlide(1);
  }, [shiftSlide]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 12,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx <= -60) {
            shiftSlide(1);
            return;
          }

          if (gestureState.dx <= 60) {
            shiftSlide(-1);
          }
        },
      }),
    [shiftSlide],
  );

  if (isSplashVisible) {
    <>
      <StatusBar style="auto" />
      <OnboardingSplashContainer message="Flowpay makes managing your money simple, secure, and smart" />
    </>;
  }

  return (
    <>
      <View
        className="flex-1 bg-brand-green-500"
        {...(activeSlide.kind === "slide" ? panResponder.panHandlers : {})}
      >
        {activeSlide.kind === "slide" ? (
          <OnboardingSlideContainer
            imageSource={activeSlide.imageSource}
            title={activeSlide.title}
            description={activeSlide.description}
            onNext={handleNext}
            bottomInset={insets.bottom}
          />
        ) : (
          <OnboardingFinalContainer
            imageSource={activeSlide.imageSource}
            bottomInset={insets.bottom}
          />
        )}
      </View>
    </>
  );
}
