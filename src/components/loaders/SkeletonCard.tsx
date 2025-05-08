import { View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue,
  withSequence,
  withDelay
} from "react-native-reanimated";

const SkeletonCard = () => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="bg-white/10 border border-white/20 p-4 rounded-xl w-80 min-h-32 justify-between">
      <View className="space-y-3">
        <Animated.View 
          style={animatedStyle}
          className="h-6 bg-white/20 rounded-lg w-3/4"
        />
        <Animated.View 
          style={animatedStyle}
          className="h-4 bg-white/20 rounded-lg w-1/2"
        />
        <Animated.View 
          style={animatedStyle}
          className="h-4 bg-white/20 rounded-lg w-2/3"
        />
      </View>
      <Animated.View 
        style={animatedStyle}
        className="h-4 bg-white/20 rounded-lg w-1/4 mt-4"
      />
    </View>
  );
};

export default SkeletonCard;
