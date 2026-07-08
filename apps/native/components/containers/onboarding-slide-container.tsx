import {
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  View,
} from "react-native";
import OnboardingContentCard from "../base/onboarding-content-card";
import OnboardingNextButton from "../base/onboarding-next-button";

interface OnboardingSlideContainerProps {
  imageSource: ImageSourcePropType;
  title: string;
  description: string;
  onNext: () => void;
  bottomInset: number;
}

const DESIGN_SIZE = {
  width: 393,
  height: 852,
  imageWidth: 350,
  imageHeight: 490,
  imageTop: 64,
  cardTop: 493,
  headingTop: 85,
  headingWidth: 327,
  buttonSpacingTop: 31,
  buttonTop: 226,
  headingOffsetForButton: 110,
} as const;

export default function OnboardingSlideContainer({
  imageSource,
  title,
  description,
  onNext,
  bottomInset,
}: OnboardingSlideContainerProps) {
  const { width, height } = useWindowDimensions();
  const scaleX = width / DESIGN_SIZE.width;
  const scaleY = height / DESIGN_SIZE.height;

  const imageWidth = DESIGN_SIZE.imageWidth * scaleX;
  const imageHeight = DESIGN_SIZE.imageHeight * scaleY;
  const imageTop = DESIGN_SIZE.imageTop * scaleY;
  const cardTop = DESIGN_SIZE.cardTop * scaleY;
  const cardHeight = Math.max(280, height - cardTop);
  const headingTop = DESIGN_SIZE.headingTop * scaleY;
  const headingWidth = Math.max(width - 40, DESIGN_SIZE.headingWidth * scaleX);
  const buttonSpacingTop = DESIGN_SIZE.buttonSpacingTop * scaleY;
  const buttonTop = DESIGN_SIZE.buttonTop * scaleY;

  return (
    <View className="flex-1 bg-brand-green-500">
      <Image
        source={imageSource}
        resizeMode="contain"
        style={{
          position: "absolute",
          top: imageTop,
          left: (width - imageWidth) / 2,
          width: imageWidth,
          height: imageHeight,
        }}
      />

      <View style={{ marginTop: cardTop, height: cardHeight }}>
        <OnboardingContentCard
          title={title}
          description={description}
          headingTop={headingTop}
          headingWidth={headingWidth}
          bottomInset={bottomInset}
        >
          <View
            style={{
              marginTop: Math.max(
                buttonSpacingTop,
                buttonTop - headingTop - DESIGN_SIZE.headingOffsetForButton,
              ),
            }}
          >
            <OnboardingNextButton onPress={onNext} />
          </View>
        </OnboardingContentCard>
      </View>
    </View>
  );
}
