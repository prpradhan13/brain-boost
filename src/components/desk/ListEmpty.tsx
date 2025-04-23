import { View, Text } from "react-native";
import React from "react";

interface ListEmptyProps {
  title?: string;
}

const ListEmpty = ({ title }: ListEmptyProps) => {
  return (
    <View className="w-full h-32 justify-center items-center border-2 border-gray-700 rounded-xl bg-gray-800">
      <Text className="text-white text-lg font-semibold mb-2">
        {title || "No items found."}
      </Text>
    </View>
  );
};

export default ListEmpty;
