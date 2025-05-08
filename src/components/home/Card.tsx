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
      className="bg-indigo-950/50 rounded-2xl p-4 w-80 shadow-md shadow-indigo-500/10 border border-indigo-500/20"
      style={{
        elevation: 5,
      }}
    >
      <Text className="text-xl font-semibold text-indigo-200">{title}</Text>
      {description && (
        <Text className="text-sm text-indigo-300/70 mt-1" numberOfLines={2}>
          {description}
        </Text>
      )}
      <Text className="text-xs text-indigo-400/50 mt-4">
        {dayjs(date).format("DD MMM YYYY")}
      </Text>
    </Pressable>
  );
};

export default Card;
