import { ONBOARDING_FONT_FAMILY } from "@/lib/const/onboarding-typography";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SuccessModal({ visible, onClose }: SuccessModalProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const modalWidth = useMemo(() => Math.min(376, width - 16), [width]);

  const handleGoToDashboard = () => {
    onClose();
    router.replace("/(drawer)/(tabs)");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 8,
        }}
      >
        <View
          style={{
            width: modalWidth,
            backgroundColor: "#0F2925", // Dark green background from design
            borderRadius: 40,
            paddingHorizontal: 32,
            paddingTop: 40,
            paddingBottom: 32,
            gap: 40,
            alignItems: "center",
          }}
        >
          <View className="items-center gap-6">
            <View className="w-25 h-25 rounded-full items-center justify-center border-[3px] border-[#FFFFFF]/20">
              <Ionicons name="checkmark-outline" size={48} color="#FFFFFF" />
            </View>

            <View className="items-center gap-3 px-2">
              <Text
                className="text-h2 leading-8.25 text-center text-white"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
              >
                Setup Complete. Let's Track Smarter!
              </Text>
              <Text
                className="text-body-sm leading-4.5 text-center text-white/70"
                style={{ fontFamily: ONBOARDING_FONT_FAMILY.regular }}
              >
                Setup done. Time to stay on top of your finances effortlessly
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleGoToDashboard}
            className="h-14 w-full rounded-full items-center justify-center bg-[#1C3E38]"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text
              className="text-body-lg font-bold text-white"
              style={{ fontFamily: ONBOARDING_FONT_FAMILY.bold }}
            >
              Go to Dashboard
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
