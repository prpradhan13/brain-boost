import { View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButtons from "./TabBarButtons";
import { icons } from "@/src/constants/Icons";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View className="flex-row justify-between items-center bg-[#212121] mx-20 py-4 rounded-full absolute bottom-4 left-0 right-0">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const rawLabel =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const label = typeof rawLabel === "string" ? rawLabel : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButtons
            key={route.name}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            routeName={route.name as keyof typeof icons}
            label={label}
          />
        );
      })}
    </View>
  );
};

export default TabBar;
