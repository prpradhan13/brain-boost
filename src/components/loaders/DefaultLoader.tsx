import { View, ActivityIndicator } from "react-native";
import React from "react";

const DefaultLoader = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default DefaultLoader;
