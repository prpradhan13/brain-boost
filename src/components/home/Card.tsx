import { View, Text, Pressable } from "react-native";
import React from "react";
import dayjs from "dayjs";

const Card = ({
  title,
  description,
  date,
  onPress,
}: {
  title: string;
  description?: string;
  date: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#1e1e1e] rounded-2xl p-4 w-80 shadow-md shadow-black"
      style={{
        elevation: 5,
      }}
    >
      <Text className="text-xl font-semibold text-white">{title}</Text>
      {description && (
        <Text className="text-sm text-[#b0b0b0] mt-1" numberOfLines={2}>
          {description}
        </Text>
      )}
      <Text className="text-xs text-gray-400 mt-4">
        {dayjs(date).format("DD MMM YYYY")}
      </Text>
    </Pressable>
  );
};

export default Card;
