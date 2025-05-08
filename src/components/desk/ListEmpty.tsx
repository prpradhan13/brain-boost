import { View, Text } from "react-native";
import React from "react";

interface ListEmptyProps {
  title?: string;
  description?: string;
}

const ListEmpty = ({ title, description }: ListEmptyProps) => {
  return (
    <View className="w-full h-32 justify-center items-center border-2 border-indigo-500/20 rounded-xl bg-indigo-950/30">
      <Text className="text-indigo-200 text-lg font-semibold mb-2">
        {title || "No items found."}
      </Text>
      {description && (
        <Text className="text-indigo-300/70 text-sm text-center px-4">
          {description}
        </Text>
      )}
    </View>
  );
};

export default ListEmpty;
