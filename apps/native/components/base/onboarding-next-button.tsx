import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface OnboardingNextButtonProps {
  onPress: () => void;
}

export default function OnboardingNextButton({ onPress }: OnboardingNextButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Next onboarding step"
      onPress={onPress}
      className="w-17.5 h-17.5 rounded-full items-center justify-center bg-brand-green-500"
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Ionicons name="arrow-forward-outline" size={32} color="#FFFFFF" />
    </Pressable>
  )
}