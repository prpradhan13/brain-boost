import { Text, Pressable } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { icons } from "@/src/constants/Icons";

interface TabBarButtonsProps {
    isFocused: boolean;
    onPress: () => void;
    onLongPress: () => void;
    label: string;
    routeName: keyof typeof icons;
}

const TabBarButtons = ({ isFocused, label, onLongPress, onPress, routeName }: TabBarButtonsProps) => {
    const { colors } = useTheme();
  
    return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center gap-2"
    >
      {icons[routeName]({
        color: isFocused ? colors.primary : colors.text,
      })}
      <Text style={{ color: isFocused ? colors.primary : colors.text }} className="capitalize font-medium">
        {label}
      </Text>
    </Pressable>
  );
};

export default TabBarButtons;
