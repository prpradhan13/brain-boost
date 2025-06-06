import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface FlashCardProps {
  flashCardItem: {
    question: string;
    answer: string;
  };
}

const FlashCard = ({ flashCardItem }:  FlashCardProps) => {
  const spin = useSharedValue(0);
  const frontStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(spin.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: withTiming(`${spinValue}deg`) }],
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(spin.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: withTiming(`${spinValue}deg`) }],
    };
  });

  return (
    <View>
      <Animated.View
        style={[
          {
            backgroundColor: "#212121",
            borderRadius: 16,
            minHeight: 240,
            width: 340,
            position: "absolute",
            overflow: "hidden",
          },
          frontStyle,
        ]}
      >
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text className="text-white text-lg font-semibold">
            {flashCardItem.question}
          </Text>
        </ScrollView>
        <Pressable
          className="bg-[#f50] w-full absolute bottom-0 py-3"
          onPress={() => (spin.value = spin.value === 0 ? 1 : 0)}
        >
          <Text className="text-[#fff] text-center text-lg font-medium">
            Answer
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[
          {
            backgroundColor: "#212121",
            borderRadius: 16,
            minHeight: 240,
            width: 340,
            backfaceVisibility: "hidden",
            overflow: "hidden",
          },
          backStyle,
        ]}
      >
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text className="text-white text-lg font-semibold">
            {flashCardItem.answer}
          </Text>
        </ScrollView>
        <Pressable
          className="bg-[#f50] w-full absolute bottom-0 py-3"
          onPress={() => (spin.value = spin.value === 0 ? 1 : 0)}
        >
          <Text className="text-[#fff] text-center text-lg font-medium">
            Hide
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default FlashCard;
